"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { GiftSection } from "./GiftSection";
import {
  DEMO_BRIDE_PROFILE_IMAGE_URL,
  DEMO_COVER_IMAGE_URL,
  DEMO_GALLERY_IMAGEKIT_URLS,
  DEMO_GROOM_PROFILE_IMAGE_URL,
} from "@/data/invitations";
import {
  deriveInvitationPrimaryDateInfo,
  INVITATION_LOCALE,
  INVITATION_ZONE,
  parseInvitationDateTime,
} from "@/lib/date-time";
import { normalizeInvitationGuestName } from "@/lib/utils";
import type { Host, InvitationConfig } from "@/types/invitation";
import { Hero } from "./Hero";
import { TitleSection } from "./TitleSection";
import { QuoteSection, HostSection, EventSection } from "./FeatureSections";
import {
  StorySection,
  GallerySection,
  GratitudeSection,
  FooterSection,
} from "./ClosingSections";
import { Wishes } from "./Wishes";

const KIDS_BIRTHDAY_DEMO_ASSETS = {
  celebrantPhoto: DEMO_GROOM_PROFILE_IMAGE_URL,
  companionPhoto: DEMO_BRIDE_PROFILE_IMAGE_URL,
  coverImage: DEMO_COVER_IMAGE_URL,
  galleryPhotos: DEMO_GALLERY_IMAGEKIT_URLS,
} as const;

interface KidsBirthdayProps {
  config: InvitationConfig;
}

