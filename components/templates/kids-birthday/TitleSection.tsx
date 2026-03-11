"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
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

export function TitleSection({
  hosts,
  date,
  heading,
  countdownTarget,
  galleryPhotos,
  showCountdown = true,
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
  const displayHeading = heading?.trim() || "Time To Party";

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
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[520px] flex-col items-center justify-end px-4 pb-14 pt-28 text-center">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
          <div className="rounded-[40px] border border-wedding-accent/15 bg-white/70 px-5 pt-7 pb-8 shadow-[0_28px_80px_rgba(63,19,91,0.14)] backdrop-blur-xl">
            <p className="font-poppins text-[12px] uppercase tracking-[0.28em] text-wedding-accent">
              {displayHeading}
            </p>
            <h2 className="mt-4 font-poppins-bold text-[40px] leading-none tracking-tight text-wedding-dark">
              {celebrantName}
            </h2>
            <p className="mt-3 font-poppins text-[13px] uppercase tracking-[0.24em] text-wedding-dark/65">
              {date}
            </p>

            {showCountdown ? (
              <div className="mt-8 grid grid-cols-2 gap-3">
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
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22 + idx * 0.06, ease: "easeOut" }}
                    className="rounded-[28px] border border-wedding-accent/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.74))] px-3 py-4 shadow-[0_16px_40px_rgba(96,57,201,0.08)]"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.18 }}
                    >
                      <div className="font-poppins-bold text-[30px] leading-none text-wedding-dark">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="mt-2 font-poppins text-[10px] uppercase tracking-[0.22em] text-wedding-accent-2">
                        {item.label}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : null}

            <motion.a
              href={calendarHref}
              target="_blank"
              rel="noreferrer"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-wedding-accent-2 px-8 py-3 font-poppins-bold text-[12px] uppercase tracking-[0.26em] text-wedding-on-accent-2 shadow-[0_16px_40px_color-mix(in_srgb,var(--invitation-accent-2)_28%,transparent)] transition hover:bg-wedding-accent-2/85"
            >
              Save The Party
            </motion.a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
