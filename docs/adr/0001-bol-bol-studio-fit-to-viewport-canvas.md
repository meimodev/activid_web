# 1. Bol-bol Studio fits the viewport via a responsive 100svh frame (no scaling)

Date: 2026-06-06

## Status

Accepted

## Context

The Bol-bol Studio page (`/bol-bol-studio`) is a standalone, mobile-first
brand world with its own theme and feel. Requirement: the page must **fit
vertically** — the window never page-scrolls — while prioritizing the mobile
presentation.

An earlier iteration achieved this with a JS-computed `transform: scale()` on a
fixed 430×932 canvas. That was abandoned: scaling softens/blurs text, distorts
at extreme factors, needs a resize listener + `useLayoutEffect` (dev-only SSR
warning), and fights native layout. The remaining obstacle to a plain responsive
layout was the one inherently-unbounded block — the Calendar step's selected-day
bookings detail list — which could grow past any fixed height.

## Decision

Lay the page out with a **responsive frame locked to `100svh`** and normal flex,
no transform.

- Outer wrapper (`FitToViewport`): `h-[100svh] w-screen`, centered, with the
  studio backdrop `#1A3CB8` filling the sides on wider screens; the frame is
  capped at `max-w-[430px]` (mobile-first).
- The page shell is a `flex h-full flex-col`: step-header `flex-none`, the
  carousel body `min-h-0 flex-1`, footer `flex-none`. The window never scrolls.
- Each step is authored to fit; steps with inherently-unbounded content (time
  slots, package list) get a **scoped internal scroll** region (`min-h-0 flex-1
  overflow-y-auto`) with the primary CTA pinned `flex-none`.
- The **Calendar selected-day bookings detail list was removed** — the enabling
  trade-off. Availability is still shown via per-day count badges on the month
  grid. (Admins lose inline Cancel but keep `[ADMIN] Add Booking` + dialog.)

Scoped strictly to this route; no global CSS touched, theme unchanged.

## Consequences

- Native rendering — no blur, no transform math, no resize JS, no SSR warning.
- `FitToViewport` is now a plain presentational (non-client) component.
- `position: fixed` descendants (e.g. `BookingDialog`) anchor to the viewport
  again — normal modal behavior, no transformed containing block.
- On very short viewports (landscape phones) a step may exceed the frame; its
  scoped scroll region absorbs the overflow, the window still does not scroll.
- Removing the Calendar detail list drops the per-booking inline view/cancel UI.

## Alternatives considered

- **`transform: scale()` fixed canvas (previous approach).** Rejected: blur,
  distortion at extreme factors, resize JS, SSR warning.
- **Non-uniform `scale(x, y)` to fill width+height.** Rejected: distorts
  proportions, ugly on wide desktop.
- **Keep the bookings detail list in a capped internal scroll.** Rejected by the
  user in favor of removing it for a cleaner fit.
