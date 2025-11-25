'use client';

import { useScroll, MotionValue } from 'framer-motion';

/**
 * Custom hook that returns normalized scroll progress (0-1) for the current page.
 * Uses Framer Motion's useScroll with scrollYProgress.
 * 
 * @returns MotionValue<number> - Scroll progress from 0 to 1
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}
