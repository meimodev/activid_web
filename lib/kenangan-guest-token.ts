import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/session-secret";

function getSecret(): Uint8Array {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Configure SESSION_SECRET with at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createKenanganGuestToken(
  eventId: string,
  expiresAt: Date,
): Promise<string> {
  return new SignJWT({ eventId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSecret());
}

export async function verifyKenanganGuestToken(
  token: string,
): Promise<{ eventId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.eventId === "string" ? { eventId: payload.eventId } : null;
  } catch {
    return null;
  }
}
