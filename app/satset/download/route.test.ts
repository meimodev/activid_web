import { describe, expect, it } from "vitest";

import { pickApkAsset } from "./route";

// Shape trimmed from the real GET /repos/meimodev/satset/releases/latest
// payload — releases there are hand-uploaded, so asset naming is the part
// most likely to drift.
const asset = (name: string) => ({
  name,
  browser_download_url: `https://github.com/meimodev/satset/releases/download/v1.0.2/${name}`,
});

describe("pickApkAsset", () => {
  it("prefers the unversioned satset.apk over the versioned one", () => {
    const url = pickApkAsset({
      assets: [asset("satset-1.0.2.apk"), asset("satset.apk")],
    });
    expect(url).toBe(
      "https://github.com/meimodev/satset/releases/download/v1.0.2/satset.apk",
    );
  });

  it("falls back to the first .apk when the exact name is missing", () => {
    const url = pickApkAsset({
      assets: [asset("mapping.txt"), asset("satset-1.1.0.apk")],
    });
    expect(url).toBe(
      "https://github.com/meimodev/satset/releases/download/v1.0.2/satset-1.1.0.apk",
    );
  });

  it("returns null for a release with no .apk asset", () => {
    expect(pickApkAsset({ assets: [asset("release-notes.md")] })).toBeNull();
    expect(pickApkAsset({ assets: [] })).toBeNull();
  });

  it("returns null for a malformed payload", () => {
    expect(pickApkAsset({ message: "Not Found" })).toBeNull();
    expect(pickApkAsset(null)).toBeNull();
    expect(pickApkAsset({ assets: [{ name: "satset.apk" }] })).toBeNull();
  });
});
