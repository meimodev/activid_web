import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { ProjectDetails } from './ProjectDetails';

/**
 * Property-Based Tests for ProjectDetails component
 * Using fast-check to generate random test data and verify properties hold across all inputs
 */

describe('ProjectDetails - Property-Based Tests', () => {
  /**
   * **Feature: project-showcase-section, Property 7: Project detail formatting consistency**
   * **Validates: Requirements 3.4**
   * 
   * For any set of multiple projects displayed, all project details should maintain 
   * identical typography, spacing, and structural formatting.
   */
  it('Property 7: maintains consistent formatting across multiple project details', () => {
    fc.assert(
      fc.property(
        // Generate an array of 2-5 project detail objects
        fc.array(
          fc.record({
            projectNumber: fc.stringMatching(/^\d{2}\.$/),
            client: fc.string({ minLength: 3, maxLength: 20 }).map(s => `@${s}`),
            projectType: fc.string({ minLength: 5, maxLength: 50 }),
            description: fc.string({ minLength: 20, maxLength: 200 }),
            results: fc.string({ minLength: 20, maxLength: 200 }),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (projects) => {
          // Render all project details
          const renderedProjects = projects.map((project, index) => {
            const { container } = render(
              <ProjectDetails
                key={index}
                projectNumber={project.projectNumber}
                client={project.client}
                projectType={project.projectType}
                description={project.description}
                results={project.results}
              />
            );
            return container;
          });

          // Extract structural information from each rendered project
          const structures = renderedProjects.map(container => {
            const article = container.querySelector('[role="article"]');
            expect(article).toBeTruthy();

            // Check for consistent structure
            const headerDiv = article?.querySelector('div:first-child');
            const descriptionP = article?.querySelector('p');
            const resultsDiv = article?.querySelector('div:last-child');

            return {
              hasArticleRole: !!article,
              hasHeaderDiv: !!headerDiv,
              hasDescriptionP: !!descriptionP,
              hasResultsDiv: !!resultsDiv,
              headerClasses: headerDiv?.className || '',
              descriptionClasses: descriptionP?.className || '',
              resultsClasses: resultsDiv?.className || '',
              // Check for consistent gap spacing
              articleClasses: article?.className || '',
            };
          });

          // Verify all structures are identical
          const firstStructure = structures[0];
          structures.forEach((structure, index) => {
            expect(structure.hasArticleRole, `Project ${index} should have article role`).toBe(true);
            expect(structure.hasHeaderDiv, `Project ${index} should have header div`).toBe(true);
            expect(structure.hasDescriptionP, `Project ${index} should have description paragraph`).toBe(true);
            expect(structure.hasResultsDiv, `Project ${index} should have results div`).toBe(true);
            
            // Verify consistent CSS classes (typography and spacing)
            expect(
              structure.headerClasses,
              `Project ${index} header should have consistent classes`
            ).toBe(firstStructure.headerClasses);
            
            expect(
              structure.descriptionClasses,
              `Project ${index} description should have consistent classes`
            ).toBe(firstStructure.descriptionClasses);
            
            expect(
              structure.resultsClasses,
              `Project ${index} results should have consistent classes`
            ).toBe(firstStructure.resultsClasses);
            
            expect(
              structure.articleClasses,
              `Project ${index} article should have consistent classes`
            ).toBe(firstStructure.articleClasses);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: project-showcase-section, Property 8: Text overflow handling**
   * **Validates: Requirements 3.5**
   * 
   * For any text content (description or results) that exceeds the available container width,
   * the layout should remain intact without horizontal overflow or broken elements.
   */
  it('Property 8: handles text overflow gracefully without breaking layout', () => {
    fc.assert(
      fc.property(
        // Generate project details with very long text content
        fc.record({
          projectNumber: fc.stringMatching(/^\d{2}\.$/),
          client: fc.string({ minLength: 3, maxLength: 20 }).map(s => `@${s}`),
          projectType: fc.string({ minLength: 5, maxLength: 50 }),
          // Generate long strings (500-2000 characters) to test overflow
          description: fc.string({ minLength: 500, maxLength: 2000 }),
          results: fc.string({ minLength: 500, maxLength: 2000 }),
        }),
        (project) => {
          const { container } = render(
            <ProjectDetails
              projectNumber={project.projectNumber}
              client={project.client}
              projectType={project.projectType}
              description={project.description}
              results={project.results}
            />
          );

          const article = container.querySelector('[role="article"]');
          expect(article).toBeTruthy();

          // Check that description and results elements exist
          const descriptionP = article?.querySelector('p');
          const resultsDiv = article?.querySelector('div:last-child');
          
          expect(descriptionP).toBeTruthy();
          expect(resultsDiv).toBeTruthy();

          // Verify that break-words and overflow-wrap-anywhere classes are applied
          // These CSS classes prevent horizontal overflow
          const descriptionClasses = descriptionP?.className || '';
          const resultsSpan = resultsDiv?.querySelector('span:last-child');
          const resultsClasses = resultsSpan?.className || '';

          expect(
            descriptionClasses.includes('break-words') || 
            descriptionClasses.includes('overflow-wrap-anywhere'),
            'Description should have text wrapping classes'
          ).toBe(true);

          expect(
            resultsClasses.includes('break-words') || 
            resultsClasses.includes('overflow-wrap-anywhere'),
            'Results should have text wrapping classes'
          ).toBe(true);

          // Verify content is rendered (not truncated or hidden)
          expect(descriptionP?.textContent).toBe(project.description);
          expect(resultsSpan?.textContent).toBe(project.results);

          // Check that the article container has proper flex layout
          const articleClasses = article?.className || '';
          expect(
            articleClasses.includes('flex') && articleClasses.includes('flex-col'),
            'Article should use flex column layout'
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
