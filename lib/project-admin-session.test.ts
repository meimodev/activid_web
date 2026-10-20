import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";
import { webcrypto } from "node:crypto";

vi.hoisted(async () => {
  const { TextEncoder } = await import("node:util");
  vi.stubGlobal("TextEncoder", class extends TextEncoder {
    encode(input?: string) { return Uint8Array.from(super.encode(input)); }
  });
});

const store = vi.hoisted(() => ({ value: "", options: {} as Record<string, unknown> }));
vi.mock("next/headers", () => ({ cookies: async () => ({
  get: () => store.value ? { value: store.value } : undefined,
  set: (_name: string, value: string, options: Record<string, unknown>) => { store.value = value; store.options = options; },
}) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));

import { clearProjectAdminSession, isProjectAdmin, setProjectAdminSession } from "./project-admin-session";
import { loginProjectAdmin } from "@/app/project/actions";

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto);
  store.value = "";
  store.options = {};
  vi.stubEnv("SESSION_SECRET", "project-test-signing-key-with-at-least-32-characters");
  vi.stubEnv("ADMIN_PASSWORD", "test-only-admin-password");
});
afterEach(() => vi.unstubAllEnvs());
afterAll(() => vi.unstubAllGlobals());

describe("internal project access", () => {
  it("fails closed with missing configuration, forged cookies, or expired tokens", async () => {
    expect(await isProjectAdmin()).toBe(false);
    store.value = "forged-cookie";
    expect(await isProjectAdmin()).toBe(false);
    store.value = await new SignJWT({ role: "project-admin" }).setProtectedHeader({ alg: "HS256" }).setAudience("project-admin").setExpirationTime(1).sign(new TextEncoder().encode(process.env.SESSION_SECRET));
    expect(await isProjectAdmin()).toBe(false);
    vi.stubEnv("SESSION_SECRET", "");
    expect(await isProjectAdmin()).toBe(false);
    await expect(setProjectAdminSession()).rejects.toThrow("SESSION_SECRET");
  });

  it("issues a scoped, expiring staff cookie and clears access on sign-out", async () => {
    await setProjectAdminSession();
    expect(await isProjectAdmin()).toBe(true);
    expect(store.options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/project", maxAge: 43200 });
    vi.stubEnv("SESSION_SECRET", "a-different-signing-key-with-at-least-32-characters");
    expect(await isProjectAdmin()).toBe(false);
    await clearProjectAdminSession();
    expect(store.value).toBe("");
    expect(store.options.maxAge).toBe(0);
  });

  it("rejects other roles and audiences even when the signature is valid", async () => {
    store.value = await new SignJWT({ role: "verify-admin" }).setProtectedHeader({ alg: "HS256" }).setAudience("project-admin").setExpirationTime("1h").sign(new TextEncoder().encode(process.env.SESSION_SECRET));
    expect(await isProjectAdmin()).toBe(false);
    store.value = await new SignJWT({ role: "project-admin" }).setProtectedHeader({ alg: "HS256" }).setAudience("another-app").setExpirationTime("1h").sign(new TextEncoder().encode(process.env.SESSION_SECRET));
    expect(await isProjectAdmin()).toBe(false);
  });

  it("creates a session only after the configured staff password matches", async () => {
    const form = new FormData();
    form.set("password", "incorrect");
    expect(await loginProjectAdmin({}, form)).toEqual({ error: "Incorrect password." });
    expect(store.value).toBe("");
    form.set("password", "test-only-admin-password");
    await expect(loginProjectAdmin({}, form)).rejects.toThrow("redirect:/project");
    expect(await isProjectAdmin()).toBe(true);
  });
});
