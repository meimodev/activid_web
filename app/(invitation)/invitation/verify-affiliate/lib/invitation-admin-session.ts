import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_SECRET = process.env.INVITATION_REGISTER_SESSION_SECRET;
const encodedKey = new TextEncoder().encode(SESSION_SECRET || "fallback-secret-do-not-use-in-prod");

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
  if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 12; // 12 hours

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(encodedKey);
}

export async function isInvitationAdminSessionValid(cookieValue?: string): Promise<boolean> {
  if (!cookieValue) return false;
  try {
    const { payload } = await jwtVerify(cookieValue, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
