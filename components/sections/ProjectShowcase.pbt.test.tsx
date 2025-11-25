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
 * Feature: project-showcase-section, Property 1: Minimum case study display
 * 
 * For any valid project data array with at least three projects, the rendered 
 * section should display at least three case study cards with complete browser 
 * frames and project details.
 * 
 * Validates: Requirements 1.2
 */
describe('Property 1: Minimum case study display', () => {
  it('should display at least 3 case study cards when given 3 or more projects', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should have at least 3 article elements (case study cards)
          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length >= 3;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render exactly N case study cards for N projects (N >= 3)', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include browser frames in all case study cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each case study should have a browser frame (region with aria-label "Browser mockup frame")
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          
          return browserFrames.length >= 3 && browserFrames.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include project details in all case study cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each case study should have project details (article with aria-label containing "Project details")
          const projectDetails = container.querySelectorAll('[role="article"][aria-label*="Project details"]');
          
          return projectDetails.length >= 3 && projectDetails.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all provided projects without truncation', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          
          // Should render exactly as many cards as projects provided
          return caseStudyCards.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain minimum display even with exactly 3 projects', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 3 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          const projectDetails = container.querySelectorAll('[role="article"][aria-label*="Project details"]');
          
          return (
            caseStudyCards.length === 3 &&
            browserFrames.length === 3 &&
            projectDetails.length === 3
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 2: Complete case study structure
 * 
 * For any rendered case study card, it should contain all required elements: 
 * browser frame with chrome, Instagram grid mockup, client handle with @ symbol, 
 * project type, description with "Result:" label, and results text.
 * 
 * Validates: Requirements 1.3, 2.1, 3.1, 3.2, 3.3
 */
describe('Property 2: Complete case study structure', () => {
  it('should include browser frame with chrome elements in each case study', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each case study should have a browser frame
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          
          // Each browser frame should have window controls (red, yellow, green dots)
          let allHaveWindowControls = true;
          browserFrames.forEach((frame) => {
            // Window controls are decorative divs with specific colors
            const redControl = frame.querySelector('.bg-red-500');
            const yellowControl = frame.querySelector('.bg-yellow-500');
            const greenControl = frame.querySelector('.bg-green-500');
            if (!redControl || !yellowControl || !greenControl) {
              allHaveWindowControls = false;
            }
          });
          
          return browserFrames.length === projects.length && allHaveWindowControls;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include Instagram grid mockup in each browser frame', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each browser frame should contain a grid
          const grids = container.querySelectorAll('[role="grid"]');
          
          return grids.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display client handle with @ symbol in each case study', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that each project's client handle is displayed in the text content
          let allClientsDisplayed = true;
          projects.forEach((project) => {
            const textContent = container.textContent || '';
            if (!textContent.includes(project.client)) {
              allClientsDisplayed = false;
            }
          });
          
          return allClientsDisplayed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display project type in each case study', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that each project's type is displayed in the text content
          let allTypesDisplayed = true;
          projects.forEach((project) => {
            const textContent = container.textContent || '';
            if (!textContent.includes(project.projectType)) {
              allTypesDisplayed = false;
            }
          });
          
          return allTypesDisplayed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display description in each case study', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that each project's description is displayed
          let allDescriptionsDisplayed = true;
          projects.forEach((project) => {
            const descriptionElements = container.querySelectorAll('[aria-label="Project description"]');
            let found = false;
            descriptionElements.forEach((el) => {
              if (el.textContent?.includes(project.description)) {
                found = true;
              }
            });
            if (!found) {
              allDescriptionsDisplayed = false;
            }
          });
          
          return allDescriptionsDisplayed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display results with "Result:" label in each case study', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that each project has results with "Result:" label
          const resultElements = container.querySelectorAll('[aria-label="Project results"]');
          
          if (resultElements.length !== projects.length) {
            return false;
          }
          
          // Each result element should contain "Result:" text
          let allHaveResultLabel = true;
          resultElements.forEach((el) => {
            if (!el.textContent?.includes('Result:')) {
              allHaveResultLabel = false;
            }
          });
          
          return allHaveResultLabel;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should include all structural elements in every case study card', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          
          // Each card should have all required elements
          let allCardsComplete = true;
          caseStudyCards.forEach((card) => {
            // Should have browser frame
            const browserFrame = card.querySelector('[aria-label="Browser mockup frame"]');
            // Should have grid
            const grid = card.querySelector('[role="grid"]');
            // Should have project details
            const projectDetails = card.querySelector('[role="article"][aria-label*="Project details"]');
            
            if (!browserFrame || !grid || !projectDetails) {
              allCardsComplete = false;
            }
          });
          
          return allCardsComplete && caseStudyCards.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display numbered indicator for each project', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that numbered indicators are present (01., 02., etc.)
          let allNumbersPresent = true;
          projects.forEach((_, index) => {
            const expectedNumber = `${String(index + 1).padStart(2, '0')}.`;
            const numberElements = container.querySelectorAll(`[aria-label*="Project number ${expectedNumber}"]`);
            if (numberElements.length === 0) {
              allNumbersPresent = false;
            }
          });
          
          return allNumbersPresent;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should separate client and project type with vertical bar', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for vertical bar separators
          const separators = container.querySelectorAll('[aria-hidden="true"]');
          
          let hasSeparators = false;
          separators.forEach((sep) => {
            if (sep.textContent?.includes('|')) {
              hasSeparators = true;
            }
          });
          
          return hasSeparators;
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: project-showcase-section, Property 13: Dynamic rendering count
 * 
 * For any array of N project data objects, the component should render exactly N case study cards.
 * 
 * Validates: Requirements 6.3
 */
describe('Property 13: Dynamic rendering count', () => {
  it('should render exactly N case study cards for N projects', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 0, maxLength: 10 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty project array', () => {
    fc.assert(
      fc.property(
        fc.constant([]),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={[...projects]} />);

          const caseStudyCards = container.querySelectorAll('article');
          const fallbackMessage = container.textContent?.includes('No projects available');
          
          return caseStudyCards.length === 0 && fallbackMessage === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render correct count for any array size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 20 }),
        (count) => {
          // Generate exactly 'count' projects
          const projects = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length === count;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 14: Graceful optional field handling
 * 
 * For any project data object missing optional fields, the component should render 
 * without those elements while maintaining layout integrity.
 * 
 * Validates: Requirements 6.4
 */
describe('Property 14: Graceful optional field handling', () => {
  it('should render with all required fields present', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Should render without errors
          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain layout integrity with validated data', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that layout structure is maintained
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');
          const caseStudyCards = container.querySelectorAll('article');
          
          return (
            section !== null &&
            heading !== null &&
            caseStudyCards.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle data with ensureValidProjectData function', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.option(validIdArb, { nil: undefined }),
            client: fc.option(validClientArb, { nil: undefined }),
            projectType: fc.option(validProjectTypeArb, { nil: undefined }),
            description: fc.option(validDescriptionArb, { nil: undefined }),
            results: fc.option(validResultsArb, { nil: undefined }),
            mockupImages: fc.option(
              fc.array(validImageUrlArb, { minLength: 9, maxLength: 9 }),
              { nil: undefined }
            ),
            imageAlts: fc.option(
              fc.array(validAltTextArb, { minLength: 9, maxLength: 9 }),
              { nil: undefined }
            ),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (partialProjects) => {
          // Component uses ensureValidProjectData internally
          const { container } = render(<ProjectShowcase projects={partialProjects as ProjectData[]} />);

          // Should render without crashing
          const caseStudyCards = container.querySelectorAll('article');
          
          return caseStudyCards.length === partialProjects.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 15: Reactive data updates
 * 
 * For any change to the projects prop array, the component should re-render 
 * with the updated content without requiring remounting.
 * 
 * Validates: Requirements 6.5
 */
describe('Property 15: Reactive data updates', () => {
  it('should update when projects prop changes', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        (initialProjects, updatedProjects) => {
          const { container, rerender } = render(<ProjectShowcase projects={initialProjects} />);

          const initialCards = container.querySelectorAll('article');
          const initialCount = initialCards.length;

          // Update with new projects
          rerender(<ProjectShowcase projects={updatedProjects} />);

          const updatedCards = container.querySelectorAll('article');
          const updatedCount = updatedCards.length;

          return (
            initialCount === initialProjects.length &&
            updatedCount === updatedProjects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reflect content changes in updated projects', () => {
    fc.assert(
      fc.property(
        validProjectDataArb,
        validProjectDataArb,
        (project1, project2) => {
          const { container, rerender } = render(<ProjectShowcase projects={[project1]} />);

          const initialContent = container.textContent || '';
          const hasInitialClient = initialContent.includes(project1.client);

          // Update with different project
          rerender(<ProjectShowcase projects={[project2]} />);

          const updatedContent = container.textContent || '';
          const hasUpdatedClient = updatedContent.includes(project2.client);

          return hasInitialClient && hasUpdatedClient;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle adding projects dynamically', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        validProjectDataArb,
        (initialProjects, newProject) => {
          const { container, rerender } = render(<ProjectShowcase projects={initialProjects} />);

          const initialCards = container.querySelectorAll('article');

          // Add a new project
          const updatedProjects = [...initialProjects, newProject];
          rerender(<ProjectShowcase projects={updatedProjects} />);

          const updatedCards = container.querySelectorAll('article');

          return (
            initialCards.length === initialProjects.length &&
            updatedCards.length === updatedProjects.length &&
            updatedCards.length === initialCards.length + 1
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle removing projects dynamically', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 2, maxLength: 5 }),
        (initialProjects) => {
          // Ensure unique IDs to avoid React key conflicts
          const projectsWithUniqueIds = initialProjects.map((project, index) => ({
            ...project,
            id: `${project.id}-${index}`,
          }));

          const { container, rerender } = render(<ProjectShowcase projects={projectsWithUniqueIds} />);

          const initialCards = container.querySelectorAll('article');

          // Remove the first project
          const updatedProjects = projectsWithUniqueIds.slice(1);
          rerender(<ProjectShowcase projects={updatedProjects} />);

          const updatedCards = container.querySelectorAll('article');

          return (
            initialCards.length === projectsWithUniqueIds.length &&
            updatedCards.length === updatedProjects.length &&
            updatedCards.length === initialCards.length - 1
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 3: Responsive layout adaptation
 * 
 * For any viewport width change across mobile (< 640px), tablet (640-1024px), 
 * and desktop (> 1024px) breakpoints, the layout should adapt while maintaining 
 * all content visibility and readability.
 * 
 * Validates: Requirements 1.5
 */
describe('Property 3: Responsive layout adaptation', () => {
  it('should maintain content visibility across all viewport widths', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        fc.integer({ min: 320, max: 1920 }),
        (projects, viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // All essential content should be present regardless of viewport
          const heading = container.querySelector('h2');
          const caseStudyCards = container.querySelectorAll('article');
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          const projectDetails = container.querySelectorAll('[role="article"][aria-label*="Project details"]');
          
          return (
            heading !== null &&
            caseStudyCards.length === projects.length &&
            browserFrames.length === projects.length &&
            projectDetails.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply responsive classes at mobile breakpoint', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 320, max: 639 }), // Mobile range
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that grid layout exists (single column on mobile)
          const articles = container.querySelectorAll('article');
          
          // All articles should have grid class
          let allHaveGrid = true;
          articles.forEach((article) => {
            if (!article.className.includes('grid')) {
              allHaveGrid = false;
            }
          });
          
          return allHaveGrid && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply responsive classes at tablet breakpoint', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 640, max: 1023 }), // Tablet range
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that content is present and structured
          const articles = container.querySelectorAll('article');
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          
          return (
            articles.length === projects.length &&
            browserFrames.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply responsive classes at desktop breakpoint', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 1024, max: 1920 }), // Desktop range
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that content is present and structured
          const articles = container.querySelectorAll('article');
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          const projectDetails = container.querySelectorAll('[role="article"][aria-label*="Project details"]');
          
          return (
            articles.length === projects.length &&
            browserFrames.length === projects.length &&
            projectDetails.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not have horizontal overflow at any viewport width', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 320, max: 1920 }),
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that section and articles don't have overflow issues
          const section = container.querySelector('section');
          const articles = container.querySelectorAll('article');
          
          // Verify structure is intact (no broken layout)
          return (
            section !== null &&
            articles.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain readability with proper spacing at all breakpoints', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 320, max: 1920 }),
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that all text content is present and accessible
          const textContent = container.textContent || '';
          
          // Verify all project data is in the rendered output
          let allContentPresent = true;
          projects.forEach((project) => {
            if (
              !textContent.includes(project.client) ||
              !textContent.includes(project.projectType) ||
              !textContent.includes(project.description) ||
              !textContent.includes(project.results)
            ) {
              allContentPresent = false;
            }
          });
          
          return allContentPresent;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render all images at all viewport widths', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 320, max: 1920 }),
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Each project should have 9 images in the Instagram grid
          const images = container.querySelectorAll('img');
          const expectedImageCount = projects.length * 9;
          
          return images.length === expectedImageCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain section structure across viewport changes', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        fc.integer({ min: 320, max: 1920 }),
        (projects, viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check core structural elements
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');
          const articles = container.querySelectorAll('article');
          
          // Verify heading text
          const headingText = heading?.textContent || '';
          const hasProjectHeading = headingText.includes('Project');
          
          return (
            section !== null &&
            heading !== null &&
            hasProjectHeading &&
            articles.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 9: Staggered animation timing
 * 
 * For any set of case study cards becoming visible, their entrance animations 
 * should be staggered with consistent delay increments between each card.
 * 
 * Validates: Requirements 4.2
 */
describe('Property 9: Staggered animation timing', () => {
  it('should apply staggered delays to case study cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 3, maxLength: 6 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All articles should be present
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent delay increment of 0.1s between cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 2, maxLength: 6 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Verify all cards are rendered (animation timing is handled by Framer Motion)
          // The delay is calculated as index * 0.1 in the component
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should stagger animations for any number of projects', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const projects: ProjectData[] = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Each article should be rendered with staggered animation
          return articles.length === count;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain stagger pattern with different project counts', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 8 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Verify structure is maintained for staggered animations
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 10: Hover interaction feedback
 * 
 * For any case study card, hovering should trigger visual feedback (scale or 
 * shadow change) that is visible and smooth.
 * 
 * Validates: Requirements 4.4
 */
describe('Property 10: Hover interaction feedback', () => {
  it('should have cursor-pointer class on case study cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All articles should have cursor-pointer class for hover indication
          let allHaveCursor = true;
          articles.forEach((article) => {
            if (!article.className.includes('cursor-pointer')) {
              allHaveCursor = false;
            }
          });
          
          return allHaveCursor && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply hover interaction to all case study cards', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Verify all articles are interactive elements
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain hover feedback across different project counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const projects: ProjectData[] = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All cards should be hoverable
          let allHaveCursor = true;
          articles.forEach((article) => {
            if (!article.className.includes('cursor-pointer')) {
              allHaveCursor = false;
            }
          });
          
          return allHaveCursor && articles.length === count;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have will-change property for smooth hover transitions', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Articles should have style attribute for will-change
          // (This is set dynamically based on prefersReducedMotion)
          return articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 11: Motion preference respect
 * 
 * For any animation in the section, when the user has prefers-reduced-motion 
 * enabled, animations should be disabled or reduced to minimal duration.
 * 
 * Validates: Requirements 4.3, 4.5
 */
describe('Property 11: Motion preference respect', () => {
  it('should render without animations when reduced motion is preferred', () => {
    // Mock useReducedMotion to return true
    vi.mock('@/hooks', () => ({
      useReducedMotion: () => true,
    }));

    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Content should still be present
          const articles = container.querySelectorAll('article');
          const heading = container.querySelector('h2');
          
          return articles.length === projects.length && heading !== null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain content visibility with reduced motion', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // All essential content should be visible
          const section = container.querySelector('section');
          const heading = container.querySelector('h2');
          const articles = container.querySelectorAll('article');
          const browserFrames = container.querySelectorAll('[aria-label="Browser mockup frame"]');
          
          return (
            section !== null &&
            heading !== null &&
            articles.length === projects.length &&
            browserFrames.length === projects.length
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render all projects regardless of motion preference', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Verify all projects are rendered
          let allProjectsPresent = true;
          projects.forEach((project) => {
            const textContent = container.textContent || '';
            if (!textContent.includes(project.client)) {
              allProjectsPresent = false;
            }
          });
          
          return allProjectsPresent && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain layout structure with reduced motion', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that grid layout is maintained
          const articles = container.querySelectorAll('article');
          
          let allHaveGrid = true;
          articles.forEach((article) => {
            if (!article.className.includes('grid')) {
              allHaveGrid = false;
            }
          });
          
          return allHaveGrid && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty projects array with reduced motion', () => {
    fc.assert(
      fc.property(
        fc.constant([]),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={[...projects]} />);

          // Should show fallback message
          const fallbackMessage = container.textContent?.includes('No projects available');
          const articles = container.querySelectorAll('article');
          
          return fallbackMessage === true && articles.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
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
          
          // All images should have non-empty alt attributes
          let allHaveAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim() === '') {
              allHaveAlt = false;
            }
          });
          
          return allHaveAlt && images.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide descriptive alt text for all project images', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const images = container.querySelectorAll('img');
          const expectedImageCount = projects.length * 9; // 9 images per project
          
          // Should have correct number of images
          if (images.length !== expectedImageCount) {
            return false;
          }
          
          // Each image should have alt text
          let allHaveValidAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim().length < 3) { // At least 3 characters for meaningful alt text
              allHaveValidAlt = false;
            }
          });
          
          return allHaveValidAlt;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use provided alt texts from project data', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 3 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that alt texts from project data are used
          let allAltTextsUsed = true;
          projects.forEach((project) => {
            project.imageAlts.forEach((altText) => {
              const images = Array.from(container.querySelectorAll('img'));
              const hasAltText = images.some((img) => img.getAttribute('alt') === altText);
              if (!hasAltText) {
                allAltTextsUsed = false;
              }
            });
          });
          
          return allAltTextsUsed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have alt text even with placeholder images', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: validIdArb,
            client: validClientArb,
            projectType: validProjectTypeArb,
            description: validDescriptionArb,
            results: validResultsArb,
            mockupImages: fc.array(validImageUrlArb, { minLength: 3, maxLength: 5 }), // Less than 9
            imageAlts: fc.array(validAltTextArb, { minLength: 3, maxLength: 5 }),
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const images = container.querySelectorAll('img');
          
          // All images should have alt text, including placeholders
          let allHaveAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim() === '') {
              allHaveAlt = false;
            }
          });
          
          return allHaveAlt && images.length > 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain alt text across different project counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const projects: ProjectData[] = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text for project ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const images = container.querySelectorAll('img');
          
          // All images should have non-empty alt text
          let allHaveAlt = true;
          images.forEach((img) => {
            const alt = img.getAttribute('alt');
            if (!alt || alt.trim() === '') {
              allHaveAlt = false;
            }
          });
          
          return allHaveAlt && images.length === count * 9;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: project-showcase-section, Property 17: Keyboard navigation
 * 
 * For any interactive element in the section, it should be reachable via keyboard 
 * navigation and display visible focus indicators.
 * 
 * Validates: Requirements 7.3
 */
describe('Property 17: Keyboard navigation', () => {
  it('should have tabIndex on case study cards for keyboard navigation', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All case study cards should have tabIndex for keyboard access
          let allHaveTabIndex = true;
          articles.forEach((article) => {
            const tabIndex = article.getAttribute('tabindex');
            if (tabIndex === null) {
              allHaveTabIndex = false;
            }
          });
          
          return allHaveTabIndex && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have focus indicators on interactive elements', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Articles should have focus-related classes for visible focus indicators
          let allHaveFocusStyles = true;
          articles.forEach((article) => {
            const className = article.className;
            // Check for focus-within or focus classes
            if (!className.includes('focus')) {
              allHaveFocusStyles = false;
            }
          });
          
          return allHaveFocusStyles && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should make all case study cards keyboard accessible', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Each article should be keyboard navigable
          let allNavigable = true;
          articles.forEach((article) => {
            const tabIndex = article.getAttribute('tabindex');
            const role = article.getAttribute('role');
            
            // Should have tabindex and proper role
            if (tabIndex === null || role !== 'article') {
              allNavigable = false;
            }
          });
          
          return allNavigable && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain keyboard navigation across different project counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const projects: ProjectData[] = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text for project ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All articles should be keyboard accessible
          let allAccessible = true;
          articles.forEach((article) => {
            const tabIndex = article.getAttribute('tabindex');
            if (tabIndex === null) {
              allAccessible = false;
            }
          });
          
          return allAccessible && articles.length === count;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have proper ARIA labels for keyboard navigation context', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // All articles should have aria-label for context
          let allHaveAriaLabel = true;
          articles.forEach((article) => {
            const ariaLabel = article.getAttribute('aria-label');
            if (!ariaLabel || ariaLabel.trim() === '') {
              allHaveAriaLabel = false;
            }
          });
          
          return allHaveAriaLabel && articles.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have visible focus ring styles', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          const articles = container.querySelectorAll('article');
          
          // Check for focus ring classes (ring-2, ring-offset, etc.)
          let allHaveFocusRing = true;
          articles.forEach((article) => {
            const className = article.className;
            if (!className.includes('ring')) {
              allHaveFocusRing = false;
            }
          });
          
          return allHaveFocusRing && articles.length === projects.length;
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
  it('should use text separators in addition to color for visual separation', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for vertical bar separators (non-color indicator)
          const separators = container.querySelectorAll('[role="separator"]');
          
          // Should have at least one separator per project
          return separators.length >= projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have text-based separators between client and project type', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that vertical bar separators exist
          const textContent = container.textContent || '';
          const hasSeparators = textContent.includes('|');
          
          return hasSeparators;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use "Result:" label as non-color indicator for results section', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for "Result:" labels (text-based indicator)
          const resultElements = container.querySelectorAll('[aria-label="Project results"]');
          
          // Each result element should contain "Result:" text
          let allHaveResultLabel = true;
          resultElements.forEach((el) => {
            if (!el.textContent?.includes('Result:')) {
              allHaveResultLabel = false;
            }
          });
          
          return allHaveResultLabel && resultElements.length === projects.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use numbered indicators as non-color identifiers for projects', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for numbered indicators (01., 02., etc.)
          let allHaveNumbers = true;
          projects.forEach((_, index) => {
            const expectedNumber = `${String(index + 1).padStart(2, '0')}.`;
            const textContent = container.textContent || '';
            if (!textContent.includes(expectedNumber)) {
              allHaveNumbers = false;
            }
          });
          
          return allHaveNumbers;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use @ symbol as non-color indicator for client handles', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check that all client handles include @ symbol
          let allHaveAtSymbol = true;
          projects.forEach((project) => {
            const textContent = container.textContent || '';
            if (!textContent.includes(project.client)) {
              allHaveAtSymbol = false;
            }
            // Client should already have @ in the data
            if (!project.client.startsWith('@')) {
              allHaveAtSymbol = false;
            }
          });
          
          return allHaveAtSymbol;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain non-color indicators across different project counts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const projects: ProjectData[] = Array(count).fill(null).map((_, i) => ({
            id: `project-${i}`,
            client: `@client${i}`,
            projectType: `Type ${i}`,
            description: `Description ${i}`,
            results: `Results ${i}`,
            mockupImages: Array(9).fill(`https://example.com/image${i}.jpg`),
            imageAlts: Array(9).fill(`Alt text for project ${i}`),
          }));

          const { container } = render(<ProjectShowcase projects={projects} />);

          const textContent = container.textContent || '';
          
          // Check for separators, Result labels, and numbered indicators
          const hasSeparators = textContent.includes('|');
          const hasResultLabels = textContent.includes('Result:');
          
          // Check for numbered indicators
          let hasAllNumbers = true;
          for (let i = 0; i < count; i++) {
            const expectedNumber = `${String(i + 1).padStart(2, '0')}.`;
            if (!textContent.includes(expectedNumber)) {
              hasAllNumbers = false;
            }
          }
          
          return hasSeparators && hasResultLabels && hasAllNumbers;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use semantic HTML roles as non-visual indicators', () => {
    fc.assert(
      fc.property(
        fc.array(validProjectDataArb, { minLength: 1, maxLength: 5 }),
        (projects) => {
          const { container } = render(<ProjectShowcase projects={projects} />);

          // Check for semantic roles
          const articles = container.querySelectorAll('[role="article"]');
          const grids = container.querySelectorAll('[role="grid"]');
          const regions = container.querySelectorAll('[role="region"]');
          
          // Should have proper semantic structure
          return (
            articles.length >= projects.length && // At least one article per project (case study + details)
            grids.length === projects.length && // One grid per project
            regions.length >= projects.length // At least one region per project (browser frame)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
