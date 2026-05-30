"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Host } from "@/types/invitation";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, TwinLineDivider, SwoopingLineLeft, SwoopingLineRight, HairlineDivider, SideFadeRuleLeft, SideFadeRuleRight } from "./graphics/ornaments";
import { GrowingSwayingFloral } from "./graphics/GrowingSwayingFloral";

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
  const openTimeoutRef = useRef<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
    exit: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05, staggerDirection: -1 },
    },
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: revealEase },
    },
    exit: {
      opacity: 0,
      y: -10,
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
    openTimeoutRef.current = window.setTimeout(
      () => {
        onOpen();
      },
      1200,
    );
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-wedding-bg">
      <SideFadeRuleLeft />
      <SideFadeRuleRight />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[610px] items-center justify-center px-6 py-[clamp(1.5rem,4vh,2.5rem)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="relative w-full text-center flex flex-col h-full"
        >
          {/* Top minimal typography */}
          <motion.div variants={itemVariants} className="pt-4 pb-6 flex-none">
            <div className="flex items-center justify-center gap-4 mb-2">
              <SwoopingLineLeft />
              <div className="w-1.5 h-1.5 rounded-full bg-wedding-accent/25" />
              <SwoopingLineRight />
            </div>
            <p className="font-display italic text-[clamp(16px,2.5vh,20px)] text-wedding-accent">
              {heading}
            </p>
          </motion.div>

          {/* Main elegant arch frame */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto flex-1 min-h-[300px] w-full max-w-[380px] p-4"
          >
            {/* Outer ornate border */}
            <div className="absolute inset-0 rounded-t-full rounded-b-[60px] border-[1px] border-wedding-accent/40 pointer-events-none" />
            <div className="absolute inset-2 rounded-t-full rounded-b-[50px] border-[1px] border-wedding-accent/20 pointer-events-none" />

            {/* Rich botanical decorations */}
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.leafSide}
              initialRotate={-12}
              className="absolute -top-12 -left-12 w-48 h-48 z-20 pointer-events-none opacity-90 mix-blend-multiply"
              growDelay={0.3}
              swayDuration={7.2}
              originX="10%"
              originY="90%"
            />
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.cornerFlower}
              initialRotate={90}
              className="absolute -top-8 -right-8 w-32 h-32 z-20 pointer-events-none opacity-80 mix-blend-multiply"
              growDelay={0.4}
              swayDuration={6.0}
              originX="90%"
              originY="10%"
            />
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.leafSide2}
              initialRotate={12}
              className="absolute -bottom-16 -right-16 w-64 h-64 z-20 pointer-events-none opacity-90 mix-blend-multiply scale-x-[-1]"
              growDelay={0.5}
              swayDuration={8.4}
              originX="90%"
              originY="90%"
            />
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.cornerFlower}
              initialRotate={-90}
              className="absolute -bottom-6 -left-6 w-32 h-32 z-20 pointer-events-none opacity-80 mix-blend-multiply"
              growDelay={0.6}
              swayDuration={7.6}
              originX="10%"
              originY="90%"
            />

            {/* Line graphic corners */}
            <div className="absolute -top-4 -left-4 z-10 pointer-events-none opacity-60">
              <CornerLineTopLeft />
            </div>
            <div className="absolute -bottom-4 -right-4 z-10 pointer-events-none opacity-60">
              <CornerLineBottomRight />
            </div>
            
            {/* Inner image container */}
            <div
              className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-[40px] bg-wedding-dark/5"
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
                initial={{ scale: 1.15 }}
                animate={isOpening ? { scale: 1.15 } : { scale: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
              />
              
              {/* Soft bottom fade instead of radial gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-wedding-bg via-wedding-bg/20 to-transparent" />

              {/* Names overlaying the image bottom */}
              <div className="absolute bottom-6 left-0 right-0 px-4">
                <div className="flex flex-col items-center gap-1 font-display text-wedding-accent drop-shadow-[0_4px_12px_rgba(255,255,255,0.6)]">
                  <span className="text-[clamp(36px,5vh,48px)] leading-none font-medium">
                    {primaryName}
                  </span>
                  <span className="text-[clamp(24px,3.5vh,32px)] italic text-wedding-accent/80 font-body">&</span>
                  <span className="text-[clamp(36px,5vh,48px)] leading-none font-medium">
                    {secondaryName}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            className="mt-6 flex-none flex flex-col items-center"
            variants={itemVariants}
          >
            <p className="font-body text-[clamp(13px,2vh,16px)] tracking-[0.25em] text-wedding-accent uppercase font-bold">
              {date}
            </p>

            <div className="mt-8 mb-6">
              <TwinLineDivider />
            </div>

            <div className="space-y-1 text-wedding-text-light">
              <HairlineDivider />
              <p className="font-body text-sm italic">Kepada Yth.</p>
              <p className="font-body text-[13px] uppercase tracking-wider">Bapak / Ibu / Saudara-i</p>
              <p className="pt-2 font-display font-semibold text-[clamp(20px,3.5vh,28px)] text-wedding-accent">
                {displayGuest}
              </p>
            </div>

            <motion.button
              whileHover={isOpening ? {} : { scale: 1.02 }}
              whileTap={isOpening ? {} : { scale: 0.98 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-none border border-wedding-accent bg-transparent px-10 py-3 font-body font-bold text-xs uppercase tracking-[0.2em] text-wedding-accent transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent disabled:opacity-70"
            >
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
