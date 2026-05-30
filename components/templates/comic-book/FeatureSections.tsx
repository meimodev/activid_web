"use client";

import { motion } from "framer-motion";
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";
import type { InvitationConfig } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

type Hosts = InvitationConfig["sections"]["hosts"]["hosts"];
type EventsConfig = InvitationConfig["sections"]["event"]["events"];

interface QuoteSectionProps {
  quote: {
    text: string;
    author: string;
  };
  isReady?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

interface HostSectionProps {
  hosts: Hosts;
  isReady?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

interface EventSectionProps {
  events: EventsConfig;
  heading: string;
  isReady?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

const popVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 150,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const;

const panelVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 80,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const wrapperVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function HostCard({
  host,
  label,
  frameUrl,
}: {
  host: Hosts[number];
  label: string;
  frameUrl: string;
}) {
  if (!host) return null;

  return (
    <motion.div
      variants={wrapperVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-[110%] -ml-[5%] rotate-1 mb-16"
    >
      {/* Chaotic Solid Shadow */}
      <div className="absolute inset-0 bg-black rotate-[1deg] translate-y-[10px] z-0" />
      
      <div className="relative bg-white grid grid-cols-2 z-10 overflow-hidden">
        {/* Asymmetrical Top Border */}
        <svg className="absolute top-0 left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
          <polygon points="0,0 100,0 100,6 0,12" fill="black" />
        </svg>

        {/* Asymmetrical Bottom Border */}
        <svg className="absolute bottom-0 left-0 w-full h-[14px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 14">
          <polygon points="0,6 100,0 100,14 0,14" fill="black" />
        </svg>

        {/* Photo Panel */}
        <motion.div variants={panelVariants} className="relative col-span-2 py-10 bg-white bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:16px_16px] flex justify-center items-center">
          <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[5px] bg-black -rotate-1 z-20 pointer-events-none" />
          <motion.div
            className="relative mx-auto h-[260px] w-[260px] z-30"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-[14px] overflow-hidden rounded-[32px] border-4 border-black shadow-[4px_4px_0_0_black]">
              <img src={host.photo} alt={host.fullName || host.firstName} className="h-full w-full object-cover" />
            </div>
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${frameUrl})` }}
              animate={{ rotate: [0, 3, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Name & Label Panel */}
        <motion.div variants={panelVariants} className="relative col-span-2 px-6 py-8 bg-wedding-accent bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px] flex flex-col justify-center items-center text-center">
          {/* Doodle Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.12] mix-blend-multiply pointer-events-none z-10"
            style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "180px" }}
          />
          <div className="absolute bottom-[-3px] left-[-10px] w-[600px] h-[6px] bg-black rotate-[0.5deg] z-20 pointer-events-none" />
          
          <motion.p variants={itemVariants} className="font-garet-book font-bold text-[12px] uppercase tracking-[0.2em] text-white bg-black inline-block px-4 py-1.5 rounded-full shadow-[4px_4px_0_0_var(--invitation-accent-2)] -rotate-2 relative z-30">
            {label}
          </motion.p>
          
          <motion.h3 variants={itemVariants} className="mt-5 font-black text-[42px] leading-none tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,5px_5px_0_var(--invitation-accent-2),7px_7px_0_black] relative z-30">
            {host.firstName || host.shortName || host.fullName}
          </motion.h3>

          {host.fullName && host.fullName !== host.firstName ? (
            <motion.p variants={itemVariants} className="mt-3 font-garet-book text-[16px] text-white font-black [text-shadow:1.5px_1.5px_0_black] relative z-30">
              {host.fullName}
            </motion.p>
          ) : null}
        </motion.div>

        {/* Details Panel */}
        {(host.role || host.parents) && (
          <motion.div variants={panelVariants} className="relative col-span-2 px-6 py-8 bg-wedding-accent-2 bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px] flex flex-col justify-center items-center text-center">
            {host.role && (
              <motion.div variants={itemVariants} className="relative z-30">
                <p className="inline-flex rounded-xl bg-white border-4 border-black px-6 py-3 font-garet-book text-[14px] uppercase font-black tracking-widest text-black shadow-[6px_6px_0_0_black] rotate-1">
                  {host.role}
                </p>
              </motion.div>
            )}
            
            {host.parents && (
              <motion.div variants={itemVariants} className="relative z-30 mt-6 w-full">
                <div className="font-garet-book text-[15px] leading-relaxed font-bold text-black border-4 border-black rounded-3xl p-4 bg-white shadow-[6px_6px_0_0_black] -rotate-1 relative">
                  <div className="absolute top-[-10px] left-4 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45" />
                  {host.parents}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}

const rowVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: "spring", stiffness: 80, damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.15
    } 
  }
} as const;

export function QuoteSection({ quote, isReady }: QuoteSectionProps) {
  const assets = useOverlayAssets();

  if (!isReady) return null;
  if (!quote?.text?.trim()) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg pt-12 pb-10 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
            opacity: 0.12,
          }}
        />
        <motion.div
          className="absolute right-4 top-6"
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet2} alt="" className="w-14 h-auto opacity-40" />
        </motion.div>
      </div>

      <motion.div
        variants={rowVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-[110%] -ml-[5%]"
      >
        <div className="relative w-full">
          {/* Chaotic Solid Shadow */}
          <div className="absolute inset-0 bg-black -rotate-[1deg] translate-y-[10px] z-0" />

          <div className="relative w-full bg-wedding-accent px-8 py-12 text-center -rotate-2 z-10 overflow-hidden">
            {/* Asymmetrical Top Border */}
            <svg className="absolute top-0 left-0 w-full h-[14px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 14">
              <polygon points="0,0 100,0 100,6 0,14" fill="black" />
            </svg>
            
            {/* Asymmetrical Bottom Border */}
            <svg className="absolute bottom-0 left-0 w-full h-[16px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 16">
              <polygon points="0,10 100,0 100,16 0,16" fill="black" />
            </svg>

            <motion.div
              animate={{ rotate: [0, 1, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto max-w-[520px] rotate-2 flex flex-col items-center"
            >
              <motion.div variants={popVariants}>
                <p className="font-garet-book font-bold text-[14px] uppercase tracking-widest text-black bg-white inline-block px-5 py-2 rounded-full border-[3px] border-black shadow-[4px_4px_0_0_black] rotate-2">
                  Harapan Terbaik
                </p>
              </motion.div>
              
              <motion.div variants={popVariants}>
                <blockquote className="mt-8 font-black text-[32px] leading-tight tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,5px_5px_0_var(--invitation-accent-2)]">
                  &quot;{quote.text}&quot;
                </blockquote>
              </motion.div>
              
              {quote.author?.trim() ? (
                <motion.div variants={popVariants} className="mt-8">
                  <p className="inline-block font-garet-book font-bold text-[14px] text-black uppercase tracking-[0.2em] bg-white px-5 py-2 border-[3px] border-black shadow-[4px_4px_0_0_black] -rotate-1">
                    {quote.author}
                  </p>
                </motion.div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function HostSection({ hosts, isReady }: HostSectionProps) {
  const assets = useOverlayAssets();
  const primary = hosts[0];
  const secondary = hosts[1];
  const hasSecondary = Boolean(
    secondary &&
      ((secondary.firstName || "").trim() ||
        (secondary.fullName || "").trim() ||
        (secondary.photo || "").trim()),
  );

  if (!isReady) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
        <motion.div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${assets.stars})` }}
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute right-4 bottom-20"
          animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <img src={assets.floatingPlanet1} alt="" className="w-20 h-auto opacity-35" />
        </motion.div>
        <motion.div
          className="absolute left-6 top-12"
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.heroGraphic} alt="" className="w-16 h-auto opacity-35" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center relative">
            <motion.div variants={popVariants}>
              <p className="relative font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent inline-block px-5 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0_0_black] -rotate-2">Bintang Ulang Tahun</p>
            </motion.div>
            <motion.div variants={popVariants}>
              <h2 className="relative mt-5 font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,5px_5px_0_var(--invitation-accent-2),7px_7px_0_black]">Kru Pesta</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <motion.div
                animate={{ rotate: [1, -1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-10 space-y-8">
          <HostCard host={primary} label="Bintang Ulang Tahun" frameUrl={assets.frame} />
          {hasSecondary ? (
            <HostCard host={secondary} label="Tamu Spesial" frameUrl={assets.frame} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function EventSection({ events, heading, isReady }: EventSectionProps) {
  const assets = useOverlayAssets();

  if (!isReady) return null;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,color-mix(in_srgb,var(--invitation-accent-2)_12%,var(--invitation-bg)),var(--invitation-bg))] px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
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
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center pt-8">
            <motion.div variants={popVariants}>
              <p className="font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent-2 inline-block px-5 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0_0_black] rotate-2">Detail Pesta</p>
            </motion.div>
            <motion.div variants={popVariants}>
              <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,5px_5px_0_var(--invitation-accent),7px_7px_0_black]">
                {heading?.trim() || "Detail Acara"}
              </h2>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-12 space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={`${event.title}-${index}`}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[40px] border-4 border-black bg-white px-6 py-8 shadow-[12px_12px_0_0_black]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  <p className="relative font-garet-book font-bold text-[13px] uppercase tracking-[0.2em] text-white bg-wedding-dark inline-block px-4 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0_0_black] -rotate-1">{event.title}</p>
                  <h3 className="relative mt-5 font-black text-[32px] leading-none tracking-tight text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black,4px_4px_0_var(--invitation-accent-2)]">
                    {formatInvitationDateLong(event.date)}
                  </h3>
                  <div className="relative mt-4 inline-flex items-center justify-center rounded-xl bg-wedding-accent-2 border-2 border-black px-4 py-2 text-white shadow-[4px_4px_0_0_black] rotate-1">
                    <span className="font-garet-book font-bold text-[14px] tracking-widest">{formatInvitationTime(event.date)}</span>
                  </div>
                  <p className="relative mt-6 font-black text-[22px] text-wedding-dark leading-tight">{event.venue}</p>
                  <p className="relative mt-3 font-garet-book font-bold text-[14px] leading-relaxed text-wedding-dark border-2 border-black shadow-[4px_4px_0_0_black] bg-white p-4 rounded-2xl">{event.address}</p>
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative mt-8 inline-flex w-full items-center justify-center rounded-full border-4 border-black bg-wedding-accent px-8 py-4 font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-white shadow-[6px_6px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black]"
                  >
                    Lihat Lokasi
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
