"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>;
type InViewMargin = UseInViewOptions extends { margin?: infer M } ? M : never;

interface RevealOnScrollProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    className?: string;
    once?: boolean;
    scale?: number; // Starting scale (e.g. 0.9)
    fullHeight?: boolean;
    distance?: number;
    margin?: InViewMargin;
}

export function RevealOnScroll({
    children,
    width = "fit-content",
    delay = 0,
    duration = 1.0, // Increased default duration for elegance
    direction = "up",
    className = "",
    once = true,
    scale = 0.95, // Default subtle scale up
    fullHeight = false,
    distance = 40, // Default subtle move
    margin = "-10%",
}: RevealOnScrollProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin });

    const getVariants = () => {
        const variants = {
            hidden: { opacity: 0, x: 0, y: 0, scale: scale },
            visible: { opacity: 1, x: 0, y: 0, scale: 1 }
        };

        if (direction === "up") variants.hidden.y = distance;
        else if (direction === "down") variants.hidden.y = -distance;
        else if (direction === "left") variants.hidden.x = distance;
        else if (direction === "right") variants.hidden.x = -distance;

        return variants;
    };

    return (
        <div ref={ref} style={{ width }} className={`${className} ${fullHeight ? 'h-full' : ''}`}>
            <motion.div
                variants={getVariants()}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                    duration,
                    delay,
                    ease: [0.2, 0.65, 0.3, 0.9] // Custom "Ease Out Quart/Quint" blend for soft landing
                }}
                className={fullHeight ? 'h-full' : ''}
                style={{ willChange: "opacity, transform" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
