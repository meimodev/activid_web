import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { isKenanganPublished, KENANGAN_ENHANCE_PRICE_IDR } from "@/types/kenangan";

export const maxDuration = 30;

const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;

/** Host-only: create a pending per-photo enhancement order (ADR-0008). Admin
 *  confirmation (kenanganConfirmOrder) flips the photo's `paid` flag, which the
 *  enhance route then gates on. Flat Rp 3,000/photo. */
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
      { error: "Tutup acara terlebih dahulu sebelum membeli peningkatan." },
      { status: 409 },
    );
  }

  const photoSnap = await eventRef.collection("photos").doc(photoId).get();
  if (!photoSnap.exists) {
    return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  }
  if (photoSnap.data()!.paid) {
    return NextResponse.json({ ok: true, skipped: "already paid" });
  }

  // One pending order per photo — don't stack duplicates if the host taps twice.
  const pending = await db
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .where("status", "==", "pending")
    .get();
  const already = pending.docs.some((doc) => {
    const ids = doc.data().photoIds;
    return Array.isArray(ids) && ids.includes(photoId);
  });
  if (already) {
    return NextResponse.json({ ok: true, skipped: "already pending" });
  }

  await db.collection("kenanganOrders").add({
    eventId,
    kind: "enhancement",
    photoIds: [photoId],
    amountIdr: KENANGAN_ENHANCE_PRICE_IDR,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
