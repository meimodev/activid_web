"use client";

import { type ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Allura, Plus_Jakarta_Sans } from "next/font/google";
import { IconPause, IconPlay, WaveSeparator } from "./graphics";
import { InvitationConfig } from "@/types/invitation";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, onSnapshot, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

interface JupiterProps {
    config: InvitationConfig;
}

const jupiterBody = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jupiter-body",
    weight: ["200", "300", "400", "500", "600", "700"],
});

const jupiterScript = Allura({
    subsets: ["latin"],
    weight: ["400"],
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

function useCountdown(targetDate: string) {
    const compute = (raw: string) => {
        const target = new Date(raw);
        const now = new Date();
        const difference = target.getTime() - now.getTime();

        if (!Number.isFinite(difference) || difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

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
    const d = new Date(targetIso);

    if (Number.isNaN(d.getTime())) {
        return { month: "", day: "", year: "" };
    }

    const month = d.toLocaleString("id-ID", { month: "long" });
    const day = String(d.getDate());
    const year = String(d.getFullYear());

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
        return sp.get("to");
    }, []);

    const guestName = useMemo(() => {
        if (inviteeName) return inviteeName;
        if (typeof window === "undefined") return "Tamu";
        const sp = new URLSearchParams(window.location.search);
        return sp.get("guest") || "Tamu";
    }, [inviteeName]);

    const persistentBackgroundPhotos = useMemo(() => {
        const hero = config.sections.hero.coverImage ? [config.sections.hero.coverImage] : [];
        const gallery = config.sections.gallery.photos;
        const backgrounds = config.backgroundPhotos;
        return Array.from(new Set([...hero, ...gallery, ...backgrounds])).filter(Boolean);
    }, [config.backgroundPhotos, config.sections.gallery.photos, config.sections.hero.coverImage]);

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
            className={`relative min-h-screen overflow-x-hidden bg-[#F7F3EA] text-[#1F1B16] font-body ${jupiterBody.variable} [--font-body:var(--font-jupiter-body)]`}
        >
            {isOpen && persistentBackgroundPhotos.length > 0 ? (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-15">
                        <BackgroundSlideshow photos={persistentBackgroundPhotos} />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-b from-[#F7F3EA]/85 via-[#F7F3EA]/70 to-[#F7F3EA]/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,199,122,0.16),transparent_60%),radial-gradient(circle_at_80%_40%,rgba(56,189,248,0.08),transparent_55%)]" />
                </div>
            ) : null}

            <audio ref={audioRef} src={audioStreamUrl} loop preload="auto" />

            {config.sections.hero.enabled && (
                <motion.div
                    className="fixed inset-0 z-50"
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
                        couple={config.couple}
                        date={config.weddingDate.display}
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
                            couple={config.couple}
                            targetDate={config.weddingDate.countdownTarget}
                            heading={config.sections.title.heading}
                            coverImage={config.sections.hero.coverImage}
                            photos={config.sections.countdown.photos}
                        />

                        {config.sections.quote.enabled && (
                            <JupiterQuote
                                text={config.sections.quote.text}
                                author={config.sections.quote.author}
                                thumbnails={config.sections.gallery.photos.slice(0, 4)}
                            />
                        )}

                        {config.sections.couple.enabled && (
                            <JupiterCouple
                                groom={config.couple.groom}
                                bride={config.couple.bride}
                            />
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

                        <JupiterGratitude
                            couple={config.couple}
                            message={config.sections.footer.message}
                        />

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

                        <JupiterFooter couple={config.couple} />

                        {isOpen ? (
                            <button
                                type="button"
                                onClick={togglePlay}
                                className="fixed bottom-6 right-6 z-[120] h-12 w-12 rounded-full border border-white/10 bg-[#0d0d1f]/80 text-white backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:bg-[#0d0d1f] transition"
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
    couple,
    date,
    subtitle,
    coverImage,
    guestName,
    onOpen,
}: {
    couple: InvitationConfig["couple"];
    date: string;
    subtitle: string;
    coverImage: string;
    guestName: string;
    onOpen: () => void;
}) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0d0d1f] text-white">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/65" />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-48 left-1/2 w-[640px] h-[640px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
                <div className="absolute -bottom-52 left-1/3 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 h-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <p className="text-xs tracking-[0.35em] uppercase opacity-90 font-body">{subtitle || "The Wedding Of"}</p>

                    <h1 className={`mt-6 ${jupiterScript.className} text-6xl md:text-7xl leading-none text-amber-100`}>
                        {couple.bride.firstName}
                    </h1>
                    <div className="mt-2 mb-2 text-3xl opacity-90">&</div>
                    <h1 className={`${jupiterScript.className} text-6xl md:text-7xl leading-none text-amber-100`}>
                        {couple.groom.firstName}
                    </h1>

                    <div className="mt-8 w-full max-w-sm border border-white/25 bg-white/10 backdrop-blur-md rounded-2xl p-5">
                        <p className="text-xs opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <p className="mt-1 text-lg font-body tracking-wide">{guestName}</p>
                    </div>

                    <button
                        onClick={onOpen}
                        className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-3 bg-amber-100 text-[#1F1B16] hover:bg-amber-50 active:scale-[0.99] transition"
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
    couple,
    targetDate,
    heading,
    coverImage,
    photos,
}: {
    couple: InvitationConfig["couple"];
    targetDate: string;
    heading: string;
    coverImage: string;
    photos: string[];
}) {
    const timeLeft = useCountdown(targetDate);
    const { month, day, year } = useMemo(() => formatJupiterDateParts(targetDate), [targetDate]);

    const topPhoto = photos?.[0] || coverImage;

    return (
        <section className="relative px-6 pt-16 pb-20">
            <div className="max-w-5xl mx-auto">
                <JupiterReveal direction="up" width="100%" delay={0.35}>
                    <div className="rounded-[2.25rem] overflow-hidden border border-black/10 bg-white/70 backdrop-blur">
                        <div className="relative aspect-[16/9] w-full bg-black/5">
                            <Image
                                src={topPhoto}
                                alt={heading}
                                fill
                                sizes="(max-width: 768px) 100vw, 900px"
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
                        </div>

                        <div className="p-8 md:p-12 text-center">
                            <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">{heading || "The Wedding"}</p>

                            <h2 className={`mt-6 ${jupiterScript.className} text-6xl md:text-7xl leading-none text-[#1F1B16]`}>
                                {couple.bride.firstName}
                            </h2>
                            <div className="mt-2 mb-2 text-3xl opacity-80 text-[#1F1B16]">&</div>
                            <h2 className={`${jupiterScript.className} text-6xl md:text-7xl leading-none text-[#1F1B16]`}>
                                {couple.groom.firstName}
                            </h2>

                            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div className="rounded-3xl border border-black/10 bg-[#F7F3EA] p-7">
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#6B5B5B]">{month}</p>
                                    <p className="mt-3 text-5xl font-bold tracking-tight text-[#1F1B16]">{day}</p>
                                    <p className="mt-2 text-sm tracking-[0.25em] uppercase text-[#6B5B5B]">{year}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <JupiterCountdownCard label="Hari" value={timeLeft.days} />
                                        <JupiterCountdownCard label="Jam" value={timeLeft.hours} />
                                        <JupiterCountdownCard label="Menit" value={timeLeft.minutes} />
                                        <JupiterCountdownCard label="Detik" value={timeLeft.seconds} />
                                    </div>

                                    <p className="mt-6 text-xs tracking-[0.25em] uppercase text-[#6B5B5B] font-body">
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
        <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur px-4 py-4 text-center">
            <div className="text-3xl font-semibold text-[#1F1B16] leading-none">{value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#6B5B5B] font-body">{label}</div>
        </div>
    );
}

function JupiterQuote({ text, author, thumbnails }: { text: string; author: string; thumbnails: string[] }) {
    return (
        <section className="relative overflow-hidden bg-[#0B2F4A] text-white">
            <WaveSeparator position="top" fill="#F7F3EA" />

            <div className="relative px-6 py-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 left-1/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
                    <div className="absolute -bottom-48 left-3/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.08),transparent_60%)]" />
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <JupiterReveal direction="up" width="100%">
                        <div className="text-center">
                            <p className="text-sm md:text-base leading-relaxed text-white/95 whitespace-pre-line">{text}</p>
                            {author ? <p className="mt-6 text-xs tracking-[0.35em] uppercase text-white/70">{author}</p> : null}
                        </div>
                    </JupiterReveal>

                    {thumbnails.length > 0 ? (
                        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
                            {thumbnails.slice(0, 4).map((src, idx) => (
                                <JupiterReveal key={`${src}-${idx}`} direction="up" width="fit-content" delay={0.35 + idx * 0.12}>
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden border border-white/20 bg-white/5">
                                        <Image src={src} alt="thumb" fill sizes="80px" className="object-cover" unoptimized />
                                        <div className="absolute inset-0 bg-black/10" />
                                    </div>
                                </JupiterReveal>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <WaveSeparator position="bottom" fill="#F7F3EA" />
        </section>
    );
}

function JupiterCouple({
    groom,
    bride,
}: {
    groom: InvitationConfig["couple"]["groom"];
    bride: InvitationConfig["couple"]["bride"];
}) {
    return (
        <section className="relative px-6 py-20">
            <div className="max-w-5xl mx-auto">
                <JupiterSectionHeading title="Bride & Groom" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <JupiterPersonCard
                        label="Mempelai Pria"
                        name={groom.firstName}
                        fullName={groom.fullName}
                        parents={groom.parents}
                        photo={groom.photo}
                        delay={0.35}
                    />
                    <JupiterPersonCard
                        label="Mempelai Wanita"
                        name={bride.firstName}
                        fullName={bride.fullName}
                        parents={bride.parents}
                        photo={bride.photo}
                        delay={0.55}
                    />
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
            <div className="rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden border border-black/10 bg-black/5">
                        <Image src={photo} alt={name} fill sizes="160px" className="object-cover" unoptimized />
                    </div>

                    <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-[#6B5B5B]">{label}</p>
                    <h4 className={`mt-3 ${jupiterScript.className} text-5xl leading-none text-[#1F1B16]`}>{name}</h4>
                    <p className="mt-2 text-sm font-body text-[#1F1B16]">{fullName}</p>
                    <p className="mt-4 text-xs text-[#6B5B5B] whitespace-pre-line">{parents}</p>
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
    const cards = [events.holyMatrimony, events.reception].filter(Boolean);

    return (
        <section className="relative px-6 py-20">
            <div className="max-w-5xl mx-auto">
                <JupiterSectionHeading title={heading || "The Event"} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {cards.map((e, idx) => (
                        <JupiterEventCard
                            key={`${e.title}-${idx}`}
                            title={e.title}
                            date={e.date}
                            time={e.time}
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
    time,
    venue,
    address,
    mapUrl,
    delay,
}: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
    delay: number;
}) {
    return (
        <JupiterReveal direction="up" width="100%" delay={delay}>
            <div className="rounded-[2.25rem] overflow-hidden border border-black/10 bg-white/70 backdrop-blur">
                <div className="relative px-8 pt-12 pb-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            clipPath: "ellipse(70% 52% at 50% 0%)",
                            background:
                                "radial-gradient(circle at 50% 0%, rgba(251,191,36,0.18), transparent 60%), radial-gradient(circle at 20% 20%, rgba(56,189,248,0.10), transparent 65%)",
                        }}
                    />

                    <div className="relative text-center">
                        <h4 className={`${jupiterScript.className} text-5xl leading-none text-[#1F1B16]`}>{title}</h4>

                        <div className="mt-6 space-y-2 text-sm text-[#1F1B16]">
                            {date ? <p className="font-body">{date}</p> : null}
                            {time ? <p className="text-[#6B5B5B]">{time}</p> : null}
                            {venue ? <p className="font-body">{venue}</p> : null}
                            {address ? <p className="text-[#6B5B5B] whitespace-pre-line">{address}</p> : null}
                        </div>

                        {mapUrl ? (
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 inline-flex items-center justify-center w-full rounded-full px-6 py-3 bg-[#0B2F4A] text-white hover:bg-[#082235] transition"
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

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2">
                        <JupiterReveal direction="up" width="100%" delay={0.35}>
                            <div className="relative aspect-[4/5] rounded-[2.25rem] overflow-hidden border border-black/10 bg-white/60">
                                <Image src={photo} alt="story" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                            </div>
                        </JupiterReveal>
                    </div>

                    <div className="lg:col-span-3 space-y-5">
                        {stories.map((s, idx) => (
                            <JupiterReveal key={`${s.date}-${idx}`} direction="up" width="100%" delay={0.45 + idx * 0.15}>
                                <div className="rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-7">
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#6B5B5B]">{s.date}</p>
                                    <p className="mt-4 text-sm md:text-base leading-relaxed text-[#1F1B16] whitespace-pre-line">
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

function JupiterGratitude({ couple, message }: { couple: InvitationConfig["couple"]; message: string }) {
    return (
        <section className="relative px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <JupiterSectionHeading title="Gratitude" />

                <JupiterReveal direction="up" width="100%" delay={0.35}>
                    <div className="rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-10 text-center">
                        <p className="text-sm md:text-base text-[#1F1B16] whitespace-pre-line">
                            {message || "Terima kasih telah menjadi bagian dari momen bahagia kami."}
                        </p>

                        <div className="mt-8">
                            <p className={`text-5xl md:text-6xl leading-none ${jupiterScript.className} text-[#1F1B16]`}>
                                {couple.bride.firstName} & {couple.groom.firstName}
                            </p>
                        </div>

                        <div className="mt-8 mx-auto h-px w-24 bg-black/10" />
                        <p className="mt-8 text-xs tracking-[0.25em] uppercase text-[#6B5B5B]">Dengan cinta</p>
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
                <h3 className={`${jupiterScript.className} text-5xl md:text-6xl leading-none text-[#1F1B16]`}>{title}</h3>
                <div className="mt-5 mx-auto h-px w-24 bg-black/10" />
            </div>
        </JupiterReveal>
    );
}

function JupiterSectionWrap({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="relative px-6 py-20 bg-[#0d0d1f] text-white overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(circle_at_80%_40%,rgba(251,191,36,0.10),transparent_55%)]" />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/55 to-black/75" />
            </div>

            <div className="relative max-w-5xl mx-auto">
                <JupiterReveal direction="up" width="100%">
                    <div className="text-center mb-10">
                        <h3 className={`${jupiterScript.className} text-5xl md:text-6xl leading-none text-white`}>{title}</h3>
                        <div className="mt-5 mx-auto h-px w-24 bg-white/20" />
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
    const [attendance, setAttendance] = useState<AttendanceStatus>("hadir");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasPosted, setHasPosted] = useState(false);
    const [error, setError] = useState("");
    const [existingWish, setExistingWish] = useState<WishDoc | null>(null);
    const [wishes, setWishes] = useState<WishDoc[]>([]);

    const inviteeNameKey = useMemo(() => {
        if (!inviteeName) return null;
        return normalizeNameKey(inviteeName);
    }, [inviteeName]);

    const inviteeWishRef = useMemo(() => {
        if (!inviteeNameKey) return null;
        return doc(db, "wishes", `${invitationId}_${inviteeNameKey}`);
    }, [invitationId, inviteeNameKey]);

    useEffect(() => {
        if (!invitationId) return;

        const q = query(collection(db, "wishes"), where("invitationId", "==", invitationId));
        const unsub = onSnapshot(q, (snapshot) => {
            const next = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WishDoc, "id">) })) as WishDoc[];

            next.sort((a, b) => {
                const aTime = a.createdAt?.toMillis?.() ?? 0;
                const bTime = b.createdAt?.toMillis?.() ?? 0;
                return bTime - aTime;
            });

            setWishes(next);
        });

        return () => unsub();
    }, [invitationId]);

    useEffect(() => {
        const checkExisting = async () => {
            if (!inviteeName || !inviteeWishRef) return;

            const snap = await getDoc(inviteeWishRef);
            if (!snap.exists()) return;

            const wish = { id: snap.id, ...(snap.data() as Omit<WishDoc, "id">) } as WishDoc;
            setExistingWish(wish);
            setHasPosted(true);
        };

        checkExisting();
    }, [inviteeName, inviteeWishRef]);

    const submit = async () => {
        if (!inviteeName || !inviteeNameKey || !inviteeWishRef) {
            setError("Fitur ini hanya tersedia untuk tamu yang mengakses link undangan personal.");
            return;
        }
        if (!message.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const nextData = {
                invitationId,
                name: inviteeName,
                nameKey: inviteeNameKey,
                attendance,
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
                {!inviteeName ? (
                    <div className="text-center">
                        <p className="text-sm text-white/70">Untuk mengisi konfirmasi & ucapan, silakan akses dari link undangan personal.</p>
                    </div>
                ) : hasPosted ? (
                    <div className="text-center">
                        <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">{inviteeName}</p>
                        {existingWish?.attendance ? (
                            <p className="mt-3 text-xs uppercase tracking-[0.25em] font-body text-white">
                                {existingWish.attendance === "hadir" ? "Hadir" : "Tidak Hadir"}
                            </p>
                        ) : null}
                        <p className="mt-4 text-sm text-white">{thankYouMessage}</p>
                        {existingWish?.message ? (
                            <p className="mt-4 text-sm text-white/80 whitespace-pre-line">{existingWish.message}</p>
                        ) : null}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="text-center">
                            <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">Dari</p>
                            <p className="mt-2 text-sm font-body text-white">{inviteeName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAttendance("hadir")}
                                className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "hadir" ? "bg-amber-200 text-[#1F1B16] border-amber-200" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                            >
                                Hadir
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttendance("tidak")}
                                className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "tidak" ? "bg-amber-200 text-[#1F1B16] border-amber-200" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                            >
                                Tidak
                            </button>
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
                            className="rounded-full px-6 py-3 bg-amber-200 text-[#1F1B16] hover:bg-amber-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    wishes.map((w, idx) => (
                        <JupiterReveal key={w.id} width="100%" direction="up" delay={0.35 + idx * 0.08}>
                            <div className="rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs tracking-[0.35em] uppercase text-white/60 font-body">{w.name}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            {w.attendance ? (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-body border ${w.attendance === "tidak" ? "bg-white/5 text-white border-white/10" : "bg-amber-200 text-[#1F1B16] border-amber-200"}`}
                                                >
                                                    {w.attendance === "tidak" ? "Tidak" : "Hadir"}
                                                </span>
                                            ) : null}
                                            <span className="text-[10px] text-white/40 uppercase tracking-[0.25em] font-body">
                                                {w.createdAt?.toDate ? formatDistanceToNow(w.createdAt.toDate(), { addSuffix: true }) : "Baru saja"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-white/85 whitespace-pre-line">{w.message}</p>
                            </div>
                        </JupiterReveal>
                    ))
                )}
            </div>
        </div>
    );
}

function JupiterFooter({ couple }: { couple: InvitationConfig["couple"] }) {
    const names = `${couple.bride.firstName} & ${couple.groom.firstName}`;

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
        <footer className="relative mt-0 overflow-hidden bg-[#070712] border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent)]" />
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
                            className="absolute rounded-full bg-white"
                            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
                            animate={{ opacity: [s.opacity, Math.min(1, s.opacity + 0.55), s.opacity], scale: [1, 1.35, 1] }}
                            transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
                        />
                    ))}
                </motion.div>

                <motion.div
                    className="absolute left-1/2 top-[42%] w-[540px] h-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-4 left-1/2 w-3 h-3 -translate-x-1/2 bg-amber-200/80 rounded-full blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.55)]" />
                </motion.div>

                <motion.div
                    className="absolute left-[72%] top-[62%] w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 54, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute bottom-6 left-10 w-2 h-2 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
                </motion.div>

                <div className="absolute -bottom-56 left-1/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute -top-56 left-3/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

                <motion.div
                    className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
                    animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", repeatDelay: 4.2 }}
                    style={{ transform: "rotate(18deg)" }}
                />
            </div>

            <div className="relative px-6 py-14">
                <div className="max-w-3xl mx-auto text-center text-white">
                    <JupiterReveal direction="up" width="100%" delay={0.25} className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-[gradient_4s_linear_infinite]" />
                            <span className="relative w-2 h-2 rounded-full bg-amber-200 animate-pulse shadow-[0_0_10px_#fbbf24]" />
                            <span className="relative">{names}</span>
                        </div>
                    </JupiterReveal>

                    <JupiterReveal direction="up" width="100%" delay={0.75}>
                        <h3 className={`${jupiterScript.className} mt-7 text-5xl md:text-6xl leading-none text-white`}>Terima kasih</h3>
                        <p className="mt-4 text-sm text-white/70">Sampai jumpa di hari bahagia kami.</p>
                    </JupiterReveal>

                    <JupiterReveal direction="up" width="100%" delay={1.05}>
                        <p className="mt-10 text-xs tracking-[0.25em] uppercase text-white/35 font-body">
                            ACTIVID.ID // {new Date().getFullYear()}
                        </p>
                    </JupiterReveal>
                </div>
            </div>
        </footer>
    );
}
