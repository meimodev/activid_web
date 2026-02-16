"use client";

import { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Allura, Plus_Jakarta_Sans } from "next/font/google";
import {
    HeaderIntroBackground,
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
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, onSnapshot, query, runTransaction, Timestamp, where } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

interface Venus1Props {
    config: InvitationConfig;
}

const venusBody = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-venus-body",
    weight: ["200", "300", "400", "500", "600", "700"],
});

const venusScript = Allura({
    subsets: ["latin"],
    weight: ["400"],
});

function VenusReveal(props: ComponentProps<typeof RevealOnScroll>) {
    const { delay, duration, distance, ...rest } = props;

    return (
        <RevealOnScroll
            delay={delay ?? 0.45}
            duration={duration ?? 2.2}
            distance={distance ?? 70}
            margin="-15%"
            {...rest}
        />
    );
}

type NavSectionId = "home" | "couple" | "event" | "story" | "gallery" | "gift" | "wishes";

export function Venus1({ config }: Venus1Props) {
    const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
    const [contentReady, setContentReady] = useState(() => !config.sections.hero.enabled);
    const [activeSection, setActiveSection] = useState<NavSectionId>("home");

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Convert Dropbox "dl=1" or "dl=0" to "raw=1" for reliable streaming
    const audioStreamUrl = useMemo(() => config.music.url.replace(/dl=[01]/, "raw=1"), [config.music.url]);

    const persistentBackgroundPhotos = useMemo(() => {
        const hero = config.sections.hero.coverImage ? [config.sections.hero.coverImage] : [];
        const gallery = config.sections.gallery.photos;
        const backgrounds = config.backgroundPhotos;
        return Array.from(new Set([...hero, ...gallery, ...backgrounds])).filter(Boolean);
    }, [config.backgroundPhotos, config.sections.gallery.photos, config.sections.hero.coverImage]);

    const quoteBackgroundImage = useMemo(() => {
        if (persistentBackgroundPhotos.length >= 2) return persistentBackgroundPhotos[1];
        return persistentBackgroundPhotos[0] || config.sections.hero.coverImage;
    }, [config.sections.hero.coverImage, persistentBackgroundPhotos]);

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

    const navItems = useMemo(
        () =>
            [
                { id: "home" as const, label: "Cover", icon: <IconHome /> },
                { id: "couple" as const, label: "Couple", icon: <IconCouple /> },
                { id: "event" as const, label: "Event", icon: <IconCalendar /> },
                { id: "gallery" as const, label: "Gallery", icon: <IconGallery /> },
                { id: "wishes" as const, label: "Wishes", icon: <IconChat /> },
            ],
        []
    );

    useEffect(() => {
        if (!isOpen || !contentReady) return;

        // Attempt to autoplay once the invitation is opened (user just interacted)
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }

        const ids: NavSectionId[] = ["home", "couple", "event", "story", "gallery", "gift", "wishes"];
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

    return (
        <main
            className={`relative min-h-screen overflow-x-hidden bg-[#F8F4EC] text-[#2B2424] font-body ${venusBody.variable} [--font-body:var(--font-venus-body)]`}
        >
            {isOpen && persistentBackgroundPhotos.length > 0 ? (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <BackgroundSlideshow photos={persistentBackgroundPhotos} />
                    <div className="absolute inset-0 bg-black/45" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/65" />
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
                    <CoverOverlay
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
                    <div id="home" className="scroll-mt-24" />

                    <HeaderIntro couple={config.couple} isOpen={isOpen} />

                    {config.sections.quote.enabled && (
                        <QuoteBlock
                            text={config.sections.quote.text}
                            targetDate={config.weddingDate.countdownTarget}
                            backgroundImage={quoteBackgroundImage}
                        />
                    )}

                    {config.sections.couple.enabled && (
                        <SectionWrap id="couple" title="Milea & Dilan">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <PersonCard
                                    variant="groom"
                                    name={config.couple.groom.firstName}
                                    fullName={config.couple.groom.fullName}
                                    meta={config.couple.groom.role}
                                    parents={config.couple.groom.parents}
                                    photo={config.couple.groom.photo}
                                    revealDelay={0.55}
                                />
                                <PersonCard
                                    variant="bride"
                                    name={config.couple.bride.firstName}
                                    fullName={config.couple.bride.fullName}
                                    meta={config.couple.bride.role}
                                    parents={config.couple.bride.parents}
                                    photo={config.couple.bride.photo}
                                    revealDelay={1.15}
                                />
                            </div>
                        </SectionWrap>
                    )}

                    {config.sections.event.enabled && (
                        <SectionWrap id="event" title={config.sections.event.heading || "Event"}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {events.map((e, idx) => (
                                    <EventCard
                                        key={e.key}
                                        title={e.title}
                                        date={e.date}
                                        time={e.time}
                                        venue={e.venue}
                                        address={e.address}
                                        mapUrl={e.mapUrl}
                                        revealDelay={0.45 + idx * 0.55}
                                    />
                                ))}
                            </div>
                        </SectionWrap>
                    )}

                    {config.sections.story.enabled && (
                        <SectionWrap id="story" title={config.sections.story.heading || "Story"}>
                            <div className="space-y-10">
                                {config.sections.story.stories.map((s, idx) => (
                                    <StoryItem
                                        key={`${s.date}-${idx}`}
                                        date={s.date}
                                        description={s.description}
                                        revealDelay={0.45 + idx * 0.55}
                                    />
                                ))}
                            </div>
                        </SectionWrap>
                    )}

                    {config.sections.gallery.enabled && (
                        <SectionWrap id="gallery" title={config.sections.gallery.heading || "Gallery"}>
                            <GalleryGrid photos={config.sections.gallery.photos} />
                        </SectionWrap>
                    )}

                    {config.sections.gift.enabled && (
                        <SectionWrap id="gift" title={config.sections.gift.heading || "Wedding Gift"}>
                            <GiftBlock
                                bankAccounts={config.sections.gift.bankAccounts}
                                description={config.sections.gift.description}
                                templateName={config.templateId ?? "venus-1"}
                                eventDate={config.weddingDate.display}
                            />
                        </SectionWrap>
                    )}

                    {(config.sections.wishes.enabled || config.sections.rsvp.enabled) && (
                        <SectionWrap id="wishes" title={config.sections.wishes.heading || "Wishes"}>
                            <WishesFirestore
                                invitationId={config.id}
                                inviteeName={inviteeName}
                                placeholder={config.sections.wishes.placeholder}
                                thankYouMessage={
                                    config.sections.wishes.thankYouMessage || "Terima kasih atas konfirmasi dan ucapannya."
                                }
                            />
                        </SectionWrap>
                    )}

                    <FooterMark couple={config.couple} />

                    {isOpen && (
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
                    )}
                </div>
            ) : null}
        </main>
    );
}

function CoverOverlay({
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
        <div className="relative h-screen w-full overflow-hidden bg-[#2B2424] text-white">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
            >
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/70" />
            </div>

            <div className="relative z-10 h-full max-w-xl mx-auto px-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <p className="text-xs tracking-[0.35em] uppercase opacity-90 font-body">
                        {subtitle || "The Wedding Of"}
                    </p>

                    <h1 className={`mt-6 ${venusScript.className} text-6xl md:text-7xl leading-none`}>
                        {couple.bride.firstName}
                    </h1>
                    <div className="mt-2 mb-2 text-3xl opacity-90">&</div>
                    <h1 className={`${venusScript.className} text-6xl md:text-7xl leading-none`}>
                        {couple.groom.firstName}
                    </h1>

                    <div className="mt-8 w-full max-w-sm border border-white/30 bg-white/10 backdrop-blur-md rounded-2xl p-5">
                        <p className="text-xs opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                        <p className="mt-1 text-lg font-body tracking-wide">{guestName}</p>
                    </div>

                    <button
                        onClick={onOpen}
                        className="mt-10 inline-flex items-center justify-center rounded-full px-8 py-3 bg-white text-[#2B2424] hover:bg-white/90 active:scale-[0.99] transition"
                    >
                        <span className="text-xs uppercase tracking-[0.25em] font-body">Buka Undangan</span>
                    </button>

                    <p className="mt-10 text-xs tracking-widest opacity-80">{date}</p>
                </motion.div>
            </div>
        </div>
    );
}

function HeaderIntro({
    couple,
    isOpen,
}: {
    couple: InvitationConfig["couple"];
    isOpen: boolean;
}) {
    const subtitle = "The Wedding Of";

    const itemHidden = {
        opacity: 0,
        y: 18,
        filter: "blur(10px)",
    };

    const itemShow = {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
    };

    const lineHidden = {
        opacity: 0,
        y: 22,
        clipPath: "inset(0 0 100% 0)",
    };

    const lineShow = {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
    };

    const words = useMemo(() => subtitle.split(" "), [subtitle]);
    const baseDelay = 0.35;
    const wordStep = 0.28;
    const afterWordsDelay = baseDelay + words.length * wordStep + 0.3;

    return (
        <section className="relative min-h-screen px-6 overflow-hidden">
            <HeaderIntroBackground />

            <div className="relative z-10 min-h-screen max-w-3xl mx-auto flex items-center justify-center text-center text-white">
                <div>
                    <p className="text-[11px] tracking-[0.35em] uppercase text-white/80 font-body">
                        {words.map((w, idx) => (
                            <motion.span
                                key={`${w}-${idx}`}
                                className="inline-block mr-[0.6em]"
                                initial={itemHidden}
                                animate={isOpen ? itemShow : itemHidden}
                                transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: baseDelay + idx * wordStep }}
                            >
                                {w}
                            </motion.span>
                        ))}
                    </p>

                    <motion.h2
                        className={`mt-6 ${venusScript.className} text-6xl md:text-7xl leading-none`}
                        initial={lineHidden}
                        animate={isOpen ? lineShow : lineHidden}
                        transition={{ duration: 1.35, ease: [0.19, 1, 0.22, 1], delay: afterWordsDelay }}
                    >
                        {couple.bride.firstName}
                    </motion.h2>

                    <motion.div
                        className="mt-2 mb-2 text-3xl opacity-90"
                        initial={itemHidden}
                        animate={isOpen ? itemShow : itemHidden}
                        transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1], delay: afterWordsDelay + 1.1 }}
                    >
                        &
                    </motion.div>

                    <motion.h2
                        className={`${venusScript.className} text-6xl md:text-7xl leading-none`}
                        initial={lineHidden}
                        animate={isOpen ? lineShow : lineHidden}
                        transition={{ duration: 1.35, ease: [0.19, 1, 0.22, 1], delay: afterWordsDelay + 1.55 }}
                    >
                        {couple.groom.firstName}
                    </motion.h2>

                    <motion.div
                        className="mt-10 mx-auto h-px w-24 bg-white/35"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={isOpen ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                        transition={{ duration: 1.25, ease: [0.19, 1, 0.22, 1], delay: afterWordsDelay + 3.05 }}
                        style={{ transformOrigin: "center" }}
                    />
                </div>
            </div>
        </section>
    );
}

