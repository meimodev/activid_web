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

// openai/gpt-image-2 — generative edit (ADR-0008). Conservative,
// identity-preserving prompt; `medium` quality keeps ~75% margin at the flat
// Rp 3,000/photo price. Runs via the official-model prediction endpoint.
const KENANGAN_ENHANCE_MODEL = "openai/gpt-image-2";
const KENANGAN_ENHANCE_PROMPT =
  "Restore and enhance this event photograph. Improve sharpness, reduce motion " +
  "blur and noise, correct exposure and white balance for natural skin tones, " +
  "and recover detail in shadows and highlights. Preserve the exact composition, " +
  "framing, people, faces, expressions, clothing, and background — do not add, " +
  "remove, reposition, or alter any person or object, and do not change anyone's " +
  "identity or facial features. Keep it fully photorealistic; no stylization, no " +
  "beautification.";

async function createReplicatePrediction(
  imageUrl: string,
  eventId: string,
  photoId: string,
  webhookOrigin: string,
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN!;
  const model = process.env.KENANGAN_REPLICATE_MODEL || KENANGAN_ENHANCE_MODEL;
  const webhook = `${webhookOrigin}/api/kenangan/replicate/webhook?eventId=${eventId}&photoId=${photoId}`;

  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: KENANGAN_ENHANCE_PROMPT,
        input_images: [imageUrl],
        quality: "medium",
        aspect_ratio: "auto",
        background: "opaque",
        output_format: "jpeg",
        output_compression: 90,
        moderation: "low",
        number_of_images: 1,
      },
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
  // Enhancement is paid per-photo (ADR-0008); the legacy event unlock
  // grandfathers old events where photos have no `paid` flag.
  if (!photo.paid && !event.enhancementPurchased) {
    return NextResponse.json({ error: "Foto ini belum dibayar." }, { status: 402 });
  }
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
