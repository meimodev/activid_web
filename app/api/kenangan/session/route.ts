import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import {
  createKenanganSessionCookie,
  getKenanganHostSessionCookieName,
  getKenanganHostSessionCookieOptions,
} from "@/lib/kenangan-host-session";

/** POST { idToken } → set session cookie + upsert the host account doc. */
export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const idToken = typeof body?.idToken === "string" ? body.idToken : "";
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const ref = getAdminDb().collection("kenanganHosts").doc(decoded.uid);
  const snap = await ref.get();
  await ref.set(
    {
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      photoUrl: decoded.picture ?? null,
      lastLoginAt: FieldValue.serverTimestamp(),
      ...(snap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );

  const cookieValue = await createKenanganSessionCookie(idToken);
  const store = await cookies();
  store.set(
    getKenanganHostSessionCookieName(),
    cookieValue,
    getKenanganHostSessionCookieOptions(),
  );
  return NextResponse.json({ ok: true });
}

/** DELETE → clear the session cookie (logout). */
export async function DELETE() {
  const store = await cookies();
  store.delete(getKenanganHostSessionCookieName());
  return NextResponse.json({ ok: true });
}
