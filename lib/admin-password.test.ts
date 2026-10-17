import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAdminPassword, matchesAdminPassword } from "./admin-password";

const setCookie = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({ cookies: async () => ({ set: setCookie }) }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("jose", () => ({
  SignJWT: class {
    setProtectedHeader() { return this; }
    setIssuedAt() { return this; }
    setExpirationTime() { return this; }
    async sign() { return "signed-session"; }
  },
  jwtVerify: vi.fn(),
}));

const logins = [
  { name: "invoices", load: async () => (await import("@/app/(main)/verify/manage/actions")).loginVerifyAdmin, redirect: true },
  { name: "links", load: async () => (await import("@/app/link/manage/actions")).loginLinkAdmin },
  { name: "invitation registration", load: async () => (await import("@/app/(invitation)/invitation/register/actions")).verifyInvitationRegisterPassword },
  { name: "affiliate approval", load: async () => (await import("@/app/(invitation)/invitation/verify-affiliate/actions")).verifyAdminPassword },
];

beforeEach(() => {
  setCookie.mockClear();
  vi.stubEnv("ADMIN_PASSWORD", "one-project-password");
  vi.stubEnv("SESSION_SECRET", "s".repeat(32));
});
afterEach(() => vi.unstubAllEnvs());

describe("shared admin password", () => {
  it("reads only the shared setting and compares exact passwords", () => {
    expect(getAdminPassword()).toBe("one-project-password");
    expect(matchesAdminPassword("one-project-password")).toBe(true);
    for (const value of ["wrong", " one-project-password", "", null, undefined, 123]) {
      expect(matchesAdminPassword(value)).toBe(false);
    }
    vi.stubEnv("ADMIN_PASSWORD", "");
    vi.stubEnv("INVITATION_ADMIN_PASSWORD", "legacy-password");
    vi.stubEnv("LINK_ADMIN_PASSWORD", "legacy-password");
    vi.stubEnv("VERIFY_ADMIN_PASSWORD", "legacy-password");
    expect(getAdminPassword()).toBeNull();
    expect(matchesAdminPassword("legacy-password")).toBe(false);
    expect(matchesAdminPassword("")).toBe(false);
  });

  it.each(logins)("authenticates $name with the single project password", async ({ load, redirect }) => {
    const login = await load();
    const form = new FormData();
    form.set("password", "one-project-password");
    if (redirect) {
      await expect(login({}, form)).rejects.toThrow("REDIRECT:/verify/manage");
    } else {
      expect(await login({}, form)).toEqual({ ok: true });
    }
    expect(setCookie).toHaveBeenCalled();
  });

  it.each(logins)("rejects incorrect or missing configuration for $name", async ({ load }) => {
    const login = await load();
    const form = new FormData();
    form.set("password", "wrong-password");
    expect(await login({}, form)).toHaveProperty("error");
    vi.stubEnv("ADMIN_PASSWORD", "");
    form.set("password", "one-project-password");
    expect(await login({}, form)).toHaveProperty("error");
    expect(setCookie).not.toHaveBeenCalled();
  });
});
