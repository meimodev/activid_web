import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollExpandableCards, CardData } from './ScrollExpandableCards';

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/lib/analytics', () => ({
  trackService: {
    viewService: vi.fn(),
  },
}));

describe('ScrollExpandableCards - Edge Cases', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('should handle single card gracefully', () => {
    const singleCard: CardData[] = [
      {
        id: 'single',
        title: 'Single Card',
        description: 'This is the only card',
        image: '/test.jpg',
        imageAlt: 'Test image',
      },
    ];

    const { container } = render(
      <ScrollExpandableCards cards={singleCard} title="Services" />
    );

    // Should render the card
    expect(screen.getByText('Single Card')).toBeInTheDocument();

    // Should have the image
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('should handle empty cards array', () => {
    const { container } = render(
      <ScrollExpandableCards cards={[]} title="Services" />
    );

    // Should render without crashing
    expect(container).toBeInTheDocument();

    // Should not have any cards
    const cardElements = container.querySelectorAll('.group');
    expect(cardElements.length).toBe(0);
  });

  it('should render with custom className', () => {
    const cards: CardData[] = [
      {
        id: '1',
        title: 'Card 1',
        description: 'Description 1',
        image: '/test1.jpg',
        imageAlt: 'Test 1',
      },
    ];

    const { container } = render(
      <ScrollExpandableCards cards={cards} title="Services" className="custom-class" />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('custom-class');
  });

  
});
