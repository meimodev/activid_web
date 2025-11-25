import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StaggerChildren } from './StaggerChildren';

// Mock the useReducedMotion hook
vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe('StaggerChildren', () => {
  it('should render children', () => {
    render(
      <StaggerChildren>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerChildren>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('should render single child', () => {
    render(
      <StaggerChildren>
        <div>Single Child</div>
      </StaggerChildren>
    );

    expect(screen.getByText('Single Child')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <StaggerChildren className="custom-class">
        <div>Child</div>
      </StaggerChildren>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should accept custom staggerDelay prop', () => {
    // This test verifies the component accepts the prop without errors
    expect(() => {
      render(
        <StaggerChildren staggerDelay={0.2}>
          <div>Child 1</div>
          <div>Child 2</div>
        </StaggerChildren>
      );
    }).not.toThrow();
  });
});
