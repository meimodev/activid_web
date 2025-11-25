export type EasingFunction = number[];

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export type AnimationDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';

export interface AnimationVariant {
  initial: Record<string, number | string>;
  animate: Record<string, number | string | { transition?: any }>;
  exit?: Record<string, number | string>;
}

export interface ScrollAnimationConfig {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  amount?: 'some' | 'all' | number;
}

export interface ParallaxConfig {
  speed: number;
  direction: 'vertical' | 'horizontal';
}

export interface MagneticConfig {
  strength: number;
  springConfig: {
    stiffness: number;
    damping: number;
  };
}
