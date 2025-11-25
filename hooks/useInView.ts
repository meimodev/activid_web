'use client';

import { useInView as useFramerInView } from 'framer-motion';
import { RefObject, useRef } from 'react';

/**
 * Options for the useInView hook
 */
export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Custom hook that detects when an element enters the viewport.
 * Wraps Framer Motion's useInView with custom options.
 * 
 * @param options - Configuration options for intersection detection
 * @returns Tuple of [ref, inView] - ref to attach to element and boolean indicating if element is in view
 */
export function useInView(
  options?: UseInViewOptions
): [RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const isInView = useFramerInView(ref, {
    amount: options?.threshold,
    margin: options?.rootMargin as any,
    once: options?.once,
  });

  return [ref, isInView];
}
