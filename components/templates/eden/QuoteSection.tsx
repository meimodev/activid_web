"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { CornerLineTopLeft, CornerLineBottomRight, DiamondLine } from "./graphics/ornaments";

interface QuoteSectionProps {
  quote: {
    text: string;
    author: string;
  };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  if (!quote || !quote.text) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative mx-auto max-w-2xl text-center">
          <div className="absolute top-0 left-4 pointer-events-none">
            <CornerLineTopLeft />
          </div>
          <div className="absolute bottom-0 right-4 pointer-events-none">
            <CornerLineBottomRight />
          </div>

          <RevealOnScroll direction="up" distance={20} delay={0.1}>
            <div className="mb-8 flex justify-center items-center gap-4">
              <div className="h-px w-14 bg-linear-to-r from-transparent to-wedding-accent/15" />
              <DiamondLine />
              <div className="h-px w-14 bg-linear-to-r from-wedding-accent/15 to-transparent" />
            </div>
            
            <blockquote className="mx-auto font-body italic text-[24px] leading-relaxed text-wedding-accent/90">
              "{quote.text}"
            </blockquote>
          </RevealOnScroll>

          <RevealOnScroll direction="up" distance={20} delay={0.2}>
            <p className="mt-8 font-body font-bold uppercase tracking-[0.2em] text-[13px] text-wedding-accent/70">
              — {quote.author}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
