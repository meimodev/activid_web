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
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const snap = await getAdminDb().collection("kenanganEvents").doc(eventId).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (!canAccessEvent(session, snap.data()?.ownerUid as string | undefined)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    folder: `/kenangan/${eventId}`,
    fileName: `cover-${Date.now()}.jpg`,
  });
}
