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
    FooterSection
} from "@/components/invitation/InfoSections";

// Import centralized configuration
import { MUSIC, INVITATION_ID, BACKGROUND_PHOTOS, CAROUSEL_PHOTOS, GALLERY_PHOTOS, COUPLE, WEDDING_DATE, EVENTS, STORY, BANK_ACCOUNTS, TEXT, HERO_PHOTO } from "./config";

export default function InvitationPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <main className="relative min-h-screen overflow-x-hidden">
            <BackgroundSlideshow photos={BACKGROUND_PHOTOS} />
            <GoldenRings />
            <FloatingFlowers />
            <FloatingSparkles />
            <FloatingHearts />
            <MusicPlayer shouldStart={isOpen} audioUrl={MUSIC.url} />

            {/* Hero / Cover Section - Fixed Overlay until opened */}
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
                    couple={COUPLE}
                    date={WEDDING_DATE.displayShort}
                    subtitle={TEXT.hero.subtitle}
                    coverImage={HERO_PHOTO}
                />
            </motion.div>

            {/* Main Content - Visible underneath or revealed */}
            <div className={`relative z-10 transition-opacity duration-1000 ${isOpen ? "opacity-100" : "opacity-0 fixed top-0 w-full"}`}>
                {/* Only allow scrolling when open */}
                <div className={isOpen ? "" : "h-screen overflow-hidden"}>
                    <TitleSection couple={COUPLE} date={WEDDING_DATE.display} />
                    <Countdown targetDate={WEDDING_DATE.countdownTarget} photos={CAROUSEL_PHOTOS} />
                    <QuoteSection quote={TEXT.quote} />
                    <CoupleSection couple={COUPLE} />
                    <StorySection stories={STORY} heading={TEXT.story.heading} />
                    <EventSection events={EVENTS} />
                    <Gallery photos={GALLERY_PHOTOS} />

                    <GiftSection bankAccounts={BANK_ACCOUNTS} />

                    <Suspense fallback={<div className="py-24 text-center text-wedding-text-light font-body italic">Loading Wishes...</div>}>
                        <Wishes invitationId={INVITATION_ID} />
                    </Suspense>

                    <FooterSection couple={COUPLE} />
                </div>
            </div>
        </main>
    );
}
