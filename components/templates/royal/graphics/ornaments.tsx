"use client";

import type { ReactNode } from "react";
import { DrawReveal } from "./reveal";

const G = "var(--invitation-accent)";

/* Deco divider: stepped lines + central faceted diamond */
export function Divider({ width = 220 }: { width?: number }) {
  return (
    <DrawReveal length={200}>
      <svg
        viewBox="0 0 220 22"
        width={width}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <line x1="2" y1="11" x2="86" y2="11" />
        <line x1="2" y1="14" x2="80" y2="14" opacity="0.4" />
        <line x1="2" y1="8" x2="80" y2="8" opacity="0.4" />
        <path d="M96 11 L110 1 L124 11 L110 21 Z" />
        <path d="M102 11 L110 5 L118 11 L110 17 Z" opacity="0.7" />
        <circle cx="110" cy="11" r="1.6" fill={G} stroke="none" />
        <line x1="134" y1="11" x2="218" y2="11" />
        <line x1="140" y1="14" x2="218" y2="14" opacity="0.4" />
        <line x1="140" y1="8" x2="218" y2="8" opacity="0.4" />
      </svg>
    </DrawReveal>
  );
}

/* Deco rosette */
export function RoseSm({ size = 28 }: { size?: number }) {
  return (
    <DrawReveal length={100}>
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path d="M20 4 L36 20 L20 36 L4 20 Z" />
        <path d="M20 10 L30 20 L20 30 L10 20 Z" opacity="0.8" />
        <line x1="4" y1="20" x2="36" y2="20" opacity="0.5" />
        <line x1="20" y1="4" x2="20" y2="36" opacity="0.5" />
        <circle cx="20" cy="20" r="2" fill={G} stroke="none" />
      </svg>
    </DrawReveal>
  );
}

/* Deco sunburst */
export function Sprig({ width = 90 }: { width?: number; flip?: boolean }) {
  return (
    <DrawReveal length={120}>
      <svg
        viewBox="0 0 90 40"
        width={width}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <line x1="2" y1="20" x2="88" y2="20" />
        <g transform="translate(45 20)">
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (-90 + (i - 4) * 18) * Math.PI / 180;
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={Math.cos(a) * 14}
                y2={Math.sin(a) * 14}
                opacity={i % 2 ? 0.5 : 1}
              />
            );
          })}
          <path d="M-10 0 L0 -10 L10 0 L0 10 Z" />
          <circle cx="0" cy="0" r="1.5" fill={G} stroke="none" />
        </g>
        <line x1="14" y1="14" x2="14" y2="26" opacity="0.6" />
        <line x1="76" y1="14" x2="76" y2="26" opacity="0.6" />
      </svg>
    </DrawReveal>
  );
}

/* Deco corner — stepped quarter arch */
export function Corner({ size = 110 }: { size?: number; className?: string }) {
  return (
    <DrawReveal length={400}>
      <svg
        viewBox="0 0 110 110"
        width={size}
        height={size}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path d="M2 108 L2 80 L10 80 L10 60 L20 60 L20 40 L40 40 L40 20 L60 20 L60 10 L80 10 L80 2 L108 2" />
        <path d="M2 108 L2 90 L20 90 L20 70 L40 70 L40 50 L60 50 L60 30 L80 30 L80 12 L108 12" opacity="0.5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="2" y1="108" x2={20 + i * 18} y2={108 - (20 + i * 18)} opacity="0.4" />
        ))}
        <circle cx="2" cy="108" r="2" fill={G} stroke="none" />
      </svg>
    </DrawReveal>
  );
}

/* Deco crest — stepped shield with sunburst + monogram */
export function Crest({
  size = 140,
  initials = "J&J",
  idle = false,
}: {
  size?: number;
  initials?: string;
  idle?: boolean;
}) {
  return (
    <DrawReveal length={420} delay={idle ? 0.3 : 0}>
      <svg
        viewBox="0 0 140 160"
        width={size}
        height={size * (160 / 140)}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
        className={idle ? "animate-[float-soft_5s_ease-in-out_infinite]" : ""}
      >
        <path d="M70 8 L110 18 L120 40 L120 90 L70 152 L20 90 L20 40 L30 18 Z" />
        <path d="M70 16 L102 24 L112 42 L112 86 L70 138 L28 86 L28 42 L38 24 Z" opacity="0.55" />
        <g transform="translate(70 30)">
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (-90 + (i - 5) * 12) * Math.PI / 180;
            return (
              <line
                key={i}
                x1="0" y1="0"
                x2={Math.cos(a) * 18}
                y2={Math.sin(a) * 18}
                opacity={i % 2 ? 0.5 : 0.9}
              />
            );
          })}
        </g>
        <path d="M70 0 L78 8 L70 16 L62 8 Z" />
        <line x1="20" y1="60" x2="20" y2="80" strokeWidth="2" />
        <line x1="120" y1="60" x2="120" y2="80" strokeWidth="2" />
        <text
          x="70"
          y="92"
          textAnchor="middle"
          style={{
            font: "300 34px var(--font-royal-serif), serif",
            fill: G,
            stroke: "none",
            letterSpacing: "0.08em",
          }}
        >
          {initials}
        </text>
        <line x1="50" y1="102" x2="90" y2="102" strokeWidth="0.8" />
        <line x1="56" y1="106" x2="84" y2="106" strokeWidth="0.5" opacity="0.6" />
      </svg>
    </DrawReveal>
  );
}

