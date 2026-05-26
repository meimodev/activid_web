"use client";

import type { Host } from "@/types/invitation";

export interface HeroProps {
  hosts: Host[];
  date: string;
  subtitle: string;
}

/* Section heading shared by all sections */
export function SectionHead({
  eyebrow,
  title,
  em,
  sub,
}: {
  eyebrow?: string;
  title: string;
  em?: string;
  sub?: string;
}) {
  return (
    <div className="text-center mb-10">
      {eyebrow && (
        <div className="flex justify-center mb-3">
          <BloomStarStatic size={26} />
        </div>
      )}
      {eyebrow && (
        <div
          className="font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase text-[var(--invitation-accent)] font-medium mb-3"
        >
          {eyebrow}
        </div>
      )}
      <h2
        className="font-[var(--font-royal-serif)] font-light text-[38px] leading-[1.1] text-[var(--invitation-text)] mb-2"
      >
        {title}{" "}
        {em && (
          <em
            className="font-[var(--font-royal-script)] not-italic text-[var(--invitation-accent)] text-[1.15em] leading-[1.1] inline-block pt-[0.05em] pb-[0.18em] px-[0.05em] translate-y-[0.08em]"
          >
            {em}
          </em>
        )}
      </h2>
      <GrandDividerStatic width={240} />
      {sub && (
        <p className="font-[var(--font-royal-serif)] text-[15px] leading-relaxed text-[var(--invitation-text-light)] max-w-[320px] mx-auto mt-5">
          {sub}
        </p>
      )}
    </div>
  );
}

/* Simple static ornament fallbacks for section headings */
function BloomStarStatic({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      fill="none"
      stroke="var(--invitation-accent)"
      strokeWidth="0.8"
      strokeLinecap="square"
      className="animate-[bloom-breath_3.2s_ease-in-out_infinite]"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return (
          <line
            key={i}
            x1={30 + Math.cos(a) * 6}
            y1={30 + Math.sin(a) * 6}
            x2={30 + Math.cos(a) * (i % 3 === 0 ? 26 : 20)}
            y2={30 + Math.sin(a) * (i % 3 === 0 ? 26 : 20)}
            opacity={i % 3 === 0 ? 1 : 0.5}
          />
        );
      })}
      <path d="M30 8 L36 30 L30 52 L24 30 Z" />
      <path d="M8 30 L30 24 L52 30 L30 36 Z" opacity="0.7" />
      <circle cx="30" cy="30" r="2.5" fill="var(--invitation-accent)" stroke="none" />
    </svg>
  );
}

function GrandDividerStatic({ width = 240 }: { width?: number }) {
  const G = "var(--invitation-accent)";
  return (
    <div className="flex justify-center my-4">
      <svg
        viewBox="0 0 280 36"
        width={width}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <line x1="2" y1="14" x2="118" y2="14" />
        <line x1="2" y1="22" x2="118" y2="22" opacity="0.5" />
        <line x1="162" y1="14" x2="278" y2="14" />
        <line x1="162" y1="22" x2="278" y2="22" opacity="0.5" />
        <path d="M2 8 L2 28" />
        <path d="M278 8 L278 28" />
        <path d="M8 8 L2 8 M8 28 L2 28" opacity="0.6" />
        <path d="M272 8 L278 8 M272 28 L278 28" opacity="0.6" />
        <g className="animate-[bloom-breath_4s_ease-in-out_infinite]" style={{ transformOrigin: "140px 18px" }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const a = (-90 + (i - 3) * 18) * Math.PI / 180;
            return (
              <line
                key={i}
                x1="140" y1="18"
                x2={140 + Math.cos(a) * 14}
                y2={18 + Math.sin(a) * 14}
                opacity={i === 3 ? 1 : 0.6}
              />
            );
          })}
          <path d="M126 18 L140 8 L154 18 L140 28 Z" />
          <circle cx="140" cy="18" r="2" fill={G} stroke="none" />
        </g>
      </svg>
    </div>
  );
}
