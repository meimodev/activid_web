import "server-only";

import { createHmac, randomUUID } from "crypto";
import { customAlphabet } from "nanoid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { verifyKenanganGuestToken } from "@/lib/kenangan-guest-token";

const GUEST_SESSION_ID_REGEX = /^[A-Za-z0-9_-]{10,64}$/;
const MAX_UPLOADS_PER_SESSION = 150;
const photoIdAlphabet = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);

export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const guestSessionId = typeof body?.guestSessionId === "string" ? body.guestSessionId : "";

  if (!token || !GUEST_SESSION_ID_REGEX.test(guestSessionId)) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const claims = await verifyKenanganGuestToken(token);
  if (!claims) {
    return NextResponse.json(
      { error: "Tautan tidak valid atau sudah kedaluwarsa." },
      { status: 401 },
    );
  }

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: "Konfigurasi server belum lengkap." }, { status: 500 });
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

  // Rate limit per guest session; open QR = open upload otherwise.
  const sessionRef = eventRef.collection("guestSessions").doc(guestSessionId);
  const userAgent = request.headers.get("user-agent") ?? "";
  try {
    await db.runTransaction(async (tx) => {
      const sessionSnap = await tx.get(sessionRef);
      const uploadCount = (sessionSnap.data()?.uploadCount as number | undefined) ?? 0;
      if (uploadCount >= MAX_UPLOADS_PER_SESSION) {
        throw new Error("RATE_LIMITED");
      }
      tx.set(
        sessionRef,
        {
          anonId: guestSessionId,
          userAgent,
          uploadCount: uploadCount + 1,
          ...(sessionSnap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
        },
        { merge: true },
      );
    });
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMITED") {
      return NextResponse.json(
        { error: "Batas unggah untuk sesi ini sudah tercapai." },
        { status: 429 },
      );
    }
    throw err;
  }

  const photoId = photoIdAlphabet();
  const ikToken = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60;
  const signature = createHmac("sha1", privateKey)
    .update(`${ikToken}${expire}`)
    .digest("hex");

  return NextResponse.json({
    token: ikToken,
    expire,
    signature,
    publicKey,
    photoId,
    folder: `/kenangan/${claims.eventId}`,
    fileName: `${photoId}.jpg`,
  });
}
