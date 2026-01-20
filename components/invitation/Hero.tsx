"use client";

import { motion } from "framer-motion";
import { FloatingParallax } from "./ParallaxText";

// Using a placeholder image with a more elegant, warm tone
// const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

interface CoupleInfo {
    groom: { firstName: string };
    bride: { firstName: string };
}

interface HeroProps {
    onOpen: () => void;
    couple: CoupleInfo;
    date: string;
    subtitle: string;
    coverImage: string;
}

export function Hero({ onOpen, couple, date, subtitle, coverImage }: HeroProps) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-wedding-dark">
            {/* Background Image with animated scale */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mb-8 relative z-10"
                >
                    <FloatingParallax speed={-0.3}>
                        <span className="font-heading text-lg md:text-xl tracking-[0.4em] uppercase mb-6 block text-white/80">
                            {subtitle}
                        </span>
                    </FloatingParallax>
                    <FloatingParallax speed={-0.1}>
                        <h1 className="font-script text-7xl md:text-9xl lg:text-[10rem] mb-8 text-white drop-shadow-2xl opacity-90">
                            {couple.groom.firstName} {couple.bride.firstName}
                        </h1>
                    </FloatingParallax>
                    <FloatingParallax speed={0.1}>
                        <p className="font-heading text-xl md:text-2xl tracking-[0.2em] text-wedding-accent-light border-y border-white/20 py-4 inline-block px-12 backdrop-blur-sm bg-white/5">
                            {date}
                        </p>
                    </FloatingParallax>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    onClick={onOpen}
                    className="mt-16 px-12 py-4 border border-white/30 bg-white/5 backdrop-blur-md rounded-sm 
                     font-heading uppercase tracking-[0.3em] text-xs md:text-sm text-white/90 hover:bg-white hover:text-wedding-dark 
                     transition-all duration-700 hover:tracking-[0.5em] group"
                >
                    <span className="group-hover:mr-2 transition-all">Open Invitation</span>
                </motion.button>
            </div>

            {/* Decorative overlaid texture/noise could go here */}
        </div>
    );
}