function QuoteBlock({
    text,
    targetDate,
    backgroundImage,
}: {
    text: string;
    targetDate: string;
    backgroundImage: string;
}) {
    return (
        <section className="relative min-h-screen px-6 py-14">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/60" />
            <div className="absolute bottom-8 right-6 z-10">
                <CountdownVertical targetDate={targetDate} stagger revealDelay={1.25} />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto min-h-[calc(100vh-7rem)]">
                <div className="pt-6 md:pt-10">
                    <VenusReveal direction="up" width="100%" delay={0.55}>
                        <p className="text-center text-white/95 text-sm md:text-base leading-relaxed">
                            {text}
                        </p>
                    </VenusReveal>
                </div>
            </div>
        </section>
    );
}

function CountdownVertical({
    targetDate,
    stagger,
    revealDelay,
}: {
    targetDate: string;
    stagger?: boolean;
    revealDelay?: number;
}) {
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

    const items = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
    ];

    return (
        <div className="flex flex-col gap-2 items-end">
            {items.map((it, idx) => {
                const cardNode = (
                    <div className="text-center px-4 py-3 rounded-2xl border border-black/10 bg-white/60 backdrop-blur min-w-[88px]">
                        <div className="font-body text-2xl leading-none text-[#2B2424]">{it.value}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#6B5B5B] font-body">
                            {it.label}
                        </div>
                    </div>
                );

                if (!stagger) return <div key={it.label}>{cardNode}</div>;

                return (
                    <VenusReveal
                        key={it.label}
                        direction="up"
                        width="fit-content"
                        delay={(revealDelay ?? 0) + 0.25 + idx * 0.25}
                    >
                        {cardNode}
                    </VenusReveal>
                );
            })}
        </div>
    );
}

