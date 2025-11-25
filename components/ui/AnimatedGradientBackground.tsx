'use client';

import { motion, MotionStyle } from 'framer-motion';

export interface AnimatedGradientBackgroundProps {
  className?: string;
  style?: MotionStyle;
}

export function AnimatedGradientBackground({ className = '', style }: AnimatedGradientBackgroundProps) {
  return (
    <motion.div 
      className={`inset-0 bg-[#1a1d3a] ${className}`}
      style={style}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #3d2645 0%, #1a1d3a 50%, #6b2737 100%)',
            'radial-gradient(circle at 40% 60%, #4a2d52 0%, #2a2548 50%, #5d2f42 100%)',
            'radial-gradient(circle at 60% 70%, #6b2737 0%, #3d2645 50%, #1a1d3a 100%)',
            'radial-gradient(circle at 80% 50%, #5d2f42 0%, #4a2d52 50%, #2a2548 100%)',
            'radial-gradient(circle at 70% 30%, #3d2645 0%, #6b2737 50%, #1a1d3a 100%)',
            'radial-gradient(circle at 50% 20%, #2a2548 0%, #4a2d52 50%, #5d2f42 100%)',
            'radial-gradient(circle at 30% 30%, #1a1d3a 0%, #3d2645 50%, #6b2737 100%)',
            'radial-gradient(circle at 20% 50%, #3d2645 0%, #1a1d3a 50%, #6b2737 100%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />
      {/* Overlay gradient for depth */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 70% 30%, rgba(107, 39, 55, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 50% 50%, rgba(74, 45, 82, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 30% 70%, rgba(61, 38, 69, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 40% 40%, rgba(93, 47, 66, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 60% 60%, rgba(26, 29, 58, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 80% 50%, rgba(107, 39, 55, 0.3) 0%, transparent 60%)',
            'radial-gradient(ellipse at 70% 30%, rgba(107, 39, 55, 0.3) 0%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.42, 0, 0.58, 1],
        }}
      />
    </motion.div>
  );
}
