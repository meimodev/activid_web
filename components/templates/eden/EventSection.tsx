"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { EventSectionProps } from "./InfoSections.types";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, DiamondLine, HairlineDivider, VerticalFadeRule } from "./graphics/ornaments";

export function EventSection({ events, heading }: EventSectionProps) {
  void heading;
  const cards = events;

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto w-full max-w-xl">
          <RevealOnScroll direction="up" distance={20} delay={0.1}>
            <div className="text-center mb-16">
              <p className="font-display italic text-[48px] leading-none text-wedding-accent">
                Wedding Event
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3">
                <VerticalFadeRule />
                <DiamondLine />
                <VerticalFadeRule />
              </div>
            </div>
          </RevealOnScroll>

          <div className="relative">
            {/* Center line for timeline effect */}
            <div className="absolute left-[24px] top-4 bottom-4 w-px bg-wedding-accent/20 md:left-1/2 md:-ml-px hidden sm:block" />

            <div className="space-y-16">
              {cards.map((data, idx) => (
                <RevealOnScroll
                  key={`${data.title}-${idx}`}
                  direction="up"
                  distance={20}
                  delay={0.2 + idx * 0.1}
                >
                  <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    {/* Timeline dot */}
                    <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center justify-center h-4 w-4 rounded-full border border-wedding-accent bg-wedding-bg z-10">
                      <div className="h-1.5 w-1.5 rounded-full bg-wedding-accent" />
                    </div>

                    <div className={`w-full sm:w-1/2 flex ${idx % 2 === 0 ? "sm:justify-end" : "sm:order-last sm:justify-start"}`}>
                      <div className="w-full sm:max-w-[320px] p-2 relative">
                        {/* Outer rich border */}
                        <div className="absolute inset-0 border border-wedding-accent/40 rounded-tl-[60px] rounded-br-[60px] rounded-tr-[20px] rounded-bl-[20px] pointer-events-none" />
                        
                        {/* Line corner decorations */}
                        <div className="absolute -top-1 -left-1 z-10 pointer-events-none opacity-40">
                          <CornerLineTopLeft />
                        </div>
                        <div className="absolute -bottom-1 -right-1 z-10 pointer-events-none opacity-40">
                          <CornerLineBottomRight />
                        </div>
                        
                        <div className="w-full p-8 text-center sm:text-left border border-wedding-accent/20 rounded-tl-[50px] rounded-br-[50px] rounded-tr-[12px] rounded-bl-[12px] bg-wedding-bg relative overflow-hidden">
                          <div className={`absolute top-0 bottom-0 w-32 pointer-events-none opacity-40 mix-blend-multiply ${idx % 2 === 0 ? '-left-8 -scale-x-100' : '-right-8'}`}>
                             <img src={EDEN_OVERLAY_ASSETS.cardFlower} alt="" className="w-full h-full object-cover" />
                          </div>
                          
                           <div className="relative z-10">
                            <p className="font-body font-bold text-[16px] tracking-[0.25em] uppercase text-wedding-accent/80">
                              {data.title}
                            </p>
                            <HairlineDivider />

                            <div className="my-5 flex items-center sm:justify-start justify-center gap-2">
                               <div className="h-px w-8 bg-wedding-accent/30" />
                            </div>

                            <p className="font-display font-medium text-[28px] text-wedding-accent leading-tight">
                              {formatInvitationDateLong(data.date)}
                            </p>
                            <p className="mt-2 font-body text-[16px] tracking-[0.1em] text-wedding-accent/80 font-semibold">
                              {formatInvitationTime(data.date)}
                            </p>
                            <p className="mt-4 font-body text-[15px] text-wedding-accent/70 italic leading-relaxed">
                              {data.venue}
                            </p>

                        <div className="mt-8">
                          <a
                            href={data.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center border border-wedding-accent bg-transparent px-6 py-2.5 font-body font-bold text-[11px] uppercase tracking-[0.25em] text-wedding-accent transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent"
                          >
                            Location Map
                          </a>
                        </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
