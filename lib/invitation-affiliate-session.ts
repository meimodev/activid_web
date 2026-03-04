import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "invitation_affiliate_session";
const COOKIE_TTL_SECONDS = 60 * 60 * 12;
const SIGNING_PREFIX = "invitation-affiliate:";

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

export function getInvitationAffiliateSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createInvitationAffiliateSessionCookieValue(affiliateId: string): string {
  const secret = process.env.INVITATION_REGISTER_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: INVITATION_REGISTER_SESSION_SECRET");
  }

  const expire = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const payload = `${SIGNING_PREFIX}${affiliateId}:${expire}`;
  const signature = signValue(payload, secret);
  return `${affiliateId}.${expire}.${signature}`;
}

export function isInvitationAffiliateSessionValid(
  value: string | undefined | null,
  expectedAffiliateId: string,
): boolean {
  if (!value) return false;

  const secret = process.env.INVITATION_REGISTER_SESSION_SECRET;
  if (!secret) return false;

  const [affiliateId, expireRaw, signature] = value.split(".");
  if (!affiliateId || !expireRaw || !signature) return false;
  if (affiliateId !== expectedAffiliateId) return false;

  const expire = Number.parseInt(expireRaw, 10);
  if (!Number.isFinite(expire) || expire <= 0) return false;

  const now = Math.floor(Date.now() / 1000);
  if (now > expire) return false;

  const payload = `${SIGNING_PREFIX}${affiliateId}:${expire}`;
  const expected = signValue(payload, secret);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
