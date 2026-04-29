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

const KIDS_SPACE_DEMO_ASSETS = {
  celebrantPhoto: DEMO_GROOM_PROFILE_IMAGE_URL,
  companionPhoto: DEMO_BRIDE_PROFILE_IMAGE_URL,
  coverImage: DEMO_COVER_IMAGE_URL,
  galleryPhotos: DEMO_GALLERY_IMAGEKIT_URLS,
} as const;

interface KidsSpaceProps {
  config: InvitationConfig;
}

export function KidsSpace({ config }: KidsSpaceProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const searchParams = useSearchParams();
  const guestName = normalizeInvitationGuestName(searchParams.get("to"));

  const isDemo = config.id.endsWith("-demo");
  const { music, sections } = config;
  const hosts = sections.hosts.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

  const effectiveHosts = useMemo<[Host, ...Host[]]>(() => {
    if (!isDemo) return hosts as [Host, ...Host[]];

    const next = [...hosts] as [Host, ...Host[]];
    next[0] = { ...next[0], photo: KIDS_SPACE_DEMO_ASSETS.celebrantPhoto };
    if (next[1]) {
      next[1] = { ...next[1], photo: KIDS_SPACE_DEMO_ASSETS.companionPhoto };
    }
    return next;
  }, [hosts, isDemo]);

  const effectiveGalleryPhotos = isDemo
    ? Array.from(KIDS_SPACE_DEMO_ASSETS.galleryPhotos)
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? KIDS_SPACE_DEMO_ASSETS.coverImage
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
  const isMarsMission = accentColor === "#ef4444" && darkColor === "#050202";
  const isStarPrincess = accentColor === "#ec4899" && darkColor === "#0d0412";
  const isUnicornDreams = accentColor === "#e879f9" && darkColor === "#041014";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg text-wedding-text">
      <MusicPlayer shouldStart={isOpen} audioUrl={music.url} variant="space" />

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
            isMarsMission={isMarsMission}
            isStarPrincess={isStarPrincess}
            isUnicornDreams={isUnicornDreams}
          />
        </motion.div>
      ) : null}

      <div className="relative z-10">
        <div className={isOpen ? "" : "h-dvh overflow-hidden"}>
          {sections.title.enabled ? (
            <TitleSection
              hosts={effectiveHosts}
              date={effectiveDateDisplay}
              heading={sections.title.heading}
              countdownTarget={effectiveCountdownTarget}
              galleryPhotos={effectiveGalleryPhotos}
              showCountdown={sections.countdown.enabled}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.quote.enabled ? (
            <QuoteSection quote={sections.quote}
              isMarsMission={isMarsMission} isStarPrincess={isStarPrincess} isUnicornDreams={isUnicornDreams} />
          ) : null}

          {sections.hosts.enabled ? (
            <HostSection hosts={effectiveHosts}
              isMarsMission={isMarsMission} isStarPrincess={isStarPrincess} isUnicornDreams={isUnicornDreams} />
          ) : null}

          {sections.event.enabled ? (
            <EventSection
              events={sections.event.events}
              heading={sections.event.heading}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.story.enabled ? (
            <StorySection
              stories={sections.story.stories}
              heading={sections.story.heading}
              fallbackImageUrl={effectiveGalleryPhotos[0]}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.gallery.enabled ? (
            <GallerySection
              photos={effectiveGalleryPhotos}
              heading={sections.gallery.heading}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.gift.enabled ? (
            <GiftSection
              bankAccounts={sections.gift.bankAccounts}
              heading={sections.gift.heading}
              description={sections.gift.description}
              templateName={config.templateId}
              eventDate={effectiveDateDisplay}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.wishes.enabled ? (
            <Suspense
              fallback={
                <div className="py-24 text-center font-garet-book text-white/30 italic">
                  Loading wishes...
                </div>
              }
            >
              <Wishes
                invitationId={config.id}
                heading={sections.wishes.heading}
                placeholder={sections.wishes.placeholder}
                thankYouMessage={sections.wishes.thankYouMessage}
                isMarsMission={isMarsMission}
                isStarPrincess={isStarPrincess}
                isUnicornDreams={isUnicornDreams}
              />
            </Suspense>
          ) : null}

          {sections.gratitude.enabled ? (
            <GratitudeSection
              hosts={effectiveHosts}
              message={sections.gratitude.message}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}

          {sections.footer.enabled ? (
            <FooterSection
              hosts={effectiveHosts}
              message={sections.footer.message}
              isMarsMission={isMarsMission}
              isStarPrincess={isStarPrincess}
              isUnicornDreams={isUnicornDreams}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
