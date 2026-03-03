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
    Nebula,
    AuroraOrbs
} from "./graphics";
import { StorySection } from "./StorySection";
import { TitleSection } from "./TitleSection";
import { HostsSection } from "./CoupleSection";
import { EventSection } from "./EventSection";
import { GiftSection } from "./GiftSection";
import { ConfirmationSection } from "./ConfirmationSection";
import { GratitudeSection } from "./GratitudeSection";
import { FooterSection } from "./FooterSection";
import { InvitationConfig } from "@/types/invitation";
import { pickDeterministicRandomSubset } from "@/lib/utils";
import { deriveInvitationPrimaryDateInfo } from "@/lib/date-time";

interface SaturnProps {
    config: InvitationConfig;
}

export function Saturn({ config }: SaturnProps) {
    const [isOpen, setIsOpen] = useState(false);

    const purpose = config.purpose;

    const {
        music,
        sections
    } = config;

    const hostsSection = sections.hosts;
    const hosts = hostsSection.hosts;
    const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

    const derivedPhotos = useMemo(
        () => pickDeterministicRandomSubset(sections.gallery.photos ?? [], config.id, 5),
        [config.id, sections.gallery.photos],
    );

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-wedding-bg">
            {/* Global Decorations */}
            <StarField />
            <AuroraOrbs />
            <Nebula />
            <SaturnRings />

            {/* Background Slideshow (Fades out or stays subtle) */}
            <BackgroundSlideshow
                photos={derivedPhotos}
                className="absolute inset-0 h-screen z-0 overflow-hidden pointer-events-none opacity-20"
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
                        date={dateInfo?.displayShort ?? ""}
                        subtitle={sections.hero.subtitle}
                        coverImage={sections.hero.coverImage}
                    />
                </motion.div>
            )}

            {/* Main Content - Visible underneath or revealed */}
            <div className="relative z-10 w-full">
                {/* Only allow scrolling when open */}
                <div className={isOpen ? "" : "h-[100dvh] overflow-hidden"}>
                    {sections.title.enabled && (
                        <TitleSection hosts={hosts} date={dateInfo?.display ?? ""} heading={sections.title.heading} isReady={isOpen} />
                    )}

                    {sections.countdown.enabled && (
                        <Countdown targetDate={dateInfo?.countdownTarget ?? ""} photos={derivedPhotos} heading={sections.countdown.heading} />
                    )}

                    {sections.quote.enabled && (
                        <QuoteSection quote={sections.quote} />
                    )}

                    {hostsSection.enabled && (
                        <HostsSection hosts={hosts} />
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
                        <Suspense fallback={<div className="py-24 text-center text-wedding-on-dark/50 font-body italic">Loading RSVP...</div>}>
                            <ConfirmationSection invitationId={config.id} rsvpDeadline={dateInfo?.rsvpDeadline ?? ""} />
                        </Suspense>
                    )}

                    {sections.gift.enabled && (
                        <GiftSection bankAccounts={sections.gift.bankAccounts} heading={sections.gift.heading} description={sections.gift.description} />
                    )}

                    {sections.wishes.enabled && (
                        <Suspense fallback={<div className="py-24 text-center text-wedding-on-dark/50 font-body italic">Loading Wishes...</div>}>
                            <Wishes invitationId={config.id} heading={sections.wishes.heading} placeholder={sections.wishes.placeholder} thankYouMessage={sections.wishes.thankYouMessage} />
                        </Suspense>
                    )}

                    {sections.gratitude.enabled && (
                        <GratitudeSection hosts={hosts} purpose={purpose} message={sections.gratitude.message} />
                    )}

                    {sections.footer.enabled && (
                        <FooterSection hosts={hosts} message={sections.footer.message} />
                    )}
                </div>
            </div>
        </main>
    );
}
