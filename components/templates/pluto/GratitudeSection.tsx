"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { Host } from "@/types/invitation";

interface GratitudeSectionProps {
  hosts: Host[];
  message?: string;
}

export function GratitudeSection({ hosts, message }: GratitudeSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  return (
    <section className="relative overflow-hidden bg-wedding-bg pb-20 text-wedding-text">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-[560px]">
          <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
            <div className="relative p-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-wedding-dark/75 bg-wedding-bg-alt"
              />

              <div className="relative z-10 overflow-hidden rounded-[24px] border-2 border-wedding-dark/75 bg-wedding-bg/75">
                <div className="px-7 pb-10 pt-8 text-center">
                  <p className="text-xs tracking-[0.35em] uppercase text-wedding-dark/75 font-poppins">
                    With Love
                  </p>

                  <h2 className="mt-4 font-brittany-signature text-[64px] leading-none text-wedding-dark">
                    Terima kasih
                  </h2>

                  <p className="mt-4 text-sm text-wedding-text/80 whitespace-pre-line font-poppins">
                    {message?.trim() ||
                      "Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i."}
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <div className="h-px flex-1 bg-wedding-dark/25" />
                    <div className="mx-5 text-[11px] tracking-[0.28em] uppercase text-wedding-dark/70 font-poppins">
                      {names}
                    </div>
                    <div className="h-px flex-1 bg-wedding-dark/25" />
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
        className="pointer-events-none absolute inset-x-0 -bottom-6 h-[100px] w-full bg-cover bg-bottom bg-no-repeat z-20"
      >
        <motion.div
          className="h-full w-full bg-cover bg-bottom bg-no-repeat"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.dividerFlower})` }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </OverlayReveal>
    </section>
  );
}
