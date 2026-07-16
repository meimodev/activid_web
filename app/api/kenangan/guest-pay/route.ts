import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { getKenanganEventBySlug, isKenanganEnabled } from "@/lib/kenangan-event";
import { isKenanganPublished, KENANGAN_ENHANCE_PRICE_IDR } from "@/types/kenangan";

export const maxDuration = 30;

const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;
const MAX_BATCH = 200;

/**
 * Public guest self-pay (ADR-0008). Any visitor to the closed public gallery
 * may order enhancement for unpaid photos — no identity, no login. Creates a
 * pending order (`paidBy: "guest"`); an admin confirms it at the payments desk,
 * which flips the photos to `paid` and auto-enqueues the enhance. Open by
 * design: a pending order costs nothing until an admin confirms it.
 */
export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const rawIds: unknown[] = Array.isArray(body?.photoIds) ? body.photoIds : [];
  const photoIds = [
    ...new Set(rawIds.filter((id): id is string => typeof id === "string" && PHOTO_ID_REGEX.test(id))),
  ].slice(0, MAX_BATCH);
  if (!slug || photoIds.length === 0) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const event = await getKenanganEventBySlug(slug);
  if (!event) {
    return NextResponse.json({ error: "Acara tidak ditemukan." }, { status: 404 });
  }
  if (!isKenanganPublished(event.status)) {
    return NextResponse.json({ error: "Galeri belum tersedia." }, { status: 409 });
  }

  const db = getAdminDb();
  const eventRef = db.collection("kenanganEvents").doc(event.id);

  // Photos already covered by a pending order — don't stack duplicates.
  const pending = await db
    .collection("kenanganOrders")
    .where("eventId", "==", event.id)
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
    .filter((s) => s.exists && s.data()!.status !== "hidden" && !s.data()!.paid && !pendingIds.has(s.id))
    .map((s) => s.id);

  if (eligible.length === 0) {
    return NextResponse.json({ ok: true, count: 0, skipped: "nothing eligible" });
  }

  await db.collection("kenanganOrders").add({
    eventId: event.id,
    kind: "enhancement",
    photoIds: eligible,
    paidBy: "guest",
    amountIdr: eligible.length * KENANGAN_ENHANCE_PRICE_IDR,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ ok: true, count: eligible.length });
}
