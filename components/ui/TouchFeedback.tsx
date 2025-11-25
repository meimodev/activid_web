'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Props for TouchFeedback component
 */
export interface TouchFeedbackProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Scale factor on touch (default: 0.95)
   */
  scaleOnTouch?: number;
  /**
   * Opacity on touch (default: 0.8)
   */
  opacityOnTouch?: number;
  /**
   * Duration of feedback animation in seconds (default: 0.15)
   */
  duration?: number;
  /**
   * Callback when touch starts
   */
  onTouchStart?: () => void;
  /**
   * Callback when touch ends
   */
  onTouchEnd?: () => void;
}

/**
 * TouchFeedback component provides haptic-style visual feedback for touch interactions.
 * Applies scale and opacity animations on touch events for mobile devices.
 * 
 * Requirements: 6.5
 */
export function TouchFeedback({
  children,
  className = '',
  scaleOnTouch = 0.95,
  opacityOnTouch = 0.8,
  duration = 0.15,
  onTouchStart,
  onTouchEnd,
}: TouchFeedbackProps) {
  const [isTouching, setIsTouching] = useState(false);

  const handleTouchStart = () => {
    setIsTouching(true);
    onTouchStart?.();
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    onTouchEnd?.();
  };

  return (
    <motion.div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      animate={{
        scale: isTouching ? scaleOnTouch : 1,
        opacity: isTouching ? opacityOnTouch : 1,
      }}
      transition={{
        duration,
        ease: 'easeOut',
      }}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hook to detect if device supports touch
 */
export function useTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE specific
    navigator.msMaxTouchPoints > 0
  );
}
