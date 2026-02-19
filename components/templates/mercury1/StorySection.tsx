"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface StoryItem {
    date: string;
    description: string;
    imageUrl?: string;
}

interface StorySectionProps {
    stories: StoryItem[];
    heading: string;
    fallbackImageUrl?: string;
}

export function StorySection({ stories, heading, fallbackImageUrl }: StorySectionProps) {
    if (!stories || stories.length === 0) return null;

    const heroImageUrl = stories?.[0]?.imageUrl || fallbackImageUrl;

    return (
        <section className="relative overflow-hidden bg-[#12060a] py-24 text-white sm:py-28">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {heroImageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroImageUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mx-auto w-full max-w-[560px] text-center">
                    <RevealOnScroll direction="none" scale={1} delay={0.08} width="100%">
                        <h2 className="font-tan-mon-cheri text-[60px] leading-none text-white sm:text-[72px]">{heading}</h2>
                    </RevealOnScroll>

                    <RevealOnScroll direction="none" scale={1} delay={0.16} width="100%">
                        <div className="mt-4 flex items-center justify-center">
                            <img
                                src={MERCURY_OVERLAY_ASSETS.flowerPhotoDecorationTop}
                                alt=""
                                className="h-auto w-[300px] opacity-95"
                            />
                        </div>
                    </RevealOnScroll>

                    {heroImageUrl && (
                        <RevealOnScroll direction="none" scale={1} delay={0.26} width="100%">
                            <div className="mx-auto mt-10 w-full max-w-[420px]">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[34px] bg-white/10 p-2 ring-1 ring-white/20">
                                    <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[28px]">
                                        <img
                                            src={heroImageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    )}

                    <RevealOnScroll direction="none" scale={1} delay={0.34} width="100%">
                        <div className="relative mx-auto mt-12 w-full rounded-[38px] bg-[#612A35]/92 px-7 py-12 text-center shadow-[0_22px_55px_rgba(12,3,6,0.35)] ring-1 ring-white/10 sm:px-10">
                            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-12 bottom-12 left-1/2 w-px -translate-x-1/2 bg-white/20" />

                            <div className="space-y-10">
                                {stories.map((story, index) => (
                                    <RevealOnScroll
                                        key={index}
                                        direction="none"
                                        scale={1}
                                        delay={0.42 + index * 0.12}
                                        width="100%"
                                    >
                                        <div className="relative">
                                            <div
                                                aria-hidden
                                                className="pointer-events-none absolute left-1/2 top-[10px] h-3 w-3 -translate-x-1/2 rounded-full bg-white/70 ring-4 ring-[#612A35]/90"
                                            />

                                            <p className="font-poppins-bold italic text-[16px] tracking-wide text-white sm:text-[17px]">{story.date}</p>
                                            <p className="mt-4 font-poppins text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
                                                {story.description}
                                            </p>
                                        </div>
                                    </RevealOnScroll>
                                ))}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-contain bg-bottom bg-no-repeat opacity-95"
                style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerBottom})` }}
            />
        </section>
    );
}
