"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ onOpen, hosts, date, subtitle, coverImage, guestName }: HeroProps) {
  const overlayAssets = useOverlayAssets();
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
  const displayGuest = guestName?.trim() || "Teman Hebat";
  const displaySubtitle = subtitle?.trim() || "Birthday Party";
  const displayRole = celebrant?.role?.trim() || "Birthday Star";

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.18 },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.04,
        staggerDirection: -1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.86, ease: revealEase },
    },
    exit: {
      opacity: 0,
      y: -18,
      scale: 0.96,
      transition: { duration: 0.62, ease: revealEase },
    },
  } as const;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 960);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg max-w-[610px]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in_srgb,var(--invitation-bg) 80%, white 20%) 0%, var(--invitation-bg) 40%, color-mix(in_srgb,var(--invitation-accent-2) 10%, var(--invitation-bg)) 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[210px] bg-top bg-cover bg-no-repeat opacity-95"
        style={{ backgroundImage: `url(${overlayAssets.clouds})` }}
        animate={isOpening ? { opacity: 0, y: -24 } : { y: [0, 8, 0] }}
        transition={isOpening ? { duration: 0.5 } : { duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute -left-18 top-10 h-[320px] w-[240px] bg-contain bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
        animate={isOpening ? { x: -40, opacity: 0 } : { y: [0, -16, 0], rotate: [-4, 0, -4] }}
        transition={isOpening ? { duration: 0.7, ease: revealEase } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute -right-18 top-16 h-[320px] w-[240px] scale-x-[-1] bg-contain bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
        animate={isOpening ? { x: 40, opacity: 0 } : { y: [0, 18, 0], rotate: [4, 0, 4] }}
        transition={isOpening ? { duration: 0.7, ease: revealEase } : { duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute -top-8 left-1/2 h-[280px] w-[360px] -translate-x-1/2 bg-contain bg-top bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${overlayAssets.rainbow})` }}
        animate={isOpening ? { opacity: 0, y: -20 } : { scale: [1, 1.03, 1] }}
        transition={isOpening ? { duration: 0.55, ease: revealEase } : { duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-70 mix-blend-multiply"
        style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
        animate={isOpening ? { opacity: 0 } : { y: [0, 6, 0] }}
        transition={isOpening ? { duration: 0.45 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center px-4 py-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="relative w-full"
        >
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[42px] border border-wedding-accent/18 bg-white/55 px-6 pt-7 pb-8 text-center shadow-[0_30px_90px_rgba(63,19,91,0.18)] backdrop-blur-xl"
          >
            <motion.div
              aria-hidden
              className="absolute -right-12 -top-18 h-[180px] w-[180px] bg-contain bg-no-repeat opacity-80"
              style={{ backgroundImage: `url(${overlayAssets.sparkles})` }}
              animate={isOpening ? { opacity: 0 } : { rotate: [0, 8, 0], y: [0, 8, 0] }}
              transition={isOpening ? { duration: 0.4 } : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              aria-hidden
              className="absolute -left-10 bottom-10 h-[160px] w-[160px] bg-contain bg-no-repeat opacity-70"
              style={{ backgroundImage: `url(${overlayAssets.sparkles})` }}
              animate={isOpening ? { opacity: 0 } : { rotate: [0, -7, 0], y: [0, -8, 0] }}
              transition={isOpening ? { duration: 0.4 } : { duration: 8.1, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <motion.p
                variants={itemVariants}
                className="inline-flex items-center justify-center rounded-full bg-wedding-accent/10 px-4 py-2 font-poppins-bold text-[11px] uppercase tracking-[0.26em] text-wedding-accent"
              >
                You&apos;re Invited
              </motion.p>

              <motion.div variants={itemVariants} className="relative mx-auto mt-5 h-[260px] w-[260px]">
                <div className="absolute inset-[18px] overflow-hidden rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.18))]" />
                </div>

                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${overlayAssets.frame})` }}
                  animate={isOpening ? { opacity: 0, y: -20, rotate: 8 } : { rotate: [0, 3, 0], scale: [1, 1.02, 1] }}
                  transition={isOpening ? { duration: 0.75, ease: revealEase } : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.p variants={itemVariants} className="mt-6 font-poppins text-[12px] uppercase tracking-[0.32em] text-wedding-accent-2">
                {displaySubtitle}
              </motion.p>

              <motion.h1 variants={itemVariants} className="mt-3 font-poppins-bold text-[42px] leading-none tracking-tight text-wedding-dark">
                {celebrantName}
              </motion.h1>

              <motion.p variants={itemVariants} className="mt-3 font-poppins text-[13px] uppercase tracking-[0.24em] text-wedding-dark/65">
                {date}
              </motion.p>

              <motion.div variants={itemVariants} className="mt-5 inline-flex items-center justify-center rounded-full bg-wedding-accent-2/12 px-4 py-2 text-wedding-dark">
                <span className="font-poppins-bold text-[12px] uppercase tracking-[0.24em]">{displayRole}</span>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-7 rounded-[28px] border border-wedding-accent/10 bg-white/50 px-5 py-4 text-center backdrop-blur-md">
                <p className="font-poppins text-[11px] uppercase tracking-[0.24em] text-wedding-dark/55">Special for</p>
                <p className="mt-2 font-poppins-bold text-[22px] leading-none text-wedding-dark">{displayGuest}</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={handleOpen}
                  disabled={isOpening}
                  className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-wedding-accent px-9 py-3 font-poppins-bold text-sm uppercase tracking-[0.22em] text-wedding-on-accent shadow-[0_16px_40px_color-mix(in_srgb,var(--invitation-accent)_28%,transparent)] transition-colors hover:bg-wedding-accent/88 disabled:opacity-70"
                  animate={isOpening ? { y: -8, opacity: 0 } : { y: [0, -4, 0] }}
                  transition={isOpening ? { duration: 0.5, ease: revealEase } : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  Open Invitation
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_color-mix(in_srgb,var(--invitation-accent)_10%,transparent)]" />
    </div>
  );
}
