"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CosmicDivider, SatrunIcon, StarDivider } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";

interface CountdownProps {
  targetDate: string;
  photos: string[];
  heading: string;
}

export function Countdown({ targetDate, photos, heading }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="relative py-24 min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-white border-b border-[#D4AF37]/10">

      <div className="absolute inset-0 bg-[#0B0D17]/40 backdrop-blur-sm z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <div className="flex flex-col items-center mb-16">
            <SatrunIcon />
            <h2 className="font-heading text-3xl uppercase tracking-[0.3em] text-[#D4AF37] mt-6 text-glow">
              {heading}
            </h2>
            <StarDivider />
          </div>
        </RevealOnScroll>

        <div className="flex justify-center gap-4 font-heading flex-wrap">
          <RevealOnScroll delay={0.1} direction="up">
            <FloatingParallax speed={0.2}>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-[#D4AF37]/30 rounded-sm min-w-[80px] ">
                <span className="font-heading text-3xl text-white font-bold block mb-2 drop-shadow-md">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Days</span>
              </div>
            </FloatingParallax>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2} direction="up">
            <FloatingParallax speed={0.3}>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-[#D4AF37]/30 rounded-sm min-w-[80px] ">
                <span className="font-heading text-3xl text-white font-bold block mb-2 drop-shadow-md">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Hours</span>
              </div>
            </FloatingParallax>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3} direction="up">
            <FloatingParallax speed={0.4}>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-[#D4AF37]/30 rounded-sm min-w-[80px] ">
                <span className="font-heading text-3xl text-white font-bold block mb-2 drop-shadow-md">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Mins</span>
              </div>
            </FloatingParallax>
          </RevealOnScroll>
          <RevealOnScroll delay={0.4} direction="up">
            <FloatingParallax speed={0.5}>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm border border-[#D4AF37]/30 rounded-sm min-w-[80px] ">
                <span className="font-heading text-3xl text-white font-bold block mb-2 drop-shadow-md">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Secs</span>
              </div>
            </FloatingParallax>
          </RevealOnScroll>
        </div>
      </div>

      {/* Carousel */}
      {photos.length > 0 ? (
        <div className="relative w-full overflow-hidden py-8 mt-16 bg-[#0B0D17]/40 backdrop-blur-md border-y border-[#D4AF37]/20">
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
                <div key={i} className="min-w-[160px] h-[240px] overflow-hidden shadow-xl transition-all duration-1000 ease-in-out border border-[#D4AF37]/30">
                  <img src={photo} alt="Couple" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-3000" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ) : null}

      <CosmicDivider />
    </section>
  );
}
