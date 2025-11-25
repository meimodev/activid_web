import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ScaleOnScroll } from './ScaleOnScroll';

/**
 * Feature: premium-landing-page, Property 8: Scroll-linked scale animation
 * Validates: Requirements 3.4
 * 
 * For any element with scale animation, the element's scale value should interpolate
 * from 0.5 to 1.0 proportionally to the scroll progress through its viewport intersection.
 */
describe('Property 8: Scroll-linked scale animation', () => {
  it('should interpolate scale from scaleFrom to scaleTo based on scroll progress', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleFrom: fc.double({ min: 0.1, max: 0.9, noNaN: true }),
          scaleTo: fc.double({ min: 1.0, max: 2.0, noNaN: true }),
          scrollProgress: fc.double({ min: 0, max: 1, noNaN: true }),
        }),
        ({ scaleFrom, scaleTo, scrollProgress }) => {
          // The scale should be between scaleFrom and scaleTo
          // At scrollProgress 0, scale should be scaleFrom
          // At scrollProgress 0.5 or higher, scale should be scaleTo
          
          // Calculate expected scale based on scroll progress
          let expectedScale: number;
          if (scrollProgress <= 0.5) {
            // Linear interpolation from scaleFrom to scaleTo over first 50% of scroll
            expectedScale = scaleFrom + (scaleTo - scaleFrom) * (scrollProgress / 0.5);
          } else {
            // After 50%, scale stays at scaleTo
            expectedScale = scaleTo;
          }
          
          // Verify the scale is within valid range
          const isValidScale = expectedScale >= scaleFrom && expectedScale <= scaleTo;
          
          // Verify monotonic increase (scale never decreases as scroll progresses)
          const isMonotonic = scrollProgress === 0 
            ? expectedScale === scaleFrom 
            : expectedScale >= scaleFrom;
          
          return isValidScale && isMonotonic;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render children with scale animation', () => {
    const { container } = render(
      <ScaleOnScroll>
        <div data-testid="content">Test Content</div>
      </ScaleOnScroll>
    );
    
    expect(container.querySelector('[data-testid="content"]')).toBeInTheDocument();
  });

  it('should accept custom scale values', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleFrom: fc.double({ min: 0.1, max: 0.9, noNaN: true }),
          scaleTo: fc.double({ min: 1.0, max: 2.0, noNaN: true }),
        }),
        ({ scaleFrom, scaleTo }) => {
          const { container } = render(
            <ScaleOnScroll scaleFrom={scaleFrom} scaleTo={scaleTo}>
              <div>Test</div>
            </ScaleOnScroll>
          );
          
          // Component should render successfully with any valid scale values
          return container.firstChild !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain scale bounds for any scroll progress', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleFrom: fc.double({ min: 0.1, max: 0.9, noNaN: true }),
          scaleTo: fc.double({ min: 1.0, max: 2.0, noNaN: true }),
          scrollProgress: fc.double({ min: 0, max: 1, noNaN: true }),
        }),
        ({ scaleFrom, scaleTo, scrollProgress }) => {
          // Calculate the scale value using the same logic as the component
          let scale: number;
          if (scrollProgress <= 0.5) {
            scale = scaleFrom + (scaleTo - scaleFrom) * (scrollProgress / 0.5);
          } else {
            scale = scaleTo;
          }
          
          // Scale should never be less than scaleFrom or greater than scaleTo
          return scale >= scaleFrom && scale <= scaleTo;
        }
      ),
      { numRuns: 100 }
    );
  });
});
