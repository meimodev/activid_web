'use client';

import { motion, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks';

export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // Magnetic pull strength (0-1)
  className?: string;
  onClick?: () => void;
}

/**
 * MagneticButton creates a magnetic hover effect where the button follows the cursor.
 * Tracks mouse position relative to button center and applies spring physics.
 * Resets position when mouse leaves the button area.
 */
export function MagneticButton({
  children,
  strength = 0.5,
  className,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Spring physics for smooth, natural movement
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  // Add will-change optimization when hovering
  // Requirements: 1.2 - Apply will-change to animated elements
  useEffect(() => {
    if (ref.current) {
      ref.current.style.willChange = isHovered ? 'transform' : 'auto';
    }
  }, [isHovered]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    // Apply strength multiplier to control magnetic pull
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset position with spring animation
    x.set(0);
    y.set(0);
  };

  // If reduced motion is preferred, render static button
  if (prefersReducedMotion) {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
      }}
    >
      {children}
    </motion.button>
  );
}
