import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/session-secret";

export function getInvitationAdminSessionCookieName(): string {
  return "inv_admin_session";
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  };
}

export async function createInvitationAdminSessionCookieValue(): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("Configure SESSION_SECRET with at least 32 characters.");
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 12; // 12 hours

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(secret));
}

export async function isInvitationAdminSessionValid(cookieValue?: string): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret || !cookieValue) return false;
  try {
    const { payload } = await jwtVerify(cookieValue, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
