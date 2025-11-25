/**
 * Sample project data for the Project Showcase Section
 * Contains 3 realistic case studies with Instagram-style mockups
 */

import type { ProjectData } from '@/types/project-showcase.types';

/**
 * Sample project data array with 3 case studies
 * Uses Unsplash images for high-quality mockups
 */
export const SAMPLE_PROJECTS: ProjectData[] = [
  {
    id: 'bakso-denny-rebranding',
    client: '@baksodenny',
    projectType: 're-branding',
    description:
      'A comprehensive rebranding project for Bakso Denny, a beloved Indonesian meatball restaurant chain. We modernized their visual identity while preserving the authentic, homestyle essence that customers love. The new brand system includes a refreshed logo, vibrant color palette inspired by traditional Indonesian spices, and a cohesive social media presence that celebrates their culinary heritage.',
    results:
      '127% increase in social media engagement, 43% growth in new customer visits, and successful expansion to 3 new locations within 6 months of launch.',
    mockupImages: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    ],
    imageAlts: [
      'Bakso Denny signature meatball soup with fresh herbs',
      'Traditional Indonesian spices and ingredients display',
      'Bakso Denny restaurant interior with modern branding',
      'Close-up of handmade meatballs preparation',
      'Colorful vegetable toppings for bakso bowls',
      'Steaming bowl of bakso with noodles',
      'Fresh ingredients arranged on wooden table',
      'Bakso Denny branded packaging and takeout containers',
      'Traditional Indonesian street food presentation',
    ],
  },
  {
    id: 'bloom-botanicals-kickstart',
    client: '@bloombotanicals',
    projectType: 'Brand Kickstart & Social Media Setup',
    description:
      'Launched Bloom Botanicals from concept to market-ready brand. This sustainable plant shop needed a complete brand identity and digital presence. We created a nature-inspired visual system with earthy tones, organic typography, and photography guidelines that showcase their rare plant collection. The social media strategy focuses on plant care education and community building.',
    results:
      '5,000+ Instagram followers in first 3 months, 89% engagement rate on educational content, and featured in 2 major lifestyle publications.',
    mockupImages: [
      'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=400&fit=crop',
    ],
    imageAlts: [
      'Monstera deliciosa plant with vibrant green leaves',
      'Succulent collection in terracotta pots',
      'Fiddle leaf fig in modern white planter',
      'Hanging pothos plant in macrame holder',
      'Rare variegated plant close-up',
      'Plant care tools and accessories flat lay',
      'Snake plant in minimalist ceramic pot',
      'Tropical plant collection on wooden shelf',
      'Plant propagation station with glass vessels',
    ],
  },
  {
    id: 'urban-threads-ecommerce',
    client: '@urbanthreads',
    projectType: 'E-commerce Brand Identity',
    description:
      'Developed a bold, street-inspired brand identity for Urban Threads, a sustainable streetwear label. The project encompassed logo design, packaging, lookbook photography direction, and a complete e-commerce website. We emphasized their commitment to ethical manufacturing and recycled materials through authentic storytelling and raw, documentary-style visuals.',
    results:
      '250% increase in online sales, 92% customer satisfaction rating, and partnership with 3 major sustainable fashion retailers.',
    mockupImages: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
    ],
    imageAlts: [
      'Urban Threads sustainable streetwear collection display',
      'Model wearing oversized hoodie from Urban Threads',
      'Close-up of recycled fabric texture and stitching',
      'Street photography style lookbook shot',
      'Urban Threads branded clothing rack',
      'Sustainable fashion accessories flat lay',
      'Model in Urban Threads denim jacket',
      'Eco-friendly packaging with brand logo',
      'Behind-the-scenes ethical manufacturing process',
    ],
  },
];

/**
 * Get sample projects for development and testing
 * @returns Array of sample ProjectData objects
 */
export function getSampleProjects(): ProjectData[] {
  return SAMPLE_PROJECTS;
}

/**
 * Get a single sample project by ID
 * @param id - The project ID to retrieve
 * @returns ProjectData object or undefined if not found
 */
export function getSampleProjectById(id: string): ProjectData | undefined {
  return SAMPLE_PROJECTS.find((project) => project.id === id);
}

/**
 * Get a subset of sample projects
 * @param count - Number of projects to return (default: all)
 * @returns Array of ProjectData objects
 */
export function getSampleProjectsSubset(count?: number): ProjectData[] {
  if (count === undefined || count >= SAMPLE_PROJECTS.length) {
    return SAMPLE_PROJECTS;
  }
  return SAMPLE_PROJECTS.slice(0, Math.max(0, count));
}
