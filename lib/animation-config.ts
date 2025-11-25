export const EASING = {
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutQuint: [0.86, 0, 0.07, 1],
  spring: [0.37, 1.61, 0.58, 0.89],
} as const;

export const DURATION = {
  instant: 0.1,
  fast: 0.25,
  normal: 0.5,
  slow: 1.0,
  slower: 2.0,
} as const;

export const ANIMATION_VARIANTS = {
  fadeUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  hero: {
    initial: { opacity: 0, scale: 0.8, rotateX: -15 },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: EASING.easeOutExpo,
      },
    },
  },
} as const;

export const STAGGER_CONFIG = {
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

/**
 * Responsive animation variants for mobile and desktop
 * Mobile variants have reduced distances and scales for better performance
 */
export const RESPONSIVE_VARIANTS = {
  mobile: {
    fadeUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },
    fadeDown: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
    },
    fadeLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 50 },
    },
    fadeRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    hero: {
      initial: { opacity: 0, scale: 0.9, rotateX: -10 },
      animate: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: 1.0,
          ease: EASING.easeOutExpo,
        },
      },
    },
  },
  desktop: {
    fadeUp: {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -100 },
    },
    fadeDown: {
      initial: { opacity: 0, y: -100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
    },
    fadeLeft: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    fadeRight: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    hero: {
      initial: { opacity: 0, scale: 0.8, rotateX: -15 },
      animate: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: 1.2,
          ease: EASING.easeOutExpo,
        },
      },
    },
  },
} as const;
