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
}

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: revealEase, when: "afterChildren", staggerChildren: 0.08, staggerDirection: -1 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: revealEase, when: "beforeChildren", staggerChildren: 0.08 } 
  },
  exit: { 
    opacity: 0,
    y: -30,
    transition: { duration: 0.3, ease: revealEase, when: "afterChildren", staggerChildren: 0.05 } 
  },
};

const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -3 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, type: "spring", bounce: 0.4 } },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.25 } },
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
  const celebrantName = celebrant?.shortName || celebrant?.firstName || "Birthday Star";
  const displayGuest = guestName?.trim() || "Player One";
  const displaySubtitle = subtitle?.trim() || "Pesta Ulang Tahun";

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg max-w-[610px]">
      {/* Dynamic Theme background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, var(--invitation-dark) 0%, var(--invitation-bg) 100%)`,
        }}
      />

      {/* Cyber Grid perspective floor overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${assets.spaceDust})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          opacity: 0.8,
        }}
      />

      {/* Pixel stars background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />

      {/* Swaying Retro Arcade cabinet image overlay (idle) */}
      <motion.div
        aria-hidden
        className="absolute left-6 top-16"
        animate={isOpening ? { opacity: 0, x: -30 } : { y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={isOpening ? { duration: 0.4 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.heroGraphic} alt="" className="w-20 h-auto opacity-45" />
      </motion.div>

      {/* Floating Retro game controller */}
      <motion.div
        aria-hidden
        className="absolute right-6 top-24"
        animate={isOpening ? { opacity: 0, x: 30 } : { y: [0, 12, 0], rotate: [0, -6, 0] }}
        transition={isOpening ? { duration: 0.4, delay: 0.1 } : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <img src={assets.floatingPlanet1} alt="" className="w-28 h-auto opacity-40" />
      </motion.div>

      {/* Drifting Retro Game Cartridge */}
      <motion.div
        aria-hidden
        className="absolute left-6 bottom-36"
        animate={isOpening ? { opacity: 0, y: 30 } : { y: [0, -8, 0], rotate: [0, 8, 0] }}
        transition={isOpening ? { duration: 0.4 } : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img src={assets.floatingPlanet2} alt="" className="w-16 h-auto opacity-35" />
      </motion.div>

      {/* Floating Invader Alien Sprite */}
      <motion.div
        aria-hidden
        className="absolute right-6 bottom-28"
        animate={isOpening ? { opacity: 0, y: 30 } : { y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={isOpening ? { duration: 0.4 } : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <img src={assets.moonOrbiter} alt="" className="w-14 h-auto opacity-40" />
      </motion.div>

      {/* Pixel Laser Shot */}
      <motion.div
        aria-hidden
        className="absolute left-4 top-[30%]"
        animate={isOpening ? { opacity: 0, x: -50 } : { x: ["-10%", "10%", "-10%"], opacity: [0.3, 0.6, 0.3] }}
        transition={isOpening ? { duration: 0.4 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.shootingElement} alt="" className="w-32 h-auto opacity-30" />
      </motion.div>

      {/* CRT Scanline Overlay Effect */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.18)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] opacity-25" />

      {/* Main Console Interface Layout */}
      <div className="relative z-10 mx-auto flex h-screen w-full max-w-[500px] flex-col items-center justify-center px-4">
        <AnimatePresence>
          {!isOpening && (
            <motion.div
              className="relative w-full rounded-[24px] border-[6px] border-black bg-wedding-dark p-6 shadow-[0_12px_0_0_black,0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 20%, var(--invitation-dark) 100%)`,
              }}
            >
              {/* Outer Retro Bezel Grid corners decoration */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-wedding-accent-2" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-wedding-accent-2" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-wedding-accent-2" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-wedding-accent-2" />

              {/* Subtitle / Header screen */}
              <motion.div variants={rowVariants} className="text-center py-4">
                <span className="font-mono font-bold text-[13px] uppercase tracking-[0.25em] text-wedding-accent-2 bg-black/40 px-3 py-1 rounded border border-wedding-accent-2/30 inline-block animate-pulse">
                  {displaySubtitle}
                </span>
              </motion.div>

              {/* Character Profile / Name Screen */}
              <motion.div variants={rowVariants} className="text-center py-4 bg-black/50 border-[3px] border-black rounded-[8px] my-3">
                <motion.div variants={popVariants}>
                  <p className="font-mono text-[10px] text-wedding-accent-2 tracking-widest uppercase mb-1">PLAYER ONE</p>
                  <h1 className="font-black text-[38px] leading-none text-white uppercase tracking-tight [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,4px_4px_0_var(--invitation-accent),6px_6px_0_#000]">
                    {celebrantName}
                  </h1>
                </motion.div>
              </motion.div>

              {/* Game Screen Image Panel */}
              <motion.div variants={rowVariants} className="relative h-[200px] w-full border-[4px] border-black bg-black rounded-[8px] overflow-hidden my-3">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-85"
                  style={{ backgroundImage: `url(${coverImage})` }}
                />
                {/* 8-bit bezel overlay */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-screen bg-center bg-cover bg-no-repeat pointer-events-none"
                  style={{ backgroundImage: `url(${assets.frame})` }}
                />
              </motion.div>

              {/* Special Guest Invitation details */}
              <motion.div variants={rowVariants} className="grid grid-cols-5 gap-3 items-center mt-4">
                {/* Date Panel */}
                <div className="col-span-2 bg-wedding-accent text-white p-3 rounded-[8px] border-[3px] border-black text-center shadow-[4px_4px_0_0_black]">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-wedding-accent-2">GAME TIME</p>
                  <p className="font-mono text-[11px] font-black tracking-tighter mt-1">{date}</p>
                </div>

                {/* Arrow indicator */}
                <div className="col-span-1 flex justify-center">
                  <motion.span
                    className="text-white text-[24px] font-bold"
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ▶
                  </motion.span>
                </div>

                {/* Guest name Panel */}
                <div className="col-span-2 bg-white text-black p-3 rounded-[8px] border-[3px] border-black text-center shadow-[4px_4px_0_0_black]">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-wedding-accent">VISITOR ID</p>
                  <p className="font-mono text-[12px] font-black truncate mt-1 text-wedding-dark">{displayGuest}</p>
                </div>
              </motion.div>

              {/* Press Start Opener Button */}
              <motion.div variants={rowVariants} className="flex justify-center mt-6 pt-2">
                <motion.button
                  onClick={handleOpen}
                  disabled={isOpening}
                  className="relative group inline-flex flex-col items-center justify-center h-[90px] w-full max-w-[280px] rounded-[12px] border-[4px] border-black bg-yellow-400 font-mono font-black text-[20px] uppercase tracking-widest text-black shadow-[0_6px_0_0_black] hover:bg-yellow-300 active:translate-y-[4px] active:shadow-[0_2px_0_0_black] disabled:opacity-75 transition-all"
                  animate={isOpening ? { scale: 0.9, opacity: 0 } : { scale: [1, 1.03, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="block leading-none tracking-widest">PRESS START</span>
                  <span className="block text-[10px] tracking-wide text-black/70 mt-1.5 font-bold">
                    {isOpening ? "LOADING GAME..." : "INSERT COIN TO PLAY"}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Screen Edge Bevel Vignette */}
      <div className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
    </div>
  );
}
