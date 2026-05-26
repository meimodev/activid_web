"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { InvitationConfig } from "@/types/invitation";

import { normalizeInvitationGuestName } from "@/lib/utils";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";
import { royalSerif, royalScript, royalSans } from "./fonts";
import { HeroCover } from "./HeroCover";
import { HeroSection as Hero } from "./HeroSection";
import { CountdownSection } from "./CountdownSection";
import { CoupleSection } from "./CoupleSection";
import { StorySection } from "./StorySection";
import { EventSection } from "./EventSection";
import { VenueSection } from "./VenueSection";
import { GallerySection } from "./GallerySection";
import { RsvpSection } from "./RsvpSection";
import { GiftSection } from "./GiftSection";
import { QuoteSection } from "./QuoteSection";
import { GratitudeSection } from "./GratitudeSection";
import { FooterSection } from "./FooterSection";
import { Petals } from "./graphics";
import { MusicButton } from "./MusicButton";

interface RoyalProps {
  config: InvitationConfig;
}

export function Royal({ config }: RoyalProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(() => !config.sections.hero.enabled);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const searchParams = useSearchParams();
  const inviteeName = normalizeInvitationGuestName(searchParams.get("to"));

  const audioStreamUrl = useMemo(
    () => config.music.url.replace(/dl=[01]/, "raw=1"),
    [config.music.url],
  );

  const hosts = config.sections.hosts.hosts;
  const hostsSection = config.sections.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(
    config.sections.event.events[0]?.date,
  );

  const guestName = inviteeName || searchParams.get("guest") || "Guest";

  useEffect(() => {
    if (!isOpen || !isContentReady) return;

    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [isContentReady, isOpen]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    const p = audioRef.current.play();
    if (p !== undefined) {
      p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(true);
    }
  };

  const openInvitation = () => {
    setIsOpen(true);
    setIsContentReady(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className={`relative min-h-[100dvh] w-full overflow-x-hidden font-[var(--font-royal-serif)] ${royalSerif.variable} ${royalScript.variable} ${royalSans.variable}`}
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, var(--invitation-bg-alt) 0%, var(--invitation-bg) 38%, var(--invitation-dark, var(--invitation-bg)) 100%)",
        color: "var(--invitation-text)",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,97,0), 0 0 24px rgba(201,169,97,0.1); }
          50% { box-shadow: 0 0 0 1px rgba(201,169,97,0.35), 0 0 32px rgba(201,169,97,0.3); }
        }
        @keyframes bloom-breath {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(2deg); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .shimmer-text {
          background: linear-gradient(
            100deg,
            var(--invitation-accent) 0%,
            var(--invitation-accent) 35%,
            color-mix(in srgb, var(--invitation-accent) 130%, white) 48%,
            color-mix(in srgb, var(--invitation-accent) 140%, white) 52%,
            var(--invitation-accent) 65%,
            var(--invitation-accent) 100%
          );
          background-size: 250% 100%;
          background-position: 100% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer-royal 4.5s ease-in-out infinite;
        }
        @keyframes shimmer-royal {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        .royal-scroll::-webkit-scrollbar { width: 4px; }
        .royal-scroll::-webkit-scrollbar-track { background: transparent; }
        .royal-scroll::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--invitation-accent) 30%, transparent); border-radius: 2px; }
      `}</style>

      {/* Petal layer */}
      {isOpen && <Petals intensity={10} />}

      {/* Audio */}
      <audio ref={audioRef} src={audioStreamUrl} loop preload="auto" />

      {/* Hero Cover (envelope) */}
      {config.sections.hero.enabled && !isOpen ? (
        <HeroCover
          onOpen={openInvitation}
          hosts={hosts}
          date={dateInfo?.displayShort ?? ""}
          guestName={guestName}
        />
      ) : null}

      {/* Content area */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}
      >
        <div className={isContentReady ? "" : "h-[100dvh] overflow-hidden"}>
          {isContentReady ? (
            <>
              {/* Hero section (post-envelope) */}
              {config.sections.hero.enabled ? (
                <Hero
                  hosts={hosts}
                  date={dateInfo?.displayShort ?? ""}
                  subtitle={config.sections.hero.subtitle}
                />
              ) : null}

              {/* Countdown */}
              {config.sections.countdown.enabled &&
              dateInfo?.countdownTarget ? (
                <CountdownSection targetDate={dateInfo.countdownTarget} />
              ) : null}

              {/* Quote */}
              {config.sections.quote.enabled ? (
                <QuoteSection
                  text={config.sections.quote.text}
                  author={config.sections.quote.author}
                />
              ) : null}

              {/* Couple (Bride & Groom) */}
              {hostsSection.enabled ? (
                <CoupleSection hosts={hosts} />
              ) : null}

              {/* Story */}
              {config.sections.story.enabled ? (
                <StorySection
                  stories={config.sections.story.stories}
                />
              ) : null}

              {/* Events */}
              {config.sections.event.enabled ? (
                <EventSection
                  events={config.sections.event.events}
                />
              ) : null}

              {/* Venue */}
              {config.sections.event.enabled &&
              config.sections.event.events[0] ? (
                <VenueSection
                  venue={config.sections.event.events[0].venue}
                  address={config.sections.event.events[0].address}
                  mapUrl={config.sections.event.events[0].mapUrl}
                />
              ) : null}

              {/* Gallery */}
              {config.sections.gallery.enabled ? (
                <GallerySection
                  photos={config.sections.gallery.photos}
                />
              ) : null}

              {/* RSVP */}
              {config.sections.rsvp.enabled ? (
                <RsvpSection
                  description={config.sections.rsvp.description}
                  successMessage={config.sections.rsvp.successMessage}
                />
              ) : null}

              {/* Gift */}
              {config.sections.gift.enabled ? (
                <GiftSection
                  bankAccounts={config.sections.gift.bankAccounts}
                  description={config.sections.gift.description}
                  templateName={config.templateId}
                  eventDate={dateInfo?.display ?? ""}
                />
              ) : null}

              {/* Gratitude */}
              {config.sections.gratitude.enabled ? (
                <GratitudeSection
                  hosts={hosts}
                  message={config.sections.gratitude.message}
                />
              ) : null}

              {/* Footer */}
              <FooterSection hosts={hosts} />

              {/* Music player button */}
              {isOpen && (
                <MusicButton isPlaying={isPlaying} onToggle={togglePlay} />
              )}
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
