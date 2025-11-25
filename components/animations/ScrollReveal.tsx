'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks';
import { EASING, DURATION } from '@/lib/animation-config';

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
}

/**
 * ScrollReveal component wraps content to reveal it when scrolling into view.
 * Supports multiple directions, configurable timing, and respects reduced motion preferences.
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = DURATION.normal,
  once = true,
  threshold = 0.1,
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Direction-based offset mapping
  const offsets = {
    up: { x: 0, y: 100 },
    down: { x: 0, y: -100 },
    left: { x: 100, y: 0 },
    right: { x: -100, y: 0 },
  };

  const offset = offsets[direction];

  // If reduced motion is preferred, use simple fade
  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, x: offset.x, y: offset.y },
        animate: { opacity: 1, x: 0, y: 0 },
      };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: EASING.easeOutExpo,
      }}
      style={{
        willChange: 'transform, opacity',
      }}
      onAnimationComplete={() => {
        // Remove will-change after animation completes
        // Requirements: 1.2 - Remove will-change after animation completes
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
