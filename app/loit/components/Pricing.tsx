import { PRICING } from "../data";
import { Check } from "./icons";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { DownloadCta, Heading } from "./ui";

export function Pricing() {
  return (
    <section id="harga" className="px-5 py-[88px] sm:px-8 lg:py-[140px]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="text-center">
          <Heading
            text={PRICING.h2}
            highlight={PRICING.highlight}
            className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-[var(--loit-paper)]"
          />
          <p className="mx-auto mt-4 max-w-md text-[17px] text-[var(--loit-mist)]">
            {PRICING.sub}
          </p>
        </Reveal>

        {/* Pro is listed first on mobile (DOM order) so the recommended tier
            leads when cards stack; reordered on desktop via grid order. */}
        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" stagger={0.1}>
          {[...PRICING.tiers]
            .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
            .map((tier) => {
              const order = tier.name === "Free" ? "lg:order-1" : tier.name === "Lite" ? "lg:order-2" : "lg:order-3";
              return (
                <RevealItem
                  key={tier.name}
                  className={`relative flex flex-col rounded-3xl border p-7 transition-transform duration-300 [transition-timing-function:var(--loit-ease-out-expo)] hover:-translate-y-1.5 ${order} ${
                    tier.featured
                      ? "loit-pulse border-[var(--loit-mint-500)] bg-[var(--loit-petrol-700)]"
                      : "border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-700)]"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[var(--loit-mint-500)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--loit-petrol-900)]">
                      ⭐ Rekomendasi
                    </span>
                  )}
                  <h3 className="loit-display text-2xl font-bold text-[var(--loit-paper)]">
                    {tier.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="loit-num text-3xl font-bold text-[var(--loit-paper)]">
                      {tier.price}
                    </span>
                    {tier.priceSuffix && (
                      <span className="text-sm text-[var(--loit-mist)]">{tier.priceSuffix}</span>
                    )}
                  </p>

                  <ul className="mt-6 space-y-3 text-[15px] text-[var(--loit-paper)]">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-[var(--loit-mint-500)]" />
                      {tier.scans}
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 shrink-0 text-[var(--loit-mint-500)]" />
                      Buat {tier.rooms}
                    </li>
                  </ul>

                  {tier.note && (
                    <p className="mt-4 text-sm text-[var(--loit-mint-400)]">{tier.note}</p>
                  )}

                  <div className="mt-auto pt-7">
                    <DownloadCta label={PRICING.cta} size="md" className="w-full" />
                  </div>
                </RevealItem>
              );
            })}
        </RevealGroup>

        <Reveal className="mx-auto mt-8 max-w-2xl">
          <ul className="space-y-1.5 text-center text-sm text-[var(--loit-mist)]">
            {PRICING.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
