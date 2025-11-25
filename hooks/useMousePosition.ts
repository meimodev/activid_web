'use client';

import { useState, useEffect } from 'react';

/**
 * Mouse position coordinates
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Custom hook that tracks global mouse position.
 * Adds a global mousemove event listener with throttling for performance.
 * 
 * @returns MousePosition - Current mouse coordinates
 */
export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      
      // Throttle updates
      if (now - lastUpdate < throttleMs) {
        return;
      }

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
        lastUpdate = now;
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return mousePosition;
}
