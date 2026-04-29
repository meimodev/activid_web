"use client";

import { motion } from "framer-motion";
import type { EventDetail, Host, QuoteSection } from "@/types/invitation";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-time";
import { useOverlayAssets } from "./overlays";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.85, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
} as const;

export function QuoteSection({
  quote,
}: {
  quote: QuoteSection;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();

  return (
    <motion.section
      className="relative overflow-hidden px-6 py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
        }}
      />

      <motion.div
        className="absolute right-4 top-6"
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.floatingPlanet2} alt="" className="w-14 h-auto opacity-40" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm">
        <motion.div
          className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8"
          variants={itemVariants}
          animate={{ rotate: [-0.5, 0.5, -0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 30px var(--invitation-accent-2)",
          }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[10px] uppercase tracking-[0.22em] text-white/55 backdrop-blur">
            &#10024; Harapan Terbaik
          </div>

          <blockquote className="font-great-vibes text-[26px] leading-relaxed text-white/85 italic">
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {quote.author ? (
            <p className="mt-3 font-garet-book text-[12px] tracking-[0.1em] text-white/40">
              — {quote.author}
            </p>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  );
}

function HostCard({ host, isPrimary }: { host: Host; isPrimary?: boolean }) {
  const assets = useOverlayAssets();

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      variants={itemVariants}
    >
      <div className="relative">
        <img
          src={host.photo}
          alt={host.fullName}
          className="h-56 w-56 rounded-full border-[3px] border-white/15 object-cover"
          style={{
            boxShadow: "0 0 50px var(--invitation-accent-2), 0 0 100px rgba(0,0,0,0.3)",
          }}
        />
        <motion.div
          className="absolute inset-[-10px] rounded-full opacity-25"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {assets.frame ? (
            <img src={assets.frame} alt="" className="w-full h-full" />
          ) : null}
        </motion.div>
      </div>

      {isPrimary ? (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/50 backdrop-blur">
          &#11088; Bintang Ulang Tahun
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/40 backdrop-blur">
          Tamu Spesial
        </div>
      )}

      <h3 className="font-great-vibes text-[36px] leading-none text-white"
        style={{ textShadow: "0 0 30px var(--invitation-accent-2)" }}>
        {host.firstName}
      </h3>
      <p className="font-garet-book text-[13px] tracking-[0.08em] text-white/60">
        {host.fullName}
      </p>
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/40 backdrop-blur">
        {host.role}
      </div>
      {host.parents ? (
        <p className="font-garet-book text-[11px] leading-relaxed text-white/35 text-center max-w-[220px]">
          {host.parents}
        </p>
      ) : null}
    </motion.div>
  );
}

export function HostSection({
  hosts,
}: {
  hosts: Host[];
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();

  return (
    <motion.section
      className="relative overflow-hidden px-5 py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${assets.constellation})`,
          backgroundSize: "150% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <motion.div
        className="absolute left-6 top-12"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.heroGraphic} alt="" className="w-16 h-auto opacity-35" />
      </motion.div>

      <motion.div
        className="absolute right-4 bottom-20"
        animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img src={assets.floatingPlanet1} alt="" className="w-20 h-auto opacity-35" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm text-center">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#127775; Kru Pesta
        </motion.div>

        <div className="flex flex-col items-center gap-10">
          <HostCard host={hosts[0]} isPrimary />
          {hosts[1] ? <HostCard host={hosts[1]} /> : null}
        </div>
      </div>
    </motion.section>
  );
}

function EventCard({ event }: { event: EventDetail }) {
  return (
    <motion.div
      className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6"
      variants={itemVariants}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        boxShadow: "0 12px 30px rgba(0,0,0,0.2), 0 0 20px var(--invitation-accent-2)",
      }}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-garet-book text-[11px] uppercase tracking-[0.15em] text-white/60 backdrop-blur self-start">
        {event.title}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-garet-book text-[13px] text-white/70">
          &#128197; {formatInvitationDateLong(event.date)}
        </div>
        <div className="flex items-center gap-2 font-garet-book text-[13px] text-white/70">
          &#128338; {formatInvitationTime(event.date)}
        </div>
        <div className="flex items-center gap-2 font-garet-book text-[13px] text-white/70">
          &#128205; {event.venue}
        </div>
        <p className="font-garet-book text-[12px] text-white/45">{event.address}</p>
      </div>

      {event.mapUrl ? (
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 font-garet-book text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 backdrop-blur transition-colors hover:bg-white/[0.14] self-start"
        >
          &#128506; Lihat Lokasi
        </a>
      ) : null}
    </motion.div>
  );
}

export function EventSection({
  events,
  heading,
}: {
  events: EventDetail[];
  heading: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();

  return (
    <motion.section
      className="relative overflow-hidden px-5 py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
        }}
      />

      <motion.div
        className="absolute right-6 top-10"
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.moonOrbiter} alt="" className="w-12 h-auto opacity-40" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#127881; {heading}
        </motion.div>

        <div className="flex flex-col gap-6">
          {events.map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
