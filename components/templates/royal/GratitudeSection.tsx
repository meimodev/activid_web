"use client";

import { Host } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { Crest, Flourish, WreathSpinner } from "./graphics";
import { VineOrnamental } from "@/components/assets/vine-ornamental";

interface GratitudeSectionProps {
  hosts: Host[];
  message: string;
}

export function GratitudeSection({ hosts, message }: GratitudeSectionProps) {
  const initials =
    hosts && hosts.length >= 2
      ? `${hosts[0]?.firstName?.[0] ?? ""}&${hosts[1]?.firstName?.[0] ?? ""}`
      : hosts?.[0]?.firstName?.[0] ?? "";

  return (
    <SectionWrap
      id="gratitude"
      className="text-center overflow-hidden"
      style={{ paddingBottom: 80 }}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-0 overflow-hidden">
          <VineOrnamental className="w-full h-full opacity-45" />
        </div>
        <div className="relative inline-block mb-5.5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-55">
          <WreathSpinner size={220} />
        </div>
        <div className="relative z-[1]">
          <Crest size={130} initials={initials || "J&J"} idle />
        </div>
      </div>
      </div>
      <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)]">
        With love &amp; gratitude
      </div>
      <div className="font-[var(--font-royal-script)] text-[64px] leading-[1.2] mt-3 pt-[0.1em] pb-[0.2em] shimmer-text">
        Thank You
      </div>
      <div className="font-[var(--font-royal-serif)] text-[15px] text-[var(--invitation-text-light)] max-w-[300px] mx-auto mt-5">
        {message || "Your presence — in person or in prayer — is the greatest gift we could ask for."}
      </div>
      <div className="flex justify-center mt-7">
        <Flourish width={280} />
      </div>
      <div className="mt-4.5">
        <div className="font-[var(--font-royal-script)] text-[36px] text-[var(--invitation-accent)]">
          {hosts?.[0]?.firstName ?? "Jhon"} &amp;{" "}
          {hosts?.[1]?.firstName ?? "Jiny"}
        </div>
        <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)] mt-2">
          30 · 05 · 2026
        </div>
      </div>

      <div
        className="mt-12 pt-6 font-[var(--font-royal-sans)] text-[10px] tracking-[0.3em] uppercase"
        style={{
          borderTop: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
          color: "color-mix(in srgb, var(--invitation-text) 40%, transparent)",
        }}
      >
        Made with love · Activid · 2026
      </div>
    </SectionWrap>
  );
}
