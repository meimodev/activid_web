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
  HostSection,
  EventSection,
  GiftSection,
  FooterSection,
} from "./InfoSections";
import { InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";

const AMALTHEA_DEMO_ASSETS = {
  groomPhoto:
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
  bridePhoto:
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
  coverImage:
    "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
  galleryPhotos: [
    "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5138883/pexels-photo-5138883.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8102189/pexels-photo-8102189.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/17593652/pexels-photo-17593652.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/29981994/pexels-photo-29981994.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
} as const;

interface AmaltheaProps {
  config: InvitationConfig;
}

export function Amalthea({ config }: AmaltheaProps) {
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const isInt = (value: unknown): value is number => Number.isInteger(value);

  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(
    () => !config.sections.hero.enabled,
  );
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  const isDemo = config.id.endsWith("-demo");

  const { music, weddingDate, sections, purpose } = config;

  const hostsSection = sections.hosts;

  const effectiveHosts = useMemo(() => {
    if (!isDemo) return config.hosts;

    const next = [...config.hosts];
    if (next[0]) {
      next[0] = { ...next[0], photo: AMALTHEA_DEMO_ASSETS.groomPhoto };
    }
    if (next[1]) {
      next[1] = { ...next[1], photo: AMALTHEA_DEMO_ASSETS.bridePhoto };
    }
    return next;
  }, [config.hosts, isDemo]);

  const effectiveGalleryPhotos = isDemo
    ? [...AMALTHEA_DEMO_ASSETS.galleryPhotos]
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? AMALTHEA_DEMO_ASSETS.coverImage
    : sections.hero.coverImage;

  const derivedPhotos = useMemo(
    () => pickDeterministicRandomSubset(effectiveGalleryPhotos, config.id, 5),
    [config.id, effectiveGalleryPhotos],
  );

  const demoCountdownTarget = useMemo(() => {
    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    dt.setHours(0, 0, 0, 0);

    return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}T00:00:00`;
  }, []);

  const firstEventCountdownTarget = useMemo(() => {
    const raw = sections.event?.events;
    if (!raw) return null;

    const list = Array.isArray(raw)
      ? raw
      : [raw.holyMatrimony, raw.reception, ...Object.values(raw)].filter(Boolean);
    const first = list[0];
    if (!first) return null;

    const dateValue = (first as { date?: unknown } | null)?.date as
      | {
          date?: { year?: unknown; month?: unknown; day?: unknown };
          time?: { hour?: unknown; minute?: unknown };
          year?: unknown;
          month?: unknown;
          day?: unknown;
          hour?: unknown;
          minute?: unknown;
        }
      | undefined;

    const nestedDate = dateValue?.date;
    const nestedTime = dateValue?.time;

    const year = isInt(nestedDate?.year) ? nestedDate.year : isInt(dateValue?.year) ? dateValue.year : null;
    const month = isInt(nestedDate?.month) ? nestedDate.month : isInt(dateValue?.month) ? dateValue.month : null;
    const day = isInt(nestedDate?.day) ? nestedDate.day : isInt(dateValue?.day) ? dateValue.day : null;
    if (!year || !month || !day) return null;

    const hour = isInt(nestedTime?.hour) ? nestedTime.hour : isInt(dateValue?.hour) ? dateValue.hour : 0;
    const minute = isInt(nestedTime?.minute)
      ? nestedTime.minute
      : isInt(dateValue?.minute)
        ? dateValue.minute
        : 0;

    return `${year}-${pad2(month)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:00`;
  }, [sections.event?.events]);

  const effectiveCountdownTarget =
    firstEventCountdownTarget ?? (isDemo ? demoCountdownTarget : weddingDate.countdownTarget);

  const effectiveWeddingDateDisplay = useMemo(() => {
    if (!isDemo) return weddingDate.display;

    const dt = new Date();
    dt.setDate(dt.getDate() + 3);
    const month = dt.toLocaleString("id-ID", { month: "long" });
    return `${dt.getDate()} ${month} ${dt.getFullYear()}`;
  }, [isDemo, weddingDate.display]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg text-wedding-text ">
      {/* <BackgroundSlideshow
        photos={derivedPhotos}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-15"
      /> */}

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
            purpose={purpose}
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
                  purpose={purpose}
                />
              ) : null}

              {sections.quote.enabled ? (
                <QuoteSection quote={sections.quote} />
              ) : null}

              {hostsSection.enabled ? (
                <HostSection hosts={effectiveHosts} purpose={purpose} />
              ) : null}
              {sections.event.enabled ? (
                <EventSection
                  events={sections.event.events}
                  heading={sections.event.heading}
                  purpose={purpose}
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
                  templateName={config.templateId || "amalthea"}
                  eventDate={weddingDate.display}
                />
              ) : null}

              {sections.wishes.enabled ? (
                <Suspense
                  fallback={
                    <div className="py-24 text-center text-[#0B1B2A]/55 font-poppins italic">
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
