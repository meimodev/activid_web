"use client";

import { motion } from "framer-motion";
import { InvitationConfig } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";
import {
  formatInvitationDateLong,
  formatInvitationTime,
} from "@/lib/date-utils";

type EventsConfig = InvitationConfig["sections"]["event"]["events"];

interface EventSectionProps {
  events: EventsConfig;
  heading: string;
}

export function EventSection({ events, heading }: EventSectionProps) {
  const titleRight = heading?.trim().split(/\s+/).slice(-1)[0] || "Event";

  const cards = events;

  return (
    <section className="relative overflow-hidden bg-[#F8F4EC] py-24 text-[#612A35] ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-4xl">
          <RevealOnScroll
            direction="up"
            distance={20}
            delay={0.08}
            width="100%"
          >
            <div className="flex items-start gap-6 ">
              <div className="shrink-0">
                <p className="font-tan-mon-cheri text-[56px] leading-none text-[#612A35] ">
                  Wedding
                </p>
                <p className="-mt-3 font-stoic text-[56px] leading-none text-[#612A35] ">
                  {titleRight}
                </p>
              </div>

              <div className="mt-10 flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-[#612A35]" />
                <div className="h-2 w-2 rounded-full bg-[#612A35]" />
                <div className="h-px flex-1 bg-[#612A35]" />
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-14 space-y-10">
            {cards.map((ev, idx) => {
              const isLeft = idx % 2 === 0;
              const delay = 0.18 + idx * 0.1;
              return (
                <RevealOnScroll
                  key={`${ev.title}-${idx}`}
                  direction="up"
                  distance={22}
                  delay={delay}
                  width="100%"
                >
                  <div className="relative overflow-visible rounded-[38px] bg-[#62353f] px-8 py-12 text-center text-white shadow-[0_22px_55px_rgba(44,11,19,0.20)] ring-1 ring-white/10 ">
                    <motion.div
                      aria-hidden
                      className={`pointer-events-none absolute -bottom-8 ${isLeft ? "-left-6" : "right-16"} h-[180px] w-[180px] bg-contain bg-no-repeat opacity-95`}
                      animate={
                        isLeft
                          ? {
                              x: [0, 4, -3, 6, -2, 2, 0],
                              y: [0, -2, 1, -4, 2, -1, 0],
                              rotate: [0, -1.1, 0.6, -2.2, 1.4, -0.7, 0],
                            }
                          : {
                              x: [0, -5, 3, -7, 2, -2, 0],
                              y: [0, -1, 2, -4, 2, -1, 0],
                              rotate: [0, 1.2, -0.7, 2.4, -1.5, 0.8, 0],
                            }
                      }
                      transition={{
                        duration: isLeft ? 12.8 : 13.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: isLeft
                          ? [0, 0.14, 0.3, 0.5, 0.68, 0.84, 1]
                          : [0, 0.12, 0.28, 0.5, 0.7, 0.86, 1],
                        repeatDelay: isLeft ? 0.6 : 0.5,
                      }}
                      style={{
                        backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerCard})`,
                        scaleX: isLeft ? 1 : -1,
                        willChange: "transform",
                        transformOrigin: isLeft ? "25% 88%" : "75% 88%",
                      }}
                    />

                    <p className="font-poppins-bold text-[22px] tracking-[0.22em] uppercase text-white/90 ">
                      {ev.title}
                    </p>
                    <p className="mt-7 font-poppins-bold text-[20px] text-white ">
                      {formatInvitationDateLong(ev.date)}
                    </p>
                    <p className="mt-2 font-poppins text-[16px] text-white/85">
                      {formatInvitationTime(ev.date)}
                    </p>
                    <p className="mt-2 font-poppins text-[16px] text-white/85">
                      {ev.venue}
                    </p>

                    <a
                      href={ev.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#9a6a74] px-10 py-4 font-poppins-bold text-[12px] tracking-[0.26em] text-white/95 shadow-[0_14px_35px_rgba(44,11,19,0.25)] transition-colors hover:bg-[#a47680]"
                    >
                      LINK MAP
                    </a>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
