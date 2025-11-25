/**
 * Type definitions for the Project Showcase Section
 */

/**
 * Core project data structure containing all information for a case study
 */
export interface ProjectData {
  /** Unique identifier for React keys */
  id: string;
  /** Client handle with @ symbol (e.g., "@baksodenny") */
  client: string;
  /** Type of project work (e.g., "re-branding", "Brand Kickstart & Social Media Setup") */
  projectType: string;
  /** Project approach and methodology description */
  description: string;
  /** Outcome description */
  results: string;
  /** Array of exactly 9 image URLs for 3x3 Instagram grid */
  mockupImages: string[];
  /** Array of exactly 9 alt texts matching images */
  imageAlts: string[];
}

/**
 * Props for the main ProjectShowcase component
 */
export interface ProjectShowcaseProps {
  /** Array of project data to display */
  projects: ProjectData[];
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for the BrowserFrame sub-component
 */
export interface BrowserFrameProps {
  /** Array of image URLs for mockups */
  mockupImages: string[];
  /** Corresponding alt text for each image */
  imageAlts: string[];
  /** Loading state indicator */
  isLoading?: boolean;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for the ProjectDetails sub-component
 */
export interface ProjectDetailsProps {
  /** Project number indicator (e.g., "01.", "02.") */
  projectNumber: string;
  /** Client handle */
  client: string;
  /** Type of project work */
  projectType: string;
  /** Project description */
  description: string;
  /** Project results */
  results: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Props for the InstagramGrid sub-component
 */
export interface InstagramGridProps {
  /** Array of image URLs */
  images: string[];
  /** Array of alt texts */
  alts: string[];
  /** Loading state indicator */
  isLoading?: boolean;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
}

/**
 * Validation schema for project data
 */
export const PROJECT_DATA_SCHEMA = {
  id: { type: 'string' as const, required: true },
  client: { type: 'string' as const, required: true, pattern: /^@/ },
  projectType: { type: 'string' as const, required: true },
  description: { type: 'string' as const, required: true },
  results: { type: 'string' as const, required: true },
  mockupImages: { type: 'array' as const, required: true, length: 9 },
  imageAlts: { type: 'array' as const, required: true, length: 9 },
} as const;

/**
 * Type for validation schema field
 */
export type ValidationField = {
  type: 'string' | 'array';
  required: boolean;
  pattern?: RegExp;
  length?: number;
};

/**
 * Default/fallback project data
 */
export const DEFAULT_PROJECT: ProjectData = {
  id: 'default',
  client: '@placeholder',
  projectType: 'Project Type',
  description: 'Project description unavailable.',
  results: 'Results pending.',
  mockupImages: Array(9).fill('/placeholder-image.jpg'),
  imageAlts: Array(9).fill('Project mockup placeholder'),
};

/**
 * Validates a project data object against the schema
 * @param data - The project data to validate
 * @returns Object with isValid boolean and errors array
 */
export function validateProjectData(data: Partial<ProjectData>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!data.id || typeof data.id !== 'string') {
    errors.push('id is required and must be a string');
  }

  if (!data.client || typeof data.client !== 'string') {
    errors.push('client is required and must be a string');
  } else if (!PROJECT_DATA_SCHEMA.client.pattern.test(data.client)) {
    errors.push('client must start with @ symbol');
  }

  if (!data.projectType || typeof data.projectType !== 'string') {
    errors.push('projectType is required and must be a string');
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('description is required and must be a string');
  }

  if (!data.results || typeof data.results !== 'string') {
    errors.push('results is required and must be a string');
  }

  if (!Array.isArray(data.mockupImages)) {
    errors.push('mockupImages is required and must be an array');
  } else if (data.mockupImages.length !== 9) {
    errors.push('mockupImages must contain exactly 9 images');
  }

  if (!Array.isArray(data.imageAlts)) {
    errors.push('imageAlts is required and must be an array');
  } else if (data.imageAlts.length !== 9) {
    errors.push('imageAlts must contain exactly 9 alt texts');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Ensures a project data object has all required fields, using defaults for missing values
 * @param data - Partial project data
 * @returns Complete ProjectData object
 */
export function ensureValidProjectData(data: Partial<ProjectData>): ProjectData {
  const validation = validateProjectData(data);
  
  if (validation.isValid) {
    return data as ProjectData;
  }

  // Use defaults for missing or invalid fields
  return {
    id: data.id || DEFAULT_PROJECT.id,
    client: data.client?.startsWith('@') ? data.client : `@${data.client || 'placeholder'}`,
    projectType: data.projectType || DEFAULT_PROJECT.projectType,
    description: data.description || DEFAULT_PROJECT.description,
    results: data.results || DEFAULT_PROJECT.results,
    mockupImages: Array.isArray(data.mockupImages) && data.mockupImages.length === 9
      ? data.mockupImages
      : DEFAULT_PROJECT.mockupImages,
    imageAlts: Array.isArray(data.imageAlts) && data.imageAlts.length === 9
      ? data.imageAlts
      : DEFAULT_PROJECT.imageAlts,
  };
}
