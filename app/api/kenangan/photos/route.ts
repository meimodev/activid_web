import "server-only";

import { NextResponse, after } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, listKenanganHostPhotos, revalidateKenanganEvent } from "@/lib/kenangan-event";
import { reconcileKenanganEnhances } from "@/lib/kenangan-enhance";
import { verifyKenanganGuestToken } from "@/lib/kenangan-guest-token";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { isKenanganLutId } from "@/data/kenangan-luts";

const GUEST_SESSION_ID_REGEX = /^[A-Za-z0-9_-]{10,64}$/;
const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;

async function requireHostAccess(
  eventId: string,
): Promise<{ error: NextResponse } | { slug: string }> {
  const session = await getKenanganHostSession();
  // One extra doc read per poll to resolve the owner; cheap and keeps authz
  // in one place rather than trusting the client's eventId alone. Returns the
  // slug so a mutating handler can revalidate the guest gallery.
  const snap = await getAdminDb().collection("kenanganEvents").doc(eventId).get();
  const data = snap.data();
  if (!canAccessEvent(session, data?.ownerUid as string | undefined)) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { slug: (data?.slug as string) ?? "" };
}

/** Host-only: list photos (all statuses) for moderation/curation, cursor-paged. */
export async function GET(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const eventId = request.nextUrl.searchParams.get("eventId") ?? "";
  const afterParam = request.nextUrl.searchParams.get("after");
  if (!eventId) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const access = await requireHostAccess(eventId);
  if ("error" in access) return access.error;

  const afterMs = afterParam ? Number(afterParam) : undefined;
  const result = await listKenanganHostPhotos(eventId, afterMs);

  // Webhook-loss fallback: photos stuck "pending" are settled against
  // Replicate directly, after the response — the host's 8s poll picks the
  // result up on its next tick.
  const pendingIds = result.photos
    .filter((p) => p.enhanceState === "pending")
    .map((p) => p.id);
  if (pendingIds.length > 0) {
    after(async () => {
      try {
        if (await reconcileKenanganEnhances(eventId, pendingIds) && access.slug) {
          await revalidateKenanganEvent(access.slug);
        }
      } catch (err) {
        console.error("kenangan reconcile failed", err);
      }
    });
  }

  return NextResponse.json(result);
}

/** Host-only: photo visibility toggle — hide/unhide (ADR-0007). */
export async function PATCH(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  const status = typeof body?.status === "string" ? body.status : "";

  if (!eventId || !PHOTO_ID_REGEX.test(photoId) || !["live", "hidden"].includes(status)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const access = await requireHostAccess(eventId);
  if ("error" in access) return access.error;

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
  // Curation reflects on the published gallery (ADR-0007): bust its cache. The
  // live feed is realtime already, so this only matters after close.
  if (access.slug) await revalidateKenanganEvent(access.slug);
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
