"use client";

import { Host } from "@/types/invitation";
import {
  VineBorder,
  GrandDivider,
  WreathSpinner,
  Crest,
  Flourish,
} from "./graphics";
import { Reveal } from "./graphics/reveal";

interface HeroSectionProps {
  hosts: Host[];
  date: string;
  subtitle: string;
}

export function HeroSection({ hosts, date, subtitle }: HeroSectionProps) {
  const brideName = hosts?.[0]?.shortName ?? hosts?.[0]?.firstName ?? "Jhon";
  const groomName = hosts?.[1]?.shortName ?? hosts?.[1]?.firstName ?? "Jiny";

  return (
    <section
      id="home"
      className="relative text-center overflow-hidden"
      style={{ padding: "64px 28px 56px" }}
    >
      {/* Side vines */}
      <div
        className="absolute top-12 bottom-12 left-[-8px] w-11 opacity-45 pointer-events-none z-0"
      >
        <VineBorder height={780} side="left" />
      </div>
      <div
        className="absolute top-12 bottom-12 right-[-8px] w-11 opacity-45 pointer-events-none z-0"
      >
        <VineBorder height={780} side="right" />
      </div>

      {/* Content column */}
      <div className="relative z-[1] max-w-[300px] mx-auto">
        <Reveal>
          <div className="font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase text-[var(--invitation-accent)] font-medium mb-4.5">
            The Wedding of
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex justify-center mb-5.5">
            <GrandDivider width={220} />
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="relative w-[220px] h-[220px] mx-auto">
            <div className="absolute inset-0 flex items-center justify-center opacity-50 z-0">
              <WreathSpinner size={220} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-[1]">
              <Crest size={130} initials={`${hosts?.[0]?.firstName?.[0] ?? "J"}&${hosts?.[1]?.firstName?.[0] ?? "J"}`} idle />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <h1 className="font-[var(--font-royal-serif)] font-light text-[13px] tracking-[0.46em] uppercase text-[var(--invitation-accent)] mt-7">
            {subtitle || "Save The Date"}
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-3.5">
            <div className="font-[var(--font-royal-script)] text-[72px] leading-[1.18] pt-[0.1em] pb-[0.18em] shimmer-text">
              {brideName}
            </div>
            <div className="flex items-center justify-center gap-3.5 my-1 max-w-[220px] mx-auto">
              <span className="flex-1 h-px" style={{ background: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)" }} />
              <span className="font-[var(--font-royal-serif)] italic text-[22px] text-[var(--invitation-text-light)]">&amp;</span>
              <span className="flex-1 h-px" style={{ background: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)" }} />
            </div>
            <div className="font-[var(--font-royal-script)] text-[72px] leading-[1.18] pt-[0.1em] pb-[0.18em] shimmer-text">
              {groomName}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.42}>
          <div className="mt-6.5">
            <Flourish width={260} />
          </div>
        </Reveal>

        <Reveal delay={0.54}>
          <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)] mt-5.5 leading-relaxed">
            {date}
          </div>
        </Reveal>

        <Reveal delay={0.54}>
          <div className="mt-9 inline-flex flex-col items-center gap-2 text-[var(--invitation-accent)]">
            <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)]">
              scroll
            </div>
            <svg
              width="18"
              height="36"
              viewBox="0 0 18 36"
              className="animate-[float-soft_3s_ease-in-out_infinite]"
              fill="none"
              stroke="currentColor"
            >
              <rect x="1" y="1" width="16" height="26" rx="8" />
              <circle cx="9" cy="9" r="2" fill="currentColor">
                <animate
                  attributeName="cy"
                  values="9;16;9"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
              <path d="M9 30 l-4 -4 M9 30 l4 -4" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
