/**
 * Unit tests for BrowserFrame component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserFrame } from './BrowserFrame';

describe('BrowserFrame', () => {
  const mockImages = Array(9).fill('https://example.com/image.jpg');
  const mockAlts = Array(9).fill('Project mockup');

  it('should render browser chrome with window controls', () => {
    const { container } = render(
      <BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />
    );

    // Check for window controls (decorative divs with specific colors)
    const redControl = container.querySelector('.bg-red-500');
    const yellowControl = container.querySelector('.bg-yellow-500');
    const greenControl = container.querySelector('.bg-green-500');
    
    expect(redControl).toBeTruthy();
    expect(yellowControl).toBeTruthy();
    expect(greenControl).toBeTruthy();
  });

  it('should render address bar with URL', () => {
    const { container } = render(
      <BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />
    );

    const addressBar = container.querySelector('.bg-white.rounded');
    expect(addressBar).toBeTruthy();
    expect(addressBar?.textContent).toContain('instagram.com/project');
  });

  it('should render lock icon in address bar', () => {
    const { container } = render(
      <BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />
    );

    const lockIcon = container.querySelector('svg');
    expect(lockIcon).toBeTruthy();
  });

  it('should render InstagramGrid with provided images', () => {
    const { container } = render(
      <BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />
    );

    const grid = container.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
  });

  it('should pass loading state to InstagramGrid', () => {
    const { container } = render(
      <BrowserFrame 
        mockupImages={mockImages} 
        imageAlts={mockAlts} 
        isLoading={true}
      />
    );

    // When loading, skeleton loaders should be present (they have bg-gray-200 class)
    const grid = container.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
    
    // Skeleton components should be rendered instead of images
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BrowserFrame 
        mockupImages={mockImages} 
        imageAlts={mockAlts}
        className="custom-class"
      />
    );

    const frame = container.querySelector('[role="region"]');
    expect(frame?.className).toContain('custom-class');
  });

  it('should have proper ARIA labels', () => {
    render(<BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />);

    const frame = screen.getByRole('region', { name: /browser mockup frame/i });
    expect(frame).toBeTruthy();
  });

  it('should render with consistent structure', () => {
    const { container } = render(
      <BrowserFrame mockupImages={mockImages} imageAlts={mockAlts} />
    );

    // Verify structure: frame > chrome > content
    const frame = container.querySelector('[role="region"]');
    expect(frame).toBeTruthy();
    
    const chrome = frame?.querySelector('.bg-gray-100.border-b');
    expect(chrome).toBeTruthy();
    
    // Content has responsive padding classes
    const content = frame?.querySelector('.bg-white');
    expect(content).toBeTruthy();
  });
});
