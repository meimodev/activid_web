"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { GoldLeafBorder, DiamondAccent, HeartDivider } from "./graphics";
import type { Host } from "@/types/invitation";

interface GratitudeSectionProps {
  hosts: Host[];
  message?: string;
}

export function GratitudeSection({ hosts, message }: GratitudeSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  return (
    <section className="section-curved py-24 bg-wedding-bg/60 backdrop-blur-sm text-center relative border-b border-wedding-accent/30 overflow-hidden">
      <GoldLeafBorder position="top" />

      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <div className="flex flex-col items-center mb-10">
            <DiamondAccent />
            <h2 className="font-brittany-signature text-5xl text-gold-gradient mb-4 mt-4 leading-[1.08] py-1">
              Terima kasih
            </h2>
            <HeartDivider />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.18} width="100%">
          <div className="bg-wedding-bg p-8 rounded-sm shadow-xl border border-wedding-accent/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-wedding-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <p className="font-garet-book text-wedding-text-light italic leading-relaxed whitespace-pre-line">
              {message?.trim() ||
                "Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i."}
            </p>

            <div className="mt-8 flex items-center justify-center">
              <div className="h-px flex-1 bg-wedding-accent/25" />
              <div className="mx-5 text-[11px] tracking-[0.28em] uppercase text-wedding-accent/70 font-garet-book font-bold">
                {names}
              </div>
              <div className="h-px flex-1 bg-wedding-accent/25" />
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <GoldLeafBorder position="bottom" />
    </section>
  );
}
