"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { DateTime } from "luxon";
import { MusicPlayer } from "@/components/invitation/MusicPlayer";
import {
  deriveInvitationPrimaryDateInfo,
  INVITATION_LOCALE,
  INVITATION_ZONE,
  parseInvitationDateTime,
  formatRelativeToNow,
} from "@/lib/date-time";
import { normalizeInvitationGuestName } from "@/lib/utils";
import type { Host, InvitationConfig } from "@/types/invitation";
import { Timestamp } from "firebase/firestore";

interface CandylandProps {
  config: InvitationConfig;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 11, stiffness: 80 }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 30, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", damping: 10, stiffness: 110 }
  }
};

const floatAnimation = (delay = 0, yOffset = 12) => ({
  y: [-yOffset, yOffset, -yOffset],
  rotate: [-2, 2, -2],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay
  }
});

export function Candyland({ config }: CandylandProps) {
  const [isOpen, setIsOpen] = useState(() => !config.sections.hero.enabled);
  const [isContentReady, setIsContentReady] = useState(() => !config.sections.hero.enabled);
  const searchParams = useSearchParams();
  const guestName = normalizeInvitationGuestName(searchParams.get("to"));

  const isDemo = config.id.endsWith("-demo");
  const { music, sections } = config;
  const hosts = sections.hosts.hosts;
  const dateInfo = deriveInvitationPrimaryDateInfo(sections.event.events[0]?.date);

  const effectiveHosts = useMemo<[Host, ...Host[]]>(() => {
    return hosts as [Host, ...Host[]];
  }, [hosts]);

  const effectiveGalleryPhotos = sections.gallery?.photos ?? [];
  const effectiveCoverImage = sections.hero.coverImage;

  const demoCountdownTarget = useMemo(() => {
    const dt = DateTime.now()
      .setZone(INVITATION_ZONE)
      .plus({ days: 3 })
      .startOf("day")
      .set({ second: 0, millisecond: 0 });
    return dt.toISO({ includeOffset: true, suppressMilliseconds: true }) ?? "";
  }, []);

  const firstEventCountdownTarget = useMemo(() => {
    const raw = sections.event?.events;
    if (!raw) return null;

    const first = raw[0];
    if (!first) return null;

    const dateValue = (first as { date?: unknown } | null)?.date;
    const dt = parseInvitationDateTime(dateValue);
    if (!dt) return null;

    return (
      dt
        .setZone(INVITATION_ZONE)
        .set({ second: 0, millisecond: 0 })
        .toISO({ includeOffset: true, suppressMilliseconds: true }) ?? null
    );
  }, [sections.event.events]);

  const effectiveCountdownTarget =
    firstEventCountdownTarget ?? (isDemo ? demoCountdownTarget : (dateInfo?.countdownTarget ?? ""));

  const effectiveDateDisplay = useMemo(() => {
    if (!isDemo) return dateInfo?.display ?? "";
    const dt = DateTime.now().setZone(INVITATION_ZONE).plus({ days: 3 }).startOf("day");
    return dt.setLocale(INVITATION_LOCALE).toFormat("d LLLL yyyy");
  }, [dateInfo?.display, isDemo]);

  const celebrant = effectiveHosts[0];
  const celebrantName = celebrant?.shortName || celebrant?.firstName || "Birthday Star";
  const displayGuest = guestName?.trim() || "Teman Manis";
  const displaySubtitle = sections.hero.subtitle?.trim() || "Hari Spesial Raka";

  // Strict birthday purpose enforcement
  if (config.purpose !== "birthday") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-pink-100 p-6 text-center font-sans font-black text-purple-900 border-[10px] border-white rounded-[40px] shadow-inner">
        <span className="text-5xl animate-bounce">🧁</span>
        <h2 className="mt-4 text-2xl uppercase tracking-wider">Akses Terkunci</h2>
        <p className="mt-2 text-xs font-semibold text-purple-800/80 max-w-[280px] leading-relaxed">
          Template Candyland Kingdom didesain khusus dan eksklusif hanya untuk pesta ulang tahun anak-anak!
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FFF5F8] font-sans select-none">
      <MusicPlayer shouldStart={isOpen} audioUrl={music.url} variant="candy" />

      {/* Global CSS for falling sprinkles, bouncing gumballs, cherry pendulum, candy wrappers */}
      <style>{`
        @keyframes candyland-sprinkle-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes candyland-wiggle {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes candyland-gumball-bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes candyland-cherry-sway {
          0%, 100% { transform: rotate(-10deg) origin-bottom-center; }
          50% { transform: rotate(10deg) origin-bottom-center; }
        }
        @keyframes candyland-foil-gleam {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes candyland-lollipop-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes candyland-float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes candyland-sway-slow {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .candyland-frosting-shadow {
          filter: drop-shadow(0px 8px 0px #fbcfe8);
        }
        .candyland-float {
          animation: candyland-float-slow 4s ease-in-out infinite;
        }
        .candyland-sway {
          animation: candyland-sway-slow 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Sweet Candyland Background Decorations */}
      <CandylandBackground />

      {/* Interactive Hero Screen - Slide up dynamically with AnimatePresence */}
      <AnimatePresence
        onExitComplete={() => {
          setIsContentReady(true);
        }}
      >
        {!isOpen && sections.hero.enabled && (
          <motion.div
            key="hero-cover"
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ y: 0, opacity: 1 }}
            exit={{
              y: "-100%",
              opacity: [1, 1, 0],
              scale: 0.97,
              transition: {
                y: { type: "spring", stiffness: 85, damping: 18 },
                opacity: { duration: 0.45 },
                scale: { duration: 0.5 }
              }
            }}
          >
            <HeroScreen
              onOpen={() => setIsOpen(true)}
              celebrantName={celebrantName}
              guestName={displayGuest}
              subtitle={displaySubtitle}
              coverImage={effectiveCoverImage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Sections - Fade and spring-up nicely */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={isContentReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={isContentReady ? "" : "h-screen overflow-hidden"}>
          {isContentReady ? (
            <div className="mx-auto max-w-[440px] px-4 py-8 space-y-12 pb-24">
              
              {/* Title Header Card: Milk Chocolate Bar with Silver Foil peeling overlay */}
              {sections.title.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02, rotate: 0.5 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-[32px] border-[5px] border-white bg-[#5c2a18] p-6 text-center shadow-[0_16px_0_0_rgba(69,26,3,0.5),0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden cursor-pointer"
                >
                  {/* Peeling Silver Foil wrap with animated gleam */}
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-slate-200 via-white to-slate-300 border-b-[4px] border-slate-400/30 flex flex-col justify-center items-center shadow-md select-none pointer-events-none z-10 overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12" style={{
                      animation: "candyland-foil-gleam 4s ease-in-out infinite"
                    }} />
                    <div className="absolute inset-x-0 -bottom-3 h-4 bg-repeat-x bg-[size:16px_16px]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M0 8 L4 4 L8 8 L12 4 L16 8 L16 16 L0 16 Z' fill='%23e2e8f0'/%3E%3C/svg%3E")`
                    }} />
                    <span className="rounded-full bg-pink-100 px-4 py-1 text-[10px] font-black text-pink-600 tracking-widest uppercase rotate-2 shadow-sm">
                      SPECIAL INVITATION
                    </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">PEEL TO OPEN</span>
                  </div>

                  {/* Revealed chocolate bar main contents */}
                  <div className="mt-24 pt-4 text-center">
                    {/* Chocolate block segment background grid */}
                    <div className="grid grid-cols-3 gap-2 opacity-15 absolute inset-4 top-28 pointer-events-none">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded border-2 border-black bg-black h-12" />
                      ))}
                    </div>

                    {/* Cute Candy Kingdom decoration shapes inside Title Card */}
                    <WrappedCandy className="absolute bottom-4 left-4 opacity-75 candyland-float z-20" />
                    <SweetStar className="absolute bottom-6 right-6 opacity-85 candyland-sway z-20" style={{ animationDelay: "1.5s" }} />
                    <SweetStar className="absolute top-28 left-4 opacity-40 candyland-float z-20" style={{ animationDelay: "0.8s" }} />

                    <h1 className="relative z-15 font-black text-4xl text-yellow-100 tracking-tight leading-none [text-shadow:2px_2px_0_#451a03,4px_4px_0_rgba(0,0,0,0.4)]">
                      {sections.title.heading || "Ulang Tahun"}
                    </h1>
                    <p className="relative z-15 mt-4 inline-block rounded-2xl bg-amber-950/40 px-4 py-2 border border-amber-900/60 font-semibold text-xs text-yellow-200 shadow-inner">
                      ✨ {effectiveDateDisplay} ✨
                    </p>

                    {/* Countdown bean visualizers */}
                    {sections.countdown.enabled && (
                      <div className="relative z-15 mt-6 pt-4 border-t border-amber-900/60">
                        <CountdownTimer targetDate={effectiveCountdownTarget} />
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Quote Card: Puffy sweet marshmallow cloud with wiggle */}
              {sections.quote.enabled && sections.quote.text && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  animate={{
                    y: [0, -3, 0],
                    rotate: [-0.5, 0.5, -0.5]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-[36px] border-[5px] border-white bg-gradient-to-br from-white to-pink-50/70 p-6 text-center shadow-[0_12px_0_0_rgba(251,207,232,0.5),0_15px_30px_rgba(0,0,0,0.03)] relative overflow-hidden cursor-pointer"
                >
                  {/* Fluffy marshmallow circular rings */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-pink-100/30" />
                  <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-pink-100/30" />

                  {/* Candy Kingdom decoration shapes inside Quote Card */}
                  <MarshmallowTwist className="absolute top-3 right-4 opacity-60 candyland-float z-0" style={{ animationDelay: "1s" }} />
                  <SweetStar className="absolute bottom-4 left-4 opacity-80 candyland-sway z-0" style={{ animationDelay: "2s" }} />
                  <Gumdrop className="absolute top-4 left-6 opacity-45 candyland-float z-0" />

                  <p className="relative z-10 text-base font-bold italic leading-relaxed text-purple-900 font-serif">
                    “{sections.quote.text}”
                  </p>
                  {sections.quote.author && (
                    <p className="relative z-10 mt-3 text-[10px] font-black uppercase text-pink-500 tracking-wider">
                      — {sections.quote.author}
                    </p>
                  )}
                </motion.section>
              )}

              {/* Hosts / Star Profile: Frosted Cupcake layout with Cherry on top */}
              {sections.hosts.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02 }}
                  className="relative flex flex-col items-center pt-8 cursor-pointer"
                >
                  {/* Wavy cupcake frosting header */}
                  <div className="relative w-full rounded-t-[50px] border-[5px] border-b-0 border-white bg-pink-200 p-6 pt-10 text-center shadow-md select-none candyland-frosting-shadow">
                    <h2 className="font-black text-2xl text-purple-950 uppercase tracking-wider [text-shadow:1px_1px_0_white]">
                      {sections.hosts.heading || "Celebrant Star"}
                    </h2>
                  </div>

                  {/* Cupcake baking paper base containing host details */}
                  <div className="w-full rounded-b-[40px] border-[5px] border-t-0 border-white bg-gradient-to-b from-white to-yellow-50/70 p-6 pt-4 text-center shadow-[0_16px_0_0_rgba(254,243,199,0.7),0_20px_45px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-2 bg-repeat-x" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='8' viewBox='0 0 20 8'%3E%3Cpath d='M0 0 Q10 8 20 0 Z' fill='%23fbcfe8'/%3E%3C/svg%3E")`
                    }} />

                    {/* Cute Cupcake base candy details */}
                    <CandyCane className="absolute -left-2 bottom-12 opacity-85 candyland-sway z-10" style={{ transform: "rotate(-15deg)" }} />
                    <WrappedCandy className="absolute -right-2 bottom-16 opacity-85 candyland-float z-10" style={{ transform: "rotate(20deg)", animationDelay: "0.5s" }} />
                    <SweetStar className="absolute bottom-6 left-6 opacity-30 candyland-float" />
                    <SweetStar className="absolute top-8 right-6 opacity-30 candyland-sway" />
                    <Gumdrop className="absolute bottom-16 left-3 opacity-40 candyland-float" />

                    <div className="flex flex-col items-center relative z-10 -mt-16">
                      {/* Celebrant profile picture wrapped inside cake frame */}
                      <div className="relative h-32 w-32 rounded-full border-[5px] border-white bg-white overflow-hidden shadow-lg animate-bounce-subtle">
                        <img src={celebrant.photo} alt={celebrant.fullName} className="h-full w-full object-cover" />
                        
                        {/* Red Cherry SVG on top of picture swaying dynamically */}
                        <div
                          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2.5 z-20 pointer-events-none select-none"
                          style={{
                            animation: "candyland-cherry-sway 3s ease-in-out infinite"
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <circle cx="12" cy="14" r="8" fill="#ef4444" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.2))" />
                            {/* Cherry stalk */}
                            <path d="M12,6 Q18,0 15,-6" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>

                      <h3 className="mt-4 font-black text-2xl text-purple-950 leading-none">{celebrant.fullName}</h3>
                      <span className="mt-2 inline-block rounded-full bg-pink-500 border border-pink-600/20 px-3 py-0.5 text-[9px] font-black text-white tracking-widest uppercase">
                        {celebrant.role}
                      </span>
                      {celebrant.parents && (
                        <p className="mt-4 text-xs font-semibold text-purple-800/80 leading-relaxed max-w-[260px]">
                          {celebrant.parents}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Event Section: Gingerbread House Biscuit layout with Candy Cane Columns */}
              {sections.event.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="relative rounded-[40px] border-[5px] border-white bg-[#8B5A2B] p-6 shadow-[0_16px_0_0_#5c3713,0_20px_50px_rgba(0,0,0,0.12)] space-y-6 overflow-hidden"
                >
                  {/* Candy Cane stripe left column decoration */}
                  <div className="absolute left-1.5 inset-y-6 w-3.5 rounded-full select-none pointer-events-none" style={{
                    backgroundImage: "repeating-linear-gradient(-45deg,#ef4444,#ef4444 8px,#ffffff 8px,#ffffff 16px)"
                  }} />
                  {/* Candy Cane stripe right column decoration */}
                  <div className="absolute right-1.5 inset-y-6 w-3.5 rounded-full select-none pointer-events-none" style={{
                    backgroundImage: "repeating-linear-gradient(-45deg,#ef4444,#ef4444 8px,#ffffff 8px,#ffffff 16px)"
                  }} />

                  {/* Gingerbread peaked roof frosting icing wave */}
                  <div className="absolute top-0 inset-x-0 h-10 select-none pointer-events-none z-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='20' viewBox='0 0 60 20'%3E%3Cpath d='M0 0 H60 V10 Q45 20 30 10 Q15 20 0 10 Z' fill='white'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat-x"
                  }} />

                  {/* Gingerbread candy toppings */}
                  <WrappedCandy className="absolute top-5 left-6 opacity-75 candyland-float z-20" />
                  <Gumdrop className="absolute top-5 right-6 opacity-75 candyland-sway z-20" />

                  <div className="relative z-10 px-3">
                    <h2 className="text-center font-black text-3xl text-yellow-100 uppercase tracking-wide leading-none [text-shadow:2px_2px_0_#5c3713] mt-4">
                      {sections.event.heading || "Agenda Seru"}
                    </h2>

                    <motion.div
                      variants={staggerContainerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-30px" }}
                      className="space-y-4 mt-6"
                    >
                      {sections.event.events.map((evt, idx) => {
                        const parsed = parseInvitationDateTime(evt.date);
                        const dateStr = parsed ? parsed.setZone(INVITATION_ZONE).setLocale(INVITATION_LOCALE).toFormat("cccc, d LLLL yyyy") : "";
                        const timeStr = parsed ? parsed.setZone(INVITATION_ZONE).setLocale(INVITATION_LOCALE).toFormat("HH:mm") : "";

                        return (
                          <motion.div
                            key={idx}
                            variants={itemPopVariants}
                            whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 0.6 : -0.6 }}
                            className="rounded-3xl border-2 border-white/60 bg-white/95 p-4 shadow-sm relative overflow-hidden cursor-pointer"
                          >
                            <span className="absolute bottom-2 right-2 text-base opacity-25">🍬</span>
                            <span className="absolute top-2 right-2 rounded-full bg-pink-100 border border-pink-200 text-[9px] font-black text-pink-600 px-2 py-0.5 uppercase tracking-wider">
                              STAGE {idx + 1}
                            </span>
                            <h3 className="font-black text-lg text-purple-950 leading-none">{evt.title}</h3>
                            <div className="mt-3 space-y-2 text-xs font-semibold text-purple-900/90">
                              <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>{dateStr}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>⏰</span>
                                <span>{timeStr} WIB</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{evt.venue} - {evt.address}</span>
                              </div>
                            </div>
                            {evt.mapUrl && (
                              <a
                                href={evt.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex items-center gap-2 w-full justify-center rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-3 tracking-widest uppercase transition-all shadow-[0_4px_0_0_#DB2777] active:translate-y-0.5 active:shadow-none"
                              >
                                📍 Buka Google Maps
                              </a>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.section>
              )}

              {/* Story Section: Candyland board game winding path track */}
              {sections.story.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-[40px] border-[5px] border-white bg-gradient-to-br from-yellow-50/95 to-pink-50/95 p-6 shadow-[0_16px_0_0_rgba(254,243,199,0.7)] space-y-6 relative overflow-hidden"
                >
                  <CandyCane className="absolute bottom-6 right-6 opacity-60 candyland-sway" style={{ transform: "rotate(15deg)" }} />
                  <MarshmallowTwist className="absolute top-3 left-4 opacity-40 candyland-float" />
                  <h2 className="text-center font-black text-3xl text-purple-900 leading-none [text-shadow:2px_2px_0_white,3px_3px_0_#FBCFE8]">
                    {sections.story.heading || "Cerita Manis"}
                  </h2>

                  {/* Winding game track layout staggered reveal */}
                  <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    className="relative pl-6 border-l-[4px] border-dashed border-pink-400 space-y-6 pt-2 select-none"
                  >
                    {sections.story.stories.map((story, idx) => {
                      const parsed = parseInvitationDateTime(story.date);
                      const storyDateStr = parsed ? parsed.setZone(INVITATION_ZONE).setLocale(INVITATION_LOCALE).toFormat("LLLL yyyy") : `Momen ${idx + 1}`;
                      const pins = ["🍭", "🍬", "🧁", "🍩"];
                      const currentPin = pins[idx % pins.length];

                      return (
                        <motion.div
                          key={idx}
                          variants={itemPopVariants}
                          className="relative pl-4"
                        >
                          {/* Peppermint game pin indicator slowly spinning and bobbing */}
                          <motion.div
                            className="absolute -left-[35px] top-1 text-xl select-none filter drop-shadow(0 2px 2px rgba(0,0,0,0.15)) cursor-pointer"
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.12, 1]
                            }}
                            transition={{
                              rotate: { duration: 12 + idx * 3, repeat: Infinity, ease: "linear" },
                              scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }
                            }}
                            whileHover={{ scale: 1.3, rotate: 180 }}
                          >
                            {currentPin}
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? 0.5 : -0.5 }}
                            className="rounded-3xl border-2 border-white/60 bg-white/70 p-4 shadow-sm relative cursor-pointer"
                          >
                            <span className="absolute top-2 right-2 text-[9px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 border border-pink-100 px-2 py-0.5 rounded">
                              STATION {idx + 1}
                            </span>
                            <h3 className="font-black text-sm text-purple-950">
                              {storyDateStr}
                            </h3>
                            <p className="mt-2 text-xs font-semibold text-purple-900/80 leading-relaxed whitespace-pre-line">{story.description}</p>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.section>
              )}

              {/* Sweet Loot Inventory Gallery */}
              {sections.gallery.enabled && effectiveGalleryPhotos.length > 0 && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-[40px] border-[5px] border-white bg-gradient-to-br from-pink-50/95 to-blue-50/95 p-6 shadow-[0_16px_0_0_rgba(251,207,232,0.6)] space-y-6 relative overflow-hidden"
                >
                  <WrappedCandy className="absolute top-4 left-4 opacity-40 candyland-float" />
                  <SweetStar className="absolute bottom-4 right-4 opacity-40 candyland-sway" />
                  <h2 className="text-center font-black text-3xl text-purple-900 leading-none [text-shadow:2px_2px_0_white,3px_3px_0_#BFDBFE]">
                    {sections.gallery.heading || "Album Foto"}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {effectiveGalleryPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-[24px] border-[4px] border-white overflow-hidden shadow-md"
                        style={{
                          transform: idx % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)"
                        }}
                      >
                        <img src={photo} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Gift Section: Shaped as sweet glass Candy Jar */}
              {sections.gift.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-[40px] border-[5px] border-white bg-gradient-to-br from-yellow-50/95 to-pink-50/95 p-6 shadow-[0_16px_0_0_rgba(254,243,199,0.7)] text-center space-y-6 relative overflow-hidden"
                >
                  <Gumdrop className="absolute top-8 left-8 opacity-45 candyland-float z-0" />
                  <WrappedCandy className="absolute top-8 right-8 opacity-45 candyland-sway z-0" />
                  <SweetStar className="absolute bottom-6 left-6 opacity-30 candyland-sway" />
                  <h2 className="font-black text-3xl text-purple-900 leading-none [text-shadow:2px_2px_0_white,3px_3px_0_#FBCFE8]">
                    {sections.gift.heading || "Kado Manis"}
                  </h2>
                  <p className="text-xs font-semibold text-purple-800/80 leading-relaxed whitespace-pre-line max-w-[320px] mx-auto">
                    {sections.gift.description || "Jika ingin mengirimkan kado tambahan, bisa kirim lewat tombol di bawah ya!"}
                  </p>
                  
                  {/* Candy Jar card display */}
                  <div className="space-y-4 max-w-[300px] mx-auto">
                    {sections.gift.bankAccounts?.map((account, idx) => (
                      <div key={idx} className="rounded-3xl border-2 border-white/60 bg-white/75 p-4 shadow-sm relative overflow-hidden">
                        <span className="absolute -right-4 -top-4 text-3xl select-none pointer-events-none opacity-20">🍬</span>
                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{account.bankName}</p>
                        <p className="font-black text-lg text-purple-950 mt-1 leading-none">{account.accountNumber}</p>
                        <p className="text-[10px] font-bold text-purple-800/60 mt-1">a/n {account.accountHolder}</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(account.accountNumber);
                            alert("Nomor rekening berhasil disalin! 🍬");
                          }}
                          className="mt-3 w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-2 tracking-widest uppercase transition-all shadow-[0_4px_0_0_#DB2777] active:translate-y-0.5 active:shadow-none"
                        >
                          📋 Salin Rekening
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Wishes Section: Retro Bubblegum Machine with bouncing gumballs */}
              {sections.wishes.enabled && (
                <Suspense
                  fallback={
                    <div className="py-12 text-center text-purple-500 font-semibold italic animate-pulse">
                      loading magic messages...
                    </div>
                  }
                >
                  <WishesBoard
                    invitationId={config.id}
                    heading={sections.wishes.heading}
                    placeholder={sections.wishes.placeholder}
                    thankYouMessage={sections.wishes.thankYouMessage}
                  />
                </Suspense>
              )}

              {/* Gratitude & Final Message Section */}
              {sections.gratitude.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-[40px] border-[5px] border-white bg-gradient-to-br from-pink-50/95 to-blue-50/95 p-6 shadow-[0_16px_0_0_rgba(251,207,232,0.6)] text-center space-y-4"
                >
                  <div className="text-3xl">🥳</div>
                  <h2 className="font-black text-2xl text-purple-900 uppercase tracking-wide leading-none">Terima Kasih Banyak!</h2>
                  <p className="text-xs font-semibold text-purple-800/80 leading-relaxed whitespace-pre-line max-w-[320px] mx-auto">
                    {sections.gratitude.message || "Kehadiran dan doa kalian adalah kado termanis bagi kami. Sampai jumpa di pesta ya!"}
                  </p>
                </motion.section>
              )}

              {/* Footer Credits Section */}
              {sections.footer.enabled && (
                <motion.section
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="rounded-[28px] border-[5px] border-white bg-white/70 p-6 text-center shadow-[0_12px_0_0_rgba(224,242,254,0.6)]"
                >
                  <p className="text-xs font-bold text-purple-800/70 leading-relaxed whitespace-pre-line max-w-[280px] mx-auto">
                    {sections.footer.message || "Dibuat dengan rasa manis bersama Activid"}
                  </p>
                </motion.section>
              )}

            </div>
          ) : null}
        </div>
      </motion.div>
    </main>
  );
}

