"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { FloralDivider, SectionOrnament } from "./Decorations";

interface QuoteSectionProps {
    quote: {
        text: string;
        author: string;
    };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
    if (!quote || !quote.text) return null;

    return (
        <section className="relative py-32 flex flex-col items-center justify-center text-center overflow-hidden bg-white text-stone-800">

            <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-10">
                        <SectionOrnament />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2} width="100%">
                    <div className="relative p-8">
                        {/* Decorative Quote Marks */}
                        <span className="absolute -top-6 -left-2 md:-left-8 font-serif text-8xl text-stone-200 pointer-events-none">“</span>

                        <blockquote className="font-serif text-2xl md:text-3xl italic leading-loose text-stone-700 tracking-wide relative z-10">
                            {quote.text}
                        </blockquote>

                        <span className="absolute -bottom-12 -right-2 md:-right-8 font-serif text-8xl text-stone-200 pointer-events-none transform rotate-180">“</span>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4} direction="up" width="100%">
                    <div className="mt-12 flex flex-col items-center">
                        <div className="w-12 h-px bg-stone-300 mb-4"></div>
                        <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-stone-500 font-semibold">
                            {quote.author}
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Bottom Decoration */}
            <div className="mt-16">
                <FloralDivider />
            </div>
        </section>
    );
}
