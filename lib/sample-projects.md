# Sample Project Data

This file contains sample project data for the Project Showcase Section component.

## Overview

The `sample-projects.ts` file provides realistic case study data that can be used for development, testing, and demonstration purposes. It includes 3 complete project case studies with Instagram-style mockup images from Unsplash.

## Usage

### Import the sample data

```typescript
import { getSampleProjects } from '@/lib/sample-projects';

// Get all sample projects
const projects = getSampleProjects();

// Use in your component
<ProjectShowcase projects={projects} />
```

### Available Functions

#### `getSampleProjects()`
Returns all 3 sample projects.

```typescript
const allProjects = getSampleProjects();
// Returns: ProjectData[] (length: 3)
```

#### `getSampleProjectById(id: string)`
Returns a specific project by its ID.

```typescript
const project = getSampleProjectById('bakso-denny-rebranding');
// Returns: ProjectData | undefined
```

#### `getSampleProjectsSubset(count?: number)`
Returns a subset of sample projects.

```typescript
const twoProjects = getSampleProjectsSubset(2);
// Returns: ProjectData[] (length: 2)
```

## Sample Projects Included

### 1. Bakso Denny - Re-branding
- **Client**: @baksodenny
- **Type**: re-branding
- **Focus**: Indonesian restaurant chain rebranding
- **Images**: Food photography and restaurant branding

### 2. Bloom Botanicals - Brand Kickstart
- **Client**: @bloombotanicals
- **Type**: Brand Kickstart & Social Media Setup
- **Focus**: Sustainable plant shop brand launch
- **Images**: Plant photography and botanical content

### 3. Urban Threads - E-commerce Brand Identity
- **Client**: @urbanthreads
- **Type**: E-commerce Brand Identity
- **Focus**: Sustainable streetwear brand identity
- **Images**: Fashion photography and product shots

## Data Structure

Each project follows the `ProjectData` interface:

```typescript
interface ProjectData {
  id: string;                    // Unique identifier
  client: string;                // Client handle with @ symbol
  projectType: string;           // Type of project work
  description: string;           // Project approach and methodology
  results: string;               // Outcome description
  mockupImages: string[];        // Array of 9 image URLs
  imageAlts: string[];          // Array of 9 alt texts
}
```

## Image Sources

All images are sourced from Unsplash with appropriate sizing parameters:
- Dimensions: 400x400px
- Fit: crop
- High-quality, royalty-free images

## Validation

All sample projects are validated against the `PROJECT_DATA_SCHEMA` to ensure:
- All required fields are present
- Client handles start with @
- Exactly 9 mockup images and alt texts
- Non-empty descriptions and results

## Testing

Unit tests are available in `lib/sample-projects.test.ts` to verify:
- Data structure validity
- Required field presence
- Correct array lengths
- Unique IDs
- Helper function behavior

Run tests with:
```bash
npm test lib/sample-projects.test.ts --run
```

## Customization

To add your own project data:

1. Create a new `ProjectData` object following the interface
2. Ensure it has exactly 9 mockup images and alt texts
3. Validate using `validateProjectData()` from `@/types/project-showcase.types`
4. Add to the `SAMPLE_PROJECTS` array or create a new data file

Example:
```typescript
const myProject: ProjectData = {
  id: 'my-project-id',
  client: '@myclient',
  projectType: 'Web Design',
  description: 'Project description...',
  results: 'Achieved great results...',
  mockupImages: [/* 9 image URLs */],
  imageAlts: [/* 9 alt texts */],
};
```
