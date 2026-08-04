import "server-only";

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
// out of every deploy, and always serves whatever the pinned release holds.
// Bump this when a new release ships; path and filename both carry the
// version, so a stale value 404s instead of serving an old build.
const UPSTREAM =
  "https://github.com/meimodev/satset/releases/download/v1.0.2/satset-1.0.2.apk";
const FILENAME = "satset.apk";

export async function GET(request: NextRequest) {
  // Forwarded so Chrome can resume a dropped transfer instead of restarting
  // 113 MB. GitHub's asset host honours Range on every fresh redirect chain.
  const range = request.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(UPSTREAM, {
      headers: range ? { range } : undefined,
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return new Response("Upstream fetch failed.", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream unavailable.", { status: 502 });
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
