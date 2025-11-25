'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface InteractiveHoverProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  scale?: number;
  rotation?: number;
  duration?: number;
  className?: string;
}

/**
 * InteractiveHover component applies scale and rotation transformations on hover
 * Requirement 4.2: Interactive elements should respond with scale and rotation within 250ms
 */
export function InteractiveHover({
  children,
  scale = 1.05,
  rotation = 2,
  duration = 0.25,
  className = '',
  ...props
}: InteractiveHoverProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale,
        rotate: rotation,
      }}
      transition={{
        duration,
        ease: 'easeOut',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
