"use client";

import { type ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import localFont from "next/font/local";
import { IconPause, IconPlay, WaveSeparator } from "./graphics";
import { Host, InvitationConfig, InvitationDateTimeValue } from "@/types/invitation";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { normalizeInvitationGuestName, pickDeterministicRandomSubset } from "@/lib/utils";
import { db } from "@/lib/firebase";
import {
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
import { DateTime } from "luxon";
import {
  deriveInvitationPrimaryDateInfo,
  formatRelativeToNow,
  getCountdownParts,
  parseInvitationDateTime,
} from "@/lib/date-time";
import {
  formatInvitationDateLong,
  formatInvitationMonthYear,
  formatInvitationTime,
} from "@/lib/date-utils";

interface JupiterProps {
  config: InvitationConfig;
}

const jupiterBody = localFont({
  src: "../../../public/fonts/poppins-regular.ttf",
  variable: "--font-jupiter-body",
  display: "swap",
});

const jupiterScript = localFont({
  src: "../../../public/fonts/great-vibes-regular.ttf",
  display: "swap",
});

function JupiterReveal(props: ComponentProps<typeof RevealOnScroll>) {
  const { delay, duration, distance, ...rest } = props;

  return (
  <RevealOnScroll
  delay={delay ?? 0.35}
  duration={duration ?? 1.6}
  distance={distance ?? 46}
  margin="-12%"
  {...rest}
  />
  );
}

interface WishDoc {
  id: string;
  invitationId: string;
  name: string;
  nameKey?: string;
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

function useCountdown(targetDate: string) {
  const compute = (raw: string) => getCountdownParts(raw);

  const [timeLeft, setTimeLeft] = useState(() => compute(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(compute(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function formatJupiterDateParts(targetIso: string) {
  const dt = parseInvitationDateTime(targetIso);
  if (!dt) return { month: "", day: "", year: "" };

  const month = dt.setLocale("id").toFormat("LLLL");
  const day = dt.toFormat("d");
  const year = dt.toFormat("yyyy");
  return { month, day, year };
}

export function Jupiter({ config }: JupiterProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [contentReady, setContentReady] = useState(() => !config.sections.hero.enabled);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioStreamUrl = useMemo(() => config.music.url.replace(/dl=[01]/, "raw=1"), [config.music.url]);

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

  const derivedPhotos = useMemo(
    () => pickDeterministicRandomSubset(config.sections.gallery.photos ?? [], config.id, 5),
    [config.id, config.sections.gallery.photos],
  );

  const hosts = config.sections.hosts.hosts;
  const hostsSection = config.sections.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(config.sections.event.events[0]?.date);

  useEffect(() => {
  if (!isOpen || !contentReady) return;

  if (audioRef.current) {
  const playPromise = audioRef.current.play();
  if (playPromise !== undefined) {
  playPromise
  .then(() => setIsPlaying(true))
  .catch(() => setIsPlaying(false));
  }
  }
  }, [contentReady, isOpen]);

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
  if (typeof window !== "undefined") {
  window.scrollTo({ top: 0, behavior: "smooth" });
  }
  };

  return (
  <main
  className={`relative min-h-screen overflow-x-hidden bg-wedding-dark text-wedding-on-dark font-body ${jupiterBody.variable} [--font-body:var(--font-jupiter-body)]`}
  >
  {isOpen && derivedPhotos.length > 0 ? (
  <div className="absolute inset-0 z-0 pointer-events-none">
  <BackgroundSlideshow
  photos={derivedPhotos}
  className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-15"
  />
  <div className="absolute inset-0 bg-linear-to-b from-wedding-dark/85 via-wedding-dark/70 to-wedding-dark/90" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,199,122,0.16),transparent_60%),radial-gradient(circle_at_80%_40%,rgba(56,189,248,0.08),transparent_55%)]" />
  </div>
  ) : null}

  <audio ref={audioRef} src={audioStreamUrl} loop preload="auto" />

  {config.sections.hero.enabled && (
  <motion.div
  className="absolute inset-0 z-50"
  initial={false}
  animate={{
  y: isOpen ? "-100%" : "0%",
  transitionEnd: {
  display: isOpen ? "none" : "block",
  },
  }}
  transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
  onAnimationComplete={() => {
  if (isOpen) setContentReady(true);
  }}
  >
  <JupiterCoverOverlay
  hosts={hosts}
  date={dateInfo?.display ?? ""}
  subtitle={config.sections.hero.subtitle}
  coverImage={config.sections.hero.coverImage}
  guestName={guestName}
  onOpen={openInvitation}
  />
  </motion.div>
  )}

  {contentReady ? (
  <div className="relative z-10">
  <div className="relative">
  <JupiterTitleCountdown
  hosts={hosts}
  targetDate={dateInfo?.countdownTarget ?? ""}
  heading={config.sections.title.heading}
  coverImage={config.sections.hero.coverImage}
  photos={derivedPhotos}
  />

  {config.sections.quote.enabled && (
  <JupiterQuote
  text={config.sections.quote.text}
  author={config.sections.quote.author}
  thumbnails={config.sections.gallery.photos.slice(0, 4)}
  />
  )}

  {hostsSection.enabled && (
  <JupiterCouple hosts={hosts} />
  )}

  {config.sections.event.enabled && (
  <JupiterEvent
  heading={config.sections.event.heading}
  events={config.sections.event.events}
  />
  )}

  {config.sections.story.enabled && (
  <JupiterStory
  heading={config.sections.story.heading}
  stories={config.sections.story.stories}
  photo={config.sections.gallery.photos[4] || config.sections.hero.coverImage}
  />
  )}

  {config.sections.wishes.enabled && (
  <JupiterSectionWrap title={config.sections.wishes.heading || "Wedding Wishes"}>
  <JupiterWishesFirestore
  invitationId={config.id}
  inviteeName={inviteeName}
  placeholder={config.sections.wishes.placeholder}
  thankYouMessage={
  config.sections.wishes.thankYouMessage || "Terima kasih atas konfirmasi dan ucapannya."
  }
  />
  </JupiterSectionWrap>
  )}

  {config.sections.gratitude.enabled ? (
  <JupiterGratitude hosts={hosts} message={config.sections.gratitude.message} />
  ) : null}

  <JupiterFooter hosts={hosts} />

  {isOpen ? (
  <button
  type="button"
  onClick={togglePlay}
  className="absolute bottom-6 right-6 z-[120] h-12 w-12 rounded-full border border-wedding-on-dark/10 bg-wedding-dark/80 text-wedding-on-dark backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:bg-wedding-dark transition"
  aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
  >
  <span className="sr-only">{isPlaying ? "Jeda Musik" : "Putar Musik"}</span>
  <div className="flex items-center justify-center">
  {isPlaying ? <IconPause /> : <IconPlay />}
  </div>
  </button>
  ) : null}
  </div>
  </div>
  ) : null}

  <style jsx global>{`
  @keyframes gradient {
  0% {
  background-position: 0% 50%;
  }
  50% {
  background-position: 100% 50%;
  }
  100% {
  background-position: 0% 50%;
  }
  }
  `}</style>
  </main>
  );
}

function JupiterCoverOverlay({
  hosts,
  date,
  subtitle,
  coverImage,
  guestName,
  onOpen,
}: {
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
  guestName: string;
  onOpen: () => void;
}) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
  <div className="relative h-screen w-full overflow-hidden bg-wedding-dark text-wedding-on-dark">
  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
  <div className="absolute inset-0 bg-black/55" />
  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/65" />
  </div>

  <div className="absolute inset-0 pointer-events-none">
  <div className="absolute -top-48 left-1/2 w-[640px] h-[640px] -translate-x-1/2 rounded-full bg-wedding-accent/10 blur-3xl" />
  <div className="absolute -bottom-52 left-1/3 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-wedding-accent-2/10 blur-3xl" />
  </div>

  <div className="relative z-10 h-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center text-center">
  <motion.div
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
  className="flex flex-col items-center"
  >
  <p className="text-xs tracking-[0.35em] uppercase opacity-90 font-body">{subtitle || "The Wedding Of"}</p>

  <h1 className={`mt-6 ${jupiterScript.className} text-6xl leading-none text-wedding-accent-light`}>
  {primary?.firstName ?? ""}
  </h1>
  {secondary ? (
  <>
  <div className="mt-2 mb-2 text-3xl opacity-90">&</div>
  <h1 className={`${jupiterScript.className} text-6xl leading-none text-wedding-accent-light`}>
  {secondary.firstName}
  </h1>
  </>
  ) : null}

  <div className="mt-8 w-full max-w-sm border border-white/25 bg-white/10 backdrop-blur-md rounded-2xl p-5">
  <p className="text-xs opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
  <p className="mt-1 text-lg font-body tracking-wide">{guestName}</p>
  </div>

  <button
  onClick={onOpen}
  className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-3 bg-wedding-accent text-wedding-on-accent hover:bg-wedding-accent/90 active:scale-[0.99] transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-body">Buka Undangan</span>
  </button>

  <p className="mt-10 text-xs tracking-widest opacity-80">{date}</p>
  </motion.div>
  </div>
  </div>
  );
}

function JupiterTitleCountdown({
  hosts,
  targetDate,
  heading,
  coverImage,
  photos,
}: {
  hosts: Host[];
  targetDate: string;
  heading: string;
  coverImage: string;
  photos: string[];
}) {
  const timeLeft = useCountdown(targetDate);
  const { month, day, year } = useMemo(() => formatJupiterDateParts(targetDate), [targetDate]);

  const primary = hosts[0];
  const secondary = hosts[1];

  const topPhoto = photos?.[0] || coverImage;

  return (
  <section className="relative px-6 pt-16 pb-20">
  <div className="max-w-5xl mx-auto">
  <JupiterReveal direction="up" width="100%" delay={0.35}>
  <div className="rounded-[2.25rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
  <div className="relative aspect-[16/9] w-full bg-white/5">
  <Image
  src={topPhoto}
  alt={heading}
  fill
  sizes="900px"
  className="object-cover"
  unoptimized
  />
  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
  </div>

  <div className="p-8 text-center">
  <p className="text-xs tracking-[0.35em] uppercase text-wedding-on-dark/60 font-body">{heading || "The Wedding"}</p>

  <h2 className={`mt-6 ${jupiterScript.className} text-6xl leading-none text-wedding-on-dark`}>
  {primary?.firstName ?? ""}
  </h2>
  {secondary ? (
  <>
  <div className="mt-2 mb-2 text-3xl opacity-80 text-wedding-on-dark">&</div>
  <h2 className={`${jupiterScript.className} text-6xl leading-none text-wedding-on-dark`}>
  {secondary.firstName}
  </h2>
  </>
  ) : null}

  <div className="mt-10 grid grid-cols-1 gap-6 items-center">
  <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
  <p className="text-[10px] uppercase tracking-[0.35em] text-wedding-on-dark/60">{month}</p>
  <p className="mt-3 text-5xl font-bold tracking-tight text-wedding-on-dark">{day}</p>
  <p className="mt-2 text-sm tracking-[0.25em] uppercase text-wedding-on-dark/60">{year}</p>
  </div>

  <div className="">
  <div className="grid grid-cols-2 gap-3">
  <JupiterCountdownCard label="Hari" value={timeLeft.days} />
  <JupiterCountdownCard label="Jam" value={timeLeft.hours} />
  <JupiterCountdownCard label="Menit" value={timeLeft.minutes} />
  <JupiterCountdownCard label="Detik" value={timeLeft.seconds} />
  </div>

  <p className="mt-6 text-xs tracking-[0.25em] uppercase text-wedding-on-dark/60 font-body">
  Mohon doa restu
  </p>
  </div>
  </div>
  </div>
  </div>
  </JupiterReveal>
  </div>
  </section>
  );
}

function JupiterCountdownCard({ label, value }: { label: string; value: number }) {
  return (
  <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4 text-center">
  <div className="text-3xl font-semibold text-wedding-on-dark leading-none">{value}</div>
  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-wedding-on-dark/60 font-body">{label}</div>
  </div>
  );
}

function JupiterQuote({ text, author, thumbnails }: { text: string; author: string; thumbnails: string[] }) {
  return (
  <section className="relative overflow-hidden bg-wedding-dark text-wedding-on-dark">
  <WaveSeparator position="top" fill="var(--invitation-bg)" />

  <div className="relative px-6 py-20">
  <div className="absolute inset-0 pointer-events-none">
  <div className="absolute -top-40 left-1/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-wedding-accent-2/10 blur-3xl" />
  <div className="absolute -bottom-48 left-3/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-wedding-accent/10 blur-3xl" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.08),transparent_60%)]" />
  </div>

  <div className="relative max-w-4xl mx-auto">
  <JupiterReveal direction="up" width="100%">
  <div className="text-center">
  <p className="text-sm leading-relaxed text-white/95 whitespace-pre-line">{text}</p>
  {author ? <p className="mt-6 text-xs tracking-[0.35em] uppercase text-white/70">{author}</p> : null}
  </div>
  </JupiterReveal>

  {thumbnails.length > 0 ? (
  <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
  {thumbnails.slice(0, 4).map((src, idx) => (
  <JupiterReveal key={`${src}-${idx}`} direction="up" width="fit-content" delay={0.35 + idx * 0.12}>
  <div className="relative h-20 w-20 rounded-full overflow-hidden border border-wedding-on-dark/20 bg-wedding-on-dark/5">
  <Image src={src} alt="thumb" fill sizes="80px" className="object-cover" unoptimized />
  <div className="absolute inset-0 bg-white/10" />
  </div>
  </JupiterReveal>
  ))}
  </div>
  ) : null}
  </div>
  </div>

  </section>
  );
}

