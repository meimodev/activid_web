"use client";

import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { StarDivider, SignalDivider } from "./graphics/ornaments";
import { MapPinIcon, CalendarIcon, ClockIcon } from "./graphics/icons";
import type { InvitationConfig } from "@/types/invitation";
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
  const cards = events;

  if (!cards || cards.length === 0) return null;

  return (
    <section className="py-32 relative text-wedding-on-dark overflow-hidden bg-wedding-dark">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <StaggerRevealOnScroll
          direction="up"
          width="100%"
          staggerDelay={0.18}
          className="w-full"
        >
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl capitalize tracking-[0.3em] text-wedding-accent mb-6 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-accent)_50%,transparent)]">
              {heading}
            </h2>
            <StarDivider />
          </div>

          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wedding-accent/20 hidden" />

            <StaggerRevealOnScroll
              direction="up"
              width="100%"
              staggerDelay={0.14}
              className="grid gap-12"
            >
              {cards.map((event, index) => {
                const time = formatInvitationTime(event.date);

                return (
                  <div
                    key={`${event.title}-${index}`}
                    className="flex flex-col items-center gap-8"
                  >
                    {/* Content */}
                    <div
                      className={`w-full flex-col`}
                    >
                      <div className="bg-wedding-on-dark/5 backdrop-blur-md p-8 rounded-2xl border border-wedding-on-dark/10 hover:border-wedding-accent/30 transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden text-left">
                        <div className="absolute inset-0 bg-linear-to-br from-wedding-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <h3 className="font-heading text-2xl capitalize tracking-[0.2em] text-wedding-accent mb-6 ">
                          {event.title}
                        </h3>

                        <div className="space-y-4 font-body text-wedding-on-dark/80 mb-8">
                          <p className="flex items-center justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                            <span className="text-wedding-accent shrink-0">
                              <CalendarIcon />
                            </span>
                            <span className="tracking-widest">
                              {formatInvitationDateLong(event.date)}
                            </span>
                          </p>
                          {time ? (
                            <p className="flex items-center justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                              <span className="text-wedding-accent shrink-0">
                                <ClockIcon />
                              </span>
                              <span className="tracking-widest">{time}</span>
                            </p>
                          ) : null}
                          {event.venue || event.address ? (
                            <p className="flex items-start justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                              <span className="text-wedding-accent shrink-0">
                                <MapPinIcon />
                              </span>
                              <span className="text-left">
                                {event.venue}
                                {event.venue && event.address ? <br /> : null}
                                {event.address}
                              </span>
                            </p>
                          ) : null}
                        </div>

                        <div className="w-full flex justify-center">
                          {event.mapUrl && (
                            <a
                              href={event.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-8 py-3 bg-wedding-on-dark/10 text-wedding-on-dark hover:bg-wedding-accent hover:text-wedding-dark rounded-full font-body text-[10px]  tracking-[0.2em] transition-all duration-300 relative z-10 overflow-hidden"
                            >
                              <span className="relative z-10">Buka Peta</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center Node */}
                    <div className="hidden relative z-10 w-12 h-12 rounded-full bg-wedding-dark border border-wedding-accent/30 items-center justify-center -mx-6">
                      <div className="w-4 h-4 bg-wedding-accent rounded-full animate-pulse shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent)_50%,transparent)]" />
                    </div>

                    <div className="hidden w-1/2" />
                  </div>
                );
              })}
            </StaggerRevealOnScroll>
          </div>
        </StaggerRevealOnScroll>
      </div>

      <div className="absolute bottom-0 w-full opacity-50">
        <SignalDivider />
      </div>
    </section>
  );
}
