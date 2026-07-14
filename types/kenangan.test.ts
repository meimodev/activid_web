import { describe, expect, it } from "vitest";
import { kenanganOrderKind } from "./kenangan";

describe("kenanganOrderKind", () => {
  it("classifies paket orders", () => {
    expect(kenanganOrderKind({ kind: "paket" })).toBe("paket");
  });

  it("classifies explicit enhancement orders", () => {
    expect(kenanganOrderKind({ kind: "enhancement" })).toBe("enhancement");
  });

  it("treats a legacy order with no kind as enhancement", () => {
    // Orders written before the paket split have no `kind`; the gate must not
    // mistake one for a paket payment. See ADR-0005.
    expect(kenanganOrderKind({})).toBe("enhancement");
  });

  it("treats an unknown kind as enhancement, never paket", () => {
    expect(kenanganOrderKind({ kind: "junk" })).toBe("enhancement");
  });
});
