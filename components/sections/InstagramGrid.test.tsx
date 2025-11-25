import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InstagramGrid } from './InstagramGrid';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ 
    src, 
    alt, 
    fill, 
    sizes, 
    className, 
    loading 
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    loading?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      className={className}
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      data-loading={loading}
    />
  ),
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: () => false,
}));

describe('InstagramGrid', () => {
  const mockImages = Array.from({ length: 9 }, (_, i) => `https://example.com/image${i}.jpg`);
  const mockAlts = Array.from({ length: 9 }, (_, i) => `Image ${i} alt text`);

  it('renders a 3x3 grid with 9 cells', () => {
    const { container } = render(
      <InstagramGrid images={mockImages} alts={mockAlts} />
    );

    const gridCells = container.querySelectorAll('[role="gridcell"]');
    expect(gridCells).toHaveLength(9);
  });

  it('renders images when not loading', () => {
    const { container } = render(
      <InstagramGrid images={mockImages} alts={mockAlts} isLoading={false} />
    );

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(9);
  });

  it('renders skeletons when loading', () => {
    const { container } = render(
      <InstagramGrid images={mockImages} alts={mockAlts} isLoading={true} />
    );

    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons).toHaveLength(9);
    
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(0);
  });

  it('uses placeholder for missing images', () => {
    const shortImages = ['https://example.com/image1.jpg'];
    const shortAlts = ['Image 1'];
    
    const { container } = render(
      <InstagramGrid images={shortImages} alts={shortAlts} isLoading={false} />
    );

    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(9);
    
    // First image should use provided URL
    expect(images[0].getAttribute('src')).toBe(shortImages[0]);
    
    // Remaining images should use placeholder
    expect(images[1].getAttribute('src')).toBe('/placeholder-image.jpg');
  });

  it('has accessible grid structure', () => {
    render(<InstagramGrid images={mockImages} alts={mockAlts} />);

    const grid = screen.getByRole('grid', { name: /instagram-style project mockup grid/i });
    expect(grid).toBeInTheDocument();
  });

  it('applies lazy loading to images', () => {
    const { container } = render(
      <InstagramGrid images={mockImages} alts={mockAlts} isLoading={false} />
    );

    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.getAttribute('data-loading')).toBe('lazy');
    });
  });

  it('configures responsive image sizes', () => {
    const { container } = render(
      <InstagramGrid images={mockImages} alts={mockAlts} isLoading={false} />
    );

    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      const sizes = img.getAttribute('data-sizes');
      expect(sizes).toBeTruthy();
      expect(sizes).toContain('vw');
    });
  });
});
