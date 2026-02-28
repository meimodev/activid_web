"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { TitleSectionProps } from "./InfoSections.types";

export function TitleSection({
  hosts,
  date,
  heading,
  countdownTarget,
  galleryPhotos,
  showCountdown = true,
  purpose,
}: TitleSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(countdownTarget);

    const timer = window.setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdownTarget]);

  const displayHeading =
    heading?.trim() || (purpose === "birthday" ? "Birthday Invitation" : "The Wedding of");

  const slideshowPhotos = useMemo(() => {
    return (galleryPhotos || []).filter(Boolean);
  }, [galleryPhotos]);

  const calendarHref = useMemo(() => {
    const datePart = (countdownTarget || "").split("T")[0];
    if (!datePart) return "#";

    const [y, m, d] = datePart.split("-").map((v) => Number(v));
    if (!y || !m || !d) return "#";

    const startDate = new Date(y, m - 1, d);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const pad2 = (n: number) => String(n).padStart(2, "0");
    const fmt = (dt: Date) =>
      `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}`;

    const primary = hosts[0];
    const secondary = hosts[1];
    const primaryName = primary?.firstName || "";
    const secondaryName = secondary?.firstName || "";

    const title =
      purpose === "birthday"
        ? `Birthday of ${primaryName}`
        : `Wedding of ${primaryName}${secondaryName ? ` & ${secondaryName}` : ""}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${fmt(startDate)}/${fmt(endDate)}`,
      ctz: "Asia/Jakarta",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [countdownTarget, hosts, purpose]);

  return (
    <section className="relative h-screen overflow-hidden bg-[#F6FBFF]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {slideshowPhotos.length ? (
          <BackgroundSlideshow
            photos={slideshowPhotos}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/30" />
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
              className="relative w-full px-4 pt-12 pb-12 text-center bg-center bg-no-repeat bg-linear-to-t from-[#F6FBFF] to-transparent"
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
                      className="bg-[#38BDF8] h-20 w-24 text-center text-white rounded-[24px] flex items-center justify-center shadow-[0_14px_30px_rgba(56,189,248,0.25)]"
                    >
                      <motion.div
                        animate={{ scale: [0.96, 1.04, 0.96] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.2,
                        }}
                      >
                        <div className="text-[28px] font-semibold leading-none">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-[10px] tracking-[0.18em] uppercase opacity-90">
                          {item.label}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              ) : null}

              <p className="font-poppins text-[16px] tracking-[0.22em] uppercase text-[#0284C7] mt-10">
                {displayHeading}
              </p>
              <p className="mt-4 font-poppins-bold text-[36px] leading-none text-[#0B1B2A] ">
                {hosts[0]?.firstName ?? ""} {hosts[1]?.firstName ? "&" : ""} {hosts[1]?.firstName ?? ""}
              </p>
              <p className="mt-4 font-poppins text-[14px] tracking-[0.24em] uppercase text-[#0B1B2A]/70 ">
                {date}
              </p>
              <motion.a
                href={calendarHref}
                target="_blank"
                rel="noreferrer"
                animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-7 inline-flex items-center justify-center rounded-full bg-[#0B1B2A]/72 px-8 py-3 font-poppins-bold text-[12px] uppercase tracking-[0.28em] text-white shadow-[0_14px_30px_rgba(11,27,42,0.22)] transition hover:bg-[#0B1B2A]/80"
              >
                {purpose === "birthday" ? "Save The Day" : "Save The Date"}
              </motion.a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
