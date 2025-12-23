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
  const { title, subtitle } = content;
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
  const borderScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex flex-col overflow-hidden ${className}`}
    >
      {/* Animated Radial Gradient Background with Parallax - Removed as it is now global */}

      {/* Border Container covering Logo and Title with Parallax */}
      <motion.div
        className="absolute top-4 left-4 bottom-4 -right-8 md:top-12 md:left-12 md:bottom-12 md:-right-12 lg:top-16 lg:left-16 lg:bottom-16 lg:-right-16 rounded-[4rem] border-2 border-white  z-10 pointer-events-none"
        variants={ANIMATION_VARIANTS.hero}
        initial="initial"
        animate="animate"
        style={{ scale: borderScale }}
      />

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

      {/* Main Content - Right Aligned Title with Parallax */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <motion.h1
          className="w-full pr-12 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-right text-[#F8EFDE] tracking-tight leading-none font-sans"
          variants={ANIMATION_VARIANTS.hero}
          initial="initial"
          animate="animate"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          <SplitText text={title} splitBy="word" staggerDelay={0.1} />
        </motion.h1>
      </div>

      {/* Bottom Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 bg-[#F8EFDE] py-8 px-8"
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
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => trackCTA.getInTouch('hero_section')}
            className="px-8 py-4 bg-[#1a1a3e] text-[#F8EFDE] font-bold rounded-lg transition-colors hover:bg-[#2d1b4e] focus:outline-none focus:ring-2 focus:ring-[#1a1a3e] focus:ring-offset-2 font-sans"
          >
            Get in Touch
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
