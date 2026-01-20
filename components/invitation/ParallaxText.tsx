"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface ParallaxTextProps {
    children: React.ReactNode;
    className?: string;
    speed?: number; // Positive for paralax (slower than scroll), Negative for faster/reverse
    direction?: "vertical" | "horizontal";
}

export function ParallaxText({
    children,
    className = "",
    speed = 0.5, // Subtle default
    direction = "vertical"
}: ParallaxTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Removed useSpring to prevent jank on mobile browsers
    // Direct mapping ensures the element moves in perfect sync with the scroll

    const yVal = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
    const xVal = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

    const style = direction === "vertical"
        ? { y: yVal }
        : { x: xVal };

    return (
        <div ref={ref} className={className} style={{ overflow: "hidden" }}>
            <motion.div style={{ ...style, willChange: "transform" }}>
                {children}
            </motion.div>
        </div>
    );
}

// Re-export a slightly better version that doesn't hide overflow by default
export function FloatingParallax({
    children,
    className = "",
    speed = 0.5,
    direction = "vertical"
}: ParallaxTextProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Removed useSpring
    const val = useTransform(scrollYProgress, [0, 1], [-speed * 50, speed * 50]);

    const style = direction === "vertical"
        ? { y: val }
        : { x: val };

    return (
        <div ref={ref} className={className}>
            <motion.div style={{ ...style, willChange: "transform" }}>
                {children}
            </motion.div>
        </div>
    );
}