function JupiterCouple({ hosts }: { hosts: Host[] }) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
  <section className="relative px-6 py-20">
  <div className="max-w-5xl mx-auto">
  <JupiterSectionHeading title="Hosts" />

  <div className="grid grid-cols-1 gap-8">
  <JupiterPersonCard
  label="Host 1"
  name={primary?.firstName ?? ""}
  fullName={primary?.fullName ?? ""}
  parents={primary?.parents ?? ""}
  photo={primary?.photo ?? ""}
  delay={0.35}
  />
  {secondary ? (
  <JupiterPersonCard
  label="Host 2"
  name={secondary.firstName}
  fullName={secondary.fullName}
  parents={secondary.parents}
  photo={secondary.photo}
  delay={0.55}
  />
  ) : null}
  </div>
  </div>
  </section>
  );
}

function JupiterPersonCard({
  label,
  name,
  fullName,
  parents,
  photo,
  delay,
}: {
  label: string;
  name: string;
  fullName: string;
  parents: string;
  photo: string;
  delay: number;
}) {
  return (
  <JupiterReveal direction="up" width="100%" delay={delay}>
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-8">
  <div className="flex flex-col items-center text-center">
  <div className="relative h-40 w-40 rounded-full overflow-hidden border border-white/10 bg-white/5">
  <Image src={photo} alt={name} fill sizes="160px" className="object-cover" unoptimized />
  </div>

  <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-wedding-on-dark/60">{label}</p>
  <h4 className={`mt-3 ${jupiterScript.className} text-5xl leading-none text-wedding-on-dark`}>{name}</h4>
  <p className="mt-2 text-sm font-body text-wedding-on-dark">{fullName}</p>
  <p className="mt-4 text-xs text-wedding-on-dark/60 whitespace-pre-line">{parents}</p>
  </div>
  </div>
  </JupiterReveal>
  );
}

