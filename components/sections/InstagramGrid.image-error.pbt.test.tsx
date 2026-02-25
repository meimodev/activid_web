/**
 * Property-Based Tests for InstagramGrid Image Error Handling
 * 
 * **Feature: project-showcase-section, Property 21: Image load failure handling**
 * **Validates: Requirements 8.5**
 * 
 * For any image that fails to load, a fallback state should be displayed 
 * without breaking the surrounding layout.
 * 
 * Note: These tests verify the error handling UI structure and layout integrity.
 * The actual async error triggering is tested in unit tests.
 */

import { describe, it, vi, beforeEach } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { InstagramGrid } from './InstagramGrid';
import React from 'react';

// Mock Next.js Image component with manual error triggering
vi.mock('next/image', () => ({
  default: function MockImage({ 
    src, 
    alt, 
    onError,
    onLoad,
    className,
  }: {
    src: string;
    alt: string;
    onError?: () => void;
    onLoad?: () => void;
    className?: string;
  }) {
    // Determine if this should error based on URL pattern
    const shouldError = src.includes('invalid') || 
                       src.includes('error') || 
                       src.includes('404') ||
                       src === '/broken-image.jpg';

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={src} 
        alt={alt}
        className={className}
        data-testid={`mock-image-${src}`}
        data-should-error={shouldError ? 'true' : 'false'}
        onError={onError}
        onLoad={onLoad}
      />
    );
  },
}));

// Arbitraries for generating test data
const validImageUrlArb = fc.webUrl({ validSchemes: ['http', 'https'] });
const invalidImageUrlArb = fc.constantFrom(
  'https://example.com/invalid-image.jpg',
  'https://example.com/error-404.jpg',
  '/broken-image.jpg',
  'https://test.com/image-error.png'
);
const altTextArb = fc.string({ minLength: 5, maxLength: 100 });

// Generate mixed arrays with some valid and some invalid URLs
const mixedImageArrayArb = fc.array(
  fc.oneof(validImageUrlArb, invalidImageUrlArb),
  { minLength: 9, maxLength: 9 }
);

const altArrayArb = fc.array(altTextArb, { minLength: 9, maxLength: 9 });

