import { describe, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { InstagramGrid } from './InstagramGrid';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ 
    src, 
    alt, 
    fill, 
    sizes, 
    className, 
    loading,
    priority,
    onError,
    onLoad,
    onLoadStart
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    loading?: string;
    priority?: boolean;
    onError?: () => void;
    onLoad?: () => void;
    onLoadStart?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      className={className}
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      data-loading={loading}
      data-priority={priority ? 'true' : 'false'}
      onError={onError}
      onLoad={onLoad}
    />
  ),
}));

/**
 * Feature: project-showcase-section, Property 19: Lazy loading implementation
 * 
 * For any image positioned below the initial viewport, it should not load until 
 * the user scrolls near it, prioritizing visible images first.
 * 
 * Validates: Requirements 8.1, 8.4
 */

// Arbitraries for generating test data
const imageUrlArb = fc.webUrl();
const altTextArb = fc.string({ minLength: 5, maxLength: 100 });
const imageArrayArb = fc.array(imageUrlArb, { minLength: 0, maxLength: 20 });
const altArrayArb = fc.array(altTextArb, { minLength: 0, maxLength: 20 });

describe('Property 19: Lazy loading implementation', () => {
  it('should configure images with lazy loading when priority is false', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have lazy loading when priority is false
          let allHaveLazyLoading = true;
          imgs.forEach((img) => {
            const loading = img.getAttribute('data-loading');
            if (loading !== 'lazy') {
              allHaveLazyLoading = false;
            }
          });

          return allHaveLazyLoading && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not use lazy loading when priority is true (above-the-fold)', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={true} />
          );

          const imgs = container.querySelectorAll('img');

          // Images should not have lazy loading when priority is true
          let noneHaveLazyLoading = true;
          imgs.forEach((img) => {
            const loading = img.getAttribute('data-loading');
            // When priority is true, loading should be undefined (not set)
            if (loading === 'lazy') {
              noneHaveLazyLoading = false;
            }
          });

          return noneHaveLazyLoading && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should set priority attribute for above-the-fold images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={true} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have priority when priority prop is true
          let allHavePriority = true;
          imgs.forEach((img) => {
            const priority = img.getAttribute('data-priority');
            if (priority !== 'true') {
              allHavePriority = false;
            }
          });

          return allHavePriority && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not set priority attribute for below-the-fold images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Images should not have priority when priority prop is false
          let noneHavePriority = true;
          imgs.forEach((img) => {
            const priority = img.getAttribute('data-priority');
            if (priority === 'true') {
              noneHavePriority = false;
            }
          });

          return noneHavePriority && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should default to lazy loading when priority is undefined', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Should use lazy loading by default
          let allHaveLazyLoading = true;
          imgs.forEach((img) => {
            const loading = img.getAttribute('data-loading');
            if (loading !== 'lazy') {
              allHaveLazyLoading = false;
            }
          });

          return allHaveLazyLoading && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent loading strategy across all images in a grid', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        fc.boolean(),
        (images, alts, priority) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={priority} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have the same loading strategy
          const firstImgLoading = imgs[0]?.getAttribute('data-loading');
          const firstImgPriority = imgs[0]?.getAttribute('data-priority');

          let allConsistent = true;
          imgs.forEach((img) => {
            if (img.getAttribute('data-loading') !== firstImgLoading) {
              allConsistent = false;
            }
            if (img.getAttribute('data-priority') !== firstImgPriority) {
              allConsistent = false;
            }
          });

          return allConsistent && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 20: Responsive image sizing
 * 
 * For any viewport dimension, images should be requested at sizes appropriate 
 * for that viewport to minimize bandwidth usage.
 * 
 * Validates: Requirements 8.3
 */
describe('Property 20: Responsive image sizing', () => {
  it('should configure all images with responsive sizes attribute', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have sizes attribute
          let allHaveSizes = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            if (!sizes || sizes.length === 0) {
              allHaveSizes = false;
            }
          });

          return allHaveSizes && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use viewport-based sizes for responsive loading', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Sizes should include viewport breakpoints
          let allHaveViewportSizes = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            // Should contain viewport-based sizing like "(max-width: 640px)"
            if (!sizes || !sizes.includes('max-width')) {
              allHaveViewportSizes = false;
            }
          });

          return allHaveViewportSizes && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent sizes configuration across all images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have the same sizes configuration
          const firstImgSizes = imgs[0]?.getAttribute('data-sizes');

          let allConsistent = true;
          imgs.forEach((img) => {
            if (img.getAttribute('data-sizes') !== firstImgSizes) {
              allConsistent = false;
            }
          });

          return allConsistent && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should specify smaller sizes for mobile viewports', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Sizes should include mobile-specific sizing
          let hasMobileSizing = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            // Should contain mobile viewport sizing (640px is common mobile breakpoint)
            if (!sizes || !sizes.includes('640px')) {
              hasMobileSizing = false;
            }
          });

          return hasMobileSizing && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 21: Image load failure handling
 * 
 * For any image that fails to load, a fallback state should be displayed 
 * without breaking the surrounding layout.
 * 
 * Validates: Requirements 8.5
 */
