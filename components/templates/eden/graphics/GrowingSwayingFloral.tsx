"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GrowingSwayingFloralProps {
  src: string;
  className?: string;
  alt?: string;
  initialRotate?: number; // Native starting rotation angle
  swayRange?: [number, number]; // [min, max] rotation bounds relative to parent
  swayDuration?: number; // Sway cycle time in seconds
  growDelay?: number; // Stagger delay before growth starts
  originX?: number | string; // Pivot point for growth and sway
  originY?: number | string;
}

export function GrowingSwayingFloral({
  src,
  className = "",
  alt = "",
  initialRotate = 0,
  swayRange = [-3.5, 3.5],
  swayDuration = 6.5,
  growDelay = 0.1,
  originX = "50%",
  originY = "100%", // Default to bottom-anchored pivot (realistic for stems/vines)
}: GrowingSwayingFloralProps) {
  // To avoid hydration mismatch and start swaying mid-phase, randomize start phase on client mount
  const [randomDelay, setRandomDelay] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        setRandomDelay(Math.random() * -swayDuration);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [swayDuration]);

  // Outer container handles viewport-triggered "Growth" (scale and slide/unfurl)
  const growthVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: initialRotate - 12, // Start slightly tighter rotated
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: initialRotate,
      transition: {
        type: "spring" as const,
        stiffness: 35,
        damping: 14,
        delay: growDelay,
      },
    },
  };

  return (
    <motion.div
      className={`origin-center ${className}`}
      style={{
        originX,
        originY,
      }}
      variants={growthVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Inner container handles continuous organic "Sway" */}
      {randomDelay !== null && (
        <motion.div
          className="w-full h-full"
          style={{
            originX,
            originY,
          }}
          animate={{
            rotate: [swayRange[0], swayRange[1], swayRange[0]],
          }}
          transition={{
            repeat: Infinity,
            ease: "easeInOut",
            duration: swayDuration,
            delay: randomDelay,
          }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain pointer-events-none"
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Fallback during hydration before random delay is initialized */}
      {randomDelay === null && (
        <div className="w-full h-full">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      )}
    </motion.div>
  );
}
