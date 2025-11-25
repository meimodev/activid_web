'use client';

import { motion } from 'framer-motion';
import { BrowserFrame } from './BrowserFrame';
import { ProjectDetails } from './ProjectDetails';
import { FadeUp } from '@/components/animations/FadeUp';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ensureValidProjectData } from '@/types/project-showcase.types';
import type { ProjectShowcaseProps } from '@/types/project-showcase.types';

/**
 * ProjectShowcase component - Main container for portfolio case studies
 * Displays project mockups in browser frames with detailed project information
 * 
 * Features:
 * - Section badge with number "03"
 * - Section header with "Project" heading and "Branding & Design" subtitle
 * - Responsive grid layout for case studies
 * - Consistent styling with landing page aesthetic
 * - Dynamic rendering with data validation
 * - Fallback handling for empty or invalid data
 * 
 * Requirements: 1.1, 1.4, 5.1, 5.2, 5.3, 5.4, 6.2, 6.3, 6.4, 6.5
 */
export function ProjectShowcase({ projects, className = '' }: ProjectShowcaseProps) {
  // Validate and ensure all projects have required fields
  const validatedProjects = projects.map(ensureValidProjectData);
  
  // Check if projects array is empty
  const hasProjects = validatedProjects.length > 0;
  
  // Check user's motion preference
  const prefersReducedMotion = useReducedMotion();
  return (
    <section
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8EFDE] ${className}`}
      aria-labelledby="project-showcase-heading"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Badge - Number "03" */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="absolute p-3 sm:p-4 rounded-bl-4xl bg-[#1a1a3e] top-2 right-4 sm:right-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black opacity-90 text-[#F8EFDE] font-[family-name:var(--font-bricolage)]"
          aria-label="Section number 03"
        >
          03
        </motion.div>

        {/* Section Header */}
        <FadeUp duration={0.8} className="mb-8 sm:mb-12 md:mb-16">
          <h2
            id="project-showcase-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#1a1a3e] leading-none font-[family-name:var(--font-bricolage)]"
          >
            Project
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-[#1a1a3e] mt-2 font-[family-name:var(--font-bricolage)]">
            Branding & Design
          </p>
        </FadeUp>

        {/* Case Studies Grid */}
        {hasProjects ? (
          <div className="space-y-12 sm:space-y-16 lg:space-y-24">
            {validatedProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.19, 1, 0.22, 1],
                      }
                }
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.02,
                        transition: { duration: 0.3, ease: 'easeInOut' },
                      }
                }
                className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a1a3e] focus-within:ring-offset-4 rounded-lg transition-shadow"
                style={{
                  willChange: prefersReducedMotion ? 'auto' : 'transform',
                }}
                tabIndex={0}
                role="article"
                aria-label={`Case study ${index + 1}: ${project.client}`}
              >
                {/* Browser Frame with Instagram Grid */}
                <div className="w-full">
                  <BrowserFrame
                    mockupImages={project.mockupImages}
                    imageAlts={project.imageAlts}
                    priority={index === 0}
                  />
                </div>

                {/* Project Details */}
                <div className="w-full">
                  <ProjectDetails
                    projectNumber={`${String(index + 1).padStart(2, '0')}.`}
                    client={project.client}
                    projectType={project.projectType}
                    description={project.description}
                    results={project.results}
                  />
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
            className="text-center py-16"
            role="status"
            aria-live="polite"
          >
            <p className="text-xl md:text-2xl text-[#1a1a3e] font-[family-name:var(--font-bricolage)]">
              No projects available at this time.
            </p>
            <p className="text-base md:text-lg text-gray-600 mt-2">
              Check back soon for our latest work.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
