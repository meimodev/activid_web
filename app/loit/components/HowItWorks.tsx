"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { HOW_IT_WORKS } from "../data";
import { BudgetRoom, type Beat } from "./BudgetRoom";
import { Eyebrow, Heading } from "./ui";

function StepList({ active }: { active: Beat }) {
  // Connector runs through the circle centers (h-9 circle → 18px center,
  // space-y-3 → 12px gap); fills mint as beats advance.
  const fill = (active - 1) / (HOW_IT_WORKS.steps.length - 1);
  return (
    <ol className="relative space-y-3">
      <span
        aria-hidden
        className="absolute left-[17px] top-[18px] w-0.5 bg-[var(--loit-petrol-600)]"
        style={{ height: "calc(100% - 36px)" }}
      >
        <motion.span
          className="block w-full origin-top rounded-full bg-[var(--loit-mint-500)]"
          style={{ height: "100%" }}
          initial={false}
          animate={{ scaleY: fill }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </span>
      {HOW_IT_WORKS.steps.map((s) => {
        const isActive = s.n === active;
        const done = s.n < active;
        return (
          <li key={s.n} className="flex items-center gap-3">
            <span
              className={`loit-num relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                isActive || done
                  ? "border-[var(--loit-mint-500)] bg-[var(--loit-mint-500)] text-[var(--loit-petrol-900)]"
                  : "border-[var(--loit-petrol-600)] text-[var(--loit-mist)]"
              }`}
            >
              {s.n}
            </span>
            <span
              className={`text-base font-medium transition-colors duration-300 ${
                isActive ? "text-[var(--loit-paper)]" : "text-[var(--loit-mist)]"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Header() {
  return (
    <div className="mb-4">
      <Eyebrow>{HOW_IT_WORKS.eyebrow}</Eyebrow>
      <Heading
        text={HOW_IT_WORKS.h2}
        highlight={HOW_IT_WORKS.highlight}
        className="mt-4 max-w-xl text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-tight text-[var(--loit-paper)]"
      />
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState<Beat>(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = (p < 0.25 ? 1 : p < 0.5 ? 2 : p < 0.75 ? 3 : 4) as Beat;
    setBeat((prev) => (prev === next ? prev : next));
  });

  // Reduced motion: finished room + all step labels, no scroll sequence.
  if (reduce) {
    return (
      <section
        id="cara-kerja"
        className="bg-[var(--loit-petrol-900)] px-5 py-[88px] sm:px-8 lg:py-[140px]"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
          <div>
            <Header />
            <StepList active={4} />
          </div>
          <div className="flex justify-center">
            <BudgetRoom beat={4} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="cara-kerja"
      ref={sectionRef}
      className="relative bg-[var(--loit-petrol-900)] px-5 sm:px-8"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex min-h-screen items-center py-20">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 lg:grid-cols-2">
          <div>
            <Header />
            <StepList active={beat} />
          </div>
          <motion.div
            key="room"
            className="flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <BudgetRoom beat={beat} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
