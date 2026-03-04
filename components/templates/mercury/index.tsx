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
import { GratitudeSection } from "./GratitudeSection";
import { TitleSection } from "./TitleSection";
import { CoupleSection } from "./CoupleSection";
import { EventSection } from "./EventSection";
import { GiftSection } from "./GiftSection";
import { FooterSection } from "./FooterSection";
import { InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";
import {
    DEMO_BRIDE_PROFILE_IMAGE_URL,
    DEMO_COVER_IMAGE_URL,
    DEMO_GALLERY_IMAGEKIT_URLS,
    DEMO_GROOM_PROFILE_IMAGE_URL,
} from "@/data/invitations";

const MERCURY_DEMO_ASSETS = {
    host1Photo: DEMO_GROOM_PROFILE_IMAGE_URL,
    host2Photo: DEMO_BRIDE_PROFILE_IMAGE_URL,
    coverImage: DEMO_COVER_IMAGE_URL,
    galleryPhotos: DEMO_GALLERY_IMAGEKIT_URLS,
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
        sections
    } = config;

    const hostsSection = sections.hosts;
    const hosts = hostsSection.hosts;
    const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

    const effectiveHosts = isDemo
        ? hosts.map((h, idx) => {
            if (idx === 0) return { ...h, photo: MERCURY_DEMO_ASSETS.host1Photo };
            if (idx === 1) return { ...h, photo: MERCURY_DEMO_ASSETS.host2Photo };
            return h;
        })
        : hosts;

    const effectiveGalleryPhotos = useMemo(
        () => (isDemo ? Array.from(MERCURY_DEMO_ASSETS.galleryPhotos) : (sections.gallery?.photos ?? [])),
        [isDemo, sections.gallery?.photos],
    );
    const effectiveCoverImage = sections.hero.coverImage;

    const derivedPhotos = useMemo(
        () => pickDeterministicRandomSubset(effectiveGalleryPhotos, config.id, 5),
        [config.id, effectiveGalleryPhotos],
    );

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg text-wedding-text font-serif">
            {/* Background Slideshow (Fades out or stays subtle) */}

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
                        date={dateInfo?.displayShort ?? ""}
                        subtitle={sections.hero.subtitle}
                        coverImage={effectiveCoverImage}
                        guestName={guestName || undefined}
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}>
                    {isContentReady && (
                        <>
                            {sections.title.enabled && (
                                <TitleSection
                                    hosts={effectiveHosts}
                                    date={dateInfo?.display ?? ""}
                                    heading={sections.title.heading}
                                    countdownTarget={dateInfo?.countdownTarget ?? ""}
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
                                    eventDate={dateInfo?.display ?? ""}
                                />
                            )}

                            {sections.wishes.enabled && (
                                <Suspense fallback={<div className="py-24 text-center text-stone-400 font-serif italic">Loading Wishes...</div>}>
                                    <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                                </Suspense>
                            )}

                            {sections.gratitude.enabled && (
                                <GratitudeSection hosts={effectiveHosts} message={sections.gratitude.message} />
                            )}

                            {sections.footer.enabled && (
                                <FooterSection hosts={effectiveHosts} message={sections.footer.message} />
                            )}
                        </>
                    )}
            </div>
        </main>
    );
}
