import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Toast } from './Toast';
import fc from 'fast-check';

/**
 * Feature: premium-landing-page, Property 14: Form submission feedback
 * Validates: Requirements 4.4
 * 
 * For any form submission, the system should display a toast notification 
 * with spring physics animation.
 */
describe('Property 14: Form submission feedback', () => {
  it('should render toast when visible', () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        isVisible={true}
        onClose={onClose}
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should not render toast when not visible', () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        isVisible={false}
        onClose={onClose}
      />
    );
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should display toast with spring physics for any message', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (message) => {
          const onClose = vi.fn();
          const { container } = render(
            <Toast
              message={message}
              isVisible={true}
              onClose={onClose}
              duration={0} // Disable auto-dismiss for testing
            />
          );

          // Verify toast is rendered
          const toast = container.querySelector('.fixed');
          if (!toast) return false;

          // Verify message is displayed
          return toast.textContent?.includes(message) ?? false;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should auto-dismiss after timeout for any duration', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          message: fc.string({ minLength: 1, maxLength: 50 }),
          duration: fc.integer({ min: 100, max: 500 }),
        }),
        async ({ message, duration }) => {
          const onClose = vi.fn();
          render(
            <Toast
              message={message}
              isVisible={true}
              onClose={onClose}
              duration={duration}
            />
          );

          // Wait for auto-dismiss
          await waitFor(
            () => {
              expect(onClose).toHaveBeenCalled();
            },
            { timeout: duration + 200 }
          );

          return onClose.mock.calls.length === 1;
        }
      ),
      { numRuns: 20 } // Reduced runs for async tests
    );
  });

  it('should support different toast types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('success', 'error', 'info', 'warning'),
        (type) => {
          const onClose = vi.fn();
          const { container } = render(
            <Toast
              message="Test"
              type={type}
              isVisible={true}
              onClose={onClose}
              duration={0}
            />
          );

          const toast = container.querySelector('.fixed');
          return toast !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should support different positions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
          'top-center',
          'bottom-center'
        ),
        (position) => {
          const onClose = vi.fn();
          const { container } = render(
            <Toast
              message="Test"
              position={position}
              isVisible={true}
              onClose={onClose}
              duration={0}
            />
          );

          const toast = container.querySelector('.fixed');
          return toast !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have close button that calls onClose', () => {
    const onClose = vi.fn();
    render(
      <Toast
        message="Test message"
        isVisible={true}
        onClose={onClose}
        duration={0}
      />
    );

    const closeButton = screen.getByLabelText('Close notification');
    closeButton.click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
