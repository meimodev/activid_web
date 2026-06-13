# 2. Invitation Catalog keeps live-iframe previews, but capped, static, and stripped

Date: 2026-06-13

## Status

Accepted

## Context

The Invitation Catalog (`/invitation`) shows a grid of template cards. Each
card previewed its template by mounting a **live `<iframe>`** pointing at the
real `/invitation/{slug}` page, and ran a per-iframe `requestAnimationFrame`
loop that drove cross-document `scrollTo` every frame to auto-scroll through
the invitation.

On mobile this was unusable. Worst case, ~14 cards meant up to **14 full
invitation apps booting at once** (each its own framer-motion runtime, lazy
template chunk, and — via the `-demo` fallback URL — the `InvitationDemoPlayground`
sidebar + music), plus **~14 parallel rAF loops** thrashing the main thread and
compositor. Stacked on top: large animated blurs (`blur-[120px]` surfaces
animating `scale`/`opacity`), a fullscreen `mix-blend-overlay` noise layer, and
`backdrop-blur` on sticky/scrolling chrome.

The obvious alternative was to drop live previews entirely and render static
screenshots (or the existing per-template cover `.mp4`s) as plain `<img>`/`<video>`.
That is the cheapest possible card, but it sacrifices fidelity (themes/purpose
combinations render live today) and freshness (screenshots go stale as templates
evolve), and adds an asset-generation pipeline to maintain.

## Decision

Keep the live-iframe previews — they are the product's selling point (real,
current renders) — but make a single live preview cheap and strictly bound how
many exist:

- **Cap concurrency to ~4 live iframes**, the ones nearest the viewport. When a
  card scrolls well out of view its iframe is **unmounted** (back to the
  shimmer/spinner placeholder); scrolling back triggers a brief reload. Live
  cost no longer scales with template count.
- **Drop the auto-scroll.** The per-iframe `requestAnimationFrame` loop is
  removed entirely; previews render a static top-of-page view. Zero rAF loops.
- **`?preview=1` render mode** on `/invitation/{slug}`: for `-demo` slugs this
  bypasses `InvitationDemoPlayground` (the theme/purpose `DemoThemeSidebar` and
  its music-randomisation churn) and renders the bare template. No template
  files are touched. Music stays in the config (it never autoplays inside the
  iframe) because `MusicConfig.url` is required and nulling it risks the 14
  templates.

Independently, the catalog's own paint tax is cut: large blurred
nebulas/gradients are made **static** (painted once, not re-rasterised per
frame), the fullscreen external noise overlay is removed, `backdrop-blur` is
disabled at mobile widths in favour of a solid background, and the whole tree is
wrapped in `<MotionConfig reducedMotion="user">` so framer-motion honours
`prefers-reduced-motion`.

## Consequences

- Worst-case at-once load drops from ~14 full apps + 14 rAF loops + animated
  120px blurs to ≤4 stripped templates, 0 rAF, and static blurs.
- Previews are no longer animated; a card shows a still top-of-invitation view.
  Motion is reserved for the on-click modal / opened invitation.
- Scrolling back to a previously-seen card reloads its iframe (brief shimmer).
- A new `preview` query contract exists on the invitation route; it is internal
  to the catalog and not advertised.
- Templates still render live, so previews stay current with zero asset
  pipeline — the fidelity/freshness win we chose to keep.

## Alternatives considered

- **Static screenshots as `<img>`.** Cheapest cards, but stale-prone and needs a
  screenshot pipeline; loses live theme/purpose fidelity. Rejected.
- **Per-template cover `.mp4` as `<video>`.** Assets already exist, but mobile
  browsers cap concurrent video decoders (~4) and 14 autoplay videos jank
  similarly; still loses live fidelity. Rejected.
- **Thread a `reducedMotion`/`preview` prop into all 14 templates** to freeze
  their internal animations inside previews. Most per-iframe savings, but high
  blast radius (React Compiler, 14 files) for marginal gain once concurrency is
  capped at 4. Deferred.
