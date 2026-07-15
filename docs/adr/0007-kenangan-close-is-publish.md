# 7. KenanganKita: Close is Publish, curation is hide-only, enhancement is per-photo

Date: 2026-07-15

## Status

Accepted. Supersedes the separate publish step introduced with the Host Console
(commit `52bc4c0`) and the curation rework (commit `af9c82a`). Builds on the
upfront Paket charge (ADR-0005) and event links (ADR-0004).

## Context

The current lifecycle is `draft → live → closed → published`, with **two guest
surfaces** and a **manual publish step**:

- **Feed** (`/kenangan/e/[slug]/feed`) — a realtime Firestore listener showing
  every photo except `hidden`, graded client-side (`GradedThumb`). Live during
  both `live` and `closed`.
- **Gallery** (`/kenangan/e/[slug]/gallery`) — a static, cached page that
  `getKenanganGalleryPhotos` populates only when `status === "published"`,
  filtered to `keeper/enhanced/failed` photos that have a server-graded
  `enhancedPath`.
- **Publish** — `PublishButton` → `POST /api/kenangan/publish`: a batch that
  grades/AI-enhances every `keeper`, flips `status → published`, stamps
  `publishedAt`. A separate manual action the Host takes after closing.
- **Reopen** — `closed → live` ("Buka Kembali") is allowed.

Photo `status` is a single enum mixing two concerns: **visibility** (`live` /
`hidden`) and **enhancement lifecycle** (`keeper` selected → `enhanced` /
`failed`). Curation has two modes: `live` (hide/unhide) and `curate` (mark
keepers for the publish batch).

Three problems drove this change:

1. The separate publish step is redundant — closing an event already means "the
   memories are final."
2. Curation should reflect on the guest gallery, not wait for a publish batch.
3. `keeper` overloads the status enum: a photo's "best pick" selection and its
   "should guests see it" visibility are forced into one field, so a photo
   cannot be both hidden and enhanced.

## Decision

**Close is Publish.** The lifecycle collapses to `draft → live → closed`.
`closed` *is* the published, terminal state; there is no `published` status and
no separate publish action.

- **`live → closed` publishes.** `kenanganSetEventStatus` on `closed` sets
  `status: closed` and stamps `publishedAt`. That is the publish moment — no
  batch enhancement runs here.
- **Close is irreversible.** `closed → live` is removed. The "Buka Kembali"
  button goes; the close confirmation becomes an explicit acknowledgement that
  the event cannot be reopened and the gallery is now published:
  *"Tutup acara? Tamu tidak bisa menambah foto lagi dan acara **tidak bisa
  dibuka kembali**. Galeri kenangan langsung terpublikasi."*
- **`published` is retired but tolerated.** No new doc gets `status: published`.
  Read paths treat any legacy `published` doc as `closed` (the Firestore read
  rule and gallery gate keep accepting `published` for back-compat).

**Curation is hide/unhide only.** The `keeper` concept is retired for guest
visibility. Photo `status` narrows to `"live" | "hidden"` — one axis, one
meaning. Live and closed share one curation grid: a hide/unhide toggle. Every
toggle calls `revalidateKenanganEvent(slug)` so the static gallery reflects the
change on the guest's next load (near-live; the realtime feed is already
instant).

**Enhancement is per-photo, on-demand, in the lightbox.** Visibility and
enhancement become **orthogonal axes** — a photo can be hidden *and* enhanced,
which the old single enum could not express. Enhancement is therefore tracked
off the status field:

- `enhancedPath?` — set when an enhancement succeeds (existing field).
- `enhanceState?: "pending" | "failed"` — for the lightbox spinner/badge while a
  Replicate job is in flight or after it fails. `undefined` = never enhanced.
- The batch `POST /api/kenangan/publish` is replaced by
  `POST /api/kenangan/enhance { eventId, photoId }`: owner-authed, requires
  `enhancementPurchased`, runs Replicate on that one photo, and the existing
  webhook swaps in `enhancedPath` (and clears `enhanceState`). Reuses the
  `jobs/{photoId}` subcollection and `createReplicatePrediction` logic lifted
  from the deleted publish route.
- Unpurchased events have no Enhance button; guests see client-graded originals
  everywhere. The old "grade the LUT original as `enhancedPath` at publish time"
  fallback is dropped — grading already happens client-side via `GradedThumb`.

