# Design Document: Project Showcase Section

## Overview

The Project Showcase Section is a portfolio component that displays completed client work in an immersive, visually engaging format. The section features browser-framed mockups of Instagram-style project grids paired with detailed case study information including client handles, project types, descriptions, and results. The design follows the established landing page aesthetic with a beige/cream background, dark navy text, and smooth scroll-triggered animations.

The component will be positioned after the services section (ScrollExpandableCards) and will be assigned section number "03" to maintain the sequential numbering pattern established in the existing sections (Hero, AboutUs "01", ScrollExpandableCards "02").

## Architecture

### Component Structure

```
ProjectShowcase (Container)
├── Section Badge (Number "03")
├── Section Header
│   ├── Main Heading ("Project")
│   └── Subtitle ("Branding & Design")
├── Case Studies Grid
│   ├── BrowserFrame (Left Column)
│   │   ├── Browser Chrome
│   │   │   ├── Window Controls
│   │   │   └── Address Bar
│   │   └── Instagram Grid Mockup
│   │       └── Project Images (3x3 grid)
│   └── ProjectDetails (Right Column)
│       ├── Project Number & Client Handle
│       ├── Project Type
│       ├── Description
│       └── Results
└── Scroll Animations
```

### Technology Stack

- **Framework**: Next.js 14+ with React Server Components where appropriate
- **Animation**: Framer Motion (consistent with existing sections)
- **Styling**: Tailwind CSS with custom design tokens
- **Images**: Next.js Image component for optimization
- **TypeScript**: Full type safety with interfaces for all data structures

### Design Patterns

1. **Data-Driven Rendering**: Component accepts project data as props and renders dynamically
2. **Composition**: Separate sub-components for BrowserFrame and ProjectDetails for reusability
3. **Responsive Design**: Mobile-first approach with breakpoints at sm (640px), md (768px), lg (1024px)
4. **Animation Orchestration**: Staggered entrance animations using Framer Motion's stagger children pattern
5. **Performance Optimization**: Lazy loading, skeleton states, and Next.js Image optimization

## Components and Interfaces

### Main Component: ProjectShowcase

```typescript
export interface ProjectData {
  id: string;
  client: string; // e.g., "@baksodenny"
  projectType: string; // e.g., "re-brading", "Brand Kickstart & Social Media Setup"
  description: string;
  results: string;
  mockupImages: string[]; // Array of 9 image URLs for Instagram grid
  imageAlts: string[]; // Corresponding alt text for each image
}

export interface ProjectShowcaseProps {
  projects: ProjectData[];
  className?: string;
}
```

### Sub-Component: BrowserFrame

```typescript
export interface BrowserFrameProps {
  mockupImages: string[];
  imageAlts: string[];
  isLoading?: boolean;
  className?: string;
}
```

### Sub-Component: ProjectDetails

```typescript
export interface ProjectDetailsProps {
  projectNumber: string; // e.g., "01.", "02."
  client: string;
  projectType: string;
  description: string;
  results: string;
  className?: string;
}
```

### Sub-Component: InstagramGrid

```typescript
export interface InstagramGridProps {
  images: string[];
  alts: string[];
  isLoading?: boolean;
}
```

## Data Models

### ProjectData Type Definition

```typescript
type ProjectData = {
  id: string; // Unique identifier for React keys
  client: string; // Client handle with @ symbol
  projectType: string; // Type of project work
  description: string; // Project approach and methodology
  results: string; // Outcome description
  mockupImages: string[]; // Exactly 9 URLs for 3x3 grid
  imageAlts: string[]; // Exactly 9 alt texts matching images
};
```

### Validation Schema

```typescript
const projectDataSchema = {
  id: { type: 'string', required: true },
  client: { type: 'string', required: true, pattern: /^@/ },
  projectType: { type: 'string', required: true },
  description: { type: 'string', required: true },
  results: { type: 'string', required: true },
  mockupImages: { type: 'array', required: true, length: 9 },
  imageAlts: { type: 'array', required: true, length: 9 },
};
```

### Default/Fallback Data

