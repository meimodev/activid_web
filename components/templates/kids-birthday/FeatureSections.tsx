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
      <div className="relative overflow-hidden rounded-[40px] border-4 border-white bg-white/90 p-5 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent),0_30px_70px_rgba(61,23,92,0.14)] backdrop-blur-xl transition-transform duration-500">
        <motion.div 
          className="relative mx-auto h-[260px] w-[260px]"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[14px] overflow-hidden rounded-[32px] border-4 border-white shadow-[0_15px_40px_rgba(0,0,0,0.18)]">
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
        </motion.div>

        <div className="mt-5 text-center">
          <p className="font-poppins text-[11px] uppercase tracking-[0.26em] text-wedding-accent">
            {label}
          </p>
          <h3 className="mt-4 font-black text-[38px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent)]">
            {host.firstName || host.shortName || host.fullName}
          </h3>
          {host.fullName ? (
            <p className="mt-3 font-poppins text-[15px] text-wedding-dark/80 font-medium">{host.fullName}</p>
          ) : null}
          {host.role ? (
            <p className="mt-4 inline-flex rounded-xl bg-wedding-accent-2 px-5 py-2 font-poppins-bold text-[12px] uppercase tracking-widest text-white shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-dark)_20%,transparent)] rotate-1">
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
        <motion.div 
          className="mx-auto max-w-[520px] rounded-[48px] border-4 border-white bg-[linear-gradient(180deg,white,rgba(255,255,255,0.85))] px-7 py-10 text-center shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent),0_30px_60px_rgba(63,19,91,0.10)] backdrop-blur-xl"
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="font-poppins-bold text-[13px] uppercase tracking-widest text-wedding-accent-2 bg-wedding-accent-2/10 inline-block px-4 py-1.5 rounded-full border-2 border-wedding-accent-2/20 rotate-2">Harapan Terbaik</p>
          <blockquote className="mt-6 font-black text-[30px] leading-tight tracking-tight text-wedding-dark [text-shadow:1px_1px_0_white,2px_2px_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)]">
            {quote.text}
          </blockquote>
          {quote.author?.trim() ? (
            <p className="mt-3 font-poppins text-[13px] text-wedding-dark/60">{quote.author}</p>
          ) : null}
        </motion.div>
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
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <motion.div
          className="absolute -left-10 top-0 h-[360px] w-[360px] bg-contain bg-no-repeat mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.stars})` }}
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -right-20 top-20 h-[300px] w-[220px] bg-contain bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
          animate={{ y: [0, -20, 0], rotate: [4, 0, 4] }}
          transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-10 bottom-0 h-[320px] w-[240px] bg-contain bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${overlayAssets.balloons})` }}
          animate={{ y: [0, 16, 0], rotate: [-4, 0, -4] }}
          transition={{ duration: 9.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center relative">
            <motion.div
              className="absolute -top-10 left-1/2 h-[120px] w-[240px] -translate-x-1/2 bg-contain bg-top bg-no-repeat opacity-40 mix-blend-multiply"
              style={{ backgroundImage: `url(${overlayAssets.rainbow})` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="relative font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-wedding-accent bg-white/80 inline-block px-5 py-1.5 rounded-full border-2 border-wedding-accent/20 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)] -rotate-2">Bintang Ulang Tahun</p>
            <h2 className="relative mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent-2)]">Kru Pesta</h2>
            
            <motion.div
              animate={{ rotate: [1, -1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="relative mt-6 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 bg-white/60 px-6 py-4 rounded-3xl border-2 border-white backdrop-blur-sm">
                Yuk datang dan rayakan hari spesial ini dengan penuh tawa, warna, dan kebahagiaan.
              </p>
            </motion.div>
          </div>
        </RevealOnScroll>

        <div className="mt-10 space-y-8">
          <HostCard host={primary} label="Bintang Ulang Tahun" delay={0.16} isReady={isReady} frameUrl={overlayAssets.frame} />
          {hasSecondary ? (
            <HostCard host={secondary} label="Tamu Spesial" delay={0.24} isReady={isReady} frameUrl={overlayAssets.frame} />
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
          className="absolute inset-x-0 top-0 h-[100px] bg-top bg-cover bg-no-repeat opacity-100 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.zigzag})` }}
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[150px] bg-bottom bg-cover bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${overlayAssets.clouds})` }}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center pt-8">
            <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-dark/20 inline-block px-5 py-1.5 rounded-full border-2 border-white/30 backdrop-blur-sm rotate-2">Detail Pesta</p>
            <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent)]">
              {heading?.trim() || "Detail Acara"}
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
              <motion.div 
                className="relative overflow-hidden rounded-[40px] border-4 border-white bg-white/90 px-6 py-8 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent),0_30px_70px_rgba(63,19,91,0.14)] backdrop-blur-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-wedding-accent-2/10 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 h-20 w-20 bg-wedding-accent/10 rounded-tr-full"></div>
                
                <p className="relative font-poppins-bold text-[13px] uppercase tracking-[0.2em] text-wedding-accent bg-wedding-accent/10 inline-block px-4 py-1.5 rounded-full border-2 border-wedding-accent/20 -rotate-1">{event.title}</p>
                <h3 className="relative mt-5 font-black text-[32px] leading-none tracking-tight text-wedding-dark [text-shadow:1px_1px_0_white,2px_2px_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent)]">
                  {formatInvitationDateLong(event.date)}
                </h3>
                <div className="relative mt-4 inline-flex items-center justify-center rounded-xl bg-wedding-dark px-4 py-2 text-white shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-dark)_60%,transparent)] rotate-1">
                  <span className="font-poppins-bold text-[14px] tracking-widest">{formatInvitationTime(event.date)}</span>
                </div>
                <p className="relative mt-6 font-black text-[22px] text-wedding-dark leading-tight">{event.venue}</p>
                <p className="relative mt-3 font-poppins font-medium text-[14px] leading-relaxed text-wedding-dark/70 bg-black/5 p-4 rounded-2xl border border-black/5">{event.address}</p>
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-8 inline-flex w-full items-center justify-center rounded-full bg-wedding-accent px-8 py-4 font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--invitation-dark)_20%,transparent)] transition-all active:scale-[0.98] active:translate-y-[2px] active:shadow-[0_2px_0_0_color-mix(in_srgb,var(--invitation-dark)_20%,transparent)]"
                >
                  Lihat Lokasi
                </a>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
