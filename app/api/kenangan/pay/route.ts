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
  // Accept a single `photoId` (lightbox) or a `photoIds` batch (grid select).
  const rawIds: unknown[] = Array.isArray(body?.photoIds)
    ? body.photoIds
    : typeof body?.photoId === "string"
      ? [body.photoId]
      : [];
  const photoIds = [...new Set(rawIds.filter((id): id is string => typeof id === "string" && PHOTO_ID_REGEX.test(id)))];
  if (!eventId || photoIds.length === 0) {
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

  // Photos already covered by a pending order — don't stack duplicates.
  const pending = await db
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .where("status", "==", "pending")
    .get();
  const pendingIds = new Set<string>();
  for (const doc of pending.docs) {
    const ids = doc.data().photoIds;
    if (Array.isArray(ids)) for (const id of ids) pendingIds.add(id as string);
  }

  const photosCol = eventRef.collection("photos");
  const snaps = await db.getAll(...photoIds.map((id) => photosCol.doc(id)));
  const eligible = snaps
    .filter((s) => s.exists && !s.data()!.paid && !pendingIds.has(s.id))
    .map((s) => s.id);

  if (eligible.length === 0) {
    return NextResponse.json({ ok: true, count: 0, skipped: "nothing eligible" });
  }

  await db.collection("kenanganOrders").add({
    eventId,
    kind: "enhancement",
    photoIds: eligible,
    amountIdr: eligible.length * KENANGAN_ENHANCE_PRICE_IDR,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, count: eligible.length });
}
