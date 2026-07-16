# KenanganKita enhancement COGS + FX inputs (research for GitHub issue #3)

**Research date:** 2026-07-16. All figures are point-in-time and should be re-checked before being hard-coded into a pricing formula.

## Summary

Fully-loaded COGS per AI-enhanced photo is estimated at **≈ $0.0019 USD ≈ Rp 34/photo** (round to ~Rp 35–50/photo for a safety margin), using today's USD/IDR rate of **1 USD = 18,060 IDR** (Wise, 2026-07-16). This is *lower*, not higher, than the spec's current assumption — the spec's $0.007/photo Replicate estimate appears too high for a restoration-only run (scale 1, `face_enhance: false`); a reasoned estimate from Replicate's official T4 hardware rate puts the Replicate cost closer to **$0.0007–$0.0020/photo** (point estimate **$0.0015**). The LUT re-apply (Vercel function) and incremental ImageKit storage/bandwidth are both **negligible** (combined ≈ $0.0004, ~25% of the Replicate line but only fractions of a cent in absolute terms) and do not change the order of magnitude. Net effect: the spec's ~2%-of-revenue COGS assumption holds comfortably, with more margin than originally assumed, not less.

---

## 1. Replicate Real-ESRGAN pricing

**Billing model (confirmed primary source):** Replicate bills public/community models (run via the normal prediction API, not a private deployment) **only for active processing time** — setup and idle time are not billed for this billing path. Cost = `predict_time_seconds × price_per_second_of_hardware`.
Source: https://replicate.com/docs/topics/billing

