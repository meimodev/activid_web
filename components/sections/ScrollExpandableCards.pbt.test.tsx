import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import { ScrollExpandableCards } from './ScrollExpandableCards';

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

describe('Property: ScrollExpandableCards grid rendering', () => {
  it('should render one card container per input card', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            title: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.string({ minLength: 1, maxLength: 200 }),
            image: fc.webUrl(),
            imageAlt: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (cards) => {
          const { container } = render(
            <ScrollExpandableCards cards={cards} title="Services" />
          );

          const cardElements = container.querySelectorAll('.group');
          return cardElements.length === cards.length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