function JupiterEvent({
  heading,
  events,
}: {
  heading: string;
  events: InvitationConfig["sections"]["event"]["events"];
}) {
  const cards = events;

  return (
  <section className="relative px-6 py-20">
  <div className="max-w-5xl mx-auto">
  <JupiterSectionHeading title={heading || "The Event"} />

  <div className="grid grid-cols-1 gap-8">
  {cards.map((e, idx) => (
  <JupiterEventCard
  key={`${e.title}-${idx}`}
  title={e.title}
  date={e.date}
  venue={e.venue}
  address={e.address}
  mapUrl={e.mapUrl}
  delay={0.35 + idx * 0.18}
  />
  ))}
  </div>
  </div>
  </section>
  );
}

function JupiterEventCard({
  title,
  date,
  venue,
  address,
  mapUrl,
  delay,
}: {
  title: string;
  date: InvitationDateTimeValue;
  venue: string;
  address: string;
  mapUrl: string;
  delay: number;
}) {
  return (
  <JupiterReveal direction="up" width="100%" delay={delay}>
  <div className="rounded-[2.25rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
  <div className="relative px-8 pt-12 pb-10">
  <div
  className="absolute inset-0"
  style={{
  clipPath: "ellipse(70% 52% at 50% 0%)",
  background:
  "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--invitation-accent) 18%, transparent), transparent 60%), radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--invitation-accent-2) 10%, transparent), transparent 65%)",
  }}
  />

  <div className="relative text-center">
  <h4 className={`${jupiterScript.className} text-5xl leading-none text-wedding-on-dark`}>{title}</h4>

  <div className="mt-6 space-y-2 text-sm text-wedding-on-dark">
  {date ? <p className="font-body">{formatInvitationDateLong(date)}</p> : null}
  {date ? <p className="text-wedding-on-dark/60">{formatInvitationTime(date)}</p> : null}
  {venue ? <p className="font-body">{venue}</p> : null}
  {address ? <p className="text-wedding-on-dark/60 whitespace-pre-line">{address}</p> : null}
  </div>

  {mapUrl ? (
  <a
  href={mapUrl}
  target="_blank"
  rel="noreferrer"
  className="mt-8 inline-flex items-center justify-center w-full rounded-full px-6 py-3 bg-wedding-accent-2 text-wedding-on-accent-2 hover:bg-wedding-accent-2/90 transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-body">Buka Google Maps</span>
  </a>
  ) : null}
  </div>
  </div>
  </div>
  </JupiterReveal>
  );
}

