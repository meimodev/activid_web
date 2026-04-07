"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  GoldenRings,
} from "./graphics";
import { StorySection } from "./StorySection";
import { TitleSection } from "./TitleSection";
import { CoupleSection } from "./CoupleSection";
import { EventSection } from "./EventSection";
import { GiftSection } from "./GiftSection";
import { GratitudeSection } from "./GratitudeSection";
import Link from "next/link";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { Host, InvitationConfig } from "@/types/invitation";
import { normalizeInvitationGuestName, pickDeterministicRandomSubset } from "@/lib/utils";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";

interface FlowProps {
  config: InvitationConfig;
}

export function Flow({ config }: FlowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const guestName = normalizeInvitationGuestName(searchParams.get("to"));

  const { music, sections } = config;

  const hostsSection = sections.hosts;
  const hosts = (Array.isArray(hostsSection.hosts) ? hostsSection.hosts : []).filter(
    (host): host is Host => Boolean(host),
  );
  const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

  const derivedPhotos = useMemo(
    () => pickDeterministicRandomSubset(sections.gallery.photos, config.id, 5),
    [config.id, sections.gallery.photos],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="sticky top-0 w-full h-[100dvh] overflow-hidden">
          <BackgroundSlideshow
            photos={derivedPhotos}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      <GoldenRings />
      <FloatingFlowers />
      <FloatingSparkles />
      <FloatingHearts />
      <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

      {/* Hero / Cover Section - Fixed Overlay until opened */}
      {sections.hero.enabled && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={false}
          animate={{
            y: isOpen ? "-100%" : "0%",
            opacity: isOpen ? 0 : 1,
          }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], opacity: { duration: 1, delay: 0.2 } }}
        >
          <div className="pointer-events-auto h-full">
            <Hero
              onOpen={() => setIsOpen(true)}
              hosts={hosts}
              date={dateInfo?.displayShort ?? ""}
              subtitle={sections.hero.subtitle}
              coverImage={sections.hero.coverImage}
              guestName={guestName}
              isOpen={isOpen}
            />
          </div>
        </motion.div>
      )}

      {/* Main Content - Visible underneath or revealed */}
      <div
        className={`relative z-10 transition-opacity duration-1000 delay-500 ${isOpen ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}
      >
        {/* Only allow scrolling when open */}
        <div className={isOpen ? "" : "h-screen overflow-hidden"}>
          {sections.title.enabled && (
            <TitleSection
              hosts={hosts}
              date={dateInfo?.display ?? ""}
              heading={sections.title.heading}
              isOpen={isOpen}
            />
          )}

          {sections.countdown.enabled && (
            <Countdown
              targetDate={dateInfo?.countdownTarget ?? ""}
              photos={derivedPhotos}
              heading={sections.countdown.heading}
            />
          )}

          {sections.quote.enabled && <QuoteSection quote={sections.quote} />}

          {hostsSection.enabled && (
            <CoupleSection hosts={hosts} />
          )}

          {sections.story.enabled && (
            <StorySection
              stories={sections.story.stories}
              heading={sections.story.heading}
            />
          )}

          {sections.event.enabled && (
            <EventSection
              events={sections.event.events}
              heading={sections.event.heading}
            />
          )}

          {sections.gallery.enabled && (
            <Gallery
              photos={sections.gallery.photos}
              heading={sections.gallery.heading}
            />
          )}

          {sections.gift.enabled && (
            <GiftSection
              bankAccounts={sections.gift.bankAccounts}
              heading={sections.gift.heading}
              description={sections.gift.description}
            />
          )}

          {sections.wishes.enabled && (
            <Suspense
              fallback={
                <div className="py-24 text-center text-wedding-text-light font-body italic">
                  Loading Wishes...
                </div>
              }
            >
              <Wishes
                invitationId={config.id}
                heading={sections.wishes.heading}
                placeholder={sections.wishes.placeholder}
                thankYouMessage={sections.wishes.thankYouMessage}
              />
            </Suspense>
          )}

          {sections.gratitude.enabled && (
            <GratitudeSection hosts={hosts} message={sections.gratitude.message} />
          )}

          {sections.footer.enabled && (
            <SpaceFooter
              hosts={hosts}
              message={sections.footer.message}
              seedKey={config.id}
            />
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
  const primaryName = hosts[0]?.firstName ?? "";
  const secondaryName = hosts[1]?.firstName ?? "";
  const displayNames = secondaryName ? `${primaryName} & ${secondaryName}` : primaryName;

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
    <footer className="relative py-24 bg-wedding-dark text-center text-wedding-on-dark overflow-hidden">
      {/* Space Background & Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-wedding-on-dark opacity-80"
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
          <div>
            <h2 className="font-brittany-signature text-5xl text-transparent bg-clip-text bg-linear-to-r from-wedding-accent-2-light via-wedding-on-dark to-wedding-accent-light mb-8 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-on-dark)_55%,transparent)] leading-[1.08] py-8">
              {displayNames}
            </h2>

            <p className="font-garet-book text-xs uppercase tracking-[0.4em] text-wedding-on-dark/60 mb-12 max-w-lg mx-auto leading-loose whitespace-pre-line">
              {message}
            </p>
          </div>
        </RevealOnScroll>

        {/* CTA Button */}
        <RevealOnScroll direction="up" delay={0.3} width="100%">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-2 bg-wedding-on-dark/5 backdrop-blur-sm border border-wedding-on-dark/20 rounded-full overflow-hidden hover:bg-wedding-on-dark/10 transition-all duration-500 hover:border-wedding-on-dark/40 hover:scale-105 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-accent-2-light)_35%,transparent)]"
          >
            <span className="relative z-10 font-garet-book text-xs uppercase tracking-[0.2em] text-wedding-on-dark group-hover:text-wedding-accent-2-light transition-colors">
              🚀 Kembali Pulang ✨
            </span>
            <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-wedding-on-dark/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </Link>
        </RevealOnScroll>

        {/* Activid Branding */}
      </div>
    </footer>
  );
}
