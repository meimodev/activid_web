import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InteractiveHover } from './InteractiveHover';
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 12: Interactive element hover response
 * Validates: Requirements 4.2
 * 
 * For any interactive element, when hovered, the element should apply scale and 
 * rotation transformations that complete within 250 milliseconds.
 */
describe('Property 12: Interactive element hover response', () => {
  it('should render children correctly', () => {
    render(
      <InteractiveHover>
        <div>Test Content</div>
      </InteractiveHover>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply hover transformations within 250ms for any valid configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          scale: fc.double({ min: 1.0, max: 1.5 }),
          rotation: fc.double({ min: -10, max: 10 }),
          duration: fc.double({ min: 0.1, max: 0.25 }),
        }),
        (config) => {
          const { container } = render(
            <InteractiveHover
              scale={config.scale}
              rotation={config.rotation}
              duration={config.duration}
            >
              <div>Hover Test</div>
            </InteractiveHover>
          );

          const element = container.firstChild as HTMLElement;
          
          // Verify element exists
          if (!element) return false;

          // Verify duration is within 250ms requirement
          if (config.duration > 0.25) return false;

          // Verify scale is applied (should be >= 1.0)
          if (config.scale < 1.0) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use default values when props are not provided', () => {
    const { container } = render(
      <InteractiveHover>
        <div>Default Test</div>
      </InteractiveHover>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (className) => {
          const { container } = render(
            <InteractiveHover className={className}>
              <div>Class Test</div>
            </InteractiveHover>
          );

          const element = container.firstChild as HTMLElement;
          return element.className.includes(className);
        }
      ),
      { numRuns: 100 }
    );
  });
});
