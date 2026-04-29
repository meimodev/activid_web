"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
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
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

export function TitleSection({
  hosts,
  date,
  countdownTarget,
  galleryPhotos,
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

  const slideshowPhotos = useMemo(() => {
    return (galleryPhotos || []).filter(Boolean);
  }, [galleryPhotos]);

  const celebrantName = hosts[0]?.firstName || hosts[0]?.shortName || "Birthday Star";
  const displayHeading = "Waktunya Pesta";

  const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.1, staggerDirection: -1, when: "afterChildren" },
    },
  };

  const rowVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: revealEase, when: "beforeChildren", staggerChildren: 0.1 } 
    },
    exit: { 
      opacity: 0, 
      x: 60, 
      transition: { duration: 0.5, ease: revealEase, when: "afterChildren", staggerChildren: 0.05 } 
    },
  };

  const popVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, scale: 0.8, x: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.7, type: "spring", bounce: 0.4 },
    },
    exit: { opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.4, ease: revealEase } },
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: revealEase } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.5, ease: revealEase } },
  };

  const calendarHref = useMemo(() => {
    const dt = parseInvitationDateTime(countdownTarget);
    if (!dt) return "#";

    const start = dt.startOf("day");
    const end = start.plus({ days: 1 });
    const fmt = (v: typeof start) => v.toFormat("yyyyLLdd");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Birthday Party of ${celebrantName}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      ctz: "Asia/Jakarta",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [celebrantName, countdownTarget]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-wedding-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--invitation-accent)] to-wedding-bg opacity-20" />

        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />
        <motion.div
          className="absolute left-8 top-16"
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.heroGraphic} alt="" className="w-20 h-auto opacity-50" />
        </motion.div>
        <motion.div
          className="absolute right-6 top-20"
          animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <img src={assets.floatingPlanet1} alt="" className="w-24 h-auto opacity-45" />
        </motion.div>
        <motion.div
          className="absolute left-10 bottom-24"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <img src={assets.moonOrbiter} alt="" className="w-12 h-auto opacity-50" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center justify-end pb-14 pt-28 text-center overflow-x-hidden">
        <motion.div
          className="relative w-[110%] -ml-[5%]"
          animate={{ rotate: [1, -1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Chaotic Solid Shadow */}
          <div className="absolute inset-0 bg-black rotate-[1.5deg] translate-y-[12px] z-0" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative bg-white grid grid-cols-2 overflow-hidden z-10"
          >
            {/* Asymmetrical Top Border */}
            <svg className="absolute top-0 left-0 w-full h-[16px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 16">
              <polygon points="0,0 100,0 100,8 0,16" fill="black" />
            </svg>
            
            {/* Asymmetrical Bottom Border */}
            <svg className="absolute bottom-0 left-0 w-full h-[18px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 18">
              <polygon points="0,10 100,0 100,18 0,18" fill="black" />
            </svg>
            {/* Title Panel */}
            <motion.div variants={rowVariants} className="relative col-span-2 px-6 py-8 bg-white bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:16px_16px] flex justify-center items-center">
              <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[5px] bg-black rotate-1 z-20 pointer-events-none" />
              <motion.div variants={popVariants} className="relative z-30">
                <p className="font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent inline-block px-4 py-1.5 rounded-full border-[3px] border-black shadow-[4px_4px_0_0_black] -rotate-2">
                  {displayHeading}
                </p>
              </motion.div>
            </motion.div>

            {/* Name Panel */}
            <motion.div variants={rowVariants} className="relative col-span-2 px-6 py-6 bg-white flex justify-center items-center">
              <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[6px] bg-black -rotate-1 z-20 pointer-events-none" />
              <motion.div variants={popVariants} className="relative z-30">
                <h2 className="font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,5px_5px_0_var(--invitation-accent-2),7px_7px_0_black]">
                  {celebrantName}
                </h2>
              </motion.div>
            </motion.div>

            {/* Date Panel (Col 1, Row 3) */}
            <motion.div variants={rowVariants} className="relative col-span-1 py-6 bg-wedding-accent-2 flex justify-center items-center">
              <div className="absolute top-[-10px] right-[-3px] w-[6px] h-[1000px] bg-black -rotate-[1deg] origin-top z-20 pointer-events-none" />
              {showCountdown && <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[4px] bg-black rotate-[0.5deg] z-20 pointer-events-none" />}
              
              <motion.div variants={itemVariants} className="relative z-30">
                <span className="font-garet-book font-black text-[15px] uppercase tracking-[0.2em] text-white [text-shadow:-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black,1px_1px_0_black,2px_2px_0_black]">
                  {date}
                </span>
              </motion.div>
            </motion.div>

            {/* Countdown Grid mapped into main grid */}
            {showCountdown ? (
              <>
                {(
                  [
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ] as const
                ).map((item, idx) => {
                  return (
                    <motion.div
                      key={item.label}
                      variants={rowVariants}
                      className={`relative col-span-1 p-5 flex flex-col items-center justify-center ${idx === 2 ? 'bg-wedding-accent/10' : 'bg-white'}`}
                    >
                      {idx === 1 && <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[5px] bg-black -rotate-[1deg] z-20 pointer-events-none" />}
                      <motion.div
                        animate={{ rotate: (idx % 2 === 0 ? [-2, 2, -2] : [2, -2, 2]) }}
                        transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-30"
                      >
                        <div className="font-black text-[38px] leading-none text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black,4px_4px_0_var(--invitation-accent)]">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="mt-2 font-garet-book font-bold text-[11px] uppercase tracking-widest text-black">
                          {item.label}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </>
            ) : null}

            {/* Bottom Panel: Save Date Action */}
            <motion.div variants={rowVariants} className="relative col-span-1 bg-wedding-accent bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:12px_12px] flex justify-center items-center p-6 z-20">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Comic Action Spikes Radiating from behind the button */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] sm:w-[600px] h-[300px] z-[-1] opacity-60 -rotate-12" preserveAspectRatio="none" viewBox="0 0 300 240">
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
              </div>

              <motion.div variants={itemVariants} className="relative z-50 -mt-[40px] -ml-[40px]">
                <motion.a
                  href={calendarHref}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 2, boxShadow: "2px 2px 0 0 black" }}
                  className="inline-flex flex-col items-center justify-center h-[130px] w-[160px] rounded-[60%_80%_70%_10%/70%_60%_80%_10%] font-black text-[20px] uppercase tracking-widest border-[4px] border-black bg-white shadow-[6px_6px_0_0_black] transition-all -rotate-3"
                  style={{ color: `var(--invitation-accent)` }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="block leading-none [text-shadow:2px_2px_0_black,3px_3px_0_black]">Simpan</span>
                  <span className="block leading-none [text-shadow:2px_2px_0_black,3px_3px_0_black] mt-1">Tanggal</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
