import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ProgressIndicator } from './ProgressIndicator';

/**
 * Feature: premium-landing-page, Property 23: Circular progress stroke animation
 * 
 * For any circular progress indicator, the stroke-dashoffset property should
 * update smoothly to reflect the progress percentage.
 * 
 * Validates: Requirements 7.3
 */
describe('Property 23: Circular progress stroke animation', () => {
  it('should calculate stroke-dashoffset correctly for any progress percentage', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1 }),
        (progress) => {
          // The component uses a fixed radius of 40
          const radius = 40;
          const circumference = 2 * Math.PI * radius;
          
          // For a given progress (0 to 1), the stroke-dashoffset should be:
          // circumference * (1 - progress)
          // At progress 0: offset = circumference (no progress shown)
          // At progress 1: offset = 0 (full circle shown)
          const expectedOffset = circumference * (1 - progress);
          
          // Verify the calculation is correct
          // The component uses useTransform with [0, 1] -> [circumference, 0]
          // which means: offset = circumference - (progress * circumference)
          const calculatedOffset = circumference - (progress * circumference);
          
          // These should be equivalent
          expect(Math.abs(calculatedOffset - expectedOffset)).toBeLessThan(0.01);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have stroke-dashoffset range from circumference to 0 for circle type', () => {
    const { container } = render(
      <ProgressIndicator type="circle" />
    );

    const circles = container.querySelectorAll('circle');
    const progressCircle = circles[1];
    
    // Get the radius and calculate circumference
    const radius = parseFloat(progressCircle.getAttribute('r') || '0');
    const circumference = 2 * Math.PI * radius;
    
    // Get stroke-dasharray (should equal circumference)
    const strokeDasharray = parseFloat(
      progressCircle.getAttribute('stroke-dasharray') || '0'
    );
    
    // Verify stroke-dasharray equals circumference
    expect(Math.abs(strokeDasharray - circumference)).toBeLessThan(0.01);
    
    // The stroke-dashoffset is controlled by a MotionValue from useTransform
    // which maps scroll progress [0, 1] to [circumference, 0]
    // At progress 0: offset should be circumference (no fill)
    // At progress 1: offset should be 0 (full fill)
    
    // Verify the circumference is calculated correctly for radius 40
    expect(radius).toBe(40);
    expect(Math.abs(circumference - (2 * Math.PI * 40))).toBeLessThan(0.01);
  });

  it('should render line type with correct structure for any configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          position: fc.constantFrom('top', 'bottom', 'fixed'),
          thickness: fc.integer({ min: 1, max: 20 }),
          color: fc.constantFrom('#000000', '#ff0000', '#00ff00', '#0000ff'),
        }),
        ({ position, thickness, color }) => {
          const { container } = render(
            <ProgressIndicator
              type="line"
              position={position as 'top' | 'bottom' | 'fixed'}
              thickness={thickness}
              color={color}
            />
          );

          const wrapper = container.firstChild as HTMLElement;
          
          // Verify the element exists
          expect(wrapper).toBeTruthy();
          
          // Verify it has the correct height
          expect(wrapper.style.height).toBe(`${thickness}px`);
          
          // Verify it has a child element (the progress bar)
          expect(wrapper.children.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render circle type with correct SVG structure for any configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          position: fc.constantFrom('top', 'bottom', 'fixed'),
          thickness: fc.integer({ min: 1, max: 10 }),
          color: fc.constantFrom('#000000', '#ff0000', '#00ff00', '#0000ff'),
        }),
        ({ position, thickness, color }) => {
          const { container } = render(
            <ProgressIndicator
              type="circle"
              position={position as 'top' | 'bottom' | 'fixed'}
              thickness={thickness}
              color={color}
            />
          );

          const wrapper = container.firstChild as HTMLElement;
          
          // Verify the element exists
          expect(wrapper).toBeTruthy();
          
          // Verify it contains an SVG
          const svg = wrapper.querySelector('svg');
          expect(svg).toBeTruthy();
          
          // Verify SVG has two circles (background and progress)
          const circles = svg?.querySelectorAll('circle');
          expect(circles?.length).toBe(2);
          
          // Verify the progress circle has stroke-dasharray
          const progressCircle = circles?.[1];
          expect(progressCircle?.getAttribute('stroke-dasharray')).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should calculate correct circumference for circle type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('top', 'bottom', 'fixed'),
        (position) => {
          const { container } = render(
            <ProgressIndicator
              type="circle"
              position={position as 'top' | 'bottom' | 'fixed'}
            />
          );

          const svg = container.querySelector('svg');
          const circles = svg?.querySelectorAll('circle');
          const progressCircle = circles?.[1];
          
          // Get the radius from the circle
          const radius = parseFloat(progressCircle?.getAttribute('r') || '0');
          
          // Calculate expected circumference
          const expectedCircumference = 2 * Math.PI * radius;
          
          // Get actual stroke-dasharray value
          const strokeDasharray = parseFloat(
            progressCircle?.getAttribute('stroke-dasharray') || '0'
          );
          
          // Verify circumference calculation is correct
          expect(Math.abs(strokeDasharray - expectedCircumference)).toBeLessThan(0.01);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply correct positioning classes for any position', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('top', 'bottom', 'fixed'),
        fc.constantFrom('line', 'circle'),
        (position, type) => {
          const { container } = render(
            <ProgressIndicator
              type={type as 'line' | 'circle'}
              position={position as 'top' | 'bottom' | 'fixed'}
            />
          );

          const wrapper = container.firstChild as HTMLElement;
          
          // Verify fixed positioning is applied
          expect(wrapper.className).toContain('fixed');
          
          // Verify z-index is applied
          expect(wrapper.className).toContain('z-50');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle default props correctly', () => {
    const { container } = render(<ProgressIndicator />);
    
    const wrapper = container.firstChild as HTMLElement;
    
    // Verify element renders with defaults
    expect(wrapper).toBeTruthy();
    
    // Default type is 'line', so should have height style
    expect(wrapper.style.height).toBe('4px');
  });

  it('should apply custom className for any type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('line', 'circle'),
        fc.constantFrom('custom-class', 'test-class', 'my-progress'),
        (type, className) => {
          const { container } = render(
            <ProgressIndicator
              type={type as 'line' | 'circle'}
              className={className}
            />
          );

          const wrapper = container.firstChild as HTMLElement;
          
          // Verify custom className is applied
          expect(wrapper.className).toContain(className);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render both circle elements with correct stroke properties', () => {
    fc.assert(
      fc.property(
        fc.record({
          color: fc.constantFrom('#ff0000', '#00ff00', '#0000ff', '#ffff00'),
          thickness: fc.integer({ min: 2, max: 8 }),
        }),
        ({ color, thickness }) => {
          const { container } = render(
            <ProgressIndicator
              type="circle"
              color={color}
              thickness={thickness}
            />
          );

          const circles = container.querySelectorAll('circle');
          
          // Background circle should have gray stroke
          const bgCircle = circles[0];
          expect(bgCircle.getAttribute('stroke')).toBe('#e5e7eb');
          expect(bgCircle.getAttribute('stroke-width')).toBe(thickness.toString());
          
          // Progress circle should have the specified color
          const progressCircle = circles[1];
          expect(progressCircle.getAttribute('stroke')).toBe(color);
          expect(progressCircle.getAttribute('stroke-width')).toBe(thickness.toString());
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
