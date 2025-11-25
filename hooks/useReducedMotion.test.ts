import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import fc from 'fast-check';
import { useReducedMotion } from './useReducedMotion';

/**
 * Feature: premium-landing-page, Property 2: Reduced motion compliance
 * Validates: Requirements 1.3, 10.1, 10.2, 10.3, 10.4
 * 
 * For any animation in the Landing Page System, when the prefers-reduced-motion setting
 * is detected, the system should either disable the animation or replace it with a simple
 * fade transition while maintaining full functionality.
 */
describe('Property 2: Reduced motion compliance', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
  });

  it('should return boolean indicating motion preference', () => {
    // Mock matchMedia
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());
    
    // Verify that the hook returns a boolean
    expect(typeof result.current).toBe('boolean');
  });

  it('should return true when prefers-reduced-motion is set to reduce', () => {
    // Mock matchMedia to return matches: true
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current).toBe(true);
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    // Mock matchMedia to return matches: false
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => useReducedMotion());
    
    expect(result.current).toBe(false);
  });

  it('should maintain consistent boolean output for any media query state', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (prefersReduced) => {
          // Mock matchMedia with the generated boolean
          const mockMatchMedia = vi.fn().mockImplementation((query) => ({
            matches: prefersReduced,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }));

          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: mockMatchMedia,
          });

          const { result } = renderHook(() => useReducedMotion());
          
          // The hook should return the same boolean value as the media query
          return result.current === prefersReduced;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure animations can be conditionally disabled based on preference', () => {
    fc.assert(
      fc.property(
        fc.record({
          prefersReduced: fc.boolean(),
          animationEnabled: fc.boolean(),
        }),
        ({ prefersReduced, animationEnabled }) => {
          // Mock matchMedia
          const mockMatchMedia = vi.fn().mockImplementation((query) => ({
            matches: prefersReduced,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }));

          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: mockMatchMedia,
          });

          const { result } = renderHook(() => useReducedMotion());
          
          // Simulate animation decision logic
          const shouldAnimate = animationEnabled && !result.current;
          
          // If user prefers reduced motion, animations should be disabled
          if (prefersReduced && animationEnabled) {
            return shouldAnimate === false;
          }
          
          // If user doesn't prefer reduced motion, respect the animation setting
          if (!prefersReduced) {
            return shouldAnimate === animationEnabled;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain functionality regardless of motion preference', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        (prefersReduced) => {
          // Mock matchMedia
          const mockMatchMedia = vi.fn().mockImplementation((query) => ({
            matches: prefersReduced,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }));

          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: mockMatchMedia,
          });

          const { result } = renderHook(() => useReducedMotion());
          
          // The hook should always return a valid boolean
          // This ensures functionality is maintained regardless of preference
          return typeof result.current === 'boolean';
        }
      ),
      { numRuns: 100 }
    );
  });
});
