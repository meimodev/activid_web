"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FloralDivider, SectionOrnament } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

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
        <section className="relative py-24 min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50 text-stone-800">

            <div className="container mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-16">
                        <SectionOrnament />
                        <h2 className="font-serif text-3xl md:text-5xl text-stone-800 mt-6 mb-2">
                            {heading}
                        </h2>
                        <p className="text-stone-500 font-sans tracking-widest text-xs uppercase">Counting Down The Moments</p>
                    </div>
                </RevealOnScroll>

                <div className="flex justify-center gap-6 md:gap-12 font-serif flex-wrap">
                    <RevealOnScroll delay={0.1} direction="up">
                        <div className="text-center min-w-[80px] md:min-w-[120px]">
                            <span className="text-4xl md:text-6xl text-stone-800 block mb-2 font-light">
                                {timeLeft.days}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-sans">Days</span>
                        </div>
                    </RevealOnScroll>
                    <div className="text-2xl md:text-4xl text-stone-300 font-light pt-2">:</div>
                    <RevealOnScroll delay={0.2} direction="up">
                        <div className="text-center min-w-[80px] md:min-w-[120px]">
                            <span className="text-4xl md:text-6xl text-stone-800 block mb-2 font-light">
                                {timeLeft.hours}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-sans">Hours</span>
                        </div>
                    </RevealOnScroll>
                    <div className="text-2xl md:text-4xl text-stone-300 font-light pt-2">:</div>
                    <RevealOnScroll delay={0.3} direction="up">
                        <div className="text-center min-w-[80px] md:min-w-[120px]">
                            <span className="text-4xl md:text-6xl text-stone-800 block mb-2 font-light">
                                {timeLeft.minutes}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-sans">Mins</span>
                        </div>
                    </RevealOnScroll>
                    <div className="text-2xl md:text-4xl text-stone-300 font-light pt-2">:</div>
                    <RevealOnScroll delay={0.4} direction="up">
                        <div className="text-center min-w-[80px] md:min-w-[120px]">
                            <span className="text-4xl md:text-6xl text-stone-800 block mb-2 font-light">
                                {timeLeft.seconds}
                            </span>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-400 font-sans">Secs</span>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative w-full overflow-hidden py-12 mt-16 bg-white border-y border-stone-100">
                <div className="flex gap-4">
                    <motion.div
                        className="flex gap-4 pl-4"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                        style={{ willChange: "transform" }}
                    >
                        {[...photos, ...photos, ...photos].map((photo, i) => (
                            <div key={i} className="min-w-[200px] h-[300px] overflow-hidden transition-all duration-1000 ease-in-out bg-stone-100 rounded-sm">
                                <img src={photo} alt="Couple" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="mt-12">
                <FloralDivider />
            </div>
        </section>
    );
}
