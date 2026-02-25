'use client';

import { motion } from 'framer-motion';
import { EASING, DURATION } from '@/lib/animation-config';

export interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
}

/**
 * StaggerChildren component applies stagger animation to child elements automatically.
 * Each child element animates with an incremental delay from the previous child.
 * Respects reduced motion preferences by simplifying animations.
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  id,
}: StaggerChildrenProps) {

  // Container variant with configurable stagger delay
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // Item variants for child elements
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.normal,
        ease: EASING.easeOutExpo,
      },
    },
  } as const;

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      id={id}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
