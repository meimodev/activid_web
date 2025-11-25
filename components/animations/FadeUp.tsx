'use client';

import { ScrollReveal, ScrollRevealProps } from './ScrollReveal';

export interface FadeUpProps extends Omit<ScrollRevealProps, 'direction' | 'duration'> {
  duration?: number;
}

/**
 * FadeUp animation wrapper component.
 * Uses ScrollReveal with direction="up", 100px offset, and 0.8s duration.
 * Configured with viewport threshold for optimal scroll-triggered animation.
 * 
 * Requirements: 3.1
 */
export function FadeUp({
  children,
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.1,
  className,
}: FadeUpProps) {
  return (
    <ScrollReveal
      direction="up"
      delay={delay}
      duration={duration}
      once={once}
      threshold={threshold}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}
