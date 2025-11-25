'use client';

import { useWindowSize } from './useWindowSize';
import { RESPONSIVE_VARIANTS } from '@/lib/animation-config';

/**
 * Animation variant type from responsive variants
 */
type VariantName = keyof typeof RESPONSIVE_VARIANTS.mobile;

/**
 * Custom hook that returns appropriate animation variants based on viewport size.
 * Automatically switches between mobile and desktop variants.
 * 
 * @param variantName - The name of the animation variant to use
 * @returns Animation variant object appropriate for current viewport
 */
export function useResponsiveAnimation(variantName: VariantName) {
  const { isMobile } = useWindowSize();
  
  // Return mobile variants for mobile devices, desktop variants otherwise
  return isMobile 
    ? RESPONSIVE_VARIANTS.mobile[variantName]
    : RESPONSIVE_VARIANTS.desktop[variantName];
}

/**
 * Get animation parameters based on viewport width
 * Used for dynamic animation calculations
 * 
 * @param viewportWidth - Current viewport width in pixels
 * @returns Animation parameters object with distance and scale values
 */
export function getAnimationParams(viewportWidth: number) {
  const isMobile = viewportWidth < 768;
  
  return {
    distance: isMobile ? 50 : 100,
    scale: isMobile ? 0.9 : 0.8,
    duration: isMobile ? 1.0 : 1.2,
    rotateX: isMobile ? -10 : -15,
  };
}
