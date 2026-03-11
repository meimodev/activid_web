"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";
import type { InvitationConfig } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

type Hosts = InvitationConfig["sections"]["hosts"]["hosts"];
type EventsConfig = InvitationConfig["sections"]["event"]["events"];

interface QuoteSectionProps {
  quote: {
    text: string;
    author: string;
  };
  isReady?: boolean;
}

interface HostSectionProps {
  hosts: Hosts;
  isReady?: boolean;
}

interface EventSectionProps {
  events: EventsConfig;
  heading: string;
  isReady?: boolean;
}

function HostCard({
  host,
  label,
  delay,
  isReady,
  frameUrl,
}: {
  host: Hosts[number];
  label: string;
  delay: number;
  isReady?: boolean;
  frameUrl: string;
}) {
  if (!host) return null;

  return (
    <RevealOnScroll direction="up" distance={18} delay={delay} width="100%" isReady={isReady}>
      <div className="relative overflow-hidden rounded-[34px] border border-wedding-accent/12 bg-white/74 p-4 shadow-[0_22px_70px_rgba(61,23,92,0.10)] backdrop-blur-xl">
        <div className="relative mx-auto h-[250px] w-[250px]">
          <div className="absolute inset-[18px] overflow-hidden rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.14)]">
            <img src={host.photo} alt={host.fullName || host.firstName} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.00)_50%,rgba(255,255,255,0.18))]" />
          </div>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${frameUrl})` }}
            animate={{ rotate: [0, 3, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-5 text-center">
          <p className="font-poppins text-[11px] uppercase tracking-[0.26em] text-wedding-accent">
            {label}
          </p>
          <h3 className="mt-3 font-poppins-bold text-[34px] leading-none tracking-tight text-wedding-dark">
            {host.firstName || host.shortName || host.fullName}
          </h3>
          {host.fullName ? (
            <p className="mt-3 font-poppins text-[14px] text-wedding-dark/72">{host.fullName}</p>
          ) : null}
          {host.role ? (
            <p className="mt-3 inline-flex rounded-full bg-wedding-accent-2/12 px-4 py-2 font-poppins-bold text-[11px] uppercase tracking-[0.22em] text-wedding-accent-2">
              {host.role}
            </p>
          ) : null}
          {host.parents ? (
            <p className="mt-4 font-poppins text-[13px] leading-relaxed text-wedding-dark/68 whitespace-pre-line">
              {host.parents}
            </p>
          ) : null}
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function QuoteSection({ quote, isReady = true }: QuoteSectionProps) {
  if (!quote?.text?.trim()) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 pt-6 pb-4 text-wedding-dark">
      <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
        <div className="mx-auto max-w-[520px] rounded-[34px] border border-wedding-accent/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] px-7 py-8 text-center shadow-[0_20px_60px_rgba(63,19,91,0.10)] backdrop-blur-xl">
          <p className="font-poppins text-[11px] uppercase tracking-[0.28em] text-wedding-accent-2">Make a Wish</p>
          <blockquote className="mt-4 font-poppins-bold text-[26px] leading-tight tracking-tight text-wedding-dark">
            {quote.text}
          </blockquote>
          {quote.author?.trim() ? (
            <p className="mt-3 font-poppins text-[13px] text-wedding-dark/60">{quote.author}</p>
          ) : null}
        </div>
      </RevealOnScroll>
    </section>
  );
}

export function HostSection({ hosts, isReady = true }: HostSectionProps) {
  const overlayAssets = useOverlayAssets();
  const primary = hosts[0];
  const secondary = hosts[1];
  const hasSecondary = Boolean(
    secondary &&
      ((secondary.firstName || "").trim() ||
        (secondary.fullName || "").trim() ||
        (secondary.photo || "").trim()),
  );

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-6 h-[300px] w-[220px] bg-contain bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
          animate={{ y: [0, -16, 0], rotate: [-4, 0, -4] }}
          transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-28 bottom-0 h-[320px] w-[240px] scale-x-[-1] bg-contain bg-no-repeat opacity-45"
          style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
          animate={{ y: [0, 16, 0], rotate: [4, 0, 4] }}
          transition={{ duration: 9.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center">
            <p className="font-poppins text-[12px] uppercase tracking-[0.28em] text-wedding-accent">Our Birthday Star</p>
            <h2 className="mt-4 font-poppins-bold text-[40px] leading-none tracking-tight text-wedding-dark">Party Crew</h2>
            <p className="mt-4 font-poppins text-[14px] leading-relaxed text-wedding-dark/68">
              Yuk datang dan rayakan hari spesial ini dengan penuh tawa, warna, dan kebahagiaan.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 space-y-8">
          <HostCard host={primary} label="Birthday Star" delay={0.16} isReady={isReady} frameUrl={overlayAssets.frame} />
          {hasSecondary ? (
            <HostCard host={secondary} label="Special Guest" delay={0.24} isReady={isReady} frameUrl={overlayAssets.frame} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function EventSection({ events, heading, isReady = true }: EventSectionProps) {
  const overlayAssets = useOverlayAssets();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,color-mix(in_srgb,var(--invitation-accent-2)_12%,var(--invitation-bg)),var(--invitation-bg))] px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-x-0 top-10 h-[80px] bg-center bg-cover bg-no-repeat opacity-85"
          style={{ backgroundImage: `url(${overlayAssets.ticketDivider})` }}
          animate={{ scale: [1, 1.01, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center">
            <p className="font-poppins text-[12px] uppercase tracking-[0.28em] text-wedding-accent-2">Party Details</p>
            <h2 className="mt-4 font-poppins-bold text-[40px] leading-none tracking-tight text-wedding-dark">
              {heading?.trim() || "Event Details"}
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-12 space-y-6">
          {events.map((event, index) => (
            <RevealOnScroll
              key={`${event.title}-${index}`}
              direction="up"
              distance={18}
              delay={0.16 + index * 0.08}
              width="100%"
              isReady={isReady}
            >
              <div className="overflow-hidden rounded-[34px] border border-wedding-accent/14 bg-white/78 px-6 py-7 shadow-[0_22px_70px_rgba(63,19,91,0.10)] backdrop-blur-xl">
                <p className="font-poppins text-[11px] uppercase tracking-[0.28em] text-wedding-accent">{event.title}</p>
                <h3 className="mt-4 font-poppins-bold text-[28px] leading-none tracking-tight text-wedding-dark">
                  {formatInvitationDateLong(event.date)}
                </h3>
                <p className="mt-3 font-poppins text-[15px] text-wedding-dark/72">{formatInvitationTime(event.date)}</p>
                <p className="mt-3 font-poppins-bold text-[18px] text-wedding-dark">{event.venue}</p>
                <p className="mt-3 font-poppins text-[13px] leading-relaxed text-wedding-dark/68">{event.address}</p>
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-w-[200px] items-center justify-center rounded-full bg-wedding-accent px-8 py-3 font-poppins-bold text-[12px] uppercase tracking-[0.24em] text-wedding-on-accent shadow-[0_16px_40px_color-mix(in_srgb,var(--invitation-accent)_24%,transparent)] transition hover:bg-wedding-accent/88"
                >
                  Lihat Lokasi
                </a>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
