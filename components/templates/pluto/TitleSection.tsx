"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { TitleSectionProps } from "./InfoSections.types";
import { getCountdownParts, parseInvitationDateTime } from "@/lib/date-time";

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
    <section className="relative h-screen overflow-hidden bg-wedding-bg">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {heroPhoto ? (
          <div
            className="absolute inset-0 bg-cover bg-center scale-[1.04]"
            style={{ backgroundImage: `url(${heroPhoto})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-wedding-dark/30" />
      </div>

      <div className="relative z-10 h-full w-full overflow-hidden">
        <div className="mx-auto flex min-h-full w-full flex-col items-center justify-end">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.08}
            width="100%"
          >
            <div
              className="relative w-full px-4 pt-12 pb-12 text-center bg-center bg-no-repeat bg-linear-to-t from-wedding-bg to-transparent"
              style={{
                backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.bottomTitleGraphic})`,
              }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <OverlayReveal
                  delay={0.06}
                  className="absolute -left-34 scale-x-[-1] bottom-8 h-[220px] w-[220px] bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})`,
                  }}
                />
                <OverlayReveal
                  delay={0.12}
                  className="absolute -right-34 -bottom-6 h-[220px] w-[220px] bg-contain bg-no-repeat"
                  style={{
                    backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})`,
                  }}
                />
                <OverlayReveal
                  delay={0.18}
                  className="absolute -left-36 scale-x-[-1] bottom-12 h-[220px] w-[220px] bg-contain bg-no-repeat z-10"
                  style={{
                    backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})`,
                  }}
                />
                <OverlayReveal
                  delay={0.24}
                  className="absolute -right-30 -bottom-18 h-[220px] w-[220px] bg-contain bg-no-repeat z-10"
                  style={{
                    backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})`,
                  }}
                />
              </div>

              {showCountdown ? (
                <div className="pt-5 flex w-full gap-4 ">
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
                      transition={{
                        duration: 0.65,
                        delay: 0.5 + idx * 0.08,
                        ease: "easeOut",
                      }}
                      className="bg-wedding-accent h-20 w-24 text-center text-wedding-on-accent rounded-full flex items-center justify-center"
                    >
                      <div>
                        <div className="text-[28px] font-semibold leading-none">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-[10px] tracking-[0.18em] uppercase opacity-90">
                          {item.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : null}

              <p className="font-stoic text-[40px] leading-none text-wedding-accent mt-10">
                {displayHeading}
              </p>
              <p className="mt-2 font-tan-mon-cheri text-[30px] font-bold leading-none text-wedding-accent ">
                {hosts[0]?.firstName ?? ""}{hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}
              </p>
              <p className="mt-4 font-garet-book text-[16px] tracking-[0.12em] text-wedding-accent ">
                {date}
              </p>
              <motion.a
                href={calendarHref}
                target="_blank"
                rel="noreferrer"
                animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-7 inline-flex items-center justify-center rounded-full bg-wedding-dark/70 px-8 py-3 font-garet-book font-bold text-[12px] uppercase tracking-[0.28em] text-wedding-on-dark shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:bg-wedding-accent hover:text-wedding-on-accent"
              >
                Save The Date
              </motion.a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
