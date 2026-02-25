'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export interface ScaleOnScrollProps {
  children: React.ReactNode;
  scaleFrom?: number;
  scaleTo?: number;
  className?: string;
}

/**
 * ScaleOnScroll component animates element scale based on scroll progress.
 * Animates from scale 0.5 to 1.0 by default, tied to scroll progress.
 * Uses useTransform for smooth interpolation between scale values.
 * 
 * Requirements: 3.4
 */
export function ScaleOnScroll({
  children,
  scaleFrom = 0.5,
  scaleTo = 1.0,
  className,
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Interpolate scale based on scroll progress
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom, scaleTo, scaleTo]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
