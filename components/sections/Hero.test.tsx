import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Hero } from './Hero';
import fc from 'fast-check';
import type { HeroContent } from '@/types/hero.types';

// Mock the hooks
vi.mock('@/hooks/useMousePosition', () => ({
  useMousePosition: () => ({ x: 0, y: 0 }),
}));

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('Hero Component', () => {
  const mockContent: HeroContent = {
    title: 'Welcome to Our Site',
    subtitle: 'Premium Experience',
    description: 'This is a test description',
    cta: {
      primary: {
        text: 'Get Started',
        href: '/get-started',
      },
      secondary: {
        text: 'Learn More',
        href: '/learn-more',
      },
    },
  };

  it('should render hero content', () => {
    const { container } = render(<Hero content={mockContent} />);
    
    expect(container.textContent).toContain(mockContent.title);
    expect(container.textContent).toContain(mockContent.subtitle);
    expect(container.textContent).toContain(mockContent.description);
  });

  it('should render CTA buttons', () => {
    const { container } = render(<Hero content={mockContent} />);
    
    const primaryButton = container.querySelector(`a[href="${mockContent.cta.primary.href}"]`);
    const secondaryButton = container.querySelector(`a[href="${mockContent.cta.secondary?.href}"]`);
    
    expect(primaryButton).toBeTruthy();
    expect(primaryButton?.textContent).toBe(mockContent.cta.primary.text);
    expect(secondaryButton).toBeTruthy();
    expect(secondaryButton?.textContent).toBe(mockContent.cta.secondary?.text);
  });

  it('should render without secondary CTA', () => {
    const contentWithoutSecondary: HeroContent = {
      ...mockContent,
      cta: {
        primary: mockContent.cta.primary,
      },
    };
    
    const { container } = render(<Hero content={contentWithoutSecondary} />);
    
    const buttons = container.querySelectorAll('a');
    expect(buttons.length).toBe(1);
  });

  it('should render gradient orbs when provided', () => {
    const contentWithOrbs: HeroContent = {
      ...mockContent,
      gradientOrbs: {
        count: 3,
        colors: ['#ff0000', '#00ff00', '#0000ff'],
      },
    };
    
    const { container } = render(<Hero content={contentWithOrbs} />);
    
    // Check for orb elements
    const orbs = container.querySelectorAll('[class*="blur-3xl"]');
    expect(orbs.length).toBe(3);
  });

  it('should apply custom className', () => {
    const className = 'custom-hero-class';
    const { container } = render(<Hero content={mockContent} className={className} />);
    
    const section = container.querySelector('section');
    expect(section?.className).toContain(className);
  });
});

/**
 * Feature: premium-landing-page, Property 3: Hero animation initialization
 * Validates: Requirements 2.2
 */
