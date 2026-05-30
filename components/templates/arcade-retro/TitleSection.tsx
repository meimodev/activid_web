"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getCountdownParts, parseInvitationDateTime } from "@/lib/date-time";
import type { InvitationConfig } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

type Hosts = InvitationConfig["sections"]["hosts"]["hosts"];

interface TitleSectionProps {
  hosts: Hosts;
  date: string;
  heading: string;
  countdownTarget: string;
  galleryPhotos: string[];
  showCountdown?: boolean;
}

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.08, staggerDirection: -1, when: "afterChildren" },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: revealEase, when: "beforeChildren", staggerChildren: 0.08 } 
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    transition: { duration: 0.4, ease: revealEase, when: "afterChildren", staggerChildren: 0.05 } 
  },
} as const;

const popVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", bounce: 0.4 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: revealEase } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
} as const;

export function TitleSection({
  hosts,
  date,
  countdownTarget,
  showCountdown = true,
}: TitleSectionProps) {
  const assets = useOverlayAssets();
  const [timeLeft, setTimeLeft] = useState(() => getCountdownParts(countdownTarget));

  useEffect(() => {
    const update = () => setTimeLeft(getCountdownParts(countdownTarget));
    const immediate = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [countdownTarget]);

  const celebrantName = hosts[0]?.firstName || hosts[0]?.shortName || "Player One";
  const displayHeading = "WAKTUNYA PESTA";

  const calendarHref = useMemo(() => {
    const dt = parseInvitationDateTime(countdownTarget);
    if (!dt) return "#";

    const start = dt.startOf("day");
    const end = start.plus({ days: 1 });
    const fmt = (v: typeof start) => v.toFormat("yyyyLLdd");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Birthday Quest: Celebrate ${celebrantName}!`,
      dates: `${fmt(start)}/${fmt(end)}`,
      ctz: "Asia/Jakarta",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [celebrantName, countdownTarget]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent py-20 px-4">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--invitation-accent)] to-wedding-bg opacity-15" />

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />

        {/* Floating background sprites */}
        <motion.div
          className="absolute left-6 top-16"
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet1} alt="" className="w-16 h-auto opacity-30" />
        </motion.div>
        <motion.div
          className="absolute right-8 top-24"
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <img src={assets.moonOrbiter} alt="" className="w-12 h-auto opacity-35" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[500px] flex-col items-center justify-center text-center">
        <motion.div
          className="relative w-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Main Title Console Panel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative bg-wedding-dark rounded-[24px] border-[5px] border-black p-6 shadow-[0_10px_0_0_black,0_15px_30px_rgba(0,0,0,0.35)] overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 40%, var(--invitation-dark) 100%)`,
            }}
          >
            {/* Corner retro slots */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-wedding-accent" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-wedding-accent" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-wedding-accent2" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-wedding-accent2" />

            {/* Level Quest Banner */}
            <motion.div variants={rowVariants} className="flex justify-center mb-4">
              <motion.div variants={popVariants}>
                <p className="font-mono font-bold text-[12px] uppercase tracking-[0.25em] text-white bg-wedding-accent inline-block px-4 py-1.5 rounded-[6px] border-[3px] border-black shadow-[4px_4px_0_0_black]">
                  {displayHeading}
                </p>
              </motion.div>
            </motion.div>

            {/* Celebrant Name Panel */}
            <motion.div variants={rowVariants} className="py-4 border-y-[3px] border-black my-4 bg-black/40">
              <motion.div variants={popVariants}>
                <h2 className="font-black text-[38px] leading-none tracking-tight text-white uppercase [text-shadow:-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,2px_2px_0_#000,4px_4px_0_var(--invitation-accent-2),6px_6px_0_#000]">
                  {celebrantName}
                </h2>
              </motion.div>
            </motion.div>

            {/* Event Time Panel */}
            <motion.div variants={rowVariants} className="py-2 bg-wedding-accent-2/10 border border-wedding-accent-2/20 rounded-[8px] my-3">
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 py-1">
                <span className="font-mono text-[10px] text-wedding-accent-2">LEVEL DATE:</span>
                <span className="font-mono font-black text-[14px] uppercase tracking-widest text-white animate-pulse">
                  {date}
                </span>
              </motion.div>
            </motion.div>

            {/* HP Countdown containers representing time left */}
            {showCountdown && (
              <motion.div variants={rowVariants} className="grid grid-cols-2 gap-3 my-4">
                {(
                  [
                    { label: "DAYS", value: timeLeft.days, color: "red" },
                    { label: "HOURS", value: timeLeft.hours, color: "orange" },
                    { label: "MINUTES", value: timeLeft.minutes, color: "cyan" },
                    { label: "SECONDS", value: timeLeft.seconds, color: "lime" },
                  ] as const
                ).map((item, idx) => {
                  return (
                    <motion.div
                      key={item.label}
                      className="bg-black/50 border-[3px] border-black p-3 rounded-[8px] flex flex-col items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1 + idx * 0.2, repeat: Infinity }}
                        className="relative"
                      >
                        {/* HP Counter text */}
                        <div className="font-mono font-black text-[30px] leading-none text-white [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000,3px_3px_0_var(--invitation-accent)]">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        {/* HP Bar tag */}
                        <div className="mt-1 font-mono font-bold text-[9px] uppercase tracking-wider text-wedding-accent-2/80">
                          {item.label}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Loot Inventory Add Date Quest Action */}
            <motion.div variants={rowVariants} className="flex justify-center mt-6">
              <motion.a
                href={calendarHref}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="relative group inline-flex flex-col items-center justify-center h-[90px] w-full max-w-[240px] rounded-[10px] border-[4px] border-black bg-wedding-accent text-white shadow-[0_6px_0_0_black] hover:bg-wedding-accent/90 active:translate-y-[4px] active:shadow-[0_2px_0_0_black] text-center"
              >
                <span className="font-mono font-black text-[16px] tracking-widest [text-shadow:1.5px_1.5px_0_#000]">
                  ADD TO LOOT
                </span>
                <span className="block text-[8px] tracking-wider text-white/70 font-mono mt-1 font-bold">
                  SAVE DATE INVENTORY
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