/* Deco arch frame */
export function Arch({
  children,
  w = 240,
  h = 320,
}: {
  children: ReactNode;
  w?: number;
  h?: number;
}) {
  return (
    <div className="relative mx-auto" style={{ width: w, height: h }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        className="absolute inset-0 pointer-events-none z-[2]"
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
      >
        <path
          d={`M2 ${h - 2} V${h * 0.42} L${w * 0.18} ${h * 0.28} L${w * 0.18} ${h * 0.18} L${w * 0.4} ${h * 0.06} L${w * 0.6} ${h * 0.06} L${w - w * 0.18} ${h * 0.18} L${w - w * 0.18} ${h * 0.28} L${w - 2} ${h * 0.42} V${h - 2} Z`}
        />
        <path
          d={`M10 ${h - 10} V${h * 0.44} L${w * 0.2} ${h * 0.32} L${w * 0.2} ${h * 0.22} L${w * 0.42} ${h * 0.12} L${w * 0.58} ${h * 0.12} L${w - w * 0.2} ${h * 0.22} L${w - w * 0.2} ${h * 0.32} L${w - 10} ${h * 0.44} V${h - 10} Z`}
          opacity="0.45"
        />
        <line x1="0" y1="0" x2="14" y2="0" />
        <line x1="0" y1="0" x2="0" y2="14" />
        <line x1={w} y1="0" x2={w - 14} y2="0" />
        <line x1={w} y1="0" x2={w} y2="14" />
      </svg>
      <div
        className="absolute overflow-hidden"
        style={{
          inset: 6,
          clipPath: `path("M2 ${h - 8} V${h * 0.42} L${w * 0.18} ${h * 0.28} L${w * 0.18} ${h * 0.18} L${w * 0.4} ${h * 0.06} L${w * 0.6} ${h * 0.06} L${w - w * 0.18 - 6} ${h * 0.18} L${w - w * 0.18 - 6} ${h * 0.28} L${w - 14} ${h * 0.42} V${h - 8} Z")`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Photo placeholder */
export function PhotoPlaceholder({ label = "PHOTO" }: { label?: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center text-xs tracking-[0.3em]"
      style={{
        background: `
          repeating-linear-gradient(45deg,
            color-mix(in srgb, var(--invitation-accent) 12%, transparent) 0,
            color-mix(in srgb, var(--invitation-accent) 12%, transparent) 6px,
            color-mix(in srgb, var(--invitation-accent) 4%, transparent) 6px,
            color-mix(in srgb, var(--invitation-accent) 4%, transparent) 12px),
          linear-gradient(180deg, var(--invitation-bg-alt), var(--invitation-bg))
        `,
        color: "color-mix(in srgb, var(--invitation-accent) 55%, transparent)",
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      }}
    >
      {label}
    </div>
  );
}

/* Deco flourish — symmetrical fan + chevron wings */
export function Flourish({ width = 280 }: { width?: number }) {
  return (
    <DrawReveal length={200} delay={0.2}>
      <svg
        viewBox="0 0 280 60"
        width={width}
        fill="none"
        stroke={G}
        strokeWidth="1"
        strokeLinecap="square"
        className="animate-[float-soft_5s_ease-in-out_infinite]"
      >
        <path d="M140 12 L156 30 L140 48 L124 30 Z" />
        <path d="M140 20 L148 30 L140 40 L132 30 Z" opacity="0.7" />
        <circle cx="140" cy="30" r="2" fill={G} stroke="none" />
        <line x1="140" y1="2" x2="140" y2="12" opacity="0.6" />
        <line x1="140" y1="48" x2="140" y2="58" opacity="0.6" />
        <path d="M124 30 L110 30 L100 22 L80 22 L70 14" />
        <path d="M124 30 L110 30 L100 38 L80 38 L70 46" />
        <path d="M156 30 L170 30 L180 22 L200 22 L210 14" />
        <path d="M156 30 L170 30 L180 38 L200 38 L210 46" />
        <line x1="2" y1="26" x2="68" y2="26" opacity="0.6" />
        <line x1="2" y1="34" x2="68" y2="34" opacity="0.6" />
        <line x1="212" y1="26" x2="278" y2="26" opacity="0.6" />
        <line x1="212" y1="34" x2="278" y2="34" opacity="0.6" />
        <path d="M2 30 L14 22 L14 38 Z" />
        <path d="M278 30 L266 22 L266 38 Z" />
        <circle cx="70" cy="14" r="1.6" fill={G} stroke="none" />
        <circle cx="70" cy="46" r="1.6" fill={G} stroke="none" />
        <circle cx="210" cy="14" r="1.6" fill={G} stroke="none" />
        <circle cx="210" cy="46" r="1.6" fill={G} stroke="none" />
      </svg>
    </DrawReveal>
  );
}

/* Deco wreath spinner */
export function WreathSpinner({ size = 220 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className="animate-[spin-slow_60s_linear_infinite]"
        fill="none"
        stroke={G}
        strokeWidth="0.8"
        strokeLinecap="square"
      >
        <circle cx="110" cy="110" r="100" strokeDasharray="1 6" opacity="0.4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30) * Math.PI / 180;
          return (
            <line
              key={i}
              x1={110 + Math.cos(a) * 78}
              y1={110 + Math.sin(a) * 78}
              x2={110 + Math.cos(a) * 96}
              y2={110 + Math.sin(a) * 96}
              opacity={i % 3 === 0 ? 1 : 0.55}
            />
          );
        })}
        {[0, 90, 180, 270].map((deg, i) => {
          const a = deg * Math.PI / 180;
          const cx = 110 + Math.cos(a) * 96;
          const cy = 110 + Math.sin(a) * 96;
          return (
            <path
              key={i}
              d={`M${cx - 4} ${cy} L${cx} ${cy - 4} L${cx + 4} ${cy} L${cx} ${cy + 4} Z`}
              fill={G}
              stroke="none"
              opacity="0.8"
            />
          );
        })}
      </svg>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        className="absolute inset-0 animate-[spin-slow_90s_linear_infinite_reverse]"
        fill="none"
        stroke={G}
        strokeWidth="0.8"
      >
        <circle cx="110" cy="110" r="76" opacity="0.5" />
        <circle cx="110" cy="110" r="70" strokeDasharray="2 4" opacity="0.4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45) * Math.PI / 180;
          const cx = 110 + Math.cos(a) * 70;
          const cy = 110 + Math.sin(a) * 70;
          const angle = (i * 45) - 90;
          return (
            <g key={i} transform={`translate(${cx} ${cy}) rotate(${angle})`}>
              <path d="M-4 0 L0 -6 L4 0 Z" fill={G} stroke="none" opacity="0.7" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* Deco floral frame */
export function FloralFrame({
  width = 320,
  height = 220,
  children,
}: {
  width?: number;
  height?: number;
  children: ReactNode;
}) {
  const v = 14;
  return (
    <div className="relative" style={{ width, height }}>
      <DrawReveal length={600}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="absolute inset-0 pointer-events-none"
          fill="none"
          stroke={G}
          strokeWidth="1"
          strokeLinecap="square"
        >
          <rect x={v} y={v} width={width - 2 * v} height={height - 2 * v} strokeDasharray="1 4" opacity="0.35" />
          {[
            [v, v, 1, 1],
            [width - v, v, -1, 1],
            [v, height - v, 1, -1],
            [width - v, height - v, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
              <path d="M0 0 L26 0 L26 6 L40 6 L40 14 L48 14" />
              <path d="M0 0 L0 26 L6 26 L6 40 L14 40 L14 48" />
              <path d="M10 10 L20 10 L20 20 L10 20 Z" opacity="0.7" />
              <circle cx="15" cy="15" r="1.4" fill={G} stroke="none" />
            </g>
          ))}
        </svg>
      </DrawReveal>
      <div className="relative w-full h-full">{children}</div>
    </div>
  );
}

/* Bloom star */
export function BloomStar({ size = 36 }: { size?: number }) {
  return (
    <DrawReveal length={120}>
      <svg
        viewBox="0 0 60 60"
        width={size}
        height={size}
        fill="none"
        stroke={G}
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
        <circle cx="30" cy="30" r="2.5" fill={G} stroke="none" />
      </svg>
    </DrawReveal>
  );
}

/* Deco vine border */
export function VineBorder({
  height = 400,
  side = "left",
}: {
  height?: number;
  side?: "left" | "right";
}) {
  const flip = side === "right" ? -1 : 1;
  const steps = Math.floor(height / 40);
  return (
    <DrawReveal length={height}>
      <svg
        viewBox={`0 0 60 ${height}`}
        width="60"
        height={height}
        preserveAspectRatio="none"
        fill="none"
        stroke={G}
        strokeWidth="0.8"
        strokeLinecap="square"
        style={{ transform: `scaleX(${flip})`, opacity: 0.7 }}
      >
        <line x1="30" y1="0" x2="30" y2={height} opacity="0.5" />
        <line x1="22" y1="0" x2="22" y2={height} opacity="0.25" />
        <line x1="38" y1="0" x2="38" y2={height} opacity="0.25" />
        {Array.from({ length: steps }).map((_, i) => {
          const y = (i + 0.5) * 40;
          return (
            <g key={i}>
              <path d={`M22 ${y - 6} L30 ${y} L22 ${y + 6}`} />
              <path d={`M38 ${y - 6} L30 ${y} L38 ${y + 6}`} opacity="0.4" />
              {i % 3 === 0 && <circle cx="30" cy={y} r="1.6" fill={G} stroke="none" />}
            </g>
          );
        })}
      </svg>
    </DrawReveal>
  );
}

/* Grand deco divider — bracketed bars + central fan */
export function GrandDivider({ width = 280 }: { width?: number }) {
  return (
    <DrawReveal length={300} delay={0.1}>
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
    </DrawReveal>
  );
}
