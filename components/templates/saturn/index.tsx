"use client";

import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "./Hero";
import { Countdown } from "./Countdown";
import { QuoteSection } from "./QuoteSection";
import { Gallery } from "./Gallery";
import { Wishes } from "./Wishes";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import {
    SaturnRings,
    StarField,
    ShootingStars,
    Nebula
} from "./graphics";
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
import { pickDeterministicRandomSubset } from "@/lib/utils";

interface SaturnProps {
    config: InvitationConfig;
}

export function Saturn({ config }: SaturnProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        music,
        weddingDate,
        sections
    } = config;

    const hosts = config.hosts;
    const hostsSection = sections.hosts;

    const derivedPhotos = useMemo(
        () => pickDeterministicRandomSubset(sections.gallery.photos ?? [], config.id, 5),
        [config.id, sections.gallery.photos],
    );

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#0B0D17]">
            {/* Global Decorations */}
            <StarField />
            <Nebula />
            <SaturnRings />
            <ShootingStars />

            {/* Background Slideshow (Fades out or stays subtle) */}
            <BackgroundSlideshow
                photos={derivedPhotos}
                className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20"
            />

            <MusicPlayer shouldStart={isOpen} audioUrl={music.url} />

            {/* Hero / Cover Section - Fixed Overlay until opened */}
            {sections.hero.enabled && (
                <motion.div
                    className="absolute inset-0 z-50"
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
                        hosts={hosts}
                        date={weddingDate.displayShort}
                        subtitle={sections.hero.subtitle}
                        coverImage={sections.hero.coverImage}
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 absolute top-0 left-0 w-full"}`}>
                {/* Only allow scrolling when open */}
                <div className={isOpen ? "" : "h-screen overflow-hidden"}>
                    {sections.title.enabled && (
                        <TitleSection hosts={hosts} date={weddingDate.display} heading={sections.title.heading} />
                    )}

                    {sections.countdown.enabled && (
                        <Countdown targetDate={weddingDate.countdownTarget} photos={derivedPhotos} heading={sections.countdown.heading} />
                    )}

                    {sections.quote.enabled && (
                        <QuoteSection quote={sections.quote} />
                    )}

                    {hostsSection.enabled && (
                        <CoupleSection hosts={hosts} disableGrayscale={hostsSection.disableGrayscale} />
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
                        <Suspense fallback={<div className="py-24 text-center text-white/50 font-body italic">Loading RSVP...</div>}>
                            <ConfirmationSection invitationId={config.id} rsvpDeadline={weddingDate.rsvpDeadline} />
                        </Suspense>
                    )}

                    {sections.gift.enabled && (
                        <GiftSection bankAccounts={sections.gift.bankAccounts} heading={sections.gift.heading} description={sections.gift.description} />
                    )}

                    {sections.wishes.enabled && (
                        <Suspense fallback={<div className="py-24 text-center text-white/50 font-body italic">Loading Wishes...</div>}>
                            <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                        </Suspense>
                    )}

                    {sections.footer.enabled && (
                        <FooterSection hosts={hosts} message={sections.footer.message} />
                    )}
                </div>
            </div>
        </main>
    );
}
