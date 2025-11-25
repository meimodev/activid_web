'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface LiquidButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  className?: string;
}

/**
 * LiquidButton component with morphing effect on interaction
 * Requirement 4.6: Buttons should apply liquid morphing effect on interaction
 */
export function LiquidButton({
  children,
  className = '',
  ...props
}: LiquidButtonProps) {
  return (
    <motion.button
      className={`relative overflow-hidden px-8 py-4 rounded-full bg-blue-500 text-white font-medium ${className}`}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {/* Liquid morphing background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"
        initial={{ borderRadius: '100%' }}
        whileHover={{
          borderRadius: ['100%', '60% 40% 30% 70%/60% 30% 70% 40%', '30% 60% 70% 40%/50% 60% 30% 60%'],
          scale: [1, 1.2, 1.1],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
