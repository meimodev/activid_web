import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/session-secret";

const COOKIE_NAME = "verify_admin_session";
const TTL_SECONDS = 60 * 60 * 12;

function key(): Uint8Array | null {
  const secret = getSessionSecret();
  return secret ? new TextEncoder().encode(secret) : null;
}

export async function isVerifyAdmin(): Promise<boolean> {
  const secret = key();
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!secret || !token) return false;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.role === "verify-admin";
  } catch {
    return false;
  }
}

export async function setVerifyAdminSession(): Promise<void> {
  const secret = key();
  if (!secret) throw new Error("Configure SESSION_SECRET with at least 32 characters.");
  const token = await new SignJWT({ role: "verify-admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(secret);
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/verify", maxAge: TTL_SECONDS,
  });
}

export async function clearVerifyAdminSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, "", { path: "/verify", maxAge: 0 });
}
