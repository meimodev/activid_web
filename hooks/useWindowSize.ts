'use client';

import { useState, useEffect } from 'react';

/**
 * Window size information with device type flags
 */
export interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Custom hook that provides current window dimensions with resize handling.
 * Implements debouncing (150ms) for performance and handles SSR gracefully.
 * 
 * @returns WindowSize - Current window dimensions and device type flags
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    // Handle SSR - return default values
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      // Clear existing timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // Debounce resize events (150ms)
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setWindowSize({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return windowSize;
}
