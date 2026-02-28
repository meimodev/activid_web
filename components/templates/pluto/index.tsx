"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "./Hero";
import { QuoteSection } from "./QuoteSection";
import { Gallery } from "./Gallery";
import { Wishes } from "./Wishes";
import { GratitudeSection } from "./GratitudeSection";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { StorySection } from "./StorySection";
import {
  TitleSection,
  CoupleSection,
  EventSection,
  GiftSection,
  FooterSection,
} from "./InfoSections";
import { InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";

const PLUTO_DEMO_ASSETS = {
  groomPhoto:
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
  bridePhoto:
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
  coverImage:
    "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
  galleryPhotos: [
    "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
} as const;

interface PlutoProps {
  config: InvitationConfig;
}

export function Pluto({ config }: PlutoProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(
    () => !config.sections.hero.enabled,
  );
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  const isDemo = config.id.endsWith("-demo");

  const { music, weddingDate, sections } = config;

  const hosts = config.hosts;
  const hostsSection = sections.hosts;

  const effectiveHosts = useMemo(() => {
    if (!isDemo) return hosts;
    const next = hosts.map((h) => ({ ...h }));
    if (next[0]) next[0] = { ...next[0], photo: PLUTO_DEMO_ASSETS.groomPhoto };
    if (next[1]) next[1] = { ...next[1], photo: PLUTO_DEMO_ASSETS.bridePhoto };
    return next;
  }, [hosts, isDemo]);

  const effectiveGalleryPhotos = isDemo
    ? [...PLUTO_DEMO_ASSETS.galleryPhotos]
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? PLUTO_DEMO_ASSETS.coverImage
    : sections.hero.coverImage;

  const derivedPhotos = useMemo(
    () => pickDeterministicRandomSubset(effectiveGalleryPhotos, config.id, 5),
    [config.id, effectiveGalleryPhotos],
  );

  const demoCountdownTarget = useMemo(() => {
    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    dt.setHours(0, 0, 0, 0);

    const pad2 = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}T00:00:00`;
  }, []);

  const effectiveCountdownTarget = isDemo
    ? demoCountdownTarget
    : weddingDate.countdownTarget;

  const effectiveWeddingDateDisplay = useMemo(() => {
    if (!isDemo) return weddingDate.display;

    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    const month = dt.toLocaleString("id-ID", { month: "long" });
    return `${dt.getDate()} ${month} ${dt.getFullYear()}`;
  }, [isDemo, weddingDate.display]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg text-wedding-text">
      <BackgroundSlideshow
        photos={derivedPhotos}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10"
      />

      <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

      {sections.hero.enabled ? (
        <motion.div
          className="absolute inset-0 z-50"
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            transitionEnd: {
              display: isOpen ? "none" : "block",
            },
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (isOpen) setIsContentReady(true);
          }}
        >
          <Hero
            onOpen={() => {
              setIsOpen(true);
            }}
            hosts={effectiveHosts}
            date={weddingDate.displayShort}
            subtitle={sections.hero.subtitle}
            coverImage={effectiveCoverImage}
            guestName={guestName || undefined}
          />
        </motion.div>
      ) : null}

      <div
        className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}
      >
        <div className={isContentReady ? "" : "h-screen overflow-hidden"}>
          {isContentReady ? (
            <>
              {sections.title.enabled ? (
                <TitleSection
                  hosts={effectiveHosts}
                  date={effectiveWeddingDateDisplay}
                  heading={sections.title.heading}
                  countdownTarget={effectiveCountdownTarget}
                  galleryPhotos={effectiveGalleryPhotos}
                  showCountdown={sections.countdown.enabled}
                />
              ) : null}

              {sections.quote.enabled ? (
                <QuoteSection quote={sections.quote} />
              ) : null}

              {hostsSection.enabled ? (
                <CoupleSection hosts={effectiveHosts} />
              ) : null}
              {sections.event.enabled ? (
                <EventSection
                  events={sections.event.events}
                  heading={sections.event.heading}
                />
              ) : null}

              {sections.gallery.enabled ? (
                <Gallery
                  photos={effectiveGalleryPhotos}
                  heading={sections.gallery.heading}
                />
              ) : null}
              {sections.story.enabled ? (
                <StorySection
                  stories={sections.story.stories}
                  heading={sections.story.heading}
                  fallbackImageUrl={effectiveGalleryPhotos[0]}
                />
              ) : null}


              

              {sections.gift.enabled ? (
                <GiftSection
                  bankAccounts={sections.gift.bankAccounts}
                  heading={sections.gift.heading}
                  description={sections.gift.description}
                  templateName={config.templateId || "pluto"}
                  eventDate={weddingDate.display}
                />
              ) : null}

              {sections.wishes.enabled ? (
                <Suspense
                  fallback={
                    <div className="py-24 text-center text-[#3A2F2F]/60 font-poppins italic">
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
              ) : null}

              <GratitudeSection hosts={effectiveHosts} />

              {sections.footer.enabled ? (
                <FooterSection
                  hosts={effectiveHosts}
                  message={sections.footer.message}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
