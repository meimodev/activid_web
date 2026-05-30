"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, useCallback } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { TitleSectionProps } from "./InfoSections.types";
import { getCountdownParts, parseInvitationDateTime } from "@/lib/date-time";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, DiamondLine, SwoopingLineLeft, SwoopingLineRight, SectionEdgeBottom, BeadedLine } from "./graphics/ornaments";
import { GrowingSwayingFloral } from "./graphics/GrowingSwayingFloral";

function ChangingPhotoBg({ photos }: { photos: string[] }) {
  const pool = useMemo(() => (photos || []).filter(Boolean), [photos]);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const advance = useCallback(() => {
    if (pool.length <= 1) return;
    setPrevIndex(index);
    setIndex((i) => (i + 1) % pool.length);
  }, [pool.length, index]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const timer = window.setInterval(advance, 5000);
    return () => window.clearInterval(timer);
  }, [advance, pool.length]);

  if (pool.length === 0) return null;

  const variants = {
    enter: { opacity: 0, scale: 1.18 },
    center: { opacity: 1, scale: 1, transition: { duration: 2.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, scale: 0.92, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Overlay gradient to keep text readable */}
      <div className="absolute inset-0 z-10 bg-wedding-bg/70" />

      <AnimatePresence initial={false}>
        <motion.div
          key={pool[index]}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pool[index]})` }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        />
      </AnimatePresence>

      {/* Previous photo lingers slightly for dreamy overlap */}
      {prevIndex !== null && (
        <motion.div
          key={`prev-${pool[prevIndex]}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pool[prevIndex]})` }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

export function TitleSection({
  hosts,
  date,
  heading,
  countdownTarget,
  galleryPhotos,
  showCountdown = true,
}: TitleSectionProps) {
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

  const displayHeading = heading?.trim() || "The Wedding of";

  const heroPhoto = useMemo(() => {
    const pool = (galleryPhotos || []).filter(Boolean);
    return pool[0] || null;
  }, [galleryPhotos]);

  const calendarHref = useMemo(() => {
    const dt = parseInvitationDateTime(countdownTarget);
    if (!dt) return "#";

    const start = dt.startOf("day");
    const end = start.plus({ days: 1 });
    const fmt = (v: typeof start) => v.toFormat("yyyyLLdd");

    const primary = hosts[0];
    const secondary = hosts[1];
    const title = `Wedding of ${primary?.firstName ?? ""}${secondary?.firstName ? ` & ${secondary.firstName}` : ""}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${fmt(start)}/${fmt(end)}`,
      ctz: "Asia/Jakarta",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [countdownTarget, hosts]);

  const countdownItems = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ] as const;

  return (
    <section className="relative min-h-[90vh] py-24 bg-wedding-bg overflow-hidden">
      <SectionEdgeBottom />

      {/* Changing photo background */}
      <ChangingPhotoBg photos={galleryPhotos} />

      {/* Subtle rich background texture */}
      <GrowingSwayingFloral
        src={EDEN_OVERLAY_ASSETS.leafSide}
        initialRotate={180}
        className="absolute top-0 right-0 w-[240px] h-[240px] pointer-events-none opacity-[0.12] mix-blend-multiply"
        growDelay={0.3}
        swayDuration={8.5}
        originX="90%"
        originY="10%"
      />
      <GrowingSwayingFloral
        src={EDEN_OVERLAY_ASSETS.leafSide2}
        initialRotate={0}
        className="absolute bottom-0 left-0 w-[280px] h-[280px] pointer-events-none opacity-[0.12] mix-blend-multiply"
        growDelay={0.4}
        swayDuration={9.0}
        originX="10%"
        originY="90%"
      />

      <div className="mx-auto flex w-full max-w-[500px] flex-col items-center px-6 text-center z-10 relative">
        <RevealOnScroll direction="up" distance={20} delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <SwoopingLineLeft />
            <DiamondLine />
            <SwoopingLineRight />
          </div>
          <p className="font-display italic text-[36px] leading-none text-wedding-accent">
            {displayHeading}
          </p>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={20} delay={0.2}>
          <h2 className="mt-6 font-display text-[44px] leading-tight text-wedding-accent">
            {hosts[0]?.firstName ?? ""}
            {hosts[1]?.firstName ? (
              <>
                <span className="mx-3 block font-body italic text-[32px] font-normal text-wedding-accent/70">&</span>
                {hosts[1]?.firstName}
              </>
            ) : (
              ""
            )}
          </h2>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={20} delay={0.3}>
          <div className="my-8 flex flex-col items-center justify-center">
            <div className="h-10 w-px bg-wedding-accent/30" />
            <div className="w-24 h-12 my-2 opacity-70 mix-blend-multiply">
              <img src={EDEN_OVERLAY_ASSETS.dividerFlower2} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="h-10 w-px bg-wedding-accent/30" />
          </div>
          <BeadedLine />
          <p className="font-body text-[16px] tracking-[0.2em] uppercase font-semibold text-wedding-accent">
            {date}
          </p>
        </RevealOnScroll>

        {showCountdown ? (
          <RevealOnScroll direction="up" distance={20} delay={0.4}>
            <motion.div
              className="mt-12 w-full relative"
              whileHover={{ scale: 1.01 }}
            >
              {/* Box wrapper around all timer elements */}
              <div className="relative overflow-hidden rounded-[28px] border-2 border-wedding-accent/40 bg-wedding-bg/60 backdrop-blur-md px-8 py-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                {/* Inner border accent */}
                <div className="absolute inset-2 rounded-[22px] border border-wedding-accent/15 pointer-events-none" />

                {/* Subtle inner glow at corners */}
                <CornerLineTopLeft />
                <div className="absolute bottom-0 right-0 pointer-events-none opacity-40">
                  <CornerLineBottomRight />
                </div>

                {/* Decorative top label */}
                <p className="text-[11px] tracking-[0.35em] uppercase font-bold font-body text-wedding-accent/60 mb-8">
                  Menuju Hari Bahagia
                </p>

                <div className="flex w-full justify-center gap-6 relative z-10">
                  {countdownItems.map((item, idx, arr) => (
                    <div key={item.label} className="flex items-center gap-6">
                      <motion.div
                        className="flex flex-col items-center"
                        key={item.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{
                          duration: 1,
                          ease: "easeInOut",
                          ...(idx === arr.length - 1 ? { repeat: Infinity, repeatDelay: 0 } : {}),
                        }}
                      >
                        <span className="font-display text-[34px] text-wedding-accent font-medium leading-none tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </span>
                        <span className="mt-2 font-body text-[11px] uppercase tracking-[0.15em] text-wedding-accent/70 font-bold">
                          {item.label}
                        </span>
                      </motion.div>
                      {idx < arr.length - 1 && (
                        <div className="h-10 w-px bg-wedding-accent/25" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </RevealOnScroll>
        ) : null}

        <RevealOnScroll direction="up" distance={20} delay={0.5}>
          <motion.a
            href={calendarHref}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 inline-flex items-center justify-center border border-wedding-accent bg-wedding-bg px-10 py-[0.8rem] font-body font-bold text-[12px] uppercase tracking-[0.2em] text-wedding-accent transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent relative overflow-hidden"
          >
            <span className="relative z-10">Save The Date</span>
          </motion.a>
        </RevealOnScroll>
      </div>

      {heroPhoto && (
        <RevealOnScroll direction="up" distance={30} delay={0.6}>
          <div className="mx-auto mt-24 w-full max-w-[420px] px-6 relative z-10">
            <div className="relative aspect-[3/4] w-full p-4">
              <div className="absolute inset-0 rounded-t-[160px] rounded-b-[40px] border-[1px] border-wedding-accent/40" />
              <div className="absolute inset-2 rounded-t-[150px] rounded-b-[30px] border-[1px] border-wedding-accent/20" />
              <div className="absolute -top-3 -left-3 z-10 pointer-events-none opacity-50">
                <CornerLineTopLeft />
              </div>
              <div className="absolute -bottom-3 -right-3 z-10 pointer-events-none opacity-50">
                <CornerLineBottomRight />
              </div>
              <div
                className="relative h-full w-full rounded-t-[140px] rounded-b-[20px] bg-cover bg-center overflow-hidden bg-wedding-dark/5"
                style={{ backgroundImage: `url(${heroPhoto})` }}
              />
            </div>
          </div>
        </RevealOnScroll>
      )}
    </section>
  );
}