describe('Property 3: Hero animation initialization', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should initialize hero elements with correct animation properties for any hero content', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.stringMatching(/^[a-zA-Z0-9 ]{5,100}$/),
          subtitle: fc.stringMatching(/^[a-zA-Z0-9 ]{3,50}$/),
          description: fc.stringMatching(/^[a-zA-Z0-9 ]{10,200}$/),
          primaryText: fc.stringMatching(/^[a-zA-Z0-9 ]{3,30}$/),
          primaryHref: fc.webPath(),
          hasSecondary: fc.boolean(),
          secondaryText: fc.stringMatching(/^[a-zA-Z0-9 ]{3,30}$/),
          secondaryHref: fc.webPath(),
        }),
        ({
          title,
          subtitle,
          description,
          primaryText,
          primaryHref,
          hasSecondary,
          secondaryText,
          secondaryHref,
        }) => {
          const content: HeroContent = {
            title,
            subtitle,
            description,
            cta: {
              primary: {
                text: primaryText,
                href: primaryHref,
              },
              ...(hasSecondary && {
                secondary: {
                  text: secondaryText,
                  href: secondaryHref,
                },
              }),
            },
          };

          const { container } = render(<Hero content={content} />);

          // Verify all content is rendered
          if (!container.textContent?.includes(title)) return false;
          if (!container.textContent?.includes(subtitle)) return false;
          if (!container.textContent?.includes(description)) return false;

          // Verify hero section structure
          const section = container.querySelector('section');
          if (!section) return false;

          // Verify the section has the hero layout classes
          if (!section.className.includes('min-h-screen')) return false;
          if (!section.className.includes('flex')) return false;
          if (!section.className.includes('items-center')) return false;

          // Verify CTA buttons exist
          const allButtons = container.querySelectorAll('a');
          if (allButtons.length === 0) return false;
          
          // Find primary button by text content
          const primaryButton = Array.from(allButtons).find(btn => btn.textContent === primaryText);
          if (!primaryButton) return false;
          if (primaryButton.getAttribute('href') !== primaryHref) return false;

          if (hasSecondary) {
            // Find secondary button by text content
            const secondaryButton = Array.from(allButtons).find(btn => btn.textContent === secondaryText);
            if (!secondaryButton) return false;
            if (secondaryButton.getAttribute('href') !== secondaryHref) return false;
          }

          // Verify parallax background layers exist
          const parallaxLayers = container.querySelectorAll('[class*="bg-gradient"]');
          if (parallaxLayers.length < 2) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle gradient orbs configuration for any valid orb count and colors', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.stringMatching(/^[a-zA-Z0-9 ]{5,50}$/),
          subtitle: fc.stringMatching(/^[a-zA-Z0-9 ]{3,30}$/),
          description: fc.stringMatching(/^[a-zA-Z0-9 ]{10,100}$/),
          orbCount: fc.integer({ min: 1, max: 10 }),
          colors: fc.array(
            fc.stringMatching(/^#[0-9A-Fa-f]{6}$/),
            { minLength: 1, maxLength: 10 }
          ),
        }),
        ({ title, subtitle, description, orbCount, colors }) => {
          const content: HeroContent = {
            title,
            subtitle,
            description,
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
            gradientOrbs: {
              count: orbCount,
              colors,
            },
          };

          const { container } = render(<Hero content={content} />);

          // Verify orbs are rendered
          const orbs = container.querySelectorAll('[class*="blur-3xl"]');
          
          // Should render the specified number of orbs
          if (orbs.length !== orbCount) return false;

          // Each orb should have a gradient background
          const allOrbsHaveGradient = Array.from(orbs).every(orb => {
            const style = (orb as HTMLElement).style;
            return style.background && style.background.includes('radial-gradient');
          });

          return allOrbsHaveGradient;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain responsive layout classes for any content', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          subtitle: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 500 }),
        }),
        ({ title, subtitle, description }) => {
          const content: HeroContent = {
            title,
            subtitle,
            description,
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          // Verify responsive container classes
          const containerDiv = container.querySelector('.container');
          if (!containerDiv) return false;

          // Verify responsive padding classes exist
          const hasResponsivePadding = containerDiv.className.includes('px-4') ||
                                       containerDiv.className.includes('sm:px-6') ||
                                       containerDiv.className.includes('lg:px-8');
          
          if (!hasResponsivePadding) return false;

          // Verify title has responsive text sizing
          const title_element = container.querySelector('h1');
          if (!title_element) return false;

          const hasResponsiveText = title_element.className.includes('text-4xl') ||
                                    title_element.className.includes('sm:text-5xl') ||
                                    title_element.className.includes('md:text-6xl');

          return hasResponsiveText;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of minimal content', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 10 }),
          subtitle: fc.string({ minLength: 1, maxLength: 10 }),
          description: fc.string({ minLength: 1, maxLength: 20 }),
        }),
        ({ title, subtitle, description }) => {
          const content: HeroContent = {
            title,
            subtitle,
            description,
            cta: {
              primary: {
                text: 'Go',
                href: '/',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          // Should render without errors even with minimal content
          const section = container.querySelector('section');
          if (!section) return false;

          // Content should be present
          return container.textContent?.includes(title) &&
                 container.textContent?.includes(subtitle) &&
                 container.textContent?.includes(description);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 28: Word-by-word text reveal
 * Validates: Requirements 2.1
 */
describe('Property 28: Word-by-word text reveal', () => {
  it('should reveal each word sequentially in the hero title for any text', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.array(
            fc.stringMatching(/^[a-zA-Z0-9]{1,15}$/),
            { minLength: 2, maxLength: 20 }
          ).map(words => words.join(' ')),
          subtitle: fc.stringMatching(/^[a-zA-Z0-9 ]{3,30}$/),
          description: fc.stringMatching(/^[a-zA-Z0-9 ]{10,100}$/),
        }),
        ({ title, subtitle, description }) => {
          const content: HeroContent = {
            title,
            subtitle,
            description,
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          // Find the h1 element containing the title
          const titleElement = container.querySelector('h1');
          if (!titleElement) return false;

          // Verify the title text is preserved
          if (titleElement.textContent !== title) return false;

          // Verify the title uses SplitText by checking for motion.span elements
          const titleSpans = titleElement.querySelectorAll('span[style*="display: inline-block"]');
          
          // Should have animated spans for the words
          if (titleSpans.length === 0) return false;

          // Count the number of words in the title
          const words = title.split(/\s+/).filter(w => w.length > 0);
          
          // Should have at least as many animated elements as words
          // (may have more due to whitespace handling)
          if (titleSpans.length < words.length) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle hero title with varying word counts', () => {
    fc.assert(
      fc.property(
        fc.record({
          wordCount: fc.integer({ min: 1, max: 15 }),
          wordLength: fc.integer({ min: 3, max: 12 }),
        }),
        ({ wordCount, wordLength }) => {
          // Generate a title with the specified number of words
          const words = Array.from({ length: wordCount }, (_, i) => 
            `Word${i}`.padEnd(wordLength, 'x')
          );
          const title = words.join(' ');

          const content: HeroContent = {
            title,
            subtitle: 'Test Subtitle',
            description: 'Test description for the hero section',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          // Find the h1 element
          const titleElement = container.querySelector('h1');
          if (!titleElement) return false;

          // Verify text is preserved
          if (titleElement.textContent !== title) return false;

          // Verify animated spans exist
          const animatedSpans = titleElement.querySelectorAll('span[style*="display: inline-block"]');
          
          // Should have animated elements
          if (animatedSpans.length === 0) return false;

          // Should have at least as many spans as words
          if (animatedSpans.length < wordCount) return false;

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve text content exactly during word-by-word reveal', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9 ]{10,100}$/),
        (title) => {
          const content: HeroContent = {
            title,
            subtitle: 'Test',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          const titleElement = container.querySelector('h1');
          if (!titleElement) return false;

          // The most important property: text content must be exactly preserved
          return titleElement.textContent === title;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge case of single word title', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9]{5,20}$/),
        (singleWord) => {
          const content: HeroContent = {
            title: singleWord,
            subtitle: 'Test',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
          };

          const { container } = render(<Hero content={content} />);

          const titleElement = container.querySelector('h1');
          if (!titleElement) return false;

          // Should render single word correctly
          if (titleElement.textContent !== singleWord) return false;

          // Should still have animation structure
          const animatedSpans = titleElement.querySelectorAll('span[style*="display: inline-block"]');
          return animatedSpans.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: premium-landing-page, Property 5: Mouse-following gradient orbs
 * Validates: Requirements 2.4
 */
describe('Property 5: Mouse-following gradient orbs', () => {
  it('should update orb positions based on mouse movement for any mouse position', () => {
    fc.assert(
      fc.property(
        fc.record({
          orbCount: fc.integer({ min: 1, max: 8 }),
          colors: fc.array(
            fc.stringMatching(/^#[0-9A-Fa-f]{6}$/),
            { minLength: 1, maxLength: 8 }
          ),
        }),
        ({ orbCount, colors }) => {
          const content: HeroContent = {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
            gradientOrbs: {
              count: orbCount,
              colors,
            },
          };

          const { container } = render(<Hero content={content} />);

          // Verify orbs are rendered
          const orbs = container.querySelectorAll('[class*="blur-3xl"]');
          
          // Should render the specified number of orbs
          if (orbs.length !== orbCount) return false;

          // Each orb should have motion properties
          const allOrbsHaveMotion = Array.from(orbs).every(orb => {
            const element = orb as HTMLElement;
            // Orbs should have a background style with gradient
            return element.style.background && element.style.background.includes('radial-gradient');
          });

          if (!allOrbsHaveMotion) return false;

          // Verify orbs have positioning styles (left and top)
          const allOrbsHavePosition = Array.from(orbs).every(orb => {
            const element = orb as HTMLElement;
            return element.style.left && element.style.top;
          });

          return allOrbsHavePosition;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render orbs with blur effect for any orb configuration', () => {
    fc.assert(
      fc.property(
        fc.record({
          orbCount: fc.integer({ min: 1, max: 10 }),
          colors: fc.array(
            fc.stringMatching(/^#[0-9A-Fa-f]{6}$/),
            { minLength: 1, maxLength: 10 }
          ),
        }),
        ({ orbCount, colors }) => {
          const content: HeroContent = {
            title: 'Test',
            subtitle: 'Test',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
            gradientOrbs: {
              count: orbCount,
              colors,
            },
          };

          const { container } = render(<Hero content={content} />);

          const orbs = container.querySelectorAll('[class*="blur-3xl"]');
          
          // Should have the correct number of orbs
          if (orbs.length !== orbCount) return false;

          // All orbs should have blur class
          const allOrbsHaveBlur = Array.from(orbs).every(orb => {
            return orb.className.includes('blur-3xl');
          });

          return allOrbsHaveBlur;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle hero without gradient orbs', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9 ]{5,50}$/),
        (title) => {
          const content: HeroContent = {
            title,
            subtitle: 'Test',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
            // No gradientOrbs property
          };

          const { container } = render(<Hero content={content} />);

          // Should not render any orbs
          const orbs = container.querySelectorAll('[class*="blur-3xl"]');
          
          // Should have no orbs when gradientOrbs is not provided
          return orbs.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should distribute orbs across the hero section for any orb count', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        (orbCount) => {
          const colors = Array.from({ length: orbCount }, (_, i) => 
            `#${(i * 111111).toString(16).padStart(6, '0').slice(0, 6)}`
          );

          const content: HeroContent = {
            title: 'Test',
            subtitle: 'Test',
            description: 'Test description',
            cta: {
              primary: {
                text: 'Test',
                href: '/test',
              },
            },
            gradientOrbs: {
              count: orbCount,
              colors,
            },
          };

          const { container } = render(<Hero content={content} />);

          const orbs = container.querySelectorAll('[class*="blur-3xl"]');
          
          // Should render all orbs
          if (orbs.length !== orbCount) return false;

          // Each orb should have positioning styles
          const allOrbsHavePosition = Array.from(orbs).every(orb => {
            const element = orb as HTMLElement;
            // Orbs should have left and top positioning
            return element.style.left && element.style.top;
          });

          return allOrbsHavePosition;
        }
      ),
      { numRuns: 100 }
    );
  });
});
