"use client";

import { motion } from "framer-motion";

const IDLE_PRESENCE = {
  scale: [1, 1.04, 1],
  opacity: [0.9, 1, 0.9],
};

const PRESENCE_TRANSITION = {
  duration: 4.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

function DividerWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={`flex justify-center py-10 ${className ?? ""}`}
      animate={IDLE_PRESENCE}
      transition={PRESENCE_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

function BoldHorizontalRule({ y, span }: { y: number; span?: [number, number] }) {
  const [x1, x2] = span ?? [12, 308];
  return (
    <>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
      <line x1={x1} y1={y + 3} x2={x2} y2={y + 3} stroke="currentColor" strokeWidth="0.7" opacity="0.35" strokeLinecap="round" />
    </>
  );
}

export function RoyalCrownDivider() {
  return (
    <DividerWrapper>
      <svg
        width="360"
        height="80"
        viewBox="0 0 360 80"
        fill="none"
        className="text-wedding-accent/85"
      >
        {/* Bold horizontal rules above */}
        <BoldHorizontalRule y={8} />

        {/* Left flourish */}
        <path
          d="M130 46 C110 36 78 24 40 26 C20 28 8 20 6 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M130 46 C112 40 84 30 52 30"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        {/* Left end jewel */}
        <circle cx="6" cy="12" r="3" fill="currentColor" opacity="0.75" />

        {/* Right flourish */}
        <path
          d="M230 46 C250 36 282 24 320 26 C340 28 352 20 354 12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M230 46 C248 40 276 30 308 30"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        {/* Right end jewel */}
        <circle cx="354" cy="12" r="3" fill="currentColor" opacity="0.75" />

        {/* Crown base — thick */}
        <line x1="136" y1="46" x2="224" y2="46" stroke="currentColor" strokeWidth="2" opacity="0.9" strokeLinecap="round" />
        <line x1="140" y1="43" x2="220" y2="43" stroke="currentColor" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />

        {/* Crown points — bolder */}
        <path
          d="M136 46 L136 28 L144 38 L154 22 L164 34 L180 14 L196 34 L206 22 L216 38 L224 28 L224 46"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M154 22 L164 34 L180 14 L196 34 L206 22"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          fill="none"
          opacity="0.55"
        />

        {/* Crown jewels — larger */}
        <circle cx="154" cy="22" r="3" fill="currentColor" opacity="0.85" />
        <circle cx="180" cy="14" r="3.5" fill="currentColor" opacity="0.9" />
        <circle cx="206" cy="22" r="3" fill="currentColor" opacity="0.85" />
        <circle cx="136" cy="28" r="2.2" fill="currentColor" opacity="0.7" />
        <circle cx="224" cy="28" r="2.2" fill="currentColor" opacity="0.7" />
        <circle cx="144" cy="38" r="1.8" fill="currentColor" opacity="0.6" />
        <circle cx="164" cy="34" r="1.8" fill="currentColor" opacity="0.6" />
        <circle cx="196" cy="34" r="1.8" fill="currentColor" opacity="0.6" />
        <circle cx="216" cy="38" r="1.8" fill="currentColor" opacity="0.6" />

        {/* Bold horizontal rules below */}
        <BoldHorizontalRule y={70} />
      </svg>
    </DividerWrapper>
  );
}

export function OrnateFleurDivider() {
  return (
    <DividerWrapper className="[&>*]:delay-200">
      <svg
        width="360"
        height="90"
        viewBox="0 0 360 90"
        fill="none"
        className="text-wedding-accent/80"
      >
        {/* Bold horizontal rules above */}
        <line x1="16" y1="10" x2="344" y2="10" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
        <line x1="16" y1="14" x2="344" y2="14" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />

        {/* Left scrollwork — bolder */}
        <path
          d="M146 54 C124 46 88 30 52 32 C26 34 14 24 12 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M52 32 C52 42 60 46 66 44"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M146 54 C128 48 98 38 64 38"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* Right scrollwork — bolder */}
        <path
          d="M214 54 C236 46 272 30 308 32 C334 34 346 24 348 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M308 32 C308 42 300 46 294 44"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M214 54 C232 48 262 38 296 38"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* End diamonds — larger */}
        <path d="M6 12 L12 8 L12 16 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.7" />
        <path d="M354 12 L348 8 L348 16 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" opacity="0.7" />

        {/* Fleur-de-lis center — bolder */}
        <line x1="180" y1="50" x2="180" y2="4" stroke="currentColor" strokeWidth="1.6" opacity="0.7" strokeLinecap="round" />

        {/* Center petal */}
        <path d="M180 6 C186 16 190 28 180 40 C170 28 174 16 180 6 Z" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.85" />

        {/* Left petal */}
        <path d="M180 18 C164 10 152 12 150 22 C152 34 164 38 180 40" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.75" />

        {/* Right petal */}
        <path d="M180 18 C196 10 208 12 210 22 C208 34 196 38 180 40" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.75" />

        {/* Lower tendrils — bolder */}
        <path d="M180 40 C174 48 170 56 180 62" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d="M180 46 C162 52 150 60 148 72" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M180 46 C198 52 210 60 212 72" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.5" strokeLinecap="round" />

        {/* Fleur base accent */}
        <line x1="160" y1="50" x2="200" y2="50" stroke="currentColor" strokeWidth="1.4" opacity="0.7" strokeLinecap="round" />

        {/* Center jewel — larger */}
        <circle cx="180" cy="22" r="2.5" fill="currentColor" opacity="0.75" />

        {/* Bold horizontal rules below */}
        <line x1="16" y1="78" x2="344" y2="78" stroke="currentColor" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
        <line x1="16" y1="82" x2="344" y2="82" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      </svg>
    </DividerWrapper>
  );
}

export function MandalaDivider() {
  return (
    <DividerWrapper className="[&>*]:delay-400">
      <svg
        width="340"
        height="80"
        viewBox="0 0 340 80"
        fill="none"
        className="text-wedding-accent/80"
      >
        {/* Bold horizontal rules above */}
        <line x1="8" y1="14" x2="128" y2="14" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        <line x1="212" y1="14" x2="332" y2="14" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />

        {/* Left horizontal rule — thick */}
        <line x1="8" y1="38" x2="128" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />

        {/* Right horizontal rule — thick */}
        <line x1="212" y1="38" x2="332" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.55" strokeLinecap="round" />

        {/* Outer diamond — bold */}
        <path d="M170 8 L196 38 L170 68 L144 38 Z" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.7" />

        {/* Mid diamond */}
        <path d="M170 18 L188 38 L170 58 L152 38 Z" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.8" />

        {/* Inner diamond */}
        <path d="M170 24 L178 38 L170 52 L162 38 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.9" />

        {/* Center ring — bold */}
        <circle cx="170" cy="38" r="8" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.75" />
        <circle cx="170" cy="38" r="4" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.65" />
        <circle cx="170" cy="38" r="2" fill="currentColor" opacity="0.7" />

        {/* Radiating lines — bolder */}
        <line x1="170" y1="8" x2="170" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="170" y1="58" x2="170" y2="68" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="144" y1="38" x2="152" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="188" y1="38" x2="196" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

        {/* Diagonal rays — bolder */}
        <line x1="152" y1="20" x2="158" y2="26" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        <line x1="188" y1="20" x2="182" y2="26" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        <line x1="152" y1="56" x2="158" y2="50" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        <line x1="188" y1="56" x2="182" y2="50" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />

        {/* Sub-dot accents — larger */}
        <circle cx="128" cy="38" r="2" fill="currentColor" opacity="0.55" />
        <circle cx="212" cy="38" r="2" fill="currentColor" opacity="0.55" />

        {/* Bold horizontal rules below */}
        <line x1="8" y1="64" x2="128" y2="64" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        <line x1="212" y1="64" x2="332" y2="64" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
      </svg>
    </DividerWrapper>
  );
}

export function RegalBarDivider() {
  return (
    <DividerWrapper className="[&>*]:delay-600">
      <svg
        width="360"
        height="70"
        viewBox="0 0 360 70"
        fill="none"
        className="text-wedding-accent/80"
      >
        {/* Bold horizontal rules above */}
        <line x1="12" y1="8" x2="348" y2="8" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        <line x1="12" y1="12" x2="348" y2="12" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />

        {/* Main bar — thick */}
        <rect x="38" y="24" width="284" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="none" opacity="0.7" />
        <rect x="40" y="27" width="280" height="2" stroke="currentColor" strokeWidth="0.5" fill="currentColor" opacity="0.25" />

        {/* Left end cap — bolder */}
        <path d="M24 24 L34 24 L38 24 L38 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
        <path d="M24 32 L34 32 L38 32 L38 42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
        <circle cx="26" cy="28" r="2.5" fill="currentColor" opacity="0.7" />

        {/* Right end cap — bolder */}
        <path d="M336 24 L326 24 L322 24 L322 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
        <path d="M336 32 L326 32 L322 32 L322 42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
        <circle cx="334" cy="28" r="2.5" fill="currentColor" opacity="0.7" />

        {/* Diamond ornament 1 — bolder */}
        <path d="M92 24 L100 14 L108 24 L100 34 Z" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="100" cy="24" r="1.5" fill="currentColor" opacity="0.6" />

        {/* Diamond ornament 2 — center, larger */}
        <path d="M170 22 L180 10 L190 22 L180 34 Z" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.8" />
        <path d="M174 22 L180 14 L186 22 L180 30 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.55" />
        <circle cx="180" cy="22" r="2" fill="currentColor" opacity="0.7" />

        {/* Diamond ornament 3 — bolder */}
        <path d="M262 24 L270 14 L278 24 L270 34 Z" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.7" />
        <circle cx="270" cy="24" r="1.5" fill="currentColor" opacity="0.6" />

        {/* Vertical accent lines at diamonds — thicker */}
        <line x1="100" y1="34" x2="100" y2="46" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
        <line x1="180" y1="34" x2="180" y2="52" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        <line x1="270" y1="34" x2="270" y2="46" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

        {/* Top accent bar */}
        <rect x="64" y="16" width="232" height="1.5" rx="0.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.35" />

        {/* Bottom accent bar */}
        <rect x="64" y="40" width="232" height="1.5" rx="0.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.35" />

        {/* Bold horizontal rules below */}
        <line x1="12" y1="60" x2="348" y2="60" stroke="currentColor" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        <line x1="12" y1="64" x2="348" y2="64" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      </svg>
    </DividerWrapper>
  );
}
