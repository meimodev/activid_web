# 8. KenanganKita: usage-priced AI enhancement, per-photo paid flag, generative model

Date: 2026-07-16

## Status

Accepted. Supersedes the enhancement **economics** of the spec (§6, §7) and the
`enhancementPurchased` gate introduced in ADR-0007. Builds on the per-photo,
host-paced enhancement flow (ADR-0007) and the upfront Paket charge (ADR-0005),
which is unchanged — tiers still gate going Live, metered by guest count.

## Context

The spec priced enhancement as a **flat unlock**: one `enhancementPurchased:
boolean` per event (admin-confirmed order) let the host enhance any photo for
free, and the AI was **Real-ESRGAN restoration-only** under two non-negotiable
rules (spec §3): *"the LUT owns colour, the AI owns pixels"* and *"restorative,
never generative — never a mangled face."*

Two product decisions changed this:

1. **Enhancement should be usage-priced, not a flat unlock**, and a **guest**
   should be able to pay for enhancement out of their own pocket — not only the
   host.
2. The enhancement model should be **`openai/gpt-image-2`** (a generative image
   editor), not Real-ESRGAN.

Both cut against the spec as written: the flat unlock, the guest-count metering,
and the "never generative" rule.

## Decision

### Pricing — flat Rp 3,000 per photo

- Enhancement is **Rp 3,000 per photo**, a flat price. No margin formula, no
  per-10 blocks, no rounding step (the price is already whole-thousand).
- **Host and guest pay the same** Rp 3,000/photo.
- COGS is a **viability check, not a price basis**: at `openai/gpt-image-2`
  `quality: medium` (~Rp 760/photo at 18,060 IDR/USD) the ~75% margin holds;
  `high` (~Rp 3,015) is break-even and is rejected. (Confirm the exact Replicate
  per-image price before launch.)
- Tiers (Intimate/Standard/…) are untouched — they remain the guest-count Paket
  charge that gates going Live (ADR-0005). Enhancement is a separate, additive,
  usage-based line.

### Payment tracking — per-photo `paid` flag

`enhancementPurchased: boolean` is **retired** (kept only as a legacy
grandfather; see below). Payment is tracked **per photo**, which unifies the
host and guest paths onto one field:

- `KenanganPhoto` gains `paid?: boolean`, `paidBy?: "host" | "guest"`,
  `paidAt?`, `paidOrderId?`. Absent = unpaid.
- `KenanganOrder` gains `photoIds?: string[]` recording which photos an
  `enhancement` order covered.
- **Enhance route gate** changes from `if (!event.enhancementPurchased)` to
  `if (!photo.paid && !event.enhancementPurchased)` — the old bool grandfathers
  any legacy event as all-photos-paid.
- **Failure keeps `paid`**: a failed enhance sets `enhanceState: "failed"` but
  leaves `paid: true` — already paid, retry allowed, no re-charge.

### Two payer paths

- **Host-pay (buildable now).** In post-close curation the host multi-selects
  photos, sees a total (N × Rp 3,000), pays via the existing manual flow
  (WhatsApp/transfer → admin confirms a `kenanganOrder{kind:"enhancement",
  amountIdr, photoIds}` and sets `paid` on those photos), then enhances them
  per-photo in the lightbox (host-paced, ADR-0007).
- **Guest-pay ("out-of-guest-pocket", designed now, checkout ships later).**
  Any visitor to the **closed public gallery** may select any *unpaid* photos
  and pay Rp 3,000 each — **no identity or ownership is tracked**. "Selected by
  the guest itself" means the guest does the choosing (vs the host) and pays for
  that subset; it does **not** mean "photos the guest captured" (`guestSessionId`
  stays capture-attribution/rate-limit only). On payment the photos flip to
  `paid:true, paidBy:"guest"` and the enhance auto-enqueues (guest paid, wants
  the result — no host action). The **checkout rail is blocked on the Phase-2
  payment gateway** and is out of scope here; until then the guest flow is
  select + total + a stubbed "cara bayar".

