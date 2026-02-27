"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { EventSectionProps } from "./InfoSections.types";

export function EventSection({ events, heading }: EventSectionProps) {
  void heading;

  const cards = Array.isArray(events)
    ? events
    : [
        events.holyMatrimony,
        events.reception,
        ...Object.entries(events)
          .filter(([key]) => key !== "holyMatrimony" && key !== "reception")
          .map(([, v]) => v),
      ].filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-[#4F5B4B] py-24 text-white ">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/green-dust-and-scratches.png')]" />
        <OverlayReveal
          delay={0.06}
          className="absolute left-0 -bottom-30 h-[320px] w-[240px] bg-contain bg-no-repeat opacity-70"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
        />
        <OverlayReveal
          delay={0.12}
          className="absolute -right-20 top-10 h-[320px] w-[240px] scale-x-[-1] bg-contain bg-right bg-no-repeat opacity-70"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
        />
        <div>
          <OverlayReveal
            delay={0.18}
            className="absolute -right-4 top-1/2 h-[220px] w-full rotate-[-20deg] bg-contain bg-right bg-no-repeat translate-y-15 z-20 "
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
          />
          <OverlayReveal
            delay={0.24}
            className="absolute -right-4 top-1/2 h-[140px] w-full rotate-[5deg] bg-contain bg-right bg-no-repeat translate-y-5 z-20 "
            style={{
              backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})`,
            }}
          />
        </div>
        <div>
          <OverlayReveal
            delay={0.3}
            className="absolute -left-15 top-1/2 h-[220px] w-full rotate-[40deg] bg-contain bg-left bg-no-repeat translate-y-25  z-20 "
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
          />
          <OverlayReveal
            delay={0.36}
            className="absolute -left-22 top-1/2 h-[160px] w-full rotate-[50deg] bg-contain bg-left bg-no-repeat translate-y-50  z-20 "
            style={{
              backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})`,
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-4xl">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.08}
            width="100%"
          >
            <div className="flex items-start gap-6 ">
              <div className="shrink-0">
                <p className="font-brittany-signature text-[56px] leading-none text-white ">
                  Wedding
                </p>
                <p className="mt-2 font-stoic text-[56px] leading-none text-white ">
                  Event
                </p>
              </div>

              <div className="mt-10 flex w-full items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white" />
                <div className="h-px flex-1 bg-white" />
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-14 space-y-10">
            {cards.map((data, idx) => (
              <RevealOnScroll
                key={`${data.title}-${idx}`}
                direction="up"
                distance={18}
                delay={0.16 + idx * 0.12}
                width="100%"
              >
                <div className="relative rounded-[34px] bg-[#EFE7D6] px-8 py-12 text-center text-[#2B2424] shadow-[0_18px_55px_rgba(0,0,0,0.22)] ring-1 ring-white/15 ">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                  </div>

                  <p className="relative font-poppins-bold text-[20px] tracking-[0.22em] uppercase text-[#7C5A2A] ">
                    {data.title}
                  </p>

                    <motion.div
                      aria-hidden
                      className="mt-2 h-4 w-full bg-center bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.cardEventDivider})`,
                      }}
                      animate={{ y: [0, 2, 0] }}
                      transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                    />

                  <p className="relative mt-6 font-poppins-bold text-[18px] text-[#2B2424] ">
                    {data.date}
                  </p>
                  <p className="relative mt-2 font-poppins text-[18px] text-[#7C5A2A]">
                    {data.time}
                  </p>
                  <p className="relative font-poppins text-[18px] text-[#7C5A2A]">
                    {data.venue}
                  </p>

                  <a
                    href={data.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative mt-4 uppercase inline-flex min-w-[210px] items-center justify-center rounded-full bg-[#7A5A2A] px-10 py-3 font-poppins-bold text-[12px] tracking-[0.22em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#6B4F25]"
                  >
                    Link Map
                  </a>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
