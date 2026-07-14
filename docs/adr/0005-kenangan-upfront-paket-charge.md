# 5. KenanganKita Paket: upfront charge that gates going Live

Date: 2026-07-14

## Status

Accepted. Extends the payment model introduced with the enhanced-gallery
purchase (commit `6386493`) and the Host Console (commit `52bc4c0`).

## Context

An Event carries a **Paket (KenanganKita)** — a guest-capacity plan (Intimate /
Standard / Grand) stored as its `tier`, defined in `KENANGAN_TIERS`
(`types/kenangan.ts`). Each Paket already carries both a `guestCap` and a
`priceIdr`.

Until now the Paket was invisible at creation: `kenanganCreateEvent` hardcoded
`tier: "standard"`, and only the Event detail/edit screen let the Host change it
— with no payment consequence. The one money in the system was the **post-event
enhanced-gallery purchase**: a single `kenanganOrders` document per Event
(`KenanganOrder`), created by an explicit Host action, confirmed by the **Admin**,
which flips `enhancementPurchased`. The product pitch was "pay after the event."

We want the Paket selection surfaced in the **Buat Acara** (Create Event) form,
and we want selecting a Paket to mean something — the Host commits to pay for the
Event's capacity, not just after-the-fact enhancement.

## Decision

- **Paket is chosen and charged upfront.** The Create form gains a required
  Paket selector (default Standard, price shown). Submitting creates the Event
  **and** a pending `KenanganOrder` for the Paket price in one step.
- **Two distinct order kinds, one collection.** `KenanganOrder` gains
  `kind: "paket" | "enhancement"`. Existing orders are `"enhancement"`. Every
  order query filters by `kind`. The Admin-confirm handler branches on it: a
  `paket` confirm only marks the order confirmed; only an `enhancement` confirm
  sets `enhancementPurchased`. The two charges stay separate money — Paket
  unlocks running the Event, enhancement unlocks the **Memory Gallery**. The
  enhancement charge is deliberately pegged to the Paket band price
  (`tier.priceIdr`): a Host pays the band upfront and again for enhancement.
  Intentional — enhancement scales with event size — not a leftover from when
  Paket was free.
- **Unpaid Paket gates draft→live only.** `kenanganSetEventStatus` refuses the
  transition to `live` until the Paket order is `confirmed`. Everything else
  pre-live stays self-serve (edit details, change Paket, view the pending
  banner).
- **Paket is editable while pending, locked once confirmed.** Re-selecting a
  Paket before payment rewrites the pending order's `amountIdr`. After the Admin
  confirms, the Paket selector goes read-only — no refund/top-up logic; a change
  to a paid capacity is an out-of-band Admin action.

## Consequences

- Contradicts the earlier "pay after the event" framing: an Event now costs
  money before it can run. Deliberate — the Paket is a price ladder for Event
  size, charged upfront regardless of enhancement.
- The `guestCap` on each Paket is an **advertised band, not an enforced limit**.
  Nothing checks live guest count against it; `guestCap` is stored and shown in
  copy only. The tiers are a pricing ladder, not runtime capacity gates.
- Every order read path must now be kind-aware; a missing filter would let a
  Paket order masquerade as the enhancement order (or vice-versa) on the detail
  screen.
- No free path to Live: all three Paket carry a price, so every Event requires a
  confirmed Paket payment to go Live. Accepted.
- The Live gate assumes **every Event has a Paket order**. Events created before
  this change wrote none, so they would be permanently blocked from Live with no
  order to confirm. Pre-launch there is no such data, so no migration ships. If
  Events ever predate this rule, backfill a confirmed Paket order per Event
  rather than treating "no order" as paid.
- Rejected the smaller-diff alternative — Paket as capacity-only, still free at
  creation, billing untouched — because it makes the priced selection
  informational and leaves capacity effectively free.
