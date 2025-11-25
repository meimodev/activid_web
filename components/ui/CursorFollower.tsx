'use client';

import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useEffect, useState } from 'react';

interface CursorFollowerProps {
  size?: number;
  blur?: number;
  color?: string;
  opacity?: number;
  hideDefaultCursor?: boolean;
}

/**
 * CursorFollower component creates a custom cursor that follows mouse movement
 * Requirement 4.5: Custom cursor follower should track mouse position with blur effect
 */
export function CursorFollower({
  size = 40,
  blur = 20,
  color = 'rgba(59, 130, 246, 0.5)',
  opacity = 0.6,
  hideDefaultCursor = true,
}: CursorFollowerProps) {
  const mousePosition = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show cursor after mount to avoid SSR issues
    setIsVisible(true);

    // Hide default cursor if requested
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    return () => {
      if (hideDefaultCursor) {
        document.body.style.cursor = 'auto';
      }
    };
  }, [hideDefaultCursor]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] rounded-full mix-blend-difference"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        filter: `blur(${blur}px)`,
        opacity,
        left: -size / 2,
        top: -size / 2,
      }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    />
  );
}
