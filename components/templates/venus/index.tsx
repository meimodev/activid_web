"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconCalendar,
  IconChat,
  IconCouple,
  IconGallery,
  IconHome,
  IconPause,
  IconPlay,
} from "./graphics";
import { InvitationConfig } from "@/types/invitation";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { venusBody } from "./fonts";
import type { NavSectionId } from "./types";
import { Hero } from "./Hero";
import { HeaderIntroSection } from "./HeaderIntroSection";
import { QuoteSection } from "./QuoteSection";
import { CoupleSection } from "./CoupleSection";
import { EventSection } from "./EventSection";
import { StorySection } from "./StorySection";
import { GallerySection } from "./GallerySection";
import { GiftSection } from "./GiftSection";
import { WishesSection } from "./WishesSection";
import { FooterSection } from "./FooterSection";
import { FloatingNav } from "./FloatingNav";
import { pickDeterministicRandomSubset } from "@/lib/utils";

interface VenusProps {
  config: InvitationConfig;
}

export function Venus({ config }: VenusProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(
  () => !config.sections.hero.enabled,
  );
  const [activeSection, setActiveSection] = useState<NavSectionId>("home");
  const [heroViewportHeight, setHeroViewportHeight] = useState<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const searchParams = useSearchParams();
  const inviteeName = searchParams.get("to");

  // Convert Dropbox "dl=1" or "dl=0" to "raw=1" for reliable streaming
  const audioStreamUrl = useMemo(() => config.music.url.replace(/dl=[01]/, "raw=1"), [config.music.url]);

  const persistentBackgroundPhotos = useMemo(() => {
  return pickDeterministicRandomSubset(
    config.sections.gallery.photos ?? [],
    config.id,
    5,
  );
  }, [config.id, config.sections.gallery.photos]);

  const quoteBackgroundImage = useMemo(() => {
  if (persistentBackgroundPhotos.length >= 2) return persistentBackgroundPhotos[1];
  return persistentBackgroundPhotos[0] || "";
  }, [persistentBackgroundPhotos]);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const update = () => {
  setHeroViewportHeight(window.visualViewport?.height ?? window.innerHeight);
  };

  update();
  window.addEventListener("resize", update);
  const vv = window.visualViewport;
  vv?.addEventListener("resize", update);

  return () => {
  window.removeEventListener("resize", update);
  vv?.removeEventListener("resize", update);
  };
  }, []);

  const guestName = inviteeName || searchParams.get("guest") || "Tamu";

  const hosts = config.hosts;
  const hostsSection = config.sections.hosts;

  const navItems = useMemo(
  () =>
  [
  { id: "home" as const, label: "Cover", icon: <IconHome /> },
  { id: "couple" as const, label: "Hosts", icon: <IconCouple /> },
  { id: "event" as const, label: "Event", icon: <IconCalendar /> },
  { id: "gallery" as const, label: "Gallery", icon: <IconGallery /> },
  { id: "wishes" as const, label: "Wishes", icon: <IconChat /> },
  ],
  []
  );

  useEffect(() => {
  if (!isOpen || !isContentReady) return;

  // Attempt to autoplay once the invitation is opened (user just interacted)
  if (audioRef.current) {
  const playPromise = audioRef.current.play();
  if (playPromise !== undefined) {
  playPromise
  .then(() => setIsPlaying(true))
  .catch(() => setIsPlaying(false));
  }
  }

  const ids: NavSectionId[] = ["home", "couple", "event", "gallery", "wishes"];
  const els = ids
  .map((id) => document.getElementById(id))
  .filter(Boolean) as HTMLElement[];

  if (els.length === 0) return;

  const observer = new IntersectionObserver(
  (entries) => {
  const visible = entries
  .filter((e) => e.isIntersecting)
  .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

  const top = visible[0];
  if (!top?.target) return;

  const id = (top.target as HTMLElement).id as NavSectionId;
  setActiveSection(id);
  },
  {
  root: null,
  rootMargin: "-45% 0px -45% 0px",
  threshold: [0.05, 0.1, 0.2, 0.35, 0.5],
  }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
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

  const scrollTo = (id: NavSectionId) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openInvitation = () => {
  setIsOpen(true);
  if (typeof window !== "undefined") {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }
  };

  return (
  <main
  className={`relative min-h-[100dvh] w-full overflow-x-hidden bg-[#F8F4EC] text-[#2B2424] font-body ${venusBody.variable} [--font-body:var(--font-venus-body)]`}
  >
  {isOpen && persistentBackgroundPhotos.length > 0 ? (
  <div className="fixed inset-0 z-0 pointer-events-none">
  <BackgroundSlideshow photos={persistentBackgroundPhotos} />
  <div className="absolute inset-0 bg-black/45" />
  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/65" />
  </div>
  ) : null}

  <audio ref={audioRef} src={audioStreamUrl} loop preload="auto" />

  {config.sections.hero.enabled ? (
      <motion.div
      className="fixed inset-0 z-[200] bg-[#EFE7D6]"
      style={heroViewportHeight ? { height: heroViewportHeight } : undefined}
      initial={false}
      animate={{
      opacity: isOpen ? 0 : 1,
      transitionEnd: { display: isOpen ? "none" : "block" },
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
      if (isOpen) setIsContentReady(true);
      }}
      >
      <Hero
      onOpen={openInvitation}
      hosts={hosts}
      date={config.weddingDate.displayShort}
      subtitle={config.sections.hero.subtitle}
      coverImage={config.sections.hero.coverImage}
      guestName={guestName}
      />
      </motion.div>
  ) : null}

  <div
  className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}
  >
  <div className={isContentReady ? "" : "h-[100dvh] overflow-hidden"}>
  {isContentReady ? (
  <>
  <HeaderIntroSection hosts={hosts} />

  {config.sections.quote.enabled ? (
  <QuoteSection
  text={config.sections.quote.text}
  targetDate={config.weddingDate.countdownTarget}
  backgroundImage={quoteBackgroundImage}
  />
  ) : null}

  {hostsSection.enabled ? (
  <CoupleSection hosts={hosts} title="Milea & Dilan" />
  ) : null}

  {config.sections.event.enabled ? (
  <EventSection
  events={config.sections.event.events}
  heading={config.sections.event.heading}
  />
  ) : null}

  {config.sections.story.enabled ? (
  <StorySection
  heading={config.sections.story.heading}
  stories={config.sections.story.stories}
  />
  ) : null}

  {config.sections.gallery.enabled ? (
  <GallerySection
  heading={config.sections.gallery.heading}
  photos={config.sections.gallery.photos}
  />
  ) : null}

  {config.sections.gift.enabled ? (
  <GiftSection
  heading={config.sections.gift.heading || "Wedding Gift"}
  bankAccounts={config.sections.gift.bankAccounts}
  description={config.sections.gift.description}
  templateName={config.templateId ?? "venus"}
  eventDate={config.weddingDate.display}
  />
  ) : null}

  {config.sections.wishes.enabled ? (
  <WishesSection
  invitationId={config.id}
  inviteeName={inviteeName}
  heading={config.sections.wishes.heading || "Friends Wishes"}
  placeholder={config.sections.wishes.placeholder}
  thankYouMessage={config.sections.wishes.thankYouMessage}
  />
  ) : null}

  <FooterSection hosts={hosts} />

  {isOpen ? (
      <FloatingNav
      items={navItems}
      active={activeSection}
      onSelect={(id) => scrollTo(id)}
      right={
      <button
      type="button"
      onClick={togglePlay}
      className="h-11 w-11 rounded-full flex items-center justify-center transition border bg-white/60 text-[#2B2424] border-black/10 hover:bg-white"
      aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
      {isPlaying ? <IconPause /> : <IconPlay />}
      </button>
      }
      />
  ) : null}
  </>
  ) : null}
  </div>
  </div>
  </main>
  );
}
