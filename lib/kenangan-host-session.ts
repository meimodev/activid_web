import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase-admin";

const COOKIE_NAME = "kenangan_host_session";
// Firebase session cookies max out at 14 days; 5 days is a comfortable host TTL.
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 5;

export interface KenanganHostSession {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}

function adminEmails(): string[] {
  return (process.env.KENANGAN_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getKenanganHostSessionCookieName(): string {
  return COOKIE_NAME;
}

export function getKenanganHostSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_TTL_SECONDS,
  };
}

/** Exchange a freshly-minted Firebase ID token for a durable session cookie. */
export async function createKenanganSessionCookie(idToken: string): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: COOKIE_TTL_SECONDS * 1000,
  });
}

export async function getKenanganHostSession(): Promise<KenanganHostSession | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    // ponytail: checkRevoked=false skips a getUser() round-trip per request;
    // pass true here if you start revoking sessions on password/role change.
    const decoded = await getAdminAuth().verifySessionCookie(cookie, false);
    const email = (decoded.email as string | undefined) ?? null;
    const isAdmin = email ? adminEmails().includes(email.toLowerCase()) : false;
    return { uid: decoded.uid, email, isAdmin };
  } catch {
    return null;
  }
}

/** True when a host may read/mutate an event they don't necessarily own. */
export function canAccessEvent(
  session: KenanganHostSession | null,
  ownerUid: string | undefined,
): boolean {
  return !!session && (session.isAdmin || session.uid === ownerUid);
}
