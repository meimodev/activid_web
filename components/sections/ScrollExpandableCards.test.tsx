import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollExpandableCards, CardData } from './ScrollExpandableCards';

describe('ScrollExpandableCards - Edge Cases', () => {
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    global.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
    } as any;

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

    const { container } = render(<ScrollExpandableCards cards={singleCard} />);

    // Should render the card
    expect(screen.getByText('Single Card')).toBeInTheDocument();

    // Should have the image
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('should handle empty cards array', () => {
    const { container } = render(<ScrollExpandableCards cards={[]} />);

    // Should render without crashing
    expect(container).toBeInTheDocument();

    // Should not have any cards
    const cards = container.querySelectorAll('[class*="space-y-4"] > div');
    expect(cards.length).toBe(0);
  });

  it('should release scroll at first card when scrolling up', () => {
    const cards: CardData[] = [
      {
        id: '1',
        title: 'Card 1',
        description: 'Description 1',
        image: '/test1.jpg',
        imageAlt: 'Test 1',
      },
      {
        id: '2',
        title: 'Card 2',
        description: 'Description 2',
        image: '/test2.jpg',
        imageAlt: 'Test 2',
      },
    ];

    render(<ScrollExpandableCards cards={cards} />);

    // Lock scroll
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      target: document.createElement('div'),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    observerCallback([mockEntry], {} as IntersectionObserver);

    // Verify scroll is locked
    expect(document.body.style.overflow).toBe('hidden');

    // Scroll up at first card (should release)
    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -150,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(wheelEvent);

    // Scroll should be released
    expect(document.body.style.overflow).toBe('');
  });

  it('should release scroll at last card when scrolling down', () => {
    const cards: CardData[] = [
      {
        id: '1',
        title: 'Card 1',
        description: 'Description 1',
        image: '/test1.jpg',
        imageAlt: 'Test 1',
      },
      {
        id: '2',
        title: 'Card 2',
        description: 'Description 2',
        image: '/test2.jpg',
        imageAlt: 'Test 2',
      },
    ];

    render(<ScrollExpandableCards cards={cards} />);

    // Lock scroll
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      target: document.createElement('div'),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    observerCallback([mockEntry], {} as IntersectionObserver);

    // Navigate to last card
    const scrollDown1 = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(scrollDown1);

    // Now at last card, scroll down again (should release)
    const scrollDown2 = new WheelEvent('wheel', {
      deltaY: 100,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(scrollDown2);

    // Scroll should be released
    expect(document.body.style.overflow).toBe('');
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
      <ScrollExpandableCards cards={cards} className="custom-class" />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('custom-class');
  });

  it('should clean up on unmount', () => {
    const cards: CardData[] = [
      {
        id: '1',
        title: 'Card 1',
        description: 'Description 1',
        image: '/test1.jpg',
        imageAlt: 'Test 1',
      },
    ];

    const { unmount } = render(<ScrollExpandableCards cards={cards} />);

    // Lock scroll
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      target: document.createElement('div'),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    observerCallback([mockEntry], {} as IntersectionObserver);

    expect(document.body.style.overflow).toBe('hidden');

    // Unmount
    unmount();

    // Scroll should be restored
    expect(document.body.style.overflow).toBe('');
  });

  it('should handle rapid scroll events', () => {
    const cards: CardData[] = [
      {
        id: '1',
        title: 'Card 1',
        description: 'Description 1',
        image: '/test1.jpg',
        imageAlt: 'Test 1',
      },
      {
        id: '2',
        title: 'Card 2',
        description: 'Description 2',
        image: '/test2.jpg',
        imageAlt: 'Test 2',
      },
      {
        id: '3',
        title: 'Card 3',
        description: 'Description 3',
        image: '/test3.jpg',
        imageAlt: 'Test 3',
      },
    ];

    render(<ScrollExpandableCards cards={cards} />);

    // Lock scroll
    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 0.5,
      target: document.createElement('div'),
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    observerCallback([mockEntry], {} as IntersectionObserver);

    // Rapid scroll events (should accumulate)
    for (let i = 0; i < 5; i++) {
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: 25, // Small increments
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(wheelEvent);
    }

    // Should still be locked (accumulated 125px, threshold is 100px)
    expect(document.body.style.overflow).toBe('hidden');
  });
});
