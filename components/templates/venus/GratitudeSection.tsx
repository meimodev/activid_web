"use client";

import type { Host } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { VenusReveal } from "./reveal";

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
    <SectionWrap id="gratitude" title="Gratitude">
      <VenusReveal direction="up" width="100%" delay={0.12}>
        <div className="rounded-[32px] border border-white/10 bg-wedding-dark/55 backdrop-blur p-8 text-center text-wedding-on-dark shadow-[0_22px_70px_rgba(0,0,0,0.35)]">
          <p className="text-sm leading-relaxed text-wedding-on-dark/85 whitespace-pre-line">
            {effectiveMessage
              ? effectiveMessage
              : "Atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i."}
          </p>

          <div className="mt-8 flex items-center justify-center">
            <div className="h-px flex-1 bg-white/10" />
            <div className="mx-5 text-[11px] tracking-[0.28em] uppercase text-wedding-on-dark/65 font-body">
              {names}
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </VenusReveal>
    </SectionWrap>
  );
}
