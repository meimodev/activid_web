"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  IconArrowRight,
  NeptuneOverlayFloat,
  IconPause,
  IconPlay,
  NEPTUNE_OVERLAY_ASSETS,
  NEPTUNE_OVERLAY_URLS,
} from "./graphics";
import { HeroSection } from "./HeroSection";
import { HostsSection } from "./HostsSection";
import { FooterMark } from "./FooterMark";
import { GiftSectionClassic } from "./GiftSectionClassic";
import { GallerySectionClassic } from "./GallerySectionClassic";
import { QuoteSection } from "./QuoteSection";
import { StorySectionClassic } from "./StorySectionClassic";
import { ThankYouSection } from "./ThankYouSection";
import { TitleCountdownSection } from "./TitleCountdownSection";
import { WeddingEventSection } from "./WeddingEventSection";
import { WishesSectionClassic } from "./WishesSectionClassic";
import { neptuneBody, neptuneScript, neptuneSerif } from "./fonts";
import { NeptuneReveal } from "./reveal";
import {
  InvitationConfig,
} from "@/types/invitation";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  deriveInvitationPrimaryDateInfo,
  formatRelativeToNow,
} from "@/lib/date-time";
import { normalizeInvitationGuestName, pickDeterministicRandomSubset } from "@/lib/utils";

interface NeptuneProps {
  config: InvitationConfig;
}

