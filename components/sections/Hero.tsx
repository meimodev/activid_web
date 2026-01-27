'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SplitText } from '@/components/animations/SplitText';
import { ANIMATION_VARIANTS } from '@/lib/animation-config';
import type { HeroContent } from '@/types/hero.types';
import { trackCTA } from '@/lib/analytics';

export interface HeroProps {
  content: HeroContent;
  className?: string;
}

/**
 * Hero section component with portfolio-style design.
 * Features:
 * - Large centered title
 * - Gradient background (navy to purple/red)
 * - Logo in top left
 * - Bottom info section with company name and year
 */
export function Hero({ content, className = '' }: HeroProps) {
  const { title, subtitle, backgroundVideo } = content;
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax effect setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress to parallax values
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {/* Animated Radial Gradient Orbs */}
      {content.gradientOrbs && content.gradientOrbs.count > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: content.gradientOrbs.count }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-screen blur-3xl opacity-30"
              style={{
                background: `radial-gradient(circle, ${content.gradientOrbs?.colors[i % content.gradientOrbs.colors.length]} 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '40vw',
                height: '40vw',
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Background - Video or Gradient */}
      {backgroundVideo ? (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/20 to-[#1a1a3e]/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a3e]/80 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a3e] to-[#2d1b4e]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
      )}

      {/* Logo with Parallax */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ scale: logoScale, opacity: logoOpacity }}
        className="absolute top-16 left-16 md:top-20 md:left-20 lg:top-24 lg:left-24 z-20"
      >
        <div className="w-32 h-32 relative">
          <Image
            src="https://ik.imagekit.io/geb6bfhmhx/activid%20web/0_LOGO_WHITE.PNG"
            alt="Activid Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Bottom Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 bg-[#F8EFDE] py-8 px-8 mt-auto"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="text-4xl md:text-6xl font-black text-[#1a1a3e] font-sans">
              {new Date().getFullYear()}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1a1a3e] mb-1 font-sans">
                {subtitle}
              </h2>
              <p className="text-sm md:text-base text-[#1a1a3e]/70 font-sans">
                Creative Agency | Manado - Tondano
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>

  );
}
