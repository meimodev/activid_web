"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
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
    ConfirmationSection,
    FooterSection
} from "./InfoSections";
import { InvitationConfig } from "@/types/invitation";

interface Mercury1Props {
    config: InvitationConfig;
}

export function Mercury1({ config }: Mercury1Props) {
    const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
    const [isContentReady, setIsContentReady] = useState(() => !config.sections.hero.enabled);
    const searchParams = useSearchParams();
    const guestName = searchParams.get("to");

    const {
        music,
        backgroundPhotos,
        weddingDate,
        couple,
        sections
    } = config;

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-stone-50 text-stone-900 font-serif">
            {/* Background Slideshow (Fades out or stays subtle) */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <BackgroundSlideshow photos={backgroundPhotos} />
            </div>

            <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

            {/* Hero / Cover Section - Fixed Overlay until opened */}
            {sections.hero.enabled && (
                <motion.div
                    className="fixed inset-0 z-50"
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
                        couple={couple}
                        date={weddingDate.displayShort}
                        subtitle={sections.hero.subtitle}
                        coverImage={sections.hero.coverImage}
                        guestName={guestName || undefined}
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isContentReady ? "opacity-100" : "opacity-0 fixed top-0 w-full"}`}>
                {/* Only allow scrolling when content is visible */}
                <div className={isContentReady ? "" : "h-screen overflow-hidden"}>
                    {isContentReady && (
                        <>
                            {sections.title.enabled && (
                                <TitleSection
                                    couple={couple}
                                    date={weddingDate.display}
                                    heading={sections.title.heading}
                                    countdownTarget={weddingDate.countdownTarget}
                                    galleryPhotos={sections.gallery.photos}
                                    showCountdown={sections.countdown.enabled}
                                />
                            )}

                            {sections.quote.enabled && (
                                <QuoteSection quote={sections.quote} />
                            )}

                            {sections.couple.enabled && (
                                <CoupleSection couple={couple} disableGrayscale={sections.couple.disableGrayscale} />
                            )}

                            {sections.story.enabled && (
                                <StorySection
                                    stories={sections.story.stories}
                                    heading={sections.story.heading}
                                    fallbackImageUrl={sections.gallery?.photos?.[0]}
                                />
                            )}

                            {sections.event.enabled && (
                                <EventSection events={sections.event.events} heading={sections.event.heading} />
                            )}

                            {sections.gallery.enabled && (
                                <Gallery photos={sections.gallery.photos} heading={sections.gallery.heading} />
                            )}

                            {sections.rsvp.enabled && (
                                <Suspense fallback={<div className="py-24 text-center text-stone-400 font-serif italic">Loading RSVP...</div>}>
                                    <ConfirmationSection invitationId={config.id} rsvpDeadline={weddingDate.rsvpDeadline} />
                                </Suspense>
                            )}

                            {sections.gift.enabled && (
                                <GiftSection bankAccounts={sections.gift.bankAccounts} heading={sections.gift.heading} description={sections.gift.description} />
                            )}

                            {sections.wishes.enabled && (
                                <Suspense fallback={<div className="py-24 text-center text-stone-400 font-serif italic">Loading Wishes...</div>}>
                                    <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                                </Suspense>
                            )}

                            {sections.footer.enabled && (
                                <FooterSection couple={couple} message={sections.footer.message} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