function deriveMusicTitle(url: string) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop() ?? "";
    const withoutExt = last.replace(/\.(mp3|wav|m4a|aac|ogg)$/i, "");
    const decoded = decodeURIComponent(withoutExt);
    const cleaned = decoded
      .replace(/[._]+/g, " ")
      .replace(/[-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || "Music";
  } catch {
    const last = url.split("/").pop() ?? "";
    const withoutQuery = last.split("?")[0] ?? last;
    const withoutExt = withoutQuery.replace(/\.(mp3|wav|m4a|aac|ogg)$/i, "");
    const cleaned = withoutExt
      .replace(/[._]+/g, " ")
      .replace(/[-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || "Music";
  }
}

export function Neptune({ config }: NeptuneProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);

  const [isContentReady, setIsContentReady] = useState(
    () => !config.sections.hero.enabled,
  );

  const [pageAssetsReady, setPageAssetsReady] = useState(
    () => !config.sections.hero.enabled,
  );
  const [openRequested, setOpenRequested] = useState(false);
  const coverTransitionMs = 780;
  const coverClosing = config.sections.hero.enabled && openRequested && !isOpen;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioStreamUrl = useMemo(
    () => config.music.url.replace(/dl=[01]/, "raw=1"),
    [config.music.url],
  );

  const musicTitle = useMemo(() => {
    const t = config.music.title?.trim();
    if (t) return t;
    return deriveMusicTitle(config.music.url);
  }, [config.music.title, config.music.url]);

  const derivedPhotos = useMemo(
    () =>
      pickDeterministicRandomSubset(
        config.sections.gallery.photos ?? [],
        config.id,
        5,
      ),
    [config.id, config.sections.gallery.photos],
  );

  const storyPhoto = useMemo(() => derivedPhotos[0] ?? "", [derivedPhotos]);

  const hosts = config.sections.hosts.hosts;
  const hostsSection = config.sections.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(
    config.sections.event.events[0]?.date,
  );

  const coupleTitle = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  const inviteLine =
    "Tanpa mengurangi rasa hormat dengan ini kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami";

  useEffect(() => {
    if (!config.sections.hero.enabled) return;
    if (typeof window === "undefined") return;

    const urls = Array.from(
      new Set(
        [
          config.sections.hero.coverImage,
          derivedPhotos[0],
          ...NEPTUNE_OVERLAY_URLS,
        ].filter(Boolean),
      ),
    );

    let cancelled = false;

    const preload = async () => {
      await Promise.all(
        urls.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new window.Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            }),
        ),
      );
      if (!cancelled) setPageAssetsReady(true);
    };

    preload();

    return () => {
      cancelled = true;
    };
  }, [
    config.sections.hero.coverImage,
    config.sections.hero.enabled,
    derivedPhotos,
  ]);

  useEffect(() => {
    if (!coverClosing) return;
    const t = window.setTimeout(() => {
      setIsOpen(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, coverTransitionMs);

    return () => window.clearTimeout(t);
  }, [coverClosing, coverTransitionMs]);

 
  const inviteeName = useMemo(() => {
    if (typeof window === "undefined") return null;
    const sp = new URLSearchParams(window.location.search);
    return normalizeInvitationGuestName(sp.get("to"));
  }, []);

  const guestName = useMemo(() => {
    if (inviteeName) return inviteeName;
    if (typeof window === "undefined") return "Tamu";
    const sp = new URLSearchParams(window.location.search);
    return sp.get("guest") || "Tamu";
  }, [inviteeName]);

  useEffect(() => {
    if (!isOpen ) return;

    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  }, [ isOpen]);

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
    if (!config.sections.hero.enabled || openRequested) return;
    setOpenRequested(true);
  };

  const events = config.sections.event.events
    .map((e, idx) => ({ key: String(idx), ...e }))
    .filter((e) => Boolean(e?.title));

  const backgroundReady = pageAssetsReady && isOpen && derivedPhotos.length > 0;

  return (
    <main
      className={` min-h-full overflow-hidden bg-wedding-bg text-wedding-text font-body ${neptuneBody.variable} ${neptuneSerif.variable} [--font-body:var(--font-neptune-body)]`}
    >
      {backgroundReady && derivedPhotos.length > 0 ? (
          <BackgroundSlideshow photos={derivedPhotos} />
        
      ) : null}

      <audio ref={audioRef} src={audioStreamUrl} loop preload="auto" />

      {config.sections.hero.enabled && (
        <motion.div
          className="fixed inset-0 z-50 h-screen"
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            y: isOpen ? -28 : 0,
            scale: isOpen ? 1.02 : 1,
            transitionEnd: {
              display: isOpen ? "none" : "block",
            },
          }}
          transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
          onAnimationComplete={() => {
            if (isOpen) setIsContentReady(true);
          }}
          
        >
          <HeroSection
            hosts={hosts}
            targetDate={dateInfo?.countdownTarget ?? ""}
            coverImage={config.sections.hero.coverImage}
            guestName={guestName}
            isOpening={openRequested}
            onOpen={openInvitation}
          />
        </motion.div>
      )}

      <div
        className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}
      >
        {isContentReady ? (
          <>
            <TitleCountdownSection
              id="home"
              backgroundPhotos={derivedPhotos}
              date={dateInfo?.display ?? ""}
              coupleLabel={coupleTitle}
              targetDate={dateInfo?.countdownTarget ?? ""}
            />

            {config.sections.quote.enabled ? (
              <QuoteSection
                text={config.sections.quote.text}
                author={config.sections.quote.author}
              />
            ) : null}

            {hostsSection.enabled ? (
              <HostsSection hosts={hosts} inviteLine={inviteLine} />
            ) : null}

            {config.sections.event.enabled && (
              <WeddingEventSection
                id="event"
                heading={"Wedding Event"}
                events={events}
              />
            )}

            {config.sections.story.enabled && (
              <StorySectionClassic
                id="story"
                heading={config.sections.story.heading || "Story"}
                coupleLabel={coupleTitle}
                photo={storyPhoto}
                stories={config.sections.story.stories}
              />
            )}

            {config.sections.gallery.enabled && (
              <GallerySectionClassic
                id="gallery"
                heading={config.sections.gallery.heading || "Gallery"}
              >
                <GalleryGrid
                  photos={config.sections.gallery.photos}
                  uiVariant="classic"
                />
              </GallerySectionClassic>
            )}

            {config.sections.gift.enabled && (
              <GiftSectionClassic
                id="gift"
                heading={config.sections.gift.heading || "Wedding Gift"}
              >
                <GiftBlock
                  bankAccounts={config.sections.gift.bankAccounts}
                  description={config.sections.gift.description}
                  templateName={config.templateId}
                  eventDate={dateInfo?.display ?? ""}
                  uiVariant="classic"
                />
              </GiftSectionClassic>
            )}

            {config.sections.wishes.enabled && (
              <WishesSectionClassic
                id="wishes"
                heading={config.sections.wishes.heading || "Friends Wishes"}
              >
                <WishesFirestore
                  invitationId={config.id}
                  inviteeName={inviteeName}
                  placeholder={config.sections.wishes.placeholder}
                  thankYouMessage={
                    config.sections.wishes.thankYouMessage ||
                    "Terima kasih atas konfirmasi dan ucapannya."
                  }
                  mode="both"
                  withAttendance={false}
                  submitLabel="Kirim Ucapan"
                  uiVariant="classic"
                />
              </WishesSectionClassic>
            )}

            {config.sections.gratitude.enabled ? (
              <ThankYouSection
                hosts={hosts}
                backgroundPhotos={derivedPhotos}
                message={config.sections.gratitude.message}
              />
            ) : null}

            <FooterMark hosts={hosts} />
          </>
        ) : null}
      </div>

      {isOpen && config.music.url && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed right-2 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] pointer-events-none">
              <div className="w-full max-w-[430px] flex justify-center">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="group pointer-events-auto flex items-center gap-2.5 rounded-full border border-wedding-on-dark/15 bg-wedding-dark/75 text-wedding-on-dark shadow-[0_10px_15px_-3px_color-mix(in_srgb,var(--invitation-dark)_35%,transparent),0_4px_6px_-4px_color-mix(in_srgb,var(--invitation-dark)_35%,transparent)] backdrop-blur px-3 py-2 transition hover:bg-wedding-dark/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-accent-2/60"
                  aria-label={`${isPlaying ? "Pause" : "Play"} music: ${musicTitle}`}
                >
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-wedding-on-dark/15 bg-wedding-on-dark/10 transition group-hover:bg-wedding-on-dark/15">
                    {isPlaying ? <IconPause /> : <IconPlay />}
                    {isPlaying ? (
                      <motion.span
                        className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-wedding-accent-2"
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          scale: [0.9, 1.15, 0.9],
                        }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ) : null}
                  </span>

                  <AnimatePresence initial={false}>
                    {isPlaying ? (
                      <motion.span
                        key="title"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="max-w-[52vw] text-[12.5px] leading-tight text-wedding-on-dark/90 truncate"
                        title={musicTitle}
                      >
                        {musicTitle}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </main>
  );
}

