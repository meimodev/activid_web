"use client";

import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { SignalDivider, SatrunIcon } from "./graphics";

interface QuoteSectionProps {
  quote: {
  text: string;
  author: string;
  };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  if (!quote || !quote.text) return null;

  return (
  <section className="relative py-32 flex flex-col items-center justify-center text-center overflow-hidden border-b border-wedding-accent/10 text-wedding-on-dark">
  <div className="absolute inset-0 bg-wedding-dark/30 backdrop-blur-sm z-0" />

  <div className="container mx-auto px-6 max-w-3xl relative z-10">
  <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.18} className="w-full">
    <div className="flex flex-col items-center mb-10">
      <SatrunIcon />
    </div>

    <div className="relative p-8">
      {/* Decorative Quote Marks */}
      <span className="absolute -top-4 -left-2 font-serif text-8xl text-wedding-accent/20 pointer-events-none">“</span>

      <blockquote className="font-heading text-xl italic leading-loose text-wedding-on-dark tracking-wide relative z-10">
        {quote.text}
      </blockquote>

      <span className="absolute -bottom-12 -right-2 font-serif text-8xl text-wedding-accent/20 pointer-events-none transform rotate-180">“</span>
    </div>

    <div className="mt-12 flex flex-col items-center">
      <div className="w-12 h-px bg-wedding-accent/50 mb-4"></div>
      <p className="font-body text-xs uppercase tracking-[0.3em] text-wedding-accent font-semibold">
        {quote.author}
      </p>
    </div>
  </StaggerRevealOnScroll>
  </div>

  {/* Bottom Decoration */}
  <SignalDivider />
  </section>
  );
}
