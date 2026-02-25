'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * HorizontalScroll component pins a section during scroll and translates content horizontally.
 * Uses useScroll with container ref to track scroll progress.
 * Content moves horizontally based on scroll progress through the pinned section.
 * 
 * Requirements: 3.3
 */
export function HorizontalScroll({ children, className }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate horizontal translation based on scroll progress
  // The content will move from 0 to -100% of its width as user scrolls
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        style={{
          x,
          display: 'flex',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
