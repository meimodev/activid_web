"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface OverlayRevealProps {
  className?: string;
  style?: CSSProperties;
  delay?: number;
  idle?: "wind" | "none";
  children?: ReactNode;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function OverlayReveal({ className, style, delay = 0, idle = "wind", children }: OverlayRevealProps) {
  const windAnimation =
    idle === "wind"
      ? {
          x: [0, 12, -10, 10, -8, 0],
          rotate: [0, 3.4, -3, 3.1, -2.6, 0],
        }
      : undefined;

  return (
    <motion.div
      aria-hidden
      className={className}
      style={style}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      animate={windAnimation}
      transition={{
        opacity: { duration: 0.75, delay, ease: EASE },
        y: { duration: 0.75, delay, ease: EASE },
        scale: { duration: 0.75, delay, ease: EASE },
        ...(idle === "wind"
          ? {
              x: {
                duration: 7.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 0.35,
              },
              rotate: {
                duration: 8.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + 0.35,
              },
            }
          : null),
      }}
      viewport={{ once: true, amount: 0.25, margin: "-12%" }}
    >
      {children}
    </motion.div>
  );
}
