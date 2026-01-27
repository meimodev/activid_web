"use client";

import { motion, useScroll, useTransform } from "framer-motion";

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
    guestName?: string;
}

export function Hero({ onOpen, couple, date, subtitle, coverImage, guestName }: HeroProps) {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-stone-100">
            {/* Background Image - Full Screen with Fade */}
            <motion.div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${coverImage})`,
                    scale
                }}
            >
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
            </motion.div>

            {/* Central Content */}
            <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-32 items-center text-center text-white">
                <motion.div
                    style={{ opacity }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Guest Name Display */}
                    {guestName && (
                        <div className="flex flex-col items-center gap-2 pb-4">
                            <span className="font-sans text-xs tracking-widest uppercase opacity-80">
                                Dear,
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl italic text-white">
                                {guestName}
                            </h2>
                        </div>
                    )}

                    {/* Top Tagline */}
                    <div className="flex items-center gap-4">
                        <span className="font-heading text-xs md:text-sm tracking-[0.3em] uppercase opacity-90">
                            {subtitle || "THE WEDDING OF"}
                        </span>
                    </div>

                    {/* Names - Elegant Serif */}
                    <div className="relative py-2">
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight">
                            <span className="block">{couple.groom.firstName}</span>
                            <span className="block text-2xl md:text-4xl lg:text-5xl italic font-light my-2 opacity-90">&</span>
                            <span className="block">{couple.bride.firstName}</span>
                        </h1>
                    </div>

                    {/* Date */}
                    <p className="mt-2 font-sans text-sm md:text-base tracking-[0.2em] opacity-90 border-t border-b border-white/30 py-2 px-8">
                        {date}
                    </p>

                    {/* Open Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpen}
                        className="mt-12 px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/40 hover:bg-white hover:text-stone-900 transition-all duration-500 rounded-full"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-xs uppercase tracking-widest">
                                Open Invitation
                            </span>
                        </div>
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-px h-12 bg-linear-to-b from-transparent via-white/50 to-transparent" />
            </motion.div>
        </div>
    );
}
