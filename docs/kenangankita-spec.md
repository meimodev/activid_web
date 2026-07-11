# KenanganKita — Integration Spec for activid_web

**Version:** 1.0 (integrated)
**Date:** 11 July 2026
**Owner:** Meimo
**Status:** Ready to build
**Supersedes:** `~/Downloads/kenangankita-spec.md` (v0.1 draft — generic host-app assumptions)

---

## 0. Integration Decisions (resolved)

The v0.1 draft left the host app open. It is **activid_web**. Every assumption is now pinned
to what this repo actually runs:

| v0.1 assumption | Resolved for activid_web |
|---|---|
| Next.js 14/15 App Router | **Next.js 16** App Router, React 19, **React Compiler ON** — code must follow Rules of React |
| Hosting | Vercel (Fluid Compute, Node middleware) |
| Database: Postgres/Supabase | **Firestore** (client SDK in `lib/firebase.ts`, admin SDK in `lib/firebase-admin.ts`) |
| Host auth: "existing app auth" | No user-account system exists. Reuse the **HMAC-signed session cookie** pattern from `lib/invitation-affiliate-session.ts` |
| Guest auth: none | Unchanged — anonymous, signed event token in QR URL (sign with `jose`, already a dependency) |
| Payments: Midtrans/Xendit | **None exists in the app.** Phase 1: manual admin confirmation (mirror invitation platform's flow). Payment gateway is Phase 3+ |
| Storage: Cloudflare R2 + presigned PUT | **ImageKit** — already integrated (`/api/imagekit/auth` signature endpoint, client-side direct upload) |
| Realtime: Supabase Realtime / Pusher | **Firestore `onSnapshot`** — client SDK already shipped to invitation pages; no new dependency, no channel infra |
| Queue: Inngest / Trigger.dev / QStash | **None needed for v1.** Replicate async predictions + webhook; Vercel function timeout is 300s, enough to enqueue a full batch. Add QStash only if enqueue loops exceed that |
| Schema prefix `kk_` / schema `kenangan` | Firestore collection prefix **`kenangan*`** (matches existing `invitations`, `invitationAffiliates` naming) |

**Integration principle unchanged: namespace everything.** Module must be removable without
touching `(main)`, `(invitation)`, or the standalone brand pages.

- Routes: `app/(kenangan)/kenangan/...` (route group with own `layout.tsx`, fonts, `kenangan.css` — same pattern as `app/(invitation)/`)
- Subdomain: `kenangan.activid.id` via `middleware.ts` extension (mirrors `invitation.*` handling)
- Firestore: `kenanganEvents`, `kenanganOrders` collections + subcollections
- Styles: `--kk-*` scoped tokens in `kenangan.css`, never in `globals.css`
- Feature flag: `KENANGAN_ENABLED` env var — layout and API routes 404 when unset

---

## 1. Product Summary (unchanged from v0.1)

Event-wide live photo-sharing layer. Guests scan a QR anywhere at the venue, shoot in-browser
(no app install, no account), photo appears instantly in a shared live feed. After the event,
the host can purchase an AI-enhanced, colour-graded final gallery.

**Not a photo booth. The whole venue is the camera.**

| | Live Feed | Published Gallery |
|---|---|---|
| When | During event, realtime | After event, batched |
| Processing | Client-side LUT only | Server-side AI restore + LUT re-apply |
| Resolution | ImageKit thumb transform (~400px) | Full resolution |
| Cost to run | ~zero | Paid (Replicate ~$0.007/photo) |
| Download | Per host setting | Yes |

---

## 2. Routing & Subdomain

### 2.1 Middleware (`middleware.ts`)

Extend the existing middleware — same early-exit + rewrite shape as `invitation.*`:

```
kenangan.activid.id/{slug}            → rewrite → /kenangan/e/{slug}
kenangan.activid.id/{slug}/capture    → rewrite → /kenangan/e/{slug}/capture
kenangan.activid.id/host/...          → rewrite → /kenangan/host/...
activid.id/kenangan/...               → served directly (no rewrite)
```

Rules:
- Detect `hostname.startsWith('kenangan.')` alongside the existing `invitation.` check; keep the shared early-exit for paths that are neither.
- Skip `/api`, `/_next`, `/static`, dotted paths — identical guard as invitation branch.
- Guest QR token (`?t=...`) passes through untouched as a query param.
- If `KENANGAN_ENABLED` is unset, the kenangan branch rewrites to a 404.

### 2.2 Route structure

```
app/
  (kenangan)/
    layout.tsx                      # fonts (Fraunces + Satoshi), metadata, kenangan.css import
    kenangan.css                    # --kk-* tokens, shell styles — scoped, mirrors invitation.css
    kenangan/
      e/[slug]/
        page.tsx                    # Guest landing (server component)
        capture/page.tsx            # Camera — CLIENT component ("use client")
        feed/page.tsx               # Live feed — client, Firestore onSnapshot
        gallery/page.tsx            # Published gallery (server, revalidate on publish)
      host/
        page.tsx                    # Host login (access code → HMAC session cookie)
        events/page.tsx             # Event list
        events/[id]/page.tsx        # Setup, live moderation, keeper curation, publish
  api/kenangan/
    upload-auth/route.ts            # POST → ImageKit signature (guest-token gated)
    photos/route.ts                 # POST commit metadata / GET ?after=cursor catch-up
    publish/route.ts                # POST → keeper filter, enqueue Replicate batch
    replicate/webhook/route.ts      # Replicate async prediction callback
    session/route.ts                # Host login/logout
```

Guest URL printed on QR standees: `https://kenangan.activid.id/{slug}?t={signedToken}`.

### 2.3 Guest token

- `jose`-signed JWT: `{ eventId, exp }`. Expiry = event date + 48h.
- Verified in the guest landing server component and in `upload-auth` / `photos` POST.
- Not a bare public URL — token is required for upload, optional for viewing the published gallery.

### 2.4 Host auth

Clone the `invitation-affiliate-session.ts` pattern into `lib/kenangan-host-session.ts`
(`"server-only"`):

- Each event has a `hostAccessCode` (nanoid, already a dependency) given to the host at event creation (created by admin initially — no self-serve signup in v1).
- Host enters code at `/kenangan/host` → HMAC-signed httpOnly cookie (`kenangan_host_session`), 12h TTL, secret `KENANGAN_SESSION_SECRET`.
- All host pages and mutating API routes validate the cookie server-side.

---

## 3. Processing Pipeline

```
Capture (client)
  └─ WebGL LUT applied on canvas
  └─ Export ONE full-res JPEG (no client thumb — ImageKit transforms handle it)
  └─ Direct upload to ImageKit (signature from /api/kenangan/upload-auth) — NOT through Next
        └─ POST /api/kenangan/photos → Firestore photo doc → onSnapshot pushes to all feeds

[event ends]

Host: Close & Publish
  └─ Curate keepers (manual hide/keep + auto-flag blur/dark candidates)
  └─ IF enhancement purchased (admin-confirmed order):
        └─ /api/kenangan/publish creates Replicate async predictions (webhook mode)
           in chunks — Real-ESRGAN (2x cap) + GFPGAN, restorative only
        └─ Webhook per prediction → re-apply the SAME LUT server-side (sharp or
           canvas-in-node against the stored .cube) → upload enhanced file to ImageKit
           → update photo doc
  └─ Set event status=published → gallery page revalidates → guests notified
```

**Two rules that must not be broken (unchanged from v0.1):**

1. **The LUT owns colour. The AI owns pixels.** AI does denoise/sharpen/upscale/face-restore
   only; the stored `lutId` is re-applied deterministically at full res on top. The final
   gallery is a higher-quality version of exactly what the guest previewed.
2. **Restorative, never generative.** No creative upscalers, no high-denoise diffusion.
   Conservative strength. On failure, publish the LUT-graded original — never a mangled face.

### 3.1 ImageKit specifics

- Upload path: `/kenangan/{eventId}/{photoId}.jpg` on the existing `ik.imagekit.io/geb6bfhmhx/` account (all template/invitation images already live there).
- Feed thumbs: URL transform `?tr=w-400,q-70` — zero client or server resize work.
- Enhanced files: `/kenangan/{eventId}/enhanced/{photoId}.jpg`. Original never overwritten.
- Signature endpoint mirrors `/api/imagekit/auth` but is gated by guest token + per-session rate limit (the existing endpoint is open; do not reuse it directly).
- Retention: scheduled cleanup of originals 60 days post-publish via ImageKit delete API (`/api/imagekit/delete` pattern) — host-visible promise.

### 3.2 Non-negotiable Next.js constraints (carried over, still true on this stack)

- Never proxy image bytes through Next API routes (4.5MB body limit; cost). Client → ImageKit direct.
- Camera page is a client component; media state never SSR'd; camera starts only on user tap.
- Feed must virtualize — never render 2,000 `<img>` nodes. New arrivals prepend; older lazy-load on scroll.
- Reconnect catch-up: `onSnapshot` handles live gap-fill automatically, but on tab resume re-query `photos` ordered by `createdAt` after the last seen cursor as belt-and-braces.
- Raw `<img>` is fine here — `@next/next/no-img-element` is already off for invitation surfaces; extend the eslint override to `app/(kenangan)/`.
- React Compiler is ON: no ref-during-render tricks in the camera/WebGL code; keep WebGL context in refs + effects, follow Rules of React or the compiler bails.

### 3.3 iOS / Safari requirements (unchanged — the constraining platform)

- `getUserMedia` only; do **not** depend on ImageCapture API (no Safari support).
- `<video playsinline muted autoplay>` — without `playsinline`, iOS hijacks fullscreen.
- Camera start requires user gesture.
- Explicit download button (no native save-to-gallery).
- Request `{ facingMode, width: { ideal: 1920 } }` — default resolution is the #1 silent quality killer. Nudge rear camera for group shots.

---

## 4. Data Model (Firestore)

```
kenanganEvents/{eventId}
  slug, name, eventDate, coverUrl, tier, guestCap, themeId,
  downloadMode: "after_publish" | "instant_share",
  status: "draft" | "live" | "closed" | "published",
  hostAccessCode, enhancementPurchased: bool, publishedAt, createdAt

kenanganEvents/{eventId}/photos/{photoId}
  guestSessionId, lutId,
  originalPath, enhancedPath?,        # ImageKit paths; thumb = URL transform of original
  status: "live" | "hidden" | "keeper" | "enhanced" | "failed",
  width, height, createdAt

kenanganEvents/{eventId}/guestSessions/{sessionId}
  anonId, userAgent, uploadCount, createdAt

kenanganEvents/{eventId}/jobs/{jobId}
  photoId, replicateId, status, error, createdAt

kenanganOrders/{orderId}
  eventId, amountIdr, status: "pending" | "confirmed", confirmedAt

kenanganThemes/{themeId}               # or static data/kenangan-themes.ts if LUT sets are fixed
  name, lutPresets: [{ id, name, cubeUrl, sortOrder }]
```

Notes:
- Photos as a **subcollection** keeps the feed query trivial (`orderBy createdAt desc`, `where status == "live"`) and `onSnapshot` scoped per event.
- `lutId` stored, never baked — batch re-grades cleanly at full res.
- Slug lookup: query `kenganEvents where slug ==` wrapped in `React.cache()` + `unstable_cache` with tag `kenangan-event:{slug}` — same pattern as `getValidatedConfig` in `lib/invitation-config.ts`.
- Firestore security rules: client reads allowed on `photos` where event `status in ["live","published"]`; **all writes via admin SDK in API routes only**.

---

## 5. Realtime Feed

- Firestore `onSnapshot` on the event's `photos` subcollection, `where("status","==","live")`, `orderBy("createdAt","desc")`, `limit(50)` + paginated `startAfter` for scroll-back.
- No channel server, no broadcast step — the Firestore write in `/api/kenangan/photos` *is* the broadcast.
- Batch UI updates: buffer snapshot changes and flush on `requestAnimationFrame` so a toast-moment burst doesn't re-render per photo.
- **Load target:** 200 guests, ~2,000 photos/night, bursty (speeches, dance floor). Firestore snapshot listeners handle this comfortably; design UI for spikes, not averages.
- Cost check: 200 concurrent listeners × 2,000 doc deliveries is well inside Firestore's free-tier reads per event; not a COGS concern.

---

## 6. AI Enhancement (Replicate) — unchanged from v0.1

| Item | Choice |
|---|---|
| Models | Real-ESRGAN (upscale/denoise) + GFPGAN (face restore, likeness-preserving) |
| Excluded | Creative/generative upscalers, high-denoise diffusion, CodeFormer at high strength |
| Upscale cap | **2x** — phone/Instagram viewing; higher is wasted cost + storage |
| Cost | ~$0.007/photo |
| Execution | Async predictions + webhook (`REPLICATE_WEBHOOK_SECRET` verified), post-event only |
| Failure policy | Retain original; on failure publish LUT-graded original. Never a mangled face |
| Sanity check | Optional human spot-check on premium tier |

**Keeper gate before the batch** cuts cost, raises gallery quality, and *is* the moderation
mechanism. Never enhance blindly.

---

## 7. Monetization — unchanged economics, adapted rails

Per event, metered by **guest count** (never photo capacity).

| Tier | Guests | Price | Approx COGS | Margin |
|---|---|---|---|---|
| Intimate | ≤100 | Rp 300k | ~Rp 77k | ~74% |
| Standard | ≤300 | Rp 600k | ~Rp 196k | ~67% |
| Grand | ≤600 | Rp 1,200k | ~Rp 427k | ~64% |

**Phasing (adapted to activid_web having no payment gateway):**
1. **Phase 1** — Live feed free. Enhanced gallery paid via **manual flow**: WhatsApp/transfer → admin confirms `kenanganOrders` doc → `enhancementPurchased=true`. Matches how the invitation platform operates today.
2. **Phase 2** — Payment gateway (Midtrans/Xendit + QRIS) for self-serve checkout + guest self-enhance fallback.
3. **Phase 3** — Venue/organizer white-label subscription (~Rp 2.5M/mo unlimited branded events). The recurring engine.

Model is insensitive to cost (processing ~2% of revenue) and sensitive to distribution.
Optimize event volume and opt-in rate, not COGS.

---

## 8. Design System

Scoped tokens in `app/(kenangan)/kenangan.css` — never touch `globals.css` or the Tailwind
`@theme` block used by other surfaces.

```css
--kk-paper:  #F7F2EA;   /* base cream */
--kk-cream:  #F0E8DA;   /* surfaces, cards */
--kk-sand:   #E4D9C6;   /* dividers, depth */
--kk-ink:    #2C2822;   /* text — warm near-black, never pure black */
--kk-muted:  #8B8276;   /* secondary text */
--kk-bronze: #A98A5C;   /* single accent — CTA, capture ring, glint */
--kk-dark:   #1A1714;   /* CAPTURE SCREEN ONLY */
```

- **Type:** Fraunces (display, via `next/font/google`) + **Satoshi** (UI, local files in `app/fonts/` — Fontshare, not on Google Fonts). Loaded in `(kenangan)/layout.tsx` only, same per-group pattern as every other route group in this app.
- **Restraint is the aesthetic.** One accent. Photos supply the colour; UI is the mat board.
- **Capture screen is dark (`--kk-dark`)** — usability requirement for candlelit receptions at 21:00, not a style choice. Cream everywhere else.
- **Icon:** thin rounded-square frame + four-point glint, bronze on cream. **Short mark: `Kita`.**
- **Watermark:** small letterspaced serif, cream, bottom corner — tasteful enough guests don't crop it. That restraint is the organic growth loop.
- **Copy: all guest- and host-facing text in Bahasa Indonesia.** Disclose upfront that the host curates the final gallery (framed as curation, not censorship).

---

## 9. Moderation & Abuse

- Host: hide/delete any photo; optional approve-before-public mode.
- Guest: report button → flags doc for host.
- Auto-flag candidates at keeper gate: blur, extreme underexposure, near-duplicates.
- Rate-limit uploads per guest session (`uploadCount` check in `upload-auth`; open QR = open upload).
- Signed expiring event token in QR (§2.3) — never a bare public URL.

---

## 10. Build Order

1. **Core loop** — middleware subdomain + guest landing + camera/LUT capture + ImageKit direct upload + Firestore commit + `onSnapshot` feed. *Nothing else matters until this feels magic on a real phone in a dim room.*
2. Host: access-code session, event setup, theme/LUT choice, QR generation, download-mode toggle.
3. Moderation, keeper gate, close & publish, published gallery page.
4. Replicate batch + server-side LUT re-apply + webhook + guest notify.
5. Orders (manual confirm) + tiering.
6. Phase 2 payments → Phase 3 white-label.

---

## 11. Env Vars (new)

```
KENANGAN_ENABLED=true
KENANGAN_SESSION_SECRET=...          # host HMAC sessions
KENANGAN_GUEST_TOKEN_SECRET=...      # jose JWT for QR tokens
REPLICATE_API_TOKEN=...
REPLICATE_WEBHOOK_SECRET=...
# ImageKit + Firebase vars already exist
```

---

## 12. Open Risks

| Risk | Note |
|---|---|
| **Realtime at event volume** | The 80% that decides magic vs. janky. Firestore snapshots derisk transport; the risk moves to feed rendering — virtualize + batch. |
| **Opt-in rate** | Most sensitive input in the model. If 30% not 60%, Phase 3 becomes essential, not optional. |
| **LUT quality on phone JPEGs** | Cinema/log LUTs will misbehave on phone output. Author + test presets against real phone photos. |
| **8-bit banding** | Browser grading is 8-bit sRGB; strong LUTs band on skies/walls. Verify before locking presets. |
| **Face restoration failure** | Waxy faces at a wedding are unforgivable. Conservative strength, keep originals, fail safe to un-enhanced. |
| **Server-side LUT re-apply parity** | New risk from ImageKit pipeline: the node-side .cube application must match the WebGL preview pixel-for-pixel in colour. Build a parity test (same input + LUT through both paths, assert ΔE small) in step 4. |
| **Firestore rules surface** | Client SDK reads photos directly; rules must scope reads to live/published events and block all client writes. Review before launch. |

---

## 13. Implementation Prompt

Run this to implement the spec:

```
/goal Implement the KenanganKita module end-to-end per docs/kenangankita-spec.md.

Work through §10 Build Order strictly in sequence — do not start a later step
until the previous one works:

1. Core loop: extend middleware.ts for the kenangan.* subdomain (mirror the
   invitation.* branch, keep the shared early-exit), create app/(kenangan)/
   route group with its own layout.tsx + kenangan.css (--kk-* tokens, Fraunces
   via next/font/google, Satoshi as local font), guest landing at
   /kenangan/e/[slug] with jose guest-token verification, client-only camera
   page (getUserMedia, playsinline, user-gesture start, ideal width 1920,
   WebGL LUT preview with 3–4 presets, 3-2-1 countdown, retake/kirim), direct
   ImageKit upload via a new token-gated /api/kenangan/upload-auth signature
   route, photo commit via /api/kenangan/photos (admin SDK write to
   kenanganEvents/{id}/photos), and a virtualized live feed page driven by
   Firestore onSnapshot with rAF-batched updates and ?tr=w-400,q-70 thumbs.
2. Host surface: lib/kenangan-host-session.ts (clone the HMAC pattern from
   lib/invitation-affiliate-session.ts, secret KENANGAN_SESSION_SECRET),
   access-code login, event CRUD, theme/LUT selection, QR generation with
   signed token URL, download-mode toggle.
3. Moderation + keeper curation + close & publish + published gallery page
   with cache tag kenangan-event:{slug} revalidation.
4. Replicate integration: publish route creates async predictions (Real-ESRGAN
   2x + GFPGAN, restorative settings only), webhook route verifies signature,
   re-applies the stored .cube LUT server-side at full res, uploads enhanced
   file to ImageKit, updates the photo doc; failure path publishes the
   LUT-graded original. Include the WebGL-vs-server LUT parity test from §12.
5. kenanganOrders with manual admin confirmation gating enhancement.

Constraints throughout: all guest/host copy in Bahasa Indonesia; never proxy
image bytes through Next API routes; React Compiler compatibility (Rules of
React, WebGL state in refs/effects); namespace everything under kenangan* /
--kk-* / app/(kenangan)/; gate every surface behind KENANGAN_ENABLED; never
modify globals.css, (main), (invitation), or brand pages; extend the
no-img-element eslint override to app/(kenangan)/. Verify each step with
pnpm lint && pnpm build before moving to the next.
```