function SectionWrap({
    id,
    title,
    children,
}: {
    id: NavSectionId;
    title: string;
    children: React.ReactNode;
}) {
    const maskBackground = id === "event" || id === "gallery" || id === "gift" || id === "wishes";
    const isOverPhoto = !maskBackground;

    return (
        <section id={id} className="relative scroll-mt-24 py-14 px-6">
            {maskBackground ? <div className="absolute inset-0 bg-[#F8F4EC]" /> : null}
            <div className="max-w-5xl mx-auto">
                <VenusReveal direction="up" width="100%">
                    <div className="text-center mb-10">
                        <h3
                            className={`${venusScript.className} text-5xl md:text-6xl leading-none ${isOverPhoto ? "text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.75)]" : "text-[#2B2424]"}`}
                        >
                            {title}
                        </h3>
                        <div className={`mt-5 mx-auto h-px w-24 ${isOverPhoto ? "bg-white/35" : "bg-black/15"}`} />
                    </div>
                </VenusReveal>

                {children}
            </div>
        </section>
    );
}

function PersonCard({
    variant,
    name,
    fullName,
    meta,
    parents,
    photo,
    revealDelay,
}: {
    variant: "groom" | "bride";
    name: string;
    fullName: string;
    meta: string;
    parents: string;
    photo: string;
    revealDelay?: number;
}) {
    return (
        <VenusReveal direction="up" width="100%" delay={revealDelay}>
            <div className="rounded-3xl overflow-hidden border border-black/10 bg-white/60 backdrop-blur">
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/5 relative">
                    <Image
                        src={photo}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                        priority={false}
                    />
                </div>
                <div className="p-6 text-center">
                    <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">
                        {variant === "groom" ? "Mempelai Pria" : "Mempelai Wanita"}
                    </p>
                    <h4 className={`mt-3 ${venusScript.className} text-4xl text-[#2B2424]`}>{name}</h4>
                    <p className="mt-2 font-body text-sm text-[#2B2424]">{fullName}</p>
                    <p className="mt-3 text-xs text-[#6B5B5B]">{parents}</p>
                    {meta ? <p className="mt-4 text-xs tracking-[0.25em] uppercase text-[#6B5B5B]">{meta}</p> : null}
                </div>
            </div>
        </VenusReveal>
    );
}