function JupiterStory({
  heading,
  stories,
  photo,
}: {
  heading: string;
  stories: InvitationConfig["sections"]["story"]["stories"];
  photo: string;
}) {
  return (
  <section className="relative px-6 py-20">
  <div className="max-w-5xl mx-auto">
  <JupiterSectionHeading title={heading || "Our Story"} />

  <div className="grid grid-cols-1 gap-8 items-start">
  <div className="">
  <JupiterReveal direction="up" width="100%" delay={0.35}>
  <div className="relative aspect-[4/5] rounded-[2.25rem] overflow-hidden border border-white/10 bg-white/5">
  <Image src={photo} alt="story" fill sizes="420px" className="object-cover" unoptimized />
  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
  </div>
  </JupiterReveal>
  </div>

  <div className=" space-y-5">
  {stories.map((s, idx) => (
  <JupiterReveal key={idx} direction="up" width="100%" delay={0.45 + idx * 0.15}>
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-7">
  <p className="text-[10px] uppercase tracking-[0.35em] text-wedding-on-dark/60">{formatInvitationMonthYear(s.date)}</p>
  <p className="mt-4 text-sm leading-relaxed text-wedding-on-dark/90 whitespace-pre-line">
  {s.description}
  </p>
  </div>
  </JupiterReveal>
  ))}
  </div>
  </div>
  </div>
  </section>
  );
}

