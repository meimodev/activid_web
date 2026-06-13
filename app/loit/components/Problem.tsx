import { PROBLEM } from "../data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Heading } from "./ui";

export function Problem() {
  return (
    <section className="bg-[var(--loit-petrol-900)] px-5 py-[88px] sm:px-8 lg:py-[140px]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Heading
            text={PROBLEM.h2}
            className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-[var(--loit-paper)]"
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-3">
          {PROBLEM.cards.map((card) => (
            <RevealItem
              key={card.title}
              className="rounded-3xl border border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-800)] p-7"
            >
              <p className="loit-display text-xl font-bold text-[var(--loit-paper)]">
                {card.title}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--loit-mist)]">
                {card.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
