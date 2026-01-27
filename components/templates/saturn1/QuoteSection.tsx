"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { CosmicDivider, SatrunIcon } from "./Decorations";

interface QuoteSectionProps {
    quote: {
        text: string;
        author: string;
    };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
    if (!quote || !quote.text) return null;

    return (
        <section className="relative py-32 flex flex-col items-center justify-center text-center overflow-hidden border-b border-[#D4AF37]/10 text-white">
            <div className="absolute inset-0 bg-[#0B0D17]/30 backdrop-blur-sm z-0" />

            <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-10">
                        <SatrunIcon />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2} width="100%">
                    <FloatingParallax speed={0.1}>
                        <div className="relative p-8">
                            {/* Decorative Quote Marks */}
                            <span className="absolute -top-4 -left-2 md:-left-8 font-serif text-8xl text-[#D4AF37]/20 pointer-events-none">“</span>

                            <blockquote className="font-heading text-xl md:text-2xl italic leading-loose text-white tracking-wide relative z-10">
                                {quote.text}
                            </blockquote>

                            <span className="absolute -bottom-12 -right-2 md:-right-8 font-serif text-8xl text-[#D4AF37]/20 pointer-events-none transform rotate-180">“</span>
                        </div>
                    </FloatingParallax>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4} direction="up" width="100%">
                    <FloatingParallax speed={-0.1}>
                        <div className="mt-12 flex flex-col items-center">
                            <div className="w-12 h-px bg-[#D4AF37]/50 mb-4"></div>
                            <p className="font-body text-xs md:text-sm uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                                {quote.author}
                            </p>
                        </div>
                    </FloatingParallax>
                </RevealOnScroll>
            </div>

            {/* Bottom Decoration */}
            <CosmicDivider />
        </section>
    );
}
