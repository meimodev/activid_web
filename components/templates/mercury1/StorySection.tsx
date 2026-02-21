"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { useReducedMotion } from "@/hooks";
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

export function StorySection({
  stories,
  heading,
  fallbackImageUrl,
}: StorySectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!stories || stories.length === 0) return null;

  const heroImageUrl = stories?.[0]?.imageUrl || fallbackImageUrl;

  return (
    <section className="relative overflow-hidden bg-[#12060a] py-24 text-white sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {heroImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-[4px] scale-[1.04]"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-[560px] text-center">
          <RevealOnScroll direction="none" scale={1} delay={0.08} width="100%">
            <h2 className="font-tan-mon-cheri text-[60px] leading-none text-white sm:text-[72px]">
              {heading}
            </h2>
          </RevealOnScroll>

          {heroImageUrl && (
            <RevealOnScroll
              direction="none"
              scale={1}
              delay={0.26}
              width="100%"
            >
              <div className="relative mx-auto mt-10 w-full max-w-[420px]">
                <RevealOnScroll
                  direction="none"
                  scale={1}
                  delay={0.16}
                  width="100%"
                  className="pointer-events-none absolute inset-x-0 -top-10 z-20 flex items-center justify-center"
                >
                  <motion.img
                    src={MERCURY_OVERLAY_ASSETS.flowerPhotoDecorationTop}
                    alt=""
                    className="h-auto w-[300px] opacity-95"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            x: [0, 3, -2, 6, -3, 2, 0],
                            y: [0, -1, 1, -3, 2, -1, 0],
                            rotate: [0, -1.2, 0.6, -2.4, 1.4, -0.8, 0],
                          }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 11.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.14, 0.3, 0.5, 0.68, 0.84, 1],
                            repeatDelay: 0.6,
                          }
                    }
                    style={{
                      willChange: "transform",
                      transformOrigin: "50% 92%",
                    }}
                  />
                </RevealOnScroll>
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[34px] bg-white/10 p-3 ring-1 ring-white/20 z-10">
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
            <div className="relative mx-auto -translate-y-6 w-full rounded-[38px] bg-[#612A35]/92 px-7 py-12 text-center shadow-[0_22px_55px_rgba(12,3,6,0.35)] ring-1 ring-white/10 sm:px-10 z-0">
              <div className="space-y-10">
                {stories.map((story, index) => (
                  <RevealOnScroll
                    key={index}
                    direction="none"
                    scale={1}
                    delay={0.42 + index * 0.12}
                    width="100%"
                  >
                    <div className="flex-col w-full gap-4 ">
                      <div className="flex items-center">
                        <div
                          aria-hidden
                          className="pointer-events-none h-3 w-3  rounded-full bg-white/70 ring-4 ring-[#612A35]/90"
                        />
                        <p className="flex-1 font-poppins-bold italic text-[16px] tracking-wide text-white sm:text-[17px]">
                          {story.date}
                        </p>
                      </div>
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
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-[220px] bg-contain bg-bottom bg-no-repeat opacity-95"
        style={{
          backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerBottom})`,
        }}
      />
    </section>
  );
}
