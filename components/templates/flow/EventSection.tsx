"use client";

import { DiamondAccent, RingsDivider, SectionDivider, GoldLeafBorder } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { InvitationConfig } from "@/types/invitation";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";

type EventsConfig = InvitationConfig["sections"]["event"]["events"];

interface EventSectionProps {
  events: EventsConfig;
  heading: string;
}

export function EventSection({ events, heading }: EventSectionProps) {
  const cards = events;

  return (
    <section className="section-curved py-24 bg-wedding-bg/90 backdrop-blur-md text-center relative border-b border-wedding-accent/30">
      <GoldLeafBorder position="top" />

      <RevealOnScroll direction="down" width="100%">
        <div className="flex flex-col items-center">
          <DiamondAccent />
          <h2 className="font-script text-3xl text-wedding-accent mb-4 mt-4 py-5">
            {heading}
          </h2>
          <RingsDivider />
        </div>
      </RevealOnScroll>

      <div className="container mx-auto px-4 grid gap-12 max-w-5xl mt-12">
        {cards.map((e, idx) => (
          <RevealOnScroll
            key={`${e.title}-${idx}`}
            direction={idx % 2 === 0 ? "right" : "left"}
            delay={0.2 + idx * 0.2}
            width="100%"
          >
            <div className="bg-wedding-bg p-12 rounded-sm shadow-xl border border-wedding-accent/20 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-wedding-accent to-transparent opacity-50"></div>
              <h3 className="font-garet-book uppercase text-3xl mb-6 text-gold-gradient leading-[1.1] py-1">
                {e.title}
              </h3>
              <div className="space-y-4 font-garet-book text-wedding-text">
                <p className="text-xl font-poppins font-heading">{formatInvitationDateLong(e.date)}</p>
                <p className="text-wedding-text-light">{formatInvitationTime(e.date)}</p>
                <div className="w-16 h-px bg-wedding-accent/30 mx-auto my-4"></div>
                <p className="font-poppins-bold text-lg">{e.venue}</p>
                <p className="text-wedding-text-light text-sm italic">{e.address}</p>
                <a href={e.mapUrl} target="_blank" className="inline-block mt-8 px-8 py-3 border border-wedding-accent text-wedding-text hover:bg-wedding-accent hover:text-wedding-on-accent transition-all duration-300 rounded-sm text-xs uppercase tracking-[0.2em] font-garet-book font-bold">
                  View Map
                </a>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
      <SectionDivider />
      <GoldLeafBorder position="bottom" />
    </section>
  );
}
