"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Host } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

import { KIDS_BIRTHDAY_OVERLAY_ASSETS } from "./graphics/overlay";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
  isOceanExplorer?: boolean;
  isSoccerArgentina?: boolean;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({
  onOpen,
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
  isOceanExplorer,
  isSoccerArgentina,
}: HeroProps) {
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
  const celebrantName =
    celebrant?.shortName || celebrant?.firstName || "Birthday Star";
  const displayGuest = guestName?.trim() || "Teman Hebat";
  const displaySubtitle = subtitle?.trim() || "Pesta Ulang Tahun";

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      rotate: 5,
      transition: { duration: 0.4 },
    },
  } as const;

  const textVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 8,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: -10,
      transition: { duration: 0.4 },
    },
  } as const;

  const popVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.3 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.4 },
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
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg max-w-[610px] perspective-[1000px]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--invitation-bg) 0%, color-mix(in_srgb,var(--invitation-accent-2) 15%, var(--invitation-bg)) 100%)",
        }}
      />

      {!isSoccerArgentina && (
        <>
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[210px] bg-top bg-cover bg-no-repeat opacity-95"
            style={{ backgroundImage: `url(${overlayAssets.clouds})` }}
            animate={isOpening ? { opacity: 0, y: -24 } : { y: [0, 8, 0] }}
            transition={
              isOpening
                ? { duration: 0.5 }
                : { duration: 9.5, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <motion.div
            aria-hidden
            className="absolute -left-18 top-10 h-[320px] w-[240px] bg-contain bg-no-repeat opacity-90"
            style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
            animate={
              isOpening
                ? { x: -40, opacity: 0 }
                : { y: [0, -16, 0], rotate: [-4, 0, -4] }
            }
            transition={
              isOpening
                ? { duration: 0.7, ease: revealEase }
                : { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <motion.div
            aria-hidden
            className="absolute -right-18 top-16 h-[320px] w-[240px] scale-x-[-1] bg-contain bg-no-repeat opacity-90"
            style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
            animate={
              isOpening
                ? { x: 40, opacity: 0 }
                : { y: [0, 18, 0], rotate: [4, 0, 4] }
            }
            transition={
              isOpening
                ? { duration: 0.7, ease: revealEase }
                : { duration: 8.6, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <motion.div
            aria-hidden
            className="absolute -top-8 left-1/2 h-[280px] w-[360px] -translate-x-1/2 bg-contain bg-top bg-no-repeat opacity-75"
            style={{ backgroundImage: `url(${overlayAssets.rainbow})` }}
            animate={isOpening ? { opacity: 0, y: -20 } : { scale: [1, 1.03, 1] }}
            transition={
              isOpening
                ? { duration: 0.55, ease: revealEase }
                : { duration: 7.4, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <motion.div
            aria-hidden
            className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-80 mix-blend-multiply"
            style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
            animate={
              isOpening ? { opacity: 0 } : { y: [0, -10, 0], rotate: [0, 2, -2, 0] }
            }
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 15, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </>
      )}

      {isSoccerArgentina && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          {/* Main Left Stripe Group */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[45px] opacity-95 shadow-[4px_0_12px_rgba(0,0,0,0.05)]"
            style={{
              background:
                "linear-gradient(90deg, #74ACDF 0 33.33%, #ffffff 33.33% 66.66%, #74ACDF 66.66% 100%)",
            }}
            animate={isOpening ? { opacity: 0, x: -24 } : { x: [0, -2, 0], y: [0, -5, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            className="absolute left-[55px] top-0 bottom-0 w-[12px] opacity-95"
            style={{ background: "#F6B40E" }}
            animate={isOpening ? { opacity: 0, x: -10 } : { x: [0, -1, 0], y: [0, -6, 0] }}
            transition={{
              duration: isOpening ? 0.45 : 9,
              repeat: isOpening ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute left-[75px] top-0 bottom-0 w-[25px] opacity-90 shadow-[4px_0_8px_rgba(0,0,0,0.03)]"
            style={{
              background:
                "linear-gradient(90deg, #74ACDF 0 33.33%, #ffffff 33.33% 66.66%, #74ACDF 66.66% 100%)",
            }}
            animate={isOpening ? { opacity: 0, x: -16 } : { x: [0, -2, 0], y: [0, -4, 0] }}
            transition={{
              duration: isOpening ? 0.45 : 11,
              repeat: isOpening ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main Right Stripe Group */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-[45px] opacity-95 shadow-[-4px_0_12px_rgba(0,0,0,0.05)]"
            style={{
              background:
                "linear-gradient(270deg, #74ACDF 0 33.33%, #ffffff 33.33% 66.66%, #74ACDF 66.66% 100%)",
            }}
            animate={isOpening ? { opacity: 0, x: 24 } : { x: [0, 2, 0], y: [0, 5, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 10.8, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.div
            className="absolute right-[55px] top-0 bottom-0 w-[12px] opacity-95"
            style={{ background: "#F6B40E" }}
            animate={isOpening ? { opacity: 0, x: 10 } : { x: [0, 1, 0], y: [0, 6, 0] }}
            transition={{
              duration: isOpening ? 0.45 : 9.5,
              repeat: isOpening ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-[75px] top-0 bottom-0 w-[25px] opacity-90 shadow-[-4px_0_8px_rgba(0,0,0,0.03)]"
            style={{
              background:
                "linear-gradient(270deg, #74ACDF 0 33.33%, #ffffff 33.33% 66.66%, #74ACDF 66.66% 100%)",
            }}
            animate={isOpening ? { opacity: 0, x: 16 } : { x: [0, 2, 0], y: [0, 4, 0] }}
            transition={{
              duration: isOpening ? 0.45 : 11.5,
              repeat: isOpening ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Background Sprinkles & Pitch */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[220px] bg-repeat bg-size-[300px_300px] opacity-45"
            style={{ backgroundImage: `url(${overlayAssets.soccerSprinkles})` }}
            animate={isOpening ? { opacity: 0 } : { y: [0, 10, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 12, repeat: Infinity, ease: "easeInOut" }
            }
          />
          <motion.img
            src={overlayAssets.pitchLines}
            alt=""
            className="absolute inset-x-0 bottom-0 h-[180px] w-full object-cover object-bottom opacity-70"
            animate={isOpening ? { opacity: 0 } : { y: [0, -8, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }
          />

          {/* Sunburst Element */}
          <motion.img
            src={overlayAssets.afaSunburst}
            alt=""
            className="absolute -right-12 top-[6%] h-[260px] w-[260px] object-contain opacity-[0.85] mix-blend-multiply"
            animate={isOpening ? { opacity: 0, x: 24 } : { rotate: [0, 360], scale: [1, 1.05, 1] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { rotate: { duration: 45, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }
            }
          />

          {/* Multiple Soccer Balls */}
          <motion.img
            src={overlayAssets.soccerBall}
            alt=""
            className="absolute -left-12 top-[12%] h-[180px] w-[180px] object-contain opacity-95"
            animate={isOpening ? { opacity: 0, x: -30 } : { y: [0, -15, 0], rotate: [0, 15, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { y: { duration: 8, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" } }
            }
          />
          <motion.img
            src={overlayAssets.soccerBall}
            alt=""
            className="absolute left-[10%] bottom-[8%] h-[100px] w-[100px] object-contain opacity-[0.85] drop-shadow-xl"
            animate={isOpening ? { opacity: 0, y: 30 } : { y: [0, -8, 0], rotate: [0, -12, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }
          />
          <motion.img
            src={overlayAssets.soccerBall}
            alt=""
            className="absolute right-[5%] bottom-[18%] h-[140px] w-[140px] object-contain opacity-90 drop-shadow-lg"
            animate={isOpening ? { opacity: 0, y: 30 } : { y: [0, -12, 0], rotate: [0, 20, 0] }}
            transition={
              isOpening
                ? { duration: 0.45 }
                : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }
            }
          />
        </div>
      )}

      {!isSoccerArgentina && (
        <>
          <motion.div
            aria-hidden
            className="absolute -top-10 -right-10 h-[280px] w-[280px] bg-contain bg-no-repeat opacity-60 mix-blend-multiply"
            style={{ backgroundImage: `url(${overlayAssets.stars})` }}
            animate={
              isOpening ? { opacity: 0, scale: 1.5 } : { rotate: [0, 90, 0] }
            }
            transition={
              isOpening
                ? { duration: 0.5 }
                : { duration: 25, repeat: Infinity, ease: "linear" }
            }
          />

          <motion.div
            aria-hidden
            className="absolute bottom-20 -right-16 h-[200px] w-[200px] bg-contain bg-no-repeat opacity-70"
            style={{ backgroundImage: `url(${overlayAssets.partyHat})` }}
            animate={
              isOpening
                ? { opacity: 0, x: 50, rotate: 20 }
                : { y: [0, -15, 0], rotate: [-10, 5, -10] }
            }
            transition={
              isOpening
                ? { duration: 0.5 }
                : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </>
      )}

      {isOceanExplorer && (
        <motion.div
          className="absolute left-0 right-0 -top-10 -bottom-40 z-20 bg-contain  bg-no-repeat opacity-90 pointer-events-none rotate-180"
          style={{
            backgroundImage: `url(${KIDS_BIRTHDAY_OVERLAY_ASSETS.boysHeroSides})`,
          }}
          animate={isOpening ? { opacity: 0 } : { y: [0, -60, 0] }}
          transition={
            isOpening ? { duration: 0.5 } : { duration: 20, repeat: Infinity }
          }
        />
      )}


      {isOceanExplorer && (
        <motion.div
          className="absolute left-0 right-0 -top-10 -bottom-40 z-20 bg-contain  bg-no-repeat opacity-90 pointer-events-none"
          style={{
            backgroundImage: `url(${KIDS_BIRTHDAY_OVERLAY_ASSETS.boysHeroSides})`,
          }}
          animate={isOpening ? { opacity: 0 } : { y: [0, -60, 0] }}
          transition={
            isOpening ? { duration: 0.5 } : { duration: 20, repeat: Infinity }
          }
        />
      )}

      
      <div className="relative z-10 mx-auto flex h-full w-full items-center justify-center px-4 py-6 ">
        <div className="relative w-full max-w-[520px]">
          <motion.div
            className="relative z-10 w-full rounded-[48px] border-4 border-white bg-white/60 px-6 py-10 text-center shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent),0_30px_60px_rgba(61,23,92,0.12)] backdrop-blur-md"
            variants={containerVariants}
            initial="hidden"
            animate={isOpening ? "exit" : "visible"}
          >
            <motion.div
              aria-hidden
              className="absolute -right-6 -top-6 h-[180px] w-[180px] bg-contain bg-no-repeat opacity-80 pointer-events-none"
              style={{ backgroundImage: `url(${overlayAssets.sparkles})` }}
              animate={
                isOpening ? { opacity: 0 } : { rotate: [0, 8, 0], y: [0, 8, 0] }
              }
              transition={
                isOpening
                  ? { duration: 0.4 }
                  : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
              }
            />

            <motion.div
              aria-hidden
              className="absolute -left-6 bottom-4 h-[160px] w-[160px] bg-contain bg-no-repeat opacity-70 pointer-events-none"
              style={{ backgroundImage: `url(${overlayAssets.sparkles})` }}
              animate={
                isOpening
                  ? { opacity: 0 }
                  : { rotate: [0, -7, 0], y: [0, -8, 0] }
              }
              transition={
                isOpening
                  ? { duration: 0.4 }
                  : { duration: 8.1, repeat: Infinity, ease: "easeInOut" }
              }
            />

            <motion.div
              className="relative z-10 flex flex-col items-center"
              variants={containerVariants}
              initial="hidden"
              animate={isOpening ? "exit" : "visible"}
            >
              <motion.div variants={textVariants}>
                <p className="mt-8 font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-wedding-accent-2 bg-white/80 inline-block px-4 py-1 rounded-full border-2 border-wedding-accent-2/30 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent)] -rotate-1">
                  {displaySubtitle}
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.div
                  className="relative mx-auto  h-[200px] w-[200px]"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="absolute inset-[10px] overflow-hidden rounded-full border-8 border-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-transform duration-300">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.00)_50%,rgba(255,255,255,0.2))]" />
                  </div>

                  <motion.div
                    aria-hidden
                    className="absolute inset-8 -translate-x-20 translate-y-20 bg-contain  bg-no-repeat"
                    style={{
                      backgroundImage: `url(${isOceanExplorer ? KIDS_BIRTHDAY_OVERLAY_ASSETS.boysHeroFrameDecoration : overlayAssets.frame})`,
                    }}
                    animate={
                      isOpening
                        ? { opacity: 0, y: -20, rotate: 8 }
                        : { rotate: [0, 3, 0], scale: [1, 1.02, 1] }
                    }
                    transition={
                      isOpening
                        ? { duration: 0.75, ease: revealEase }
                        : { duration: 9, repeat: Infinity, ease: "easeInOut" }
                    }
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={popVariants}>
                <h1 className="mt-4 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:3px_3px_0_white,5px_5px_0_var(--invitation-accent)]">
                  {celebrantName}
                </h1>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-6 flex flex-col items-center justify-center gap-2"
              >
                <div className="inline-flex items-center justify-center rounded-2xl bg-wedding-accent-2 px-5 py-2 text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--invitation-dark)_20%,transparent)] rotate-1">
                  <span className="font-poppins-bold text-[14px] tracking-widest">
                    {date}
                  </span>
                </div>
              </motion.div>

              <motion.div variants={popVariants} className="mt-8 relative">
                <motion.div
                  className="absolute -inset-2 bg-wedding-accent/10 rounded-3xl"
                  animate={{ rotate: [2, -2, 2], scale: [1, 1.02, 1] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative rounded-[24px] border-4 border-white bg-[linear-gradient(135deg,var(--invitation-bg),white)] px-5 py-4 text-center shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]">
                  <p className="font-poppins-bold text-[12px] uppercase tracking-widest text-wedding-accent-2">
                    Spesial Untuk
                  </p>
                  <p className="mt-1 font-black text-[24px] leading-tight text-wedding-dark">
                    {displayGuest}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={textVariants}>
                <motion.button
                  onClick={handleOpen}
                  disabled={isOpening}
                  className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-wedding-dark px-10 py-4 font-poppins-bold text-[15px] uppercase tracking-widest text-white shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-dark)_60%,transparent)] transition-all disabled:opacity-70 active:scale-95 active:translate-y-2 active:shadow-none"
                  animate={
                    isOpening
                      ? { y: -8, opacity: 0, scale: 0.9 }
                      : { y: [0, -6, 0], scale: [1, 1.02, 1] }
                  }
                  transition={
                    isOpening
                      ? { duration: 0.5, ease: revealEase }
                      : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  Buka Undangan
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_color-mix(in_srgb,var(--invitation-accent)_10%,transparent)]" />
    </div>
  );
}
