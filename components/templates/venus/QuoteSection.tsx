"use client";

import { useEffect, useMemo, useState } from "react";
import { VenusReveal } from "./reveal";

export function QuoteSection({
  text,
  targetDate,
  backgroundImage,
}: {
  text: string;
  targetDate: string;
  backgroundImage: string;
}) {
  return (
    <section className="relative min-h-screen px-6 py-14">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/60" />
      <div className="absolute bottom-8 right-6 z-10">
        <CountdownVertical targetDate={targetDate} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto min-h-[calc(100vh-7rem)]">
        <div className="pt-6 ">
          <VenusReveal direction="up" width="100%" delay={0.08}>
            <p className="text-center text-white/95 text-sm leading-relaxed">
              {text}
            </p>
          </VenusReveal>
        </div>
      </div>
    </section>
  );
}

function CountdownVertical({
  targetDate,
}: {
  targetDate: string;
}) {
  const compute = (raw: string) => {
    const target = new Date(raw);
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (!Number.isFinite(difference) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(() => compute(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(compute(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Mins", value: timeLeft.minutes },
      { label: "Secs", value: timeLeft.seconds },
    ],
    [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
  );

  return (
    <div className="flex flex-col gap-2 items-end">
      {items.map((it, idx) => (
        <VenusReveal
          key={it.label}
          direction="up"
          width="fit-content"
          delay={0.14 + idx * 0.08}
        >
          <div className="text-center px-4 py-3 rounded-2xl border border-black/10 bg-white/60 backdrop-blur min-w-[88px]">
            <div className="font-body text-2xl leading-none text-[#2B2424]">
              {it.value}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#6B5B5B] font-body">
              {it.label}
            </div>
          </div>
        </VenusReveal>
      ))}
    </div>
  );
}
