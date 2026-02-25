"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo } from "react";

type Star = {
    id: number;
    left: number;
    top: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
};

function hash01(i: number, salt: number) {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453123;
    return x - Math.floor(x);
}

function generateStars(count: number, minSize: number, maxSize: number, salt: number): Star[] {
    return Array.from({ length: count }, (_, i) => {
        const left = hash01(i + 1, salt + 1) * 100;
        const top = hash01(i + 2, salt + 2) * 100;
        const size = hash01(i + 3, salt + 3) * (maxSize - minSize) + minSize;
        const opacity = hash01(i + 4, salt + 4) * 0.5 + 0.3;
        const duration = hash01(i + 5, salt + 5) * 3 + 2;
        const delay = hash01(i + 6, salt + 6) * 5;

        return { id: i, left, top, size, opacity, duration, delay };
    });
}

function StarLayer({ stars, y }: { stars: Star[]; y: MotionValue<number> }) {
    return (
        <motion.div style={{ y }} className="absolute inset-0 pointer-events-none z-0">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white shadow-[0_0_2px_#fff]"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                    }}
                    animate={{
                        opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </motion.div>
    );
}

export function StarField() {
    // Three layers of stars for parallax depth
    const { scrollY } = useScroll();

    // Parallax movement
    const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 2000], [0, 150]);
    const y3 = useTransform(scrollY, [0, 2000], [0, 50]);

    const stars1 = useMemo(() => generateStars(100, 0.5, 1.5, 11), []); // Distant stars
    const stars2 = useMemo(() => generateStars(50, 1.5, 2.5, 29), []);  // Mid-distance stars
    const stars3 = useMemo(() => generateStars(20, 2.5, 4.0, 47), []);  // Close/Bright stars

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#0B0D17]">
            {/* Base gradient background */}
            <div className="absolute inset-0 bg-gradient-radial from-[#1e1b4b] via-[#0B0D17] to-black opacity-60" />

            <StarLayer stars={stars1} y={y1} />
            <StarLayer stars={stars2} y={y2} />
            <StarLayer stars={stars3} y={y3} />
        </div>
    );
}

export function Nebula() {
    const { scrollY } = useScroll();
    const rotate = useTransform(scrollY, [0, 5000], [0, 180]);
    const scale = useTransform(scrollY, [0, 5000], [1, 1.5]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
            <motion.div
                style={{ rotate, scale }}
                className="absolute -top-[20%] -left-[10%] w-[320px] h-[320px] bg-purple-900/10 rounded-full blur-[100px] opacity-40"
            />
            <motion.div
                style={{ rotate: useTransform(scrollY, [0, 5000], [0, -90]), scale }}
                className="absolute top-[40%] -right-[10%] w-[280px] h-[280px] bg-blue-900/10 rounded-full blur-[120px] opacity-30"
            />
            <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[420px] bg-gradient-to-t from-purple-900/10 to-transparent blur-3xl"
            />
        </div>
    );
}

export function SaturnRings() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 5000], [0, 200]);
    const rotate = useTransform(scrollY, [0, 5000], [0, 45]);

    return (
        <motion.div style={{ y, rotate }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
            {/* Primary Orbit */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"
            >
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white/40 rounded-full blur-[2px] shadow-[0_0_10px_white]" />
            </motion.div>

            {/* Inner Gold Orbit */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[430px] h-[430px] border border-[#D4AF37]/10 rounded-full"
            >
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#D4AF37]/40 rounded-full blur-[1px] shadow-[0_0_8px_#D4AF37]" />
            </motion.div>

            {/* Dashed faint orbit */}
            <motion.div
                animate={{ rotate: 90 }}
                transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] border border-dashed border-white/5 rounded-full"
            />
        </motion.div>
    );
}

export function ShootingStars() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: 600, y: -160, opacity: 0 }}
                    animate={{ x: -120, y: 960, opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5 + i * 8,
                        ease: "easeIn"
                    }}
                    className="absolute top-0 right-0 w-[400px] h-px bg-gradient-to-l from-transparent via-white to-transparent rotate-45 blur-[0.5px]"
                />
            ))}
        </div>
    );
}
