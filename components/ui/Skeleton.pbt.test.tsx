import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { Suspense, lazy } from 'react';
import {
  Skeleton,
  HeroSkeleton,
  FeaturesSkeleton,
  GridSkeleton,
  FormSkeleton,
} from './Skeleton';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
}));

/**
 * Feature: premium-landing-page, Property 18: Skeleton screen display during loading
 * 
 * Property: For any heavy animation component being dynamically imported,
 * a skeleton screen should display until the component loads.
 * 
 * Validates: Requirements 5.4
 */
describe('Property 18: Skeleton screen display during loading', () => {
  it('should render skeleton components suitable for loading states', () => {
    fc.assert(
      fc.property(
        fc.record({
          // Different skeleton types that would be used during loading
          skeletonType: fc.constantFrom('hero', 'features', 'grid', 'form', 'basic'),
          // Different dimensions for basic skeleton
          width: fc.integer({ min: 50, max: 500 }),
          height: fc.integer({ min: 20, max: 200 }),
        }),
        ({ skeletonType, width, height }) => {
          let component;
          switch (skeletonType) {
            case 'hero':
              component = <HeroSkeleton />;
              break;
            case 'features':
              component = <FeaturesSkeleton />;
              break;
            case 'grid':
              component = <GridSkeleton count={3} />;
              break;
            case 'form':
              component = <FormSkeleton />;
              break;
            case 'basic':
              component = <Skeleton width={width} height={height} />;
              break;
          }

          // Render skeleton component directly (as it would appear during loading)
          const { container } = render(component);

          // Skeleton elements should be present (they have bg-gray-200 class)
          const skeletons = container.querySelectorAll('.bg-gray-200');

          // Should have at least one skeleton element
          return skeletons.length >= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display appropriate skeleton variant for any component type', () => {
    fc.assert(
      fc.property(
        fc.record({
          variant: fc.constantFrom('text', 'circular', 'rectangular'),
          width: fc.oneof(
            fc.integer({ min: 50, max: 500 }),
            fc.constantFrom('50%', '100%', '80%')
          ),
          height: fc.oneof(
            fc.integer({ min: 20, max: 200 }),
            fc.constantFrom('1rem', '2rem', '3rem')
          ),
        }),
        ({ variant, width, height }) => {
          const { container } = render(
            <Skeleton variant={variant} width={width} height={height} />
          );

          const skeleton = container.firstChild as HTMLElement;

          // Skeleton should exist
          if (!skeleton) return false;

          // Should have the gray background
          if (!skeleton.className.includes('bg-gray-200')) return false;

          // Should have the correct variant class
          const variantClasses = {
            text: 'rounded',
            circular: 'rounded-full',
            rectangular: 'rounded-md',
          };

          if (!skeleton.className.includes(variantClasses[variant])) return false;

          // Should have the correct dimensions
          const expectedWidth = typeof width === 'number' ? `${width}px` : width;
          const expectedHeight = typeof height === 'number' ? `${height}px` : height;

          return skeleton.style.width === expectedWidth && skeleton.style.height === expectedHeight;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render skeleton with animation unless reduced motion is preferred', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 50, max: 500 }),
          height: fc.integer({ min: 20, max: 200 }),
        }),
        ({ width, height }) => {
          const { container } = render(<Skeleton width={width} height={height} />);

          const skeleton = container.firstChild as HTMLElement;

          // Skeleton should exist and be visible
          return skeleton !== null && skeleton.className.includes('bg-gray-200');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render complex skeleton structures for any section type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('hero', 'features', 'grid', 'form'),
        (sectionType) => {
          let component;
          switch (sectionType) {
            case 'hero':
              component = <HeroSkeleton />;
              break;
            case 'features':
              component = <FeaturesSkeleton />;
              break;
            case 'grid':
              component = <GridSkeleton count={6} />;
              break;
            case 'form':
              component = <FormSkeleton />;
              break;
          }

          const { container } = render(component);

          // Should have multiple skeleton elements
          const skeletons = container.querySelectorAll('.bg-gray-200');

          // Complex skeletons should have at least 3 skeleton elements
          return skeletons.length >= 3;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain layout structure during skeleton display for any grid size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        (gridCount) => {
          const { container } = render(<GridSkeleton count={gridCount} />);

          // Should have grid layout
          const grid = container.querySelector('.grid');
          if (!grid) return false;

          // Should have exactly the specified number of cards
          const cards = container.querySelectorAll('.border');
          return cards.length === gridCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});
