import { describe, expect, it } from "vitest";
import { generateRedirectCode, isRedirectCode, normalizeDestinationUrl } from "./redirect-link";

describe("normalizeDestinationUrl", () => {
  it("adds https to a bare domain", () => {
    expect(normalizeDestinationUrl(" g.page/r/abc ")).toBe("https://g.page/r/abc");
  });

  it("keeps allowed schemes", () => {
    for (const url of ["https://a.co/", "http://a.co/", "mailto:a@b.co", "tel:+62811", "whatsapp://send?phone=1"]) {
      expect(normalizeDestinationUrl(url)).not.toBeNull();
    }
  });

  it("rejects script-bearing and unknown schemes", () => {
    expect(normalizeDestinationUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeDestinationUrl("data:text/html,<script>")).toBeNull();
    expect(normalizeDestinationUrl("file:///etc/passwd")).toBeNull();
  });

  it("rejects empty input", () => {
    expect(normalizeDestinationUrl("   ")).toBeNull();
  });
});

describe("redirect codes", () => {
  it("generates codes that pass their own validator", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(isRedirectCode(generateRedirectCode())).toBe(true);
    }
  });

  it("rejects anything that is not 8 lowercase hex chars", () => {
    expect(isRedirectCode("1234")).toBe(false);
    expect(isRedirectCode("ABCDEF12")).toBe(false);
    expect(isRedirectCode("abcdef123")).toBe(false);
  });
});
