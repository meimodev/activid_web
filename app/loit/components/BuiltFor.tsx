import { SEGMENTS } from "../data";
import { ICONS } from "./icons";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Heading } from "./ui";

export function BuiltFor() {
  return (
    <section className="px-5 py-[88px] sm:px-8 lg:py-[140px]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Heading
            text={SEGMENTS.h2}
            highlight={SEGMENTS.highlight}
            className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-[var(--loit-paper)]"
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.cards.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <RevealItem
                key={card.title}
                className="group rounded-3xl border border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-700)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--loit-mint-500)]/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--loit-petrol-800)] text-[var(--loit-mint-500)]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="loit-display mt-4 text-lg font-semibold text-[var(--loit-paper)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--loit-mist)]">
                  {card.body}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
