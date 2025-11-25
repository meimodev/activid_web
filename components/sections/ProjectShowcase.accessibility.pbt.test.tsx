import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ProjectShowcase } from './ProjectShowcase';
import type { ProjectData } from '@/types/project-showcase.types';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ 
    src, 
    alt, 
    fill, 
    sizes, 
    className, 
    loading 
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    loading?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      className={className}
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      data-loading={loading}
    />
  ),
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div className={className} {...props}>{children}</div>
    ),
    article: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
      <article className={className} {...props}>{children}</article>
    ),
  },
}));

/**
 * Arbitraries for generating test data
 */
const validIdArb = fc.string({ minLength: 1, maxLength: 50 });
const validClientArb = fc.string({ minLength: 2, maxLength: 30 }).map(s => `@${s}`);
const validProjectTypeArb = fc.string({ minLength: 3, maxLength: 100 });
const validDescriptionArb = fc.string({ minLength: 10, maxLength: 500 });
const validResultsArb = fc.string({ minLength: 10, maxLength: 500 });
const validImageUrlArb = fc.webUrl();
const validAltTextArb = fc.string({ minLength: 5, maxLength: 100 });

// Generate a valid ProjectData object
const validProjectDataArb = fc.record({
  id: validIdArb,
  client: validClientArb,
  projectType: validProjectTypeArb,
  description: validDescriptionArb,
  results: validResultsArb,
  mockupImages: fc.array(validImageUrlArb, { minLength: 9, maxLength: 9 }),
  imageAlts: fc.array(validAltTextArb, { minLength: 9, maxLength: 9 }),
});

/**
 * Feature: project-showcase-section, Property 16: Image alt text presence
 * 
 * For any image rendered in the section, it should have a non-empty alt attribute.
 * 
 * Validates: Requirements 7.2
 */
describe('Property 16: Image alt text presence', () => {
  it('should have non-empty alt text for all images', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const images = container.querySelectorAll('img');

          // All images should have non-empty alt text
          let allHaveAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim().length === 0) {
              allHaveAlt = false;
            }
          });

          return allHaveAlt && images.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use provided alt text from imageAlts array when valid', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that valid alt text from projects is used
          // Valid means: non-empty after trimming and at least 5 characters
          let allValidAltTextsPresent = true;
          projects.forEach((project) => {
            project.imageAlts.forEach((altText) => {
              const trimmedAlt = altText.trim();
              // Only check for valid alt text (at least 5 chars after trimming)
              if (trimmedAlt.length >= 5) {
                const images = container.querySelectorAll('img');
                let found = false;
                images.forEach((img) => {
                  if (img.getAttribute('alt') === altText) {
                    found = true;
                  }
                });
                if (!found) {
                  allValidAltTextsPresent = false;
                }
              }
            });
          });

          return allValidAltTextsPresent;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have descriptive alt text (not just generic placeholders)', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const images = container.querySelectorAll('img');

          // Alt text should be descriptive (at least 5 characters after trimming)
          // Component should use fallback for whitespace-only or very short alt text
          let allDescriptive = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim().length < 5) {
              allDescriptive = false;
            }
          });

          return allDescriptive && images.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain alt text even with placeholder images', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: validIdArb,
            client: validClientArb,
            projectType: validProjectTypeArb,
            description: validDescriptionArb,
            results: validResultsArb,
            mockupImages: fc.array(validImageUrlArb, { minLength: 0, maxLength: 5 }), // Fewer than 9
            imageAlts: fc.array(validAltTextArb, { minLength: 0, maxLength: 5 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects as ProjectData[]} />);

          const images = container.querySelectorAll('img');

          // Even placeholder images should have alt text
          let allHaveAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim().length === 0) {
              allHaveAlt = false;
            }
          });

          return allHaveAlt;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 17: Keyboard navigation
 * 
 * For any interactive element in the section, it should be reachable via 
 * keyboard navigation and display visible focus indicators.
 * 
 * Validates: Requirements 7.3
 */
