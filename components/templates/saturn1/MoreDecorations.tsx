"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function StarField() {
    // Three layers of stars for parallax depth
    const [stars1, setStars1] = useState<any[]>([]);
    const [stars2, setStars2] = useState<any[]>([]);
    const [stars3, setStars3] = useState<any[]>([]);
    const { scrollY } = useScroll();

    // Parallax movement
    const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 2000], [0, 150]);
    const y3 = useTransform(scrollY, [0, 2000], [0, 50]);

    useEffect(() => {
        const generateStars = (count: number, minSize: number, maxSize: number) =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * (maxSize - minSize) + minSize,
                opacity: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 5,
            }));

        setStars1(generateStars(100, 0.5, 1.5)); // Distant stars
        setStars2(generateStars(50, 1.5, 2.5));  // Mid-distance stars
        setStars3(generateStars(20, 2.5, 4.0));  // Close/Bright stars
    }, []);

    const StarLayer = ({ stars, y }: { stars: any[], y: any }) => (
        <motion.div style={{ y }} className="fixed inset-0 pointer-events-none z-0">
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

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#0B0D17]">
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
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
            <motion.div
                style={{ rotate, scale }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[100px] opacity-40"
            />
            <motion.div
                style={{ rotate: useTransform(scrollY, [0, 5000], [0, -90]), scale }}
                className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] opacity-30"
            />
            <motion.div
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-t from-purple-900/10 to-transparent blur-3xl"
            />
        </div>
    );
}

export function SaturnRings() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 5000], [0, 200]);
    const rotate = useTransform(scrollY, [0, 5000], [0, 45]);

    return (
        <motion.div style={{ y, rotate }} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
            {/* Primary Orbit */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] border border-white/5 rounded-full"
            >
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-white/40 rounded-full blur-[2px] shadow-[0_0_10px_white]" />
            </motion.div>

            {/* Inner Gold Orbit */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] border border-[#D4AF37]/10 rounded-full"
            >
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-[#D4AF37]/40 rounded-full blur-[1px] shadow-[0_0_8px_#D4AF37]" />
            </motion.div>

            {/* Dashed faint orbit */}
            <motion.div
                animate={{ rotate: 90 }}
                transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vw] border border-dashed border-white/5 rounded-full"
            />
        </motion.div>
    );
}

export function ShootingStars() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: "120vw", y: "-20vh", opacity: 0 }}
                    animate={{ x: "-20vw", y: "120vh", opacity: [0, 1, 0] }}
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
