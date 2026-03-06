"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { SplitText } from "@/components/animations";
import { useWindowSize } from "@/hooks";
import { getCountdownParts } from "@/lib/date-time";

import { neptuneSerif } from "./fonts";
import { NeptuneStagger } from "./reveal";
import type { NavSectionId } from "./types";
import {
  NEPTUNE_OVERLAY_ASSETS,
  NeptuneOverlayFloat,
  TitleDecoration10,
} from "./graphics";

export function TitleCountdownSection({
  id,
  backgroundPhotos,
  date,
  coupleLabel,
  targetDate,
}: {
  id: NavSectionId;
  backgroundPhotos?: string[];
  date: string;
  coupleLabel: string;
  targetDate: string;
}) {
  const { isMobile } = useWindowSize();

  const photos = useMemo(() => {
    const list = backgroundPhotos ?? [];
    const safe = list.filter(Boolean);
    return safe;
  }, [backgroundPhotos]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 7200);
    return () => window.clearInterval(t);
  }, [photos.length]);

  const safeActiveIndex = photos.length > 0 ? activeIndex % photos.length : 0;
  const activePhoto = photos[safeActiveIndex];

  return (
    <section
      id={id}
      className="relative h-screen overflow-hidden text-wedding-text"
    >
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false}>
            {activePhoto ? (
              <motion.div
                key={`${safeActiveIndex}-${activePhoto}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
                }}
                className="absolute inset-0"
              >
                <motion.div
                  initial={{ scale: 1.06 }}
                  animate={{ scale: 1.14 }}
                  transition={{ duration: 12, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activePhoto}
                    alt="Background"
                    fill
                    className="object-cover opacity-[0.36]"
                    unoptimized
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[72%] bg-linear-to-t from-wedding-bg via-wedding-bg/82 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,0.08),transparent_68%)]" />
      </div>

      <div className="absolute -left-4 bottom-10 z-10">
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
          alt=""
          className="w-[140px] max-w-[55vw] "
          amplitude={4.6}
          duration={8.6}
          rotate={1}
          breeze
          loading="eager"
          draggable={false}
        />
      </div>
      <div className="absolute -right-10 bottom-15 z-10">
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafRight}
          alt=""
          className="w-[140px] max-w-[55vw] "
          amplitude={5.4}
          duration={9.2}
          delay={0.15}
          rotate={-1}
          breeze
          loading="eager"
          draggable={false}
        />
      </div>

      <motion.div
        className="absolute inset-x-0 -bottom-30 z-30 pointer-events-none flex justify-center"
        initial={false}
        animate={{
          y: [0, isMobile ? -6 : -10, isMobile ? 4 : 6, isMobile ? -4 : -6, 0],
        }}
        transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <TitleDecoration10 className="w-full bg-wedding" />
      </motion.div>

      <div className="relative z-30 h-screen flex flex-col items-center justify-end text-center px-6 pb-32 pt-18">
        <NeptuneStagger className="relative w-full max-w-sm" baseDelay={0.15}>
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[240px] h-[360px] rounded-t-[999px] border border-wedding-text/15 opacity-25" />
          </div>

          <p
            className={`${neptuneSerif.className} relative z-10 text-sm tracking-[0.28em] uppercase text-wedding-text-light`}
          >
            The Wedding Of
          </p>
          <h2
            className={`${neptuneSerif.className} relative z-10 mt-4 text-5xl leading-none text-wedding-text`}
          >
            <SplitText text={coupleLabel} splitBy="word" staggerDelay={0.09} />
          </h2>
          <p className="relative z-10 mt-4 text-lg tracking-wide text-wedding-text-light font-body">
            {date}
          </p>
          <p className="relative z-10 mt-10 text-xs tracking-[0.45em] uppercase text-wedding-text-light font-body">
            SAVE THE DATE
          </p>
          <div className="relative z-10 mt-6">
            <CountdownRow targetDate={targetDate} />
          </div>
        </NeptuneStagger>
      </div>
    </section>
  );
}

function CountdownRow({ targetDate }: { targetDate: string }) {
  const compute = (raw: string) => getCountdownParts(raw);

  const [timeLeft, setTimeLeft] = useState(() => compute(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(compute(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const cells = [
    { label: "Hari", value: pad2(timeLeft.days) },
    { label: "Jam", value: pad2(timeLeft.hours) },
    { label: "Menit", value: pad2(timeLeft.minutes) },
    { label: "Detik", value: pad2(timeLeft.seconds) },
  ];

  return (
    <NeptuneStagger
      className="grid grid-cols-4 gap-3"
      baseDelay={0.08}
      staggerStep={0.26}
    >
      {cells.map((c) => (
        <div key={c.label}>
          <div className="rounded-2xl border border-wedding-on-dark/20 bg-wedding-on-dark/10 px-2 py-3 shadow-[0_10px_35px_color-mix(in_srgb,var(--invitation-dark)_12%,transparent)]">
            <div
              className={`${neptuneSerif.className} text-3xl leading-none text-wedding-on-dark`}
            >
              {c.value}
            </div>
            <div className="mt-2 text-[12px] leading-none text-wedding-on-dark/85 font-body">
              {c.label}
            </div>
          </div>
        </div>
      ))}
    </NeptuneStagger>
  );
}
