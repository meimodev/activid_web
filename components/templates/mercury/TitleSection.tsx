"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Host } from "@/types/invitation";
import { getCountdownParts, parseInvitationDateTime } from "@/lib/date-time";

interface TitleSectionProps {
  hosts: Host[];
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
  const [timeLeft, setTimeLeft] = useState(() =>
    getCountdownParts(countdownTarget),
  );

  useEffect(() => {
    const update = () => setTimeLeft(getCountdownParts(countdownTarget));
    const immediate = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [countdownTarget]);

  const displayHeading = heading?.trim() || "The Wedding of";

  const marqueePhotos = useMemo(() => {
    const pool = (galleryPhotos || []).filter(Boolean);
    if (pool.length === 0) return [];

    const seedSource = `${hosts[0]?.firstName ?? ""}|${hosts[1]?.firstName ?? ""}|${countdownTarget}`;

    const hashToUint32 = (input: string) => {
      let h = 2166136261;
      for (let i = 0; i < input.length; i += 1) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };

    const mulberry32 = (a: number) => {
      return () => {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };

    const rand = mulberry32(hashToUint32(seedSource));
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    while (selected.length < 8) {
      selected.push(pool[selected.length % pool.length]);
    }

    return selected;
  }, [countdownTarget, galleryPhotos, hosts]);

  const calendarHref = useMemo(() => {
    const dt = parseInvitationDateTime(countdownTarget);
    if (!dt) return "#";

    const start = dt.startOf("day");
    const end = start.plus({ days: 1 });
    const fmt = (v: typeof start) => v.toFormat("yyyyLLdd");

    const title = `Wedding of ${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${fmt(start)}/${fmt(end)}`,
      ctz: "Asia/Jakarta",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [countdownTarget, hosts]);

  return (
    <section className="relative flex flex-col bg-[#612A35] text-[#fff4f6] overflow-hidden py-24">
      <div className="relative z-10 w-full ">
        <div className="mx-auto flex w-full max-w-[920px] flex-col items-center text-center px-4 pt-6 pb-24">
          <div className="relative w-[calc(100%+72px)] -mx-9 overflow-hidden pt-6">
            <motion.div
              className="flex items-center gap-8 px-9 "
              initial={{ x: "-50%" }}
              animate={
                marqueePhotos.length > 0 ? { x: ["-50%", "0%"] } : { x: 0 }
              }
              transition={
                marqueePhotos.length > 0
                  ? { duration: 34, repeat: Infinity, ease: "linear" }
                  : { duration: 0.2 }
              }
              style={{ willChange: "transform" }}
            >
              {[...marqueePhotos, ...marqueePhotos].map((src, i) => (
                <motion.div
                  key={`${src}-${i}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.75,
                    delay:
                      0.12 + (i % Math.max(1, marqueePhotos.length)) * 0.06,
                    ease: [0.2, 0.65, 0.3, 0.9],
                  }}
                  className="h-44 w-44 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    willChange: "transform, opacity",
                  }}
                />
              ))}
            </motion.div>
          </div>

          <div className="mt-12">
            <motion.p
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                delay: 0.22,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="font-stoic text-[48px] leading-none text-[#fff4f6]"
              style={{ willChange: "transform, opacity" }}
            >
              {displayHeading}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                delay: 0.32,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="mt-4 font-tan-mon-cheri text-[72px] leading-[0.98] text-[#fffefe]"
              style={{ willChange: "transform, opacity" }}
            >
              {hosts[0]?.firstName ?? ""}
              {hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.85,
                delay: 0.42,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="mt-6 font-poppins text-[18px] tracking-[0.12em] text-[#fff4f6]"
              style={{ willChange: "transform, opacity" }}
            >
              {date}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.54,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <motion.a
              href={calendarHref}
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-flex items-center justify-center rounded-full bg-white/12 px-10 py-3 font-poppins text-[12px] uppercase tracking-[0.32em] text-white shadow-[0_10px_25px_rgba(44,11,19,0.35)] ring-1 ring-white/35 transition-colors hover:bg-white/18"
              animate={{
                y: [0, -3, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform" }}
            >
              SAVE THE DATE
            </motion.a>
          </motion.div>

          {showCountdown && (
            <div className="font-poppins mt-12 grid w-full max-w-[820px] grid-cols-2 gap-5 ">
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.68,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                className="rounded-2xl bg-white/95 px-6 py-4 text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="text-[32px] leading-none font-semibold">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.18em] uppercase">
                  Hari
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.76,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                className="rounded-2xl bg-white/95 px-6 py-4 text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="text-[32px] leading-none font-semibold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.18em] uppercase">
                  Jam
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.84,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                className="rounded-2xl bg-white/95 px-6 py-4 text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="text-[32px] leading-none font-semibold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.18em] uppercase">
                  Menit
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.92,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
                className="rounded-2xl bg-white/95 px-6 py-4 text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="text-[32px] leading-none font-semibold">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] tracking-[0.18em] uppercase">
                  Detik
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <motion.svg
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-0 right-0 z-0 h-[240px] w-full overflow-hidden"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ willChange: "transform" }}
      >
        <motion.g
          animate={{ x: [0, -1440], y: [0, 14, 0] }}
          transition={{
            x: { duration: 11.5, repeat: Infinity, ease: "linear" },
            y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ willChange: "transform" }}
        >
          <path
            fill="rgba(255,255,255,0.14)"
            d="M0,224L80,234.7C160,245,320,267,480,250.7C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="rgba(255,255,255,0.14)"
            d="M0,224L80,234.7C160,245,320,267,480,250.7C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            transform="translate(1440 0)"
          />
        </motion.g>
        <motion.g
          animate={{ x: [0, -1440], y: [0, 10, 0] }}
          transition={{
            x: { duration: 17.5, repeat: Infinity, ease: "linear" },
            y: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ willChange: "transform" }}
        >
          <path
            fill="rgba(255,255,255,0.10)"
            d="M0,256L96,250.7C192,245,384,235,576,208C768,181,960,139,1152,154.7C1344,171,1536,245,1632,282.7L1728,320L1728,320L1632,320C1536,320,1344,320,1152,320C960,320,768,320,576,320C384,320,192,320,96,320L0,320Z"
          />
          <path
            fill="rgba(255,255,255,0.10)"
            d="M0,256L96,250.7C192,245,384,235,576,208C768,181,960,139,1152,154.7C1344,171,1536,245,1632,282.7L1728,320L1728,320L1632,320C1536,320,1344,320,1152,320C960,320,768,320,576,320C384,320,192,320,96,320L0,320Z"
            transform="translate(1440 0)"
          />
        </motion.g>
        <motion.g
          animate={{ x: [0, -1440], y: [0, 7, 0] }}
          transition={{
            x: { duration: 24.5, repeat: Infinity, ease: "linear" },
            y: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ willChange: "transform" }}
        >
          <path
            fill="rgba(255,255,255,0.08)"
            d="M0,288L120,272C240,256,480,224,720,229.3C960,235,1200,277,1320,298.7L1440,320L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          />
          <path
            fill="rgba(255,255,255,0.08)"
            d="M0,288L120,272C240,256,480,224,720,229.3C960,235,1200,277,1320,298.7L1440,320L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
            transform="translate(1440 0)"
          />
        </motion.g>
      </motion.svg>
    </section>
  );
}
