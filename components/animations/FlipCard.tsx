'use client';

import { motion } from 'framer-motion';
import { EASING } from '@/lib/animation-config';

export interface FlipCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * FlipCard component applies 3D flip transformation on viewport entry.
 * Uses rotateY transformation with 0.8s duration.
 * Triggers animation when element enters viewport.
 * 
 * Requirements: 3.5
 */
export function FlipCard({ children, delay = 0, className }: FlipCardProps) {
  const variants = {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
  } as const;

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{
        duration: 0.8,
        delay,
        ease: EASING.easeOutExpo,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
