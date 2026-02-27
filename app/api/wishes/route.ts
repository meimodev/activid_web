import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type WishRecord = {
  invitationId: string;
  name: string;
  nameKey: string;
  message: string;
  createdAt: Timestamp;
};

type WishLockRecord = {
  invitationId: string;
  nameKey: string;
  wishId: string;
  createdAt: Timestamp;
};

type WishResponse = {
  id: string;
  invitationId: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: number | null;
};

function serializeWish(id: string, data: Partial<WishRecord>): WishResponse {
  return {
    id,
    invitationId: String(data.invitationId ?? ""),
    name: String(data.name ?? ""),
    nameKey: typeof data.nameKey === "string" ? data.nameKey : undefined,
    message: String(data.message ?? ""),
    createdAt: data.createdAt?.toMillis?.() ?? null,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const invitationId = url.searchParams.get("invitationId")?.trim();
  const nameKey = url.searchParams.get("nameKey")?.trim();

  if (!invitationId) {
    return NextResponse.json({ error: "Missing invitationId" }, { status: 400 });
  }

  const db = getAdminDb();

  if (nameKey) {
    const lockId = `${invitationId}_${nameKey}`;
    const lockSnap = await db.collection("wishLocks").doc(lockId).get();
    if (!lockSnap.exists) return NextResponse.json({ wish: null });

    const lock = lockSnap.data() as WishLockRecord;
    if (!lock?.wishId) return NextResponse.json({ wish: null });

    const wishSnap = await db.collection("wishes").doc(lock.wishId).get();
    if (!wishSnap.exists) return NextResponse.json({ wish: null });

    return NextResponse.json({
      wish: serializeWish(wishSnap.id, wishSnap.data() as WishRecord),
    });
  }

  const snaps = await db
    .collection("wishes")
    .where("invitationId", "==", invitationId)
    .get();

  const wishes = snaps.docs
    .map((d) => serializeWish(d.id, d.data() as WishRecord))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  return NextResponse.json({ wishes });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload: Record<string, unknown> =
    typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  const invitationId =
    typeof payload.invitationId === "string" ? payload.invitationId.trim() : "";
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const nameKey = typeof payload.nameKey === "string" ? payload.nameKey.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!invitationId || !name || !nameKey || !message) {
    return NextResponse.json(
      { error: "Missing invitationId, name, nameKey, or message" },
      { status: 400 },
    );
  }

  if (name.length > 80) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }

  if (nameKey.length > 120) {
    return NextResponse.json({ error: "nameKey is too long" }, { status: 400 });
  }

  if (message.length > 800) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const db = getAdminDb();
  const lockId = `${invitationId}_${nameKey}`;
  const lockRef = db.collection("wishLocks").doc(lockId);
  const wishRef = db.collection("wishes").doc();

  const createdAt = Timestamp.now();
  const nextData: WishRecord = {
    invitationId,
    name,
    nameKey,
    message,
    createdAt,
  };

  let existingWishId: string | null = null;
  let createdWishId: string | null = null;

  await db.runTransaction(async (tx) => {
    const lockSnap = await tx.get(lockRef);
    if (lockSnap.exists) {
      const lock = lockSnap.data() as WishLockRecord;
      existingWishId = lock?.wishId ?? null;
      return;
    }

    const lockData: WishLockRecord = {
      invitationId,
      nameKey,
      wishId: wishRef.id,
      createdAt,
    };

    tx.create(wishRef, nextData);
    tx.create(lockRef, lockData);
    createdWishId = wishRef.id;
  });

  if (existingWishId) {
    const snap = await db.collection("wishes").doc(existingWishId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "already-posted", wish: null }, { status: 409 });
    }
    return NextResponse.json(
      { error: "already-posted", wish: serializeWish(snap.id, snap.data() as WishRecord) },
      { status: 409 },
    );
  }

  const finalWishId = createdWishId ?? wishRef.id;
  return NextResponse.json({ wish: serializeWish(finalWishId, nextData) }, { status: 201 });
}
