"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/invitation/Hero";
import { Countdown } from "@/components/invitation/Countdown";
import { QuoteSection } from "@/components/invitation/QuoteSection";
import { Gallery } from "@/components/invitation/Gallery";
import { Wishes } from "@/components/invitation/Wishes";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import {
    FloatingFlowers,
    FloatingSparkles,
    FloatingHearts,
    GoldenRings
} from "@/components/invitation/MoreDecorations";
import { StorySection } from "@/components/invitation/StorySection";
import {
    TitleSection,
    CoupleSection,
    EventSection,
    GiftSection,
    FooterSection,
    ConfirmationSection
} from "@/components/invitation/InfoSections";
import { InvitationConfig } from "@/types/invitation";

interface Flow1Props {
    config: InvitationConfig;
}

export function Flow1({ config }: Flow1Props) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        music,
        backgroundPhotos,
        weddingDate,
        couple,
        sections
    } = config;

    return (
        <main className="relative min-h-screen overflow-x-hidden">
            <BackgroundSlideshow photos={backgroundPhotos} />
            <GoldenRings />
            <FloatingFlowers />
            <FloatingSparkles />
            <FloatingHearts />
            <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

            {/* Hero / Cover Section - Fixed Overlay until opened */}
            {sections.hero.enabled && (
                <motion.div
                    className="fixed inset-0 z-50"
                    initial={false}
                    animate={{
                        y: isOpen ? "-100%" : "0%",
                        transitionEnd: {
                            display: isOpen ? "none" : "block"
                        }
                    }}
                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                >
                    <Hero
                        onOpen={() => setIsOpen(true)}
                        couple={couple}
                        date={weddingDate.displayShort}
                        subtitle={sections.hero.subtitle}
                        coverImage={sections.hero.coverImage}
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 fixed top-0 w-full"}`}>
                {/* Only allow scrolling when open */}
                <div className={isOpen ? "" : "h-screen overflow-hidden"}>
                    {sections.title.enabled && (
                        <TitleSection couple={couple} date={weddingDate.display} heading={sections.title.heading} />
                    )}

                    {sections.countdown.enabled && (
                        <Countdown targetDate={weddingDate.countdownTarget} photos={sections.countdown.photos} heading={sections.countdown.heading} />
                    )}

                    {sections.quote.enabled && (
                        <QuoteSection quote={sections.quote} />
                    )}

                    {sections.couple.enabled && (
                        <CoupleSection couple={couple} disableGrayscale={sections.couple.disableGrayscale} />
                    )}

                    {sections.story.enabled && (
                        <StorySection stories={sections.story.stories} heading={sections.story.heading} />
                    )}

                    {sections.event.enabled && (
                        <EventSection events={sections.event.events} heading={sections.event.heading} />
                    )}

                    {sections.gallery.enabled && (
                        <Gallery photos={sections.gallery.photos} heading={sections.gallery.heading} />
                    )}

                    {sections.rsvp.enabled && (
                        <Suspense fallback={<div className="py-24 text-center text-wedding-text-light font-body italic">Loading RSVP...</div>}>
                            <ConfirmationSection invitationId={config.id} rsvpDeadline={weddingDate.rsvpDeadline} />
                        </Suspense>
                    )}

                    {sections.gift.enabled && (
                        <GiftSection bankAccounts={sections.gift.bankAccounts} heading={sections.gift.heading} description={sections.gift.description} />
                    )}

                    {sections.wishes.enabled && (
                        <Suspense fallback={<div className="py-24 text-center text-wedding-text-light font-body italic">Loading Wishes...</div>}>
                            <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                        </Suspense>
                    )}

                    {sections.footer.enabled && (
                        <FooterSection couple={couple} message={sections.footer.message} />
                    )}
                </div>
            </div>
        </main>
    );
}