function JupiterGratitude({ hosts, message }: { hosts: Host[]; message: string }) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
  <section className="relative px-6 py-24">
  <div className="max-w-4xl mx-auto">
  <JupiterSectionHeading title="Gratitude" />

  <JupiterReveal direction="up" width="100%" delay={0.35}>
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-10 text-center">
  <p className="text-sm text-wedding-on-dark/90 whitespace-pre-line">
  {message || "Terima kasih telah menjadi bagian dari momen bahagia kami."}
  </p>

  <div className="mt-8">
  <p className={`text-5xl leading-none ${jupiterScript.className} text-wedding-on-dark`}>
  {primary?.firstName ?? ""} {secondary?.firstName ? "&" : ""} {secondary?.firstName ?? ""}
  </p>
  </div>

  <div className="mt-8 mx-auto h-px w-24 bg-white/10" />
  <p className="mt-8 text-xs tracking-[0.25em] uppercase text-wedding-on-dark/60">Dengan cinta</p>
  </div>
  </JupiterReveal>
  </div>
  </section>
  );
}

function JupiterSectionHeading({ title }: { title: string }) {
  return (
  <JupiterReveal direction="up" width="100%" delay={0.15}>
  <div className="text-center mb-10">
  <h3 className={`${jupiterScript.className} text-5xl leading-none text-wedding-on-dark`}>{title}</h3>
  <div className="mt-5 mx-auto h-px w-24 bg-white/10" />
  </div>
  </JupiterReveal>
  );
}

