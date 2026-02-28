"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { StoryItem } from "@/types/invitation";
import { formatInvitationMonthYear } from "@/lib/date-utils";

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
    <section className="relative overflow-hidden bg-[#F6FBFF] py-12 text-[#0B1B2A] ">
      <OverlayReveal
        delay={0.06}
        idle="none"
        className="pointer-events-none absolute inset-x-0 top-38 h-[100px] w-full bg-cover bg-bottom bg-no-repeat z-0"
      >
        <motion.div
          className="h-full w-full bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.dividerFlower})` }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </OverlayReveal>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        <OverlayReveal
          delay={0.12}
          className="pointer-events-none absolute -left-40 top-12 h-[560px] w-[560px] rotate-[10deg]"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, 14, 0], y: [0, -10, 0], rotate: [10, 12, 10] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>
        <OverlayReveal
          delay={0.2}
          className="pointer-events-none absolute -right-52 bottom-14 h-[700px] w-[700px] -rotate-[12deg]"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-12, -10, -12] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>
      </div>

      <div className="container mx-auto px-4 relative z-10 ">
        <div className="mx-auto w-full max-w-[560px]">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.08}
            width="100%"
          >
            <div className="flex items-center justify-end pb-12">
              <div className="h-px flex-1 bg-[#38BDF8]/50" />
              <div className="h-2 w-2 rounded-full bg-[#38BDF8]" />
              <h2 className="font-poppins-bold text-[34px] leading-none text-[#0B1B2A] px-6 tracking-tight  ">
                {heading}
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.18}
            width="100%"
          >
            <div className="relative mt-16 p-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-[#38BDF8]/35 bg-[#EAF6FF]"
              />

              <div className="relative z-10 overflow-hidden rounded-[24px] border-2 border-[#38BDF8]/25 bg-white/80">
                {heroImageUrl ? (
                  <div className="p-5">
                    <div className="relative overflow-hidden rounded-t-[20px] rounded-tl-[300px] rounded-b-[18px] border-2 border-[#38BDF8]/30 bg-[#EAF6FF]">
                      <div className="relative aspect-[4/5]">
                        <div className="absolute inset-0">
                          <img
                            src={heroImageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/0 to-black/10" />
                        </div>

                        
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="px-7 pb-10 pt-3">
                  <div className="mt-4 space-y-10 mb-8">
                    {stories.map((story, idx) => (
                      <RevealOnScroll
                        key={idx}
                        direction="up"
                        distance={16}
                        delay={0.22 + idx * 0.08}
                        width="100%"
                      >
                        <div className="text-center">
                          <div className="mx-auto h-6 w-[2px] bg-[#38BDF8] mb-2" />

                          <p className="font-poppins-bold italic text-[14px] text-[#0284C7]">
                            {formatInvitationMonthYear(story.date)}
                          </p>
                          <p className="mt-3 font-poppins text-[13px] leading-relaxed text-[#0B1B2A]/75">
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

      <OverlayReveal
        delay={0.12}
        idle="none"
        className="pointer-events-none absolute inset-x-0 -bottom-1 h-[80px] w-full bg-cover bg-bottom bg-no-repeat z-20"
      >
        <motion.div
          className="h-full w-full bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.bottomFloral})` }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </OverlayReveal>
    </section>
  );
}
