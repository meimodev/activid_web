"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PLAY_STORE_URL } from "../data";

// Token literals, needed because Framer can't interpolate `var()` colors.
const PAPER = "#eaf7f2"; // --loit-paper
const MINT = "#2fe89b"; // --loit-mint-500

/** LOIT wordmark — mint, rounded display type. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`loit-display select-none text-2xl font-extrabold tracking-tight text-[var(--loit-mint-500)] ${className}`}
    >
      LOIT
    </span>
  );
}

/** Official-style Google Play badge, drawn inline (no image asset). */
function PlayGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M3.6 2.3 13 12 3.6 21.7c-.4-.3-.6-.8-.6-1.4V3.7c0-.6.2-1.1.6-1.4Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M16.5 8.5 13 12l3.5 3.5 3.4-2c.8-.5.8-1.6 0-2L16.5 8.5Z" fill="currentColor" />
      <path d="M3.6 2.3 13 12l3.5-3.5L5.6 1.6c-.7-.4-1.5-.2-2 .7Z" fill="currentColor" opacity="0.6" />
      <path d="M3.6 21.7 13 12l3.5 3.5L5.6 22.4c-.7.4-1.5.2-2-.7Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/**
 * Primary CTA — mint fill, petrol text, hover glow. Always points to the
 * Play Store. Renders as a pill, ≥44px tall for touch.
 */
export function DownloadCta({
  label = "Download di Google Play",
  size = "lg",
  className = "",
}: {
  label?: string;
  size?: "lg" | "md";
  className?: string;
}) {
  const pad = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-3 text-sm";
  return (
    <Link
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-[var(--loit-mint-500)] font-semibold text-[var(--loit-petrol-900)] transition-all duration-300 [transition-timing-function:var(--loit-ease-out-expo)] hover:-translate-y-0.5 hover:bg-[var(--loit-mint-400)] hover:[box-shadow:var(--loit-glow)] active:scale-[0.97] active:duration-100 ${pad} ${className}`}
    >
      <PlayGlyph />
      {label}
    </Link>
  );
}

/** Uppercase eyebrow/label. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--loit-mint-400)]">
      {children}
    </span>
  );
}

/**
 * Section heading that renders one mint-highlighted phrase. Splits `text`
 * around `highlight` and tints just that fragment.
 */
export function Heading({
  text,
  highlight,
  className = "",
}: {
  text: string;
  highlight?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (!highlight || !text.includes(highlight)) {
    return <h2 className={`loit-display ${className}`}>{text}</h2>;
  }
  const [before, after] = text.split(highlight);
  return (
    <h2 className={`loit-display ${className}`}>
      {before}
      {/* The key word lights up to mint as the heading enters view. */}
      <motion.span
        initial={{ color: reduce ? MINT : PAPER }}
        whileInView={{ color: MINT }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        {highlight}
      </motion.span>
      {after}
    </h2>
  );
}
