"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import type { Host } from "@/types/invitation";
import { SectionOrnament, DiamondAccent } from "./graphics/ornaments";

// Using a placeholder image with a more elegant, warm tone
// const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string | null;
  isOpen?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      when: "afterChildren",
      duration: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

export function Hero({ onOpen, hosts, date, subtitle, coverImage, guestName, isOpen = false }: HeroProps) {
  const [isExiting, setIsExiting] = useState(false);

  const primaryName = hosts[0]?.shortName ?? "";
  const secondaryName = hosts[1]?.shortName ?? "";
  const displayNames = secondaryName ? `${primaryName} & ${secondaryName}` : primaryName;

  const handleOpen = () => {
    setIsExiting(true);
    // Delay calling onOpen to allow the exit animations to play out.
    // Based on the stagger (0.1) and item duration (0.5), 1000ms is a safe delay.
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  // If already opened via external state, we don't render the hero content
  if (isOpen && !isExiting) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-dark">
      {/* Background Image with animated scale */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 1.5, ease: "easeInOut" } }}
            transition={{
              scale: {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              },
              opacity: { duration: 1 }
            }}
          >
            <div className="absolute inset-0 bg-wedding-dark/45" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isExiting && (
          <motion.div 
            className="relative z-10 flex flex-col items-center justify-center h-full text-wedding-on-dark text-center px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="mb-8 relative z-10 w-full flex flex-col items-center">
              <motion.div variants={itemVariants} className="mb-4">
                 <DiamondAccent />
              </motion.div>

              <motion.div variants={itemVariants}>
                <span className="font-garet-book text-lg tracking-[0.4em] uppercase mb-6 block text-wedding-on-dark/80">
                  {subtitle}
                </span>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h1 className="font-brittany-signature text-7xl mb-4 text-wedding-on-dark drop-shadow-2xl opacity-90 px-4 leading-[1.08] py-1">
                  {displayNames}
                </h1>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6 w-3/4 max-w-xs">
                 <SectionOrnament />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="font-garet-book font-bold text-xl tracking-[0.2em] text-wedding-accent-light border-y border-wedding-on-dark/20 py-4 inline-block px-12 backdrop-blur-xs bg-black/10">
                  {date}
                </p>
              </motion.div>

              {guestName && (
                <motion.div variants={itemVariants} className="mt-4 flex flex-col items-center">
                  <div className="flex flex-col items-center">
                    <p className="font-stoic text-sm tracking-[0.1em] text-wedding-on-dark/60 mb-2">
                      Kepada Yth.
                    </p>
                    <p className="font-poppins-bold text-lg tracking-widest text-wedding-on-dark px-8 py-2 border border-wedding-on-dark/20 rounded-sm bg-wedding-on-dark/5 backdrop-blur-sm">
                      {guestName}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="mt-4 px-12 py-4 border border-wedding-on-dark/30 bg-wedding-on-dark/5 backdrop-blur-md rounded-sm 
      font-garet-book uppercase tracking-[0.3em] text-xs text-wedding-on-dark/90 hover:bg-wedding-on-dark hover:text-wedding-dark 
      transition-colors duration-700 group relative overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-wedding-on-dark/10"
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10 group-hover:mr-2 transition-all">
                Buka Undangan
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative overlaid texture/noise could go here */}
    </div>
  );
}
