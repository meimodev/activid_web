"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "./RevealOnScroll";
import { GoldLeafBorder, DiamondAccent, HeartDivider, RingsDivider } from "./Decorations";

interface StoryItem {
    date: string;
    description: string;
}

interface StorySectionProps {
    stories: StoryItem[];
    heading: string;
}

export function StorySection({ stories, heading }: StorySectionProps) {
    if (!stories || stories.length === 0) return null;

    return (
        <section className="py-24 bg-wedding-bg-alt/30 backdrop-blur-sm text-center relative border-b border-wedding-accent/30">
            <GoldLeafBorder position="top" />

            <div className="container mx-auto px-4 max-w-3xl">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-12">
                        <DiamondAccent />
                        <h2 className="font-heading text-3xl uppercase tracking-[0.2em] text-wedding-accent mb-4 mt-4">{heading}</h2>
                        <HeartDivider />
                    </div>
                </RevealOnScroll>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-linear-to-b from-transparent via-wedding-accent/30 to-transparent" />

                    <div className="space-y-16">
                        {stories.map((story, index) => (
                            <div key={index} className="relative z-10">
                                <RevealOnScroll
                                    direction="up"
                                    delay={index * 0.15}
                                    width="100%"
                                >
                                    <div className="flex flex-col items-center gap-6">
                                        {/* Date Badge */}
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-wedding-bg blur-md rounded-full" />
                                            <span className="relative z-10 inline-block py-2 px-8 border border-wedding-accent/40 rounded-full font-heading text-sm tracking-[0.15em] bg-white/80 backdrop-blur-sm shadow-sm text-wedding-accent font-bold uppercase">
                                                {story.date}
                                            </span>
                                        </div>

                                        {/* Center Point */}
                                        <div className="w-3 h-3 bg-wedding-accent rotate-45 ring-4 ring-wedding-bg-alt/50" />

                                        {/* Content */}
                                        <div className="max-w-md mx-auto relative px-4 py-2">
                                            <div className="absolute inset-0 bg-white/40 blur-xl rounded-full -z-10" />
                                            <p className="font-body text-wedding-text text-lg leading-relaxed italic">
                                                "{story.description}"
                                            </p>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            </div>
                        ))}
                    </div>

                    {/* End Ornament */}
                    <div className="mt-16 relative z-10 bg-wedding-bg-alt inline-block p-4 rounded-full">
                        <RingsDivider />
                    </div>
                </div>
            </div>
        </section>
    );
}
