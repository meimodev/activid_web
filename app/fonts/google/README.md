# Bundled Google Fonts

Fonts from the Google Fonts repository, pinned to the commit and upstream
SHA-256 hashes in `sources.json`, then compressed to WOFF2 with FontTools.
All glyphs, variation axes, and embedded names are retained. Output hashes
and the conversion version are recorded alongside the original sources. Each family includes its SIL Open
Font License in `OFL.txt`. `normal.woff2` and `italic.woff2` are local filenames.

Use `next/font/local` in each consuming route/template. Preserve its existing
CSS variable, weights, and styles. Local files keep builds independent of the
Google Fonts API, whose extensionless font URLs break the current Next.js
loader (https://github.com/vercel/next.js/issues/99114).
