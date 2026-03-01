"use client";

import { WeddingEvent } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { StarDivider, CosmicDivider } from "./graphics/ornaments";
import { MapPinIcon, CalendarIcon, ClockIcon } from "./graphics/icons";
import { motion } from "framer-motion";

interface EventSectionProps {
  events: WeddingEvent[];
  heading: string;
}

export function EventSection({ events, heading }: EventSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-32 relative text-wedding-on-dark overflow-hidden bg-wedding-dark">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl uppercase tracking-[0.3em] text-wedding-accent mb-6 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-accent)_50%,transparent)]">
              {heading}
            </h2>
            <StarDivider />
          </div>
        </RevealOnScroll>

        <div className="grid gap-12 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-wedding-accent/20 hidden md:block" />

          {events.map((event, index) => {
            const isEven = index % 2 === 0;

            return (
              <RevealOnScroll
                key={event.id || index}
                direction={isEven ? "right" : "left"}
                delay={index * 0.2}
                width="100%"
              >
                <div className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} text-center`}>
                    <div className="bg-wedding-on-dark/5 backdrop-blur-md p-8 rounded-2xl border border-wedding-on-dark/10 hover:border-wedding-accent/30 transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-br from-wedding-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <h3 className="font-script text-4xl text-wedding-accent mb-6">
                        {event.name}
                      </h3>

                      <div className="space-y-4 font-body text-wedding-on-dark/80 mb-8">
                        <p className="flex items-center justify-center md:justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                          <CalendarIcon />
                          <span className="tracking-widest">{event.date}</span>
                        </p>
                        {event.time && (
                          <p className="flex items-center justify-center md:justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                            <ClockIcon />
                            <span className="tracking-widest">{event.time}</span>
                          </p>
                        )}
                        {event.location && (
                          <p className="flex items-start justify-center md:justify-start gap-3 group-hover:text-wedding-on-dark transition-colors">
                            <MapPinIcon />
                            <span className="text-left">{event.location}</span>
                          </p>
                        )}
                      </div>

                      {event.mapUrl && (
                        <a
                          href={event.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-8 py-3 bg-wedding-on-dark/10 text-wedding-on-dark hover:bg-wedding-accent hover:text-wedding-dark rounded-full font-heading text-[10px] uppercase tracking-[0.2em] transition-all duration-300 relative z-10 overflow-hidden"
                        >
                          <span className="relative z-10">Buka Peta</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="hidden md:flex relative z-10 w-12 h-12 rounded-full bg-wedding-dark border border-wedding-accent/30 items-center justify-center -mx-6">
                    <div className="w-4 h-4 bg-wedding-accent rounded-full animate-pulse shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent)_50%,transparent)]" />
                  </div>

                  <div className="hidden md:block w-1/2" />
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full opacity-50">
        <CosmicDivider />
      </div>
    </section>
  );
}
