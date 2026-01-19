"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionDivider, GoldLeafBorder, DiamondAccent } from "./Decorations";
import { RevealOnScroll } from "./RevealOnScroll";

interface CountdownProps {
    targetDate: string;
    photos: string[];
}

export function Countdown({ targetDate, photos }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const target = new Date(targetDate);

    useEffect(() => {
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
        <section className="py-24 bg-wedding-bg/30 backdrop-blur-sm border-b border-wedding-accent/30 relative">
            <GoldLeafBorder position="top" />
            <div className="container mx-auto px-4 text-center mb-16">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center">
                        <DiamondAccent />
                        <h2 className="font-heading text-xl mb-8 mt-4 text-wedding-text-light uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                            <span className="h-px w-12 bg-wedding-accent/50"></span>
                            Counting Down The Days
                            <span className="h-px w-12 bg-wedding-accent/50"></span>
                        </h2>
                    </div>
                </RevealOnScroll>

                <div className="flex justify-center gap-8 md:gap-16 font-heading text-wedding-dark">
                    <RevealOnScroll delay={0.1} direction="up">
                        <div className="text-center group">
                            <span className="text-5xl md:text-7xl block mb-2 font-light text-wedding-accent group-hover:-translate-y-2 transition-transform duration-500">{timeLeft.days}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-text-light">Days</span>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.2} direction="up">
                        <div className="text-center group">
                            <span className="text-5xl md:text-7xl block mb-2 font-light text-wedding-accent group-hover:-translate-y-2 transition-transform duration-500 delay-75">{timeLeft.hours}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-text-light">Hours</span>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.3} direction="up">
                        <div className="text-center group">
                            <span className="text-5xl md:text-7xl block mb-2 font-light text-wedding-accent group-hover:-translate-y-2 transition-transform duration-500 delay-100">{timeLeft.minutes}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-text-light">Mins</span>
                        </div>
                    </RevealOnScroll>
                    <RevealOnScroll delay={0.4} direction="up">
                        <div className="text-center group">
                            <span className="text-5xl md:text-7xl block mb-2 font-light text-wedding-accent group-hover:-translate-y-2 transition-transform duration-500 delay-150">{timeLeft.seconds}</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-wedding-text-light">Secs</span>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative w-full overflow-hidden py-8 bg-wedding-bg-alt/40 backdrop-blur-md border-y border-wedding-accent/20">
                {/* Center Focus Effect Overlay */}
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
                    >
                        {[...photos, ...photos, ...photos].map((photo, i) => (
                            <div key={i} className="min-w-[160px] h-[240px] overflow-hidden shadow-xl transition-all duration-1000 ease-in-out border-4 border-white">
                                <img src={photo} alt="Couple" className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-3000" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <SectionDivider />
        </section>
    );
}
