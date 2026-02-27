"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function StarfieldLayer({ density }: { density?: number }) {
    const stars = useMemo(() => {
        const count = density ?? 24;
        return Array.from({ length: count }, (_, idx) => {
            const t = (idx * 97) % 100;
            const l = (idx * 53) % 100;
            const size = 1 + ((idx * 7) % 2);
            const delay = ((idx * 13) % 30) / 10;
            const duration = 3.6 + ((idx * 11) % 24) / 10;
            const opacity = 0.35 + ((idx * 17) % 35) / 100;

            return { id: idx, top: t, left: l, size, delay, duration, opacity };
        });
    }, [density]);

    return (
        <div className="absolute inset-0 pointer-events-none">
            {stars.map((s) => (
                <motion.span
                    key={s.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: `${s.top}%`,
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        boxShadow: "0 0 12px rgba(255,255,255,0.55)",
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: [0, s.opacity, 0], scale: [0.85, 1.25, 0.85] }}
                    transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

export function AuroraLayer() {
    return (
        <>
            <StarfieldLayer />
            <motion.div
                className="absolute -top-56 -right-64 w-[920px] h-[920px] rounded-full bg-cyan-400/10 blur-[170px] mix-blend-screen"
                animate={{ opacity: [0.12, 0.34, 0.12], y: [0, 18, 0], x: [0, -14, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-72 -left-64 w-[980px] h-[980px] rounded-full bg-emerald-400/10 blur-[190px] mix-blend-screen"
                animate={{ opacity: [0.1, 0.32, 0.1], y: [0, -16, 0], x: [0, 14, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[28%] left-[8%] w-[520px] h-[520px] rounded-full bg-teal-300/8 blur-[160px] mix-blend-screen"
                animate={{ opacity: [0.08, 0.22, 0.08], y: [0, 14, 0], x: [0, 10, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[10%] -left-[35%] w-[70%] h-[2px] bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0"
                animate={{ x: ["0%", "250%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 7.2 }}
                style={{ transform: "rotate(18deg)" }}
            />
        </>
    );
}