describe('Property 21: Image load failure handling', () => {
  it('should display fallback UI when image fails to load', async () => {
    await fc.assert(
      fc.asyncProperty(
        imageArrayArb,
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate image load error on first image
          if (imgs.length > 0) {
            const firstImg = imgs[0] as HTMLImageElement;
            firstImg.dispatchEvent(new Event('error'));

            await waitFor(() => {
              const fallback = container.querySelector('[role="img"]');
              expect(fallback).toBeTruthy();
            });
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain grid structure when images fail to load', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        fc.integer({ min: 0, max: 8 }),
        (images, alts, failureIndex) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate image load error
          if (imgs.length > failureIndex) {
            const img = imgs[failureIndex] as HTMLImageElement;
            img.dispatchEvent(new Event('error'));
          }

          // Grid should still have 9 cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          return gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display error icon in fallback state', async () => {
    await fc.assert(
      fc.asyncProperty(
        imageArrayArb,
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate image load error on first image
          if (imgs.length > 0) {
            const firstImg = imgs[0] as HTMLImageElement;
            firstImg.dispatchEvent(new Event('error'));

            await waitFor(() => {
              const svg = container.querySelector('svg');
              expect(svg).toBeTruthy();
            });
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include descriptive text in fallback state', async () => {
    await fc.assert(
      fc.asyncProperty(
        imageArrayArb,
        altArrayArb,
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate image load error on first image
          if (imgs.length > 0) {
            const firstImg = imgs[0] as HTMLImageElement;
            firstImg.dispatchEvent(new Event('error'));

            await waitFor(() => {
              const text = container.textContent;
              expect(text).toBeTruthy();
              expect(text as string).toContain('unavailable');
            });
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle multiple simultaneous image failures', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        fc.array(fc.integer({ min: 0, max: 8 }), { minLength: 1, maxLength: 9 }),
        (images, alts, failureIndices) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate multiple image load errors
          failureIndices.forEach((index) => {
            if (imgs.length > index) {
              const img = imgs[index] as HTMLImageElement;
              img.dispatchEvent(new Event('error'));
            }
          });

          // Grid should still maintain structure
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          return gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide accessible fallback with aria-label', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(imageUrlArb, { minLength: 9, maxLength: 9 }),
        fc.array(altTextArb, { minLength: 9, maxLength: 9 }),
        async (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate image load error on first image
          if (imgs.length > 0) {
            const firstImg = imgs[0] as HTMLImageElement;
            firstImg.dispatchEvent(new Event('error'));

            // Component validates alt text and uses fallback for invalid ones
            const trimmedAlt = alts[0]?.trim();
            const expectedAlt =
              trimmedAlt && trimmedAlt.length >= 5
                ? alts[0]
                : 'Project mockup placeholder';

            await waitFor(() => {
              const fallback = container.querySelector('[role="img"]');
              expect(fallback).toBeTruthy();
              const ariaLabel = (fallback as HTMLElement).getAttribute('aria-label');
              expect(ariaLabel).toBeTruthy();
              expect(ariaLabel as string).toContain(expectedAlt);
            });
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not break layout when all images fail to load', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Simulate all images failing to load
          imgs.forEach((img) => {
            (img as HTMLImageElement).dispatchEvent(new Event('error'));
          });

          // Grid should still have proper structure
          const gridContainer = container.querySelector('[role="grid"]');
          const gridCells = container.querySelectorAll('[role="gridcell"]');

          return gridContainer !== null && gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});
