"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useOverlayAssets } from "./graphics/overlays";
import type { Host } from "@/types/invitation";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
  purpose?: "marriage" | "birthday" | "event";
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({
  onOpen,
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
  purpose,
}: HeroProps) {
  const overlayAssets = useOverlayAssets();
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
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
        staggerDirection: -1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: revealEase },
    },
    exit: {
      opacity: 0,
      y: 14,
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

  const displayGuest = guestName?.trim() || "NAMA TAMU";
  const heading =
    subtitle?.trim() ||
    (purpose === "birthday" ? "Birthday Invitation" : "The Wedding of");
  const primary = hosts[0];
  const secondary = hosts[1];

  const primaryName = primary?.shortName || primary?.firstName || "";
  const secondaryName = secondary?.shortName || secondary?.firstName || "";
  const nameLine =
    purpose === "birthday" ? primaryName : `${primaryName}${secondaryName ? ` & ${secondaryName}` : ""}`;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    openTimeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 1380);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg max-w-[610px]">
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "exit" : "visible"}
          className="relative w-full text-center"
        >
          <motion.div
            variants={itemVariants}
            className="relative  h-[260px] w-[260px] mx-auto "
          >
            <div
              aria-hidden
              className="absolute inset-[10px] overflow-hidden rounded-full"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, color-mix(in_srgb,var(--invitation-bg)_0%,transparent) 0%, color-mix(in_srgb,var(--invitation-bg)_42%,transparent) 52%, color-mix(in_srgb,var(--invitation-bg)_95%,transparent) 72%, var(--invitation-bg) 100%)",
                }}
              />
            </div>

            <motion.div
              aria-hidden
              className="h-full w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${overlayAssets.heroFrame})`,
              }}
              animate={
                isOpening
                  ? {
                      opacity: 0,
                      x: 0,
                      y: -24,
                      rotate: 10,
                    }
                  : {
                      rotate: [10, 0, 10, 0, 10],
                    }
              }
              transition={
                isOpening
                  ? { duration: 1.05, ease: revealEase }
                  : { duration: 25, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="font-poppins text-[14px] tracking-[0.22em] uppercase text-wedding-accent-2 pt-7">
              {heading}
            </p>
            <p className="mt-3 font-poppins-bold text-[36px] leading-none text-wedding-dark">
              {nameLine}
            </p>
            <p className="mt-2 font-poppins text-[13px] tracking-[0.24em] uppercase text-wedding-dark/70">
              {date}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 space-y-2 text-wedding-dark/75"
            variants={itemVariants}
          >
            <p className="font-poppins text-sm">Kepada Yth.</p>
            <p className="font-poppins text-sm">Bapak/Ibu/Saudara-i</p>
            <p className="pt-1 font-poppins-bold text-xl tracking-wide text-wedding-dark">
              {displayGuest}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleOpen}
              disabled={isOpening}
              className="mt-5 inline-flex items-center justify-center gap-3 rounded-full bg-wedding-accent-2 px-9 py-3 font-poppins-bold text-sm tracking-[0.18em] uppercase text-wedding-on-accent-2 shadow-[0_12px_30px_color-mix(in_srgb,var(--invitation-accent-2)_35%,transparent)] transition-colors hover:bg-wedding-accent-2/85 disabled:opacity-70"
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

      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_color-mix(in_srgb,var(--invitation-dark)_14%,transparent)]" />
    </div>
  );
}
