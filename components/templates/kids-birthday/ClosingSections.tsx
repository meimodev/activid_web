"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import type { InvitationConfig, StoryItem } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

type Hosts = InvitationConfig["sections"]["hosts"]["hosts"];

interface StorySectionProps {
  stories: StoryItem[];
  heading: string;
  fallbackImageUrl?: string;
  isReady?: boolean;
}

interface GallerySectionProps {
  photos: string[];
  heading: string;
  isReady?: boolean;
}

interface GratitudeSectionProps {
  hosts: Hosts;
  message?: string;
  isReady?: boolean;
}

interface FooterSectionProps {
  hosts: Hosts;
  message: string;
  isReady?: boolean;
}

export function StorySection({ stories, heading, fallbackImageUrl, isReady = true }: StorySectionProps) {
  const overlayAssets = useOverlayAssets();
  const heroImageUrl = stories?.[0]?.imageUrl || fallbackImageUrl;

  if (!stories?.length) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-45"
          style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center">
            <p className="font-poppins text-[12px] uppercase tracking-[0.28em] text-wedding-accent-2">Party Notes</p>
            <h2 className="mt-4 font-poppins-bold text-[40px] leading-none tracking-tight text-wedding-dark">
              {heading?.trim() || "Party Notes"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={18} delay={0.16} width="100%" isReady={isReady}>
          <div className="mt-10 overflow-hidden rounded-[36px] border border-wedding-accent/14 bg-white/76 p-4 shadow-[0_22px_70px_rgba(63,19,91,0.10)] backdrop-blur-xl">
            {heroImageUrl ? (
              <div className="relative overflow-hidden rounded-[28px]">
                <div className="aspect-[4/5]">
                  <img src={heroImageUrl} alt="Party memory" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.00)_45%,rgba(255,255,255,0.16))]" />
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              {stories.map((story, idx) => (
                <RevealOnScroll
                  key={`${story.description}-${idx}`}
                  direction="up"
                  distance={16}
                  delay={0.22 + idx * 0.08}
                  width="100%"
                  isReady={isReady}
                >
                  <div className="rounded-[28px] border border-wedding-accent/10 bg-white/70 px-5 py-4">
                    <p className="font-poppins text-[11px] uppercase tracking-[0.26em] text-wedding-accent">
                      {formatInvitationMonthYear(story.date)}
                    </p>
                    <p className="mt-3 font-poppins text-[14px] leading-relaxed text-wedding-dark/72 whitespace-pre-line">
                      {story.description}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function GallerySection({ photos, heading, isReady = true }: GallerySectionProps) {
  const overlayAssets = useOverlayAssets();
  const displayPhotos = useMemo(() => photos.filter(Boolean).slice(0, 8), [photos]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPhoto = displayPhotos[selectedIndex] ?? displayPhotos[0] ?? "";

  if (!displayPhotos.length) return null;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--invitation-bg),color-mix(in_srgb,var(--invitation-accent-2)_10%,var(--invitation-bg)))] px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-x-0 top-8 h-[80px] bg-center bg-cover bg-no-repeat opacity-85"
          style={{ backgroundImage: `url(${overlayAssets.ticketDivider})` }}
          animate={{ scale: [1, 1.01, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center">
            <p className="font-poppins text-[12px] uppercase tracking-[0.28em] text-wedding-accent">Memory Lane</p>
            <h2 className="mt-4 font-poppins-bold text-[40px] leading-none tracking-tight text-wedding-dark">
              {heading?.trim() || "Gallery"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={18} delay={0.16} width="100%" isReady={isReady}>
          <div className="mt-10 rounded-[36px] border border-wedding-accent/14 bg-white/76 p-4 shadow-[0_22px_70px_rgba(63,19,91,0.10)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[28px]">
              <div className="aspect-[4/5] bg-white/40">
                {selectedPhoto ? <img src={selectedPhoto} alt="Selected gallery photo" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.00)_50%,rgba(255,255,255,0.18))]" />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {displayPhotos.map((photo, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={`${photo}-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`overflow-hidden rounded-[20px] border transition ${
                      isActive
                        ? "border-wedding-accent-2 shadow-[0_12px_30px_rgba(96,57,201,0.16)]"
                        : "border-wedding-accent/10"
                    }`}
                  >
                    <div className="aspect-square bg-white/40">
                      <img src={photo} alt={`Gallery photo ${idx + 1}`} className="h-full w-full object-cover" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function GratitudeSection({ hosts, message, isReady = true }: GratitudeSectionProps) {
  const displayName = hosts[0]?.firstName || hosts[0]?.shortName || "Birthday Star";

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-18 text-wedding-dark">
      <div className="mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="rounded-[34px] border border-wedding-accent/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.70))] px-7 py-9 text-center shadow-[0_22px_70px_rgba(63,19,91,0.10)] backdrop-blur-xl">
            <p className="font-poppins text-[11px] uppercase tracking-[0.28em] text-wedding-accent-2">Thank You</p>
            <h2 className="mt-4 font-poppins-bold text-[34px] leading-none tracking-tight text-wedding-dark">See You at the Party</h2>
            <p className="mt-4 font-poppins text-[14px] leading-relaxed text-wedding-dark/72 whitespace-pre-line">
              {message?.trim() || "Terima kasih sudah meluangkan waktu untuk hadir dan berbagi kebahagiaan di hari spesial ini."}
            </p>
            <p className="mt-6 font-poppins-bold text-[16px] text-wedding-accent">{displayName}</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function FooterSection({ hosts, message, isReady = true }: FooterSectionProps) {
  const overlayAssets = useOverlayAssets();
  const names = hosts
    .map((host) => host?.firstName || host?.shortName || "")
    .filter(Boolean)
    .join(" & ");

  return (
    <footer className="relative overflow-hidden bg-wedding-dark px-4 pt-18 pb-12 text-wedding-on-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--invitation-accent)_12%,var(--invitation-dark)),var(--invitation-dark))]" />
        <motion.div
          className="absolute inset-x-0 top-0 h-[110px] bg-top bg-cover bg-no-repeat opacity-95"
          style={{ backgroundImage: `url(${overlayAssets.footerWave})` }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px] text-center">
        <RevealOnScroll direction="up" width="100%" delay={0.12} isReady={isReady}>
          <div className="inline-flex items-center rounded-full bg-wedding-on-dark/10 px-4 py-2 font-poppins text-[11px] uppercase tracking-[0.24em] text-wedding-on-dark/80">
            {names || "Birthday Crew"}
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" width="100%" delay={0.24} isReady={isReady}>
          <h3 className="mt-8 font-poppins-bold text-[38px] leading-none tracking-tight text-wedding-on-dark">
            Party Time!
          </h3>
          <p className="mt-4 font-poppins text-[14px] leading-relaxed text-wedding-on-dark/72 whitespace-pre-line">
            {message?.trim() || "Sampai jumpa dan jangan lupa bawa senyuman terbaikmu!"}
          </p>
        </RevealOnScroll>

        <RevealOnScroll direction="up" width="100%" delay={0.36} isReady={isReady}>
          <a
            href="https://invitation.activid.id"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-wedding-on-dark/20 bg-wedding-on-dark/10 px-8 py-3 font-poppins-bold text-[12px] uppercase tracking-[0.24em] text-wedding-on-dark transition hover:bg-wedding-on-dark/16"
          >
            Kembali ke Undangan
          </a>
        </RevealOnScroll>
      </div>
    </footer>
  );
}
