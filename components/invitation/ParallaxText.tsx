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

    // Create a smoother spring layout
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate movement
    // If speed is 10, we move 10% of viewport height? Or pixels?
    // Let's use pixels for more predictable control, relative to scroll progress
    // If scroll progresses from 0 to 1, we want to move 'speed' * 100 pixels
    // A classic parallax feel is when the element moves slower than the scroll.
    // To achieve "slower than scroll", it actually needs to move in the SAME direction as scroll (downwards)
    // so it stays in view longer.
    // So positive speed should mean "move down as we scroll down".

    const yVal = useTransform(smoothProgress, [0, 1], [0, speed * 100]);
    const xVal = useTransform(smoothProgress, [0, 1], [0, speed * 100]);

    const style = direction === "vertical"
        ? { y: yVal }
        : { x: xVal };

    return (
        <div ref={ref} className={className} style={{ overflow: "hidden" }}>
            {/* 
                We use a motion div inside. 
                Using `overflow: hidden` on container might cut off content if parallax moves it out.
                Actually, we usually want these to float freely.
                Let's remove overflow hidden unless specifically needed, but standard parallax components usually just wrap.
             */}
            <motion.div style={style}>
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

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20
    });

    const val = useTransform(smoothProgress, [0, 1], [-speed * 50, speed * 50]);

    const style = direction === "vertical"
        ? { y: val }
        : { x: val };

    return (
        <div ref={ref} className={className}>
            <motion.div style={style}>
                {children}
            </motion.div>
        </div>
    );
}
