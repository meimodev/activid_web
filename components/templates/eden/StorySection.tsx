"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import type { StoryItem } from "@/types/invitation";
import { CornerLineTopLeft, CornerLineBottomRight, TwinLineDivider, HairlineDivider } from "./graphics/ornaments";

interface StorySectionProps {
  stories: StoryItem[];
  heading: string;
  fallbackImageUrl?: string;
}

export function StorySection({
  stories,
  heading,
  fallbackImageUrl,
}: StorySectionProps) {
  if (!stories || stories.length === 0) return null;

  const heroImageUrl = stories?.[0]?.imageUrl || fallbackImageUrl;

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto w-full max-w-[600px]">
          <RevealOnScroll direction="up" distance={20} delay={0.1}>
            <div className="flex items-center justify-center gap-6 mb-16">
              <div className="h-px flex-1 bg-wedding-accent/30" />
              <h2 className="font-display italic text-center text-[48px] leading-none text-wedding-accent">
                {heading}
              </h2>
              <div className="h-px flex-1 bg-wedding-accent/30" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" distance={20} delay={0.2}>
            <div className="relative mt-8">
              <div className="relative z-10 overflow-hidden rounded-[20px] border border-wedding-accent/20 bg-transparent">
                <div className="absolute -top-2 -left-2 z-10 pointer-events-none opacity-40">
                  <CornerLineTopLeft />
                </div>
                <div className="absolute -bottom-2 -right-2 z-10 pointer-events-none opacity-40">
                  <CornerLineBottomRight />
                </div>
                {heroImageUrl && (
                  <div className="p-4">
                    <div className="relative overflow-hidden rounded-t-[140px] rounded-b-[16px] border border-wedding-accent/20">
                      <div className="relative aspect-[4/5]">
                        <img
                          src={heroImageUrl}
                          alt="Story cover"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wedding-bg/40" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-8 pb-12 pt-6">
                  <HairlineDivider />
                  <div className="space-y-12">
                    {stories.map((story, idx) => (
                      <RevealOnScroll
                        key={idx}
                        direction="up"
                        distance={20}
                        delay={0.2 + idx * 0.1}
                      >
                        <div className="text-center">
                          <TwinLineDivider />
                          <p className="font-body font-bold uppercase tracking-[0.2em] text-[12px] text-wedding-accent/80">
                            {formatInvitationMonthYear(story.date)}
                          </p>
                          <p className="mt-4 font-body text-[16px] leading-relaxed text-wedding-accent/80 italic">
                            {story.description}
                          </p>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
