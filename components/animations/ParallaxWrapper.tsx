'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks';

export interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number; // 0.5 = slower, 1.5 = faster
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

/**
 * ParallaxWrapper creates parallax scrolling effects with configurable speed.
 * Uses useScroll and useTransform to calculate offset based on speed multiplier.
 * Applies will-change: transform for performance optimization.
 */
export function ParallaxWrapper({
  children,
  speed = 1,
  direction = 'vertical',
  className,
}: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate parallax offset based on speed multiplier
  // Speed multiplier determines how fast the element moves relative to scroll
  const range = 200; // Base range in pixels
  const offset = range * speed;

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const x = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  // If reduced motion is preferred, disable parallax
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        y: direction === 'vertical' ? y : 0,
        x: direction === 'horizontal' ? x : 0,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
