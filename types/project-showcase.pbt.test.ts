import { describe, it } from 'vitest';
import fc from 'fast-check';
import {
  validateProjectData,
  ensureValidProjectData,
  DEFAULT_PROJECT,
} from './project-showcase.types';

/**
 * Feature: project-showcase-section, Property 12: Required field validation
 * 
 * For any project data object, it should contain all required fields 
 * (client, projectType, description, results, mockupImages) or the system 
 * should reject it or use fallback values.
 * 
 * Validates: Requirements 6.2
 */

// Arbitraries for generating test data
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

// Generate partial ProjectData with missing required fields
const partialProjectDataArb = fc.record(
  {
    id: fc.option(validIdArb, { nil: undefined }),
    client: fc.option(validClientArb, { nil: undefined }),
    projectType: fc.option(validProjectTypeArb, { nil: undefined }),
    description: fc.option(validDescriptionArb, { nil: undefined }),
    results: fc.option(validResultsArb, { nil: undefined }),
    mockupImages: fc.option(
      fc.oneof(
        fc.array(validImageUrlArb, { minLength: 0, maxLength: 8 }), // Too few
        fc.array(validImageUrlArb, { minLength: 10, maxLength: 15 }), // Too many
        fc.array(validImageUrlArb, { minLength: 9, maxLength: 9 }) // Valid
      ),
      { nil: undefined }
    ),
    imageAlts: fc.option(
      fc.oneof(
        fc.array(validAltTextArb, { minLength: 0, maxLength: 8 }), // Too few
        fc.array(validAltTextArb, { minLength: 10, maxLength: 15 }), // Too many
        fc.array(validAltTextArb, { minLength: 9, maxLength: 9 }) // Valid
      ),
      { nil: undefined }
    ),
  },
  { requiredKeys: [] }
);

