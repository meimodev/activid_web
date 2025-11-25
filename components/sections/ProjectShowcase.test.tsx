import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectShowcase } from './ProjectShowcase';
import type { ProjectData } from '@/types/project-showcase.types';

describe('ProjectShowcase', () => {
  const mockProjects: ProjectData[] = [
    {
      id: '1',
      client: '@testclient',
      projectType: 'Branding',
      description: 'Test description',
      results: 'Test results',
      mockupImages: Array(9).fill('/test.jpg'),
      imageAlts: Array(9).fill('Test alt'),
    },
  ];

  it('renders section with correct structure', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    // Check section exists
    const section = screen.getByRole('region', { name: /project/i });
    expect(section).toBeInTheDocument();
  });

  it('displays section badge with number 03', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    const badge = screen.getByLabelText('Section number 03');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('03');
  });

  it('displays section heading "Project"', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    const heading = screen.getByRole('heading', { name: /project/i, level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Project');
  });

  it('displays subtitle "Branding & Design"', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    const subtitle = screen.getByText('Branding & Design');
    expect(subtitle).toBeInTheDocument();
  });

  it('applies correct background color', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    const section = screen.getByRole('region', { name: /project/i });
    expect(section).toHaveClass('bg-[#F8EFDE]');
  });

  it('applies custom className when provided', () => {
    render(<ProjectShowcase projects={mockProjects} className="custom-class" />);
    
    const section = screen.getByRole('region', { name: /project/i });
    expect(section).toHaveClass('custom-class');
  });

  it('uses consistent typography with landing page', () => {
    render(<ProjectShowcase projects={mockProjects} />);
    
    const heading = screen.getByRole('heading', { name: /project/i });
    expect(heading).toHaveClass('font-[family-name:var(--font-bricolage)]');
    expect(heading).toHaveClass('text-[#1a1a3e]');
  });
});
