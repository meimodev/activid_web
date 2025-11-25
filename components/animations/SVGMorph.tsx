'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks';

export interface SVGMorphProps {
  pathFrom: string;
  pathTo: string;
  className?: string;
  svgClassName?: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * SVGMorph component animates SVG path data based on scroll progress.
 * Uses useTransform with path interpolation tied to scroll position.
 * Morphs between two path definitions as user scrolls through the element.
 * 
 * Requirements: 3.7
 */
export function SVGMorph({
  pathFrom,
  pathTo,
  className,
  svgClassName,
  viewBox = '0 0 100 100',
  fill = 'currentColor',
  stroke = 'none',
  strokeWidth = 0,
}: SVGMorphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Interpolate between path definitions based on scroll progress
  // Note: For proper path morphing, both paths should have the same number of points
  const pathData = useTransform(scrollYProgress, [0, 1], [pathFrom, pathTo]);

  // If reduced motion is preferred, show final path
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        <svg viewBox={viewBox} className={svgClassName}>
          <path d={pathTo} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <svg viewBox={viewBox} className={svgClassName}>
        <motion.path
          d={pathData}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ willChange: 'd' }}
        />
      </svg>
    </div>
  );
}
