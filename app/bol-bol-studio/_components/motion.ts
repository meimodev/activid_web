import type { Transition, Variants } from "framer-motion";

// Shared motion language for the Bol-bol Studio booking flow.
// Personality: playful + energetic, but smooth (no bounce/elastic easing).
// Idle loops are used sparingly — only where attention should land.
// Accessibility is handled globally by <MotionConfig reducedMotion="user">
// in BolBolStudioClient, which strips transform/layout motion for users who
// ask for reduced motion (opacity fades still play).

// ease-out-quint — confident, slightly snappy deceleration.
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Spring used for selectable tiles, day cells and primary buttons popping in.
// Snappy enough to feel lively, damped enough to avoid a dated bounce.
export const POP: Transition = { type: "spring", stiffness: 460, damping: 30, mass: 0.7 };

// Parent variant: stagger its motion children as a step becomes active.
export const stagger = (staggerChildren = 0.06, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// Child variant: fade + rise. The workhorse entrance.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// Child variant: fade + scale pop. For grid tiles, cards and buttons.
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: POP },
};

// Child variant: slide in from the left. For stacked list rows (packages).
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};
