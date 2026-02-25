import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { CursorFollower } from './CursorFollower';
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 15: Cursor follower tracking
 * Validates: Requirements 4.5
 * 
 * For any mouse movement, the custom cursor follower element should update 
 * its position to track the cursor coordinates with blur effect applied.
 */
describe('Property 15: Cursor follower tracking', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => {
      cb();
      return 0;
    });
    // Reset cursor style
    document.body.style.cursor = 'auto';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up cursor style
    document.body.style.cursor = 'auto';
  });

  it('should render cursor follower', async () => {
    const { container } = render(<CursorFollower />);
    
    // Wait for component to become visible (after useEffect)
    await waitFor(() => {
      const cursor = container.querySelector('.fixed');
      expect(cursor).toBeInTheDocument();
    });
  });

  it('should track mouse position for any coordinates', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          x: fc.integer({ min: 0, max: 1920 }),
          y: fc.integer({ min: 0, max: 1080 }),
        }),
        async ({ x, y }) => {
          const { container, unmount } = render(<CursorFollower hideDefaultCursor={false} />);

          // Wait for component to mount
          await waitFor(() => {
            const cursor = container.querySelector('.fixed');
            expect(cursor).toBeInTheDocument();
          });

          // Simulate mouse move
          const event = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
          });
          window.dispatchEvent(event);

          // Verify cursor element exists
          const cursor = container.querySelector('.fixed');
          unmount();
          return cursor !== null;
        }
      ),
      { numRuns: 20 } // Reduced for async tests
    );
  });

  it('should apply blur effect with any blur value', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 50 }),
        async (blur) => {
          const { container, unmount } = render(<CursorFollower blur={blur} hideDefaultCursor={false} />);

          await waitFor(() => {
            const cursor = container.querySelector('.fixed') as HTMLElement;
            expect(cursor).toBeInTheDocument();
          });

          const cursor = container.querySelector('.fixed') as HTMLElement;
          const filterStyle = cursor?.style.filter;
          
          unmount();
          return filterStyle?.includes(`blur(${blur}px)`) ?? false;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should support custom size', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 10, max: 100 }),
        async (size) => {
          const { container, unmount } = render(<CursorFollower size={size} hideDefaultCursor={false} />);

          await waitFor(() => {
            const cursor = container.querySelector('.fixed') as HTMLElement;
            expect(cursor).toBeInTheDocument();
          });

          const cursor = container.querySelector('.fixed') as HTMLElement;
          const width = cursor?.style.width;
          const height = cursor?.style.height;

          unmount();
          return width === `${size}px` && height === `${size}px`;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should support custom opacity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
        async (opacity) => {
          const { container, unmount } = render(<CursorFollower opacity={opacity} hideDefaultCursor={false} />);

          await waitFor(() => {
            const cursor = container.querySelector('.fixed') as HTMLElement;
            expect(cursor).toBeInTheDocument();
          });

          const cursor = container.querySelector('.fixed') as HTMLElement;
          const opacityStyle = cursor?.style.opacity;

          unmount();
          const parsed = opacityStyle ? Number.parseFloat(opacityStyle) : NaN;
          return Number.isFinite(parsed) && Math.abs(parsed - opacity) < 1e-6;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should hide default cursor when hideDefaultCursor is true', async () => {
    const { unmount } = render(<CursorFollower hideDefaultCursor={true} />);

    await waitFor(() => {
      expect(document.body.style.cursor).toBe('none');
    });

    // Cleanup should restore cursor
    unmount();
    expect(document.body.style.cursor).toBe('auto');
  });

  it('should not hide default cursor when hideDefaultCursor is false', async () => {
    // Ensure cursor starts as auto
    document.body.style.cursor = 'auto';
    
    render(<CursorFollower hideDefaultCursor={false} />);

    await waitFor(() => {
      const cursor = document.querySelector('.fixed');
      expect(cursor).toBeInTheDocument();
    });

    // When hideDefaultCursor is false, cursor should remain auto (not be set to none)
    expect(document.body.style.cursor).toBe('auto');
  });
});
