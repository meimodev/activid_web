'use client';

import { memo } from 'react';
import type { ProjectDetailsProps } from '@/types/project-showcase.types';

/**
 * ProjectDetails component that displays structured project information
 * Shows numbered indicator, client handle, project type, description, and results
 * 
 * @param projectNumber - Project number indicator (e.g., "01.", "02.")
 * @param client - Client handle with @ symbol
 * @param projectType - Type of project work
 * @param description - Project approach and methodology
 * @param results - Project outcomes
 * @param className - Optional additional CSS classes
 */
function ProjectDetailsComponent({
  projectNumber,
  client,
  projectType,
  description,
  results,
  className = '',
}: ProjectDetailsProps) {
  return (
    <div 
      className={`flex flex-col gap-3 sm:gap-4 md:gap-5 ${className}`}
      role="article"
      aria-label={`Project details for ${client}`}
    >
      {/* Project Number, Client Handle, and Project Type */}
      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm md:text-base">
        <span 
          className="font-semibold text-[#1a1a3e]"
          aria-label={`Project number ${projectNumber}`}
        >
          {projectNumber}
        </span>
        <span 
          className="text-[#1a1a3e] font-medium"
          aria-label={`Client ${client}`}
        >
          {client}
        </span>
        <span 
          className="text-gray-400 select-none"
          aria-hidden="true"
          role="separator"
        >
          |
        </span>
        <span 
          className="text-[#1a1a3e]"
          aria-label={`Project type: ${projectType}`}
        >
          {projectType}
        </span>
      </div>

      {/* Description */}
      <p 
        className="text-[#1a1a3e] text-sm sm:text-base md:text-lg leading-relaxed break-words overflow-wrap-anywhere"
        aria-label="Project description"
      >
        {description}
      </p>

      {/* Results with "Result:" label */}
      <div 
        className="text-[#1a1a3e] text-sm sm:text-base md:text-lg leading-relaxed"
        aria-label="Project results"
      >
        <span className="font-semibold">Result: </span>
        <span className="break-words overflow-wrap-anywhere">{results}</span>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const ProjectDetails = memo(ProjectDetailsComponent);