function EventCard({
    title,
    date,
    time,
    venue,
    address,
    mapUrl,
    revealDelay,
}: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
    revealDelay?: number;
}) {
    const isLinkOnly = Boolean(mapUrl) && (!address && !time && !date);

    return (
        <VenusReveal direction="up" width="100%" delay={revealDelay}>
            <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-6">
                <div className="text-center">
                    <h4 className={`${venusScript.className} text-4xl leading-none text-[#2B2424]`}>
                        {title}
                    </h4>

                    {!isLinkOnly && (
                        <div className="mt-5 space-y-2 text-sm text-[#3A2F2F]">
                            {date ? <p className="font-body">{date}</p> : null}
                            {time ? <p className="text-[#6B5B5B]">{time}</p> : null}
                            {venue ? <p className="font-body">{venue}</p> : null}
                            {address ? <p className="text-[#6B5B5B] whitespace-pre-line">{address}</p> : null}
                        </div>
                    )}

                    {mapUrl ? (
                        <a
                            href={mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-6 inline-flex items-center justify-center w-full rounded-full px-5 py-3 border border-black/10 bg-white/60 hover:bg-white transition"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] font-body text-[#2B2424]">
                                {title.toLowerCase().includes("live") || title.toLowerCase().includes("stream") ? "Open Link" : "Google Map"}
                            </span>
                        </a>
                    ) : null}
                </div>
            </div>
        </VenusReveal>
    );
}

function StoryItem({
    date,
    description,
    revealDelay,
}: {
    date: string;
    description: string;
    revealDelay?: number;
}) {
    return (
        <VenusReveal direction="up" width="100%" delay={revealDelay}>
            <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-7">
                <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">{date}</p>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-[#3A2F2F] whitespace-pre-line">
                    {description}
                </p>
            </div>
        </VenusReveal>
    );
}

function GalleryGrid({ photos }: { photos: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<1 | -1>(1);

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
        [total]
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

    const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {display.map((p, idx) => (
                    <VenusReveal key={`${p}-${idx}`} delay={0.45 + idx * 0.12} width="100%">
                        <button
                            type="button"
                            onClick={() => {
                                setDirection(1);
                                setSelectedIndex(idx);
                            }}
                            className="group relative w-full aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/50"
                        >
                            <Image
                                src={p}
                                alt="Gallery"
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                        </button>
                    </VenusReveal>
                ))}
            </div>

            <AnimatePresence>
                {selected && selectedIndex !== null && total > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-white/85">
                                <a
                                    href={selected}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs tracking-[0.25em] uppercase font-body hover:text-white"
                                >
                                    Download
                                </a>
                                <span className="text-xs tracking-[0.25em] uppercase font-body">
                                    {selectedIndex + 1} / {total}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex(null)}
                                    className="text-xs tracking-[0.25em] uppercase font-body hover:text-white"
                                >
                                    Close
                                </button>
                            </div>

                            {total > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => paginate(-1)}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
                                        aria-label="Previous image"
                                    >
                                        <span className="text-2xl leading-none">‹</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => paginate(1)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
                                        aria-label="Next image"
                                    >
                                        <span className="text-2xl leading-none">›</span>
                                    </button>
                                </>
                            ) : null}

                            <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden bg-black/20">
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
}: {
    bankAccounts: InvitationConfig["sections"]["gift"]["bankAccounts"];
    description: string;
    templateName: string;
    eventDate: string;
}) {
    const [copied, setCopied] = useState<string | null>(null);
    const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);

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
                <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-7">
                    <p className="text-sm text-[#6B5B5B] text-center whitespace-pre-line">{description}</p>
                </div>
            ) : null}

            <VenusReveal direction="up" width="100%">
                <button
                    type="button"
                    onClick={() => setIsGiftDialogOpen(true)}
                    className="w-full inline-flex items-center justify-center rounded-full px-6 py-3 bg-[#2B2424] text-white hover:bg-black transition"
                >
                    <span className="text-xs uppercase tracking-[0.25em] font-body">Kirim Hadiah</span>
                </button>
            </VenusReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankAccounts.map((b, idx) => (
                    <VenusReveal key={`${b.bankName}-${idx}`} direction="up" width="100%" delay={0.45 + idx * 0.55}>
                        <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-7 text-center">
                            <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">{b.bankName}</p>
                            <p className="mt-4 text-sm font-body text-[#2B2424]">{b.accountHolder}</p>
                            <p className="mt-2 text-2xl tracking-wide text-[#2B2424]">{b.accountNumber}</p>
                            <button
                                type="button"
                                onClick={() => copy(b.accountNumber, `${b.bankName}-${idx}`)}
                                className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 border border-black/10 bg-white/70 hover:bg-white transition w-full"
                            >
                                <span className="text-xs uppercase tracking-[0.25em] font-body">
                                    {copied === `${b.bankName}-${idx}` ? "Tersalin" : "Salin Rekening"}
                                </span>
                            </button>
                        </div>
                    </VenusReveal>
                ))}
            </div>


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
                            <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">Info</p>
                            <h4 className={`mt-3 ${venusScript.className} text-4xl leading-none text-[#2B2424]`}>
                                Exclusive Discount
                            </h4>
                            <p className="mt-4 text-sm text-[#3A2F2F]">
                                Anda akan mendapatkan exclusive discount hingga <span className="font-body text-[#2B2424]">25%</span> untuk pemesanan hadiah dari link ini. &quot;Chat WhatsApp&quot; untuk informasi lebih lanjut.
                            </p>

                            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsGiftDialogOpen(false)}
                                    className="rounded-full px-6 py-3 border border-black/10 bg-white/70 hover:bg-white transition"
                                >
                                    <span className="text-xs uppercase tracking-[0.25em] font-body">Tutup</span>
                                </button>

                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full px-6 py-3 bg-[#2B2424] text-white hover:bg-black transition text-center"
                                >
                                    <span className="text-xs uppercase tracking-[0.25em] font-body">Chat WhatsApp</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
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
            <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-7">
                {!inviteeName ? (
                    <div className="text-center">
                        <p className="text-sm text-[#6B5B5B]">Untuk mengisi konfirmasi & ucapan, silakan akses dari link undangan personal.</p>
                    </div>
                ) : hasPosted ? (
                    <div className="text-center">
                        <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">{inviteeName}</p>
                        {existingWish?.attendance ? (
                            <p className="mt-3 text-xs uppercase tracking-[0.25em] font-body text-[#2B2424]">
                                {existingWish.attendance === "hadir" ? "Hadir" : "Tidak Hadir"}
                            </p>
                        ) : null}
                        <p className="mt-4 text-sm text-[#2B2424]">{thankYouMessage}</p>
                        {existingWish?.message ? (
                            <p className="mt-4 text-sm text-[#3A2F2F] whitespace-pre-line">{existingWish.message}</p>
                        ) : null}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="text-center">
                            <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">Dari</p>
                            <p className="mt-2 text-sm font-body text-[#2B2424]">{inviteeName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setAttendance("hadir")}
                                className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "hadir" ? "bg-[#2B2424] text-white border-[#2B2424]" : "bg-white/70 text-[#2B2424] border-black/10 hover:bg-white"}`}
                            >
                                Hadir
                            </button>
                            <button
                                type="button"
                                onClick={() => setAttendance("tidak")}
                                className={`rounded-2xl px-4 py-3 text-xs uppercase tracking-[0.25em] font-body border transition ${attendance === "tidak" ? "bg-[#2B2424] text-white border-[#2B2424]" : "bg-white/70 text-[#2B2424] border-black/10 hover:bg-white"}`}
                            >
                                Tidak
                            </button>
                        </div>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={placeholder || "Tuliskan pesanmu"}
                            className="w-full min-h-28 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                            disabled={isSubmitting}
                        />

                        {error ? <p className="text-center text-xs text-red-600">{error}</p> : null}

                        <button
                            type="button"
                            onClick={submit}
                            disabled={isSubmitting || !message.trim()}
                            className="rounded-full px-6 py-3 bg-[#2B2424] text-white hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="rounded-3xl border border-black/10 bg-white/40 backdrop-blur p-7 text-center">
                        <p className="text-sm text-[#6B5B5B]">Belum ada ucapan. Jadilah yang pertama.</p>
                    </div>
                ) : (
                    wishes.map((w, idx) => (
                        <VenusReveal key={w.id} width="100%" direction="up" delay={0.35 + idx * 0.18}>
                            <div className="rounded-3xl border border-black/10 bg-white/40 backdrop-blur p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-body">{w.name}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] font-body border ${w.attendance === "tidak" ? "bg-white/60 text-[#2B2424] border-black/10" : "bg-[#2B2424] text-white border-[#2B2424]"}`}
                                            >
                                                {w.attendance === "tidak" ? "Tidak" : "Hadir"}
                                            </span>
                                            <span className="text-[10px] text-[#6B5B5B] uppercase tracking-[0.25em] font-body">
                                                {w.createdAt?.toDate
                                                    ? formatDistanceToNow(w.createdAt.toDate(), { addSuffix: true })
                                                    : "Baru saja"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-[#3A2F2F] whitespace-pre-line">{w.message}</p>
                            </div>
                        </VenusReveal>
                    ))
                )}
            </div>
        </div>
    );
}

