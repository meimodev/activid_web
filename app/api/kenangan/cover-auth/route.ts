import "server-only";

import { createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";

/** Signed ImageKit upload token for a host editing their event's cover.
 *  Gated on the Google host session + event ownership (unlike the guest
 *  upload-auth, which is token-scoped and requires a live event). */
export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await getKenanganHostSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";

  // With an eventId: cover for an existing event → verify ownership, folder
  // /kenangan/{eventId}. Without one (create form, no event yet): upload to the
  // host's own staging folder, keyed by the server-side uid so it's a safe
  // per-host boundary. The URL is saved when the event is created; the file
  // stays put (ImageKit serves by URL regardless of folder).
  let folder: string;
  if (eventId) {
    const snap = await getAdminDb().collection("kenanganEvents").doc(eventId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!canAccessEvent(session, snap.data()?.ownerUid as string | undefined)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    folder = `/kenangan/${eventId}`;
  } else {
    folder = `/kenangan/_staging/${session.uid}`;
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "Server is missing ImageKit keys (IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY)." },
      { status: 500 },
    );
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60;
  const signature = createHmac("sha1", privateKey)
    .update(`${token}${expire}`)
    .digest("hex");

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey,
    folder,
    fileName: `cover-${Date.now()}.jpg`,
  });
}
