"use client";

import {
 Children,
 type ComponentProps,
 type FormEvent,
 type ReactNode,
 useCallback,
 useEffect,
 useMemo,
 useRef,
 useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import {
 AuroraLayer,
 ClassicFlourishDivider,
 IconArrowRight,
 IconClock,
 NeptuneOverlayFloat,
 IconPause,
 IconPin,
 IconPlay,
 NEPTUNE_OVERLAY_ASSETS,
 NEPTUNE_OVERLAY_URLS,
 TitleDecoration10,
} from "./graphics";
import { InvitationConfig } from "@/types/invitation";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { SplitText } from "@/components/animations";
import { useWindowSize } from "@/hooks";
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
import { formatDistanceToNow } from "date-fns";

interface Neptune1Props {
 config: InvitationConfig;
}

const neptuneBody = Plus_Jakarta_Sans({
 subsets: ["latin"],
 variable: "--font-neptune-body",
 weight: ["200", "300", "400", "500", "600", "700"],
});

const neptuneScript = localFont({
 src: "../../../public/fonts/tan-mon-cheri.woff2",
 display: "swap",
});

const neptuneSerif = Cormorant_Garamond({
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
 variable: "--font-neptune-serif",
});

function NeptuneReveal(props: ComponentProps<typeof RevealOnScroll>) {
 const { delay, duration, distance, once, threshold, ...rest } = props;
 const { isMobile } = useWindowSize();

 const effectiveDistance = distance ?? (isMobile ? 34 : 52);
 const effectiveDuration = duration ?? (isMobile ? 1.05 : 1.65);

 return (
  <RevealOnScroll
  delay={delay ?? 0.18}
  duration={effectiveDuration}
  distance={effectiveDistance}
  margin="20% 0px 20% 0px"
  threshold={threshold ?? 0.12}
  once={once ?? false}
  {...rest}
  />
 );
}

function NeptuneStagger({
 children,
 className,
 baseDelay,
 staggerStep,
 once,
}: {
 children: ReactNode;
 className?: string;
 baseDelay?: number;
 staggerStep?: number;
 once?: boolean;
}) {
 const items = Children.toArray(children).filter(Boolean);
 const { isMobile } = useWindowSize();
 const d = baseDelay ?? 0;
 const step = staggerStep ?? 0.24;

 const containerY = isMobile ? 18 : 24;
 const itemY = isMobile ? 24 : 32;
 const containerDuration = isMobile ? 1.4 : 1.75;
 const itemDuration = isMobile ? 1.45 : 1.8;
 const allowBlur = !isMobile;

 const containerVariants = {
  hidden: { opacity: 0, y: containerY },
  show: {
  opacity: 1,
  y: 0,
  transition: {
  duration: containerDuration,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  when: "beforeChildren" as const,
  staggerChildren: step,
  delayChildren: d,
  },
  },
 };

 const itemVariants = allowBlur
  ? {
  hidden: { opacity: 0, y: itemY, scale: 0.97, filter: "blur(14px)" },
  show: {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: "blur(0px)",
  transition: {
  duration: itemDuration,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  },
  },
  }
  : {
  hidden: { opacity: 0, y: itemY, scale: 0.97 },
  show: {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: {
  duration: itemDuration,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  },
  },
  };

 return (
  <motion.div
  className={className}
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{
  once: once ?? false,
  amount: 0.08,
  margin: "20% 0px 20% 0px",
  }}
  >
  {items.map((child, idx) => (
  <motion.div key={idx} variants={itemVariants}>
  {child}
  </motion.div>
  ))}
  </motion.div>
 );
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

type NavSectionId =
 | "home"
 | "couple"
 | "event"
 | "story"
 | "gallery"
 | "rsvp"
 | "gift"
 | "wishes";

export function Neptune1({ config }: Neptune1Props) {
 const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
 const [contentReady, setContentReady] = useState(
  () => !config.sections.hero.enabled,
 );
 const [backgroundReady, setBackgroundReady] = useState(false);
 const [pageAssetsReady, setPageAssetsReady] = useState(false);
 const [openRequested, setOpenRequested] = useState(false);
 const coverTransitionMs = 780;
 const coverClosing =
  config.sections.hero.enabled && openRequested && pageAssetsReady && !isOpen;

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

 const persistentBackgroundPhotos = useMemo(() => {
  const hero = config.sections.hero.coverImage
  ? [config.sections.hero.coverImage]
  : [];
  const gallery = config.sections.gallery.photos;
  const backgrounds = config.backgroundPhotos;
  return Array.from(new Set([...hero, ...gallery, ...backgrounds])).filter(
  Boolean,
  );
 }, [
  config.backgroundPhotos,
  config.sections.gallery.photos,
  config.sections.hero.coverImage,
 ]);

 const quoteBackgroundImage = useMemo(() => {
  if (persistentBackgroundPhotos.length >= 2)
  return persistentBackgroundPhotos[1];
  return persistentBackgroundPhotos[0] || config.sections.hero.coverImage;
 }, [config.sections.hero.coverImage, persistentBackgroundPhotos]);

 const titleBackgroundPhotos = useMemo(() => {
  const gallery = config.sections.gallery.photos ?? [];
  const hero = config.sections.hero.coverImage
  ? [config.sections.hero.coverImage]
  : [];
  return Array.from(new Set([...gallery, ...hero])).filter(Boolean);
 }, [config.sections.gallery.photos, config.sections.hero.coverImage]);

 useEffect(() => {
  if (!config.sections.hero.enabled) return;
  if (typeof window === "undefined") return;

  const urls = Array.from(
  new Set(
  [
  config.sections.hero.coverImage,
  titleBackgroundPhotos[0],
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
  titleBackgroundPhotos,
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

 useEffect(() => {
  if (!contentReady) return;
  const t = window.setTimeout(() => setBackgroundReady(true), 320);
  return () => window.clearTimeout(t);
 }, [contentReady]);

 const inviteeName = useMemo(() => {
  if (typeof window === "undefined") return null;
  const sp = new URLSearchParams(window.location.search);
  return sp.get("to");
 }, []);

 const guestName = useMemo(() => {
  if (inviteeName) return inviteeName;
  if (typeof window === "undefined") return "Tamu";
  const sp = new URLSearchParams(window.location.search);
  return sp.get("guest") || "Tamu";
 }, [inviteeName]);

 useEffect(() => {
  if (!isOpen || !contentReady) return;
  if (!config.music.autoPlay) return;

  if (audioRef.current) {
  const playPromise = audioRef.current.play();
  if (playPromise !== undefined) {
  playPromise
  .then(() => setIsPlaying(true))
  .catch(() => setIsPlaying(false));
  }
  }
 }, [config.music.autoPlay, contentReady, isOpen]);

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

 const events = Object.entries(config.sections.event.events)
  .filter(([, e]) => Boolean(e?.title))
  .map(([key, e]) => ({
  key,
  title: e.title,
  date: e.date,
  time: e.time,
  venue: e.venue,
  address: e.address,
  mapUrl: e.mapUrl,
  }));

 const storyPhoto = useMemo(() => {
  const list = config.sections.gallery.photos ?? [];
  if (list.length === 0) return quoteBackgroundImage;
  let hash = 0;
  const seed = config.id || "neptune";
  for (let i = 0; i < seed.length; i += 1) {
  hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const idx = hash % list.length;
  return list[idx] ?? quoteBackgroundImage;
 }, [config.id, config.sections.gallery.photos, quoteBackgroundImage]);

 const coupleTitle = `${config.couple.bride.firstName} & ${config.couple.groom.firstName}`;

 const inviteLine =
  "Tanpa mengurangi rasa hormat dengan ini kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami";

 return (
  <main
  className={`relative min-h-screen overflow-x-hidden bg-[#020615] text-[#EAF7FF] font-body ${neptuneBody.variable} ${neptuneSerif.variable} [--font-body:var(--font-neptune-body)]`}
  >
  {backgroundReady && persistentBackgroundPhotos.length > 0 ? (
  <div className="fixed inset-0 z-0 pointer-events-none">
  <BackgroundSlideshow photos={persistentBackgroundPhotos} />
  <div className="absolute inset-0 bg-[#020615]/70" />
  <div className="absolute inset-0 bg-linear-to-b from-[#020615]/80 via-[#020615]/55 to-[#020615]/90" />
  <AuroraLayer />
  </div>
  ) : null}

  <audio
  ref={audioRef}
  src={audioStreamUrl}
  loop={config.music.loop}
  preload="auto"
  />

  {config.sections.hero.enabled && (
  <motion.div
  className="fixed inset-0 z-50"
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
  if (isOpen) setContentReady(true);
  }}
  >
  <CoverOverlay
  couple={config.couple}
  targetDate={config.weddingDate.countdownTarget}
  subtitle={config.sections.hero.subtitle}
  coverImage={config.sections.hero.coverImage}
  guestName={guestName}
  isOpening={coverClosing}
  onOpen={openInvitation}
  />
  </motion.div>
  )}

  {contentReady && pageAssetsReady ? (
  <div className="relative z-10">
  <TitleCountdownSection
  id="home"
  coverImage={config.sections.hero.coverImage}
  backgroundPhotos={titleBackgroundPhotos}
  date={config.weddingDate.display}
  coupleLabel={coupleTitle}
  targetDate={config.weddingDate.countdownTarget}
  />

  {config.sections.quote.enabled ? (
  <QuoteSection
  text={config.sections.quote.text}
  author={config.sections.quote.author}
  />
  ) : null}

  {config.sections.couple.enabled ? (
  <CoupleProfileSection
  couple={config.couple}
  inviteLine={inviteLine}
  nextSectionId={
  config.sections.event.enabled
  ? "event"
  : config.sections.story.enabled
  ? "story"
  : "gallery"
  }
  />
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
  templateName={config.templateId ?? "neptune-1"}
  eventDate={config.weddingDate.display}
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

  <ThankYouSection
  couple={config.couple}
  backgroundPhotos={config.sections.gallery.photos}
  fallbackImage={
  persistentBackgroundPhotos[0] || config.sections.hero.coverImage
  }
  />

  <FooterMark couple={config.couple} />
  </div>
  ) : null}

  {isOpen && config.music.url && typeof document !== "undefined"
  ? createPortal(
  <div className="fixed right-2 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] pointer-events-none">
  <div className="w-full max-w-[430px] flex justify-center">
  <button
  type="button"
  onClick={togglePlay}
  className="group pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0B1028]/75 text-white shadow-lg shadow-black/35 backdrop-blur px-3 py-2 transition hover:bg-[#0B1028]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
  aria-label={`${isPlaying ? "Pause" : "Play"} music: ${musicTitle}`}
  >
  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition group-hover:bg-white/15">
  {isPlaying ? <IconPause /> : <IconPlay />}
  {isPlaying ? (
  <motion.span
  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-300"
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
  className="max-w-[52vw] text-[12.5px] leading-tight text-white/90 truncate"
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

function CoverOverlay({
 couple,
 targetDate,
 subtitle,
 coverImage,
 guestName,
 isOpening,
 onOpen,
}: {
 couple: InvitationConfig["couple"];
 targetDate: string;
 subtitle: string;
 coverImage: string;
 guestName: string;
 isOpening: boolean;
 onOpen: () => void;
}) {
 const heroDate = useMemo(() => {
  const raw = `${targetDate ?? ""}`.trim();
  if (!raw) return raw;

  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
  const yyyy = m[1] ?? "";
  const mm = m[2] ?? "";
  const dd = m[3] ?? "";
  return `${dd} . ${mm} . ${yyyy}`;
  }

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) {
  const dd = `${d.getDate()}`.padStart(2, "0");
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const yyyy = `${d.getFullYear()}`;
  return `${dd} . ${mm} . ${yyyy}`;
  }

  return raw;
 }, [targetDate]);

 const containerVariants = {
  hidden: { opacity: 0, y: 34 },
  show: {
  opacity: 1,
  y: 0,
  transition: {
  duration: 1.75,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  when: "beforeChildren" as const,
  staggerChildren: 0.24,
  delayChildren: 0.18,
  },
  },
  open: {
  opacity: 0,
  y: -22,
  scale: 0.985,
  transition: {
  duration: 0.52,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  when: "afterChildren" as const,
  staggerChildren: 0.08,
  staggerDirection: -1 as const,
  },
  },
 };

 const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: {
  duration: 1.3,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  },
  },
  open: {
  opacity: 0,
  y: -26,
  scale: 0.95,
  transition: {
  duration: 0.42,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  },
 };

 const imageVariants = {
  hidden: { opacity: 0, y: 28, scale: 1.08 },
  show: {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: {
  duration: 1.55,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  },
  },
  open: {
  opacity: 0,
  y: -22,
  scale: 1.03,
  transition: {
  duration: 0.46,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  },
 };

 return (
  <div className="relative h-screen w-full overflow-hidden bg-[#4E5C6C] text-[#2E343A]">
  <motion.div
  className="absolute inset-0"
  style={{
  backgroundImage:
  "linear-gradient(120deg, #8FA2BA, #5B6A7C, #3E4A58, #6D7C8F)",
  backgroundSize: "320% 320%",
  }}
  animate={{ backgroundPosition: ["0% 45%", "100% 55%", "0% 45%"] }}
  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute inset-0 opacity-40"
  style={{
  backgroundImage:
  "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
  backgroundSize: "240% 100%",
  mixBlendMode: "overlay",
  }}
  animate={{ backgroundPosition: ["-120% 0%", "160% 0%"] }}
  transition={{
  duration: 6.2,
  repeat: Infinity,
  ease: "easeInOut",
  repeatDelay: 2.4,
  }}
  />
  <div className="absolute inset-0 bg-linear-to-b from-[#59677A]/55 via-[#4E5C6C]/60 to-[#3E4A58]/78" />

  <div className="relative z-10 h-full px-5 flex items-center justify-center">
  <motion.div
  variants={containerVariants}
  initial="hidden"
  animate={isOpening ? "open" : "show"}
  className="w-full max-w-[420px]"
  >
  <div className="relative overflow-visible rounded-[44px] border border-white/35 bg-[#E7E4DC] shadow-[0_40px_90px_rgba(0,0,0,0.50)] p-[6px]">
  <div className="rounded-[38px] overflow-hidden border border-black/15 bg-[#E7E4DC]">
  <motion.div variants={imageVariants} className="px-4 pt-4">
  <div className="relative w-full aspect-[4/3] rounded-t-[999px] rounded-b-none border border-black/15 bg-black">
  <div className="absolute inset-[7px] rounded-t-[999px] rounded-b-none overflow-hidden border border-white/35">
  <Image
  src={coverImage}
  alt="Cover"
  fill
  sizes="(max-width: 768px) 90vw, 420px"
  className="object-cover object-[center_30%]"
  unoptimized
  priority
  />
  <div className="absolute inset-0 bg-black/40" />
  </div>

  <motion.div
  variants={itemVariants}
  className="pointer-events-none absolute inset-x-0 -bottom-4"
  >
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.ribbonBottom}
  alt=""
  className="w-full px-8"
  amplitude={4.8}
  duration={8.8}
  delay={0.15}
  loading="eager"
  draggable={false}
  />
  </motion.div>
  </div>
  </motion.div>

  <div className=" pt-14 pb-9 text-center">
  <motion.h1
  variants={itemVariants}
  className={`${neptuneScript.className} mt-4 text-4xl leading-none text-[#546058]`}
  >
  <SplitText
  text={`${couple.bride.firstName} & ${couple.groom.firstName}`}
  splitBy="character"
  once
  staggerDelay={0.055}
  />
  </motion.h1>

  <motion.p
  variants={itemVariants}
  className="mt-6 text-sm tracking-[0.35em] uppercase text-[#4A5257]"
  >
  {heroDate}
  </motion.p>

  <motion.p
  variants={itemVariants}
  className="mt-12 text-sm leading-relaxed text-[#4A5257]"
  >
  Kepada Yth. Bapak/Ibu/Saudara/i
  <br />
  </motion.p>
  <motion.p
  variants={itemVariants}
  className="mt-2 text-3xl leading-none tracking-wide text-[#2E343A] font-body"
  >
  {guestName}
  </motion.p>
  <motion.div variants={itemVariants} className="mt-9">
  <motion.button
  type="button"
  onClick={onOpen}
  disabled={isOpening}
  initial={false}
  animate={
  isOpening
  ? { scale: 0.96, opacity: 0, y: -8 }
  : { scale: [1, 1.025, 1], opacity: 1, y: 0 }
  }
  transition={
  isOpening
  ? {
  duration: 0.42,
  ease: [0.4, 0, 0.2, 1],
  }
  : {
  duration: 2.8,
  repeat: Infinity,
  repeatDelay: 2.6,
  ease: "easeInOut",
  }
  }
  className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg bg-[#5E6A78] text-white px-6 py-3 shadow-md transition hover:bg-[#556170] disabled:pointer-events-none"
  >
  <motion.span
  aria-hidden="true"
  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent"
  initial={{ x: "-120%", opacity: 0 }}
  animate={
  isOpening
  ? { x: "-120%", opacity: 0 }
  : { x: ["-120%", "160%"], opacity: [0, 1, 0] }
  }
  transition={
  isOpening
  ? { duration: 0.2, ease: "easeOut" }
  : {
  duration: 1.15,
  repeat: Infinity,
  repeatDelay: 4.2,
  ease: "easeInOut",
  }
  }
  />
  <span className="relative z-10 text-sm font-body tracking-wide">
  Buka Undangan
  </span>
  </motion.button>
  </motion.div>
  </div>
  </div>

  <motion.div
  variants={itemVariants}
  className="pointer-events-none absolute inset-x-0 -bottom-6 -left-18 w-full px-12"
  >
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.ribbonBottomWide}
  alt=""
  className="w-full"
  amplitude={5.2}
  duration={9.4}
  delay={0.35}
  loading="eager"
  draggable={false}
  />
  </motion.div>
  </div>
  </motion.div>
  </div>
  </div>
 );
}

function TitleCountdownSection({
 id,
 coverImage,
 backgroundPhotos,
 date,
 coupleLabel,
 targetDate,
}: {
 id: NavSectionId;
 coverImage: string;
 backgroundPhotos?: string[];
 date: string;
 coupleLabel: string;
 targetDate: string;
}) {
 const { isMobile } = useWindowSize();

 const photos = useMemo(() => {
  const list = backgroundPhotos ?? [];
  const safe = list.filter(Boolean);
  if (safe.length > 0) return safe;
  return coverImage ? [coverImage] : [];
 }, [backgroundPhotos, coverImage]);

 const [activeIndex, setActiveIndex] = useState(0);

 useEffect(() => {
  if (photos.length <= 1) return;
  const t = window.setInterval(() => {
  setActiveIndex((prev) => (prev + 1) % photos.length);
  }, 7200);
  return () => window.clearInterval(t);
 }, [photos.length]);

 const safeActiveIndex = photos.length > 0 ? activeIndex % photos.length : 0;
 const activePhoto = photos[safeActiveIndex] ?? coverImage;

 return (
  <section
  id={id}
  className="relative isolate scroll-mt-24 min-h-screen overflow-hidden text-[#2E343A]"
  >
  <div className="absolute inset-0 z-0">
  <div className="absolute inset-0 overflow-hidden">
  <AnimatePresence initial={false}>
  {activePhoto ? (
  <motion.div
  key={`${safeActiveIndex}-${activePhoto}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{
  duration: 1.2,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  }}
  className="absolute inset-0"
  >
  <motion.div
  initial={{ scale: 1.06 }}
  animate={{ scale: 1.14 }}
  transition={{ duration: 12, ease: "easeOut" }}
  className="absolute inset-0"
  >
  <Image
  src={activePhoto}
  alt="Background"
  fill
  sizes="100vw"
  className="object-cover opacity-[0.36]"
  unoptimized
  />
  </motion.div>
  </motion.div>
  ) : null}
  </AnimatePresence>
  </div>

  <div className="absolute inset-x-0 bottom-0 h-[72%] bg-linear-to-t from-[#F3F1EC] via-[#F3F1EC]/82 to-transparent" />
  {/* <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,0.08),transparent_68%)]" /> */}
  </div>

  <motion.div
  className="absolute inset-x-0 -bottom-38 z-20 pointer-events-none flex justify-center"
  initial={false}
  animate={{
  x: [0, isMobile ? 8 : 12, isMobile ? -5 : -8, isMobile ? 5 : 8, 0],
  y: [0, isMobile ? -6 : -10, isMobile ? 4 : 6, isMobile ? -4 : -6, 0],
  rotate: [
  0,
  isMobile ? -1.1 : -1.6,
  isMobile ? 0.8 : 1.1,
  isMobile ? -0.8 : -1.1,
  0,
  ],
  }}
  transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
  >
  <TitleDecoration10 className="w-full" />
  </motion.div>

  <div className="relative z-30 min-h-screen flex flex-col items-center justify-end text-center px-6 pb-32 pt-18">
  <NeptuneStagger className="relative w-full max-w-sm" baseDelay={0.15}>
  <div className="pointer-events-none absolute inset-0 z-0">
  <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[240px] h-[360px] rounded-t-[999px] border border-black/15 opacity-25" />
  <div className="absolute -left-4 bottom-10">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
  alt=""
  className="w-[140px] max-w-[55vw] opacity-95"
  amplitude={4.6}
  duration={8.6}
  rotate={1}
  breeze
  loading="eager"
  draggable={false}
  />
  </div>
  <div className="absolute -right-10 bottom-15">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.leafRight}
  alt=""
  className="w-[140px] max-w-[55vw] opacity-95"
  amplitude={5.4}
  duration={9.2}
  delay={0.15}
  rotate={-1}
  breeze
  loading="eager"
  draggable={false}
  />
  </div>
  </div>

  <p
  className={`${neptuneSerif.className} relative z-10 text-sm tracking-[0.28em] uppercase text-[#667078]`}
  >
  The Wedding Of
  </p>
  <h2
  className={`${neptuneSerif.className} relative z-10 mt-4 text-5xl leading-none text-[#586057]`}
  >
  <SplitText text={coupleLabel} splitBy="word" staggerDelay={0.09} />
  </h2>
  <p className="relative z-10 mt-4 text-lg tracking-wide text-[#5C666F] font-body">
  {date}
  </p>
  <p className="relative z-10 mt-10 text-xs tracking-[0.45em] uppercase text-[#7A838B] font-body">
  SAVE THE DATE
  </p>
  <div className="relative z-10 mt-6">
  <CountdownRow targetDate={targetDate} />
  </div>
  </NeptuneStagger>
  </div>
  </section>
 );
}

function GallerySectionClassic({
 id,
 heading,
 children,
}: {
 id: NavSectionId;
 heading: string;
 children: ReactNode;
}) {
 return (
  <section
  id={id}
  className="relative scroll-mt-24 overflow-hidden bg-[#F3F1EC] text-[#2E343A] px-6 py-16"
  >
  <div className="absolute inset-0 pointer-events-none">
  {/* <FloralCorner className="left-0 bottom-0 w-56 opacity-30" flipX /> */}
  {/* <FloralCorner className="right-0 top-0 w-52 opacity-25" /> */}
  </div>

  <div className="relative z-10 max-w-5xl mx-auto">
  <div className="rounded-[34px] border border-black/10 bg-white/70 shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
  <div className="p-10">
  <NeptuneStagger baseDelay={0.1}>
  <h3
  className={`${neptuneSerif.className} text-4xl text-[#6B7480] text-center`}
  >
  <SplitText text={heading} splitBy="word" staggerDelay={0.09} />
  </h3>
  <div className="mt-8">{children}</div>
  </NeptuneStagger>
  </div>
  </div>
  </div>
  </section>
 );
}

function QuoteSection({
 text,
 author,
}: {
 text: string;
 author?: string;
}) {
 const trimmedAuthor = author?.trim() ?? "";
 const hasInlineCitation =
  trimmedAuthor.length === 0 && text.lastIndexOf("(") > 0 && text.endsWith(")");
 const lastParen = hasInlineCitation ? text.lastIndexOf("(") : -1;
 const main = lastParen > 0 ? text.slice(0, lastParen).trim() : text.trim();
 const inlineCitation =
  lastParen > 0 ? text.slice(lastParen + 1, -1).trim() : "";
 const quoteAuthor = trimmedAuthor || inlineCitation;

 return (
  <section className="relative overflow-hidden bg-[#5F737B] text-white px-6 py-4">
  <div className="relative z-10 py-10 flex items-center justify-center">
  <NeptuneStagger
  className="max-w-3xl text-center"
  baseDelay={0.08}
  staggerStep={0.24}
  >
  <div className="flex justify-center">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.leafRight}
  alt=""
  className="w-[70px] max-w-[70vw] opacity-95"
  amplitude={4.4}
  duration={8.2}
  rotate={1}
  breeze
  loading="lazy"
  draggable={false}
  />
  </div>
  <p className="mt-10 text-xl leading-relaxed text-white/95 whitespace-pre-line">
  {main}
  </p>
  {quoteAuthor ? (
  <p className="mt-10 text-2xl text-white/90">- {quoteAuthor}</p>
  ) : null}
  </NeptuneStagger>
  </div>
  </section>
 );
}

function CountdownRow({ targetDate }: { targetDate: string }) {
 const compute = (raw: string) => {
  const target = new Date(raw);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (!Number.isFinite(diff) || diff <= 0) {
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
  days: Math.floor(diff / (1000 * 60 * 60 * 24)),
  hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((diff / 1000 / 60) % 60),
  seconds: Math.floor((diff / 1000) % 60),
  };
 };

 const [timeLeft, setTimeLeft] = useState(() => compute(targetDate));

 useEffect(() => {
  const timer = setInterval(() => setTimeLeft(compute(targetDate)), 1000);
  return () => clearInterval(timer);
 }, [targetDate]);

 const pad2 = (n: number) => String(n).padStart(2, "0");
 const cells = [
  { label: "Hari", value: pad2(timeLeft.days) },
  { label: "Jam", value: pad2(timeLeft.hours) },
  { label: "Menit", value: pad2(timeLeft.minutes) },
  { label: "Detik", value: pad2(timeLeft.seconds) },
 ];

 return (
  <NeptuneStagger
  className="grid grid-cols-4 gap-3"
  baseDelay={0.08}
  staggerStep={0.26}
  >
  {cells.map((c) => (
  <div key={c.label}>
  <div className="rounded-2xl border border-white/20 bg-[#5E727B] px-2 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
  <div
  className={`${neptuneSerif.className} text-3xl leading-none text-white`}
  >
  {c.value}
  </div>
  <div className="mt-2 text-[12px] leading-none text-white/85 font-body">
  {c.label}
  </div>
  </div>
  </div>
  ))}
  </NeptuneStagger>
 );
}

function CoupleProfileSection({
 couple,
 inviteLine,
 nextSectionId,
}: {
 couple: InvitationConfig["couple"];
 inviteLine: string;
 nextSectionId: NavSectionId;
}) {
 const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
 };

 return (
  <section id="couple" className="relative scroll-mt-24">
  <CoupleProfileCard
  id="couple-groom"
  intro={inviteLine}
  nameScript={couple.groom.firstName}
  nameFull={couple.groom.fullName}
  city={couple.groom.role}
  parents={couple.groom.parents}
  photo={couple.groom.photo}
  isBride={false}
  showAnd={false}
  onNext={() => scrollToId("couple-bride")}
  />
  <CoupleProfileCard
  id="couple-bride"
  intro={null}
  nameScript={couple.bride.firstName}
  nameFull={couple.bride.fullName}
  city={couple.bride.role}
  parents={couple.bride.parents}
  photo={couple.bride.photo}
  isBride={true}
  showAnd
  onNext={() => scrollToId(nextSectionId)}
  />
  </section>
 );
}

function CoupleProfileCard({
 id,
 intro,
 nameScript,
 nameFull,
 city,
 parents,
 photo,
 isBride,
 showAnd,
 onNext,
}: {
 id: string;
 intro: string | null;
 nameScript: string;
 nameFull: string;
 city: string;
 parents: string;
 photo: string;
 isBride: boolean;
 showAnd: boolean;
 onNext: () => void;
}) {
 return (
  <section
  id={id}
  className="relative min-h-screen overflow-hidden bg-[#F3F1EC] text-[#2E343A] px-6 pt-16"
  >
  <NeptuneStagger
  className="relative z-10 max-w-md mx-auto text-center"
  baseDelay={0.12}
  >
  {showAnd ? (
  <div className="flex items-center justify-center gap-4 text-xs tracking-[0.35em] uppercase text-[#6B747C]">
  <div className="h-px w-16 bg-[#9AA3AB]" />
  <span
  className={`${neptuneSerif.className} text-sm tracking-[0.32em]`}
  >
  AND
  </span>
  <div className="h-px w-16 bg-[#9AA3AB]" />
  </div>
  ) : null}

  {intro ? (
  <div className="mt-4 flex justify-center">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flourishes}
  alt=""
  className="w-[240px] max-w-[72vw]"
  amplitude={4.6}
  duration={8.1}
  loading="lazy"
  draggable={false}
  />
  </div>
  ) : null}
  {intro ? (
  <p className="mt-6 text-lg leading-relaxed text-[#6A737B]">{intro}</p>
  ) : null}

  <div className={intro ? "mt-10" : "mt-14"}>
  <ArchedPortrait
  photo={photo}
  alt={nameScript}
  flowerSide={isBride ? "left" : "right"}
  />
  </div>

  <p
  className={`${neptuneScript.className} mt-10 text-5xl leading-none text-[#8D8A7E]`}
  >
  <SplitText
  text={nameScript}
  splitBy="character"
  staggerDelay={0.045}
  />
  </p>
  <p
  className={`${neptuneSerif.className} mt-5 text-4xl leading-none text-[#586057]`}
  >
  {nameFull}
  </p>
  <p className="mt-6 text-xl font-bold text-[#5B646D] font-body">
  {city}
  </p>
  <p className="mt-4 text-lg leading-relaxed text-[#6B747C]">{parents}</p>

  <div className="pt-10 -mx-6 pointer-events-none">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flowerDivider}
  alt=""
  className="w-full"
  amplitude={4.8}
  duration={8.6}
  delay={0.2}
  loading="lazy"
  draggable={false}
  />
  </div>
  </NeptuneStagger>
  </section>
 );
}

function ArchedPortrait({
 photo,
 alt,
 flowerSide,
}: {
 photo: string;
 alt: string;
 flowerSide: "left" | "right";
}) {
 return (
  <div className="flex justify-center">
  <div className="relative w-[260px] ">
  <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
  {flowerSide === "left" ? (
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flower}
  alt=""
  className="absolute top-1/2 -translate-y-1/2 -left-40 w-40 opacity-80 scale-x-[-1]"
  amplitude={5.8}
  duration={8.8}
  rotate={1.6}
  breeze
  loading="lazy"
  draggable={false}
  />
  ) : null}
  {flowerSide === "right" ? (
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flower}
  alt=""
  className="absolute top-1/2 -translate-y-1/2 -right-40 w-40 opacity-80 scale-x-[-1]"
  amplitude={5.8}
  duration={8.8}
  delay={0.25}
  rotate={-1.6}
  breeze
  loading="lazy"
  draggable={false}
  />
  ) : null}
  </div>

  <div className="relative z-10 rounded-t-[999px] rounded-b-none border border-[#8496AC] bg-[#F6F4EF] p-[7px] shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
  <div className="relative aspect-[4/4.3] rounded-t-[999px] rounded-b-none overflow-hidden border border-[#8496AC] bg-white">
  <Image
  src={photo}
  alt={alt}
  fill
  sizes="320px"
  className="object-cover"
  unoptimized
  />
  </div>
  </div>
  </div>
  </div>
 );
}

function WeddingEventSection({
 id,
 heading,
 events,
}: {
 id: NavSectionId;
 heading: string;
 events: Array<{
  key: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
 }>;
}) {
 const words = heading.trim().split(/\s+/);
 const topWord = words[0] ?? "Wedding";
 const scriptWord = words.slice(1).join(" ") || "Event";

 return (
  <section
  id={id}
  className="relative scroll-mt-24 overflow-hidden bg-[#4E5C6C] text-white px-6 pt-18 pb-20"
  >
  <div className="absolute inset-0 bg-linear-to-b from-[#59677A] via-[#4E5C6C] to-[#3E4A58]" />
  <div className="absolute inset-0 pointer-events-none">
  <NeptuneReveal
  direction="up"
  delay={0.12}
  className="absolute -left-10 top-16 "
  >
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
  alt=""
  className="w-[150px]  opacity-45"
  amplitude={5.2}
  duration={8.8}
  rotate={1.2}
  breeze
  loading="lazy"
  draggable={false}
  />
  </NeptuneReveal>

  <NeptuneReveal
  direction="up"
  delay={0.22}
  className="absolute -right-10 bottom-10 "
  >
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.leafRight}
  alt=""
  className="w-[160px]  opacity-42"
  amplitude={5.4}
  duration={9.2}
  delay={0.16}
  rotate={-1.2}
  breeze
  loading="lazy"
  draggable={false}
  />
  </NeptuneReveal>
  </div>

  <div className="relative z-10 max-w-xl mx-auto">
  <NeptuneReveal direction="up" width="100%" delay={0.18}>
  <div className="flex items-start gap-4">
  <div className="leading-none">
  <div
  className={`${neptuneSerif.className} text-6xl text-white/95`}
  >
  <SplitText text={topWord} splitBy="word" staggerDelay={0.1} />
  </div>
  <div
  className={`${neptuneScript.className} mt-2 text-5xl text-white/90`}
  >
  <SplitText
  text={scriptWord}
  splitBy="word"
  staggerDelay={0.12}
  />
  </div>
  </div>
  <div className="mt-6 h-px flex-1 bg-white/55" />
  </div>
  </NeptuneReveal>

  <div className="mt-10 space-y-10">
  {events.map((e, idx) => (
  <NeptuneReveal
  key={e.key}
  width="100%"
  direction="up"
  delay={0.35 + idx * 0.25}
  >
  <EventCardClassic
  title={e.title}
  date={e.date}
  time={e.time}
  venue={e.venue}
  address={e.address}
  mapUrl={e.mapUrl}
  />
  </NeptuneReveal>
  ))}
  </div>
  </div>
  </section>
 );
}

function EventCardClassic({
 title,
 date,
 time,
 venue,
 address,
 mapUrl,
}: {
 title: string;
 date: string;
 time: string;
 venue: string;
 address: string;
 mapUrl: string;
}) {
 const isLinkOnly = Boolean(mapUrl) && !address && !time && !date;

 return (
  <div className="relative rounded-[28px] bg-white text-[#2E343A] shadow-[0_26px_70px_rgba(0,0,0,0.35)]">
  <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.06),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.05),transparent_55%)] opacity-50" />
  <div className="relative rounded-[28px] border border-black/10 px-8 py-12">
  <h4
  className={`${neptuneSerif.className} text-6xl leading-none text-[#6B756B] text-center`}
  >
  <SplitText text={title} splitBy="word" staggerDelay={0.1} />
  </h4>
  <div className="mt-7 flex justify-center">
  <ClassicFlourishDivider />
  </div>

  {!isLinkOnly ? (
  <div className="mt-7 text-center">
  {date ? (
  <p className="text-md leading-none tracking-[0.14em] uppercase text-[#3A3F45] font-body">
  {date}
  </p>
  ) : null}

  <div className="mt-7 flex items-center justify-center gap-3 text-[#6B747C]">
  {time ? (
  <>
  <IconClock />
  <p className="text-[22px] tracking-[0.22em] uppercase font-body">
  {time}
  </p>
  </>
  ) : null}
  </div>

  {venue ? (
  <p className="mt-6 text-md font-semibold text-[#5A6168] font-body">
  {venue}
  </p>
  ) : null}
  {address ? (
  <p className="mt-2 text-xl leading-tight text-[#5A6168] font-body whitespace-pre-line">
  {address}
  </p>
  ) : null}
  </div>
  ) : null}

  {mapUrl ? (
  <div className="mt-10 flex justify-center">
  <a
  href={mapUrl}
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center justify-center gap-2 rounded-none border border-black/30 bg-transparent px-10 py-4 text-[#4B545C] hover:bg-black/5 transition"
  >
  <IconPin />
  <span className="text-md font-semibold font-body">
  {title.toLowerCase().includes("live") ||
  title.toLowerCase().includes("stream")
  ? "Open Link"
  : "Link Map"}
  </span>
  </a>
  </div>
  ) : null}
  </div>
  </div>
 );
}

function StorySectionClassic({
 id,
 heading,
 coupleLabel,
 photo,
 stories,
}: {
 id: NavSectionId;
 heading: string;
 coupleLabel: string;
 photo: string;
 stories: InvitationConfig["sections"]["story"]["stories"];
}) {
 return (
  <section
  id={id}
  className="relative scroll-mt-24 overflow-hidden bg-[#F3F1EC] text-[#2E343A] px-6 py-16"
  >
  <div className="absolute inset-0 pointer-events-none"></div>

  <div className="relative z-10 max-w-md mx-auto">
  <div className="rounded-[34px] border border-black/10 bg-white/70 shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
  <div className="p-[10px]">
  <div className="rounded-[28px] border border-black/10 bg-white/70 overflow-hidden">
  <div className="relative px-8 pb-10 text-center">
  <NeptuneReveal
  direction="up"
  width="100%"
  delay={0.1}
  className="absolute -top-2 left-0 right-0 flex justify-center pointer-events-none"
  >
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flowerDivider}
  alt=""
  className="w-full -translate-y-24"
  amplitude={4.6}
  duration={8.4}
  loading="lazy"
  draggable={false}
  />
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={0.15}>
  <p
  className={`${neptuneSerif.className} pt-20 text-4xl text-[#667078]`}
  >
  <SplitText
  text={coupleLabel}
  splitBy="word"
  staggerDelay={0.09}
  />
  </p>
  </NeptuneReveal>
  <NeptuneReveal direction="up" width="100%" delay={0.35}>
  <p
  className={`${neptuneScript.className} pt-2 text-5xl text-[#5E6A78]`}
  >
  <SplitText
  text={heading}
  splitBy="word"
  staggerDelay={0.12}
  />
  </p>
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={0.55}>
  <div className="mt-8">
  <div className="relative rounded-t-[999px] border border-[#6E7B6E] bg-[#F6F4EF] p-[7px] shadow-[0_14px_40px_rgba(0,0,0,0.12)]">
  <NeptuneOverlayFloat
  src={NEPTUNE_OVERLAY_ASSETS.flowerDouble}
  alt=""
  className="absolute w-30 -bottom-10 -right-8 opacity-90 scale-x-[-1] z-10"
  amplitude={5.2}
  duration={7.2}
  delay={0.25}
  rotate={1.4}
  breeze
  loading="lazy"
  draggable={false}
  />
  <div className="relative aspect-[4/5] rounded-t-[999px] overflow-hidden border border-[#6E7B6E] bg-white">
  <Image
  src={photo}
  alt="Story"
  fill
  sizes="360px"
  className="object-cover"
  unoptimized
  />
  </div>
  </div>
  </div>
  </NeptuneReveal>

  <div className="mt-10 space-y-10">
  {stories.map((s, idx) => (
  <NeptuneReveal
  key={`${s.date}-${idx}`}
  direction="up"
  width="100%"
  delay={0.75 + idx * 0.22}
  >
  <div className="text-center">
  <p className="text-xs tracking-[0.28em] uppercase text-[#6B747C] font-body">
  {s.date}
  </p>
  <p className="mt-5 text-[15px] leading-relaxed text-[#6B747C] whitespace-pre-line">
  {s.description}
  </p>
  {idx < stories.length - 1 ? (
  <div className="mt-10 flex justify-center">
  <div className="h-10 w-px bg-black/20" />
  </div>
  ) : null}
  </div>
  </NeptuneReveal>
  ))}
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </section>
 );
}

function WishesSectionClassic({
 id,
 heading,
 children,
}: {
 id: NavSectionId;
 heading: string;
 children: ReactNode;
}) {
 return (
  <section
  id={id}
  className="relative scroll-mt-24 overflow-hidden bg-[#F3F1EC] text-[#2E343A] px-6 py-16"
  >
  <div className="absolute inset-0 pointer-events-none"></div>

  <div className="relative z-10 max-w-md mx-auto">
  <NeptuneStagger baseDelay={0.1}>
  <h3
  className={`${neptuneSerif.className} text-4xl text-[#6B7480] text-center`}
  >
  <SplitText text={heading} splitBy="word" staggerDelay={0.09} />
  </h3>
  <div className="mt-8">{children}</div>
  </NeptuneStagger>
  </div>
  </section>
 );
}

function GiftSectionClassic({
 id,
 heading,
 children,
}: {
 id: NavSectionId;
 heading: string;
 children: ReactNode;
}) {
 return (
  <section
  id={id}
  className="relative scroll-mt-24 overflow-hidden bg-[#4E5C6C] text-white px-6 py-16"
  >
  <div className="absolute inset-0 bg-linear-to-b from-[#59677A] via-[#4E5C6C] to-[#3E4A58]" />

  <div className="relative z-10 max-w-xl mx-auto">
  <div className="rounded-[34px] border border-white/10 bg-[#0B1028]/75 backdrop-blur shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
  <div className="p-10">
  <NeptuneStagger baseDelay={0.1}>
  <h3
  className={`${neptuneSerif.className} text-4xl text-center bg-linear-to-r from-cyan-200 via-indigo-200 to-emerald-200 bg-clip-text text-transparent`}
  >
  <SplitText text={heading} splitBy="word" staggerDelay={0.09} />
  </h3>
  <div className="mt-8">{children}</div>
  </NeptuneStagger>
  </div>
  </div>
  </div>
  </section>
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
  ? "group relative w-full aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/85"
  : "group relative w-full aspect-square overflow-hidden rounded-2xl border border-white/12 bg-white/5"
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
  ? "absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"
  : "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition"
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
  ? "fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm flex items-center justify-center p-6"
  : "fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
  }
  >
  <div
  className="relative max-w-5xl w-full"
  onClick={(e) => e.stopPropagation()}
  >
  <div
  className={
  isClassic
  ? "absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-[#2E343A]/80"
  : "absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-white/85"
  }
  >
  <a
  href={selected}
  download
  target="_blank"
  rel="noreferrer"
  className={
  isClassic
  ? "text-xs tracking-[0.25em] uppercase font-body hover:text-[#2E343A]"
  : "text-xs tracking-[0.25em] uppercase font-body hover:text-white"
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
  ? "text-xs tracking-[0.25em] uppercase font-body hover:text-[#2E343A]"
  : "text-xs tracking-[0.25em] uppercase font-body hover:text-white"
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
  ? "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/85 hover:bg-white border border-black/10 backdrop-blur flex items-center justify-center text-[#2E343A]"
  : "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
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
  ? "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/85 hover:bg-white border border-black/10 backdrop-blur flex items-center justify-center text-[#2E343A]"
  : "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
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
  ? "relative w-full h-[80vh] rounded-2xl overflow-hidden bg-white/95 border border-black/10"
  : "relative w-full h-[80vh] rounded-2xl overflow-hidden bg-black/20 border border-white/10"
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

function GiftBlock({
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
  ? "rounded-2xl border border-white/12 bg-white/6 backdrop-blur p-6"
  : "rounded-3xl border border-white/12 bg-white/8 backdrop-blur p-7"
  }
  >
  <p
  className={
  isClassic
  ? "text-sm text-cyan-100/70 text-center whitespace-pre-line"
  : "text-sm text-cyan-100/70 text-center whitespace-pre-line"
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
  className="w-full inline-flex items-center justify-center rounded-full px-6 py-3 border border-white/15 bg-linear-to-r from-cyan-400/20 via-indigo-400/20 to-emerald-400/20 text-white hover:bg-white/10 transition"
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
  ? "rounded-2xl border border-white/12 bg-white/6 backdrop-blur p-6"
  : "rounded-3xl border border-white/12 bg-white/8 backdrop-blur p-7"
  }
  >
  <div className="flex items-start justify-between gap-4">
  <div className="min-w-0">
  <p className="text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body">
  {b.bankName}
  </p>
  <p className="mt-3 text-sm font-body text-white/90 truncate">
  {b.accountHolder}
  </p>
  </div>

  <button
  type="button"
  onClick={() =>
  setExpandedKeys((prev) => ({ ...prev, [k]: !prev[k] }))
  }
  className="shrink-0 inline-flex items-center justify-center rounded-full h-9 w-9 border border-white/15 bg-white/6 hover:bg-white/10 transition"
  aria-expanded={isExpanded}
  aria-label={isExpanded ? "Tutup rekening" : "Lihat rekening"}
  >
  <IconArrowRight
  className={`h-4 w-4 text-white transition-transform duration-200 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
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
  <p className="text-2xl tracking-wide text-white">
  {b.accountNumber}
  </p>

  <button
  type="button"
  onClick={() => copy(b.accountNumber, k)}
  className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-3 border border-white/15 bg-white/10 hover:bg-white/15 transition w-full"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-body text-white">
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
  className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
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
  className="w-full max-w-lg rounded-3xl border border-black/10 bg-[#F8F4EC] p-7 shadow-2xl"
  >
  <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">
  Info
  </p>
  <h4
  className={`mt-3 ${neptuneScript.className} text-4xl leading-none text-[#2B2424]`}
  >
  Exclusive Discount
  </h4>
  <p className="mt-4 text-sm text-[#3A2F2F]">
  Anda akan mendapatkan exclusive discount hingga{" "}
  <span className="font-body text-[#2B2424]">25%</span>{" "}
  untuk pemesanan hadiah dari link ini. &quot;Chat
  WhatsApp&quot; untuk informasi lebih lanjut.
  </p>

  <div className="mt-7 grid grid-cols-1 gap-3">
  <button
  type="button"
  onClick={() => setIsGiftDialogOpen(false)}
  className="rounded-full px-6 py-3 border border-black/10 bg-white/70 hover:bg-white transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-body">
  Tutup
  </span>
  </button>

  <a
  href={waUrl}
  target="_blank"
  rel="noreferrer"
  className="rounded-full px-6 py-3 bg-[#2B2424] text-white hover:bg-black transition text-center"
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

function RsvpFirestore({
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
  <div className="rounded-3xl border border-white/12 bg-white/8 backdrop-blur p-7">
  {submitted ? (
  <div className="text-center">
  <p className="text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body">
  {inviteeName ?? "Tamu"}
  </p>
  <p className="mt-4 text-sm text-white/90">
  {status === "already_submitted"
  ? alreadySubmittedMessage || "Konfirmasi anda sudah kami terima"
  : successMessage || "Terima kasih atas konfirmasi anda"}
  </p>
  <p className="mt-4 text-xs uppercase tracking-[0.25em] font-body text-cyan-100/70">
  {seeYouMessage || "Sampai jumpa di acara kami"}
  </p>
  </div>
  ) : (
  <div>
  <p className="text-center text-sm text-cyan-100/70 whitespace-pre-line">
  {inviteeName
  ? description ||
  `Silakan konfirmasi kehadiran sebelum ${rsvpDeadline}`
  : "Untuk mengisi konfirmasi, silakan akses dari link undangan personal."}
  </p>

  <form onSubmit={submit} className="mt-6 space-y-4">
  <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-3">
  <p className="text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body">
  Nama
  </p>
  <p className="mt-2 text-sm font-body text-white/90">
  {inviteeName ?? "Tamu"}
  </p>
  </div>

  <div>
  <label className="block text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body mb-2">
  Jumlah Tamu
  </label>
  <select
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
  className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-white/15"
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
  className="w-full rounded-full px-6 py-3 bg-white text-[#020615] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

function WishesFirestore({
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
  message: "Selamat menempuh hidup baru. Semoga selalu diberi kebahagiaan dan keberkahan.",
  createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 18)),
  },
  {
  id: `demo_${invitationId}_2`,
  invitationId,
  name: "Nadya",
  message: "Happy wedding! Semoga langgeng sampai tua dan saling menguatkan dalam setiap keadaan.",
  createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 2)),
  },
  {
  id: `demo_${invitationId}_3`,
  invitationId,
  name: "Dimas",
  message: "Semoga pernikahannya penuh cinta, rezeki lancar, dan rumah tangga sakinah mawaddah warahmah.",
  createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 9)),
  },
  {
  id: `demo_${invitationId}_4`,
  invitationId,
  name: "Alya",
  message: "Congrats! Semoga jadi pasangan yang saling melengkapi dan selalu kompak.",
  createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 26)),
  },
  {
  id: `demo_${invitationId}_5`,
  invitationId,
  name: "Bima",
  message: "Doa terbaik untuk kalian berdua. Semoga acaranya lancar dan pernikahannya bahagia selalu.",
  createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 54)),
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
  ? "relative overflow-hidden rounded-3xl border border-white/15 bg-[#475465] shadow-[0_18px_50px_rgba(0,0,0,0.18)] p-7"
  : "rounded-3xl border border-white/12 bg-white/8 backdrop-blur p-7"
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
  ? "text-sm text-white/80"
  : "text-sm text-cyan-100/70"
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
  ? "text-xs tracking-[0.35em] uppercase text-white/70 font-body"
  : "text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body"
  }
  >
  {effectiveInviteeName}
  </p>
  {existingWish?.attendance ? (
  <p
  className={
  isClassic
  ? "mt-3 text-xs uppercase tracking-[0.25em] font-body text-white/90"
  : "mt-3 text-xs uppercase tracking-[0.25em] font-body text-white"
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
  ? "mt-4 text-sm text-white/90"
  : "mt-4 text-sm text-white/90"
  }
  >
  {thankYouMessage}
  </p>
  {existingWish?.message ? (
  <p
  className={
  isClassic
  ? "mt-4 text-sm text-white/85 whitespace-pre-line"
  : "mt-4 text-sm text-white/80 whitespace-pre-line"
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
  ? "text-xs tracking-[0.35em] uppercase text-white/70 font-body"
  : "text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body"
  }
  >
  Dari
  </p>
  <p
  className={
  isClassic
  ? "mt-2 text-sm font-body text-white/90"
  : "mt-2 text-sm font-body text-white/90"
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
  className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "hadir" ? "bg-white text-[#475465] border-white" : "bg-white/10 text-white border-white/15 hover:bg-white/15"}`}
  >
  Hadir
  </button>
  <button
  type="button"
  onClick={() => setAttendance("tidak")}
  className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "tidak" ? "bg-white text-[#475465] border-white" : "bg-white/10 text-white border-white/15 hover:bg-white/15"}`}
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
  ? "w-full min-h-28 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/45"
  : "w-full min-h-28 rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-white/15 text-white placeholder:text-white/40"
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
  ? "rounded-full px-6 py-3 bg-white text-[#475465] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
  : "rounded-full px-6 py-3 bg-white text-[#020615] hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
  ? "rounded-3xl border border-black/10 bg-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
  : "space-y-3"
  }
  >
  {wishes.length === 0 ? (
  <div
  className={
  isClassic
  ? "px-6 py-7 text-center"
  : "rounded-3xl border border-white/12 bg-white/6 backdrop-blur p-7 text-center"
  }
  >
  <p
  className={
  isClassic
  ? "text-sm text-[#6B747C]"
  : "text-sm text-cyan-100/70"
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
  className="relative rounded-[24px] bg-white text-[#2E343A] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
  >
  <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.06),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.05),transparent_55%)] opacity-50" />
  <div className="relative rounded-[24px] border border-black/10 p-6">
  <div className="flex items-start justify-between gap-4">
  <div>
  <p className="text-sm font-semibold text-[#3A3F45]">
  {w.name}
  </p>
  <p className="mt-2 text-xs text-[#6B747C]">
  {w.createdAt?.toDate
  ? formatDistanceToNow(w.createdAt.toDate(), {
  addSuffix: true,
  })
  : "Baru saja"}
  </p>
  </div>
  </div>
  <p className="mt-3 text-sm text-[#5A6168] whitespace-pre-line">
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
  className="rounded-3xl border border-white/12 bg-white/6 backdrop-blur p-7"
  >
  <div className="flex items-start justify-between gap-4">
  <div>
  <p className="text-xs tracking-[0.35em] uppercase text-cyan-100/60 font-body">
  {w.name}
  </p>
  <div className="mt-2 flex items-center gap-2">
  {w.attendance ? (
  <span
  className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-body border ${w.attendance === "tidak" ? "bg-white/10 text-white border-white/15" : "bg-white text-[#020615] border-white"}`}
  >
  {w.attendance === "tidak" ? "Tidak" : "Hadir"}
  </span>
  ) : null}
  <span className="text-[10px] text-cyan-100/50 uppercase tracking-[0.25em] font-body">
  {w.createdAt?.toDate
  ? formatDistanceToNow(w.createdAt.toDate(), {
  addSuffix: true,
  })
  : "Baru saja"}
  </span>
  </div>
  </div>
  </div>

  <p className="mt-4 text-sm text-white/85 whitespace-pre-line">
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

function ThankYouSection({
 couple,
 backgroundPhotos,
 fallbackImage,
}: {
 couple: InvitationConfig["couple"];
 backgroundPhotos?: string[];
 fallbackImage: string;
}) {
 const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;
 const photos = useMemo(() => {
  const list = backgroundPhotos?.filter(Boolean) ?? [];
  if (list.length > 0) return list;
  return fallbackImage ? [fallbackImage] : [];
 }, [backgroundPhotos, fallbackImage]);

 const [activeIndex, setActiveIndex] = useState(0);

 useEffect(() => {
  if (photos.length <= 1) return;
  const t = window.setInterval(() => {
  setActiveIndex((prev) => (prev + 1) % photos.length);
  }, 7200);
  return () => window.clearInterval(t);
 }, [photos.length]);

 const safeActiveIndex = photos.length > 0 ? activeIndex % photos.length : 0;
 const activePhoto = photos[safeActiveIndex] ?? fallbackImage;

 return (
  <section
  id="thankyou"
  className="relative overflow-hidden bg-[#F3F1EC] text-[#536675]"
  >
  <div className="relative h-[56vh] min-h-[360px] max-h-[560px] overflow-hidden">
  <AnimatePresence initial={false}>
  {activePhoto ? (
  <motion.div
  key={`${safeActiveIndex}-${activePhoto}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{
  duration: 1.2,
  ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
  }}
  className="absolute inset-0"
  >
  <motion.div
  initial={{ scale: 1.05 }}
  animate={{ scale: 1.14 }}
  transition={{ duration: 8.2, ease: "easeOut" }}
  className="absolute inset-0"
  >
  <Image
  src={activePhoto}
  alt="Thank you background"
  fill
  sizes="100vw"
  className="object-cover object-center"
  unoptimized
  />
  </motion.div>
  </motion.div>
  ) : null}
  </AnimatePresence>
  <div className="absolute inset-0 bg-white/18" />
  <div className="absolute inset-0 bg-linear-to-b from-white/5 via-white/28 to-[#F3F1EC]/85" />
  <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-[#F3F1EC] to-transparent" />
  </div>

  <div className="relative -mt-24 px-6 pb-16 ">
  <NeptuneStagger
  className="mx-auto max-w-3xl text-center"
  baseDelay={0.08}
  staggerStep={0.22}
  >
  <p className="mx-auto max-w-2xl text-md leading-tight text-[#536675] ">
  Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
  Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas
  perhatian dan doa yang diberikan, kami ucapkan terima kasih.
  </p>

  <p className={`${neptuneScript.className} pt-10 text-xl text-[#5E7382]`}>
  The Wedding of
  </p>

  <h3 className={`${neptuneSerif.className} pt-2 text-4xl text-[#516675]`}>
  {names}
  </h3>
  </NeptuneStagger>
  </div>
  </section>
 );
}

function FooterMark({ couple }: { couple: InvitationConfig["couple"] }) {
 const year = new Date().getFullYear();
 const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;

 const stars = useMemo(() => {
  return Array.from({ length: 42 }, (_, i) => {
  const x = (i * 37) % 100;
  const y = (i * 19) % 100;
  const size = 1 + ((i * 11) % 3);
  const dur = 2.4 + ((i * 7) % 10) * 0.38;
  const delay = ((i * 5) % 12) * 0.28;
  const opacity = 0.18 + ((i * 13) % 10) * 0.05;
  return { x, y, size, dur, delay, opacity };
  });
 }, []);

 return (
  <footer className="relative mt-8 overflow-hidden bg-[#0b0c1a] border-t border-white/5">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent)]" />
  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/80" />
  <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.28)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

  <div className="absolute inset-0 pointer-events-none">
  <motion.div
  className="absolute inset-0 origin-center"
  animate={{ rotate: 360 }}
  transition={{ duration: 260, repeat: Infinity, ease: "linear" }}
  >
  {stars.map((s, idx) => (
  <motion.span
  key={idx}
  className="absolute rounded-full bg-white"
  style={{
  left: `${s.x}%`,
  top: `${s.y}%`,
  width: s.size,
  height: s.size,
  opacity: s.opacity,
  }}
  animate={{
  opacity: [s.opacity, Math.min(1, s.opacity + 0.6), s.opacity],
  scale: [1, 1.35, 1],
  }}
  transition={{
  duration: s.dur,
  repeat: Infinity,
  ease: "easeInOut",
  delay: s.delay,
  }}
  />
  ))}
  </motion.div>

  <motion.div
  className="absolute left-[22%] top-[50%] w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
  animate={{ rotate: -360 }}
  transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute top-2 right-12 w-2.5 h-2.5 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
  </motion.div>

  <motion.div
  className="absolute left-[78%] top-[38%] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
  animate={{ rotate: 360 }}
  transition={{ duration: 74, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-emerald-200/80 shadow-[0_0_18px_rgba(167,243,208,0.55)]" />
  </motion.div>

  <motion.div
  className="absolute -top-12 left-[-35%] w-[65%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
  animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
  transition={{
  duration: 3.1,
  repeat: Infinity,
  ease: "easeInOut",
  repeatDelay: 4.2,
  }}
  style={{ transform: "rotate(18deg)" }}
  />
  </div>

  <div className="relative px-6 py-12 ">
  <div className="max-w-3xl mx-auto text-center text-white">
  <NeptuneReveal
  direction="up"
  width="100%"
  delay={0.25}
  className="flex justify-center"
  >
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-300 backdrop-blur-md relative overflow-hidden">
  <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent animate-[gradient_4s_linear_infinite]" />
  <span className="relative w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
  <span className="relative">{names}</span>
  </div>
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={0.75}>
  <h3
  className={`mt-4 ${neptuneScript.className} text-2xl bg-linear-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]`}
  style={{
  textShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
  WebkitBackgroundClip: "text",
  }}
  >
  Selamat Berbahagia
  </h3>
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={1.25}>
  <p className="mt-4 text-sm text-indigo-200/70 font-light leading-relaxed">
  MISI SELESAI! <br />
  Terima kasih sudah menjelajah bersama <br />
  Activid Invitation
  </p>
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={1.75}>
  <div className="mt-7 flex items-center justify-center">
  <a
  href="https://invitation.activid.id"
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-200 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.35)]"
  >
  <span className="uppercase tracking-[0.25em]">
  Kembali Pulang 🚀
  </span>
  </a>
  </div>
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={2.25}>
  <div className="mt-10 h-px w-full bg-white/10" />
  </NeptuneReveal>

  <NeptuneReveal direction="up" width="100%" delay={2.55}>
  <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-white/40 font-body">
  © {year} Activid Invitation
  </p>
  </NeptuneReveal>
  </div>
  </div>
  </footer>
 );
}
