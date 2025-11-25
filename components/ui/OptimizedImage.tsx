'use client';

import Image, { ImageProps } from 'next/image';

export interface OptimizedImageProps extends Omit<ImageProps, 'loading'> {
  /**
   * Whether this image is above the fold (hero images)
   * Hero images should have priority=true for LCP optimization
   */
  isHero?: boolean;
  /**
   * Whether to use lazy loading (default: true for non-hero images)
   */
  lazy?: boolean;
}

/**
 * OptimizedImage component wraps Next.js Image with performance optimizations.
 * 
 * Features:
 * - Automatic lazy loading for below-the-fold images
 * - Priority loading for hero images (LCP optimization)
 * - Responsive sizing with Next.js Image optimization
 * 
 * Requirements: 1.5 - Optimize hero images for LCP
 */
export function OptimizedImage({
  isHero = false,
  lazy = true,
  alt,
  ...props
}: OptimizedImageProps) {
  // Hero images should have priority for LCP optimization
  const priority = isHero;
  
  // Non-hero images should be lazy loaded
  const loading = !isHero && lazy ? 'lazy' : undefined;

  return (
    <Image
      {...props}
      alt={alt}
      priority={priority}
      loading={loading}
      // Enable blur placeholder for better perceived performance
      placeholder={props.placeholder || 'blur'}
      // Optimize for modern formats
      quality={props.quality || 85}
    />
  );
}
