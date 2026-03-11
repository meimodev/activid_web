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
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70">
        <motion.div
          className="absolute inset-x-0 top-0 h-[100px] bg-top bg-cover bg-no-repeat opacity-100 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.bunting})` }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-45 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.confetti})` }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-10 h-[300px] w-[300px] bg-contain bg-no-repeat opacity-50 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.stars})` }}
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center pt-10">
            <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent-2/80 inline-block px-5 py-1.5 rounded-full border-2 border-white/40 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent)] rotate-1">Party Notes</p>
            <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent)]">
              {heading?.trim() || "Party Notes"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={18} delay={0.16} width="100%" isReady={isReady}>
          <motion.div 
            className="mt-12 overflow-hidden rounded-[48px] border-4 border-white bg-white/80 p-5 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent),0_30px_70px_rgba(63,19,91,0.14)] backdrop-blur-xl"
            animate={{ rotate: [1, -1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            {heroImageUrl ? (
              <div className="relative overflow-hidden rounded-[36px] border-4 border-white shadow-[0_12px_30px_rgba(0,0,0,0.1)] -rotate-1">
                <div className="aspect-[4/5]">
                  <img src={heroImageUrl} alt="Party memory" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.00)_45%,rgba(255,255,255,0.16))]" />
            </div>
            ) : null}

            <div className="mt-8 space-y-6">
              {stories.map((story, idx) => (
                <RevealOnScroll
                  key={`${story.description}-${idx}`}
                  direction="up"
                  distance={16}
                  delay={0.22 + idx * 0.08}
                  width="100%"
                  isReady={isReady}
                >
                  <motion.div 
                    className="relative rounded-[32px] border-4 border-white bg-[linear-gradient(135deg,var(--invitation-bg),white)] px-6 py-5 shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]"
                    animate={{ rotate: (idx % 2 === 0 ? [-1, 1, -1] : [1, -1, 1]) }}
                    transition={{ duration: 6 + idx, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <p className="font-poppins-bold text-[12px] uppercase tracking-widest text-wedding-accent-2 bg-white/80 inline-block px-3 py-1 rounded-lg border border-white">
                      {formatInvitationMonthYear(story.date)}
                    </p>
                    <p className="mt-4 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 whitespace-pre-line">
                      {story.description}
                    </p>
                  </motion.div>
                </RevealOnScroll>
              ))}
            </div>
          </motion.div>
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
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <motion.div
          className="absolute inset-x-0 top-0 h-[100px] bg-top bg-cover bg-no-repeat opacity-100 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.zigzag})` }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-10 top-40 h-[280px] w-[280px] bg-contain bg-no-repeat opacity-60 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.stars})` }}
          animate={{ rotate: [0, -90, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -right-20 top-[60%] h-[180px] w-[180px] bg-contain bg-no-repeat opacity-70"
          style={{ backgroundImage: `url(${overlayAssets.partyHat})` }}
          animate={{ y: [0, 15, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%" isReady={isReady}>
          <div className="text-center pt-8">
            <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent/80 inline-block px-5 py-1.5 rounded-full border-2 border-white/40 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)] -rotate-1">Memory Lane</p>
            <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent-2)]">
              {heading?.trim() || "Gallery"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" distance={18} delay={0.16} width="100%" isReady={isReady}>
          <motion.div 
            className="mt-12 rounded-[48px] border-4 border-white bg-white/80 p-5 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent),0_30px_70px_rgba(63,19,91,0.14)] backdrop-blur-xl"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative overflow-hidden rounded-[36px] border-4 border-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] -rotate-1">
              <div className="aspect-[4/5] bg-white/40">
                {selectedPhoto ? <img src={selectedPhoto} alt="Selected gallery photo" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.00)_50%,rgba(255,255,255,0.18))]" />
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {displayPhotos.map((photo, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <motion.button
                    key={`${photo}-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    animate={{ y: isActive ? -4 : 0, scale: isActive ? 1.05 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-[24px] border-4 transition-colors duration-300 ${
                      isActive
                        ? "border-wedding-accent shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-accent)_30%,transparent)] z-10"
                        : "border-white"
                    }`}
                  >
                    <div className="aspect-square bg-white/40">
                      <img src={photo} alt={`Gallery photo ${idx + 1}`} className="h-full w-full object-cover" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
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
          <motion.div 
            className="rounded-[48px] border-4 border-white bg-[linear-gradient(180deg,white,rgba(255,255,255,0.85))] px-7 py-12 text-center shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-dark)_15%,transparent),0_30px_70px_rgba(63,19,91,0.10)] backdrop-blur-xl"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-dark/30 inline-block px-5 py-1.5 rounded-full border-2 border-white/40 rotate-2">Thank You</p>
            <h2 className="mt-6 font-black text-[40px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent)]">See You at the Party!</h2>
            <p className="mt-6 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 whitespace-pre-line bg-black/5 p-5 rounded-3xl border border-black/5">
              {message?.trim() || "Terima kasih sudah meluangkan waktu untuk hadir dan berbagi kebahagiaan di hari spesial ini."}
            </p>
            <div className="mt-8 inline-flex items-center justify-center rounded-2xl bg-wedding-accent-2 px-6 py-3 text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--invitation-dark)_20%,transparent)] rotate-1">
              <p className="font-black text-[22px] tracking-wide">{displayName}</p>
            </div>
          </motion.div>
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
          <div className="inline-flex items-center rounded-2xl bg-white/10 px-6 py-2 font-poppins-bold text-[13px] uppercase tracking-[0.2em] text-white border-2 border-white/20 shadow-[0_4px_0_0_color-mix(in_srgb,black_20%,transparent)] -rotate-2">
            {names || "Birthday Crew"}
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" width="100%" delay={0.24} isReady={isReady}>
          <h3 className="mt-10 font-black text-[54px] leading-none tracking-tight text-white [text-shadow:3px_3px_0_color-mix(in_srgb,var(--invitation-accent)_80%,transparent)] rotate-1">
            Party Time!
          </h3>
          <p className="mt-6 font-poppins font-medium text-[16px] leading-relaxed text-white/90 whitespace-pre-line max-w-[280px] mx-auto bg-black/20 p-4 rounded-3xl border border-white/10">
            {message?.trim() || "Sampai jumpa dan jangan lupa bawa senyuman terbaikmu!"}
          </p>
        </RevealOnScroll>

        <RevealOnScroll direction="up" width="100%" delay={0.36} isReady={isReady}>
          <motion.a
            href="https://invitation.activid.id"
            target="_blank"
            rel="noreferrer"
            animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-10 inline-flex items-center justify-center rounded-full border-4 border-white/20 bg-white/10 px-10 py-4 font-poppins-bold text-[13px] uppercase tracking-[0.2em] text-white shadow-[0_6px_0_0_color-mix(in_srgb,black_20%,transparent)] active:scale-95 active:translate-y-[4px] active:shadow-none transition-shadow"
          >
            Kembali ke Undangan
          </motion.a>
        </RevealOnScroll>
      </div>
    </footer>
  );
}