function FooterMark({ couple }: { couple: InvitationConfig["couple"] }) {
    const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;

    const stars = useMemo(() => {
        return Array.from({ length: 34 }, (_, i) => {
            const x = (i * 23 + 11) % 100;
            const y = (i * 37 + 19) % 100;
            const size = 1 + ((i * 13) % 3);
            const dur = 2.2 + ((i * 7) % 10) * 0.35;
            const delay = ((i * 5) % 10) * 0.25;
            const opacity = 0.25 + ((i * 11) % 10) * 0.04;
            return { x, y, size, dur, delay, opacity };
        });
    }, []);

    return (
        <footer className="relative mt-8 overflow-hidden bg-[#0d0d1f] border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent)]" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/70" />
            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 origin-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
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
                    className="absolute left-[18%] top-[32%] w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-2 right-10 w-2.5 h-2.5 rounded-full bg-purple-300/70 shadow-[0_0_18px_rgba(192,132,252,0.55)]" />
                </motion.div>

                <motion.div
                    className="absolute left-[82%] top-[58%] w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-indigo-200/80 shadow-[0_0_18px_rgba(165,180,252,0.55)]" />
                </motion.div>

                <motion.div
                    className="absolute left-1/2 top-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" />
                    <div className="absolute bottom-8 left-10 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
                </motion.div>

                <motion.div
                    className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
                    animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 3.2 }}
                    style={{ transform: "rotate(18deg)" }}
                />

                <motion.div
                    className="absolute top-[10%] left-[-25%] w-[45%] h-[2px] bg-linear-to-r from-transparent via-cyan-200/80 to-transparent opacity-0"
                    animate={{ x: ["0%", "240%"], y: ["0%", "140%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 5.5, delay: 1.8 }}
                    style={{ transform: "rotate(14deg)" }}
                />

                <motion.div
                    className="absolute top-[35%] left-[-35%] w-[65%] h-[2px] bg-linear-to-r from-transparent via-purple-200/70 to-transparent opacity-0"
                    animate={{ x: ["0%", "220%"], y: ["0%", "90%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", repeatDelay: 6.2, delay: 4.1 }}
                    style={{ transform: "rotate(22deg)" }}
                />

                <motion.div
                    className="absolute -bottom-40 left-1/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
                    animate={{ x: [0, 26, 0], y: [0, -18, 0], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    className="absolute -top-56 left-3/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"
                    animate={{ x: [0, -22, 0], y: [0, 24, 0], opacity: [0.25, 0.5, 0.25] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="relative px-6 py-12 md:py-14">
                <div className="max-w-3xl mx-auto text-center text-white">
                    <VenusReveal direction="up" width="100%" delay={0.25} className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-300 backdrop-blur-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent animate-[gradient_4s_linear_infinite]" />
                            <span className="relative w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                            <span className="relative">{names}</span>
                        </div>
                    </VenusReveal>

                    <VenusReveal direction="up" width="100%" delay={0.75}>
                        <h3
                            className={`mt-4 ${venusScript.className} text-5xl md:text-6xl bg-linear-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]`}
                            style={{ textShadow: "0 0 40px rgba(79, 70, 229, 0.4)", WebkitBackgroundClip: "text" }}
                        >
                            Misi selesai
                        </h3>
                    </VenusReveal>

                    <VenusReveal direction="up" width="100%" delay={1.25}>
                        <p className="mt-4 text-sm md:text-base text-indigo-200/70 font-light leading-relaxed">
                            Terima kasih sudah menjelajah bersama <br />Activid Invitation
                        </p>
                    </VenusReveal>

                    <VenusReveal direction="up" width="100%" delay={1.75}>
                        <div className="mt-7 flex items-center justify-center">
                            <a
                                href="https://invitation.activid.id"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-200 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.35)]"
                            >
                                <span className="uppercase tracking-[0.25em]">Kembali Pulang 🚀</span>
                            </a>
                        </div>
                    </VenusReveal>

                    <VenusReveal direction="up" width="100%" delay={2.25}>
                        <div className="mt-10 h-px w-full bg-white/10" />
                    </VenusReveal>

                    <VenusReveal direction="up" width="100%" delay={2.55}>
                        <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-white/40 font-body">
                            © {new Date().getFullYear()} Activid Invitation
                        </p>
                    </VenusReveal>
                </div>
            </div>
        </footer>
    );
}

function FloatingNav({
    items,
    active,
    onSelect,
    right,
}: {
    items: Array<{ id: NavSectionId; label: string; icon: React.ReactNode }>;
    active: NavSectionId;
    onSelect: (id: NavSectionId) => void;
    right?: React.ReactNode;
}) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110]">
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur px-2 py-2 shadow-xl">
                {items.map((it) => {
                    const isActive = active === it.id;
                    return (
                        <button
                            key={it.id}
                            type="button"
                            onClick={() => onSelect(it.id)}
                            className={`h-11 w-11 rounded-full flex items-center justify-center transition border ${isActive ? "bg-[#2B2424] text-white border-[#2B2424]" : "bg-white/60 text-[#2B2424] border-black/10 hover:bg-white"}`}
                            aria-label={it.label}
                        >
                            <span className="sr-only">{it.label}</span>
                            {it.icon}
                        </button>
                    );
                })}

                {right ? <div className="mx-1 h-8 w-px bg-black/10" /> : null}
                {right}
            </div>
        </div>
    );
}