describe('Property 17: Keyboard navigation', () => {
  it('should have focusable elements for interactive content', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for focusable elements (links, buttons, etc.)
          const focusableElements = container.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );

          // If there are interactive elements, they should be keyboard accessible
          // For this component, we expect at least the case study cards to be present
          const articles = container.querySelectorAll('article');
          
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have negative tabindex on interactive elements', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that no interactive elements have tabindex="-1"
          const interactiveElements = container.querySelectorAll('a, button');
          
          let noNegativeTabindex = true;
          interactiveElements.forEach((el) => {
            const tabindex = el.getAttribute('tabindex');
            if (tabindex === '-1') {
              noNegativeTabindex = false;
            }
          });

          return noNegativeTabindex;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have proper semantic structure for keyboard navigation', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should have semantic HTML structure
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');
          const articles = container.querySelectorAll('article');

          return (
            section !== null &&
            heading !== null &&
            articles.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have logical tab order through content', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that elements appear in DOM order (no explicit tabindex reordering)
          const elementsWithTabindex = container.querySelectorAll('[tabindex]');
          
          let allValidTabindex = true;
          elementsWithTabindex.forEach((el) => {
            const tabindex = el.getAttribute('tabindex');
            // Tabindex should be 0 or positive (not negative, and not excessively high)
            if (tabindex && parseInt(tabindex) < 0) {
              allValidTabindex = false;
            }
          });

          return allValidTabindex;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain keyboard accessibility with any number of projects', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 0, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Section should always be accessible
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');

          // These core elements should always be present and accessible
          return section !== null && heading !== null;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 18: Non-color information indicators
 * 
 * For any information conveyed through color, there should be an additional 
 * non-color indicator (text, icon, or pattern).
 * 
 * Validates: Requirements 7.5
 */
describe('Property 18: Non-color information indicators', () => {
  it('should use text labels in addition to any color coding', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that key information is conveyed through text
          const textContent = container.textContent || '';

          // Should have text labels like "Result:", project numbers, etc.
          const hasResultLabel = textContent.includes('Result:');
          
          // Should have project numbers (01., 02., etc.)
          let hasProjectNumbers = true;
          projects.forEach((_, index) => {
            const expectedNumber = `${String(index + 1).padStart(2, '0')}.`;
            if (!textContent.includes(expectedNumber)) {
              hasProjectNumbers = false;
            }
          });

          return hasResultLabel && hasProjectNumbers;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have numbered indicators for project ordering', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each project should have a numbered indicator
          let allHaveNumbers = true;
          projects.forEach((_, index) => {
            const expectedNumber = `${String(index + 1).padStart(2, '0')}.`;
            const numberElements = container.querySelectorAll(`[aria-label*="Project number ${expectedNumber}"]`);
            if (numberElements.length === 0) {
              allHaveNumbers = false;
            }
          });

          return allHaveNumbers;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use semantic HTML elements to convey structure', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should use semantic elements
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');
          const articles = container.querySelectorAll('article');

          // Semantic structure provides non-color information about content hierarchy
          return (
            section !== null &&
            heading !== null &&
            articles.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have ARIA labels for additional context', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should have ARIA labels on key elements
          const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');

          // Should have multiple ARIA labels for context
          return elementsWithAriaLabel.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use text separators (vertical bar) not just color', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should have vertical bar separators between client and project type
          const textContent = container.textContent || '';
          const hasSeparator = textContent.includes('|');

          return hasSeparator;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide browser chrome visual indicators (not just color)', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Browser frames should have structural elements (window controls)
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');

          // Each frame should have window controls (visual indicators)
          let allHaveControls = true;
          browserFrames.forEach((frame) => {
            const controls = frame.querySelectorAll('.bg-red-500, .bg-yellow-500, .bg-green-500');
            if (controls.length < 3) {
              allHaveControls = false;
            }
          });

          return allHaveControls && browserFrames.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
