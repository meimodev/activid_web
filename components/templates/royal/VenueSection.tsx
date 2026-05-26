"use client";

import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";

interface VenueSectionProps {
  venue: string;
  address: string;
  mapUrl?: string;
}

export function VenueSection({ venue, address, mapUrl }: VenueSectionProps) {
  return (
    <SectionWrap id="venue">
      <SectionHead
        eyebrow="Find your way"
        title="The"
        em="venue"
        sub="Both the ceremony and reception will take place at this beautiful location."
      />
      <div
        className="overflow-hidden relative"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18))",
          border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
        }}
      >
        <span
          className="absolute -top-px -left-px w-3.5 h-3.5 border-l border-t border-[var(--invitation-accent)] opacity-70"
        />
        <span
          className="absolute -bottom-px -right-px w-3.5 h-3.5 border-r border-b border-[var(--invitation-accent)] opacity-70"
        />

        {/* Stylized map */}
        <div
          className="relative h-[220px] overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--invitation-bg), var(--invitation-dark, var(--invitation-bg)))",
          }}
        >
          <svg
            viewBox="0 0 400 220"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            stroke="color-mix(in srgb, var(--invitation-accent) 35%, transparent)"
            strokeWidth="0.5"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={"v" + i} x1={i * 50} y1="0" x2={i * 50} y2="220" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={"h" + i} x1="0" y1={i * 50} x2="400" y2={i * 50} />
            ))}
            <path
              d="M0 60 Q120 80 240 60 T400 80"
              stroke="var(--invitation-accent)"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M0 160 Q120 140 240 160 T400 140"
              stroke="var(--invitation-accent)"
              strokeWidth="1"
              opacity="0.6"
            />
            <path d="M180 0 L180 220" stroke="var(--invitation-accent)" strokeWidth="1" opacity="0.5" />
            <path d="M280 0 Q260 110 300 220" stroke="var(--invitation-accent)" strokeWidth="1" opacity="0.5" />
            <path
              d="M40 90 Q70 80 100 90 Q110 120 90 140 Q60 150 40 130 Z"
              fill="color-mix(in srgb, var(--invitation-accent) 8%, transparent)"
              stroke="color-mix(in srgb, var(--invitation-accent) 35%, transparent)"
            />
            <circle cx="200" cy="110" r="22" fill="color-mix(in srgb, var(--invitation-accent) 15%, transparent)" stroke="var(--invitation-accent)">
              <animate
                attributeName="r"
                values="22;34;22"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="200" cy="110" r="6" fill="var(--invitation-accent)" />
          </svg>
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1.5 text-[9px] tracking-[0.15em] font-mono text-[var(--invitation-accent-light)]"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 35%, transparent)",
            }}
          >
            34.0522° N · 118.2437° W
          </div>
        </div>

        <div className="p-5 text-center">
          <div className="font-[var(--font-royal-serif)] font-light text-[22px] text-[var(--invitation-text)]">
            {venue}
          </div>
          <div className="font-[var(--font-royal-serif)] text-[13px] text-[var(--invitation-text-light)] mt-1">
            {address}
          </div>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-[26px] py-3.5 mt-4.5 border border-[var(--invitation-accent)] text-[var(--invitation-accent)] font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase relative overflow-hidden transition-all duration-300 hover:text-[var(--invitation-bg)] group"
            >
              <span className="absolute inset-0 bg-[var(--invitation-accent)] translate-y-[101%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-[1]">Open in Maps</span>
              <span className="relative z-[1]">→</span>
            </a>
          )}
        </div>
      </div>
    </SectionWrap>
  );
}
