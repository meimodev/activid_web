"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "./Hero";
import { Countdown } from "./Countdown";
import { QuoteSection } from "./QuoteSection";
import { Gallery } from "./Gallery";
import { Wishes } from "./Wishes";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import { BackgroundSlideshow } from "@/components/invitation/BackgroundSlideshow";
import {
    FloatingFlowers,
    FloatingSparkles,
    FloatingHearts,
    GoldenRings
} from "./MoreDecorations";
import { StorySection } from "./StorySection";
import {
    TitleSection,
    CoupleSection,
    EventSection,
    GiftSection,
    ConfirmationSection
} from "./InfoSections";
import Link from "next/link";
import { FloatingParallax } from "@/components/invitation/ParallaxText";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
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
                        <SpaceFooter couple={couple} message={sections.footer.message} />
                    )}
                </div>
            </div>
        </main>
    );
}

function SpaceFooter({ couple, message }: { couple: InvitationConfig['couple'], message: string }) {
    // Generate static stars to avoid hydration mismatch
    const stars = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
    }));

    return (
        <footer className="relative py-24 bg-[#0B0D17] text-center text-white overflow-hidden">
            {/* Space Background & Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white opacity-80"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 px-4">
                <RevealOnScroll direction="up" delay={0.1} width="100%">
                    <FloatingParallax speed={0.2}>
                        {/* Couple Names */}
                        <h2 className="font-script text-5xl md:text-7xl text-transparent bg-clip-text bg-linear-to-r from-purple-200 via-white to-blue-200 mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {couple.groom.firstName} & {couple.bride.firstName}
                        </h2>

                        {/* Message */}
                        <p className="font-heading text-xs md:text-sm uppercase tracking-[0.4em] text-blue-100/60 mb-12 max-w-lg mx-auto leading-loose">
                            MISI BERHASIL <br /> Terimakasih untuk perjalananya bersama Activid Invitation
                        </p>
                    </FloatingParallax>
                </RevealOnScroll>

                {/* CTA Button */}
                <RevealOnScroll direction="up" delay={0.3} width="100%">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-3 px-8 py-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden hover:bg-white/10 transition-all duration-500 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_20px_rgba(100,200,255,0.3)]"
                    >
                        <span className="relative z-10 font-heading text-xs uppercase tracking-[0.2em] text-white group-hover:text-blue-100 transition-colors">
                            🚀 Kembali Pulang ✨
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                        />
                    </Link>
                </RevealOnScroll>

                {/* Activid Branding */}

            </div>
        </footer>
    );
}