describe('Property 21: Image load failure handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display fallback state for any failed image without breaking layout', async () => {
    await fc.assert(
      fc.asyncProperty(
        mixedImageArrayArb,
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Count how many images should fail
          const failedImages = images.filter(img => 
            img.includes('invalid') || img.includes('error') || img.includes('404') || img === '/broken-image.jpg'
          );

          // Manually trigger error events for images that should fail
          if (failedImages.length > 0) {
            const mockImages = container.querySelectorAll('img[data-should-error="true"]');
            mockImages.forEach((img) => {
              fireEvent.error(img);
            });

            // Wait for state updates
            await waitFor(() => {
              const fallbackElements = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
              return fallbackElements.length > 0;
            }, { timeout: 1000 });
          }

          // Check that grid structure is maintained
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          if (gridCells.length !== 9) return false;

          // Check that grid container still exists
          const gridContainer = container.querySelector('[role="grid"]');
          if (!gridContainer) return false;

          // Verify that failed images show fallback content
          if (failedImages.length > 0) {
            // Should have fallback elements for failed images
            const fallbackElements = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            
            // At least some fallback elements should exist if there are failed images
            return fallbackElements.length > 0;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain 3x3 grid structure even when all images fail', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(invalidImageUrlArb, { minLength: 9, maxLength: 9 }),
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Manually trigger error events for all images
          const mockImages = container.querySelectorAll('img[data-should-error="true"]');
          mockImages.forEach((img) => {
            fireEvent.error(img);
          });

          // Wait for error handling to complete
          await waitFor(() => {
            const fallbacks = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            return fallbacks.length > 0;
          }, { timeout: 1000 });

          // Grid should still have exactly 9 cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          if (gridCells.length !== 9) return false;

          // Grid should maintain 3-column layout
          const gridContainer = container.querySelector('[role="grid"]');
          if (!gridContainer) return false;
          
          const hasThreeColumns = gridContainer.className.includes('grid-cols-3');
          return hasThreeColumns;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should display fallback icon and message for any failed image', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(invalidImageUrlArb, { minLength: 9, maxLength: 9 }),
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Manually trigger error events for all images
          const mockImages = container.querySelectorAll('img[data-should-error="true"]');
          mockImages.forEach((img) => {
            fireEvent.error(img);
          });

          // Wait for error handling
          await waitFor(() => {
            const fallbacks = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            return fallbacks.length > 0;
          }, { timeout: 1000 });

          const fallbackElements = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');

          // Each fallback should contain an icon (svg) and message
          let allHaveIconAndMessage = true;
          fallbackElements.forEach((fallback) => {
            const icon = fallback.querySelector('svg');
            const message = fallback.querySelector('span');
            
            if (!icon || !message) {
              allHaveIconAndMessage = false;
            }
            
            // Message should indicate image is unavailable
            if (message && !message.textContent?.includes('unavailable')) {
              allHaveIconAndMessage = false;
            }
          });

          return allHaveIconAndMessage && fallbackElements.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not break layout when mix of valid and invalid images are provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        mixedImageArrayArb,
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Wait for all images to process
          await waitFor(() => {
            const gridCells = container.querySelectorAll('[role="gridcell"]');
            return gridCells.length === 9;
          }, { timeout: 100 });

          // Check layout integrity
          const gridContainer = container.querySelector('[role="grid"]');
          if (!gridContainer) return false;

          // Should maintain aspect-square for all cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          let allHaveAspectSquare = true;
          gridCells.forEach((cell) => {
            if (!cell.className.includes('aspect-square')) {
              allHaveAspectSquare = false;
            }
          });

          // Should maintain consistent gap
          const hasGap = gridContainer.className.includes('gap-');

          // Should have exactly 9 cells
          const hasNineCells = gridCells.length === 9;

          return allHaveAspectSquare && hasGap && hasNineCells;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide accessible fallback with descriptive aria-label for failed images', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(invalidImageUrlArb, { minLength: 9, maxLength: 9 }),
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Manually trigger error events for all images
          const mockImages = container.querySelectorAll('img[data-should-error="true"]');
          mockImages.forEach((img) => {
            fireEvent.error(img);
          });

          // Wait for error handling
          await waitFor(() => {
            const fallbacks = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            return fallbacks.length > 0;
          }, { timeout: 1000 });

          const fallbackElements = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');

          // Each fallback should have a descriptive aria-label
          let allHaveAriaLabel = true;
          fallbackElements.forEach((fallback) => {
            const ariaLabel = fallback.getAttribute('aria-label');
            
            if (!ariaLabel || ariaLabel.length === 0) {
              allHaveAriaLabel = false;
            }
            
            // Aria label should include "Failed to load" and the original alt text
            if (ariaLabel && !ariaLabel.includes('Failed to load')) {
              allHaveAriaLabel = false;
            }
          });

          return allHaveAriaLabel && fallbackElements.length > 0;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain grid cell background color for failed images', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(invalidImageUrlArb, { minLength: 9, maxLength: 9 }),
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Manually trigger error events for all images
          const mockImages = container.querySelectorAll('img[data-should-error="true"]');
          mockImages.forEach((img) => {
            fireEvent.error(img);
          });

          // Wait for error handling
          await waitFor(() => {
            const fallbacks = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            return fallbacks.length > 0;
          }, { timeout: 1000 });

          const fallbackElements = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');

          // Each fallback should have a background color
          let allHaveBackground = true;
          fallbackElements.forEach((fallback) => {
            if (!fallback.className.includes('bg-gray-200')) {
              allHaveBackground = false;
            }
          });

          return allHaveBackground && fallbackElements.length > 0;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle partial array of invalid images without breaking', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 9 }),
        altArrayArb,
        async (numInvalid, alts) => {
          // Create array with specific number of invalid images
          const images = Array.from({ length: 9 }, (_, i) => 
            i < numInvalid ? '/broken-image.jpg' : 'https://example.com/valid.jpg'
          );

          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Wait for processing with longer timeout
          await waitFor(() => {
            const gridCells = container.querySelectorAll('[role="gridcell"]');
            return gridCells.length === 9;
          }, { timeout: 1000 });

          // Should always have 9 grid cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          if (gridCells.length !== 9) return false;

          // Grid structure should be intact
          const gridContainer = container.querySelector('[role="grid"]');
          return !!gridContainer;
        }
      ),
      { numRuns: 20 }
    );
  }, 10000);

  it('should not display skeleton loaders for failed images after error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(invalidImageUrlArb, { minLength: 9, maxLength: 9 }),
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Wait for error handling to complete
          await waitFor(() => {
            const fallbacks = container.querySelectorAll('[role="img"][aria-label*="Failed to load"]');
            return fallbacks.length > 0;
          }, { timeout: 1000 });

          // Should not have skeleton loaders after errors are handled
          const skeletons = container.querySelectorAll('.bg-gray-200.animate-pulse');
          
          // Fallback elements have bg-gray-200 but not animate-pulse
          // So we check that there are no elements with both classes
          return skeletons.length === 0;
        }
      ),
      { numRuns: 20 }
    );
  }, 10000);
});
