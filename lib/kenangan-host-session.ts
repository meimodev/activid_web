import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "kenangan_host_session";
const COOKIE_TTL_SECONDS = 60 * 60 * 12;
const SIGNING_PREFIX = "kenangan-host:";

/** Session subject: an event id, or "admin" for the admin access code. */
export const KENANGAN_ADMIN_SUBJECT = "admin";

export interface KenanganHostSession {
  subject: string;
  isAdmin: boolean;
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getSecret(): string {
  const secret = process.env.KENANGAN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: KENANGAN_SESSION_SECRET");
  }
  return secret;
}

function signValue(payload: string, secret: string): string {
  return base64UrlEncode(createHmac("sha256", secret).update(payload).digest());
}

export function getKenanganHostSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createKenanganHostSessionCookieValue(subject: string): string {
  const secret = getSecret();
  const expire = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const payload = `${SIGNING_PREFIX}${subject}:${expire}`;
  return `${subject}.${expire}.${signValue(payload, secret)}`;
}

export function parseKenanganHostSession(
  value: string | undefined | null,
): KenanganHostSession | null {
  if (!value) return null;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const [subject, expireRaw, signature] = value.split(".");
  if (!subject || !expireRaw || !signature) return null;

  const expire = Number.parseInt(expireRaw, 10);
  if (!Number.isFinite(expire) || expire <= 0) return null;
  if (Math.floor(Date.now() / 1000) > expire) return null;

  const payload = `${SIGNING_PREFIX}${subject}:${expire}`;
  const expected = signValue(payload, secret);

  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  return { subject, isAdmin: subject === KENANGAN_ADMIN_SUBJECT };
}

export async function getKenanganHostSession(): Promise<KenanganHostSession | null> {
  const store = await cookies();
  return parseKenanganHostSession(store.get(COOKIE_NAME)?.value);
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
