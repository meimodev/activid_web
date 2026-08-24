# 10. Bol-bol Studio calendar: a write-only mirror of tentative requests

Date: 2026-08-24

## Status

Accepted.

## Context

The Bol-bol Studio booking flow ends by opening a prefilled WhatsApp message to
the admin (`--mohon menunggu konfirmasi admin--`). That customer path writes
**nothing**: no `bb_bookings` doc, no record of any kind. The only writer of
`bb_bookings` is the admin's own `BookingDialog`.

So the studio owner's day lives in a WhatsApp thread. They wanted it on a Google
calendar instead, populated "when the WhatsApp redirect happens".

The awkward part: at redirect time nothing is booked. `window.open` fires before
WhatsApp has loaded; the customer can close the tab without sending. Whatever
lands on the calendar at that moment is a **Booking Request**, not a **Booking**.

## Decision

- **Two states on one calendar.** A Booking Request is written at redirect time
  as a Google `tentative` event titled `[BELUM DIKONFIRMASI] …`, colour 5. When
  the admin records the real Booking in `BookingDialog`, the same route writes a
  `confirmed` event, colour 10, without the prefix.
- **The calendar is a mirror, never a record.** Nothing new is persisted in
  Firestore. If the Calendar API is down the request is lost and only the
  WhatsApp message survives — which is the pre-existing source of truth anyway.
- **Idempotency comes from the event id**, not from stored state. Event id =
  `sha1(startMs | phone-digits)`, which is already inside Google's
  `[a-v0-9]{5,1024}` alphabet. Insert, and on 409 patch. So a re-confirm of the
  same slot updates one entry, and the admin's confirmation **promotes the
  customer's tentative entry in place** rather than adding a second one.
- **Auth is the existing Firebase Admin service account**, given
  `calendar.events` scope, against a dedicated studio calendar shared with that
  service-account address (`GOOGLE_CALENDAR_ID`). No OAuth consent screen, no
  refresh token, no new secret.
- **No attendees, ever.** A service account cannot invite attendees without
  domain-wide delegation; the Calendar API rejects it.
- **Fire-and-forget from the client.** `window.open` stays first and synchronous
  in the click handler (popup blockers), then `fetch(..., {keepalive: true})`.
  Calendar failures are silent to the customer.
- **The endpoint is public, so it validates.** Duration is re-derived server-side
  from `bb_packages`; the slot must be in the future, within opening hours, and
  ≤90 days out; a hashed-IP daily quota caps abuse at 10 requests. Admin
  credentials sent from the client are verified against `bb_accounts` server-side
  before a `confirmed` event is written.
- **Times are stamped `Asia/Makassar`**, hardcoded. `WITA` was previously only a
  display label; all date math was browser-local.

## Consequences

- The calendar accumulates tentative entries for customers who never sent the
  WhatsApp message. Accepted: they are visually marked and deleted by hand. There
  is no signal that distinguishes "opened WhatsApp" from "sent the message", so
  no amount of code fixes this.
- A customer who steps back, changes the **slot**, and re-confirms leaves the
  first tentative entry orphaned. Changing only the Paket or Latar patches in
  place, since the id keys on slot + phone.
- We chose not to persist Booking Requests. That means no reconciliation, no
  retry, no analytics on drop-off between request and confirmation. Revisit by
  adding a `bb_booking_requests` collection — the route already has every field.
- Choosing a dedicated calendar over the owner's primary means revocation is one
  unshare, and the owner can toggle studio noise off.
- Admin-created Bookings now also reach the calendar. Without that the feature
  would have been inverted: full of maybes, empty of certainties.
