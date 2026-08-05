import "server-only";

import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
// A 113 MB body over a phone connection outlives the default budget.
export const maxDuration = 300;

// Streamed through our own origin on purpose. Linking the GitHub asset
// directly is what fails on Chrome Android: a tap reaches 100% and never
// finalises, while the same URL via long-press → "open in new tab", or tapped
// from GitHub's own release page, completes. target="_blank", no-target and
// download= were all tried against it and all stalled, so the deciding factor
// is the cross-origin navigation itself. Served from activid.id it is an
// ordinary same-origin download, which also makes the download attribute
// meaningful — it is ignored cross-origin.
//
// Proxying rather than committing the file keeps 113 MB out of the repo and
// out of every deploy.
const REPO = "meimodev/satset";
const API_LATEST = `https://api.github.com/repos/${REPO}/releases/latest`;
// Escape hatch, and the fallback whenever resolution fails: an ordinary HTML
// page, so the cross-origin stall above doesn't apply to it.
const RELEASE_PAGE = `https://github.com/${REPO}/releases/latest`;
const FILENAME = "satset.apk";

type ReleaseAsset = { name?: unknown; browser_download_url?: unknown };

// Releases are hand-uploaded, so the asset filename is a convention rather
// than a guarantee: prefer the unversioned name, fall back to any .apk. Only
// the version-bearing name (satset-1.0.2.apk) is certain to be there.
export function pickApkAsset(release: unknown): string | null {
  const assets = (release as { assets?: unknown })?.assets;
  if (!Array.isArray(assets)) return null;

  const apks = (assets as ReleaseAsset[]).filter(
    (a) =>
      typeof a?.name === "string" &&
      a.name.endsWith(".apk") &&
      typeof a.browser_download_url === "string",
  );
  if (apks.length === 0) return null;

  const exact = apks.find((a) => a.name === FILENAME);
  return (exact ?? apks[0]).browser_download_url as string;
}

// Throws rather than returning null so a transient API failure isn't what
// gets cached for the next hour. /releases/latest already excludes drafts and
// prereleases, which is the intent here.
async function fetchLatestApkUrl(): Promise<string> {
  const response = await fetch(API_LATEST, {
    headers: { accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GitHub releases API returned ${response.status}`);
  }

  const url = pickApkAsset(await response.json());
  if (!url) throw new Error("Latest release carries no .apk asset");
  return url;
}

// The unauthenticated API allows 60 requests/hour per IP, shared across
// Vercel's egress. Hourly revalidation keeps this at ~24 calls a day.
const latestApkUrl = unstable_cache(fetchLatestApkUrl, ["satset-latest-apk"], {
  revalidate: 3600,
});

function fallbackToReleasePage(reason: string): Response {
  console.error(`[satset/download] ${reason} — redirecting to release page`);
  return Response.redirect(RELEASE_PAGE, 302);
}

export async function GET(request: NextRequest) {
  let upstreamUrl: string;
  try {
    upstreamUrl = await latestApkUrl();
  } catch (error) {
    return fallbackToReleasePage(`could not resolve latest APK: ${error}`);
  }

  // Forwarded so Chrome can resume a dropped transfer instead of restarting
  // 113 MB. GitHub's asset host honours Range on every fresh redirect chain.
  const range = request.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrl, {
      headers: range ? { range } : undefined,
      redirect: "follow",
      cache: "no-store",
    });
  } catch (error) {
    return fallbackToReleasePage(`upstream fetch failed: ${error}`);
  }

  if (!upstream.ok || !upstream.body) {
    return fallbackToReleasePage(`upstream returned ${upstream.status}`);
  }

  const headers = new Headers({
    "content-type": "application/vnd.android.package-archive",
    "content-disposition": `attachment; filename="${FILENAME}"`,
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=3600",
  });
  for (const key of ["content-length", "content-range", "etag"]) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
