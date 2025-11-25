'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from '@/hooks';
import { useReducedMotion } from '@/hooks';

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * CountUp component animates numbers from start to end value when in view.
 * Uses useInView to trigger animation and useSpring for smooth motion.
 * Supports formatting with decimals, prefix, and suffix.
 */
export function CountUp({
  end,
  start = 0,
  duration = 1,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
}: CountUpProps) {
  const [ref, isInView] = useInView({ once: true, threshold: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  // Create spring animation for smooth counting
  const motionValue = useSpring(start, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000, // Convert to milliseconds
  });

  // Transform the motion value to formatted string
  const display = useTransform(motionValue, (latest) => {
    const formatted = latest.toFixed(decimals);
    return `${prefix}${formatted}${suffix}`;
  });

  // Trigger animation when element comes into view
  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        // Skip animation, jump to end value
        motionValue.set(end);
      } else {
        motionValue.set(end);
      }
    }
  }, [isInView, end, motionValue, prefersReducedMotion]);

  return (
    <motion.span ref={ref as any} className={className}>
      {display}
    </motion.span>
  );
}
