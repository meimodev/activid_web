"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Host } from "@/types/invitation";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({
  onOpen,
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
}: HeroProps) {
  const primary = hosts[0];
  const secondary = hosts[1];

  const [isOpening, setIsOpening] = useState(false);
  const [scale, setScale] = useState(1);
  const openTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      if (currentHeight < 800) {
        setScale(Math.max(0.7, currentHeight / 800));
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        staggerDirection: -1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: revealEase },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(4px)",
      transition: { duration: 0.8, ease: revealEase },
    },
  } as const;

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  const displayGuest = guestName?.trim() || "NAMA TAMU";
  const heading = subtitle?.trim() || "The Wedding of";
  const primaryName = primary?.shortName || primary?.firstName || "";
  const secondaryName = secondary?.shortName || secondary?.firstName || "";

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Cinematic Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={isOpening ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ 
          scale: { duration: 20, ease: "easeOut" },
          opacity: { duration: 2, ease: "easeOut" }
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
        {/* Elegant Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </motion.div>

      {/* Elegant Thin Frame */}
      <motion.div 
        className="absolute inset-5 sm:inset-7 md:inset-9 border-[0.5px] border-white/20 z-10 pointer-events-none rounded-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isOpening ? { opacity: 0, scale: 1.05 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: revealEase, delay: 0.5 }}
      >
        <div className="absolute inset-2 border-[0.5px] border-white/10 rounded-sm" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-between py-24 px-8 text-center">
        
        {/* Top: Names and Title */}
        <motion.div
          style={{ scale }}
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="w-full flex flex-col items-center pt-8"
        >
          <motion.p variants={itemVariants} className="font-garet-book text-[11px] tracking-[0.4em] text-white/70 uppercase mb-6">
            {heading}
          </motion.p>
          
          <motion.div variants={itemVariants} className="relative flex flex-col items-center">
            <h1 className="font-tan-mon-cheri text-5xl md:text-6xl text-white/95 tracking-wide drop-shadow-2xl">
              {primaryName}
            </h1>
            {secondaryName && (
              <>
                <div className="my-3 font-great-vibes text-4xl text-wedding-accent-light opacity-90">
                  &
                </div>
                <h1 className="font-tan-mon-cheri text-5xl md:text-6xl text-white/95 tracking-wide drop-shadow-2xl">
                  {secondaryName}
                </h1>
              </>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center gap-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-wedding-accent-light/60" />
            <p className="font-garet-book text-sm tracking-[0.25em] text-wedding-accent-light">
              {date}
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-wedding-accent-light/60" />
          </motion.div>
        </motion.div>

        {/* Bottom: Guest Info and Button inside Glassmorphic Panel */}
        <motion.div
          style={{ scale }}
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="w-full max-w-sm pb-4"
        >
          <motion.div 
            variants={itemVariants} 
            className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <p className="font-poppins text-[10px] text-white/50 uppercase tracking-[0.3em] mb-3">
              Kepada Yth.
            </p>
            <p className="font-stoic text-2xl text-white mb-8 drop-shadow-md">
              {displayGuest}
            </p>
            
            <motion.button
              whileHover={isOpening ? {} : { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              whileTap={isOpening ? {} : { scale: 0.98 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="w-full relative overflow-hidden rounded-full bg-white px-8 py-3.5 transition-all duration-500 disabled:opacity-70 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 font-garet-book text-xs font-bold tracking-[0.2em] uppercase text-black">
                Buka Undangan
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
