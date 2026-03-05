"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { StarDivider, OrbitDivider, SatrunIcon } from "./graphics";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
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
    <section className="relative py-24 min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-wedding-on-dark border-b border-wedding-accent/10">

      <div className="absolute inset-0 bg-wedding-dark/40 backdrop-blur-sm z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.18} className="flex flex-col items-center mb-16">
          <SatrunIcon />
          <h2 className="font-heading text-3xl capitalize tracking-[0.3em] text-wedding-accent mt-6 text-glow">
            {heading}
          </h2>
          <StarDivider />
        </StaggerRevealOnScroll>

        <StaggerRevealOnScroll
          direction="up"
          width="100%"
          staggerDelay={0.1}
          className="flex justify-center gap-4 font-heading flex-wrap"
        >
          <div className="text-center p-4 bg-wedding-on-dark/5 backdrop-blur-sm border border-wedding-accent/30 rounded-sm min-w-[80px] ">
            <span className="font-heading text-3xl text-wedding-on-dark font-bold block mb-2 drop-shadow-md">
              {timeLeft.days}
            </span>
            <span className="text-[10px] font-body tracking-[0.2em] text-wedding-accent">Hari</span>
          </div>

          <div className="text-center p-4 bg-wedding-on-dark/5 backdrop-blur-sm border border-wedding-accent/30 rounded-sm min-w-[80px] ">
            <span className="font-heading text-3xl text-wedding-on-dark font-bold block mb-2 drop-shadow-md">
              {timeLeft.hours}
            </span>
            <span className="text-[10px] font-body tracking-[0.2em] text-wedding-accent">Jam</span>
          </div>

          <div className="text-center p-4 bg-wedding-on-dark/5 backdrop-blur-sm border border-wedding-accent/30 rounded-sm min-w-[80px] ">
            <span className="font-heading text-3xl text-wedding-on-dark font-bold block mb-2 drop-shadow-md">
              {timeLeft.minutes}
            </span>
            <span className="text-[10px] font-body tracking-[0.2em] text-wedding-accent">Menit</span>
          </div>

          <div className="text-center p-4 bg-wedding-on-dark/5 backdrop-blur-sm border border-wedding-accent/30 rounded-sm min-w-[80px] ">
            <span className="font-heading text-3xl text-wedding-on-dark font-bold block mb-2 drop-shadow-md">
              {timeLeft.seconds}
            </span>
            <span className="text-[10px] font-body tracking-[0.2em] text-wedding-accent">Detik</span>
          </div>
        </StaggerRevealOnScroll>
      </div>

      {/* Carousel */}
      {photos.length > 0 ? (
        <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.12} className="w-full">
          <div className="relative w-full overflow-hidden py-8 mt-16 bg-wedding-dark/40 backdrop-blur-md border-y border-wedding-accent/20">
            <div
              className="absolute inset-0 z-10 pointer-events-none backdrop-grayscale"
              style={{
                maskImage: "linear-gradient(to right, black 0%, transparent 35%, transparent 65%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 35%, transparent 65%, black 100%)"
              }}
            />

            <div className="flex gap-4">
              <motion.div
                className="flex gap-4 pl-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                style={{ willChange: "transform" }}
              >
                {[...photos, ...photos, ...photos].map((photo, i) => (
                  <div key={i} className="min-w-[160px] h-[240px] overflow-hidden shadow-xl transition-all duration-1000 ease-in-out border border-wedding-accent/30">
                    <img src={photo} alt="Couple" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-3000" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </StaggerRevealOnScroll>
      ) : null}

      <OrbitDivider />
    </section>
  );
}
