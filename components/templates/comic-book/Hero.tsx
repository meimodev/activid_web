"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import type { Host } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: revealEase, when: "afterChildren", staggerChildren: 0.1, staggerDirection: -1 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: revealEase, when: "beforeChildren", staggerChildren: 0.1 } 
  },
  exit: { 
    opacity: 0,
    x: 60,
    transition: { duration: 0.4, ease: revealEase, when: "afterChildren", staggerChildren: 0.1, staggerDirection: -1 } 
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: revealEase } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: revealEase } },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: revealEase } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: revealEase } },
};

const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.7, type: "spring", bounce: 0.4 } },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: revealEase } },
};

export function Hero({
  onOpen,
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
}: HeroProps) {
  const assets = useOverlayAssets();
  const [isOpening, setIsOpening] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  const celebrant = hosts[0];
  const celebrantName =
    celebrant?.shortName || celebrant?.firstName || "Birthday Star";
  const displayGuest = guestName?.trim() || "Teman Hebat";
  const displaySubtitle = subtitle?.trim() || "Pesta Ulang Tahun";

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg max-w-[610px]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, var(--invitation-dark) 0%, var(--invitation-bg) 100%)`,
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      />

      <motion.div
        aria-hidden
        className="absolute left-10 top-20"
        animate={isOpening ? { opacity: 0, x: -20 } : { y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={isOpening ? { duration: 0.45, delay: 1.0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.heroGraphic} alt="" className="w-24 h-auto opacity-70" />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute right-8 top-32"
        animate={isOpening ? { opacity: 0, x: 20 } : { y: [0, 14, 0], rotate: [0, -8, 0] }}
        transition={isOpening ? { duration: 0.45, delay: 1.0 } : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <img src={assets.floatingPlanet1} alt="" className="w-32 h-auto opacity-60" />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute left-6 bottom-40"
        animate={isOpening ? { opacity: 0, y: 20 } : { y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={isOpening ? { duration: 0.45, delay: 1.0 } : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <img src={assets.floatingPlanet2} alt="" className="w-20 h-auto opacity-55" />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute right-6 bottom-28"
        animate={isOpening ? { opacity: 0, y: 20 } : { y: [0, 8, 0], rotate: [0, -6, 0] }}
        transition={isOpening ? { duration: 0.45, delay: 1.0 } : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <img src={assets.moonOrbiter} alt="" className="w-16 h-auto opacity-60" />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-[15%] h-40 overflow-hidden opacity-25"
        animate={isOpening ? { opacity: 0 } : { x: ["-10%", "10%", "-10%"] }}
        transition={isOpening ? { duration: 0.45, delay: 1.0 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: `url(${assets.spaceDust})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat-x",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${assets.constellation})`,
          backgroundSize: "120% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <motion.div
        aria-hidden
        className="absolute left-4 top-1/3"
        animate={isOpening ? { opacity: 0, x: -30 } : { y: [0, -20, 0], x: [0, 15, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={isOpening ? { duration: 0.5, delay: 1.0 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.shootingElement} alt="" className="w-40 h-auto opacity-50 rotate-12" />
      </motion.div>

      <div className="relative z-10 mx-auto flex h-screen w-full max-w-[520px] flex-col items-center justify-center overflow-x-hidden">
        <div className="relative w-[110%] -ml-[5%]">
          {/* Chaotic Solid Shadow */}
          <motion.div 
            className="absolute inset-0 bg-black translate-y-[12px] rotate-[1.5deg] z-0" 
            animate={isOpening ? { opacity: 0 } : {}}
            transition={{ duration: 0.3, delay: isOpening ? 1.0 : 0 }}
          />

          <AnimatePresence>
            {!isOpening && (
              <motion.div
                className="relative z-10 w-full border-y-[6px] border-black bg-white flex flex-col overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
            {/* ROW 1: TITLE (SUBTITLE) PANEL */}
            <motion.div variants={rowVariants} className="relative w-full px-6 py-8 bg-white bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:16px_16px] flex flex-col items-center justify-center z-10">
              <motion.div variants={textVariants}>
                <div className="relative inline-flex items-center justify-center px-12 py-6 -rotate-2">
                  <svg className="absolute inset-0 w-full h-full text-wedding-accent overflow-visible" style={{ filter: 'drop-shadow(5px 5px 0 black)' }} viewBox="0 0 100 100" preserveAspectRatio="none">
                     <polygon points="15,0 25,20 45,5 55,20 85,0 75,30 100,25 80,45 100,65 75,65 90,100 60,80 40,95 30,80 5,100 20,65 0,55 20,45 0,25 20,30" fill="currentColor" stroke="black" strokeWidth="4" strokeLinejoin="round" />
                  </svg>
                  <h2 className="relative z-10 font-black text-[24px] uppercase tracking-widest text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,4px_4px_0_black,6px_6px_0_black] -rotate-2 text-center">
                    {displaySubtitle}
                  </h2>
                </div>
              </motion.div>
            </motion.div>

            {/* ROW 2: NAME PANEL */}
            <motion.div variants={rowVariants} className="relative w-full px-6 py-6 bg-white flex flex-col items-center z-10">
              {/* Horizontal SVG Border covering seam between Row 1 and Row 2 */}
              <svg className="absolute top-0 left-0 w-full h-[14px] z-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 14">
                <polygon points="0,0 100,0 100,14 0,4" fill="black" />
              </svg>

              <motion.div variants={popVariants}>
                <h1 className="mt-2 font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,6px_6px_0_var(--invitation-accent-2),8px_8px_0_black] text-center rotate-1">
                  {celebrantName}
                </h1>
              </motion.div>
            </motion.div>

            {/* ROW 3: MIDDLE PANELS */}
            <motion.div variants={rowVariants} className="relative w-full grid grid-cols-2 z-10">
              {/* Horizontal SVG Border covering seam between Row 2 and Row 3 */}
              <svg className="absolute top-0 left-0 w-full h-[16px] z-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 16">
                <polygon points="0,0 100,0 100,6 0,16" fill="black" />
              </svg>
              
              {/* MIDDLE LEFT PANEL */}
              <div 
                className="relative h-[220px] bg-cover bg-center flex justify-center items-center overflow-hidden"
                style={{ backgroundImage: `url(${coverImage})` }}
              >
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-center bg-[length:120%] bg-no-repeat opacity-60 mix-blend-screen"
                  style={{ backgroundImage: `url(${assets.frame})` }}
                  animate={isOpening ? { opacity: 0, scale: 1.2 } : { rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
                  transition={isOpening ? { duration: 0.75, ease: revealEase, delay: 0.5 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* MIDDLE RIGHT PANEL */}
              <div className="relative p-4 h-[220px] bg-wedding-accent-2 flex flex-col justify-end items-center pb-6">
                {/* Vertical SVG Border covering seam between Left and Right */}
                <svg className="absolute top-0 left-0 w-[14px] h-full z-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 14 100">
                  <polygon points="0,0 14,0 8,100 0,100" fill="black" />
                </svg>

                <motion.div variants={popVariants} className="absolute top-[20px] right-[10px] z-30">
                  <div className="inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 text-black shadow-[4px_4px_0_0_black] border-[3px] border-black rotate-3">
                    <span className="font-garet-book text-[12px] font-bold tracking-widest">{date}</span>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="relative z-30 ml-[10px] mt-[10px]">
                  <div className="relative rounded-[20px] border-[4px] border-black bg-white px-4 py-4 text-center shadow-[6px_6px_0_0_black] -rotate-2">
                    <p className="font-garet-book text-[10px] uppercase tracking-widest font-bold text-wedding-accent-2">Spesial Untuk</p>
                    <p className="mt-1 font-black text-[22px] leading-tight text-wedding-dark">{displayGuest}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ROW 4: BOTTOM PANEL */}
            <motion.div variants={rowVariants} className="relative w-full p-6 pt-16 pb-12 bg-wedding-accent bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:12px_12px] flex justify-center items-center z-10 overflow-hidden">
              {/* Horizontal SVG Border covering seam between Row 3 and Row 4 */}
              <svg className="absolute top-0 left-0 w-full h-[18px] z-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 18">
                <polygon points="0,0 100,0 100,8 0,18" fill="black" />
              </svg>

              <motion.div variants={textVariants} className="relative z-30 -mt-[15px]">
                {/* Comic Action Spikes Radiating from behind the button */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[800px] h-[320px] z-[-1] pointer-events-none opacity-60 -rotate-6" preserveAspectRatio="none" viewBox="0 0 300 240">
                  <g fill="black">
                    <polygon points="150,120 10,0 30,0" />
                    <polygon points="150,120 80,0 95,0" />
                    <polygon points="150,120 180,0 190,0" />
                    <polygon points="150,120 260,0 280,0" />
                    
                    <polygon points="150,120 300,40 300,55" />
                    <polygon points="150,120 300,120 300,135" />
                    <polygon points="150,120 300,190 300,210" />
                    
                    <polygon points="150,120 250,240 270,240" />
                    <polygon points="150,120 160,240 170,240" />
                    <polygon points="150,120 80,240 100,240" />
                    <polygon points="150,120 10,240 30,240" />
                    
                    <polygon points="150,120 0,170 0,190" />
                    <polygon points="150,120 0,90 0,110" />
                    <polygon points="150,120 0,20 0,40" />
                  </g>
                </svg>

                <motion.button
                  onClick={handleOpen}
                  disabled={isOpening}
                  className="inline-flex flex-col items-center justify-center h-[130px] w-[170px] rounded-[60%_80%_70%_10%/70%_60%_80%_10%] font-black text-[20px] uppercase tracking-widest border-[4px] border-black bg-white shadow-[6px_6px_0_0_black] transition-all disabled:opacity-70 active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] -rotate-2"
                  style={{ color: `var(--invitation-accent)` }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="block leading-none [text-shadow:2px_2px_0_black]">Buka</span>
                  <span className="block leading-none [text-shadow:2px_2px_0_black] mt-1">Undangan</span>
                </motion.button>
              </motion.div>
            </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
