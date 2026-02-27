"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { GoldLeafBorder, DiamondAccent } from "./graphics";

interface QuoteSectionProps {
  quote: {
  text: string;
  author: string;
  };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  if (!quote || !quote.text) return null;

  return (
  <section className="section-curved relative py-24 bg-wedding-bg/60 backdrop-blur-sm flex flex-col items-center justify-center text-center overflow-hidden border-b border-wedding-accent/30">
  {/* Top Decoration */}
  <GoldLeafBorder position="top" />

  <div className="container mx-auto px-6 max-w-3xl relative z-10">
  <RevealOnScroll direction="down" width="100%">
  <div className="flex flex-col items-center mb-10">
  <DiamondAccent />
  </div>
  </RevealOnScroll>

  <RevealOnScroll delay={0.2} width="100%">
  <FloatingParallax speed={0.1}>
  <div className="relative p-8">
  {/* Decorative Quote Marks */}
  <span className="absolute -top-4 -left-2 font-serif text-8xl text-wedding-accent/10 pointer-events-none">“</span>

  <blockquote className="font-heading text-xl italic leading-loose text-wedding-dark tracking-wide relative z-10">
  {quote.text}
  </blockquote>

  <span className="absolute -bottom-12 -right-2 font-serif text-8xl text-wedding-accent/10 pointer-events-none transform rotate-180">“</span>
  </div>
  </FloatingParallax>
  </RevealOnScroll>

  <RevealOnScroll delay={0.4} direction="up" width="100%">
  <FloatingParallax speed={-0.1}>
  <div className="mt-12 flex flex-col items-center">
  <div className="w-12 h-px bg-wedding-accent/50 mb-4"></div>
  <p className="font-body text-xs uppercase tracking-[0.3em] text-wedding-text-light font-semibold">
  {quote.author}
  </p>
  </div>
  </FloatingParallax>
  </RevealOnScroll>
  </div>

  {/* Bottom Decoration */}
  <GoldLeafBorder position="bottom" />
  </section>
  );
}
