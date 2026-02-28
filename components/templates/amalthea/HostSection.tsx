"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { HostSectionProps } from "./InfoSections.types";

const PHOTO_VIGNETTE_CLASS =
  "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(246,251,255,0)_0%,rgba(246,251,255,0.42)_52%,rgba(246,251,255,0.95)_72%,rgba(246,251,255,1)_100%)]";

function FramedPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto h-[320px] w-[320px]">
      <div
        aria-hidden
        className="absolute inset-2 overflow-hidden rounded-full"
      >
        <div className="absolute inset-0">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <div className={PHOTO_VIGNETTE_CLASS} />
        </div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-0 bg-contain bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.frameFlower})` }}
        animate={{
          x: [0, 2, -1, 0],
          y: [0, -2, 1, 0],
          rotate: [10, 0, 10, 0, 10],
          scale: [1, 0.96, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function HostSection({ hosts, purpose }: HostSectionProps) {
  const petals = useMemo(() => {
    const count = 14;
    return Array.from({ length: count }, (_, i) => {
      const x = (i * 37) % 100;
      const delay = (i * 13) % 24;
      const size = 10 + ((i * 7) % 10);
      const dur = 10 + ((i * 11) % 12);
      const opacity = 0.12 + ((i * 5) % 10) / 100;
      return { x, delay, size, dur, opacity };
    });
  }, []);

  const isBirthday = purpose === "birthday";
  const primary = hosts[0];
  const secondary = hosts[1];
  const celebrantName = (primary?.fullName || primary?.firstName || "").trim();
  const hasSecondHost = Boolean(
    (secondary?.firstName || "").trim() ||
      (secondary?.fullName || "").trim() ||
      (secondary?.photo || "").trim(),
  );

  return (
    <section className="relative bg-[#F6FBFF] py-24 text-[#0B1B2A]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-35 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

        <OverlayReveal
          delay={0.06}
          className="pointer-events-none absolute -left-44 top-[17.5rem] h-[520px] w-[520px] rotate-90"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [8, 10, 8] }}
            transition={{ duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>

        <OverlayReveal
          delay={0.14}
          className="pointer-events-none absolute -right-44 -bottom-40 h-[640px] w-[640px] -rotate-[10deg]"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-10, -8, -10] }}
            transition={{ duration: 14.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>

        {petals.map((p, idx) => (
          <motion.span
            key={idx}
            className="absolute top-[-12px] rotate-[18deg] rounded-full bg-white blur-[0.2px]"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size * 0.65,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, 1200],
              x: [0, 12, -10, 6, 0],
              rotate: [18, 110, 220],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}

        <OverlayReveal
          delay={0.22}
          idle="none"
          className="pointer-events-none absolute -top-14 left-0 right-0 z-10 h-[100px] w-full bg-cover bg-center bg-no-repeat"
        >
          <motion.div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.dividerFlower})`,
            }}
            animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>

        <OverlayReveal
          delay={0.3}
          idle="none"
          className="pointer-events-none absolute -bottom-1 left-0 right-0 z-10 h-[100px] w-full bg-cover bg-center bg-no-repeat"
        >
          <motion.div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.bottomFloral})`,
            }}
            animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[520px] px-4 text-center">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
          <p className="font-poppins text-[14px] leading-relaxed text-[#0B1B2A]/70 ">
            {isBirthday
              ? `Tanpa Mengurangi rasa hormat dengan ini kami mengundang Bapak/Ibu/Saudara-i untuk hadir pada acara ulang tahun ${celebrantName || "kami"}`
              : "Tanpa Mengurangi rasa hormat dengan ini kami mengundang Bapak/Ibu/Saudara-i untuk hadir pada pernikahan kami"}
          </p>
        </RevealOnScroll>

        <div className="mt-14">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.18}
            width="100%"
          >
            <FramedPhoto src={primary?.photo ?? ""} alt={isBirthday ? "Host" : "Host"} />
          </RevealOnScroll>

          <div className="mt-10">
            <RevealOnScroll
              direction="up"
              distance={18}
              delay={0.28}
              width="100%"
            >
              <p className="font-poppins-bold text-[44px] leading-none text-[#0B1B2A] ">
                {primary?.firstName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              direction="up"
              distance={18}
              delay={0.34}
              width="100%"
            >
              <p className="mt-3 font-poppins-bold text-[18px] text-[#0B1B2A] ">
                {primary?.fullName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              direction="up"
              distance={18}
              delay={0.46}
              width="100%"
            >
              <p className="mt-4 font-poppins text-[13px] leading-relaxed text-[#0B1B2A]/70 ">
                {primary?.parents ?? ""}
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {hasSecondHost ? (
          <div>
            <RevealOnScroll
              direction="up"
              distance={18}
              delay={0.56}
              width="100%"
            >
              <div className="mt-14 flex items-center justify-center">
                <div className="h-px flex-1 bg-[#38BDF8]/35" />
                <div className="mx-5 font-poppins-bold text-xs tracking-[0.3em] text-[#0284C7]">
                  AND
                </div>
                <div className="h-px flex-1 bg-[#38BDF8]/35" />
              </div>
            </RevealOnScroll>

            <div className="mt-14">
              <RevealOnScroll
                direction="up"
                distance={18}
                delay={0.64}
                width="100%"
              >
                <FramedPhoto src={secondary?.photo ?? ""} alt={isBirthday ? "Host" : "Host"} />
              </RevealOnScroll>

              <div className="mt-10">
                <RevealOnScroll
                  direction="up"
                  distance={18}
                  delay={0.74}
                  width="100%"
                >
                  <p className="font-poppins-bold text-[44px] leading-none text-[#0B1B2A] ">
                    {secondary?.firstName ?? ""}
                  </p>
                </RevealOnScroll>

                <RevealOnScroll
                  direction="up"
                  distance={18}
                  delay={0.8}
                  width="100%"
                >
                  <p className="mt-3 font-poppins-bold text-[18px] text-[#0B1B2A] ">
                    {secondary?.fullName ?? ""}
                  </p>
                </RevealOnScroll>

                {!isBirthday && secondary?.role ? (
                  <RevealOnScroll
                    direction="up"
                    distance={18}
                    delay={0.86}
                    width="100%"
                  >
                    <p className="mt-3 font-poppins italic text-[14px] text-[#0B1B2A]/65">
                      {secondary.role}
                    </p>
                  </RevealOnScroll>
                ) : null}

                <RevealOnScroll
                  direction="up"
                  distance={18}
                  delay={0.92}
                  width="100%"
                >
                  <p className="mt-5 pb-10 font-poppins text-[13px] leading-relaxed text-[#0B1B2A]/70 ">
                    {secondary?.parents ?? ""}
                  </p>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
