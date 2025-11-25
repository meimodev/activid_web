import { useEffect, useRef } from 'react';

/**
 * Hook to manage will-change CSS property for performance optimization.
 * Adds will-change before animation and removes it after to avoid memory issues.
 * 
 * Requirements: 1.2 - Apply will-change to animated elements and remove after completion
 */
export function useWillChange(properties: string[] = ['transform'], isAnimating: boolean = false) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isAnimating) {
      // Add will-change when animation starts
      element.style.willChange = properties.join(', ');
    } else {
      // Remove will-change when animation completes to free up resources
      element.style.willChange = 'auto';
    }

    // Cleanup on unmount
    return () => {
      if (element) {
        element.style.willChange = 'auto';
      }
    };
  }, [isAnimating, properties]);

  return ref;
}
