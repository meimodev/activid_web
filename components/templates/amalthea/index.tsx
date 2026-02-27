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

const AMALTHEA_DEMO_ASSETS = {
  groomPhoto:
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
  bridePhoto:
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
  coverImage:
    "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
  backgroundPhotos: [
    "https://images.pexels.com/photos/2528324/pexels-photo-2528324.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5138883/pexels-photo-5138883.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/8102189/pexels-photo-8102189.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/17593652/pexels-photo-17593652.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
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

  const tryParseIsoDate = (value: string): string | null => {
    const v = (value || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return null;
  };

  const tryParseIndonesianDate = (value: string): string | null => {
    const raw = (value || "").trim();
    if (!raw) return null;

    const normalized = raw
      .replace(/^[A-Za-z]+\s*,\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const monthMap: Record<string, number> = {
      januari: 1,
      jan: 1,
      februari: 2,
      feb: 2,
      maret: 3,
      mar: 3,
      april: 4,
      apr: 4,
      mei: 5,
      juni: 6,
      jun: 6,
      juli: 7,
      jul: 7,
      agustus: 8,
      agu: 8,
      ags: 8,
      september: 9,
      sep: 9,
      oktober: 10,
      okt: 10,
      november: 11,
      nov: 11,
      desember: 12,
      des: 12,
    };

    const parts = normalized.split(" ").filter(Boolean);
    if (parts.length < 3) return null;

    const day = Number(parts[0]);
    const monthToken = parts[1]!.toLowerCase().replace(/[^a-z]/g, "");
    const year = Number(parts[2]!.replace(/[^0-9]/g, ""));
    const month = monthMap[monthToken];

    if (!day || !year || !month) return null;
    if (day < 1 || day > 31) return null;
    if (month < 1 || month > 12) return null;
    if (year < 1900) return null;

    return `${year}-${pad2(month)}-${pad2(day)}`;
  };

  const tryParseTimeHM = (value: string): { h: number; m: number } | null => {
    const raw = (value || "").trim();
    if (!raw) return null;
    const match = raw.match(/(\d{1,2})[\.:](\d{2})/);
    if (!match) return null;
    const h = Number(match[1]);
    const m = Number(match[2]);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    if (h < 0 || h > 23) return null;
    if (m < 0 || m > 59) return null;
    return { h, m };
  };

  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(
    () => !config.sections.hero.enabled,
  );
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to");

  const isDemo = config.id.endsWith("-demo");

  const { music, backgroundPhotos, weddingDate, couple, sections, purpose } = config;

  const hosts = Array.isArray(config.hosts) && config.hosts.length
    ? config.hosts
    : [couple.groom, couple.bride].filter(Boolean);

  const hostsSection = sections.hosts ?? sections.couple;

  const baseCouple = {
    groom: hosts[0] ?? couple.groom,
    bride: hosts[1] ?? couple.bride,
  };

  const effectiveCouple = isDemo
    ? {
        ...baseCouple,
        groom: { ...baseCouple.groom, photo: AMALTHEA_DEMO_ASSETS.groomPhoto },
        bride: { ...baseCouple.bride, photo: AMALTHEA_DEMO_ASSETS.bridePhoto },
      }
    : baseCouple;

  const effectiveBackgroundPhotos = isDemo
    ? [...AMALTHEA_DEMO_ASSETS.backgroundPhotos]
    : backgroundPhotos;
  const effectiveGalleryPhotos = isDemo
    ? [...AMALTHEA_DEMO_ASSETS.galleryPhotos]
    : (sections.gallery?.photos ?? []);
  const effectiveCoverImage = isDemo
    ? AMALTHEA_DEMO_ASSETS.coverImage
    : sections.hero.coverImage;

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

    const iso = tryParseIsoDate(first.date) ?? tryParseIndonesianDate(first.date);
    if (!iso) return null;

    const tm = tryParseTimeHM(first.time);
    const h = tm?.h ?? 0;
    const m = tm?.m ?? 0;

    return `${iso}T${pad2(h)}:${pad2(m)}:00`;
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
    <main className="relative min-h-screen overflow-x-hidden bg-[#F6FBFF] text-[#0B1B2A] ">
      {/* <BackgroundSlideshow
        photos={effectiveBackgroundPhotos}
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
            couple={effectiveCouple}
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
                  couple={effectiveCouple}
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
                <HostSection couple={effectiveCouple} purpose={purpose} />
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

              <GratitudeSection couple={effectiveCouple} />

              {sections.footer.enabled ? (
                <FooterSection
                  couple={effectiveCouple}
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
