'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks';
import { EASING, DURATION, STAGGER_CONFIG } from '@/lib/animation-config';

export interface SplitTextProps {
  text: string;
  splitBy?: 'word' | 'character';
  staggerDelay?: number;
  className?: string;
}

/**
 * SplitText animates text word-by-word or character-by-character.
 * Splits text into individual elements wrapped in motion.span with stagger animation.
 * Preserves spacing and line breaks for proper text rendering.
 */
export function SplitText({
  text,
  splitBy = 'word',
  staggerDelay = 0.1,
  className,
}: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();

  // Split text based on splitBy prop
  const splitText = (text: string, splitBy: 'word' | 'character'): string[] => {
    if (splitBy === 'word') {
      // Split by words while preserving spaces
      return text.split(/(\s+)/);
    } else {
      // Split by characters
      return text.split('');
    }
  };

  const elements = splitText(text, splitBy);

  // Container variant with stagger
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // Item variants for each word/character
  const itemVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: DURATION.normal,
            ease: EASING.easeOutExpo,
          },
        },
      };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      style={{ display: 'inline-block' }}
    >
      {elements.map((element, index) => {
        // Preserve whitespace elements without animation
        if (/^\s+$/.test(element)) {
          return (
            <span key={`space-${index}`} style={{ whiteSpace: 'pre' }}>
              {element}
            </span>
          );
        }

        return (
          <motion.span
            key={`${splitBy}-${index}`}
            variants={itemVariants}
            style={{ display: 'inline-block' }}
          >
            {element}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
