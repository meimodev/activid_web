# 3. KenanganKita host auth: Google accounts, not access codes

Date: 2026-07-12

## Status

Accepted. Supersedes the host-auth section of `docs/kenangankita-spec.md`
(HMAC-signed per-event access code), which was never launched.

## Context

KenanganKita shipped (commit `6386493`) with the host-auth model the spec
mandated: no user accounts, a per-event `hostAccessCode` (nanoid) plus one
global admin code, both verified via an HMAC-signed cookie
(`lib/kenangan-host-session.ts`). Session subject was an event id or `"admin"`;
only the admin could create events.

We now want Hosts to sign in with Google and own **multiple** Events, while
Guests stay anonymous (link + `jose`-signed event token only). The app has not
launched, so there is no production data to migrate — pre-existing ownerless
events are deleted by hand.

## Decision

- **Google (Firebase Auth) is the sole host login.** Per-event access codes and
  the global admin code are retired. `hostAccessCode` is no longer generated.
- **Server session = Firebase session cookie** (`createSessionCookie` /
  `verifySessionCookie`), not the custom HMAC cookie. `lib/kenangan-host-session.ts`
  is deleted. `verifySessionCookie` yields uid + email per request.
- **Events are owned:** each event carries `ownerUid`. A Host may create many;
  each Event has exactly one owner. Authorization checks `ownerUid === session.uid`
  (or admin) instead of `subject === eventId`.
- **A Host Account doc** (`kenanganHosts/{uid}`) is written on first login,
  holding identity + a home for future per-host state.
- **Admin is an email allowlist** (`KENANGAN_ADMIN_EMAILS`), not a code. Admin
  keeps its two privileged powers: see all events, and confirm manual payments
  that unlock the paid enhanced gallery.
- **Event creation is open self-serve.** Abuse is bounded by the existing
  guardrails only (per-guest upload rate limit, per-tier `guestCap`, paid
  enhancement gate, 60-day original-retention cleanup). Caps added later if
  needed.

## Consequences

- We drop custom session crypto for a platform feature that is revocable and
  carries email for the admin check — less code, and admin status can't go
  stale in a long-lived cookie.
- The Firestore host-events query (`where("ownerUid","==",uid)`) sorts in code
  to avoid a composite index, consistent with the rest of the Kenangan reads.
- The spec's host-auth section is now historical; this ADR is canonical.
- Free self-serve events can accumulate unenhanced JPEGs on the shared ImageKit
  account. Accepted for v1; revisit with a per-account cap if it bites.
