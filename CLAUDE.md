# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> A detailed `AGENTS.md` exists at the repo root and is the canonical, deeper reference. Read it for middleware rules, caching tags, server-only conventions, lint overrides, and known quirks. This file is the high-level orientation.

## Commands

Package manager is **pnpm** (this is a pnpm workspace).

- `pnpm dev` — dev server (localhost:3000)
- `pnpm build` — production build
- `pnpm lint` — eslint (flat config in `eslint.config.mjs`)
- `pnpm test` — vitest single run (`passWithNoTests: true`; no test files exist yet)
- `pnpm test:watch` — vitest watch mode
- `ANALYZE=true pnpm build` — bundle analyzer treemap

Run a single test once files exist: `pnpm vitest path/to/file.test.ts` (or `-t "name"` to filter by test name). Test deps available: `@testing-library/react`, `jsdom`, `fast-check` (property testing). Config: `vitest.config.mts`, setup: `vitest.setup.ts`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Firebase (client + admin) · framer-motion · luxon. Import alias `@/*` maps to repo root.

## Architecture

Two distinct products share one Next.js app, split by App Router route groups:

1. **Creative agency marketing site** — `app/(main)/` (`/`, `/about`, `/services`, `/contact`, `/project`, etc.)
2. **Invitation platform** — `app/(invitation)/` (`/invitation`, `/invitation/[slug]`, affiliate portal, registration). This is where most of the complexity lives.

Plus two standalone brand pages at the top level of `app/`: `bbold/` and `bol-bol-studio/` (own layouts/fonts, no route group).

Each route group and standalone folder has its own `layout.tsx` (separate fonts + metadata). Root `app/layout.tsx` adds Google Analytics and base HTML.

### Invitation system (the core feature)

- **Templates** in `components/templates/` — currently: `amalthea`, `arcade-retro`, `candyland`, `comic-book`, `eden`, `flow`, `jupiter`, `kids-birthday`, `mercury`, `neptune`, `pluto`, `royal`, `saturn`, `venus`. They are **lazy-loaded** via `next/dynamic` so only the rendered template ships in the bundle.
- **Template metadata** (listings, themes, video URLs) in `data/invitation-templates.ts`.
- **Demo seed configs** in `data/invitations.ts`. Demo pages use `*-demo` slug suffix + `?purpose=marriage|birthday|event&theme=THEME_ID`.
- **Live configs** fetched from Firestore `invitations/{slug}` via `getInvitationConfig(slug)` in `lib/invitation-config.ts`. `getValidatedConfig(slug)` wraps fetch+validation in `React.cache()` to dedupe between `generateMetadata` and the page.
- Theme colors are injected as `--invitation-*` CSS variables via `getInvitationThemeStyle()` (`lib/invitation-theme.ts`); templates reference these, never hardcode colors.
- Pages render inside `.invitation-mobile-shell` / `.invitation-mobile-frame` (max-width 430px, mobile-first).

### Middleware (`middleware.ts`)

Detects `invitation.*` subdomains and rewrites to `/invitation/...` paths; maps `/invitation/{12-char CODE}` to `/invitation` and sets an affiliate cookie (`inv_affiliate`, httpOnly, 30-day). Early-exits for non-invitation paths.

### Firebase

- `lib/firebase.ts` — client SDK (`NEXT_PUBLIC_FIREBASE_*` env vars).
- `lib/firebase-admin.ts` — admin SDK (`FIREBASE_ADMIN_*`), `"server-only"`, reads `invitations/{slug}`.
- `lib/affiliate-config.ts` — reads `invitationAffiliates/{id}`, `"server-only"`.

**Server-only files** (never import in client components): `firebase-admin.ts`, `affiliate-config.ts`, `invitation-config.ts`, `invitation-register-session.ts`, `invitation-affiliate-session.ts`.

### Caching

`getInvitationConfig` uses `unstable_cache` + React `cache()`; revalidation tag `invitation-config:${slug}`; `revalidateInvitationConfig(slug)` busts tag + path. Default interval 30 min; affiliate data 5 min.

## Critical quirks (see AGENTS.md for full list)

- **React Compiler is ON** (`reactCompiler: true`). Code must follow the Rules of React or the compiler bails. `react-hooks/exhaustive-deps` is off only for `hooks/useDeferredEffect.ts`.
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline {}` in `globals.css`; PostCSS uses `@tailwindcss/postcss`. No `@tailwind` directives.
- **`@next/next/no-img-element` is off** for `app/(invitation)/` and `components/templates/` — templates use raw `<img>` intentionally.
- **All template/invitation images** come from ImageKit base `https://ik.imagekit.io/geb6bfhmhx/`.
- **Navigation is imported per-page**, not in a shared layout.
- Reserved template slugs (`flow`, `saturn`, …) at `/invitation/[slug]` 404 — only `*-demo` suffixes or user-created slugs resolve.
- Admin affiliate ID is `000000000000` (`ADMIN_INVITATION_AFFILIATE_ID` in `types/invitation.ts`).

## API routes

`/api/imagekit/auth`, `/api/imagekit/delete` (ImageKit), `/api/tinypng/optimize` (image optimization), `/api/dropbox/audio` (audio), `/api/wishes` (RSVP guest wishes).
