"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { CosmicDivider, StarDivider, SatrunIcon } from "./graphics";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import type { StoryItem } from "@/types/invitation";

interface StorySectionProps {
    stories: StoryItem[];
    heading: string;
}

export function StorySection({ stories, heading }: StorySectionProps) {
    if (!stories || stories.length === 0) return null;

    return (
        <section className="py-32 relative text-center border-b border-[#D4AF37]/10 text-white">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

            <div className="container mx-auto px-4 max-w-3xl">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-12">
                        <SatrunIcon />
                        <FloatingParallax speed={-0.2}>
                            <h2 className="font-heading text-3xl uppercase tracking-[0.2em] text-[#D4AF37] mb-4 mt-4 text-glow">{heading}</h2>
                        </FloatingParallax>
                        <StarDivider />
                    </div>
                </RevealOnScroll>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-[#D4AF37]/30 to-transparent" />

                    <div className="space-y-16">
                        {stories.map((story, index) => (
                            <div key={index} className="relative z-10">
                                <RevealOnScroll
                                    direction="up"
                                    delay={index * 0.15}
                                    width="100%"
                                >
                                    <FloatingParallax speed={0.1}>
                                        <div className="flex flex-col items-center gap-6">
                                            {/* Date Badge */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[#D4AF37] blur-md rounded-full opacity-30" />
                                                <span className="relative z-10 inline-block py-2 px-8 border border-[#D4AF37]/40 rounded-full font-heading text-sm tracking-[0.15em] bg-black/80 backdrop-blur-sm shadow-sm text-[#D4AF37] font-bold uppercase">
                                                    {formatInvitationMonthYear(story.date)}
                                                </span>
                                            </div>

                                            {/* Center Point */}
                                            <div className="w-3 h-3 bg-[#D4AF37] rotate-45 ring-4 ring-black" />

                                            {/* Content */}
                                            <div className="max-w-md mx-auto relative px-4 py-2">
                                                <div className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10" />
                                                <p className="font-body text-white/90 text-lg leading-relaxed italic">
                                                    &ldquo;{story.description}&rdquo;
                                                </p>
                                            </div>
                                        </div>
                                    </FloatingParallax>
                                </RevealOnScroll>
                            </div>
                        ))}
                    </div>

                    {/* End Ornament */}
                    <div className="mt-16 relative z-10 bg-black inline-block p-4 rounded-full border border-[#D4AF37]/20">
                        <SatrunIcon />
                    </div>
                </div>
            </div>
            <CosmicDivider />
        </section >
    );
}