**Both guest surfaces stay.** Feed during `live` (realtime), static gallery
after `closed`. `getKenanganGalleryPhotos` gates on `closed` (plus legacy
`published`) and returns **all non-hidden** photos — `enhancedPath` when
present, else the client-graded original (grading parity with the feed's
`GradedThumb`), dropping the `keeper/enhanced/failed + enhancedPath` filter.

## Implementation checklist

- **`types/kenangan.ts`** — `KenanganEventStatus = "draft" | "live" | "closed"`;
  `KenanganPhotoStatus = "live" | "hidden"`; add `enhanceState?` and keep
  `enhancedPath?` on `KenanganPhoto`.
- **`app/(kenangan)/kenangan/host/actions.ts`** — `kenanganSetEventStatus`:
  allow only `draft→live` and `live→closed`; stamp `publishedAt` on close;
  remove `closed→live` and the `published` guards.
- **Delete** `app/(kenangan)/kenangan/host/events/[id]/PublishButton.tsx` and
  `app/api/kenangan/publish/route.ts`.
- **Add** `app/api/kenangan/enhance/route.ts` (per-photo enhance; owner-auth +
  `enhancementPurchased`; reuse Replicate + `jobs` + webhook).
- **`app/api/kenangan/replicate/webhook/route.ts`** — on success set
  `enhancedPath` + clear `enhanceState`; on failure set `enhanceState: "failed"`
  (no longer writes photo `status`).
- **`app/api/kenangan/photos/route.ts`** — PATCH `status` allowlist
  `["live","hidden"]` (drop `keeper`).
- **`HostPhotosClient.tsx` / `HostPhotoLightbox.tsx`** — remove star/keeper;
  hide/unhide toggle only; add per-photo Enhance button in the lightbox
  (closed + `enhancementPurchased`, showing pending/failed/enhanced); revalidate
  on toggle.
- **`host/events/[id]/photos/page.tsx`** — drop `<PublishButton>`; live + closed
  render the same curation grid; closed enables Enhance; update copy.
- **`host/events/[id]/page.tsx`** — hard irreversible close confirm; remove
  "Buka Kembali"; merge the `published` section into `closed` (gallery link +
  curation + enhance access); `STATUS_LABELS` drops `published`.
- **`lib/kenangan-event.ts`** — `getKenanganGalleryPhotos` gates on
  `closed`/legacy `published`, returns all non-hidden photos (enhanced-or-graded
  original), drops the keeper filter.
- **`feed/page.tsx` / `FeedClient.tsx`** — left unchanged. The feed is the
  *live* surface; enhanced files only exist post-close, where guests are routed
  to the gallery. Its hide/unhide already reflects live via the onSnapshot
  listener. Preferring `enhancedPath` here would need a grading-skip branch in
  two components for a rarely-seen case — deferred until it matters.
- **`HostConsole.tsx`** — `STATUS_LABELS` drops `published`.
- **`/kenangan/e/[slug]/gallery` page + lightbox** — render graded originals for
  non-enhanced photos (grading parity with the feed). *(Verify during
  implementation — not yet read.)*
- **`firestore.rules`** — photo read gate already accepts `['live','closed',
  'published']`; keep for legacy tolerance. No write-rule change (writes are
  admin-SDK).

## Consequences

- **Data model splits cleanly.** Visibility (`status`) and enhancement
  (`enhancedPath` / `enhanceState`) no longer collide; a photo can be hidden and
  enhanced independently.
- **"Reflect live" is relaxed to "reflect on revalidate" for the static
  gallery.** The realtime feed is instant; the static gallery updates on the
  guest's next load after a curation write. Chosen deliberately over collapsing
  to one always-realtime surface.
- **Enhancement cost is per-photo and Host-paced.** No accidental batch of
  hundreds of Replicate calls; the Host enhances the few photos worth it. The
  trade is more taps and no "enhance my whole gallery" button.
- **Close is destructive and final.** No reopen path exists, so a mis-close is
  unrecoverable via UI — the hard confirmation is the only guard. Accepted; a
  reopen would need an out-of-band Admin action.
- **Legacy `published` events keep working** through read-path tolerance; no
  migration ships (pre-launch, little/no such data). If real `published` docs
  exist, they render as closed galleries unchanged.
- **Rejected** folding enhancement into the close action (an "enhance all
  keepers on close" batch) — it re-introduces the keeper concept and an
  expensive, slow close for large events. Also rejected keeping the separate
  publish step — it is the redundancy this ADR removes.
