'use client';

import Image from 'next/image';
import { useState, memo } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import type { InstagramGridProps } from '@/types/project-showcase.types';

/**
 * InstagramGrid component that tiles project mockups
 * Used within BrowserFrame to display project mockups
 *
 * Renders exactly as many cells as it is given: a single mockup goes full-bleed,
 * several tile 3-up. `.mp4` sources render as muted looping video.
 *
 * @param images - Array of mockup URLs (image or .mp4); empty renders an empty state
 * @param alts - Array of alt texts corresponding to images
 * @param isLoading - Loading state indicator
 * @param priority - Priority loading for above-the-fold images
 */
function InstagramGridComponent({ images, alts, isLoading = false, priority = false }: InstagramGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoadStart = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: true }));
  };
  const gridItems = images.map((src, index) => {
    const altText = alts[index]?.trim();
    // Use fallback if alt text is missing, whitespace-only, or too short to be descriptive
    const isValidAlt = altText && altText.length >= 5;
    return {
      src,
      alt: isValidAlt ? alts[index] : 'Project mockup',
      isVideo: /\.mp4($|\?)/i.test(src),
    };
  });

  if (gridItems.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
        No mockups yet
      </div>
    );
  }

  return (
    <div
      className={`grid gap-0.5 sm:gap-1 w-full ${gridItems.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}
      role="grid"
      aria-label="Project mockup grid"
    >
      {gridItems.map((item, index) => (
        <div
          key={`grid-item-${index}`}
          className="relative w-full aspect-square overflow-hidden bg-gray-100"
          role="gridcell"
        >
          {isLoading || imageLoading[index] ? (
            <Skeleton 
              width="100%" 
              height="100%" 
              variant="rectangular"
              className="absolute inset-0"
            />
          ) : imageErrors[index] ? (
            // Fallback state for failed images
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500"
              role="img"
              aria-label={`Failed to load: ${item.alt}`}
            >
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 mb-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <span className="text-xs text-center px-1">Image unavailable</span>
            </div>
          ) : item.isVideo ? (
            <video
              src={item.src}
              aria-label={item.alt}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              onError={() => handleImageError(index)}
            />
          ) : (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={gridItems.length === 1
                ? '(max-width: 768px) 100vw, 45vw'
                : '(max-width: 640px) 30vw, (max-width: 768px) 28vw, (max-width: 1024px) 20vw, 15vw'}
              className="object-cover"
              loading={priority ? undefined : "lazy"}
              priority={priority}
              onError={() => handleImageError(index)}
              onLoad={() => handleImageLoad(index)}
              onLoadStart={() => handleImageLoadStart(index)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const InstagramGrid = memo(InstagramGridComponent);
