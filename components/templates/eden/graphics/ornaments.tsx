"use client";

import { motion } from "framer-motion";

const IDLE_WIND = {
  x: [0, 6, -5, 5, -4, 0],
  rotate: [0, 1.8, -1.6, 1.5, -1.2, 0],
};

const IDLE_PULSE = {
  scale: [1, 1.04, 1],
  opacity: [0.7, 1, 0.7],
};

const IDLE_SPIN_SLOW = {
  rotate: [0, 360],
};

const WIND_TRANSITION = {
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const PULSE_TRANSITION = {
  duration: 5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const SPIN_TRANSITION = {
  duration: 22,
  repeat: Infinity,
  ease: "linear" as const,
};

export function FloralDivider() {
  return (
    <div className="flex items-center justify-center py-2">
    <div className="flex items-center gap-4">
    <div className="h-px w-16 bg-wedding-accent/40" />
    <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="text-wedding-accent/70"
    >
    <path
    d="M12 21C12 21 17 16 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 16 12 21 12 21Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M12 7V3"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M7 12H3"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M17 12H21"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M15.5 15.5L18.5 18.5"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M8.5 15.5L5.5 18.5"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M15.5 8.5L18.5 5.5"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    <path
    d="M8.5 8.5L5.5 5.5"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    />
    </svg>
    <div className="h-px w-16 bg-wedding-accent/40" />
    </div>
    </div>
  );
}

export function VerticalLine() {
  return (
    <div className="h-32 w-px mx-auto my-8 bg-linear-to-b from-transparent via-wedding-accent/40 to-transparent" />
  );
}

export function SectionOrnament() {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
    <div className="w-1.5 h-1.5 bg-wedding-accent/50 rounded-full" />
    <div className="w-24 h-px bg-wedding-accent/25" />
    <div className="w-1.5 h-1.5 bg-wedding-accent/50 rounded-full" />
    </div>
  );
}

export function CornerLineTopLeft() {
  return (
    <motion.svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={WIND_TRANSITION}
      style={{ originX: 0, originY: 0 }}
    >
      <path
        d="M4 54 L4 4 L54 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 38 L4 4 L20 4"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
}

export function CornerLineBottomRight() {
  return (
    <motion.svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={{ ...WIND_TRANSITION, delay: 1.2 }}
      style={{ originX: 64, originY: 64 }}
    >
      <path
        d="M60 10 L60 60 L10 60"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 26 L60 60 L44 60"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="60" cy="60" r="1.5" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
}

export function CornerLineTopRight() {
  return (
    <motion.svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={{ ...WIND_TRANSITION, delay: 0.6 }}
      style={{ originX: 64, originY: 0 }}
    >
      <path
        d="M60 54 L60 4 L10 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 38 L60 4 L44 4"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="60" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
}

export function CornerLineBottomLeft() {
  return (
    <motion.svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={{ ...WIND_TRANSITION, delay: 1.8 }}
      style={{ originX: 0, originY: 64 }}
    >
      <path
        d="M4 10 L4 60 L54 60"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 26 L4 60 L20 60"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="4" cy="60" r="1.5" fill="currentColor" opacity="0.6" />
    </motion.svg>
  );
}

export function FourCorners() {
  return (
    <>
      <div className="absolute top-0 left-0 pointer-events-none z-10">
        <CornerLineTopLeft />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none z-10">
        <CornerLineTopRight />
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none z-10">
        <CornerLineBottomLeft />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none z-10">
        <CornerLineBottomRight />
      </div>
    </>
  );
}

export function SwoopingLineLeft() {
  return (
    <motion.svg
      aria-hidden
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      className="text-wedding-accent/25"
      animate={IDLE_PULSE}
      transition={PULSE_TRANSITION}
    >
      <path
        d="M4 20 Q60 -4 116 20"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function SwoopingLineRight() {
  return (
    <motion.svg
      aria-hidden
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      className="text-wedding-accent/25"
      animate={IDLE_PULSE}
      transition={{ ...PULSE_TRANSITION, delay: 1.5 }}
    >
      <path
        d="M116 20 Q60 -4 4 20"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function DiamondLine() {
  return (
    <motion.svg
      aria-hidden
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={WIND_TRANSITION}
      style={{ originX: 20, originY: 20 }}
    >
      <path
        d="M20 4 L36 20 L20 36 L4 20 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12 L28 20 L20 28 L12 20 Z"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </motion.svg>
  );
}

export function WavyLineDivider() {
  return (
    <motion.svg
      aria-hidden
      width="200"
      height="20"
      viewBox="0 0 200 20"
      fill="none"
      className="text-wedding-accent/25"
      animate={IDLE_PULSE}
      transition={PULSE_TRANSITION}
    >
      <path
        d="M0 10 Q25 2 50 10 Q75 18 100 10 Q125 2 150 10 Q175 18 200 10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function DoubleArcDivider() {
  return (
    <motion.svg
      aria-hidden
      width="160"
      height="32"
      viewBox="0 0 160 32"
      fill="none"
      className="text-wedding-accent/30"
      animate={IDLE_WIND}
      transition={WIND_TRANSITION}
      style={{ originX: 80, originY: 16 }}
    >
      <path
        d="M20 28 Q80 -4 140 28"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 28 Q80 0 150 28"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
    </motion.svg>
  );
}

export function TwinLineDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <motion.div
        className="h-px w-12 bg-wedding-accent/25"
        animate={{ scaleX: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={IDLE_SPIN_SLOW}
        transition={SPIN_TRANSITION}
        style={{ originX: 8, originY: 8 }}
      >
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-wedding-accent/40"
        >
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.5" />
          <path d="M8 2 L8 5 M8 11 L8 14 M2 8 L5 8 M11 8 L14 8" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
        </svg>
      </motion.div>
      <motion.div
        className="h-px w-12 bg-wedding-accent/25"
        animate={{ scaleX: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

export function CurvedCornerTopRight() {
  return (
    <motion.svg
      aria-hidden
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className="text-wedding-accent/20"
      animate={IDLE_WIND}
      transition={{ ...WIND_TRANSITION, delay: 0.4 }}
      style={{ originX: 80, originY: 0 }}
    >
      <path
        d="M80 4 C80 4 76 20 60 32 C44 44 24 52 4 56"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 10 C76 22 56 38 36 48 C20 56 8 60 4 62"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </motion.svg>
  );
}

export function CurvedCornerBottomLeft() {
  return (
    <motion.svg
      aria-hidden
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className="text-wedding-accent/20"
      animate={IDLE_WIND}
      transition={{ ...WIND_TRANSITION, delay: 1.6 }}
      style={{ originX: 0, originY: 80 }}
    >
      <path
        d="M4 76 C4 76 8 60 24 48 C38 36 56 28 76 24"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 70 C8 58 28 42 48 32 C64 24 72 20 76 18"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </motion.svg>
  );
}

export function SubtleFrame() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 w-20 h-px bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
      <motion.div
        aria-hidden
        className="absolute top-0 right-0 w-20 h-px bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ originX: "100%" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 w-px h-20 bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleY: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ originY: 0 }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 w-20 h-px bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ originX: 0 }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 right-0 w-20 h-px bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleX: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ originX: "100%" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 right-0 w-px h-20 bg-wedding-accent/20 pointer-events-none z-10"
        animate={{ scaleY: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{ originY: "100%" }}
      />
    </>
  );
}

// ── Static line decorations ──

export function HairlineDivider({ className }: { className?: string }) {
  return (
    <div className={`h-px w-full bg-linear-to-r from-transparent via-wedding-accent/20 to-transparent ${className ?? ""}`} />
  );
}

export function DashedDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3">
        <div className="h-px w-6 bg-wedding-accent/25" />
        <div className="h-px w-3 bg-wedding-accent/15" />
        <div className="h-px w-6 bg-wedding-accent/25" />
        <div className="h-px w-3 bg-wedding-accent/15" />
        <div className="h-px w-6 bg-wedding-accent/25" />
        <div className="h-px w-3 bg-wedding-accent/15" />
        <div className="h-px w-6 bg-wedding-accent/25" />
      </div>
    </div>
  );
}

export function DottedDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/25" />
    </div>
  );
}

export function TripleDotDivider() {
  return (
    <div className="flex items-center justify-center gap-6 py-3">
      <div className="h-px w-16 bg-wedding-accent/20" />
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent/35" />
        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent/35" />
      </div>
      <div className="h-px w-16 bg-wedding-accent/20" />
    </div>
  );
}

export function VerticalFadeRule({ className }: { className?: string }) {
  return (
    <div className={`w-px mx-auto bg-linear-to-b from-transparent via-wedding-accent/25 to-transparent ${className ?? "h-20"}`} />
  );
}

export function CrossHatchCorner() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-wedding-accent/15">
      <path d="M1 23 L1 12 L1 1" stroke="currentColor" strokeWidth="0.5" />
      <path d="M1 1 L12 1 L23 1" stroke="currentColor" strokeWidth="0.5" />
      <path d="M6 23 L6 17 L6 6" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
      <path d="M1 6 L7 6 L23 6" stroke="currentColor" strokeWidth="0.3" opacity="0.6" />
    </svg>
  );
}

export function ThinFrameRule({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-4 border border-wedding-accent/8 pointer-events-none ${className ?? ""}`} />
  );
}

export function AngleBracket({ rotate }: { rotate?: string }) {
  return (
    <svg aria-hidden width="32" height="56" viewBox="0 0 32 56" fill="none" className={`text-wedding-accent/20 ${rotate ?? ""}`}>
      <path d="M30 4 L18 28 L30 52" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 4 L12 28 L24 52" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

export function ParallelLinePair() {
  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <div className="h-px w-28 bg-wedding-accent/15" />
      <div className="h-px w-20 bg-wedding-accent/20" />
    </div>
  );
}

export function ElbowCornerTL() {
  return (
    <svg aria-hidden width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-wedding-accent/15">
      <path d="M4 36 L4 4 L36 4" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function ElbowCornerBR() {
  return (
    <svg aria-hidden width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-wedding-accent/15">
      <path d="M36 4 L36 36 L4 36" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="36" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function FiligreeSwoop() {
  return (
    <svg aria-hidden width="200" height="32" viewBox="0 0 200 32" fill="none" className="text-wedding-accent/15">
      <path
        d="M4 28 C24 12 52 4 76 6 C98 8 112 14 126 6 C140 -2 160 -2 174 6 C184 12 192 22 196 28"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 28 C28 16 52 10 72 12 C90 14 104 20 118 12 C128 6 142 4 152 8"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export function LozengeChain() {
  return (
    <svg aria-hidden width="120" height="12" viewBox="0 0 120 12" fill="none" className="text-wedding-accent/18">
      <path d="M6 2 L12 6 L6 10 L0 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M24 2 L30 6 L24 10 L18 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M42 2 L48 6 L42 10 L36 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M60 2 L66 6 L60 10 L54 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M78 2 L84 6 L78 10 L72 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M96 2 L102 6 L96 10 L90 6 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  );
}

export function FourCornerElbows() {
  return (
    <>
      <div className="absolute top-2 left-2 pointer-events-none"><ElbowCornerTL /></div>
      <div className="absolute top-2 right-2 pointer-events-none scale-x-[-1]"><ElbowCornerTL /></div>
      <div className="absolute bottom-2 left-2 pointer-events-none scale-y-[-1]"><ElbowCornerTL /></div>
      <div className="absolute bottom-2 right-2 pointer-events-none scale-x-[-1] scale-y-[-1]"><ElbowCornerTL /></div>
    </>
  );
}

export function BeadedLine() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <div className="w-1 h-1 rounded-full bg-wedding-accent/20" />
      <div className="h-px w-8 bg-wedding-accent/12" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/20" />
      <div className="h-px w-8 bg-wedding-accent/12" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/20" />
      <div className="h-px w-8 bg-wedding-accent/12" />
      <div className="w-1 h-1 rounded-full bg-wedding-accent/20" />
    </div>
  );
}

export function PinStripeRule({ count = 4 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-px h-4 bg-wedding-accent/12" />
      ))}
    </div>
  );
}

export function SectionEdgeTop() {
  return (
    <div className="pointer-events-none absolute top-0 left-0 right-0 overflow-hidden">
      <div className="h-px w-full bg-linear-to-r from-transparent via-wedding-accent/12 to-transparent" />
      <div className="h-px w-full mt-px bg-linear-to-r from-transparent via-wedding-accent/06 to-transparent" />
    </div>
  );
}

export function SectionEdgeBottom() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden">
      <div className="h-px w-full mt-px bg-linear-to-r from-transparent via-wedding-accent/06 to-transparent" />
      <div className="h-px w-full bg-linear-to-r from-transparent via-wedding-accent/12 to-transparent" />
    </div>
  );
}

export function SideFadeRuleLeft() {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-wedding-accent/08 to-transparent pointer-events-none" />
  );
}

export function SideFadeRuleRight() {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-wedding-accent/08 to-transparent pointer-events-none" />
  );
}
