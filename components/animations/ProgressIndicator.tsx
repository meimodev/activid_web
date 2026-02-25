'use client';

import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from '@/hooks';

export interface ProgressIndicatorProps {
  type?: 'line' | 'circle';
  position?: 'top' | 'bottom' | 'fixed';
  color?: string;
  thickness?: number;
  className?: string;
}

/**
 * ProgressIndicator component shows scroll progress as a line or circle.
 * Uses useScrollProgress hook to track scroll position.
 * For line: animates scaleX from 0 to 1
 * For circle: animates stroke-dashoffset based on progress
 */
export function ProgressIndicator({
  type = 'line',
  position = 'top',
  color = '#000000',
  thickness = 4,
  className = '',
}: ProgressIndicatorProps) {
  const scrollProgress = useScrollProgress();

  // Position classes based on position prop
  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-[60]',
    bottom: 'fixed bottom-0 left-0 right-0 z-[60]',
    fixed: 'fixed top-0 left-0 right-0 z-[60]',
  };

  if (type === 'line') {
    return (
      <div
        className={`${positionClasses[position]} ${className}`}
        style={{ height: thickness }}
      >
        <motion.div
          style={{
            scaleX: scrollProgress,
            transformOrigin: '0% 0%',
            height: '100%',
            width: '100%',
            backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  // Circle type
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  // Transform scroll progress to stroke-dashoffset
  const strokeDashoffset = useTransform(
    scrollProgress,
    [0, 1],
    [circumference, 0]
  );

  return (
    <div
      className={`${positionClasses[position]} flex items-center justify-center ${className}`}
      style={{ width: (radius * 2) + 20, height: (radius * 2) + 20 }}
    >
      <svg
        width={(radius * 2) + 10}
        height={(radius * 2) + 10}
        viewBox={`0 0 ${(radius * 2) + 10} ${(radius * 2) + 10}`}
      >
        {/* Background circle */}
        <circle
          cx={(radius * 2 + 10) / 2}
          cy={(radius * 2 + 10) / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={thickness}
        />
        {/* Progress circle */}
        <motion.circle
          cx={(radius * 2 + 10) / 2}
          cy={(radius * 2 + 10) / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
    </div>
  );
}
