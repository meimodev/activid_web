import { webcrypto } from "node:crypto";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSessionSecret } from "./session-secret";
import { createInvitationRegisterSessionCookieValue, isInvitationRegisterSessionValid } from "./invitation-register-session";
import { createInvitationAffiliateSessionCookieValue, isInvitationAffiliateSessionValid } from "./invitation-affiliate-session";
import { createLinkAdminCookieValue, isLinkAdminSessionValid } from "./link-admin-session";
import { isVerifyAdmin, setVerifyAdminSession } from "./verify-admin-session";
import { createInvitationAdminSessionCookieValue, isInvitationAdminSessionValid } from "@/app/(invitation)/invitation/verify-affiliate/lib/invitation-admin-session";
import { createKenanganGuestToken, verifyKenanganGuestToken } from "./kenangan-guest-token";

const cookieValues = vi.hoisted(() => new Map<string, string>());
vi.hoisted(async () => {
  const { TextEncoder } = await import("node:util");
  // jose caches its encoder on import; keep buffers in jsdom's realm.
  vi.stubGlobal("TextEncoder", class extends TextEncoder {
    encode(input?: string) { return Uint8Array.from(super.encode(input)); }
  });
});
vi.mock("next/headers", () => ({ cookies: async () => ({
  get: (name: string) => ({ value: cookieValues.get(name) }),
  set: (name: string, value: string) => cookieValues.set(name, value),
}) }));

beforeEach(() => {
  cookieValues.clear();
  vi.stubEnv("SESSION_SECRET", "shared-signing-secret-with-at-least-32-characters");
  vi.stubEnv("INVITATION_REGISTER_SESSION_SECRET", "legacy-key");
  vi.stubEnv("VERIFY_ADMIN_SESSION_SECRET", "legacy-key");
  vi.stubEnv("KENANGAN_GUEST_TOKEN_SECRET", "legacy-key");
  vi.stubGlobal("crypto", webcrypto);
});
afterEach(() => vi.unstubAllEnvs());
afterAll(() => vi.unstubAllGlobals());

async function issueTokens() {
  await setVerifyAdminSession();
  return {
    register: createInvitationRegisterSessionCookieValue(),
    affiliate: createInvitationAffiliateSessionCookieValue("ABCDEF123456"),
    link: await createLinkAdminCookieValue(),
    admin: await createInvitationAdminSessionCookieValue(),
    guest: await createKenanganGuestToken("event-1", new Date(Date.now() + 60000)),
  };
}

describe("shared application signing secret", () => {
  it("signs every session and guest token using the one shared setting", async () => {
    const tokens = await issueTokens();
    expect(getSessionSecret()).toBe(process.env.SESSION_SECRET);
    expect(isInvitationRegisterSessionValid(tokens.register)).toBe(true);
    expect(isInvitationAffiliateSessionValid(tokens.affiliate, "ABCDEF123456")).toBe(true);
    expect(await isLinkAdminSessionValid(tokens.link)).toBe(true);
    expect(await isInvitationAdminSessionValid(tokens.admin)).toBe(true);
    expect(await isVerifyAdmin()).toBe(true);
    expect(await verifyKenanganGuestToken(tokens.guest)).toEqual({ eventId: "event-1" });
  });

  it("keeps roles and affiliate identities separate even with the same signing key", async () => {
    const tokens = await issueTokens();
    expect(await isInvitationAdminSessionValid(tokens.link)).toBe(false);
    expect(await isLinkAdminSessionValid(tokens.admin)).toBe(false);
    expect(await isLinkAdminSessionValid(tokens.guest)).toBe(false);
    expect(await verifyKenanganGuestToken(tokens.admin)).toBeNull();
    cookieValues.set("verify_admin_session", tokens.link);
    expect(await isVerifyAdmin()).toBe(false);
    expect(isInvitationRegisterSessionValid(tokens.affiliate)).toBe(false);
    expect(isInvitationAffiliateSessionValid(tokens.affiliate, "OTHER1234567")).toBe(false);
  });

  it.each(["", "too-short"])("rejects missing or weak configuration without using legacy secrets: %j", async (secret) => {
    vi.stubEnv("SESSION_SECRET", secret);
    cookieValues.set("verify_admin_session", "invalid-token");
    expect(getSessionSecret()).toBeNull();
    expect(() => createInvitationRegisterSessionCookieValue()).toThrow("SESSION_SECRET");
    expect(() => createInvitationAffiliateSessionCookieValue("ABCDEF123456")).toThrow("SESSION_SECRET");
    await expect(createLinkAdminCookieValue()).rejects.toThrow("SESSION_SECRET");
    await expect(createInvitationAdminSessionCookieValue()).rejects.toThrow("SESSION_SECRET");
    await expect(setVerifyAdminSession()).rejects.toThrow("SESSION_SECRET");
    await expect(createKenanganGuestToken("event-1", new Date())).rejects.toThrow("SESSION_SECRET");
    expect(isInvitationRegisterSessionValid("invalid-token")).toBe(false);
    expect(isInvitationAffiliateSessionValid("invalid-token", "ABCDEF123456")).toBe(false);
    expect(await isLinkAdminSessionValid("invalid-token")).toBe(false);
    expect(await isInvitationAdminSessionValid("invalid-token")).toBe(false);
    expect(await isVerifyAdmin()).toBe(false);
    expect(await verifyKenanganGuestToken("invalid-token")).toBeNull();
  });

  it("invalidates all app-signed tokens when the shared secret changes", async () => {
    const tokens = await issueTokens();
    vi.stubEnv("SESSION_SECRET", "rotated-signing-secret-with-at-least-32-characters");
    expect(isInvitationRegisterSessionValid(tokens.register)).toBe(false);
    expect(isInvitationAffiliateSessionValid(tokens.affiliate, "ABCDEF123456")).toBe(false);
    expect(await isLinkAdminSessionValid(tokens.link)).toBe(false);
    expect(await isInvitationAdminSessionValid(tokens.admin)).toBe(false);
    expect(await isVerifyAdmin()).toBe(false);
    expect(await verifyKenanganGuestToken(tokens.guest)).toBeNull();
  });
});
