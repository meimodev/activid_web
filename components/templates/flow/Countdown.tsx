"use client";

import { useEffect, useState } from "react";
import { SectionDivider, GoldLeafBorder, DiamondAccent } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { getCountdownParts } from "@/lib/date-time";

interface CountdownProps {
  targetDate: string;
  photos: string[];
  heading: string;
}

export function Countdown({ targetDate, photos, heading }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const update = () => setTimeLeft(getCountdownParts(targetDate));
    const immediate = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [targetDate]);

  return (
    <section className="py-24 bg-wedding-bg/95 sm:bg-wedding-bg/90 sm:backdrop-blur-md border-b border-wedding-accent/30 relative shadow-xl">
      <GoldLeafBorder position="top" />
      <div className="container mx-auto px-4 text-center mb-16">
        <RevealOnScroll direction="down" duration={0.55} once width="100%">
          <div className="flex flex-col items-center">
            <DiamondAccent />
            <h2 className="font-garet-book text-xl mb-8 mt-4 text-wedding-text-light uppercase tracking-[0.3em] flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-wedding-accent/50"></span>
              {heading}
              <span className="h-px w-12 bg-wedding-accent/50"></span>
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} duration={0.55} direction="up" once width="100%">
          <div className="flex justify-center gap-8 font-garet-book text-wedding-dark">
            <div className="text-center">
              <span className="text-5xl block mb-2 font-light text-wedding-accent">{timeLeft.days}</span>
              <span className="text-[10px] font-poppins-bold uppercase tracking-[0.4em] text-wedding-text-light">Days</span>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-2 font-light text-wedding-accent">{timeLeft.hours}</span>
              <span className="text-[10px] font-poppins-bold uppercase tracking-[0.4em] text-wedding-text-light">Hours</span>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-2 font-light text-wedding-accent">{timeLeft.minutes}</span>
              <span className="text-[10px] font-poppins-bold uppercase tracking-[0.4em] text-wedding-text-light">Mins</span>
            </div>
            <div className="text-center">
              <span className="text-5xl block mb-2 font-light text-wedding-accent">{timeLeft.seconds}</span>
              <span className="text-[10px] font-poppins-bold uppercase tracking-[0.4em] text-wedding-text-light">Secs</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Carousel */}
      {photos.length > 0 ? (
        <div className="relative w-full overflow-hidden py-8 bg-wedding-bg-alt/60 sm:bg-wedding-bg-alt/40 border-y border-wedding-accent/20">
          <style>{`
            @keyframes flowCountdownMarquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .flow-countdown-track { animation: none !important; }
            }
          `}</style>
          {/* Lightweight Edge Fade Overlay */}
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-wedding-bg/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-wedding-bg/90 to-transparent z-10 pointer-events-none" />

          <div className="flex">
            <div
              className="flow-countdown-track flex w-max gap-4 pl-4"
              style={{ animation: "flowCountdownMarquee 36s linear infinite" }}
            >
              {[...photos, ...photos].map((photo, i) => (
                <div key={i} className="shrink-0">
                  <div className="w-[160px] h-[240px] overflow-hidden shadow-xl border-4 border-wedding-bg">
                    <img
                      src={photo}
                      alt="Couple"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <SectionDivider />
    </section>
  );
}
