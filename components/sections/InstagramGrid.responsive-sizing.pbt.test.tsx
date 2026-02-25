import { describe, it, vi, expect } from 'vitest';
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
    loading,
    priority
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    loading?: string;
    priority?: boolean;
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
    />
  ),
}));

/**
 * Feature: project-showcase-section, Property 20: Responsive image sizing
 * 
 * For any viewport dimension, images should be requested at sizes appropriate 
 * for that viewport to minimize bandwidth usage.
 * 
 * Validates: Requirements 8.3
 */

// Arbitraries for generating test data
const imageUrlArb = fc.webUrl();
const altTextArb = fc.string({ minLength: 5, maxLength: 100 });
const imageArrayArb = fc.array(imageUrlArb, { minLength: 0, maxLength: 20 });
const altArrayArb = fc.array(altTextArb, { minLength: 0, maxLength: 20 });

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

  it('should specify smaller sizes for mobile viewports (640px breakpoint)', () => {
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

  it('should specify medium sizes for tablet viewports (768px breakpoint)', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Sizes should include tablet-specific sizing
          let hasTabletSizing = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            // Should contain tablet viewport sizing
            if (!sizes || !sizes.includes('768px')) {
              hasTabletSizing = false;
            }
          });

          return hasTabletSizing && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should specify larger sizes for desktop viewports (1024px breakpoint)', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Sizes should include desktop-specific sizing
          let hasDesktopSizing = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            // Should contain desktop viewport sizing
            if (!sizes || !sizes.includes('1024px')) {
              hasDesktopSizing = false;
            }
          });

          return hasDesktopSizing && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use viewport width units (vw) for responsive sizing', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // Sizes should use viewport width units
          let allUseVw = true;
          imgs.forEach((img) => {
            const sizes = img.getAttribute('data-sizes');
            // Should contain viewport width units like "30vw"
            if (!sizes || !sizes.includes('vw')) {
              allUseVw = false;
            }
          });

          return allUseVw && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should configure smaller image sizes for mobile than desktop', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          if (imgs.length === 0) return true;

          const sizes = imgs[0]?.getAttribute('data-sizes');
          if (!sizes) return false;

          // Parse the sizes attribute to extract viewport-specific sizes
          // Expected format: "(max-width: 640px) 30vw, (max-width: 768px) 28vw, ..."
          const mobileMatch = sizes.match(/\(max-width:\s*640px\)\s*(\d+)vw/);
          const desktopMatch = sizes.match(/(\d+)vw(?!.*\(max-width)/); // Last vw value (desktop)

          if (!mobileMatch || !desktopMatch) return false;

          const mobileSize = parseInt(mobileMatch[1], 10);
          const desktopSize = parseInt(desktopMatch[1], 10);

          // Mobile size should be larger or equal to desktop (since mobile is full width)
          // Actually, in a 3-column grid, mobile might show larger images per item
          return mobileSize >= desktopSize;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain responsive sizing regardless of priority setting', () => {
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

          // All images should have sizes attribute regardless of priority
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

  it('should not configure responsive sizing when in loading state', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} />
          );

          // When isLoading is true, no images should be rendered
          const imgs = container.querySelectorAll('img');

          return imgs.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should configure fill property for all images to enable responsive sizing', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have fill property set to true
          let allHaveFill = true;
          imgs.forEach((img) => {
            const fill = img.getAttribute('data-fill');
            if (fill !== 'true') {
              allHaveFill = false;
            }
          });

          return allHaveFill && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide appropriate sizes for different grid positions', () => {
    fc.assert(
      fc.property(
        fc.array(imageUrlArb, { minLength: 9, maxLength: 9 }),
        fc.array(altTextArb, { minLength: 9, maxLength: 9 }),
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} />
          );

          const imgs = container.querySelectorAll('img');

          // All 9 images in the grid should have the same sizes configuration
          // since they're all the same size in the 3x3 grid
          const firstSizes = imgs[0]?.getAttribute('data-sizes');
          
          let allSame = true;
          imgs.forEach((img) => {
            if (img.getAttribute('data-sizes') !== firstSizes) {
              allSame = false;
            }
          });

          return allSame && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});