### Model — `openai/gpt-image-2` (generative)

This **reverses spec §3's "restorative, never generative" rule.** Accepted
deliberately. The mitigation is a conservative, identity-preserving prompt:

```json
{
  "model": "openai/gpt-image-2",
  "input": {
    "prompt": "Restore and enhance this event photograph. Improve sharpness, reduce motion blur and noise, correct exposure and white balance for natural skin tones, and recover detail in shadows and highlights. Preserve the exact composition, framing, people, faces, expressions, clothing, and background — do not add, remove, reposition, or alter any person or object, and do not change anyone's identity or facial features. Keep it fully photorealistic; no stylization, no beautification.",
    "input_images": ["<full-res ImageKit URL of the original photo>"],
    "quality": "medium",
    "aspect_ratio": "auto",
    "background": "opaque",
    "output_format": "jpeg",
    "output_compression": 90,
    "moderation": "low",
    "number_of_images": 1
  }
}
```

- **Drop the server-side LUT re-apply for enhanced photos.** gpt-image-2 owns
  colour now, so re-applying the stored `.cube` on top would double-grade. The
  **capture-time WebGL LUT preview stays** for the live feed; only the
  post-enhance re-grade is removed. This also retires the spec §12 LUT-parity
  risk for enhanced photos.
- **Aspect ratio**: request `auto`, then crop/resize the output back to the
  original photo's exact aspect ratio in the webhook (`sharp`) so dimensions
  match the original and framing is preserved.
- **Failure/moderation**: `moderation: low`; on block or failure keep the
  original, set `enhanceState: "failed"`, `paid` stays.

## Implementation checklist

- **`types/kenangan.ts`** — add `paid?`, `paidBy?`, `paidAt?`, `paidOrderId?` to
  `KenanganPhoto`; add `photoIds?` to `KenanganOrder`; mark
  `KenanganEvent.enhancementPurchased` deprecated (read-only legacy).
- **`app/api/kenangan/enhance/route.ts`** — gate on
  `photo.paid || event.enhancementPurchased` (not `enhancementPurchased` alone);
  keep the closed/published gate.
- **`lib/kenangan-enhance.ts` / enhance call** — swap Real-ESRGAN for
  `openai/gpt-image-2` with the config above; pass the original ImageKit URL as
  `input_images`.
- **`app/api/kenangan/replicate/webhook/route.ts`** — on success crop/resize the
  output back to the original aspect ratio, upload, set `enhancedPath`, clear
  `enhanceState`; **drop the server LUT re-apply**; on failure set
  `enhanceState: "failed"` (leave `paid`).
- **Host-pay UX** (wayfinder ticket #9) — post-close multi-select + total +
  manual-pay handoff; paid/unpaid/enhancing states.
- **Guest-pay UX** (wayfinder ticket #10) — closed-gallery multi-select + total
  + stubbed checkout (real rail blocked on Phase-2).
- **Order flow** — admin confirmation of an `enhancement` order sets `paid` on
  the order's `photoIds`.

## Consequences

- **Enhancement revenue scales with usage**, not a one-time unlock; a guest can
  now fund their own enhanced photos, widening the opt-in surface beyond the host.
- **One `paid` field serves both payers** — no separate guest mechanism, no
  identity system, no ownership binding to build.
- **The "never generative" safety rule is gone.** gpt-image-2 can alter faces;
  the conservative prompt is the only guard. If waxy/altered faces appear in
  testing, tighten the prompt or reconsider the model — the failure policy still
  keeps the original, never shipping a mangled result.
- **Colour is now the model's, not the LUT's**, for enhanced photos. The live
  feed keeps its client-side LUT preview; only the final enhanced image diverges
  from the deterministic grade.
- **Margin depends on the quality tier.** `medium` holds ~75%; `high` is
  break-even at Rp 3,000. Locked to `medium`; revisit if quality is insufficient.
- **Guest checkout is deferred** — the model and UX are specified now, but no
  guest can actually pay until the Phase-2 gateway lands.