function JupiterSectionWrap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
  <section className="relative px-6 py-20 overflow-hidden">
  <div className="absolute inset-0">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.05),transparent_50%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(197,160,89,0.05),transparent_50%)]" />
  </div>
  <div className="relative max-w-xl mx-auto">
  <JupiterReveal direction="up" width="100%">
  <div className="text-center mb-10">
  <h3 className={`${jupiterScript.className} text-5xl leading-none text-wedding-on-dark`}>{title}</h3>
  <div className="mt-5 mx-auto h-px w-24 bg-wedding-on-dark/20" />
  </div>
  </JupiterReveal>

  {children}
  </div>
  </section>
  );
}

function JupiterWishesFirestore({
  invitationId,
  inviteeName,
  placeholder,
  thankYouMessage,
}: {
  invitationId: string;
  inviteeName: string | null;
  placeholder: string;
  thankYouMessage: string;
}) {
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
  createdAt: Timestamp.fromMillis(now - 1000 * 60 * 18),
  },
  {
  id: `demo_${invitationId}_2`,
  invitationId,
  name: "Nadya",
  message: "Happy wedding! Semoga langgeng sampai tua dan saling menguatkan dalam setiap keadaan.",
  createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
  },
  {
  id: `demo_${invitationId}_3`,
  invitationId,
  name: "Dimas",
  message: "Semoga pernikahannya penuh cinta, rezeki lancar, dan rumah tangga sakinah mawaddah warahmah.",
  createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 9),
  },
  {
  id: `demo_${invitationId}_4`,
  invitationId,
  name: "Alya",
  message: "Congrats! Semoga jadi pasangan yang saling melengkapi dan selalu kompak.",
  createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 26),
  },
  {
  id: `demo_${invitationId}_5`,
  invitationId,
  name: "Bima",
  message: "Doa terbaik untuk kalian berdua. Semoga acaranya lancar dan pernikahannya bahagia selalu.",
  createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 54),
  },
  ];
  }, [invitationId, isDemo]);

  useEffect(() => {
  if (!invitationId) return;

  if (isDemo) {
  setWishes(demoSeedWishes);
  return;
  }

  const q = query(collection(db, "wishes"), where("invitationId", "==", invitationId));
  const unsub = onSnapshot(q, (snapshot) => {
  const next = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WishDoc, "id">) })) as WishDoc[];

  next.sort((a, b) => {
  const aTime = a.createdAt?.toMillis?.() ?? 0;
  const bTime = b.createdAt?.toMillis?.() ?? 0;
  return bTime - aTime;
  });

  const seen = new Set<string>();
  const deduped: WishDoc[] = [];
  for (const w of next) {
  const key = w.nameKey || normalizeNameKey(w.name || "");
  if (!key) {
  deduped.push(w);
  continue;
  }
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(w);
  }

  setWishes(deduped);
  });

  return () => unsub();
  }, [demoSeedWishes, invitationId, isDemo]);

  useEffect(() => {
  const checkExisting = async () => {
  if (isDemo) return;
  if (!inviteeName || !inviteeWishRef) return;

  const snap = await getDoc(inviteeWishRef);
  if (snap.exists()) {
  const wish = { id: snap.id, ...(snap.data() as Omit<WishDoc, "id">) } as WishDoc;
  setExistingWish(wish);
  setHasPosted(true);
  return;
  }

  const q = query(
  collection(db, "wishes"),
  where("invitationId", "==", invitationId),
  where("name", "==", inviteeName),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const docs = snapshot.docs
  .map((d) => ({ id: d.id, ...(d.data() as Omit<WishDoc, "id">) }))
  .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));

  const top = docs[0] as WishDoc | undefined;
  if (!top) return;
  setExistingWish(top);
  setHasPosted(true);
  };

  checkExisting();
  }, [invitationId, inviteeName, inviteeWishRef, isDemo]);

  useEffect(() => {
  setVisibleCount(10);
  }, [invitationId]);

  const visibleWishes = useMemo(() => {
  return wishes.slice(0, visibleCount);
  }, [visibleCount, wishes]);

  useEffect(() => {
  const sentinel = loadMoreRef.current;
  if (!sentinel) return;

  const observer = new IntersectionObserver(
  (entries) => {
  const entry = entries[0];
  if (!entry?.isIntersecting) return;
  setVisibleCount((prev) => {
  if (prev >= wishes.length) return prev;
  return Math.min(wishes.length, prev + 10);
  });
  },
  {
  root: null,
  rootMargin: "600px 0px",
  threshold: 0.01,
  },
  );

  observer.observe(sentinel);
  return () => observer.disconnect();
  }, [wishes.length]);

  const submit = async () => {
  if (!message.trim()) return;

  if (isDemo) {
  setIsSubmitting(true);
  setError("");
  try {
  const next: WishDoc = {
  id: `demo_post_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  invitationId,
  name: effectiveInviteeName ?? "Demo Guest",
  message: message.trim(),
  createdAt: Timestamp.now(),
  };
  setWishes((prev) => [next, ...prev]);
  setMessage("");
  } finally {
  setIsSubmitting(false);
  }
  return;
  }

  if (!inviteeName || !inviteeNameKey || !inviteeWishRef) {
  setError("Fitur ini hanya tersedia untuk tamu yang mengakses link undangan personal.");
  return;
  }

  setIsSubmitting(true);
  setError("");

  try {
  const nextData = {
  invitationId,
  name: inviteeName,
  nameKey: inviteeNameKey,
  message: message.trim(),
  createdAt: Timestamp.now(),
  };

  await runTransaction(db, async (tx) => {
  const snap = await tx.get(inviteeWishRef);
  if (snap.exists()) {
  throw new Error("already-posted");
  }
  tx.set(inviteeWishRef, nextData);
  });

  setMessage("");
  setExistingWish({ id: inviteeWishRef.id, ...(nextData as Omit<WishDoc, "id">) } as WishDoc);
  setHasPosted(true);
  } catch (err) {
  if (err instanceof Error && err.message === "already-posted") {
  const snap = await getDoc(inviteeWishRef);
  if (snap.exists()) {
  const wish = { id: snap.id, ...(snap.data() as Omit<WishDoc, "id">) } as WishDoc;
  setExistingWish(wish);
  }
  setHasPosted(true);
  setError("Kamu sudah mengirim konfirmasi & ucapan. Terima kasih!");
  } else {
  console.error("Error adding wish:", err);
  setError("Terjadi kesalahan. Coba lagi ya.");
  }
  } finally {
  setIsSubmitting(false);
  }
  };

  return (
  <div className="space-y-6">
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-7">
  {!effectiveInviteeName ? (
  <div className="text-center">
  <p className="text-sm text-white/70">Untuk mengisi konfirmasi & ucapan, silakan akses dari link undangan personal.</p>
  </div>
  ) : hasPosted && !isDemo ? (
  <div className="text-center">
  <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">{effectiveInviteeName}</p>
  <p className="mt-4 text-sm text-white">{thankYouMessage}</p>
  {existingWish?.message ? (
  <p className="mt-4 text-sm text-white/80 whitespace-pre-line">{existingWish.message}</p>
  ) : null}
  </div>
  ) : (
  <div className="grid grid-cols-1 gap-4">
  <div className="text-center">
  <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">Dari</p>
  <p className="mt-2 text-sm font-body text-white">{effectiveInviteeName}</p>
  </div>

  <textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder={placeholder || "Tuliskan pesanmu"}
  className="w-full min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-white/10"
  disabled={isSubmitting}
  />

  {error ? <p className="text-center text-xs text-rose-300">{error}</p> : null}

  <button
  type="button"
  onClick={submit}
  disabled={isSubmitting || !message.trim()}
  className="rounded-full px-6 py-3 bg-wedding-accent text-wedding-on-accent hover:bg-wedding-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-body">
  {isSubmitting ? "Mengirim..." : "Konfirmasi"}
  </span>
  </button>
  </div>
  )}
  </div>

  <div className="space-y-3">
  {wishes.length === 0 ? (
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-7 text-center">
  <p className="text-sm text-white/70">Belum ada ucapan. Jadilah yang pertama.</p>
  </div>
  ) : (
  visibleWishes.map((w, idx) => (
  <JupiterReveal key={w.id} width="100%" direction="up" delay={0.35 + idx * 0.08}>
  <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-7">
  <div className="flex items-start justify-between gap-4">
  <div>
  <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">{w.name}</p>
  <div className="mt-2 flex items-center gap-2">
  <span className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-body">
  {w.createdAt ? formatRelativeToNow(w.createdAt) || "Baru saja" : "Baru saja"}
  </span>
  </div>
  </div>
  </div>

  <p className="mt-4 text-sm text-white/85 whitespace-pre-line">{w.message}</p>
  </div>
  </JupiterReveal>
  ))
  )}
  <div ref={loadMoreRef} className="h-px" />
  </div>
  </div>
  );
}

function JupiterFooter({ hosts }: { hosts: Host[] }) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  const stars = useMemo(() => {
  const count = 28;
  return Array.from({ length: count }, (_, i) => {
  const x = (i * 37) % 100;
  const y = (i * 71) % 100;
  const size = 1 + ((i * 13) % 3);
  const dur = 3.4 + ((i * 11) % 25) / 10;
  const delay = ((i * 17) % 20) / 10;
  const opacity = 0.18 + (((i * 13) % 10) * 0.05);
  return { x, y, size, dur, delay, opacity };
  });
  }, []);

  return (
  <footer className="relative mt-0 overflow-hidden bg-wedding-dark border-t border-wedding-on-dark/5">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--invitation-accent-2)_12%,transparent),transparent)]" />
  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/85" />

  <div className="absolute inset-0 pointer-events-none">
  <motion.div
  className="absolute inset-0 origin-center"
  animate={{ rotate: 360 }}
  transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
  >
  {stars.map((s, idx) => (
  <motion.span
  key={idx}
  className="absolute rounded-full bg-wedding-on-dark"
  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
  animate={{ opacity: [s.opacity, Math.min(1, s.opacity + 0.55), s.opacity], scale: [1, 1.35, 1] }}
  transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
  />
  ))}
  </motion.div>

  <motion.div
  className="absolute left-1/2 top-[42%] w-[540px] h-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
  animate={{ rotate: -360 }}
  transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute top-4 left-1/2 w-3 h-3 -translate-x-1/2 bg-wedding-accent/80 rounded-full blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.55)]" />
  </motion.div>

  <motion.div
  className="absolute left-[72%] top-[62%] w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
  animate={{ rotate: 360 }}
  transition={{ duration: 54, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute bottom-6 left-10 w-2 h-2 rounded-full bg-wedding-accent-2-light/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
  </motion.div>

  <div className="absolute -bottom-56 left-1/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-wedding-accent-2/10 blur-3xl" />
  <div className="absolute -top-56 left-3/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-wedding-accent/10 blur-3xl" />

  <motion.div
  className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
  animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
  transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", repeatDelay: 4.2 }}
  style={{ transform: "rotate(18deg)" }}
  />
  </div>

  <div className="relative px-6 py-14">
  <div className="max-w-3xl mx-auto text-center text-wedding-on-dark">
  <JupiterReveal direction="up" width="100%" delay={0.25} className="flex justify-center">
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-on-dark/5 border border-wedding-on-dark/10 text-xs font-mono text-wedding-on-dark/80 backdrop-blur-md relative overflow-hidden">
  <div className="absolute inset-0 bg-linear-to-r from-transparent via-wedding-accent-2/20 to-transparent animate-[gradient_4s_linear_infinite]" />
  <span className="relative w-2 h-2 rounded-full bg-wedding-accent animate-pulse shadow-[0_0_10px_var(--invitation-accent)]" />
  <span className="relative">{names}</span>
  </div>
  </JupiterReveal>

  <JupiterReveal direction="up" width="100%" delay={0.75}>
  <h3 className={`${jupiterScript.className} mt-7 text-5xl leading-none text-wedding-on-dark`}>Terima kasih</h3>
  <p className="mt-4 text-sm text-wedding-on-dark/70">Sampai jumpa di hari bahagia kami.</p>
  </JupiterReveal>

  <JupiterReveal direction="up" width="100%" delay={1.05}>
  <p className="mt-10 text-xs tracking-[0.25em] uppercase text-white/35 font-body">
  ACTIVID.ID // {DateTime.now().year}
  </p>
  </JupiterReveal>
  </div>
  </div>
  </footer>
  );
}
