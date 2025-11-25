import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectDetails } from './ProjectDetails';

describe('ProjectDetails', () => {
  const defaultProps = {
    projectNumber: '01.',
    client: '@testclient',
    projectType: 'Branding',
    description: 'This is a test project description.',
    results: 'Successfully delivered the project.',
  };

  it('renders all required elements', () => {
    render(<ProjectDetails {...defaultProps} />);
    
    expect(screen.getByText('01.')).toBeInTheDocument();
    expect(screen.getByText('@testclient')).toBeInTheDocument();
    expect(screen.getByText('Branding')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description.')).toBeInTheDocument();
    expect(screen.getByText(/Result:/)).toBeInTheDocument();
    expect(screen.getByText(/Successfully delivered the project./)).toBeInTheDocument();
  });

  it('formats the header line correctly with separator', () => {
    render(<ProjectDetails {...defaultProps} />);
    
    const separator = screen.getByText('|');
    expect(separator).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <ProjectDetails {...defaultProps} className="custom-class" />
    );
    
    const article = container.querySelector('[role="article"]');
    expect(article).toHaveClass('custom-class');
  });

  it('handles long text content without breaking layout', () => {
    const longText = 'A'.repeat(500);
    render(
      <ProjectDetails
        {...defaultProps}
        description={longText}
        results={longText}
      />
    );
    
    expect(screen.getByText(longText, { selector: 'p' })).toBeInTheDocument();
  });

  it('includes proper ARIA labels for accessibility', () => {
    render(<ProjectDetails {...defaultProps} />);
    
    expect(screen.getByLabelText(/Project details for @testclient/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project number 01./)).toBeInTheDocument();
    expect(screen.getByLabelText(/Client @testclient/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project type: Branding/)).toBeInTheDocument();
    expect(screen.getByLabelText('Project description')).toBeInTheDocument();
    expect(screen.getByLabelText('Project results')).toBeInTheDocument();
  });

  it('uses semantic HTML with article role', () => {
    const { container } = render(<ProjectDetails {...defaultProps} />);
    
    const article = container.querySelector('[role="article"]');
    expect(article).toBeInTheDocument();
  });
});
