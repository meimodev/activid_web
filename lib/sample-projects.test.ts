/**
 * Unit tests for sample project data
 */

import { describe, it, expect } from 'vitest';
import { SAMPLE_PROJECTS, getSampleProjects, getSampleProjectById, getSampleProjectsSubset } from './sample-projects';
import { validateProjectData } from '@/types/project-showcase.types';

describe('Sample Projects Data', () => {
  describe('SAMPLE_PROJECTS', () => {
    it('should contain exactly 3 projects', () => {
      expect(SAMPLE_PROJECTS).toHaveLength(3);
    });

    it('should have all projects with valid data structure', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        const validation = validateProjectData(project);
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      });
    });

    it('should have all projects with exactly 9 mockup images', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.mockupImages).toHaveLength(9);
      });
    });

    it('should have all projects with exactly 9 image alt texts', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.imageAlts).toHaveLength(9);
      });
    });

    it('should have all projects with client handles starting with @', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.client).toMatch(/^@/);
      });
    });

    it('should have all projects with unique IDs', () => {
      const ids = SAMPLE_PROJECTS.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all projects with non-empty descriptions', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.description.length).toBeGreaterThan(0);
      });
    });

    it('should have all projects with non-empty results', () => {
      SAMPLE_PROJECTS.forEach((project) => {
        expect(project.results.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getSampleProjects', () => {
    it('should return all sample projects', () => {
      const projects = getSampleProjects();
      expect(projects).toEqual(SAMPLE_PROJECTS);
      expect(projects).toHaveLength(3);
    });
  });

  describe('getSampleProjectById', () => {
    it('should return the correct project by ID', () => {
      const project = getSampleProjectById('bakso-denny-rebranding');
      expect(project).toBeDefined();
      expect(project?.client).toBe('@baksodenny');
    });

    it('should return undefined for non-existent ID', () => {
      const project = getSampleProjectById('non-existent-id');
      expect(project).toBeUndefined();
    });
  });

  describe('getSampleProjectsSubset', () => {
    it('should return all projects when count is undefined', () => {
      const projects = getSampleProjectsSubset();
      expect(projects).toHaveLength(3);
    });

    it('should return specified number of projects', () => {
      const projects = getSampleProjectsSubset(2);
      expect(projects).toHaveLength(2);
    });

    it('should return all projects when count exceeds array length', () => {
      const projects = getSampleProjectsSubset(10);
      expect(projects).toHaveLength(3);
    });

    it('should return empty array when count is 0', () => {
      const projects = getSampleProjectsSubset(0);
      expect(projects).toHaveLength(0);
    });
  });
});
