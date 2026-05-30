"use client";

import { Bodoni_Moda, DM_Sans } from "next/font/google";

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
import { RoyalCrownDivider, OrnateFleurDivider, MandalaDivider, RegalBarDivider } from "./graphics/dividers";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { GrowingSwayingFloral } from "./graphics/GrowingSwayingFloral";
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

const display = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });

const EDEN_DEMO_ASSETS = {
  groomPhoto: DEMO_GROOM_PROFILE_IMAGE_URL,
  bridePhoto: DEMO_BRIDE_PROFILE_IMAGE_URL,
  coverImage: DEMO_COVER_IMAGE_URL,
  galleryPhotos: DEMO_GALLERY_IMAGEKIT_URLS,
} as const;

interface EdenProps {
  config: InvitationConfig;
}

export function Eden({ config }: EdenProps) {
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
    if (next[0]) next[0] = { ...next[0], photo: EDEN_DEMO_ASSETS.groomPhoto };
    if (next[1]) next[1] = { ...next[1], photo: EDEN_DEMO_ASSETS.bridePhoto };
    return next;
  }, [hosts, isDemo]);

  const effectiveGalleryPhotos = isDemo
    ? [...EDEN_DEMO_ASSETS.galleryPhotos]
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? EDEN_DEMO_ASSETS.coverImage
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
    <main className={`relative min-h-[100dvh] overflow-x-hidden bg-wedding-bg text-wedding-text ${display.variable} ${body.variable} font-body`}>
      

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
              {/* Scattered background/margin florals dynamically growing and swaying */}
              <GrowingSwayingFloral
                src={EDEN_OVERLAY_ASSETS.leafSide}
                initialRotate={30}
                className="absolute left-[-45px] top-[26%] w-36 h-36 z-10 pointer-events-none opacity-80 mix-blend-multiply"
                growDelay={0.25}
                swayDuration={8.0}
                originX="10%"
                originY="50%"
              />
              <GrowingSwayingFloral
                src={EDEN_OVERLAY_ASSETS.leafSide2}
                initialRotate={-30}
                className="absolute right-[-45px] top-[42%] w-40 h-40 z-10 pointer-events-none opacity-80 mix-blend-multiply scale-x-[-1]"
                growDelay={0.35}
                swayDuration={7.6}
                originX="90%"
                originY="50%"
              />
              <GrowingSwayingFloral
                src={EDEN_OVERLAY_ASSETS.leafSide}
                initialRotate={15}
                className="absolute left-[-40px] top-[60%] w-36 h-36 z-10 pointer-events-none opacity-80 mix-blend-multiply"
                growDelay={0.4}
                swayDuration={8.8}
                originX="10%"
                originY="50%"
              />
              <GrowingSwayingFloral
                src={EDEN_OVERLAY_ASSETS.leafSide2}
                initialRotate={-40}
                className="absolute right-[-40px] top-[76%] w-36 h-36 z-10 pointer-events-none opacity-80 mix-blend-multiply scale-x-[-1]"
                growDelay={0.3}
                swayDuration={8.2}
                originX="90%"
                originY="50%"
              />

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
                <>
                  <RoyalCrownDivider />
                  <QuoteSection quote={sections.quote} />
                </>
              ) : null}

              {hostsSection.enabled ? (
                <>
                  <OrnateFleurDivider />
                  <CoupleSection hosts={effectiveHosts} />
                </>
              ) : null}
              {sections.event.enabled ? (
                <>
                  <RoyalCrownDivider />
                  <EventSection
                    events={sections.event.events}
                    heading={sections.event.heading}
                  />
                </>
              ) : null}

              {sections.gallery.enabled ? (
                <>
                  <OrnateFleurDivider />
                  <Gallery
                    photos={effectiveGalleryPhotos}
                    heading={sections.gallery.heading}
                  />
                </>
              ) : null}
              {sections.story.enabled ? (
                <>
                  <MandalaDivider />
                  <StorySection
                    stories={sections.story.stories}
                    heading={sections.story.heading}
                    fallbackImageUrl={effectiveGalleryPhotos[0]}
                  />
                </>
              ) : null}




              {sections.gift.enabled ? (
                <>
                  <RegalBarDivider />
                  <GiftSection
                    bankAccounts={sections.gift.bankAccounts}
                    heading={sections.gift.heading}
                    description={sections.gift.description}
                    templateName={config.templateId || "eden"}
                    eventDate={effectiveWeddingDateDisplay}
                  />
                </>
              ) : null}

              {sections.wishes.enabled ? (
                <>
                  <MandalaDivider />
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
                </>
              ) : null}

              {sections.gratitude.enabled ? (
                <>
                  <RegalBarDivider />
                  <GratitudeSection hosts={effectiveHosts} message={sections.gratitude.message} />
                </>
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
