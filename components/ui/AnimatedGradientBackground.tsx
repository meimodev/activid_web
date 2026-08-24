'use client';

import { motion, MotionStyle, useReducedMotion } from 'framer-motion';

export interface AnimatedGradientBackgroundProps {
  className?: string;
  style?: MotionStyle;
}

/**
 * Full-bleed animated backdrop.
 *
 * The drift comes from three blurred orbs moved with `transform` — a
 * compositor-only property, so the animation costs no main-thread work no
 * matter how large the element is. The previous version interpolated the
 * `background` shorthand (a `radial-gradient(...)` string) on two stacked
 * full-viewport layers: gradients are not compositable, so every frame of a
 * permanent 12s loop repainted the whole viewport on the main thread.
 *
 * The base gradient underneath is static — it carries the colour, the orbs
 * carry the motion.
 */
export function AnimatedGradientBackground({ className = '', style }: AnimatedGradientBackgroundProps) {
  const reduceMotion = useReducedMotion();

  const orbs = [
    {
      className: 'left-[-15%] top-[-10%] h-[70vmax] w-[70vmax] bg-[#3d2645]',
      animate: { x: ['0%', '18%', '-6%', '0%'], y: ['0%', '12%', '22%', '0%'], scale: [1, 1.12, 0.96, 1] },
      duration: 24,
    },
    {
      className: 'right-[-20%] top-[10%] h-[65vmax] w-[65vmax] bg-[#6b2737]',
      animate: { x: ['0%', '-14%', '8%', '0%'], y: ['0%', '18%', '-10%', '0%'], scale: [1, 0.94, 1.1, 1] },
      duration: 30,
    },
    {
      className: 'bottom-[-25%] left-[20%] h-[60vmax] w-[60vmax] bg-[#4a2d52]',
      animate: { x: ['0%', '12%', '-16%', '0%'], y: ['0%', '-14%', '6%', '0%'], scale: [1, 1.08, 0.92, 1] },
      duration: 27,
    },
  ];

  return (
    <motion.div
      className={`inset-0 overflow-hidden bg-[#1a1d3a] ${className}`}
      style={style}
    >
      {/* Static base — same palette the old keyframe list cycled through. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#3d2645_0%,#1a1d3a_50%,#6b2737_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(107,39,55,0.3)_0%,transparent_60%)]" />

      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`absolute rounded-full opacity-40 blur-[90px] ${orb.className}`}
          animate={reduceMotion ? undefined : orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{ willChange: reduceMotion ? undefined : 'transform' }}
        />
      ))}

      {/* Depth wash over the orbs so they read as one field, not three blobs. */}
      <div className="absolute inset-0 bg-[#1a1d3a]/25" />
    </motion.div>
  );
}
