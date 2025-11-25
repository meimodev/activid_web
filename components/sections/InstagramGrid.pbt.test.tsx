import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
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
    loading 
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    loading?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      className={className}
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      data-loading={loading}
    />
  ),
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
}));

/**
 * Feature: project-showcase-section, Property 4: Instagram grid structure
 * 
 * For any set of mockup images within a browser frame, they should be arranged 
 * in a 3x3 grid layout with consistent aspect ratios and spacing.
 * 
 * Validates: Requirements 2.2, 2.3
 */

// Arbitraries for generating test data
const imageUrlArb = fc.webUrl();
const altTextArb = fc.string({ minLength: 5, maxLength: 100 });

// Generate arrays of images (can be any length, component should handle it)
const imageArrayArb = fc.array(imageUrlArb, { minLength: 0, maxLength: 20 });
const altArrayArb = fc.array(altTextArb, { minLength: 0, maxLength: 20 });

describe('Property 4: Instagram grid structure', () => {
  it('should always render exactly 9 grid cells regardless of input array length', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Should have exactly 9 grid cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          return gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should arrange all items in a 3x3 grid layout', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Should have grid container with grid-cols-3
          const gridContainer = container.querySelector('[role="grid"]');
          if (!gridContainer) return false;

          // Check for 3-column grid class
          const hasThreeColumns = gridContainer.className.includes('grid-cols-3');
          if (!hasThreeColumns) return false;

          // Should have exactly 9 cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          return gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent aspect ratios for all grid items', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const gridCells = container.querySelectorAll('[role="gridcell"]');

          // All cells should have aspect-square class for consistent aspect ratio
          let allHaveAspectSquare = true;
          gridCells.forEach((cell) => {
            if (!cell.className.includes('aspect-square')) {
              allHaveAspectSquare = false;
            }
          });

          return allHaveAspectSquare && gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistent spacing between grid items', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const gridContainer = container.querySelector('[role="grid"]');
          if (!gridContainer) return false;

          // Should have gap class for consistent spacing
          const hasGap = gridContainer.className.includes('gap-');
          
          return hasGap;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render images with proper alt text when provided', () => {
    fc.assert(
      fc.property(
        fc.array(imageUrlArb, { minLength: 9, maxLength: 9 }),
        fc.array(altTextArb, { minLength: 9, maxLength: 9 }),
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Should have 9 images
          if (imgs.length !== 9) return false;

          // Each image should have alt text from the provided array
          let allHaveCorrectAlt = true;
          imgs.forEach((img, index) => {
            if (img.getAttribute('alt') !== alts[index]) {
              allHaveCorrectAlt = false;
            }
          });

          return allHaveCorrectAlt;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use placeholder values when arrays are shorter than 9', () => {
    fc.assert(
      fc.property(
        fc.array(imageUrlArb, { minLength: 0, maxLength: 8 }),
        fc.array(altTextArb, { minLength: 0, maxLength: 8 }),
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Should still have exactly 9 images
          if (imgs.length !== 9) return false;

          // First N images should use provided URLs
          let correctImages = true;
          for (let i = 0; i < images.length; i++) {
            if (imgs[i].getAttribute('src') !== images[i]) {
              correctImages = false;
            }
          }

          // Remaining images should use placeholder
          for (let i = images.length; i < 9; i++) {
            if (imgs[i].getAttribute('src') !== '/placeholder-image.jpg') {
              correctImages = false;
            }
          }

          return correctImages;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should configure images with lazy loading', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have lazy loading
          let allHaveLazyLoading = true;
          imgs.forEach((img) => {
            if (img.getAttribute('data-loading') !== 'lazy') {
              allHaveLazyLoading = false;
            }
          });

          return allHaveLazyLoading && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should configure images with responsive sizes', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have sizes attribute for responsive loading
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
});

/**
 * Feature: project-showcase-section, Property 6: Image loading states
 * 
 * For any image that has not completed loading, a skeleton placeholder 
 * should be displayed until the image is available.
 * 
 * Validates: Requirements 2.5, 8.2
 */
describe('Property 6: Image loading states', () => {
  it('should display skeleton placeholders when isLoading is true', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} />
          );

          // Should have skeleton elements instead of images
          const skeletons = container.querySelectorAll('.bg-gray-200');
          
          // Should have exactly 9 skeletons (one for each grid cell)
          return skeletons.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display images when isLoading is true', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} />
          );

          // Should not have any img elements when loading
          const imgs = container.querySelectorAll('img');
          
          return imgs.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display images when isLoading is false', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Should have exactly 9 images
          const imgs = container.querySelectorAll('img');
          
          return imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display skeletons when isLoading is false', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          // Should not have skeleton elements when not loading
          const skeletons = container.querySelectorAll('.bg-gray-200');
          
          return skeletons.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should default to not loading when isLoading is undefined', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} />
          );

          // Should display images by default (not loading)
          const imgs = container.querySelectorAll('img');
          const skeletons = container.querySelectorAll('.bg-gray-200');
          
          return imgs.length === 9 && skeletons.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain grid structure regardless of loading state', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        fc.boolean(),
        (images, alts, isLoading) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={isLoading} />
          );

          // Should always have 9 grid cells
          const gridCells = container.querySelectorAll('[role="gridcell"]');
          
          // Should always have grid container
          const gridContainer = container.querySelector('[role="grid"]');
          
          return gridCells.length === 9 && gridContainer !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render skeleton with rectangular variant for image placeholders', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} />
          );

          // Skeletons should have rectangular variant (rounded-md class)
          const skeletons = container.querySelectorAll('.bg-gray-200');
          
          let allRectangular = true;
          skeletons.forEach((skeleton) => {
            if (!skeleton.className.includes('rounded-md')) {
              allRectangular = false;
            }
          });
          
          return allRectangular && skeletons.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should fill entire grid cell with skeleton during loading', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} />
          );

          const gridCells = container.querySelectorAll('[role="gridcell"]');
          
          // Each grid cell should contain a skeleton that fills it
          let allCellsHaveSkeleton = true;
          gridCells.forEach((cell) => {
            const skeleton = cell.querySelector('.bg-gray-200');
            if (!skeleton) {
              allCellsHaveSkeleton = false;
            }
          });
          
          return allCellsHaveSkeleton && gridCells.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});
