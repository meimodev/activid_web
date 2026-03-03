"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { Host } from "@/types/invitation";

export function GratitudeSection({
  hosts,
  message,
}: {
  hosts: Host[];
  message: string;
}) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;
  const effectiveMessage = message?.trim();

  return (
    <section className="relative overflow-hidden bg-white py-24 text-stone-800">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-[560px] text-center">
          <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
            <h2 className="font-tan-mon-cheri text-[60px] leading-none text-[#612A35]">
              Terima kasih
            </h2>
          </RevealOnScroll>

          <RevealOnScroll direction="up" distance={18} delay={0.18} width="100%">
            <div className="mt-10 rounded-[32px] border border-black/10 bg-white/70 backdrop-blur p-8 shadow-[0_22px_70px_rgba(44,11,19,0.12)]">
              <p className="text-sm leading-relaxed text-[#612A35]/80 whitespace-pre-line">
                {effectiveMessage
                  ? effectiveMessage
                  : "Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i."}
              </p>

              <div className="mt-8 flex items-center justify-center">
                <div className="h-px flex-1 bg-black/10" />
                <div className="mx-5 text-[11px] tracking-[0.28em] uppercase text-[#612A35]/60 font-poppins-bold">
                  {names}
                </div>
                <div className="h-px flex-1 bg-black/10" />
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
