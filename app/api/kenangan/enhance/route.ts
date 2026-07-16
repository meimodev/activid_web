import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { enqueueKenanganEnhance, kenanganWebhookOrigin } from "@/lib/kenangan-enhance";
import { isKenanganPublished } from "@/types/kenangan";

// Kicking off one Replicate prediction is fast; the enhancement runs async and
// the webhook stores the result.
export const maxDuration = 60;

const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;

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

  const webhookOrigin = kenanganWebhookOrigin(request.nextUrl.origin)!;
  try {
    await enqueueKenanganEnhance(eventId, photoId, photo.originalPath as string, webhookOrigin);
  } catch (err) {
    console.error(`kenangan enhance: photo ${photoId} enqueue failed`, err);
    return NextResponse.json({ error: "Gagal memulai peningkatan." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
