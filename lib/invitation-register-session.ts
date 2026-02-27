import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "invitation_register_session";
const COOKIE_TTL_SECONDS = 60 * 60 * 12;
const SIGNING_PREFIX = "invitation-register:";

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signValue(payload: string, secret: string): string {
  return base64UrlEncode(createHmac("sha256", secret).update(payload).digest());
}

export function getInvitationRegisterSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createInvitationRegisterSessionCookieValue(): string {
  const secret = process.env.INVITATION_REGISTER_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: INVITATION_REGISTER_SESSION_SECRET");
  }

  const expire = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const payload = `${SIGNING_PREFIX}${expire}`;
  const signature = signValue(payload, secret);
  return `${expire}.${signature}`;
}

export function isInvitationRegisterSessionValid(value: string | undefined | null): boolean {
  if (!value) return false;

  const secret = process.env.INVITATION_REGISTER_SESSION_SECRET;
  if (!secret) return false;

  const [expireRaw, signature] = value.split(".");
  if (!expireRaw || !signature) return false;

  const expire = Number.parseInt(expireRaw, 10);
  if (!Number.isFinite(expire) || expire <= 0) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now > expire) return false;

  const payload = `${SIGNING_PREFIX}${expire}`;
  const expected = signValue(payload, secret);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
