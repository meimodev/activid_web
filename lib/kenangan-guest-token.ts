import "server-only";

import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.KENANGAN_GUEST_TOKEN_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: KENANGAN_GUEST_TOKEN_SECRET");
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