```typescript
const DEFAULT_PROJECT: ProjectData = {
  id: 'default',
  client: '@placeholder',
  projectType: 'Project Type',
  description: 'Project description unavailable.',
  results: 'Results pending.',
  mockupImages: Array(9).fill('/placeholder-image.jpg'),
  imageAlts: Array(9).fill('Project mockup placeholder'),
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all testable acceptance criteria, the following redundancies were identified and resolved:

- **Redundancy 1**: Properties 2.1 (browser chrome elements) and 2.4 (consistent styling across frames) can be combined into a single property that validates both the presence of chrome elements and their consistency.
- **Redundancy 2**: Properties 3.1, 3.2, and 3.3 (project detail formatting) can be consolidated into one comprehensive property that validates the complete structure of project details.
- **Redundancy 3**: Properties 4.3 and 4.5 (motion preferences) are testing the same behavior and can be combined.
- **Redundancy 4**: Properties 8.1 and 8.4 (lazy loading and prioritization) are related aspects of the same loading strategy and can be combined.

### Core Properties

**Property 1: Minimum case study display**
*For any* valid project data array with at least three projects, the rendered section should display at least three case study cards with complete browser frames and project details.
**Validates: Requirements 1.2**

**Property 2: Complete case study structure**
*For any* rendered case study card, it should contain all required elements: browser frame with chrome, Instagram grid mockup, client handle with @ symbol, project type, description with "Result:" label, and results text.
**Validates: Requirements 1.3, 2.1, 3.1, 3.2, 3.3**

**Property 3: Responsive layout adaptation**
*For any* viewport width change across mobile (< 640px), tablet (640-1024px), and desktop (> 1024px) breakpoints, the layout should adapt while maintaining all content visibility and readability.
**Validates: Requirements 1.5**

**Property 4: Instagram grid structure**
*For any* set of mockup images within a browser frame, they should be arranged in a 3x3 grid layout with consistent aspect ratios and spacing.
**Validates: Requirements 2.2, 2.3**

**Property 5: Browser frame consistency**
*For any* set of multiple browser frames in the section, all frames should have identical chrome styling, dimensions, and structural elements.
**Validates: Requirements 2.4**

**Property 6: Image loading states**
*For any* image that has not completed loading, a skeleton placeholder should be displayed until the image is available.
**Validates: Requirements 2.5, 8.2**

**Property 7: Project detail formatting consistency**
*For any* set of multiple projects displayed, all project details should maintain identical typography, spacing, and structural formatting.
**Validates: Requirements 3.4**

**Property 8: Text overflow handling**
*For any* text content (description or results) that exceeds the available container width, the layout should remain intact without horizontal overflow or broken elements.
**Validates: Requirements 3.5 (edge case)**

**Property 9: Staggered animation timing**
*For any* set of case study cards becoming visible, their entrance animations should be staggered with consistent delay increments between each card.
**Validates: Requirements 4.2**

**Property 10: Hover interaction feedback**
*For any* case study card, hovering should trigger visual feedback (scale or shadow change) that is visible and smooth.
**Validates: Requirements 4.4**

**Property 11: Motion preference respect**
*For any* animation in the section, when the user has prefers-reduced-motion enabled, animations should be disabled or reduced to minimal duration.
**Validates: Requirements 4.3, 4.5**

**Property 12: Required field validation**
*For any* project data object, it should contain all required fields (client, projectType, description, results, mockupImages) or the system should reject it or use fallback values.
**Validates: Requirements 6.2**

**Property 13: Dynamic rendering count**
*For any* array of N project data objects, the component should render exactly N case study cards.
**Validates: Requirements 6.3**

**Property 14: Graceful optional field handling**
*For any* project data object missing optional fields, the component should render without those elements while maintaining layout integrity.
**Validates: Requirements 6.4**

**Property 15: Reactive data updates**
*For any* change to the projects prop array, the component should re-render with the updated content without requiring remounting.
**Validates: Requirements 6.5**

**Property 16: Image alt text presence**
*For any* image rendered in the section, it should have a non-empty alt attribute.
**Validates: Requirements 7.2**

**Property 17: Keyboard navigation**
*For any* interactive element in the section, it should be reachable via keyboard navigation and display visible focus indicators.
**Validates: Requirements 7.3**

**Property 18: Non-color information indicators**
*For any* information conveyed through color, there should be an additional non-color indicator (text, icon, or pattern).
**Validates: Requirements 7.5**

**Property 19: Lazy loading implementation**
*For any* image positioned below the initial viewport, it should not load until the user scrolls near it, prioritizing visible images first.
**Validates: Requirements 8.1, 8.4**

**Property 20: Responsive image sizing**
*For any* viewport dimension, images should be requested at sizes appropriate for that viewport to minimize bandwidth usage.
**Validates: Requirements 8.3**

**Property 21: Image load failure handling**
*For any* image that fails to load, a fallback state should be displayed without breaking the surrounding layout.
**Validates: Requirements 8.5**

## Error Handling

### Data Validation Errors

1. **Missing Required Fields**: If project data lacks required fields, log warning and use fallback values
2. **Invalid Image URLs**: If mockupImages array is not length 9, pad with placeholders or truncate
3. **Malformed Client Handle**: If client doesn't start with @, prepend it automatically

### Runtime Errors

1. **Image Load Failures**: Display fallback image with error icon and alt text
2. **Animation Errors**: Gracefully degrade to static display if Framer Motion fails
3. **Responsive Breakpoint Issues**: Ensure mobile-first CSS provides baseline layout

### User Experience Errors

1. **Empty Project Array**: Display message "No projects available" with call-to-action
2. **Slow Image Loading**: Show skeleton loaders with subtle pulse animation
3. **Accessibility Issues**: Ensure all interactive elements have ARIA labels and keyboard support

## Testing Strategy

### Unit Testing

**Framework**: Vitest with React Testing Library

**Unit Test Coverage**:

1. **Component Rendering**
   - ProjectShowcase renders with valid props
   - BrowserFrame displays chrome elements correctly
   - ProjectDetails formats text content properly
   - InstagramGrid arranges images in 3x3 layout

2. **Data Validation**
   - Validates required fields in ProjectData
   - Handles missing optional fields gracefully
   - Rejects invalid data structures

3. **Edge Cases**
   - Empty projects array displays fallback message
   - Single project displays correctly
   - Very long text content doesn't break layout
   - Missing images show placeholders

4. **Accessibility**
   - Semantic HTML structure is correct
   - All images have alt text
   - Keyboard navigation works
   - Focus indicators are visible
   - ARIA labels are present

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Minimum 100 iterations per property test

**Property Test Coverage**:

Each property-based test must be tagged with the format: `**Feature: project-showcase-section, Property {number}: {property_text}**`

1. **Property 1: Minimum case study display**
   - Generate: Random arrays of 3-10 valid ProjectData objects
   - Assert: Rendered output contains at least 3 case study cards
   - Tag: `**Feature: project-showcase-section, Property 1: Minimum case study display**`

2. **Property 2: Complete case study structure**
   - Generate: Random ProjectData objects with all required fields
   - Assert: Each rendered card contains browser frame, chrome, grid, client, type, description, results
   - Tag: `**Feature: project-showcase-section, Property 2: Complete case study structure**`

3. **Property 3: Responsive layout adaptation**
   - Generate: Random viewport widths (320px - 1920px)
   - Assert: Layout adapts at breakpoints without content overflow
   - Tag: `**Feature: project-showcase-section, Property 3: Responsive layout adaptation**`

4. **Property 4: Instagram grid structure**
   - Generate: Random arrays of 9 image URLs
   - Assert: Images are arranged in 3x3 grid with consistent spacing
   - Tag: `**Feature: project-showcase-section, Property 4: Instagram grid structure**`

5. **Property 5: Browser frame consistency**
   - Generate: Random arrays of 2-5 ProjectData objects
   - Assert: All browser frames have identical styling and dimensions
   - Tag: `**Feature: project-showcase-section, Property 5: Browser frame consistency**`

6. **Property 6: Image loading states**
   - Generate: Random image URLs with simulated loading delays
   - Assert: Skeleton placeholders display until images load
   - Tag: `**Feature: project-showcase-section, Property 6: Image loading states**`

7. **Property 7: Project detail formatting consistency**
   - Generate: Random arrays of 2-5 ProjectData objects
   - Assert: All project details have identical typography and spacing
   - Tag: `**Feature: project-showcase-section, Property 7: Project detail formatting consistency**`

8. **Property 8: Text overflow handling**
   - Generate: Random strings of 500-2000 characters for descriptions
   - Assert: Layout remains intact without horizontal overflow
   - Tag: `**Feature: project-showcase-section, Property 8: Text overflow handling**`

9. **Property 9: Staggered animation timing**
   - Generate: Random arrays of 3-6 ProjectData objects
   - Assert: Animation delays increase consistently between cards
   - Tag: `**Feature: project-showcase-section, Property 9: Staggered animation timing**`

10. **Property 10: Hover interaction feedback**
    - Generate: Random case study cards
    - Assert: Hover triggers scale or shadow change
    - Tag: `**Feature: project-showcase-section, Property 10: Hover interaction feedback**`

11. **Property 11: Motion preference respect**
    - Generate: Random animation configurations with prefers-reduced-motion enabled
    - Assert: Animations are disabled or minimal
    - Tag: `**Feature: project-showcase-section, Property 11: Motion preference respect**`

12. **Property 12: Required field validation**
    - Generate: Random ProjectData objects, some missing required fields
    - Assert: Invalid objects are rejected or use fallbacks
    - Tag: `**Feature: project-showcase-section, Property 12: Required field validation**`

13. **Property 13: Dynamic rendering count**
    - Generate: Random arrays of 1-10 ProjectData objects
    - Assert: Number of rendered cards equals array length
    - Tag: `**Feature: project-showcase-section, Property 13: Dynamic rendering count**`

14. **Property 14: Graceful optional field handling**
    - Generate: Random ProjectData objects with some optional fields missing
    - Assert: Component renders without errors, layout intact
    - Tag: `**Feature: project-showcase-section, Property 14: Graceful optional field handling**`

15. **Property 15: Reactive data updates**
    - Generate: Random initial and updated ProjectData arrays
    - Assert: Component re-renders with new data
    - Tag: `**Feature: project-showcase-section, Property 15: Reactive data updates**`

16. **Property 16: Image alt text presence**
    - Generate: Random ProjectData objects with images
    - Assert: All img elements have non-empty alt attributes
    - Tag: `**Feature: project-showcase-section, Property 16: Image alt text presence**`

17. **Property 17: Keyboard navigation**
    - Generate: Random interactive elements
    - Assert: All are keyboard accessible with visible focus
    - Tag: `**Feature: project-showcase-section, Property 17: Keyboard navigation**`

18. **Property 18: Non-color information indicators**
    - Generate: Random project data with color-coded information
    - Assert: Additional non-color indicators present
    - Tag: `**Feature: project-showcase-section, Property 18: Non-color information indicators**`

19. **Property 19: Lazy loading implementation**
    - Generate: Random arrays of images, some below fold
    - Assert: Below-fold images don't load until scrolled near
    - Tag: `**Feature: project-showcase-section, Property 19: Lazy loading implementation**`

20. **Property 20: Responsive image sizing**
    - Generate: Random viewport dimensions
    - Assert: Image sizes requested match viewport appropriately
    - Tag: `**Feature: project-showcase-section, Property 20: Responsive image sizing**`

21. **Property 21: Image load failure handling**
    - Generate: Random image URLs, some invalid
    - Assert: Failed images show fallback without breaking layout
    - Tag: `**Feature: project-showcase-section, Property 21: Image load failure handling**`

### Integration Testing

1. **Section Integration**: Test ProjectShowcase within the full page layout after ScrollExpandableCards
2. **Animation Sequencing**: Verify scroll-triggered animations work correctly in page context
3. **Performance**: Measure rendering time and ensure < 100ms for initial paint
4. **Accessibility**: Run axe-core automated accessibility tests

### Visual Regression Testing

1. **Snapshot Tests**: Capture screenshots at mobile, tablet, and desktop breakpoints
2. **Animation States**: Test initial, hover, and loading states
3. **Cross-Browser**: Verify rendering in Chrome, Firefox, Safari, Edge

## Implementation Notes

### Styling Approach

- Use existing design tokens from `app/globals.css`
- Background: `bg-[#F8EFDE]` (cream/beige)
- Text: `text-[#1a1a3e]` (dark navy)
- Accent: `text-[#c41e3a]` (burgundy for highlights)
- Font: `font-[family-name:var(--font-bricolage)]`

### Animation Configuration

- Use `ANIMATION_VARIANTS` from `lib/animation-config.ts`
- Stagger delay: 0.1s between cards
- Fade-up duration: 0.8s with easeOutExpo
- Hover transitions: 0.3s with easeInOut

### Responsive Breakpoints

- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (two column with adjusted spacing)
- Desktop: > 1024px (full two-column layout with browser frames)

### Performance Optimizations

1. Use Next.js Image component with `loading="lazy"` and `sizes` attribute
2. Implement skeleton loaders for perceived performance
3. Apply `will-change: transform` sparingly during animations only
4. Use CSS containment for browser frame components
5. Memoize ProjectDetails and BrowserFrame components with React.memo

### Accessibility Considerations

1. Use semantic HTML: `<section>`, `<article>`, `<h2>`, `<p>`
2. Provide descriptive alt text for all images
3. Ensure keyboard navigation with visible focus indicators
4. Add ARIA labels for screen readers where needed
5. Respect prefers-reduced-motion for all animations
6. Maintain color contrast ratios of at least 4.5:1

### Browser Compatibility

- Target: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Fallbacks: Provide static layout if Framer Motion fails
- Progressive Enhancement: Core content accessible without JavaScript
