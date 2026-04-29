"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const popVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 10, stiffness: 150 },
  },
};

export function Hero({
  onOpen,
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
}: HeroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const assets = useOverlayAssets();

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 960);
  };

  const starField = (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${assets.stars})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.7,
      }}
    />
  );

  const constellationBg = (
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `url(${assets.constellation})`,
        backgroundSize: "120% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );

  return (
    <motion.div
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, var(--invitation-dark) 0%, var(--invitation-bg) 100%)`,
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isOpening ? "exit" : "visible"}
    >
      {starField}

      <motion.div
        className="absolute left-10 top-20"
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={assets.heroGraphic}
          alt=""
          className="w-24 h-auto opacity-70"
        />
      </motion.div>

      <motion.div
        className="absolute right-8 top-32"
        animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <img
          src={assets.floatingPlanet1}
          alt=""
          className="w-32 h-auto opacity-60"
        />
      </motion.div>

      <motion.div
        className="absolute left-6 bottom-40"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <img
          src={assets.floatingPlanet2}
          alt=""
          className="w-20 h-auto opacity-55"
        />
      </motion.div>

      <motion.div
        className="absolute right-6 bottom-28"
        animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <img
          src={assets.moonOrbiter}
          alt=""
          className="w-16 h-auto opacity-60"
        />
      </motion.div>

      <motion.div
        className="absolute left-0 right-0 top-[15%] h-40 overflow-hidden opacity-25"
        animate={{ x: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: `url(${assets.spaceDust})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat-x",
        }}
      />

      {constellationBg}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-full max-w-[340px] rounded-[48px] border-2 border-white/15 bg-white/[0.06] backdrop-blur-2xl p-8 relative overflow-hidden"
          variants={popVariants}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${assets.stars})`,
              backgroundSize: "cover",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5 font-garet-book text-[11px] uppercase tracking-[0.25em] text-white/70 backdrop-blur"
              variants={itemVariants}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--invitation-accent-2)" }}
              />
              {subtitle}
            </motion.div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <div className="relative">
                <img
                  src={coverImage}
                  alt=""
                  className="h-44 w-44 rounded-full border-[3px] border-white/20 object-cover shadow-[0_0_40px_var(--invitation-accent-2)]"
                />
                <div
                  className="absolute inset-[-8px] rounded-full opacity-40"
                  style={{
                    background: `conic-gradient(from 0deg, var(--invitation-accent-2), transparent, var(--invitation-accent), transparent, var(--invitation-accent-2))`,
                    filter: "blur(8px)",
                  }}
                />
              </div>
              <motion.div
                className="absolute -inset-4 opacity-30"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {assets.frame ? (
                  <img src={assets.frame} alt="" className="w-full h-full" />
                ) : null}
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              variants={itemVariants}
            >
              <h1
                className="font-great-vibes text-[52px] leading-none tracking-wide text-white"
                style={{
                  textShadow: "0 0 40px var(--invitation-accent-2), 0 0 80px var(--invitation-accent)",
                }}
              >
                {hosts[0]?.firstName}
              </h1>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 font-garet-book text-[12px] tracking-[0.15em] text-white/60 backdrop-blur"
              variants={itemVariants}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--invitation-accent)" }}
              />
              {date}
            </motion.div>

            {guestName ? (
              <motion.div
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center backdrop-blur"
                variants={itemVariants}
              >
                <p className="font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Spesial Untuk
                </p>
                <p className="mt-1 font-garet-book text-sm font-bold text-white/80 tracking-wide">
                  {guestName}
                </p>
              </motion.div>
            ) : null}

            <motion.button
              type="button"
              onClick={handleOpen}
              variants={itemVariants}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative mt-2 inline-flex items-center gap-3 rounded-full px-8 py-3 font-garet-book text-[14px] font-bold uppercase tracking-[0.15em] text-white transition-all"
              style={{
                background: `linear-gradient(135deg, var(--invitation-accent), var(--invitation-accent-2))`,
                boxShadow: "0 8px 30px var(--invitation-accent-2)",
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                &#10024;
              </motion.span>
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute left-4 top-1/3"
        animate={{ y: [0, -20, 0], x: [0, 15, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={assets.shootingElement}
          alt=""
          className="w-40 h-auto opacity-50 rotate-12"
        />
      </motion.div>
    </motion.div>
  );
}
