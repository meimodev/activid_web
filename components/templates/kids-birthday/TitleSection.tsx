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
  isSoccerArgentina?: boolean;
}

export function TitleSection({
  hosts,
  date,
  countdownTarget,
  galleryPhotos,
  showCountdown = true,
  isSoccerArgentina,
}: TitleSectionProps) {
  const overlayAssets = useOverlayAssets();
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
  } as const;

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
  } as const;

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
        {slideshowPhotos.length ? (
          <BackgroundSlideshow
            photos={slideshowPhotos}
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.7)_36%,rgba(255,255,255,0.92)_70%,rgba(255,255,255,0.98))]" />
        
        {isSoccerArgentina ? (
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute inset-x-0 bottom-0 top-[20%] bg-repeat bg-size-[300px_300px] opacity-70"
              style={{ backgroundImage: `url(${overlayAssets.soccerSprinkles})` }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.img
              src={overlayAssets.afaSunburst}
              alt=""
              className="absolute -right-[20%] top-[40%] h-[280px] w-[280px] object-contain opacity-40 mix-blend-multiply"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
            <motion.img
              src={overlayAssets.soccerBall}
              alt=""
              className="absolute -left-10 bottom-20 h-[120px] w-[120px] object-contain opacity-80"
              animate={{ y: [0, -15, 0], rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <>
            <motion.div
              className="absolute -top-10 -right-10 h-[280px] w-[280px] bg-contain bg-no-repeat opacity-60 mix-blend-multiply"
              style={{ backgroundImage: `url(${overlayAssets.stars})` }}
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-40 -left-16 h-[200px] w-[200px] bg-contain bg-no-repeat opacity-70"
              style={{ backgroundImage: `url(${overlayAssets.giftBox})` }}
              animate={{ y: [0, 15, 0], rotate: [-15, -5, -15] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-[200px] bg-top bg-cover bg-no-repeat opacity-95"
              style={{ backgroundImage: `url(${overlayAssets.clouds})` }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-6 h-[180px] bg-top bg-contain bg-no-repeat opacity-75"
              style={{ backgroundImage: `url(${overlayAssets.rainbow})` }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-80 mix-blend-multiply"
              style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
              animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 h-[300px] w-[300px] bg-contain bg-no-repeat opacity-50 mix-blend-multiply"
              style={{ backgroundImage: `url(${overlayAssets.stars})` }}
              animate={{ rotate: [0, -90, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center justify-end px-4 pb-14 pt-28 text-center">
        <motion.div
          className="relative w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="relative rounded-[48px] border-4 border-white bg-white/80 px-6 pt-9 pb-10 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent)_30%,transparent),0_30px_80px_rgba(63,19,91,0.14)] backdrop-blur-xl"
            animate={{ rotate: [1, -1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div variants={popVariants}>
              <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-wedding-accent bg-wedding-accent/10 inline-block px-4 py-1 rounded-full border-2 border-wedding-accent/20 -rotate-2">
                {displayHeading}
              </p>
            </motion.div>
            
            <motion.div variants={popVariants}>
              <h2 className="mt-6 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent-2)]">
                {celebrantName}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="mt-5 inline-flex items-center justify-center rounded-2xl bg-wedding-dark px-5 py-2 text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--invitation-dark)_60%,transparent)] rotate-1">
                <span className="font-poppins-bold text-[13px] uppercase tracking-widest">{date}</span>
              </div>
            </motion.div>

            {showCountdown ? (
              <motion.div variants={itemVariants} className="mt-10 grid grid-cols-2 gap-4">
                {(
                  [
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ] as const
                ).map((item, idx) => (
                  <motion.div
                    key={item.label}
                    variants={popVariants}
                    className="relative rounded-[32px] border-4 border-white bg-[linear-gradient(180deg,white,color-mix(in_srgb,var(--invitation-bg)_40%,white))] px-3 py-5 shadow-[0_12px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_30%,transparent)]"
                  >
                    <motion.div
                      animate={{ rotate: (idx % 2 === 0 ? [-2, 2, -2] : [2, -2, 2]) }}
                      transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="font-black text-[38px] leading-none text-wedding-dark [text-shadow:2px_2px_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)]">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="mt-2 font-poppins-bold text-[11px] uppercase tracking-widest text-wedding-accent-2">
                        {item.label}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}

            <motion.div variants={itemVariants}>
              <motion.a
                href={calendarHref}
                target="_blank"
                rel="noreferrer"
                animate={{ scale: [1, 1.05, 1], rotate: [2, -2, 2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileTap={{ scale: 0.95, y: 4, boxShadow: "0 0px 0 0 color-mix(in_srgb,var(--invitation-accent-2)_40%,transparent)" }}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-wedding-accent-2 px-10 py-4 font-poppins-bold text-[14px] uppercase tracking-widest text-white shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_50%,transparent)] transition-all"
              >
                Simpan Tanggal
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
