"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { SplitText } from "@/components/animations";
import { parseInvitationDateTime } from "@/lib/date-time";
import type { Host } from "@/types/invitation";

import { neptuneScript } from "./fonts";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";

export function HeroSection({
  hosts,
  targetDate,
  coverImage,
  guestName,
  isOpening,
  onOpen,
}: {
  hosts: Host[];
  targetDate: string;
  coverImage: string;
  guestName: string;
  isOpening: boolean;
  onOpen: () => void;
}) {
  const primary = hosts[0];
  const secondary = hosts[1];

  const heroDate = useMemo(() => {
    const raw = `${targetDate ?? ""}`.trim();
    if (!raw) return raw;

    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      const yyyy = m[1] ?? "";
      const mm = m[2] ?? "";
      const dd = m[3] ?? "";
      return `${dd} . ${mm} . ${yyyy}`;
    }

    const dt = parseInvitationDateTime(raw);
    if (dt) {
      return dt.toFormat("dd . MM . yyyy");
    }

    return raw;
  }, [targetDate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 34 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.75,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
        when: "beforeChildren" as const,
        staggerChildren: 0.24,
        delayChildren: 0.18,
      },
    },
    open: {
      opacity: 0,
      y: -22,
      scale: 0.985,
      transition: {
        duration: 0.52,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        when: "afterChildren" as const,
        staggerChildren: 0.08,
        staggerDirection: -1 as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.3,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
    open: {
      opacity: 0,
      y: -26,
      scale: 0.95,
      transition: {
        duration: 0.42,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 28, scale: 1.08 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.55,
        ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
      },
    },
    open: {
      opacity: 0,
      y: -22,
      scale: 1.03,
      transition: {
        duration: 0.46,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-wedding-bg-alt text-wedding-text">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(120deg, var(--invitation-accent-2-light), var(--invitation-accent-2), var(--invitation-dark), var(--invitation-accent-2-light))",
          backgroundSize: "320% 320%",
        }}
        animate={{ backgroundPosition: ["0% 45%", "100% 55%", "0% 45%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--invitation-on-dark) 45%, transparent), transparent)",
          backgroundSize: "240% 100%",
          mixBlendMode: "overlay",
        }}
        animate={{ backgroundPosition: ["-120% 0%", "160% 0%"] }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2.4,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-wedding-accent-2/20 via-wedding-dark/50 to-wedding-dark/70" />

      <div className="relative z-10 h-full px-5 flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 z-0">
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
            alt=""
            className="absolute -left-10 bottom-12 w-[200px] opacity-25"
            amplitude={4.8}
            duration={10.2}
            rotate={1.1}
            breeze
            loading="eager"
            draggable={false}
          />
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.leafRight}
            alt=""
            className="absolute -right-12 top-10 w-[220px] opacity-20"
            amplitude={5.2}
            duration={10.6}
            delay={0.2}
            rotate={-1.1}
            breeze
            loading="eager"
            draggable={false}
          />
          <NeptuneOverlayFloat
            src={NEPTUNE_OVERLAY_ASSETS.flowerDouble}
            alt=""
            className="absolute -right-28 -top-20 w-[320px] opacity-10 rotate-12"
            amplitude={3.8}
            duration={12.4}
            delay={0.1}
            rotate={-0.9}
            breeze
            loading="eager"
            draggable={false}
          />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isOpening ? "open" : "show"}
          className="relative z-10 w-full max-w-[420px]"
        >
          <div className="relative overflow-visible rounded-[44px] border border-wedding-on-dark/35 bg-wedding-bg shadow-[0_40px_90px_color-mix(in_srgb,var(--invitation-dark)_50%,transparent)] p-[6px]">
            <div className="rounded-[38px] overflow-hidden border border-wedding-text/15 bg-wedding-bg">
              <motion.div variants={imageVariants} className="px-4 pt-4">
                <div className="relative w-full aspect-[4/3] rounded-t-[999px] rounded-b-none border border-wedding-text/15 bg-wedding-dark">
                  <div className="absolute inset-[7px] rounded-t-[999px] rounded-b-none overflow-hidden border border-wedding-on-dark/35">
                    <Image
                      src={coverImage}
                      alt="Cover"
                      fill
                      sizes="(max-width: 768px) 90vw, 420px"
                      className="object-cover object-[center_30%]"
                      unoptimized
                      priority
                    />
                    <div className="absolute inset-0 bg-wedding-dark/40" />
                  </div>

                  <motion.div
                    variants={itemVariants}
                    className="pointer-events-none absolute inset-x-0 -bottom-4"
                  >
                    <NeptuneOverlayFloat
                      src={NEPTUNE_OVERLAY_ASSETS.ribbonBottom}
                      alt=""
                      className="w-full px-8"
                      amplitude={4.8}
                      duration={8.8}
                      delay={0.15}
                      loading="eager"
                      draggable={false}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <div className=" pt-14 pb-9 text-center">
                <motion.h1
                  variants={itemVariants}
                  className={`${neptuneScript.className} mt-4 text-4xl leading-none text-wedding-accent`}
                >
                  <SplitText
                    text={`${primary?.firstName ?? ""}${secondary?.firstName ? ` & ${secondary.firstName}` : ""}`}
                    splitBy="character"
                    once
                    staggerDelay={0.055}
                  />
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-sm tracking-[0.35em] uppercase text-wedding-text-light"
                >
                  {heroDate}
                </motion.p>

                <motion.p
                  variants={itemVariants}
                  className="mt-12 text-sm leading-relaxed text-wedding-text-light"
                >
                  Kepada Yth. Bapak/Ibu/Saudara/i
                  <br />
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="mt-2 text-3xl leading-none tracking-wide text-wedding-text font-body"
                >
                  {guestName}
                </motion.p>
                <motion.div variants={itemVariants} className="mt-9">
                  <motion.button
                    type="button"
                    onClick={onOpen}
                    disabled={isOpening}
                    initial={false}
                    animate={
                      isOpening
                        ? { scale: 0.96, opacity: 0, y: -8 }
                        : { scale: [1, 1.025, 1], opacity: 1, y: 0 }
                    }
                    transition={
                      isOpening
                        ? {
                            duration: 0.42,
                            ease: [0.4, 0, 0.2, 1],
                          }
                        : {
                            duration: 2.8,
                            repeat: Infinity,
                            repeatDelay: 2.6,
                            ease: "easeInOut",
                          }
                    }
                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg bg-wedding-accent text-wedding-on-accent px-6 py-3 shadow-md transition hover:bg-wedding-accent/90 disabled:pointer-events-none"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-wedding-on-dark/40 to-transparent"
                      initial={{ x: "-120%", opacity: 0 }}
                      animate={
                        isOpening
                          ? { x: "-120%", opacity: 0 }
                          : { x: ["-120%", "160%"], opacity: [0, 1, 0] }
                      }
                      transition={
                        isOpening
                          ? { duration: 0.2, ease: "easeOut" }
                          : {
                              duration: 1.15,
                              repeat: Infinity,
                              repeatDelay: 4.2,
                              ease: "easeInOut",
                            }
                      }
                    />
                    <span className="relative z-10 text-sm font-body tracking-wide">
                      Buka Undangan
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="pointer-events-none absolute inset-x-0 -bottom-6 -left-18 w-full px-12"
            >
              <NeptuneOverlayFloat
                src={NEPTUNE_OVERLAY_ASSETS.ribbonBottomWide}
                alt=""
                className="w-full"
                amplitude={5.2}
                duration={9.4}
                delay={0.35}
                loading="eager"
                draggable={false}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
