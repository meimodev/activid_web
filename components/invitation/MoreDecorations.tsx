"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingFlowers() {
    const [petals, setPetals] = useState<any[]>([]);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 6 : 20;

        const newPetals = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: 15 + Math.random() * 10,
            delay: Math.random() * 15,
            drift: Math.random() * 100 - 50,
            scale: 0.5 + Math.random() * 0.5, // vary scale
        }));
        setPetals(newPetals);
    }, []);

    if (petals.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    initial={{
                        y: -20,
                        x: 0,
                        opacity: 0,
                        rotate: 0,
                    }}
                    animate={{
                        y: "110vh",
                        x: petal.drift,
                        opacity: [0, 0.8, 0],
                        rotate: 360,
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        delay: petal.delay,
                        ease: "linear",
                    }}
                    className="absolute text-wedding-accent/40"
                    style={{
                        left: `${petal.left}vw`,
                        width: `${petal.scale}rem`,
                        height: `${petal.scale}rem`,
                        willChange: "transform"
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2C13.5 2 14.5 3.5 14.5 5C16 3.5 17.5 3.5 18.5 5C19.5 6.5 19 8.5 17.5 9.5C18.5 11 18.5 13 17 14C15.5 15 13.5 14.5 12.5 13C11.5 14.5 9.5 15 8 14C6.5 13 6.5 11 7.5 9.5C6 8.5 5.5 6.5 6.5 5C7.5 3.5 9 3.5 10.5 5C10.5 3.5 11.5 2 12 2Z" />
                        <circle cx="12" cy="8" r="1.5" className="text-white/50" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

export function FloatingSparkles() {
    const [sparkles, setSparkles] = useState<number[]>([]);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 10 : 30;
        setSparkles(Array.from({ length: count }, (_, i) => i));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {sparkles.map((i) => (
                <motion.div
                    key={i}
                    initial={{
                        opacity: 0,
                        scale: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        willChange: "transform, opacity"
                    }}
                    className="absolute w-1 h-1 md:w-2 md:h-2 bg-wedding-accent rounded-full"
                >
                    <div className="absolute inset-0 bg-white rounded-full blur-sm" />
                </motion.div>
            ))}
        </div>
    );
}

export function FloatingHearts() {
    const [hearts, setHearts] = useState<number[]>([]);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const count = isMobile ? 3 : 8;
        setHearts(Array.from({ length: count }, (_, i) => i));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {hearts.map((i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: "100vh",
                        x: Math.random() * 100 + "vw",
                        opacity: 0,
                        scale: 0.5,
                    }}
                    animate={{
                        y: "-10vh",
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 20,
                        ease: "easeOut",
                    }}
                    style={{
                        willChange: "transform"
                    }}
                    className="absolute text-wedding-accent/40"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

export function GoldenRings() {
    return (
        <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden opacity-20">
            {/* Top Left Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute -top-32 -left-32 w-64 h-64 border-2 border-wedding-accent/30 rounded-full"
                style={{ willChange: "transform" }}
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 -left-24 w-48 h-48 border border-wedding-accent/20 rounded-full"
                style={{ willChange: "transform" }}
            />

            {/* Bottom Right Ring */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-32 -right-32 w-64 h-64 border-2 border-wedding-accent/30 rounded-full"
                style={{ willChange: "transform" }}
            />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-24 -right-24 w-48 h-48 border border-wedding-accent/20 rounded-full"
                style={{ willChange: "transform" }}
            />

            {/* Center decoration */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-wedding-accent/10 rounded-full"
                style={{ willChange: "transform" }}
            />
        </div>
    );
}




