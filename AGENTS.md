# AGENTS.md

## Build & Dev

- **Package manager**: `pnpm` (this is a pnpm workspace with `pnpm-workspace.yaml`)
- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm lint` — eslint (flat config, `eslint.config.mjs`)
- `pnpm test` — vitest (no test files exist yet; passes via `passWithNoTests: true`)
- `pnpm test:watch` — vitest in watch mode
- `ANALYZE=true pnpm build` — bundle analyzer (opens interactive treemap)

## Architecture

### Route groups (Next.js App Router)

| Path | Group | Purpose |
|------|-------|---------|
| `/` | `(main)/` | Creative agency landing page |
| `/about`, `/work`, `/services`, `/contact`, etc. | `(main)/` | Agency subpages |
| `/invitation` | `(invitation)/` | Invitation template landing |
| `/invitation/[slug]` | `(invitation)/` | Live invitation or demo (`*-demo` suffix = demo) |
| `/bbold` | `app/bbold/` | Standalone brand page (no route group) |
| `/bol-bol-studio` | `app/bol-bol-studio/` | Standalone brand page (no route group) |

Each route group/top-level folder has its own `layout.tsx` with separate fonts and metadata. `(main)` and `(invitation)` share the root `app/layout.tsx` (which adds Google Analytics and base HTML structure).

### Middleware (`middleware.ts`)

- Runs on all paths except `api/`, `_next/static`, `_next/image`, `favicon.ico`
- Early-exit for non-invitation paths (skips string ops on marketing/bbold/bol-bol pages)
- Detects `invitation.` subdomains → rewrites to `/invitation/[slug]` style paths
- Path `/invitation/[CODE]` where CODE matches `^[A-Z0-9]{12}$` → rewrites to `/invitation` and sets `inv_affiliate` cookie
- Affiliate cookie: `httpOnly`, `sameSite: "lax"`, 30-day TTL

### Invitation system

- **Templates** live in `components/templates/`: `amalthea`, `arcade-retro`, `candyland`, `comic-book`, `eden`, `flow`, `jupiter`, `kids-birthday`, `mercury`, `neptune`, `pluto`, `royal`, `saturn`, `venus`
- **Templates are lazy-loaded** via `next/dynamic` in `[slug]/page.tsx` and `InvitationDemoPlayground.tsx` — only the rendered template's module is bundled
- **Template metadata** (listings, themes, video URLs) in `data/invitation-templates.ts`
- **Demo seed data** in `data/invitations.ts` (912 lines, all demo configs per template)
- **Live configs** fetched from Firestore via `getInvitationConfig(slug)` (`lib/invitation-config.ts`)
- Demo pages use `?purpose=marriage|birthday|event&theme=THEME_ID` query params
- `getValidatedConfig(slug)` wraps fetch + validation in `React.cache()` to deduplicate calls between `generateMetadata` and the page component
- Graceful error page shown on Firestore quota exceeded (uses in-memory last-good-value cache for 1h)

### Firebase

- **Client SDK** (`lib/firebase.ts`): uses `NEXT_PUBLIC_FIREBASE_*` env vars
- **Admin SDK** (`lib/firebase-admin.ts`): uses `FIREBASE_ADMIN_*` env vars, marked `"server-only"`. Reads from `invitations/{slug}` collection.
- **Affiliates** (`lib/affiliate-config.ts`): reads from `invitationAffiliates/{id}` collection, also `"server-only"`

### Server-only conventions

Files marked `import "server-only"` and must never be imported in client components:
- `lib/firebase-admin.ts`
- `lib/affiliate-config.ts`
- `lib/invitation-config.ts`
- `lib/invitation-register-session.ts`
- `lib/invitation-affiliate-session.ts`

### Caching / revalidation

- `getInvitationConfig` uses `unstable_cache` (Next.js cache) wrapped with `cache()` (React cache)
- Revalidation tags: `invitation-config:${slug}`
- `revalidateInvitationConfig(slug)` revalidates both the tag and the path
- Default revalidation interval: 30 minutes
- Affiliate data caches for 5 minutes (300s)

## Important quirks

- **`luxon` package**: The `package.json` has `"luxon"` (typo), but all code imports `"luxon"`. Do NOT rename the import — it works. The types bridge is at `types/luxon.d.ts`.
- **Tailwind v4**: Uses `@import "tailwindcss"` syntax (not `@tailwind` directives) and `@theme inline {}` block in `globals.css`. PostCSS uses `@tailwindcss/postcss` plugin.
- **React Compiler**: Enabled via `reactCompiler: true` in `next.config.ts` & `babel-plugin-react-compiler`. Code must follow Rules of React or the compiler will bail out.
- **`next.config.ts`**: Uses `optimizePackageImports` for `framer-motion`, `luxon`, `firebase/firestore` to reduce barrel parse overhead. Bundle analyzer wraps the config via `withBundleAnalyzer`.
- **Navigation component is imported per-page**: `(main)/layout.tsx` imports `<Navigation isGlobal={true} />` — not in a shared layout. Individual pages also import their own nav (e.g., `(main)/page.tsx`).
- **All images from ImageKit**: The `DEMO_*` constants and live invitation images use `https://ik.imagekit.io/geb6bfhmhx/` as base URL.
- **Invitation CSS variables**: Theme colors are injected as `--invitation-*` CSS custom properties via `getInvitationThemeStyle()` — templates reference these variables, not hardcoded colors.
- **Invitation shell**: Pages render inside `.invitation-mobile-shell` with `.invitation-mobile-frame` at max-width 430px (mobile-first).
- **Admin affiliate ID**: `000000000000` (defined in `types/invitation.ts` as `ADMIN_INVITATION_AFFILIATE_ID`).
- **`bbold` and `bol-bol-studio`** pages live at the top level of `app/` (not in route groups). They have their own layouts with separate fonts and backgrounds.
- **Reserved template slugs** (`flow`, `saturn`, etc.) at `/invitation/[slug]` return 404 — only `*-demo` suffixes or user-created slugs are valid.

## Lint overrides

- `@next/next/no-img-element`: off for files in `app/(invitation)/` and `components/templates/` (templates use raw `<img>` tags for SVG/template images)
- `react-hooks/exhaustive-deps`: off for `hooks/useDeferredEffect.ts`

## API routes

- `/api/imagekit/auth` / `/api/imagekit/delete` — ImageKit integration
- `/api/tinypng/optimize` — TinyPNG image optimization
- `/api/dropbox/audio` — Dropbox audio files
- `/api/wishes` — Guest wishes (for invitation RSVP wishes)
