type ReleaseAsset = { name?: unknown; browser_download_url?: unknown };

// Prefer the unversioned release asset and fall back to a versioned APK.
export function pickApkAsset(release: unknown): string | null {
  const assets = (release as { assets?: unknown })?.assets;
  if (!Array.isArray(assets)) return null;

  const apks = (assets as ReleaseAsset[]).filter(
    (asset) =>
      typeof asset?.name === "string" &&
      asset.name.endsWith(".apk") &&
      typeof asset.browser_download_url === "string",
  );
  if (apks.length === 0) return null;

  const exact = apks.find((asset) => asset.name === "satset.apk");
  return (exact ?? apks[0]).browser_download_url as string;
}
