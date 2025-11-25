/**
 * Property-Based Tests for BrowserFrame component
 * Tests universal properties that should hold across all inputs
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { BrowserFrame } from './BrowserFrame';

/**
 * Arbitrary generator for image URLs
 */
const imageUrlArbitrary = fc.webUrl({ validSchemes: ['http', 'https'] });

/**
 * Arbitrary generator for alt text
 */
const altTextArbitrary = fc.string({ minLength: 1, maxLength: 100 });

/**
 * Arbitrary generator for a set of 9 images with alt texts
 */
const imageSetArbitrary = fc.record({
  images: fc.array(imageUrlArbitrary, { minLength: 9, maxLength: 9 }),
  alts: fc.array(altTextArbitrary, { minLength: 9, maxLength: 9 }),
});

/**
 * Arbitrary generator for multiple browser frames (2-5)
 */
const multipleBrowserFramesArbitrary = fc.array(imageSetArbitrary, { 
  minLength: 2, 
  maxLength: 5 
});

describe('BrowserFrame Property-Based Tests', () => {
  /**
   * **Feature: project-showcase-section, Property 5: Browser frame consistency**
   * **Validates: Requirements 2.4**
   * 
   * For any set of multiple browser frames in the section, all frames should have 
   * identical chrome styling, dimensions, and structural elements.
   */
  it('should maintain consistent chrome styling and structure across multiple frames', () => {
    fc.assert(
      fc.property(multipleBrowserFramesArbitrary, (frameSets) => {
        // Render all browser frames
        const renderedFrames = frameSets.map((frameSet, index) => {
          const { container } = render(
            <BrowserFrame
              key={index}
              mockupImages={frameSet.images}
              imageAlts={frameSet.alts}
            />
          );
          return container;
        });

        // Extract structural elements from each frame
        const frameStructures = renderedFrames.map((container) => {
          const frame = container.querySelector('[role="region"]');
          // Window controls are decorative divs with specific colors (not buttons)
          const windowControls = container.querySelectorAll('.bg-red-500, .bg-yellow-500, .bg-green-500');
          // Address bar has responsive classes
          const addressBar = container.querySelector('.bg-white.rounded');
          
          return {
            hasFrame: !!frame,
            windowControlCount: windowControls.length,
            hasAddressBar: !!addressBar,
            // Extract computed styles for consistency check
            frameClasses: frame?.className || '',
            windowControlClasses: Array.from(windowControls).map(el => el.className),
          };
        });

        // Verify all frames have identical structure
        const firstStructure = frameStructures[0];
        
        // All frames should have the main frame element
        const allHaveFrame = frameStructures.every(s => s.hasFrame === true);
        
        // All frames should have exactly 3 window controls
        const allHaveThreeControls = frameStructures.every(s => s.windowControlCount === 3);
        
        // All frames should have an address bar
        const allHaveAddressBar = frameStructures.every(s => s.hasAddressBar === true);
        
        // All frames should have identical base classes
        const allHaveCorrectClasses = frameStructures.every(s => 
          s.frameClasses.includes('bg-white') &&
          s.frameClasses.includes('rounded-lg') &&
          s.frameClasses.includes('shadow-lg')
        );
        
        // Window controls should have consistent styling
        const allControlsStyled = frameStructures.every(structure => {
          if (structure.windowControlClasses.length !== 3) return false;
          
          const expectedColors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500'];
          return structure.windowControlClasses.every((classes, controlIndex) => 
            classes.includes('w-3') &&
            classes.includes('h-3') &&
            classes.includes('rounded-full') &&
            classes.includes(expectedColors[controlIndex])
          );
        });
        
        return allHaveFrame && allHaveThreeControls && allHaveAddressBar && 
               allHaveCorrectClasses && allControlsStyled;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Browser chrome elements should always be present
   */
  it('should always render all required chrome elements', () => {
    fc.assert(
      fc.property(imageSetArbitrary, (frameSet) => {
        const { container } = render(
          <BrowserFrame
            mockupImages={frameSet.images}
            imageAlts={frameSet.alts}
          />
        );

        // Verify presence of all chrome elements
        const frame = container.querySelector('[role="region"]');
        // Window controls are decorative divs with specific colors
        const redControl = container.querySelector('.bg-red-500');
        const yellowControl = container.querySelector('.bg-yellow-500');
        const greenControl = container.querySelector('.bg-green-500');
        const addressBar = container.querySelector('.bg-white.rounded');
        const lockIcon = container.querySelector('svg');

        return (
          !!frame &&
          !!redControl &&
          !!yellowControl &&
          !!greenControl &&
          !!addressBar &&
          !!lockIcon &&
          addressBar?.textContent?.includes('instagram.com/project')
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Loading state should not affect chrome structure
   */
  it('should maintain chrome structure regardless of loading state', () => {
    fc.assert(
      fc.property(imageSetArbitrary, fc.boolean(), (frameSet, isLoading) => {
        const { container } = render(
          <BrowserFrame
            mockupImages={frameSet.images}
            imageAlts={frameSet.alts}
            isLoading={isLoading}
          />
        );

        // Chrome elements should always be present regardless of loading state
        const redControl = container.querySelector('.bg-red-500');
        const yellowControl = container.querySelector('.bg-yellow-500');
        const greenControl = container.querySelector('.bg-green-500');
        const addressBar = container.querySelector('.bg-white.rounded');

        return !!redControl && !!yellowControl && !!greenControl && !!addressBar;
      }),
      { numRuns: 100 }
    );
  });
});
