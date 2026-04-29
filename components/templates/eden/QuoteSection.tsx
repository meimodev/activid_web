"use client";

import { motion } from "framer-motion";
import { CornerLineTopLeft, CornerLineBottomRight, DiamondLine } from "./graphics/ornaments";

interface QuoteSectionProps {
  quote: {
    text: string;
    author: string;
  };
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function QuoteSection({ quote }: QuoteSectionProps) {
  if (!quote || !quote.text) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute top-0 left-4 pointer-events-none">
            <CornerLineTopLeft />
          </div>
          <div className="absolute bottom-0 right-4 pointer-events-none">
            <CornerLineBottomRight />
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Top ornament — fades in from left */}
            <motion.div
              className="mb-10 flex justify-center items-center gap-4"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "-8%" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="h-px w-14 bg-linear-to-r from-transparent to-wedding-accent/15" />
              <DiamondLine />
              <div className="h-px w-14 bg-linear-to-r from-wedding-accent/15 to-transparent" />
            </motion.div>

            {/* Blockquote — fades in from right */}
            <motion.blockquote
              className="font-body italic text-[24px] leading-relaxed text-wedding-accent/90 max-w-xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "-8%" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            >
              &ldquo;{quote.text}&rdquo;
            </motion.blockquote>

            {/* Author — fades in from left */}
            <motion.p
              className="mt-10 font-body font-bold uppercase tracking-[0.2em] text-[13px] text-wedding-accent/70"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3, margin: "-8%" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
            >
              &mdash; {quote.author}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
