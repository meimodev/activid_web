"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Host, StoryItem } from "@/types/invitation";
import { formatInvitationMonthYear } from "@/lib/date-time";
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

export function StorySection({
  stories,
  heading,
  fallbackImageUrl,
}: {
  stories: StoryItem[];
  heading: string;
  fallbackImageUrl?: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();
  const heroImage = stories[0]?.imageUrl ?? fallbackImageUrl;

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
          backgroundImage: `url(${assets.constellation})`,
          backgroundSize: "120% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <motion.div
        className="absolute right-6 top-10"
        animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.floatingPlanet1} alt="" className="w-16 h-auto opacity-30" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#128214; {heading}
        </motion.div>

        {heroImage ? (
          <motion.div className="mb-6" variants={itemVariants}>
            <img
              src={heroImage}
              alt="Story hero"
              className="w-full aspect-[4/3] rounded-[28px] border border-white/10 object-cover"
              style={{ boxShadow: "0 0 30px var(--invitation-accent-2)" }}
            />
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-4">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5"
              variants={itemVariants}
              animate={{ rotate: [i % 2 === 0 ? -0.3 : 0.3, i % 2 === 0 ? 0.3 : -0.3, i % 2 === 0 ? -0.3 : 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              style={{ boxShadow: "0 0 12px var(--invitation-accent-2)" }}
            >
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-0.5 font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur">
                {formatInvitationMonthYear(story.date)}
              </div>
              <p className="font-garet-book text-[13px] leading-relaxed text-white/65">
                {story.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function GallerySection({
  photos,
  heading,
}: {
  photos: string[];
  heading: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const assets = useOverlayAssets();

  if (!photos.length) return null;

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
        className="absolute left-4 top-14"
        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.floatingPlanet2} alt="" className="w-12 h-auto opacity-30" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#128248; {heading}
        </motion.div>

        <motion.div className="mb-4" variants={itemVariants}>
          <img
            src={photos[selected]}
            alt={`Gallery ${selected + 1}`}
            className="w-full aspect-[4/5] rounded-[28px] border border-white/10 object-cover"
            style={{ boxShadow: "0 0 30px var(--invitation-accent-2)" }}
          />
        </motion.div>

        <div className="grid grid-cols-4 gap-2">
          {photos.slice(0, 30).map((photo, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              variants={itemVariants}
              className={`overflow-hidden rounded-[14px] border-2 transition-all ${
                i === selected
                  ? "border-white/60 shadow-[0_0_15px_var(--invitation-accent-2)] scale-105"
                  : "border-white/[0.06] opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={photo}
                alt={`Thumbnail ${i + 1}`}
                className="w-full aspect-square object-cover"
              />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function GratitudeSection({
  hosts,
  message,
}: {
  hosts: Host[];
  message: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();

  return (
    <motion.section
      className="relative overflow-hidden px-5 py-20"
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
        className="absolute right-6 top-12"
        animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.heroGraphic} alt="" className="w-16 h-auto opacity-30" />
      </motion.div>

      <motion.div
        className="absolute left-4 bottom-16"
        animate={{ y: [0, 6, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img src={assets.moonOrbiter} alt="" className="w-12 h-auto opacity-30" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm text-center">
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#128591; Terima Kasih
        </motion.div>

        <motion.h3
          className="font-great-vibes text-[36px] leading-tight text-white"
          variants={itemVariants}
          style={{ textShadow: "0 0 40px var(--invitation-accent-2)" }}
        >
          Sampai Jumpa di Pesta!
        </motion.h3>

        <motion.p
          className="mt-4 font-garet-book text-[13px] leading-relaxed text-white/50"
          variants={itemVariants}
        >
          {message}
        </motion.p>

        <motion.div
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 font-great-vibes text-[22px] text-white/70 backdrop-blur"
          variants={itemVariants}
          style={{ boxShadow: "0 0 20px var(--invitation-accent-2)" }}
        >
          {hosts[0]?.firstName}
        </motion.div>
      </div>
    </motion.section>
  );
}

export function FooterSection({
  hosts,
  message,
}: {
  hosts: Host[];
  message: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}) {
  const assets = useOverlayAssets();

  return (
    <motion.section
      className="relative overflow-hidden py-20 px-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      style={{
        background: "var(--invitation-dark)",
      }}
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-24 opacity-25"
        style={{
          backgroundImage: `url(${assets.footerGraphic})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      />

      <motion.div
        className="absolute left-8 top-12"
        animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={assets.floatingPlanet1} alt="" className="w-14 h-auto opacity-25" />
      </motion.div>

      <motion.div
        className="absolute right-8 bottom-16"
        animate={{ y: [0, 6, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img src={assets.floatingPlanet2} alt="" className="w-12 h-auto opacity-25" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-sm text-center">
        {hosts.length > 0 ? (
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/45 backdrop-blur"
            variants={itemVariants}
          >
            {hosts[0]?.firstName}
            {hosts[1] ? ` & ${hosts[1].firstName}` : ""}
          </motion.div>
        ) : null}

        <motion.h2
          className="font-great-vibes text-[44px] leading-tight text-white"
          variants={itemVariants}
          style={{ textShadow: "0 0 50px var(--invitation-accent-2)" }}
        >
          Waktunya Pesta!
        </motion.h2>

        <motion.p
          className="mt-4 font-garet-book text-[13px] leading-relaxed text-white/40"
          variants={itemVariants}
        >
          {message}
        </motion.p>

        <motion.a
          href="https://invitation.activid.id"
          variants={itemVariants}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 py-2 font-garet-book text-[12px] font-bold uppercase tracking-[0.12em] text-white/50 backdrop-blur transition-colors hover:bg-white/[0.12]"
        >
          &#127968; Kembali ke Undangan
        </motion.a>
      </div>
    </motion.section>
  );
}
