"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";

interface CoupleInfo {
  groom: { firstName: string; shortName?: string; fullName?: string };
  bride: { firstName: string; shortName?: string; fullName?: string };
}

interface HeroProps {
  onOpen: () => void;
  couple: CoupleInfo;
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({
  onOpen,
  couple,
  date,
  subtitle,
  coverImage,
  guestName,
}: HeroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.24 },
    },
    exit: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.08, staggerDirection: -1 },
    },
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      scale: 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.95, ease: revealEase },
    },
    exit: {
      opacity: 0,
      y: 14,
      scale: 0.995,
      transition: { duration: 0.7, ease: revealEase },
    },
  } as const;

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
      }
    };
  }, []);

  const groomInitial = couple.groom.firstName?.charAt(0).toUpperCase() || "D";
  const brideInitial = couple.bride.firstName?.charAt(0).toUpperCase() || "A";
  const displayGuest = guestName?.trim() || "NAMA TAMU";
  const heading = subtitle?.trim() || "The Wedding of";
  const groomName = couple.groom.shortName || couple.groom.firstName;
  const brideName = couple.bride.shortName || couple.bride.firstName;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(
      () => {
        onOpen();
      },
      1380,
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#EFE7D6]">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[610px] items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="relative w-full max-w-[500px] text-center"
        >
          <motion.div
            variants={itemVariants}
            className="relative mx-auto h-[450px] w-full"
          >
            <div
              aria-hidden
              className="absolute inset-[0px] overflow-hidden rounded-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-center scale-[1.06] blur-[1px]"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(235,227,209,0) 0%, rgba(235,227,209,0.5) 50%, rgba(235,227,209,1) 70%, rgba(235,227,209,1) 100%)",
                }}
              />
            </div>

           
              <motion.div
                aria-hidden
                className="h-full w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.heroFrame})`,
                }}
                animate={
                  isOpening
                    ? {
                        opacity: 0,
                        scale: 2,
                        x: 0,
                        y: 0,
                        rotate: 10,
                      }
                    : {
                        rotate: [10, 0, 10, 0, 10],
                        scale: [1, 0.9, 1],
                      }
                }
                transition={
                  isOpening
                    ? { duration: 1.05, ease: revealEase }
                    : { duration: 25, repeat: Infinity, ease: "easeInOut" }
                }
              />

          

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-great-vibes font-bold text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                <div className="flex items-center uppercase">
                  <span className="text-[70px] leading-none pb-24">
                    {groomInitial}
                  </span>
                  <span className="text-[40px] leading-none">&</span>
                  <span className="text-[70px] leading-none pt-24">
                    {brideInitial}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
          >
            <p className="font-stoic text-[30px] leading-none text-[#8A6A2E] pt-8">
              {heading}
            </p>
            <p className="mt-4 font-tan-mon-cheri text-[35px] leading-none text-[#7C5A2A]">
              {groomName} & {brideName}
            </p>
            <p className="mt-1 font-garet-book text-[18px] tracking-[0.18em] text-[#7C5A2A]">
              {date}
            </p>
          </motion.div>

          <motion.div
            className="mt-10 space-y-2 text-[#6B5B3D]"
            variants={itemVariants}
          >
            <p className="font-poppins text-sm">Kepada Yth.</p>
            <p className="font-poppins text-sm">Bapak/Ibu/Saudara-i</p>
            <p className="pt-2 font-poppins-bold text-2xl tracking-wide text-[#5B4521]">
              {displayGuest}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={isOpening ? {} : { scale: 1.02 }}
              whileTap={isOpening ? {} : { scale: 0.98 }}
              onClick={handleOpen}
              disabled={isOpening}
              className="mt-6 inline-flex items-center justify-center gap-3 rounded-full bg-[#7A5A2A] px-10 py-3 font-poppins text-sm tracking-wide text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#6B4F25] disabled:opacity-70"
              animate={
                isOpening
                  ? undefined
                  : {
                      y: [0, -3, 0],
                    }
              }
              transition={
                isOpening
                  ? undefined
                  : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
              }
            >
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.14)]" />
    </div>
  );
}
