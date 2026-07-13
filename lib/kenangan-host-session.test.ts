import { describe, expect, it } from "vitest";
import { canAccessEvent, type KenanganHostSession } from "./kenangan-host-session";

const host: KenanganHostSession = { uid: "u1", email: "h@x.com", isAdmin: false };
const admin: KenanganHostSession = { uid: "u2", email: "a@x.com", isAdmin: true };

describe("canAccessEvent", () => {
  it("lets the owner in", () => {
    expect(canAccessEvent(host, "u1")).toBe(true);
  });
  it("keeps a non-owner host out", () => {
    expect(canAccessEvent(host, "someone-else")).toBe(false);
  });
  it("lets admin access any event", () => {
    expect(canAccessEvent(admin, "someone-else")).toBe(true);
  });
  it("denies when there is no session", () => {
    expect(canAccessEvent(null, "u1")).toBe(false);
  });
  it("denies an ownerless event for a normal host", () => {
    expect(canAccessEvent(host, undefined)).toBe(false);
  });
});
