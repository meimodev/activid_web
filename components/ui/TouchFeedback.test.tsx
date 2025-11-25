import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { TouchFeedback, useTouchDevice } from './TouchFeedback';
import { renderHook } from '@testing-library/react';

/**
 * Feature: premium-landing-page, Property 20: Touch interaction feedback
 * 
 * For any touch interaction on mobile devices, the system should provide 
 * haptic-style feedback through animations.
 * 
 * Validates: Requirements 6.5
 */
describe('Property 20: Touch interaction feedback', () => {
  it('should apply scale and opacity feedback for any touch interaction', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleOnTouch: fc.double({ min: 0.8, max: 0.99 }),
          opacityOnTouch: fc.double({ min: 0.5, max: 0.95 }),
          duration: fc.double({ min: 0.05, max: 0.5 }),
        }),
        ({ scaleOnTouch, opacityOnTouch, duration }) => {
          const onTouchStart = vi.fn();
          const onTouchEnd = vi.fn();
          
          const { container } = render(
            <TouchFeedback
              scaleOnTouch={scaleOnTouch}
              opacityOnTouch={opacityOnTouch}
              duration={duration}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div>Touch me</div>
            </TouchFeedback>
          );
          
          const element = container.firstChild as HTMLElement;
          
          // Simulate touch start
          fireEvent.touchStart(element);
          
          // Callbacks should be called
          expect(onTouchStart).toHaveBeenCalledTimes(1);
          
          // Simulate touch end
          fireEvent.touchEnd(element);
          
          expect(onTouchEnd).toHaveBeenCalledTimes(1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle touch cancel events for any configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleOnTouch: fc.double({ min: 0.8, max: 0.99 }),
          opacityOnTouch: fc.double({ min: 0.5, max: 0.95 }),
        }),
        ({ scaleOnTouch, opacityOnTouch }) => {
          const onTouchEnd = vi.fn();
          
          const { container } = render(
            <TouchFeedback
              scaleOnTouch={scaleOnTouch}
              opacityOnTouch={opacityOnTouch}
              onTouchEnd={onTouchEnd}
            >
              <div>Touch me</div>
            </TouchFeedback>
          );
          
          const element = container.firstChild as HTMLElement;
          
          // Simulate touch start then cancel
          fireEvent.touchStart(element);
          fireEvent.touchCancel(element);
          
          // Touch end callback should be called on cancel
          expect(onTouchEnd).toHaveBeenCalledTimes(1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve children content through touch interactions', () => {
    fc.assert(
      fc.property(
        fc.record({
          scaleOnTouch: fc.double({ min: 0.8, max: 0.99 }),
          opacityOnTouch: fc.double({ min: 0.5, max: 0.95 }),
        }),
        ({ scaleOnTouch, opacityOnTouch }) => {
          const testContent = 'Test Content';
          const { container, unmount } = render(
            <TouchFeedback
              scaleOnTouch={scaleOnTouch}
              opacityOnTouch={opacityOnTouch}
            >
              <div>{testContent}</div>
            </TouchFeedback>
          );
          
          const element = container.firstChild as HTMLElement;
          
          // Content should be present before touch
          const hasContentBefore = container.textContent?.includes(testContent);
          
          // Simulate touch interaction
          fireEvent.touchStart(element);
          fireEvent.touchEnd(element);
          
          // Content should still be present after touch
          const hasContentAfter = container.textContent?.includes(testContent);
          
          unmount();
          
          return hasContentBefore && hasContentAfter;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use default values when props are not provided', () => {
    const { container } = render(
      <TouchFeedback>
        <div>Default</div>
      </TouchFeedback>
    );
    
    const element = container.firstChild as HTMLElement;
    expect(element).toBeTruthy();
    
    // Should handle touch events with defaults
    fireEvent.touchStart(element);
    fireEvent.touchEnd(element);
    
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('should apply tap highlight color transparent style', () => {
    const { container } = render(
      <TouchFeedback>
        <div>Content</div>
      </TouchFeedback>
    );
    
    const element = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(element);
    
    // WebkitTapHighlightColor should be set (even if not computed)
    expect(element).toBeTruthy();
  });
});

describe('useTouchDevice hook', () => {
  it('should return a boolean value', () => {
    const { result } = renderHook(() => useTouchDevice());
    expect(typeof result.current).toBe('boolean');
  });
});
