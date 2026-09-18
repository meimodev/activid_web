"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { recordLinkOpen } from "./actions";

export const DELAY_MS = 2500;
/** When the CTA finishes popping in. The sweep waits for it, so the bar and
 *  the entrance never run over each other. */
const CTA_IN_MS = 780;

/**
 * The CTA and the progress indicator are the same element: one thing to read,
 * one thing to tap. The sweep stays paused until the effect arms it, so a
 * visitor without JS sees an honest plain link instead of a bar that fills and
 * goes nowhere.
 */
export function RedirectCountdown({ code, url }: { code: string; url: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const countedCode = useRef<string | null>(null);

  useEffect(() => {
    if (countedCode.current === code) return;
    countedCode.current = code;
    void recordLinkOpen(code).catch((error) => {
      console.error("Failed to record link open", error);
    });
  }, [code]);

  useEffect(() => {
    ref.current?.setAttribute("data-armed", "");
    const timer = setTimeout(() => window.location.replace(url), DELAY_MS);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <a
      ref={ref}
      href={url}
      className="rl-cta"
      style={{ "--rl-cta-delay": `${CTA_IN_MS}ms` } as CSSProperties}
    >
      <span
        aria-hidden
        className="rl-sweep"
        style={{
          animationDelay: `${CTA_IN_MS}ms`,
          animationDuration: `${DELAY_MS - CTA_IN_MS}ms`,
        }}
      />
      <span className="rl-cta-label">Lanjutkan</span>
      <span aria-hidden className="rl-cta-arrow">&rarr;</span>
    </a>
  );
}
