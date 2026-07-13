# 4. KenanganKita event links: auto-generated from name + timestamp

Date: 2026-07-13

## Status

Accepted. Supersedes the host-typed slug field in the Create-Event form
(`app/(kenangan)/kenangan/host/events/HostConsole.tsx`, commit `6600e59`).

## Context

The **Event Link (Tautan Acara)** is the guest-facing address in
`/kenangan/e/{slug}` — printed on the Event QR, the thing a Guest scans to reach
the Guest Landing. Until now the Host typed it: a free-text `slug` input,
validated `^[a-z0-9-]{3,40}$`, with a Firestore uniqueness query that bounced
collisions back as `error=slug`.

That put three burdens on the Host: invent a URL-safe string, keep it readable,
and avoid colliding with someone else's Event — a collision they can't see
coming (they don't know other Hosts' slugs). Hosts don't care about the URL;
Guests reach it by QR, not by typing.

## Decision

- **The Host no longer types the link.** It is derived from the Event's name.
  The Create form shows it as a **read-only live preview** that updates as the
  Host types Nama Acara.
- **Slug = `slugify(name) + "-" + suffix`.** `slugify` lowercases, NFKD-strips
  diacritics (José → jose), replaces each run of non-`[a-z0-9]` with `-`, trims,
  and caps the base at 34 chars. Empty base (emoji/symbol-only name) falls back
  to `kenangan`.
- **Suffix = uniqueness marker, client-decided.** 5-char base36 of `Date.now()`,
  generated once when the form mounts and held stable as the Host types, so the
  preview matches the saved link exactly. Submitted as a hidden field.
- **The server treats the slug as an opaque string.** It keeps the existing
  `SLUG_REGEX` validation and the Firestore dedup query, unchanged — no slugify
  logic server-side. Trust level is identical to the old manual field (which
  also accepted an arbitrary client-supplied slug).

## Consequences

- Guest URLs now carry a random tail (`nikah-rani-bima-k9x2p`). Accepted:
  Guests scan a QR, they don't type the URL, so readability of the tail is
  near-worthless and the friction it removes from Hosts is real.
- The generated slug always satisfies `^[a-z0-9-]{3,40}$` by construction, so
  `error=invalid` can no longer fire from the slug. The `error=slug` dedup path
  stays as a safety net but is now effectively unreachable (5-char timestamp
  suffix + owner-scoped names). Kept anyway — cheap, and the alternative is
  trusting the client's collision-freeness.
- Slugify lives once, on the client. The server never re-derives, so the two
  can't drift and produce a preview that lies.
- Existing Hosts lose the ability to choose a vanity link. No vanity-slug
  demand has surfaced; if it does, re-add an optional override that replaces the
  auto value (the trust-the-string server already supports any valid slug).
