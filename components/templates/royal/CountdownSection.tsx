"use client";

import { useState, useEffect } from "react";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import {
  Sprig,
  WreathSpinner,
} from "./graphics";
import { VineWavy } from "@/components/assets/vine-wavy";

function useCountdown(target: number) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return t;

  function diff(d: number) {
    const ms = Math.max(0, d - Date.now());
    return {
      days: Math.floor(ms / 86400000),
      hrs: Math.floor((ms / 3600000) % 24),
      min: Math.floor((ms / 60000) % 60),
      sec: Math.floor((ms / 1000) % 60),
    };
  }
}

function FlipDigit({ value }: { value: number }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional flip animation trigger
      setFlipping(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlipping(false);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div
      className="relative w-[52px] h-[64px] flex items-center justify-center overflow-hidden rounded border"
      style={{
        background: "linear-gradient(180deg, var(--invitation-bg-alt), var(--invitation-bg))",
        borderColor: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 -10px 16px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="absolute top-1/2 left-0 right-0 h-px bg-black/40 z-[3]"
      />
      <div
        className="font-[var(--font-royal-serif)] font-light text-[36px] text-[var(--invitation-accent)] tabular-nums"
        style={{
          transform: flipping ? "translateY(-8px)" : "translateY(0)",
          opacity: flipping ? 0.2 : 1,
          transition: "transform 0.6s cubic-bezier(0.6,0.1,0.2,1), opacity 0.6s",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}

interface CountdownSectionProps {
  targetDate: string; // ISO date string
}

export function CountdownSection({ targetDate }: CountdownSectionProps) {
  const target = new Date(targetDate).getTime();
  const { days, hrs, min, sec } = useCountdown(target);

  const units = [
    { label: "days", value: days },
    { label: "hours", value: hrs },
    { label: "minutes", value: min },
    { label: "seconds", value: sec },
  ];

  return (
    <SectionWrap id="countdown">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-0 overflow-hidden opacity-40">
          <VineWavy className="w-full h-full" />
        </div>
        <SectionHead eyebrow="A moment to remember" title="Counting the" em="days" />
      </div>
      <div
        className="grid grid-cols-4 gap-2.5 max-w-[360px] mx-auto relative"
      >
        <div className="absolute inset-y-[-60px] inset-x-0 flex items-center justify-center pointer-events-none opacity-35 z-0">
          <WreathSpinner size={260} />
        </div>
        {units.map((u) => (
          <div key={u.label} className="text-center relative z-[1]">
            <FlipDigit value={u.value} />
            <div className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent-light)] mt-2">
              {u.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-9 text-center">
        <Sprig width={120} />
        <div className="mt-3.5 font-[var(--font-royal-serif)] italic text-lg text-[var(--invitation-text)]">
          &ldquo;Two souls. One story.<br />The pages turn ever closer.&rdquo;
        </div>
      </div>
    </SectionWrap>
  );
}
