"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { FloralDivider, SectionOrnament, VerticalLine } from "./graphics";

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
        <section className="py-32 relative text-center text-stone-800 bg-white">

            <div className="container mx-auto px-4 max-w-3xl">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="font-serif text-4xl text-stone-800 mb-6">{heading}</h2>
                        <SectionOrnament />
                    </div>
                </RevealOnScroll>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-stone-200" />

                    <div className="space-y-24">
                        {stories.map((story, index) => (
                            <div key={index} className="relative z-10">
                                <RevealOnScroll
                                    direction="up"
                                    delay={index * 0.15}
                                    width="100%"
                                >
                                    <div className="flex flex-col items-center gap-6">
                                        {/* Date Badge */}
                                        <div className="relative bg-white py-2 px-6 border border-stone-200 shadow-sm rounded-full">
                                            <span className="font-sans text-sm tracking-widest text-stone-500 uppercase font-bold">
                                                {story.date}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="max-w-md mx-auto relative px-8 py-8 bg-stone-50 rounded-lg shadow-sm border border-stone-100">
                                            <p className="font-body text-stone-600 text-lg leading-relaxed italic">
                                                "{story.description}"
                                            </p>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-24">
                <FloralDivider />
            </div>
        </section >
    );
}
