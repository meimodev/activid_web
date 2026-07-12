import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { verifyKenanganGuestToken } from "@/lib/kenangan-guest-token";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import { isKenanganLutId } from "@/data/kenangan-luts";

const GUEST_SESSION_ID_REGEX = /^[A-Za-z0-9_-]{10,64}$/;
const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;
const HOST_PAGE_SIZE = 60;

async function requireHostAccess(eventId: string): Promise<NextResponse | null> {
  const session = await getKenanganHostSession();
  if (!session || (!session.isAdmin && session.subject !== eventId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Host-only: list photos (all statuses) for moderation/curation, cursor-paged. */
export async function GET(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const eventId = request.nextUrl.searchParams.get("eventId") ?? "";
  const after = request.nextUrl.searchParams.get("after");
  if (!eventId) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const denied = await requireHostAccess(eventId);
  if (denied) return denied;

  let query = getAdminDb()
    .collection("kenanganEvents")
    .doc(eventId)
    .collection("photos")
    .orderBy("createdAt", "desc")
    .limit(HOST_PAGE_SIZE);
  const afterMs = Number(after);
  if (after && Number.isFinite(afterMs)) {
    query = query.startAfter(Timestamp.fromMillis(afterMs));
  }

  const snap = await query.get();
  const photos = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      status: data.status,
      originalPath: data.originalPath,
      lutId: data.lutId,
      createdAtMs: (data.createdAt as Timestamp | undefined)?.toMillis() ?? 0,
    };
  });

  return NextResponse.json({
    photos,
    hasMore: snap.docs.length === HOST_PAGE_SIZE,
  });
}

/** Host-only: moderation / keeper curation status changes. */
export async function PATCH(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  const status = typeof body?.status === "string" ? body.status : "";

  if (!eventId || !PHOTO_ID_REGEX.test(photoId) || !["live", "hidden", "keeper"].includes(status)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const denied = await requireHostAccess(eventId);
  if (denied) return denied;

  const ref = getAdminDb()
    .collection("kenanganEvents")
    .doc(eventId)
    .collection("photos")
    .doc(photoId);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  }
  await ref.update({ status });
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const guestSessionId = typeof body?.guestSessionId === "string" ? body.guestSessionId : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  const lutId = body?.lutId;
  const width = Number(body?.width);
  const height = Number(body?.height);

  if (
    !token ||
    !GUEST_SESSION_ID_REGEX.test(guestSessionId) ||
    !PHOTO_ID_REGEX.test(photoId) ||
    !isKenanganLutId(lutId) ||
    !Number.isInteger(width) || width <= 0 || width > 12000 ||
    !Number.isInteger(height) || height <= 0 || height > 12000
  ) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const claims = await verifyKenanganGuestToken(token);
  if (!claims) {
    return NextResponse.json(
      { error: "Tautan tidak valid atau sudah kedaluwarsa." },
      { status: 401 },
    );
  }

  const db = getAdminDb();
  const eventRef = db.collection("kenanganEvents").doc(claims.eventId);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists || eventSnap.data()?.status !== "live") {
    return NextResponse.json(
      { error: "Acara tidak sedang menerima foto." },
      { status: 403 },
    );
  }

  // Path derived server-side (never trusted from the client) and matches
  // what upload-auth signed for this photoId.
  const originalPath = `/kenangan/${claims.eventId}/${photoId}.jpg`;

  try {
    await eventRef.collection("photos").doc(photoId).create({
      guestSessionId,
      lutId,
      originalPath,
      status: "live",
      width,
      height,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch {
    // create() throws if the doc exists — double commit, treat as success.
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