function GalleryGrid({
  photos,
  uiVariant,
}: {
  photos: string[];
  uiVariant?: "default" | "classic";
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const effectiveUiVariant = uiVariant ?? "default";
  const isClassic = effectiveUiVariant === "classic";

  const display = photos.slice(0, 12);
  const total = display.length;
  const selected = selectedIndex === null ? null : display[selectedIndex];

  const paginate = useCallback(
    (nextDirection: 1 | -1) => {
      if (!total) return;
      setDirection(nextDirection);
      setSelectedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + nextDirection + total) % total;
      });
    },
    [total],
  );

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [paginate, selectedIndex]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 140 : -140, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -140 : 140, opacity: 0 }),
  };

  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {display.map((p, idx) => (
          <NeptuneReveal
            key={`${p}-${idx}`}
            delay={0.35 + idx * 0.11}
            width="100%"
          >
            <button
              type="button"
              onClick={() => {
                setDirection(1);
                setSelectedIndex(idx);
              }}
              className={
                isClassic
                  ? "group relative w-full aspect-square overflow-hidden rounded-2xl border border-wedding-text/10 bg-wedding-bg/85"
                  : "group relative w-full aspect-square overflow-hidden rounded-2xl border border-wedding-on-dark/12 bg-wedding-on-dark/5"
              }
            >
              <Image
                src={p}
                alt="Gallery"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div
                className={
                  isClassic
                    ? "absolute inset-0 bg-wedding-text/10 opacity-0 group-hover:opacity-100 transition"
                    : "absolute inset-0 bg-wedding-dark/20 opacity-0 group-hover:opacity-100 transition"
                }
              />
            </button>
          </NeptuneReveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && selectedIndex !== null && total > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className={
              isClassic
                ? "fixed inset-0 z-[120] bg-wedding-dark/55 backdrop-blur-sm flex items-center justify-center p-6"
                : "fixed inset-0 z-[120] bg-wedding-dark/80 backdrop-blur-md flex items-center justify-center p-6"
            }
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={
                  isClassic
                    ? "absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-wedding-text/80"
                    : "absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-wedding-on-dark/85"
                }
              >
                <a
                  href={selected}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className={
                    isClassic
                      ? "text-xs tracking-[0.25em] uppercase font-body hover:text-wedding-text"
                      : "text-xs tracking-[0.25em] uppercase font-body hover:text-wedding-on-dark"
                  }
                >
                  Download
                </a>
                <span className="text-xs tracking-[0.25em] uppercase font-body">
                  {selectedIndex + 1} / {total}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className={
                    isClassic
                      ? "text-xs tracking-[0.25em] uppercase font-body hover:text-wedding-text"
                      : "text-xs tracking-[0.25em] uppercase font-body hover:text-wedding-on-dark"
                  }
                >
                  Close
                </button>
              </div>

              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    className={
                      isClassic
                        ? "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-wedding-bg/85 hover:bg-wedding-bg border border-wedding-text/10 backdrop-blur flex items-center justify-center text-wedding-text"
                        : "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-wedding-on-dark/10 hover:bg-wedding-on-dark/15 border border-wedding-on-dark/15 backdrop-blur flex items-center justify-center text-wedding-on-dark"
                    }
                    aria-label="Previous image"
                  >
                    <span className="text-2xl leading-none">‹</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    className={
                      isClassic
                        ? "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-wedding-bg/85 hover:bg-wedding-bg border border-wedding-text/10 backdrop-blur flex items-center justify-center text-wedding-text"
                        : "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-wedding-on-dark/10 hover:bg-wedding-on-dark/15 border border-wedding-on-dark/15 backdrop-blur flex items-center justify-center text-wedding-on-dark"
                    }
                    aria-label="Next image"
                  >
                    <span className="text-2xl leading-none">›</span>
                  </button>
                </>
              ) : null}

              <div
                className={
                  isClassic
                    ? "relative w-full h-[520px] rounded-2xl overflow-hidden bg-wedding-bg/95 border border-wedding-text/10"
                    : "relative w-full h-[520px] rounded-2xl overflow-hidden bg-wedding-dark/20 border border-wedding-on-dark/10"
                }
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={selected}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 320, damping: 32 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                    drag={total > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, info) => {
                      if (total <= 1) return;
                      const swipe = swipePower(info.offset.x, info.velocity.x);
                      if (swipe < -9000) paginate(1);
                      else if (swipe > 9000) paginate(-1);
                    }}
                  >
                    <Image
                      src={selected}
                      alt="Full"
                      fill
                      sizes="100vw"
                      className="object-contain"
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function GiftBlock({
  bankAccounts,
  description,
  templateName,
  eventDate,
  uiVariant,
}: {
  bankAccounts: InvitationConfig["sections"]["gift"]["bankAccounts"];
  description: string;
  templateName: string;
  eventDate: string;
  uiVariant?: "default" | "classic";
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const effectiveUiVariant = uiVariant ?? "default";
  const isClassic = effectiveUiVariant === "classic";

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const waText = `ACTIVID INVITATION-${templateName}-${eventDate}`;
  const waUrl = `https://wa.me/6285756681077?text=${encodeURIComponent(waText)}`;

  return (
    <div className="space-y-6">
      {description ? (
        <div
          className={
            isClassic
              ? "rounded-2xl border border-wedding-on-dark/12 bg-wedding-on-dark/6 backdrop-blur p-6"
              : "rounded-3xl border border-wedding-on-dark/12 bg-wedding-on-dark/8 backdrop-blur p-7"
          }
        >
          <p
            className={
              isClassic
                ? "text-sm text-wedding-on-dark/70 text-center whitespace-pre-line"
                : "text-sm text-wedding-on-dark/70 text-center whitespace-pre-line"
            }
          >
            {description}
          </p>
        </div>
      ) : null}

      <NeptuneReveal direction="up" width="100%">
        <button
          type="button"
          onClick={() => setIsGiftDialogOpen(true)}
          className="w-full inline-flex items-center justify-center rounded-full px-6 py-3 border border-wedding-on-dark/15 bg-linear-to-r from-wedding-accent-2/20 via-wedding-accent/20 to-wedding-accent-2-light/20 text-wedding-on-dark hover:bg-wedding-on-dark/10 transition"
        >
          <span className="text-xs uppercase tracking-[0.25em] font-body">
            Kirim Hadiah
          </span>
        </button>
      </NeptuneReveal>

      <div className="grid grid-cols-1 gap-4">
        {bankAccounts.map((b, idx) => {
          const k = `${b.bankName}-${idx}`;
          const isExpanded = !!expandedKeys[k];

          return (
            <NeptuneReveal
              key={k}
              direction="up"
              width="100%"
              delay={0.35 + idx * 0.45}
            >
              <div
                className={
                  isClassic
                    ? "rounded-2xl border border-wedding-on-dark/12 bg-wedding-on-dark/6 backdrop-blur p-6"
                    : "rounded-3xl border border-wedding-on-dark/12 bg-wedding-on-dark/8 backdrop-blur p-7"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body">
                      {b.bankName}
                    </p>
                    <p className="mt-3 text-sm font-body text-wedding-on-dark/90 truncate">
                      {b.accountHolder}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedKeys((prev) => ({ ...prev, [k]: !prev[k] }))
                    }
                    className="shrink-0 inline-flex items-center justify-center rounded-full h-9 w-9 border border-wedding-on-dark/15 bg-wedding-on-dark/6 hover:bg-wedding-on-dark/10 transition"
                    aria-expanded={isExpanded}
                    aria-label={
                      isExpanded ? "Tutup rekening" : "Lihat rekening"
                    }
                  >
                    <IconArrowRight
                      className={`h-4 w-4 text-wedding-on-dark transition-transform duration-200 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
                    />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded ? (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="mt-5 overflow-hidden"
                    >
                      <p className="text-2xl tracking-wide text-wedding-on-dark">
                        {b.accountNumber}
                      </p>

                      <button
                        type="button"
                        onClick={() => copy(b.accountNumber, k)}
                        className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 border border-wedding-on-dark/15 bg-wedding-on-dark/10 hover:bg-wedding-on-dark/15 transition w-full"
                      >
                        <span className="text-xs uppercase tracking-[0.25em] font-body text-wedding-on-dark">
                          {copied === k ? "Tersalin" : "Salin Rekening"}
                        </span>
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </NeptuneReveal>
          );
        })}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isGiftDialogOpen ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsGiftDialogOpen(false)}
                  className="fixed inset-0 z-[130] bg-wedding-dark/80 backdrop-blur-md flex items-center justify-center p-6"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Kirim hadiah"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg rounded-3xl border border-wedding-text/10 bg-wedding-bg p-7 shadow-2xl"
                  >
                    <p className="text-xs tracking-[0.35em] uppercase text-wedding-text-light font-body">
                      Info
                    </p>
                    <h4
                      className={`mt-3 ${neptuneScript.className} text-4xl leading-none text-wedding-text`}
                    >
                      Exclusive Discount
                    </h4>
                    <p className="mt-4 text-sm text-wedding-text">
                      Anda akan mendapatkan exclusive discount hingga{" "}
                      <span className="font-body text-wedding-text">25%</span>{" "}
                      untuk pemesanan hadiah dari link ini. &quot;Chat
                      WhatsApp&quot; untuk informasi lebih lanjut.
                    </p>

                    <div className="mt-7 grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsGiftDialogOpen(false)}
                        className="rounded-full px-6 py-3 border border-wedding-text/10 bg-wedding-bg/70 hover:bg-wedding-bg transition"
                      >
                        <span className="text-xs uppercase tracking-[0.25em] font-body">
                          Tutup
                        </span>
                      </button>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full px-6 py-3 bg-wedding-accent text-wedding-on-accent hover:bg-wedding-accent/90 transition text-center"
                      >
                        <span className="text-xs uppercase tracking-[0.25em] font-body">
                          Chat WhatsApp
                        </span>
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

export function RsvpFirestore({
  invitationId,
  inviteeName,
  rsvpDeadline,
  description,
  successMessage,
  alreadySubmittedMessage,
  seeYouMessage,
}: {
  invitationId: string;
  inviteeName: string | null;
  rsvpDeadline: string;
  description: string;
  successMessage: string;
  alreadySubmittedMessage: string;
  seeYouMessage: string;
}) {
  const [guests, setGuests] = useState("1");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "already_submitted"
  >("idle");

  useEffect(() => {
    const check = async () => {
      if (!inviteeName || !invitationId) return;
      try {
        const q = query(
          collection(db, "rsvps"),
          where("invitationId", "==", invitationId),
          where("name", "==", inviteeName),
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setStatus("already_submitted");
        }
      } catch (e) {
        console.error("Error checking RSVP:", e);
      }
    };

    void check();
  }, [invitationId, inviteeName]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteeName) return;

    setStatus("submitting");
    try {
      await addDoc(collection(db, "rsvps"), {
        invitationId,
        name: inviteeName,
        guests,
        createdAt: Timestamp.now(),
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const submitted = status === "success" || status === "already_submitted";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-wedding-on-dark/12 bg-wedding-dark/8 backdrop-blur p-7">
        {submitted ? (
          <div className="text-center">
            <p className="text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body">
              {inviteeName ?? "Tamu"}
            </p>
            <p className="mt-4 text-sm text-wedding-on-dark/90">
              {status === "already_submitted"
                ? alreadySubmittedMessage || "Konfirmasi anda sudah kami terima"
                : successMessage || "Terima kasih atas konfirmasi anda"}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] font-body text-wedding-on-dark/70">
              {seeYouMessage || "Sampai jumpa di acara kami"}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-center text-sm text-wedding-on-dark/70 whitespace-pre-line">
              {inviteeName
                ? description ||
                  `Silakan konfirmasi kehadiran sebelum ${rsvpDeadline}`
                : "Untuk mengisi konfirmasi, silakan akses dari link undangan personal."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="rounded-2xl border border-wedding-on-dark/12 bg-wedding-dark/6 px-4 py-3">
                <p className="text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body">
                  Nama
                </p>
                <p className="mt-2 text-sm font-body text-wedding-on-dark/90">
                  {inviteeName ?? "Tamu"}
                </p>
              </div>

              <div>
                <label className="block text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body mb-2">
                  Jumlah Tamu
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-2xl border border-wedding-on-dark/12 bg-wedding-dark/6 px-4 py-3 text-sm text-wedding-on-dark outline-none focus:ring-2 focus:ring-wedding-on-dark/15"
                  disabled={status === "submitting" || !inviteeName}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>

              {status === "error" ? (
                <p className="text-center text-xs text-red-300">
                  Terjadi kesalahan. Coba lagi ya.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting" || !inviteeName}
                className="w-full rounded-full px-6 py-3 bg-wedding-accent text-wedding-on-accent hover:bg-wedding-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xs uppercase tracking-[0.25em] font-body">
                  {status === "submitting" ? "Mengirim..." : "Konfirmasi"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

type AttendanceStatus = "hadir" | "tidak";

interface WishDoc {
  id: string;
  invitationId: string;
  name: string;
  nameKey?: string;
  attendance?: AttendanceStatus;
  message: string;
  createdAt?: Timestamp;
}

function normalizeNameKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function WishesFirestore({
  invitationId,
  inviteeName,
  placeholder,
  thankYouMessage,
  mode,
  withAttendance,
  submitLabel,
  uiVariant,
}: {
  invitationId: string;
  inviteeName: string | null;
  placeholder: string;
  thankYouMessage: string;
  mode?: "both" | "form" | "list";
  withAttendance?: boolean;
  submitLabel?: string;
  uiVariant?: "default" | "classic";
}) {
  const [attendance, setAttendance] = useState<AttendanceStatus>("hadir");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [error, setError] = useState("");
  const [existingWish, setExistingWish] = useState<WishDoc | null>(null);
  const [wishes, setWishes] = useState<WishDoc[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isDemo = useMemo(() => invitationId.endsWith("-demo"), [invitationId]);
  const effectiveInviteeName = inviteeName ?? (isDemo ? "Demo Guest" : null);

  const inviteeNameKey = useMemo(() => {
    if (!inviteeName) return null;
    return normalizeNameKey(inviteeName);
  }, [inviteeName]);

  const inviteeWishRef = useMemo(() => {
    if (!inviteeNameKey) return null;
    return doc(db, "wishes", `${invitationId}_${inviteeNameKey}`);
  }, [invitationId, inviteeNameKey]);

  const demoSeedWishes = useMemo(() => {
    if (!isDemo) return [] as WishDoc[];
    const now = Date.now();
    return [
      {
        id: `demo_${invitationId}_1`,
        invitationId,
        name: "Raka",
        message:
          "Selamat menempuh hidup baru. Semoga selalu diberi kebahagiaan dan keberkahan.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 18),
      },
      {
        id: `demo_${invitationId}_2`,
        invitationId,
        name: "Nadya",
        message:
          "Happy wedding! Semoga langgeng sampai tua dan saling menguatkan dalam setiap keadaan.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
      },
      {
        id: `demo_${invitationId}_3`,
        invitationId,
        name: "Dimas",
        message:
          "Semoga pernikahannya penuh cinta, rezeki lancar, dan rumah tangga sakinah mawaddah warahmah.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 9),
      },
      {
        id: `demo_${invitationId}_4`,
        invitationId,
        name: "Alya",
        message:
          "Congrats! Semoga jadi pasangan yang saling melengkapi dan selalu kompak.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 26),
      },
      {
        id: `demo_${invitationId}_5`,
        invitationId,
        name: "Bima",
        message:
          "Doa terbaik untuk kalian berdua. Semoga acaranya lancar dan pernikahannya bahagia selalu.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 54),
      },
    ];
  }, [invitationId, isDemo]);

  useEffect(() => {
    if (!isDemo) return;
    setError("");
    setHasPosted(false);
    setExistingWish(null);
    setWishes(demoSeedWishes);
  }, [demoSeedWishes, isDemo]);

  useEffect(() => {
    if (!invitationId || isDemo) return;

    const q = query(
      collection(db, "wishes"),
      where("invitationId", "==", invitationId),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<WishDoc, "id">),
      })) as WishDoc[];

      next.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

      setWishes(next);
    });

    return () => unsub();
  }, [invitationId, isDemo]);

  useEffect(() => {
    const checkExisting = async () => {
      if (isDemo) return;
      if (!inviteeName || !inviteeWishRef) return;

      const snap = await getDoc(inviteeWishRef);
      if (!snap.exists()) return;

      const wish = {
        id: snap.id,
        ...(snap.data() as Omit<WishDoc, "id">),
      } as WishDoc;
      setExistingWish(wish);
      setHasPosted(true);
    };

    void checkExisting();
  }, [inviteeName, inviteeWishRef, isDemo]);

  const submit = async () => {
    if (!message.trim()) return;

    if (isDemo) {
      setIsSubmitting(true);
      setError("");

      try {
        const next: WishDoc = {
          id: `demo_post_${nowId()}`,
          invitationId,
          name: effectiveInviteeName ?? "Demo Guest",
          message: message.trim(),
          createdAt: Timestamp.now(),
        };

        if (withAttendance ?? true) {
          next.attendance = attendance;
        }

        setWishes((prev) => [next, ...prev]);
        setMessage("");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!inviteeName || !inviteeNameKey || !inviteeWishRef) {
      setError(
        "Fitur ini hanya tersedia untuk tamu yang mengakses link undangan personal.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextData: Omit<WishDoc, "id"> = {
        invitationId,
        name: inviteeName,
        nameKey: inviteeNameKey,
        message: message.trim(),
        createdAt: Timestamp.now(),
      };

      if (withAttendance ?? true) {
        nextData.attendance = attendance;
      }

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(inviteeWishRef);
        if (snap.exists()) {
          throw new Error("already-posted");
        }
        tx.set(inviteeWishRef, nextData);
      });

      setMessage("");
      setHasPosted(true);
    } catch (err) {
      if (err instanceof Error && err.message === "already-posted") {
        const snap = await getDoc(inviteeWishRef);
        if (snap.exists()) {
          const wish = {
            id: snap.id,
            ...(snap.data() as Omit<WishDoc, "id">),
          } as WishDoc;
          setExistingWish(wish);
        }
        setHasPosted(true);
        setError(
          (withAttendance ?? true)
            ? "Kamu sudah mengirim konfirmasi & ucapan. Terima kasih!"
            : "Kamu sudah mengirim ucapan. Terima kasih!",
        );
      } else {
        console.error("Error adding wish:", err);
        setError("Terjadi kesalahan. Coba lagi ya.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveMode = mode ?? "both";
  const showForm = effectiveMode !== "list";
  const showList = effectiveMode !== "form";
  const showAttendance = withAttendance ?? true;
  const effectiveSubmitLabel = submitLabel ?? "Konfirmasi";
  const effectiveUiVariant = uiVariant ?? "default";
  const isClassic = effectiveUiVariant === "classic";

  const wishItemVariants = useMemo(() => {
    return {
      hidden: {
        opacity: 0,
        y: 18,
        scale: 0.985,
      },
      show: (idx: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.58,
          delay: Math.min(0.55, idx * 0.1),
          ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
        },
      }),
    };
  }, []);

  const visibleWishes = useMemo(() => {
    if (!showList) return [] as WishDoc[];
    return wishes.slice(0, visibleCount);
  }, [showList, wishes, visibleCount]);

  useEffect(() => {
    setVisibleCount(10);
  }, [invitationId]);

  useEffect(() => {
    if (!showList) return;
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= wishes.length) return prev;
          return Math.min(wishes.length, prev + 10);
        });
      },
      { root: null, rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [showList, wishes.length]);

  return (
    <div className="space-y-6">
      {showForm ? (
        <div
          className={
            isClassic
              ? "relative overflow-hidden rounded-3xl border border-wedding-on-dark/15 bg-wedding-dark/70 shadow-[0_18px_50px_color-mix(in_srgb,var(--invitation-dark)_18%,transparent)] p-7"
              : "rounded-3xl border border-wedding-on-dark/12 bg-wedding-dark/8 backdrop-blur p-7"
          }
        >
          {isClassic ? (
            <div className="pointer-events-none absolute -right-20 -top-16 opacity-25">
              <NeptuneOverlayFloat
                src={NEPTUNE_OVERLAY_ASSETS.flowerDouble}
                alt=""
                className="w-64"
                amplitude={3.8}
                duration={9.6}
                delay={0.15}
                rotate={1.1}
                breeze
                loading="lazy"
                draggable={false}
              />
            </div>
          ) : null}

          {!effectiveInviteeName ? (
            <div className="text-center">
              <p
                className={
                  isClassic
                    ? "text-sm text-wedding-on-dark/80"
                    : "text-sm text-wedding-on-dark/70"
                }
              >
                {showAttendance
                  ? "Untuk mengisi konfirmasi & ucapan, silakan akses dari link undangan personal."
                  : "Untuk mengisi ucapan, silakan akses dari link undangan personal."}
              </p>
            </div>
          ) : hasPosted && !isDemo ? (
            <div className="text-center">
              <p
                className={
                  isClassic
                    ? "text-xs tracking-[0.35em] uppercase text-wedding-on-dark/70 font-body"
                    : "text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body"
                }
              >
                {effectiveInviteeName}
              </p>
              {existingWish?.attendance ? (
                <p
                  className={
                    isClassic
                      ? "mt-3 text-xs uppercase tracking-[0.25em] font-body text-wedding-on-dark/90"
                      : "mt-3 text-xs uppercase tracking-[0.25em] font-body text-wedding-on-dark"
                  }
                >
                  {existingWish.attendance === "hadir"
                    ? "Hadir"
                    : "Tidak Hadir"}
                </p>
              ) : null}
              <p
                className={
                  isClassic
                    ? "mt-4 text-sm text-wedding-on-dark/90"
                    : "mt-4 text-sm text-wedding-on-dark/90"
                }
              >
                {thankYouMessage}
              </p>
              {existingWish?.message ? (
                <p
                  className={
                    isClassic
                      ? "mt-4 text-sm text-wedding-on-dark/85 whitespace-pre-line"
                      : "mt-4 text-sm text-wedding-on-dark/80 whitespace-pre-line"
                  }
                >
                  {existingWish.message}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center">
                <p
                  className={
                    isClassic
                      ? "text-xs tracking-[0.35em] uppercase text-wedding-on-dark/70 font-body"
                      : "text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body"
                  }
                >
                  Dari
                </p>
                <p
                  className={
                    isClassic
                      ? "mt-2 text-sm font-body text-wedding-on-dark/90"
                      : "mt-2 text-sm font-body text-wedding-on-dark/90"
                  }
                >
                  {effectiveInviteeName}
                </p>
              </div>

              {showAttendance ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttendance("hadir")}
                    className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "hadir" ? "bg-wedding-accent text-wedding-on-accent border-wedding-accent" : "bg-wedding-on-dark/10 text-wedding-on-dark border-wedding-on-dark/15 hover:bg-wedding-on-dark/15"}`}
                  >
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("tidak")}
                    className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "tidak" ? "bg-wedding-accent text-wedding-on-accent border-wedding-accent" : "bg-wedding-on-dark/10 text-wedding-on-dark border-wedding-on-dark/15 hover:bg-wedding-on-dark/15"}`}
                  >
                    Tidak
                  </button>
                </div>
              ) : null}

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder || "Tuliskan pesanmu"}
                className={
                  isClassic
                    ? "w-full min-h-28 rounded-2xl border border-wedding-on-dark/15 bg-wedding-dark/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-wedding-on-dark/20 text-wedding-on-dark placeholder:text-wedding-on-dark/45"
                    : "w-full min-h-28 rounded-2xl border border-wedding-on-dark/12 bg-wedding-dark/6 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-wedding-on-dark/15 text-wedding-on-dark placeholder:text-wedding-on-dark/40"
                }
                disabled={isSubmitting}
              />

              {error ? (
                <p
                  className={`text-center text-xs ${isClassic ? "text-red-200" : "text-red-600"}`}
                >
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting || !message.trim()}
                className={
                  isClassic
                    ? "rounded-full px-6 py-3 bg-wedding-on-dark text-wedding-dark hover:bg-wedding-on-dark/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    : "rounded-full px-6 py-3 bg-wedding-accent text-wedding-on-accent hover:bg-wedding-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                }
              >
                <span className="text-xs uppercase tracking-[0.25em] font-body">
                  {isSubmitting ? "Mengirim..." : effectiveSubmitLabel}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : null}

      {showList ? (
        <div
          className={
            isClassic
              ? "rounded-3xl border border-wedding-text/10 bg-wedding-dark/70 shadow-[0_18px_50px_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]"
              : "space-y-3"
          }
        >
          {wishes.length === 0 ? (
            <div
              className={
                isClassic
                  ? "px-6 py-7 text-center"
                  : "rounded-3xl border border-wedding-on-dark/12 bg-wedding-dark/6 backdrop-blur p-7 text-center"
              }
            >
              <p
                className={
                  isClassic
                    ? "text-sm text-wedding-text-light"
                    : "text-sm text-wedding-on-dark/70"
                }
              >
                Belum ada ucapan. Jadilah yang pertama.
              </p>
            </div>
          ) : isClassic ? (
            <div className="p-6 space-y-4">
              <AnimatePresence initial={true} mode="popLayout">
                {visibleWishes.map((w, idx) => (
                  <motion.div
                    key={w.id}
                    variants={wishItemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    custom={idx}
                    layout
                    className="relative rounded-[24px] bg-wedding-bg-alt text-wedding-text shadow-[0_18px_50px_color-mix(in_srgb,var(--invitation-dark)_12%,transparent)]"
                  >
                    <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_25%_20%,color-mix(in_srgb,var(--invitation-dark)_6%,transparent),transparent_60%),radial-gradient(circle_at_80%_70%,color-mix(in_srgb,var(--invitation-dark)_5%,transparent),transparent_55%)] opacity-50" />
                    <div className="relative rounded-[24px] border border-wedding-text/10 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-wedding-text">
                            {w.name}
                          </p>
                          <p className="mt-2 text-xs text-wedding-text-light">
                            {w.createdAt
                              ? formatRelativeToNow(w.createdAt) || "Baru saja"
                              : "Baru saja"}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-wedding-text whitespace-pre-line">
                        {w.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={loadMoreRef} className="h-px" />
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={true} mode="popLayout">
                {visibleWishes.map((w, idx) => (
                  <motion.div
                    key={w.id}
                    variants={wishItemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    custom={idx}
                    layout
                    className="rounded-3xl border border-wedding-on-dark/12 bg-wedding-dark/6 backdrop-blur p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body">
                          {w.name}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          {w.attendance ? (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-body border ${w.attendance === "tidak" ? "bg-wedding-on-dark/10 text-wedding-on-dark border-wedding-on-dark/15" : "bg-wedding-accent text-wedding-on-accent border-wedding-accent"}`}
                            >
                              {w.attendance === "tidak" ? "Tidak" : "Hadir"}
                            </span>
                          ) : null}
                          <span className="text-[10px] text-wedding-on-dark/50 uppercase tracking-[0.25em] font-body">
                            {w.createdAt
                              ? formatRelativeToNow(w.createdAt) || "Baru saja"
                              : "Baru saja"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-wedding-on-dark/85 whitespace-pre-line">
                      {w.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={loadMoreRef} className="h-px" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function nowId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