**Official hardware pricing table** (https://replicate.com/pricing, fetched 2026-07-16):

| Hardware | $/second | $/hour |
|---|---|---|
| CPU (small) | $0.000025 | $0.09 |
| CPU | $0.000100 | $0.36 |
| Nvidia T4 GPU | $0.000225 | $0.81 |
| Nvidia L40S GPU | $0.000975 | $3.51 |
| Nvidia A100 (80GB) GPU | $0.001400 | $5.04 |
| Nvidia H100 GPU | $0.001525 | $5.49 |

(Replicate has migrated off A40; L40S is the current mid-tier successor. Source: https://replicate.com/pricing)

**Model hardware:** `nightmareai/real-esrgan` (the model referenced in the spec) runs on **T4** hardware. Its own model page (https://replicate.com/nightmareai/real-esrgan) does not expose a machine-readable "$X to run" figure via a plain HTML fetch (the run-cost widget is client-rendered), so no single authoritative "$X to run" string could be pulled directly for this exact model+config. A comparable official-style fork, `lucataco/real-esrgan` (https://replicate.com/lucataco/real-esrgan), *does* show its estimate: **~$0.031/run, ~23s, on A100 (80GB)** — but that figure reflects the model's *default* demo settings (typically an actual upscale pass, and possibly GFPGAN face enhancement), not the restoration-only (`scale: 1`, `face_enhance: false`) configuration this app uses.

**Reasoning for a restoration-only run:**
- `face_enhance: false` skips the GFPGAN face-restoration network entirely — a meaningful share of a "full" Real-ESRGAN run's compute.
- `scale: 1` means no 2×/4× upsampling arithmetic, which is the other major cost driver of a Real-ESRGAN pass.
- On T4 hardware ($0.000225/s), a restoration-only pass is plausibly in the **4–8 second** active-compute range (vs. the ~12–23s reported for full upscale+face-enhance runs on various hardware tiers), giving:
  - Low end: 4s × $0.000225 = **$0.0009**
  - High end: 8s × $0.000225 = **$0.0018**
  - **Point estimate (6.5s): $0.0015/photo**

**Verdict on the spec's $0.007/photo assumption:** likely **too high by roughly 3.5–8×** for this specific configuration, given (a) Replicate's public-model billing only charges active compute (no idle/setup charge), (b) T4 is the cheapest relevant GPU tier and is what this model runs on, and (c) restoration-only settings are meaningfully cheaper than the default demo config that most published "$X to run" figures reflect. Recommend revising the working assumption down to **~$0.0015/photo**, while keeping $0.007 as a conservative upper-bound worst case in the pricing formula if the team wants a bigger buffer.

---

## 2. Current USD→IDR exchange rate

**Current rate:** 1 USD = **18,060 IDR** (mid-market rate, fetched 2026-07-16).
Source: https://wise.com/us/currency-converter/usd-to-idr-rate

**Volatility (same source, historical stats as of fetch date):**
| Window | High | Low | Average | Change |
|---|---|---|---|---|
| Last 30 days | 18,164 | 17,743 | 17,959 | +1.80% |
| Last 90 days | 18,209 | 17,130.5 | 17,712.6 | +5.39% |

A secondary corroborating data point from search (not independently fetched as primary): 12-month rupiah depreciation vs. USD was cited around -10.9% by Wise's own summary text. Treat that longer-window figure as indicative, not verified via direct fetch.

**Implication for pricing-formula margin:** month-to-month swings of ~2% and quarter-over-quarter swings of ~5% are realistic. A pricing formula that re-prices in Rupiah relatively infrequently (e.g., not tracking FX in real time) should carry at least a **5% FX buffer** on the COGS line to absorb normal quarterly drift, more if tier prices are locked for longer periods.

---

## 3. Materiality — LUT re-apply (Vercel) + ImageKit

### Vercel function cost (LUT re-apply via `sharp`)

Official pricing/mechanics: https://vercel.com/docs/functions/usage-and-pricing

Vercel Fluid Compute bills two components on Pro: **Active CPU** (only while code is actively executing, billed per CPU-hour) and **Provisioned Memory** (billed for the full instance lifetime in GB-hours). Regional example from the docs (São Paulo): a 4GB function with 4s active CPU and a 10s total instance lifetime costs $0.0004489/invocation.

For a US region (e.g. `iad1`, Washington D.C.): Active CPU $0.128/hr, Provisioned Memory $0.0106/GB-hr.

Estimate for this workload — `sharp` LUT application on one already-uploaded photo, ~1GB memory, ~1.5s of actual CPU-bound image work, ~4s total instance lifetime (including I/O to/from ImageKit):
- CPU: 1.5s / 3600 × $0.128 ≈ **$0.0000533**
- Memory: 1GB × 4s / 3600 × $0.0106 ≈ **$0.0000118**
- Invocation fee: on-demand invocations billed at $0.60/million ≈ **$0.0000006**
- **Total ≈ $0.00007/photo**

### ImageKit incremental storage/bandwidth

Official pricing: https://imagekit.io/plans

Pro plan: 225GB storage included, then **$0.09/GB**; 225GB bandwidth included, then **$0.45/GB**.

For one additional ~5MB enhanced photo (0.005GB): incremental storage overage cost ≈ 0.005 × $0.09 ≈ **$0.00045** (only relevant once the account is already past its included 225GB — for most of this app's likely volume it will be **$0** since it sits inside the included allowance). Bandwidth is not meaningfully incremental: the enhanced photo typically *replaces* what would otherwise have been served (the original), rather than adding a fully separate multiplied delivery stream, so treat it as ~$0 marginal within existing included bandwidth for realistic guest-view volumes.

**Conclusion: $0.00 – $0.0005/photo**, i.e., effectively **$0** in the common case (within included Pro allowances) and at most ~$0.0005 in a worst case where storage is already at the overage tier.

### Materiality verdict

Combined Vercel + ImageKit ≈ **$0.0001–$0.0006/photo**, roughly **7–40% of the revised Replicate estimate ($0.0015)** depending on assumptions, but only **fractions of a US cent (well under Rp 10) in absolute terms**. Recommendation: **include a small flat buffer** (e.g., $0.0003–$0.0005, ~Rp 5–9) in the COGS formula for completeness/conservatism, but treat it as **immaterial to the pricing decision** — it does not change the order of magnitude of the Replicate line, which remains the dominant cost driver.

---

## 4. Bottom line: fully-loaded COGS per enhanced photo

| Line item | USD | Basis |
|---|---|---|
| Replicate Real-ESRGAN (restoration-only, T4) | $0.0015 | §1 point estimate (6.5s × $0.000225/s) |
| Vercel LUT re-apply (`sharp`, Fluid Compute) | $0.0001 | §3 |
| ImageKit incremental storage/bandwidth | $0.0003 | §3 (conservative, non-zero case) |
| **Total USD/photo** | **$0.0019** | |
| **USD→IDR @ 18,060** | **≈ Rp 34.3/photo** | §2 |

**Bottom line: ≈ Rp 34/photo**, round to **Rp 35–50/photo** for a working COGS constant with FX/runtime-variance buffer built in.

For context, the spec's original assumption ($0.007/photo Replicate cost only, no LUT/ImageKit line, at an unspecified older FX rate) implied roughly Rp 100+/photo. This research revises that **down**, reinforcing — not undermining — the spec's assumption that enhancement COGS is a small (well under 2%, likely closer to a fraction of a percent for mid/high tiers) share of per-event revenue.
