"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { TitleSectionProps } from "./InfoSections.types";
import { getCountdownParts, parseInvitationDateTime } from "@/lib/date-time";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, DiamondLine, SwoopingLineLeft, SwoopingLineRight, SectionEdgeBottom, BeadedLine } from "./graphics/ornaments";

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

  return (
    <section className="relative min-h-[90vh] py-24 bg-wedding-bg">
      <SectionEdgeBottom />
      {/* Subtle rich background texture */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-[0.03] mix-blend-multiply">
         <img src={EDEN_OVERLAY_ASSETS.leafSide} alt="" className="w-full h-full object-cover rotate-180" />
      </div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none opacity-[0.03] mix-blend-multiply">
         <img src={EDEN_OVERLAY_ASSETS.leafSide2} alt="" className="w-full h-full object-cover" />
      </div>

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
            <div className="mt-12 flex w-full justify-center gap-6 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-10 mix-blend-multiply">
                 <img src={EDEN_OVERLAY_ASSETS.cardFlower} alt="" className="w-full h-full object-contain scale-150" />
              </div>
              {(
                [
                  { label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds },
                ] as const
              ).map((item, idx, arr) => (
                <div key={item.label} className="flex items-center gap-6 relative z-10">
                  <div className="flex flex-col items-center">
                    <span className="font-display text-[32px] text-wedding-accent font-medium leading-none">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="mt-2 font-body text-[11px] uppercase tracking-[0.15em] text-wedding-accent/70 font-bold">
                      {item.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="h-8 w-px bg-wedding-accent/30" />
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        ) : null}

        <RevealOnScroll direction="up" distance={20} delay={0.5}>
          <motion.a
            href={calendarHref}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-14 inline-flex items-center justify-center border border-wedding-accent bg-wedding-bg px-10 py-[0.8rem] font-body font-bold text-[12px] uppercase tracking-[0.2em] text-wedding-accent transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent relative overflow-hidden"
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
