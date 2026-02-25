import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  HeroSkeleton,
  FeaturesSkeleton,
  CardSkeleton,
  GridSkeleton,
  FormSkeleton,
} from './Skeleton';

describe('Skeleton', () => {
  it('should render with default props', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeTruthy();
    expect(skeleton.className).toContain('bg-gray-200');
  });

  it('should apply rectangular variant by default', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain('rounded-md');
  });

  it('should apply circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain('rounded-full');
  });

  it('should apply text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain('rounded');
  });

  it('should apply custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={100} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
    expect(skeleton.style.height).toBe('100px');
  });

  it('should apply string width and height', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe('50%');
    expect(skeleton.style.height).toBe('2rem');
  });

  it('should apply custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.className).toContain('custom-class');
  });
});

describe('HeroSkeleton', () => {
  it('should render hero skeleton structure', () => {
    const { container } = render(<HeroSkeleton />);
    expect(container.querySelector('.min-h-screen')).toBeTruthy();
    // Should have multiple skeleton elements
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(3);
  });
});

describe('FeaturesSkeleton', () => {
  it('should render features skeleton with grid', () => {
    const { container } = render(<FeaturesSkeleton />);
    expect(container.querySelector('.grid')).toBeTruthy();
    // Should have 3 feature cards
    const cards = container.querySelectorAll('.space-y-4');
    expect(cards.length).toBe(3);
  });
});

describe('CardSkeleton', () => {
  it('should render card skeleton structure', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.querySelector('.border')).toBeTruthy();
    expect(container.querySelector('.rounded-lg')).toBeTruthy();
  });
});

describe('GridSkeleton', () => {
  it('should render default 6 cards', () => {
    const { container } = render(<GridSkeleton />);
    const cards = container.querySelectorAll('.border');
    expect(cards.length).toBe(6);
  });

  it('should render custom count of cards', () => {
    const { container } = render(<GridSkeleton count={4} />);
    const cards = container.querySelectorAll('.border');
    expect(cards.length).toBe(4);
  });
});

describe('FormSkeleton', () => {
  it('should render form skeleton structure', () => {
    const { container } = render(<FormSkeleton />);
    expect(container.querySelector('.max-w-2xl')).toBeTruthy();
    const skeletons = container.querySelectorAll('.bg-gray-200');
    expect(skeletons.length).toBeGreaterThan(3);
  });
});
