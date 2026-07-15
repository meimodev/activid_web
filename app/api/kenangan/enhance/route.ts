import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { kenanganOriginalUrl } from "@/lib/kenangan-enhance";
import { isKenanganPublished } from "@/types/kenangan";

// Kicking off one Replicate prediction is fast; the enhancement runs async and
// the webhook stores the result.
export const maxDuration = 60;

const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;

// nightmareai/real-esrgan — used restoration-only (scale 1, no face restore).
// Fixes lighting (via the re-applied LUT) and deblurs/sharpens; no upscale, no
// generative face enhancement per spec §6.
const DEFAULT_REPLICATE_VERSION =
  "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

async function createReplicatePrediction(
  imageUrl: string,
  eventId: string,
  photoId: string,
  webhookOrigin: string,
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN!;
  const version = process.env.KENANGAN_REPLICATE_VERSION || DEFAULT_REPLICATE_VERSION;
  const webhook = `${webhookOrigin}/api/kenangan/replicate/webhook?eventId=${eventId}&photoId=${photoId}`;

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input: { image: imageUrl, scale: 1, face_enhance: false },
      webhook,
      webhook_events_filter: ["completed"],
    }),
  });
  if (!res.ok) {
    throw new Error(`Replicate prediction failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

/** Host-only: enhance a single photo on demand (ADR-0007). Enqueues one
 *  Replicate prediction; the webhook swaps in `enhancedPath` on completion. */
export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  if (!eventId || !PHOTO_ID_REGEX.test(photoId)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const session = await getKenanganHostSession();
  const db = getAdminDb();
  const eventRef = db.collection("kenanganEvents").doc(eventId);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) {
    return NextResponse.json({ error: "Acara tidak ditemukan." }, { status: 404 });
  }
  const event = eventSnap.data()!;
  if (!canAccessEvent(session, event.ownerUid as string | undefined)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Enhancement is a paid feature and belongs to the post-event curation phase.
  if (!event.enhancementPurchased) {
    return NextResponse.json({ error: "Peningkatan AI belum dibeli." }, { status: 402 });
  }
  if (!isKenanganPublished(event.status as string)) {
    return NextResponse.json(
      { error: "Tutup acara terlebih dahulu sebelum meningkatkan foto." },
      { status: 409 },
    );
  }
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "Peningkatan AI tidak tersedia." }, { status: 503 });
  }

  const photoRef = eventRef.collection("photos").doc(photoId);
  const photoSnap = await photoRef.get();
  if (!photoSnap.exists) {
    return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  }
  const photo = photoSnap.data()!;
  if (photo.enhancedPath) {
    return NextResponse.json({ ok: true, skipped: "already enhanced" });
  }
  if (photo.enhanceState === "pending") {
    return NextResponse.json({ ok: true, skipped: "already pending" });
  }

  const webhookOrigin = process.env.KENANGAN_WEBHOOK_ORIGIN || request.nextUrl.origin;
  let replicateId: string;
  try {
    replicateId = await createReplicatePrediction(
      kenanganOriginalUrl(photo.originalPath as string),
      eventId,
      photoId,
      webhookOrigin,
    );
  } catch (err) {
    console.error(`kenangan enhance: photo ${photoId} enqueue failed`, err);
    return NextResponse.json({ error: "Gagal memulai peningkatan." }, { status: 502 });
  }

  await photoRef.update({ enhanceState: "pending" });
  await eventRef.collection("jobs").doc(photoId).set({
    photoId,
    replicateId,
    status: "pending",
    error: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
