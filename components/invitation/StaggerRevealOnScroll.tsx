"use client";

import { Children, isValidElement, useEffect, useMemo, useRef, type ReactNode } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";

const EASE_OUT: [number, number, number, number] = [0.2, 0.65, 0.3, 0.9];

type UseInViewOptions = NonNullable<Parameters<typeof useInView>[1]>;
type InViewMargin = UseInViewOptions extends { margin?: infer M } ? M : never;

interface StaggerRevealOnScrollProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
  scale?: number;
  distance?: number;
  staggerDelay?: number;
  margin?: InViewMargin;
  threshold?: number;
  isReady?: boolean;
}

export function StaggerRevealOnScroll({
  children,
  width = "fit-content",
  delay = 0,
  duration = 1.0,
  direction = "up",
  className = "",
  once = false,
  scale = 0.95,
  distance = 40,
  staggerDelay = 0.1,
  margin = "-10%",
  threshold = 0.12,
  isReady = true,
}: StaggerRevealOnScrollProps) {
  const ref = useRef(null);
  const controls = useAnimationControls();
  const isInView = useInView(ref, { once, margin, amount: threshold });
  const items = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    if (isInView && isReady) {
      controls.start("visible");
    }
  }, [controls, isInView, isReady]);

  const itemHidden = useMemo(() => {
    const base: { opacity: number; x: number; y: number; scale: number } = {
      opacity: 0,
      x: 0,
      y: 0,
      scale,
    };

    if (direction === "up") base.y = distance;
    else if (direction === "down") base.y = -distance;
    else if (direction === "left") base.x = distance;
    else if (direction === "right") base.x = -distance;

    return base;
  }, [direction, distance, scale]);

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    }),
    [delay, staggerDelay],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: itemHidden,
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          ease: EASE_OUT,
        },
      },
    }),
    [duration, itemHidden],
  );

  return (
    <div style={{ width }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        viewport={{ once, margin, amount: threshold }}
        onViewportEnter={() => {
          if (isReady) controls.start("visible");
        }}
        onViewportLeave={() => {
          if (once) return;
          controls.set("hidden");
        }}
        className={className}
        style={{ willChange: "transform, opacity" }}
      >
        {items.map((child, index) => (
          <motion.div
            key={isValidElement(child) && child.key != null ? child.key : index}
            variants={itemVariants}
            style={{ willChange: "transform, opacity" }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
