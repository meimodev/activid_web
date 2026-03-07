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
import { StorySection } from "./StorySection";
import {
  TitleSection,
  CoupleSection,
  EventSection,
  GiftSection,
  FooterSection,
} from "./InfoSections";
import { InvitationConfig } from "@/types/invitation";
import { DateTime } from "luxon";
import {
  deriveInvitationPrimaryDateInfo,
  INVITATION_LOCALE,
  INVITATION_ZONE,
} from "@/lib/date-time";
import { normalizeInvitationGuestName } from "@/lib/utils";
import {
  DEMO_BRIDE_PROFILE_IMAGE_URL,
  DEMO_COVER_IMAGE_URL,
  DEMO_GALLERY_IMAGEKIT_URLS,
  DEMO_GROOM_PROFILE_IMAGE_URL,
} from "@/data/invitations";

const PLUTO_DEMO_ASSETS = {
  groomPhoto: DEMO_GROOM_PROFILE_IMAGE_URL,
  bridePhoto: DEMO_BRIDE_PROFILE_IMAGE_URL,
  coverImage: DEMO_COVER_IMAGE_URL,
  galleryPhotos: DEMO_GALLERY_IMAGEKIT_URLS,
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
  const guestName = normalizeInvitationGuestName(searchParams.get("to"));

  const isDemo = config.id.endsWith("-demo");

  const { music, sections } = config;

  const hostsSection = sections.hosts;
  const hosts = hostsSection.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

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

  const demoCountdownTarget = useMemo(() => {
    const dt = DateTime.now()
      .setZone(INVITATION_ZONE)
      .plus({ days: 3 })
      .startOf("day")
      .set({ second: 0, millisecond: 0 });
    return dt.toISO({ includeOffset: true, suppressMilliseconds: true }) ?? "";
  }, []);

  const demoDisplay = useMemo(() => {
    const dt = DateTime.now().setZone(INVITATION_ZONE).plus({ days: 3 }).startOf("day");
    return dt.setLocale(INVITATION_LOCALE).toFormat("d LLLL yyyy");
  }, []);

  const demoDisplayShort = useMemo(() => {
    const dt = DateTime.now().setZone(INVITATION_ZONE).plus({ days: 3 }).startOf("day");
    return dt.setLocale(INVITATION_LOCALE).toFormat("dd . MM . yyyy");
  }, []);

  const effectiveCountdownTarget = isDemo
    ? demoCountdownTarget
    : (dateInfo?.countdownTarget ?? "");

  const effectiveWeddingDateDisplay = isDemo ? demoDisplay : (dateInfo?.display ?? "");
  const effectiveWeddingDateDisplayShort = isDemo
    ? demoDisplayShort
    : (dateInfo?.displayShort ?? "");

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-wedding-bg text-wedding-text">
      

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
            date={effectiveWeddingDateDisplayShort}
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
                  eventDate={effectiveWeddingDateDisplay}
                />
              ) : null}

              {sections.wishes.enabled ? (
                <Suspense
                  fallback={
                    <div className="py-24 text-center text-wedding-text/60 font-poppins italic">
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

              {sections.gratitude.enabled ? (
                <GratitudeSection hosts={effectiveHosts} message={sections.gratitude.message} />
              ) : null}

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