describe('Property 12: Required field validation', () => {
  it('should validate that all required fields are present in valid project data', () => {
    fc.assert(
      fc.property(validProjectDataArb, (projectData) => {
        const validation = validateProjectData(projectData);
        
        // Valid project data should pass validation
        return validation.isValid && validation.errors.length === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('should reject project data missing required fields', () => {
    fc.assert(
      fc.property(partialProjectDataArb, (partialData) => {
        const validation = validateProjectData(partialData);
        
        // Count how many required fields are missing or invalid
        const hasValidId = partialData.id && typeof partialData.id === 'string';
        const hasValidClient = 
          partialData.client && 
          typeof partialData.client === 'string' && 
          partialData.client.startsWith('@');
        const hasValidProjectType = 
          partialData.projectType && typeof partialData.projectType === 'string';
        const hasValidDescription = 
          partialData.description && typeof partialData.description === 'string';
        const hasValidResults = 
          partialData.results && typeof partialData.results === 'string';
        const hasValidMockupImages = 
          Array.isArray(partialData.mockupImages) && 
          partialData.mockupImages.length === 9;
        const hasValidImageAlts = 
          Array.isArray(partialData.imageAlts) && 
          partialData.imageAlts.length === 9;
        
        const allFieldsValid = 
          hasValidId &&
          hasValidClient &&
          hasValidProjectType &&
          hasValidDescription &&
          hasValidResults &&
          hasValidMockupImages &&
          hasValidImageAlts;
        
        // If all fields are valid, validation should pass
        // If any field is invalid, validation should fail
        return allFieldsValid ? validation.isValid : !validation.isValid;
      }),
      { numRuns: 100 }
    );
  });

  it('should ensure client field starts with @ symbol', () => {
    fc.assert(
      fc.property(
        validProjectDataArb,
        fc.string({ minLength: 1, maxLength: 30 }),
        (baseData, clientWithoutAt) => {
          // Create data with client missing @ symbol
          const dataWithInvalidClient = {
            ...baseData,
            client: clientWithoutAt.startsWith('@') ? clientWithoutAt.slice(1) : clientWithoutAt,
          };
          
          const validation = validateProjectData(dataWithInvalidClient);
          
          // Should fail validation if client doesn't start with @
          if (!dataWithInvalidClient.client.startsWith('@')) {
            return !validation.isValid && 
                   validation.errors.some(e => e.includes('@ symbol'));
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should require exactly 9 mockup images', () => {
    fc.assert(
      fc.property(
        validProjectDataArb,
        fc.integer({ min: 0, max: 20 }).filter(n => n !== 9),
        (baseData, wrongCount) => {
          const dataWithWrongImageCount = {
            ...baseData,
            mockupImages: Array(wrongCount).fill('https://example.com/image.jpg'),
          };
          
          const validation = validateProjectData(dataWithWrongImageCount);
          
          // Should fail validation if not exactly 9 images
          return !validation.isValid && 
                 validation.errors.some(e => e.includes('exactly 9 images'));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should require exactly 9 image alt texts', () => {
    fc.assert(
      fc.property(
        validProjectDataArb,
        fc.integer({ min: 0, max: 20 }).filter(n => n !== 9),
        (baseData, wrongCount) => {
          const dataWithWrongAltCount = {
            ...baseData,
            imageAlts: Array(wrongCount).fill('Alt text'),
          };
          
          const validation = validateProjectData(dataWithWrongAltCount);
          
          // Should fail validation if not exactly 9 alt texts
          return !validation.isValid && 
                 validation.errors.some(e => e.includes('exactly 9 alt texts'));
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use fallback values for invalid or missing fields', () => {
    fc.assert(
      fc.property(partialProjectDataArb, (partialData) => {
        const ensuredData = ensureValidProjectData(partialData);
        
        // Ensured data should always be valid
        const validation = validateProjectData(ensuredData);
        
        // Should pass validation
        if (!validation.isValid) {
          return false;
        }
        
        // Should have all required fields
        return (
          typeof ensuredData.id === 'string' &&
          ensuredData.id.length > 0 &&
          typeof ensuredData.client === 'string' &&
          ensuredData.client.startsWith('@') &&
          typeof ensuredData.projectType === 'string' &&
          ensuredData.projectType.length > 0 &&
          typeof ensuredData.description === 'string' &&
          ensuredData.description.length > 0 &&
          typeof ensuredData.results === 'string' &&
          ensuredData.results.length > 0 &&
          Array.isArray(ensuredData.mockupImages) &&
          ensuredData.mockupImages.length === 9 &&
          Array.isArray(ensuredData.imageAlts) &&
          ensuredData.imageAlts.length === 9
        );
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve valid fields when using fallbacks', () => {
    fc.assert(
      fc.property(
        validIdArb,
        validClientArb,
        (validId, validClient) => {
          // Create partial data with only some valid fields
          const partialData = {
            id: validId,
            client: validClient,
            // Missing other required fields
          };
          
          const ensuredData = ensureValidProjectData(partialData);
          
          // Should preserve the valid fields we provided
          return (
            ensuredData.id === validId &&
            ensuredData.client === validClient
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should auto-prepend @ to client field if missing', () => {
    fc.assert(
      fc.property(
        validProjectDataArb,
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => !s.startsWith('@')),
        (baseData, clientWithoutAt) => {
          const dataWithInvalidClient = {
            ...baseData,
            client: clientWithoutAt,
          };
          
          const ensuredData = ensureValidProjectData(dataWithInvalidClient);
          
          // Should have @ prepended
          return ensuredData.client.startsWith('@') &&
                 ensuredData.client.includes(clientWithoutAt);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle completely empty object with all defaults', () => {
    fc.assert(
      fc.property(fc.constant({}), (emptyData) => {
        const ensuredData = ensureValidProjectData(emptyData);
        const validation = validateProjectData(ensuredData);
        
        // Should be valid and use all default values
        return (
          validation.isValid &&
          ensuredData.id === DEFAULT_PROJECT.id &&
          ensuredData.client.startsWith('@') &&
          ensuredData.projectType === DEFAULT_PROJECT.projectType &&
          ensuredData.description === DEFAULT_PROJECT.description &&
          ensuredData.results === DEFAULT_PROJECT.results &&
          ensuredData.mockupImages.length === 9 &&
          ensuredData.imageAlts.length === 9
        );
      }),
      { numRuns: 100 }
    );
  });
});