export function KidsBirthday({ config }: KidsBirthdayProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(() => !config.sections.hero.enabled);
  const searchParams = useSearchParams();
  const guestName = normalizeInvitationGuestName(searchParams.get("to"));

  const isDemo = config.id.endsWith("-demo");
  const { music, sections } = config;
  const hosts = sections.hosts.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

  const effectiveHosts = useMemo<[Host, ...Host[]]>(() => {
    if (!isDemo) return hosts as [Host, ...Host[]];

    const next = [...hosts] as [Host, ...Host[]];
    next[0] = { ...next[0], photo: KIDS_BIRTHDAY_DEMO_ASSETS.celebrantPhoto };
    if (next[1]) {
      next[1] = { ...next[1], photo: KIDS_BIRTHDAY_DEMO_ASSETS.companionPhoto };
    }
    return next;
  }, [hosts, isDemo]);

  const effectiveGalleryPhotos = isDemo
    ? Array.from(KIDS_BIRTHDAY_DEMO_ASSETS.galleryPhotos)
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? KIDS_BIRTHDAY_DEMO_ASSETS.coverImage
    : sections.hero.coverImage;

  const demoCountdownTarget = useMemo(() => {
    const dt = DateTime.now()
      .setZone(INVITATION_ZONE)
      .plus({ days: 3 })
      .startOf("day")
      .set({ second: 0, millisecond: 0 });
    return dt.toISO({ includeOffset: true, suppressMilliseconds: true }) ?? "";
  }, []);

  const firstEventCountdownTarget = useMemo(() => {
    const raw = sections.event?.events;
    if (!raw) return null;

    const first = raw[0];
    if (!first) return null;

    const dateValue = (first as { date?: unknown } | null)?.date;
    const dt = parseInvitationDateTime(dateValue);
    if (!dt) return null;

    return (
      dt
        .setZone(INVITATION_ZONE)
        .set({ second: 0, millisecond: 0 })
        .toISO({ includeOffset: true, suppressMilliseconds: true }) ?? null
    );
  }, [sections.event.events]);

  const effectiveCountdownTarget =
    firstEventCountdownTarget ?? (isDemo ? demoCountdownTarget : (dateInfo?.countdownTarget ?? ""));

  const effectiveDateDisplay = useMemo(() => {
    if (!isDemo) return dateInfo?.display ?? "";
    const dt = DateTime.now().setZone(INVITATION_ZONE).plus({ days: 3 }).startOf("day");
    return dt.setLocale(INVITATION_LOCALE).toFormat("d LLLL yyyy");
  }, [dateInfo?.display, isDemo]);

  const effectiveDateDisplayShort = useMemo(() => {
    if (!isDemo) return dateInfo?.displayShort ?? "";
    const dt = DateTime.now().setZone(INVITATION_ZONE).plus({ days: 3 }).startOf("day");
    return dt.setLocale(INVITATION_LOCALE).toFormat("dd . MM . yyyy");
  }, [dateInfo?.displayShort, isDemo]);

  const accentColor = config.theme.accentColor.toLowerCase();
  const darkColor = config.theme.darkColor?.toLowerCase() ?? "";
  const isSoccerArgentina =
    accentColor === "#1a6fc4" && darkColor === "#00205b";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg text-wedding-text">
      <MusicPlayer shouldStart={isOpen} audioUrl={music.url} variant="fun" />

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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (isOpen) setIsContentReady(true);
          }}
        >
          <Hero
            onOpen={() => {
              setIsOpen(true);
            }}
            hosts={effectiveHosts}
            date={effectiveDateDisplayShort}
            subtitle={sections.hero.subtitle}
            coverImage={effectiveCoverImage}
            guestName={guestName || undefined}
            isOceanExplorer={
              /* We can't rely on config.theme.id since it doesn't exist on InvitationConfig, 
                 but we can infer it by matching the theme colors to the Ocean Explorer theme colors */
              config.theme.mainColor.toLowerCase() === "#f0f9ff".toLowerCase() &&
              config.theme.accentColor.toLowerCase() === "#0369a1".toLowerCase()
            }
            isSoccerArgentina={
              accentColor === "#1a6fc4" && darkColor === "#00205b"
            }
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
                  date={effectiveDateDisplay}
                  heading={sections.title.heading}
                  countdownTarget={effectiveCountdownTarget}
                  galleryPhotos={effectiveGalleryPhotos}
                  showCountdown={sections.countdown.enabled}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.quote.enabled ? (
                <QuoteSection quote={sections.quote} isReady={isContentReady} isSoccerArgentina={isSoccerArgentina} />
              ) : null}

              {sections.hosts.enabled ? (
                <HostSection hosts={effectiveHosts} isReady={isContentReady} isSoccerArgentina={isSoccerArgentina} />
              ) : null}

              {sections.event.enabled ? (
                <EventSection
                  events={sections.event.events}
                  heading={sections.event.heading}
                  isReady={isContentReady}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.story.enabled ? (
                <StorySection
                  stories={sections.story.stories}
                  heading={sections.story.heading}
                  fallbackImageUrl={effectiveGalleryPhotos[0]}
                  isReady={isContentReady}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.gallery.enabled ? (
                <GallerySection
                  photos={effectiveGalleryPhotos}
                  heading={sections.gallery.heading}
                  isReady={isContentReady}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.gift.enabled ? (
                <GiftSection
                  bankAccounts={sections.gift.bankAccounts}
                  heading={sections.gift.heading}
                  description={sections.gift.description}
                  templateName={config.templateId}
                  eventDate={effectiveDateDisplay}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.wishes.enabled ? (
                <Suspense
                  fallback={
                    <div className="py-24 text-center font-poppins italic text-wedding-dark/55">
                      Loading wishes...
                    </div>
                  }
                >
                  <Wishes
                    invitationId={config.id}
                    heading={sections.wishes.heading}
                    placeholder={sections.wishes.placeholder}
                    thankYouMessage={sections.wishes.thankYouMessage}
                    isReady={isContentReady}
                    isSoccerArgentina={isSoccerArgentina}
                  />
                </Suspense>
              ) : null}

              {sections.gratitude.enabled ? (
                <GratitudeSection
                  hosts={effectiveHosts}
                  message={sections.gratitude.message}
                  isReady={isContentReady}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}

              {sections.footer.enabled ? (
                <FooterSection
                  hosts={effectiveHosts}
                  message={sections.footer.message}
                  isReady={isContentReady}
                  isSoccerArgentina={isSoccerArgentina}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