/* ==========================================================================
   SUB-COMPONENTS
   ========================================================================== */

/* Hero opening view */
interface HeroScreenProps {
  onOpen: () => void;
  celebrantName: string;
  guestName: string;
  subtitle: string;
  coverImage: string;
}

function HeroScreen({ onOpen, celebrantName, guestName, subtitle, coverImage }: HeroScreenProps) {
  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-gradient-to-b from-[#FFF5F8] to-[#FFFBEB]">
      
      {/* Background drifting items scoped specifically for opening cover */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <motion.div animate={floatAnimation(0, 8)} className="absolute left-[10%] top-[15%] text-4xl">🍭</motion.div>
        <motion.div animate={floatAnimation(1, 10)} className="absolute right-[15%] top-[20%] text-3xl">🧸</motion.div>
        <motion.div animate={floatAnimation(0.5, 9)} className="absolute left-[15%] bottom-[20%] text-4xl">🍦</motion.div>
        <motion.div animate={floatAnimation(1.5, 7)} className="absolute right-[10%] bottom-[25%] text-4xl">🍩</motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-[380px] rounded-[48px] border-[6px] border-white bg-gradient-to-br from-pink-50/95 to-yellow-50/95 p-6 text-center shadow-[0_24px_0_0_rgba(251,207,232,0.8),0_30px_70px_rgba(0,0,0,0.08)] relative z-10"
      >
        <span className="inline-block rounded-full bg-pink-100 border border-pink-200 px-4 py-1 text-xs font-black text-pink-600 tracking-wider uppercase rotate-2">
          {subtitle}
        </span>

        <h1 className="mt-4 font-black text-4xl leading-none text-purple-900 tracking-tight [text-shadow:2px_2px_0_white,4px_4px_0_#FBCFE8]">
          HARI SPESIAL<br />
          <span className="text-5xl text-purple-950 font-black tracking-tight">{celebrantName}</span>
        </h1>

        {/* Celebrant Image Deck */}
        <div className="relative my-6 aspect-[4/3] rounded-[32px] border-[5px] border-white overflow-hidden shadow-inner bg-pink-100 flex items-center justify-center">
          <img src={coverImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 border-[3px] border-purple-200/20 rounded-[28px] pointer-events-none" />
        </div>

        {/* Invited Guest Greeting */}
        <div className="rounded-3xl border-2 border-white/60 bg-white/70 p-4 shadow-sm leading-tight my-4">
          <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">KAMI MENGUNDANG</p>
          <p className="font-black text-xl text-purple-950 truncate mt-1">{guestName}</p>
        </div>

        {/* Autoplay opener button */}
        <button
          onClick={onOpen}
          className="relative inline-flex flex-col items-center justify-center w-full rounded-full bg-pink-500 hover:bg-pink-600 font-black text-[18px] uppercase tracking-widest text-white shadow-[0_8px_0_0_#DB2777] active:translate-y-[4px] active:shadow-[0_4px_0_0_#DB2777] py-4 transition-all"
        >
          <span>BUKA UNDANGAN</span>
          <span className="text-[9px] tracking-wide text-pink-200 mt-1 font-bold">
            TAP UNTUK MEMBUKA PESTA
          </span>
        </button>
      </motion.div>
    </div>
  );
}

/* Drifting/Floating cloud and candy particles background */
function CandylandBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side render check
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden min-h-full opacity-35 select-none">
      
      {/* Dynamic colorful blobs */}
      <div className="absolute -top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-pink-100 blur-[80px] opacity-80" />
      <div className="absolute top-[40%] -right-[20%] w-[350px] h-[350px] rounded-full bg-blue-100 blur-[90px] opacity-80" />
      <div className="absolute bottom-[10%] -left-[20%] w-[300px] h-[300px] rounded-full bg-yellow-100 blur-[80px] opacity-70" />

      {/* Cloud & Candy drifting sprites */}
      {[1, 2, 3, 4, 5, 6].map((i) => {
        const left = `${(i * 18) % 95}%`;
        const top = `${(i * 15) % 90}%`;
        const delay = i * 0.8;
        const emoji = i % 3 === 0 ? "🍭" : i % 3 === 1 ? "🧸" : "☁️";
        const scale = i % 2 === 0 ? 0.95 : 1.15;

        return (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-60"
            style={{ left, top, scale }}
            animate={floatAnimation(delay, 10 + i * 2)}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Falling sugar sprinkles rain effect */}
      {Array.from({ length: 15 }).map((_, idx) => {
        const left = `${(idx * 7) % 95}%`;
        const delay = idx * 0.7;
        const duration = 5 + (idx % 4);
        const colors = ["#EC4899", "#60A5FA", "#F59E0B", "#10B981", "#8B5CF6"];
        const bg = colors[idx % colors.length];
        return (
          <div
            key={`sprinkle-${idx}`}
            className="absolute w-1.5 h-3 rounded-full pointer-events-none opacity-60"
            style={{
              left,
              top: "-20px",
              backgroundColor: bg,
              animation: `candyland-sprinkle-fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`
            }}
          />
        );
      })}
    </div>
  );
}

/* Jumpy, colorful countdown timers (Macaron/Jellybean themed) */
interface CountdownTimerProps {
  targetDate: string;
}

function calculateTimeLeft(target: string) {
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const difference = +new Date(target) - +new Date();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { label: "Hari", val: timeLeft.days, color: "bg-pink-100 border-pink-200 text-pink-700" },
    { label: "Jam", val: timeLeft.hours, color: "bg-blue-100 border-blue-200 text-blue-700" },
    { label: "Menit", val: timeLeft.minutes, color: "bg-yellow-100 border-yellow-200 text-yellow-700" },
    { label: "Detik", val: timeLeft.seconds, color: "bg-green-100 border-green-200 text-green-700 animate-pulse" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center pt-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`rounded-2xl border-2 p-2 shadow-[0_4px_0_0_rgba(0,0,0,0.05)] ${item.color}`}
        >
          <p className="font-black text-xl md:text-2xl leading-none">{item.val}</p>
          <p className="text-[9px] font-black uppercase tracking-wider mt-1 opacity-80">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

/* Custom Wishes: Retro Bubblegum Machine containing gumballs wish spheres */
interface WishesBoardProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
}

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp;
}

function WishesBoard({ invitationId, heading, placeholder, thankYouMessage }: WishesBoardProps) {
  const searchParams = useSearchParams();
  const inviteeName = normalizeInvitationGuestName(searchParams.get("to"));

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [error, setError] = useState("");
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  const isDemo = invitationId.endsWith("-demo");
  const effectiveInviteeName = inviteeName ?? (isDemo ? "Teman Raka" : null);

  const demoSeedWishes = useMemo<Wish[]>(() => {
    if (!isDemo) return [];
    const now = Date.now();
    return [
      {
        id: "demo1",
        name: "Lala",
        message: "HBD ya! Semoga seru banget pestanya dan dapet banyak kado lolipop!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 10),
      },
      {
        id: "demo2",
        name: "Kenzo",
        message: "Happy Birthday! Makin pinter, makin ceria, dan sehat selalu!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
      },
      {
        id: "demo3",
        name: "Kimi",
        message: "Selamat ulang tahun temanku! Nggak sabar main bareng di pesta candyland!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 5),
      },
    ];
  }, [isDemo]);

  useEffect(() => {
    if (isDemo) {
      setWishes(demoSeedWishes);
      return;
    }

    const controller = new AbortController();
    const fetchWishes = async () => {
      try {
        const res = await fetch(
          `/api/wishes?invitationId=${encodeURIComponent(invitationId)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        setWishes(
          (json.wishes ?? []).map((w: { id: string; name: string; message: string; createdAt: number | null }) => ({
            id: w.id,
            name: w.name,
            message: w.message,
            createdAt: typeof w.createdAt === "number" ? Timestamp.fromMillis(w.createdAt) : Timestamp.now(),
          }))
        );
      } catch {
        // quiet error fallback
      }
    };

    void fetchWishes();
    return () => controller.abort();
  }, [demoSeedWishes, invitationId, isDemo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDemo) {
      setIsSubmitting(true);
      try {
        const next: Wish = {
          id: `demo_${Date.now()}`,
          name: effectiveInviteeName ?? "Teman Raka",
          message: message.trim(),
          createdAt: Timestamp.now(),
        };
        setWishes((prev) => [next, ...prev]);
        setMessage("");
        setHasPosted(true);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!inviteeName) {
      setError("Silakan buka undangan lewat link pribadi kamu untuk menulis ucapan.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          invitationId,
          name: inviteeName,
          nameKey: inviteeName.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
          message: message.trim(),
        }),
      });

      if (!res.ok) throw new Error("failed");

      const json = await res.json();
      setWishes((prev) => [
        {
          id: json.wish?.id || `local_${Date.now()}`,
          name: inviteeName,
          message: message.trim(),
          createdAt: Timestamp.now(),
        },
        ...prev,
      ]);
      setMessage("");
      setHasPosted(true);
    } catch {
      setError("Gagal mengirim ucapan, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const gumballColors = [
    "bg-pink-300 hover:bg-pink-400 border-pink-400 text-pink-900 shadow-pink-200/50",
    "bg-blue-300 hover:bg-blue-400 border-blue-400 text-blue-900 shadow-blue-200/50",
    "bg-yellow-300 hover:bg-yellow-400 border-yellow-400 text-yellow-900 shadow-yellow-200/50",
    "bg-purple-300 hover:bg-purple-400 border-purple-400 text-purple-900 shadow-purple-200/50",
    "bg-green-300 hover:bg-green-400 border-green-400 text-green-900 shadow-green-200/50",
  ];

  return (
    <motion.section
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="rounded-[40px] border-[5px] border-white bg-gradient-to-br from-pink-50/95 to-yellow-50/95 p-6 shadow-[0_16px_0_0_rgba(251,207,232,0.6)] space-y-6 relative overflow-hidden"
    >
      <WrappedCandy className="absolute top-6 left-6 opacity-60 candyland-float z-0" />
      <WrappedCandy className="absolute top-6 right-6 opacity-60 candyland-sway z-0" />
      <Gumdrop className="absolute bottom-6 left-6 opacity-40 candyland-float z-0" />
      <SweetStar className="absolute bottom-8 right-6 opacity-40 candyland-sway z-0" />
      <h2 className="text-center font-black text-3xl text-purple-900 leading-none [text-shadow:2px_2px_0_white,3px_3px_0_#FBCFE8] uppercase tracking-wide">
        {heading || "Ucapan Manis"}
      </h2>

      {/* Bubblegum Machine visual card deck */}
      <div className="relative pt-4">
        {/* Machine Glass Dome */}
        <div className="relative mx-auto h-[280px] w-full max-w-[310px] rounded-full border-[6px] border-white bg-blue-50/20 shadow-[inset_0_10px_20px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-wrap justify-center items-center p-6 gap-2 relative z-10">
          {/* Glass glare effect SVG absolute overlay */}
          <div className="absolute top-2 left-6 w-12 h-[200px] bg-gradient-to-r from-white/30 to-transparent rounded-full rotate-12 blur-xs select-none pointer-events-none" />

          {/* Staggered bouncing gumballs list with interactive hover shakes */}
          {wishes.map((w, idx) => {
            const colorClass = gumballColors[idx % gumballColors.length];
            return (
              <motion.div
                key={w.id}
                onClick={() => setSelectedWish(w)}
                className={`relative flex flex-col justify-center items-center h-20 w-20 rounded-full border-[3px] border-white p-2 text-center text-[10px] font-black uppercase tracking-tight shadow-md cursor-pointer transition-all select-none ${colorClass}`}
                animate={{
                  y: [0, -4, 0],
                  rotate: [0, idx % 2 === 0 ? 2 : -2, 0]
                }}
                transition={{
                  duration: 2.2 + (idx % 3) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.2
                }}
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -10, 10, -5, 5, 0],
                  y: -6,
                  transition: { duration: 0.5 }
                }}
                whileTap={{ scale: 0.93 }}
              >
                <span className="truncate w-full block px-0.5">{w.name}</span>
                <span className="text-[7px] font-bold block text-black/50 mt-0.5">OPEN 🍬</span>
              </motion.div>
            );
          })}

          {wishes.length === 0 && (
            <p className="text-center text-[11px] font-black text-purple-500 uppercase tracking-widest italic py-4 relative z-10 animate-bounce">
              Belum Ada Gumball. Jadilah Pertama! 🎈
            </p>
          )}
        </div>

        {/* Machine Solid Red Base with Turn Key Coin Slot */}
        <div className="h-16 w-36 bg-gradient-to-b from-red-500 to-red-700 rounded-b-[36px] border-[5px] border-white shadow-md mx-auto flex justify-around items-center relative -mt-3.5 z-20 px-4 select-none">
          {/* Dispenser flap with bounce hover */}
          <motion.div
            whileHover={{ scaleY: 1.1, originY: 0 }}
            className="w-10 h-10 bg-zinc-800 rounded-lg border-2 border-zinc-600 shadow-inner flex items-center justify-center cursor-pointer"
          />
          {/* Coin slot turn-key - spins 360deg on hover/click */}
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="w-9 h-9 bg-zinc-300 rounded-full border-2 border-zinc-400 flex items-center justify-center cursor-pointer shadow relative"
          >
            {/* Metal Key handle bar overlay */}
            <div className="absolute w-7 h-2 bg-zinc-500 rounded" />
            <div className="absolute w-2 h-7 bg-zinc-500 rounded" />
            <span className="absolute z-10 text-[6px] font-black text-white bg-zinc-800/80 rounded px-0.5">5¢</span>
          </motion.div>
        </div>
      </div>

      {/* Guest wish modal overlay when a gumball is tapped */}
      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 backdrop-blur-xs select-none"
            onClick={() => setSelectedWish(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-[36px] border-[5px] border-white bg-gradient-to-br from-pink-100 to-yellow-50 p-6 text-center shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedWish(null)}
                className="absolute top-3 right-3 text-purple-500 hover:text-purple-700 font-bold text-xl h-8 w-8 rounded-full bg-white/60 flex items-center justify-center shadow"
              >
                ✕
              </button>
              <div className="inline-block rounded-full bg-pink-500 text-white font-black text-xs px-4 py-1.5 uppercase shadow-sm">
                🍬 WISH FROM {selectedWish.name} 🍬
              </div>
              <p className="mt-6 text-base font-bold text-purple-950 leading-relaxed whitespace-pre-line bg-white/70 p-4 rounded-3xl border border-white/50 shadow-inner">
                {selectedWish.message}
              </p>
              <p className="mt-4 text-[9px] font-black text-purple-400 uppercase tracking-widest">
                {selectedWish.createdAt ? formatRelativeToNow(selectedWish.createdAt) : "Baru saja"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Writing wish input form styled as a Candy Box */}
      <div className="pt-4 border-t border-purple-100">
        {hasPosted ? (
          <div className="rounded-3xl border-2 border-white/60 bg-white/70 p-5 text-center leading-normal">
            <p className="text-3xl animate-bounce">🍦</p>
            <h3 className="font-black text-lg text-purple-950 mt-2">Ucapan Kamu Terkirim!</h3>
            <p className="text-xs font-semibold text-purple-800/80 mt-2 whitespace-pre-line bg-pink-100/40 p-3 rounded-2xl border border-pink-100/50">
              {thankYouMessage || "Terima kasih banyak atas ucapan dan doa terbaik kamu untuk hari bahagia ini!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!effectiveInviteeName ? (
              <p className="text-center text-xs font-bold text-purple-800/60 leading-relaxed bg-white/50 p-4 rounded-2xl border border-white/40 shadow-inner">
                Untuk mengirim ucapan, silakan klik link undangan pribadi yang kamu miliki.
              </p>
            ) : (
              <>
                <div className="rounded-2xl bg-white/55 p-3 text-center border border-white/40 shadow-inner">
                  <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none">Pengirim</p>
                  <p className="font-black text-sm text-purple-950 mt-1 leading-none">{effectiveInviteeName}</p>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={placeholder || "Tuliskan ucapan dan doa terbaikmu di sini..."}
                  disabled={isSubmitting}
                  className="w-full min-h-[100px] rounded-3xl border-[3px] border-white bg-white/90 p-4 font-semibold text-xs text-purple-950 placeholder:text-purple-300 outline-none transition-all focus:ring-4 focus:ring-pink-300/30 shadow-inner"
                />

                {error && (
                  <p className="text-[11px] font-black text-center text-red-500 bg-red-50 p-2 rounded-xl border border-red-100">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs py-4 tracking-widest uppercase transition-all shadow-[0_5px_0_0_#DB2777] active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "MENGIRIM COIN..." : "🎰 MASUKKAN GUMBALL"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </motion.section>
  );
}

/* ==========================================================================
   CANDY DECORATIVE SHAPES (SVGs)
   ========================================================================== */

function WrappedCandy({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="28" height="28" viewBox="0 0 24 24" fill="none">
      {/* Central circular sweet */}
      <circle cx="12" cy="12" r="6" fill="#F472B6" stroke="#FFF" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="#FFF" opacity="0.4" />
      {/* Left twist tie wrapper */}
      <path d="M6 12L2 8V16L6 12Z" fill="#F472B6" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
      {/* Right twist tie wrapper */}
      <path d="M18 12L22 8V16L18 12Z" fill="#F472B6" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CandyCane({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="20" height="40" viewBox="0 0 16 32" fill="none">
      {/* Cane hook shape */}
      <path d="M2 30V10C2 5.58 5.58 2 10 2C14.42 2 14 6 14 6" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
      {/* White diagonal stripes */}
      <path d="M2 24L6 22M2 16L6 14M4 8L8 6" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function Gumdrop({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="24" height="24" viewBox="0 0 20 20" fill="none">
      {/* Sugary rounded dome */}
      <path d="M2 18C2 12 5 2 10 2C15 2 18 12 18 18H2Z" fill="#3B82F6" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
      {/* White sugar sparkle dots */}
      <circle cx="7" cy="8" r="1.2" fill="#FFF" opacity="0.8" />
      <circle cx="13" cy="11" r="1.2" fill="#FFF" opacity="0.8" />
      <circle cx="10" cy="14" r="1" fill="#FFF" opacity="0.8" />
    </svg>
  );
}

function SweetStar({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="16" height="16" viewBox="0 0 16 16" fill="none">
      {/* 4-pointed sparkle */}
      <path d="M8 0C8 4.418 4.418 8 0 8C4.418 8 8 11.582 8 16C8 11.582 11.582 8 16 8C11.582 8 8 4.418 8 0Z" fill="#FBBF24" />
    </svg>
  );
}

function MarshmallowTwist({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="32" height="20" viewBox="0 0 28 16" fill="none">
      {/* Pastel twisted cylinder */}
      <rect x="2" y="2" width="24" height="12" rx="6" fill="#A78BFA" stroke="#FFF" strokeWidth="2" />
      <path d="M8 2C10 6 10 10 8 14M14 2C16 6 16 10 14 14M20 2C22 6 22 10 20 14" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
