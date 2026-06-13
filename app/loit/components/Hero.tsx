"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HERO } from "../data";
import { DownloadCta, Eyebrow } from "./ui";
import { ArrowDown } from "./icons";
import { BudgetRoom } from "./BudgetRoom";

export function Hero() {
  const reduce = useReducedMotion();
  const [before, after] = HERO.h1.split(HERO.highlight);

  // Glow drifts down a touch slower than the page for subtle depth.
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  } as const;

  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:pb-28"
    >
      {/* Faint radial mint glow behind the wordmark */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{ y: reduce ? 0 : glowY }}
        className="pointer-events-none absolute left-1/2 top-24 -z-10 -ml-[340px] h-[420px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(47,232,155,0.18),transparent)] blur-2xl"
      />

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: reduce ? 0 : 0.12 }}
        >
          <motion.div variants={item}>
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            variants={item}
            className="loit-display mt-5 text-[clamp(2.75rem,8vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[var(--loit-paper)]"
          >
            {before}
            <span className="text-[var(--loit-mint-500)]">{HERO.highlight}</span>
            {after}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--loit-mist)] sm:text-lg"
          >
            {HERO.sub}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <DownloadCta label={HERO.primaryCta} />
            <Link
              href="#cara-kerja"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-[var(--loit-paper)] transition-colors hover:text-[var(--loit-mint-400)]"
            >
              {HERO.secondaryCta}
              <ArrowDown className="loit-bob h-4 w-4" />
            </Link>
          </motion.div>

          <motion.p variants={item} className="mt-5 text-sm text-[var(--loit-mist)]">
            {HERO.trust}
          </motion.p>
        </motion.div>

        {/* Static populated room as the hero visual */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center lg:justify-end"
        >
          <BudgetRoom beat={4} />
        </motion.div>
      </div>
    </section>
  );
}
