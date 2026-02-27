"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { CoupleInfo } from "./InfoSections.types";

interface GratitudeSectionProps {
  couple: CoupleInfo;
  message?: string;
}

export function GratitudeSection({ couple, message }: GratitudeSectionProps) {
  const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;

  return (
    <section className="relative overflow-hidden bg-[#F6FBFF] pb-20 text-[#0B1B2A]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-[560px]">
          <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
            <div className="relative p-4">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-[#38BDF8]/35 bg-[#EAF6FF]"
              />

              <div className="relative z-10 overflow-hidden rounded-[24px] border-2 border-[#38BDF8]/25 bg-white/80">
                <div className="px-7 pb-10 pt-8 text-center">
                  <p className="text-xs tracking-[0.35em] uppercase text-[#0284C7] font-poppins">
                    With Love
                  </p>

                  <h2 className="mt-4 font-poppins-bold text-[34px] leading-none text-[#0B1B2A] tracking-tight">
                    Terima kasih
                  </h2>

                  <p className="mt-4 text-sm text-[#0B1B2A]/75 whitespace-pre-line font-poppins">
                    {message?.trim() ||
                      "Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i."}
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <div className="h-px flex-1 bg-[#38BDF8]/35" />
                    <div className="mx-5 text-[11px] tracking-[0.28em] uppercase text-[#0284C7] font-poppins">
                      {names}
                    </div>
                    <div className="h-px flex-1 bg-[#38BDF8]/35" />
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
