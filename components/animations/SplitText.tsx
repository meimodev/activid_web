'use client';

import { motion } from 'framer-motion';
import { useReducedMotion, useWindowSize } from '@/hooks';
import { EASING, DURATION } from '@/lib/animation-config';

export interface SplitTextProps {
  text: string;
  splitBy?: 'word' | 'character';
  staggerDelay?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  margin?: string;
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
  delay = 0,
  duration = DURATION.normal,
  once = false,
  threshold = 0.12,
  margin = '20% 0px 20% 0px',
  className,
}: SplitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useWindowSize();

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
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Item variants for each word/character
  const y = prefersReducedMotion ? 0 : isMobile ? 12 : 20;
  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: EASING.easeOutExpo,
          },
        },
      };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: threshold, margin }}
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
