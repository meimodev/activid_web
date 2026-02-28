"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "./Hero";
import { QuoteSection } from "./QuoteSection";
import { Gallery } from "./Gallery";
import { Wishes } from "./Wishes";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import { StorySection } from "./StorySection";
import {
    TitleSection,
    CoupleSection,
    EventSection,
    GiftSection,
    FooterSection
} from "./InfoSections";
import { InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";

const MERCURY_DEMO_ASSETS = {
    host1Photo: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
    host2Photo: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
    coverImage: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1200",
    galleryPhotos: [
        "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/313707/pexels-photo-313707.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/2959196/pexels-photo-2959196.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
} as const;

interface MercuryProps {
    config: InvitationConfig;
}

export function Mercury({ config }: MercuryProps) {
    const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
    const [isContentReady, setIsContentReady] = useState(() => !config.sections.hero.enabled);
    const searchParams = useSearchParams();
    const guestName = searchParams.get("to");

    const isDemo = config.id.endsWith("-demo");

    const {
        music,
        weddingDate,
        sections
    } = config;

    const hosts = config.hosts;
    const hostsSection = sections.hosts;

    const effectiveHosts = isDemo
        ? hosts.map((h, idx) => {
            if (idx === 0) return { ...h, photo: MERCURY_DEMO_ASSETS.host1Photo };
            if (idx === 1) return { ...h, photo: MERCURY_DEMO_ASSETS.host2Photo };
            return h;
        })
        : hosts;

    const effectiveGalleryPhotos = isDemo
        ? [...MERCURY_DEMO_ASSETS.galleryPhotos]
        : (sections.gallery?.photos ?? []);
    const effectiveCoverImage = isDemo ? MERCURY_DEMO_ASSETS.coverImage : sections.hero.coverImage;

    const derivedPhotos = useMemo(
        () => pickDeterministicRandomSubset(effectiveGalleryPhotos, config.id, 5),
        [config.id, effectiveGalleryPhotos],
    );

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-stone-50 text-stone-900 font-serif">
            {/* Background Slideshow (Fades out or stays subtle) */}
            <BackgroundSlideshow
                photos={derivedPhotos}
                className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10"
            />

            <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

            {/* Hero / Cover Section - Fixed Overlay until opened */}
            {sections.hero.enabled && (
                <motion.div
                    className="absolute inset-0 z-50"
                    initial={false}
                    animate={{
                        opacity: isOpen ? 0 : 1,
                        transitionEnd: {
                            display: isOpen ? "none" : "block"
                        }
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
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}>
                {/* Only allow scrolling when content is visible */}
                <div className={isContentReady ? "" : "h-screen overflow-hidden"}>
                    {isContentReady && (
                        <>
                            {sections.title.enabled && (
                                <TitleSection
                                    hosts={effectiveHosts}
                                    date={weddingDate.display}
                                    heading={sections.title.heading}
                                    countdownTarget={weddingDate.countdownTarget}
                                    galleryPhotos={effectiveGalleryPhotos}
                                    showCountdown={sections.countdown.enabled}
                                />
                            )}

                            {sections.quote.enabled && (
                                <QuoteSection quote={sections.quote} />
                            )}

                            {hostsSection.enabled && (
                                <CoupleSection hosts={effectiveHosts} />
                            )}

                            {sections.story.enabled && (
                                <StorySection
                                    stories={sections.story.stories}
                                    heading={sections.story.heading}
                                    fallbackImageUrl={effectiveGalleryPhotos[0]}
                                />
                            )}

                            {sections.event.enabled && (
                                <EventSection events={sections.event.events} heading={sections.event.heading} />
                            )}

                            {sections.gallery.enabled && (
                                <Gallery photos={effectiveGalleryPhotos} heading={sections.gallery.heading} />
                            )}

                            {sections.gift.enabled && (
                                <GiftSection
                                    bankAccounts={sections.gift.bankAccounts}
                                    heading={sections.gift.heading}
                                    description={sections.gift.description}
                                    templateName={config.templateId || "mercury"}
                                    eventDate={weddingDate.display}
                                />
                            )}

                            {sections.wishes.enabled && (
                                <Suspense fallback={<div className="py-24 text-center text-stone-400 font-serif italic">Loading Wishes...</div>}>
                                    <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                                </Suspense>
                            )}

                            {sections.footer.enabled && (
                                <FooterSection hosts={effectiveHosts} message={sections.footer.message} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
