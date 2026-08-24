import "server-only";

import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "link_admin_session";
const TTL_SECONDS = 60 * 60 * 12;
const ROLE = "link-admin";

function getKey(): Uint8Array | null {
  const secret = process.env.INVITATION_REGISTER_SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function getLinkAdminCookieName(): string {
  return COOKIE_NAME;
}

export function getLinkAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  };
}

export async function createLinkAdminCookieValue(): Promise<string> {
  const key = getKey();
  // No dev fallback secret: an unsigned-in-practice session is worse than a
  // hard failure, and this gate is the only thing in front of link editing.
  if (!key) throw new Error("Missing environment variable: INVITATION_REGISTER_SESSION_SECRET");

  const iat = Math.floor(Date.now() / 1000);
  return new SignJWT({ role: ROLE })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(iat + TTL_SECONDS)
    .sign(key);
}

export async function isLinkAdminSessionValid(cookieValue?: string): Promise<boolean> {
  const key = getKey();
  if (!key || !cookieValue) return false;
  try {
    const { payload } = await jwtVerify(cookieValue, key, { algorithms: ["HS256"] });
    return payload.role === ROLE;
  } catch {
    return false;
  }
}
