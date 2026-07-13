# Product

## Register

brand

> **This repo has no single register.** It is a portfolio of independent surfaces
> that share one Next.js app but nothing else visually. `brand` above is only the
> repo-level default for surfaces not listed below. **Always resolve the register
> from the per-surface table, not this field.** The surface in focus wins.

## The independence rule (read this first)

Every top-level surface, and every page and child under it, may have a
**completely independent, unrelated design**: its own fonts, color strategy,
theme, motion, and layout language. There is intentionally **no shared design
system** across surfaces, and none should be invented.

- Do not normalize one surface toward another. Matching `(main)` and `satset`
  would be a bug, not consistency.
- Within `(invitation)`, each template (`amalthea`, `royal`, `comic-book`, …) is
  its own world too. "Consistency" there means internally coherent per template,
  never cross-template.
- `/impeccable extract`, `normalize`, and design-token consolidation apply
  **within a single surface only**. Never hoist tokens to a repo-wide system.
- The only cross-surface constraint is the Baseline section below.

## Registers (per surface)

| Surface | Register | Personality | Notes |
|---|---|---|---|
| `(main)` — creative agency site | brand | confident, editorial, bold | The agency's own marketing (`/`, about, services, work, contact). Design *is* the pitch. |
| `(invitation)` — invitation platform | brand | **per template** | 14+ self-contained themes; each owns its look via `--invitation-*` vars. Product-shell chrome (register/affiliate flows) leans product. |
| `(kenangan)` — KenanganKita event photos | product | warm, celebratory, event-day | Host dashboard = product (serves the task). Guest capture/feed = warm/brand-leaning. Mobile-first, camera-driven. |
| `bbold` | brand | youthful, energetic, photo-forward | Photo + print-merch brand (lanyards, mask straps). |
| `bol-bol-studio` | brand | playful, tactile | Booking studio. Motion is selective/playful (see memory). |
| `loit` | brand | warm, trustworthy, transparent | Split-the-bill / shared-expense product landing. Casual Indonesian voice ("Uangnya ke mana?"). |
| `satset` | brand | fast, practical, snappy | Restaurant POS that runs on the venue's own Wi-Fi. "SatSet" = quick/no-fuss. |

New surfaces default to `brand` until added here. When a task targets a surface,
read its row before designing.

## Users

Varies by surface, since each sells a different thing:
- **Agency site** — prospective clients evaluating the studio's craft.
- **Invitation** — hosts creating an event page (marriage/birthday/event) and their guests viewing it on a phone.
- **Kenangan** — event hosts managing an event, and guests capturing/browsing photos on their phones during the event.
- **bbold / bol-bol-studio / loit / satset** — end customers of each respective product, arriving on a landing page.

Common thread: almost every visitor arrives on a **phone**.

## Product Purpose

A single Next.js app hosting a creative agency's marketing site plus a set of the
agency's own products and client landings, each intentionally styled as its own
brand. Success is each surface feeling like a distinct, purpose-built product,
never like pages from one template.

## Brand Personality

No unified personality by design. Personality is defined **per surface** in the
table above. When in doubt, exaggerate the difference from neighboring surfaces
rather than smoothing it.

## Anti-references

- **A repo-wide design system.** The failure mode here is *sameness*: shared
  nav, shared type scale, one accent color across surfaces. Avoid it.
- **Generic SaaS-template look** on any surface (hero-metric block, identical
  card grids, gradient text). See the shared absolute bans.
- Any surface that could be swapped with another surface's stylesheet without
  looking wrong has failed.

## Design Principles

1. **Every surface is an island.** Independent design is the feature, not tech debt. Never converge.
2. **Resolve context locally.** Read the surface (and template) you're in; ignore how other surfaces solved the same problem.
3. **Phone-first, always.** The visitor is holding a phone. Design for that width first, enhance up.
4. **Commit to each surface's character.** Match implementation effort to that surface's vision; don't dilute a bold surface toward a safe average.
5. **Coherence is per-surface.** Consistency means internally coherent within one surface/template, never cross-surface uniformity.

## Accessibility & Inclusion

No formal WCAG target set. Keep text legible and tap targets phone-friendly per
surface. Templates use raw `<img>` intentionally (lint override) — still provide
meaningful `alt` where content-bearing.

## Baseline (the one shared constraint)

**Mobile-first.** Every surface is designed phone-width first, then enhanced for
larger screens. This is the only rule that crosses surface boundaries.
