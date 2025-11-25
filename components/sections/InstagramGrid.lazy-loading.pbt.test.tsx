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

// Mock hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
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

// Generate arrays of images
const imageArrayArb = fc.array(imageUrlArb, { minLength: 0, maxLength: 20 });
const altArrayArb = fc.array(altTextArb, { minLength: 0, maxLength: 20 });

describe('Property 19: Lazy loading implementation', () => {
  it('should enable lazy loading for non-priority images', () => {
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

  it('should disable lazy loading for priority images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={true} />
          );

          const imgs = container.querySelectorAll('img');

          // No images should have lazy loading when priority is true
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

  it('should set priority attribute correctly for priority images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={true} />
          );

          const imgs = container.querySelectorAll('img');

          // All images should have priority attribute when priority is true
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

  it('should not set priority attribute for non-priority images', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        (images, alts) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={false} priority={false} />
          );

          const imgs = container.querySelectorAll('img');

          // No images should have priority attribute when priority is false
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

          // All images should have lazy loading by default
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

  it('should configure responsive sizes for all images regardless of priority', () => {
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

  it('should maintain consistent lazy loading behavior across all 9 images in a grid', () => {
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

          // All images should have the same loading behavior
          const firstImgLoading = imgs[0]?.getAttribute('data-loading');
          const firstImgPriority = imgs[0]?.getAttribute('data-priority');

          let allConsistent = true;
          imgs.forEach((img) => {
            const loading = img.getAttribute('data-loading');
            const imgPriority = img.getAttribute('data-priority');
            
            if (loading !== firstImgLoading || imgPriority !== firstImgPriority) {
              allConsistent = false;
            }
          });

          return allConsistent && imgs.length === 9;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not apply lazy loading to images when in loading state', () => {
    fc.assert(
      fc.property(
        imageArrayArb,
        altArrayArb,
        fc.boolean(),
        (images, alts, priority) => {
          const { container } = render(
            <InstagramGrid images={images} alts={alts} isLoading={true} priority={priority} />
          );

          // When isLoading is true, no images should be rendered
          const imgs = container.querySelectorAll('img');

          return imgs.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
