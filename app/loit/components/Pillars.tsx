"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PILLARS } from "../data";
import { ICONS } from "./icons";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { Heading } from "./ui";

export function Pillars() {
  const reduce = useReducedMotion();
  // Icon badge inherits the parent RevealItem's hidden/show state, so it
  // draws in on the same staggered beat as its column.
  const badge = {
    hidden: { scale: reduce ? 1 : 0.6, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  } as const;

  return (
    <section id="fitur" className="px-5 py-[88px] sm:px-8 lg:py-[140px]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Heading
            text={PILLARS.h2}
            highlight={PILLARS.highlight}
            className="max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-[var(--loit-paper)]"
          />
        </Reveal>

        <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-3" stagger={0.12}>
          {PILLARS.items.map((p) => {
            const Icon = ICONS[p.icon];
            return (
              <RevealItem key={p.title}>
                <motion.span
                  variants={badge}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--loit-petrol-700)] text-[var(--loit-mint-500)]"
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </motion.span>
                <h3 className="loit-display mt-5 text-xl font-semibold text-[var(--loit-paper)]">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--loit-mist)]">
                  {p.body}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
