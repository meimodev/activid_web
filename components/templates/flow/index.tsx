"use client";

import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "./Hero";
import { Countdown } from "./Countdown";
import { QuoteSection } from "./QuoteSection";
import { Gallery } from "./Gallery";
import { Wishes } from "./Wishes";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import {
  FloatingFlowers,
  FloatingSparkles,
  FloatingHearts,
  GoldenRings
} from "./graphics";
import { StorySection } from "./StorySection";
import {
  TitleSection,
  CoupleSection,
  EventSection,
  GiftSection,
  ConfirmationSection
} from "./InfoSections";
import Link from "next/link";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { Host, InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";

interface FlowProps {
  config: InvitationConfig;
}

export function Flow({ config }: FlowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
  music,
  weddingDate,
  sections
  } = config;

  const hosts = config.hosts;
  const hostsSection = sections.hosts;

  const derivedPhotos = useMemo(
    () => pickDeterministicRandomSubset(sections.gallery.photos, config.id, 5),
    [config.id, sections.gallery.photos],
  );

  return (
  <main className="relative min-h-screen overflow-x-hidden">
  <BackgroundSlideshow
    photos={derivedPhotos}
    className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
  />
  <GoldenRings />
  <FloatingFlowers />
  <FloatingSparkles />
  <FloatingHearts />
  <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

  {/* Hero / Cover Section - Fixed Overlay until opened */}
  {sections.hero.enabled && (
  <motion.div
  className="absolute inset-0 z-50"
  initial={false}
  animate={{
  y: isOpen ? "-100%" : "0%",
  transitionEnd: {
  display: isOpen ? "none" : "block"
  }
  }}
  transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
  >
  <Hero
  onOpen={() => setIsOpen(true)}
  hosts={hosts}
  date={weddingDate.displayShort}
  subtitle={sections.hero.subtitle}
  coverImage={sections.hero.coverImage}
  />
  </motion.div>
  )}

  {/* Main Content - Visible underneath or revealed */}
  <div className={`relative z-10 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}>
  {/* Only allow scrolling when open */}
  <div className={isOpen ? "" : "h-screen overflow-hidden"}>
  {sections.title.enabled && (
  <TitleSection hosts={hosts} date={weddingDate.display} heading={sections.title.heading} />
  )}

  {sections.countdown.enabled && (
  <Countdown targetDate={weddingDate.countdownTarget} photos={derivedPhotos} heading={sections.countdown.heading} />
  )}

  {sections.quote.enabled && (
  <QuoteSection quote={sections.quote} />
  )}

  {hostsSection.enabled && (
  <CoupleSection hosts={hosts} disableGrayscale={hostsSection.disableGrayscale} />
  )}

  {sections.story.enabled && (
  <StorySection stories={sections.story.stories} heading={sections.story.heading} />
  )}

  {sections.event.enabled && (
  <EventSection events={sections.event.events} heading={sections.event.heading} />
  )}

  {sections.gallery.enabled && (
  <Gallery photos={sections.gallery.photos} heading={sections.gallery.heading} />
  )}

  {sections.rsvp.enabled && (
  <Suspense fallback={<div className="py-24 text-center text-wedding-text-light font-body italic">Loading RSVP...</div>}>
  <ConfirmationSection invitationId={config.id} rsvpDeadline={weddingDate.rsvpDeadline} />
  </Suspense>
  )}

  {sections.gift.enabled && (
  <GiftSection bankAccounts={sections.gift.bankAccounts} heading={sections.gift.heading} description={sections.gift.description} />
  )}

  {sections.wishes.enabled && (
  <Suspense fallback={<div className="py-24 text-center text-wedding-text-light font-body italic">Loading Wishes...</div>}>
  <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
  </Suspense>
  )}

  {sections.footer.enabled && (
  <SpaceFooter hosts={hosts} message={sections.footer.message} seedKey={config.id} />
  )}
  </div>
  </div>
  </main>
  );
}

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function SpaceFooter({
  hosts,
  message,
  seedKey,
}: {
  hosts: Host[];
  message: string;
  seedKey: string;
}) {
  const stars = useMemo(() => {
    const rand = mulberry32(fnv1a32(seedKey || "0"));
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${rand() * 100}%`,
      left: `${rand() * 100}%`,
      size: rand() * 3 + 1,
      duration: rand() * 3 + 2,
      delay: rand() * 2,
    }));
  }, [seedKey]);

  return (
  <footer className="relative py-24 bg-[#0B0D17] text-center text-white overflow-hidden">
  {/* Space Background & Stars */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
  {stars.map((star) => (
  <motion.div
  key={star.id}
  className="absolute rounded-full bg-white opacity-80"
  style={{
  top: star.top,
  left: star.left,
  width: star.size,
  height: star.size,
  }}
  animate={{
  opacity: [0.2, 1, 0.2],
  scale: [0.8, 1.2, 0.8],
  }}
  transition={{
  duration: star.duration,
  repeat: Infinity,
  delay: star.delay,
  ease: "easeInOut",
  }}
  />
  ))}
  </div>

  {/* Content */}
  <div className="relative z-10 px-4">
  <RevealOnScroll direction="up" delay={0.1} width="100%">
  <FloatingParallax speed={0.2}>
  {/* Couple Names */}
  <h2 className="font-script text-5xl text-transparent bg-clip-text bg-linear-to-r from-purple-200 via-white to-blue-200 mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
  {hosts[0]?.firstName ?? ""} {hosts[1]?.firstName ? "&" : ""} {hosts[1]?.firstName ?? ""}
  </h2>

  {/* Message */}
  <p className="font-heading text-xs uppercase tracking-[0.4em] text-blue-100/60 mb-12 max-w-lg mx-auto leading-loose whitespace-pre-line">
  {message}
  </p>
  </FloatingParallax>
  </RevealOnScroll>

  {/* CTA Button */}
  <RevealOnScroll direction="up" delay={0.3} width="100%">
  <Link
  href="/"
  className="group relative inline-flex items-center gap-3 px-8 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_20px_rgba(100,200,255,0.3)]"
  >
  <span className="relative z-10 font-heading text-xs uppercase tracking-[0.2em] text-white group-hover:text-blue-100 transition-colors">
  🚀 Kembali Pulang ✨
  </span>
  <motion.div
  className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
  />
  </Link>
  </RevealOnScroll>

  {/* Activid Branding */}

  </div>
  </footer>
  );
}
