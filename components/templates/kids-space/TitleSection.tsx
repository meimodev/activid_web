"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { INVITATION_ZONE } from "@/lib/date-time";
import type { Host } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
  countdownTarget: string;
  galleryPhotos: string[];
  showCountdown?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.85, rotate: -3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
} as const;

function getCountdownParts(targetIso: string) {
  const target = DateTime.fromISO(targetIso, { setZone: true });
  const now = DateTime.now().setZone(INVITATION_ZONE);
  const diff = target.diff(now, ["days", "hours", "minutes", "seconds"]);
  if (diff.milliseconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.max(0, Math.floor(diff.days)),
    hours: Math.max(0, Math.floor(diff.hours)),
    minutes: Math.max(0, Math.floor(diff.minutes)),
    seconds: Math.max(0, Math.floor(diff.seconds)),
  };
}

export function TitleSection({
  hosts,
  date,
  heading,
  countdownTarget,
  galleryPhotos,
  showCountdown,
}: TitleSectionProps) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(countdownTarget));
  const assets = useOverlayAssets();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdownParts(countdownTarget));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownTarget]);

  useEffect(() => {
    if (!galleryPhotos.length) return;
    const timer = setInterval(() => {
      setCurrentBgIndex((i) => (i + 1) % galleryPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryPhotos.length]);

  const calendarLink = useMemo(() => {
    const target = DateTime.fromISO(countdownTarget, { setZone: true });
    const start = target.toFormat("yyyyMMdd'T'HHmmss");
    const end = target.plus({ hours: 3 }).toFormat("yyyyMMdd'T'HHmmss");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(heading)}&dates=${start}/${end}`;
  }, [countdownTarget, heading]);

  return (
    <motion.section
      className="relative overflow-hidden py-20 px-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {galleryPhotos.length > 0 ? (
        <div className="absolute inset-0">
          {galleryPhotos.map((photo, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1500"
              style={{
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === currentBgIndex ? 0.18 : 0,
              }}
            />
          ))}
        </div>
      ) : null}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, var(--invitation-dark) 0%, transparent 40%, transparent 60%, var(--invitation-bg) 100%)`,
          opacity: 0.7,
        }}
      />

      <div
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

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-5 py-1.5 font-garet-book text-[11px] uppercase tracking-[0.25em] text-white/60 backdrop-blur"
          variants={itemVariants}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--invitation-accent-2)" }} />
          {heading}
        </motion.div>

        <motion.h2
          className="text-center font-great-vibes text-[48px] leading-tight text-white"
          style={{ textShadow: "0 0 60px var(--invitation-accent-2), 0 0 100px var(--invitation-accent)" }}
          variants={itemVariants}
        >
          {hosts[0]?.firstName}
        </motion.h2>

        <motion.div
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-1.5 font-garet-book text-[13px] tracking-[0.12em] text-white/65 backdrop-blur"
          variants={itemVariants}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--invitation-accent)" }} />
          {date}
        </motion.div>

        {showCountdown && countdownTarget ? (
          <motion.div className="w-full max-w-xs" variants={itemVariants}>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Hari", value: countdown.days },
                { label: "Jam", value: countdown.hours },
                { label: "Menit", value: countdown.minutes },
                { label: "Detik", value: countdown.seconds },
              ].map((unit, i) => (
                <motion.div
                  key={unit.label}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur"
                    animate={{ rotate: [i % 2 === 0 ? -1 : 1, i % 2 === 0 ? 1 : -1, i % 2 === 0 ? -1 : 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      boxShadow: "0 4px 20px var(--invitation-accent-2)",
                    }}
                  >
                    <span className="font-garet-book text-[28px] font-bold text-white tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </motion.div>
                  <span className="font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.a
          href={calendarLink}
          target="_blank"
          rel="noopener noreferrer"
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-6 py-2 font-garet-book text-[12px] font-bold uppercase tracking-[0.15em] text-white/70 backdrop-blur transition-colors hover:bg-white/[0.14]"
        >
          &#128197; Simpan Tanggal
        </motion.a>
      </div>
    </motion.section>
  );
}
