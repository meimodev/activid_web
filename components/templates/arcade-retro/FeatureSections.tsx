"use client";

import { motion } from "framer-motion";
import type { InvitationConfig } from "@/types/invitation";
import { formatTimeRange } from "@/lib/date-time";
import { useOverlayAssets } from "./overlays";

type Hosts = InvitationConfig["sections"]["hosts"]["hosts"];
type Events = InvitationConfig["sections"]["event"]["events"];

interface QuoteSectionProps {
  text: string;
  author?: string;
}

interface HostSectionProps {
  hosts: Hosts;
  heading?: string;
}

interface EventSectionProps {
  events: Events;
  heading: string;
}

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.65, ease: revealEase } 
  },
} as const;

const popVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, type: "spring", bounce: 0.35 },
  },
} as const;

// --- QUOTE / GAME TIPS SECTION ---
export function QuoteSection({ text, author }: QuoteSectionProps) {
  return (
    <section className="relative overflow-hidden bg-transparent py-16 px-4">
      <div className="relative z-10 mx-auto w-full max-w-[500px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-black border-[5px] border-black rounded-[20px] p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]"
        >
          {/* Neon scanlines screen overlay */}
          <div aria-hidden className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-15 pointer-events-none" />

          {/* Tips header indicator */}
          <div className="flex justify-center -mt-9 mb-4">
            <span className="font-mono font-bold text-[10px] uppercase tracking-[0.25em] bg-yellow-400 text-black border-[3px] border-black px-4 py-1 rounded-[6px] shadow-[4px_4px_0_0_black]">
              HINT / PRO-TIP
            </span>
          </div>

          <div className="relative z-10 text-center py-2 font-mono text-[14px] leading-relaxed text-wedding-accent-2 font-semibold uppercase tracking-wide">
            <p className="[text-shadow:1px_1px_0_#000]">
              &quot;{text}&quot;
            </p>
            {author && (
              <p className="text-right text-[10px] text-white/50 mt-3 font-bold">
                — {author.toUpperCase()}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- SELECT CHARACTER / HOSTS SECTION ---
export function HostSection({ hosts, heading }: HostSectionProps) {
  const assets = useOverlayAssets();
  const celebrant = hosts[0];
  if (!celebrant) return null;

  // Derive age level based on parent string or fallback to standard level 8
  const parentString = celebrant.parents || "";
  const ageMatch = parentString.match(/\b\d+\b/);
  const derivedLevel = ageMatch ? ageMatch[0] : "8";

  // Stat meters definition
  const stats = [
    { name: "CAKE DEFENSE", value: 99, color: "bg-red-500" },
    { name: "SWEETNESS", value: 100, color: "bg-wedding-accent" },
    { name: "ENERGY", value: 95, color: "bg-wedding-accent-2" },
    { name: "FUN LEVEL", value: 100, color: "bg-lime-500" },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${assets.constellation})`,
            backgroundSize: "contain",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[500px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-wedding-dark rounded-[24px] border-[5px] border-black p-6 shadow-[0_10px_0_0_black,0_15px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 40%, var(--invitation-dark) 100%)`,
          }}
        >
          {/* Header */}
          <motion.div variants={rowVariants} className="text-center mb-6">
            <h3 className="font-mono font-black text-[22px] text-white uppercase tracking-widest [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)]">
              {heading || "SELECT PLAYER"}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
            {/* Avatar frame (Left/Top) */}
            <motion.div variants={rowVariants} className="md:col-span-2 flex flex-col items-center justify-center">
              <motion.div
                variants={popVariants}
                className="relative w-[150px] h-[150px] border-[4px] border-black bg-black rounded-[12px] overflow-hidden shadow-[4px_4px_0_0_black]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${celebrant.photo})` }}
                />
                {/* Level indicator sticker */}
                <div className="absolute top-2 left-2 bg-yellow-400 border-[2px] border-black text-black px-1.5 py-0.5 rounded font-mono font-black text-[9px] uppercase shadow-[1px_1px_0_0_black]">
                  LVL {derivedLevel}
                </div>
              </motion.div>

              <h4 className="font-mono font-black text-[18px] text-white uppercase tracking-wide mt-3 text-center">
                {celebrant.firstName}
              </h4>
              <p className="font-mono text-[9px] text-wedding-accent-2 uppercase tracking-widest mt-1 text-center font-bold">
                {celebrant.role || "Birthday Star"}
              </p>
            </motion.div>

            {/* Character Stats panel (Right/Bottom) */}
            <motion.div variants={rowVariants} className="md:col-span-3 bg-black/50 border-[3px] border-black p-4 rounded-[12px] flex flex-col justify-between">
              <div>
                <p className="font-mono text-[10px] text-wedding-accent-2/80 tracking-widest uppercase mb-4 pb-1 border-b border-white/10 font-bold">
                  CHARACTER STATS
                </p>

                <div className="space-y-3">
                  {stats.map((stat) => (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between items-center font-mono text-[9px] text-white font-bold tracking-wide">
                        <span>{stat.name}</span>
                        <span className="text-wedding-accent-2">{stat.value}%</span>
                      </div>
                      {/* Chunky pixelated meter */}
                      <div className="h-4 w-full bg-white/10 border-[2px] border-black rounded-[4px] overflow-hidden p-0.5">
                        <motion.div
                          className={`h-full ${stat.color} rounded-[2px]`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {celebrant.parents && (
                <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[8px] text-white/60 text-center uppercase tracking-wider leading-relaxed">
                  {celebrant.parents}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- QUEST LOG / EVENTS SECTION ---
export function EventSection({ events, heading }: EventSectionProps) {
  const assets = useOverlayAssets();
  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* Perspective Grid Floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[150px] opacity-25"
        style={{
          backgroundImage: `url(${assets.spaceDust})`,
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[500px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-wedding-dark rounded-[24px] border-[5px] border-black p-6 shadow-[0_10px_0_0_black,0_15px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 40%, var(--invitation-dark) 100%)`,
          }}
        >
          {/* Header */}
          <motion.div variants={rowVariants} className="text-center mb-8">
            <h3 className="font-mono font-black text-[22px] text-white uppercase tracking-widest [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)]">
              {heading || "QUEST LOG"}
            </h3>
          </motion.div>

          {/* Event Cards */}
          <div className="space-y-6">
            {events.map((event, idx) => {
              const displayTitle = event.title || `QUEST ${idx + 1}`;
              const timeRange = formatTimeRange(event.date, event.endDate);

              return (
                <motion.div
                  key={idx}
                  variants={rowVariants}
                  className="relative group bg-black/50 border-[3px] border-black p-4 rounded-[12px] shadow-[4px_4px_0_0_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_black] transition-all"
                >
                  {/* Quest Completion tag */}
                  <div className="absolute top-3 right-3 bg-wedding-accent2 border-[2px] border-black text-black px-2 py-0.5 rounded font-mono font-black text-[8px] uppercase tracking-wide">
                    STAGE {idx + 1}
                  </div>

                  <h4 className="font-mono font-black text-[15px] text-white uppercase tracking-wide mb-3 pr-16 leading-tight">
                    {displayTitle}
                  </h4>

                  <div className="space-y-2 font-mono text-[10px] text-white/80">
                    {/* Time details */}
                    <div className="flex items-start gap-2.5">
                      <span className="text-wedding-accent-2 font-bold shrink-0">🕒 TIMING:</span>
                      <span className="font-semibold uppercase tracking-wider">{timeRange}</span>
                    </div>

                    {/* Venue details */}
                    <div className="flex items-start gap-2.5">
                      <span className="text-wedding-accent-2 font-bold shrink-0">📍 PORTAL:</span>
                      <div>
                        <p className="font-bold text-white uppercase tracking-wide leading-tight">{event.venue}</p>
                        {event.address && (
                          <p className="text-white/60 text-[9px] mt-1 leading-normal uppercase">{event.address}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Loot link button */}
                  {event.mapUrl && (
                    <div className="mt-4 flex justify-end">
                      <motion.a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center bg-yellow-400 border-[2px] border-black text-black px-3.5 py-1.5 rounded-[6px] font-mono font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0_0_black] hover:bg-yellow-300"
                      >
                        OPEN MAP RADAR
                      </motion.a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
