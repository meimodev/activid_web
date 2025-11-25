import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getAnimationParams } from './useResponsiveAnimation';

/**
 * Feature: premium-landing-page, Property 19: Responsive animation adaptation
 * 
 * For any animation, when the viewport width changes, the system should recalculate 
 * and apply animation parameters appropriate for the new viewport size.
 * 
 * Validates: Requirements 6.1, 6.2, 6.3
 */
describe('Property 19: Responsive animation adaptation', () => {
  it('should apply appropriate animation params for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          const params = getAnimationParams(viewportWidth);
          
          if (viewportWidth < 768) {
            // Mobile should have reduced values
            // Distance should be less than desktop (50 vs 100)
            // Scale should be higher than desktop (0.9 vs 0.8)
            // Duration should be shorter (1.0 vs 1.2)
            // RotateX should be less extreme (-10 vs -15)
            return (
              params.distance === 50 &&
              params.scale === 0.9 &&
              params.duration === 1.0 &&
              params.rotateX === -10
            );
          } else {
            // Desktop should have full values
            return (
              params.distance === 100 &&
              params.scale === 0.8 &&
              params.duration === 1.2 &&
              params.rotateX === -15
            );
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return consistent params for the same viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 3840 }),
        (viewportWidth) => {
          const params1 = getAnimationParams(viewportWidth);
          const params2 = getAnimationParams(viewportWidth);
          
          return (
            params1.distance === params2.distance &&
            params1.scale === params2.scale &&
            params1.duration === params2.duration &&
            params1.rotateX === params2.rotateX
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have mobile params with reduced complexity compared to desktop', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }),
        fc.integer({ min: 768, max: 3840 }),
        (mobileWidth, desktopWidth) => {
          const mobileParams = getAnimationParams(mobileWidth);
          const desktopParams = getAnimationParams(desktopWidth);
          
          // Mobile should have smaller distance
          const hasReducedDistance = mobileParams.distance < desktopParams.distance;
          
          // Mobile should have less extreme scale (closer to 1)
          const hasReducedScale = mobileParams.scale > desktopParams.scale;
          
          // Mobile should have shorter duration
          const hasShorterDuration = mobileParams.duration < desktopParams.duration;
          
          // Mobile should have less extreme rotation
          const hasReducedRotation = Math.abs(mobileParams.rotateX) < Math.abs(desktopParams.rotateX);
          
          return hasReducedDistance && hasReducedScale && hasShorterDuration && hasReducedRotation;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should transition at exactly 768px breakpoint', () => {
    const params767 = getAnimationParams(767);
    const params768 = getAnimationParams(768);
    
    // 767px should be mobile
    expect(params767.distance).toBe(50);
    expect(params767.scale).toBe(0.9);
    
    // 768px should be desktop
    expect(params768.distance).toBe(100);
    expect(params768.scale).toBe(0.8);
  });
});
