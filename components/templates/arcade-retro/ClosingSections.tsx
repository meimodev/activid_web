"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Host, StoryItem } from "@/types/invitation";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import { useOverlayAssets } from "./overlays";

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: revealEase } 
  },
};


interface SectionProps {
  isReady?: boolean;
}

interface StorySectionProps extends SectionProps {
  stories: StoryItem[];
  heading: string;
  fallbackImageUrl?: string;
}

interface GallerySectionProps extends SectionProps {
  photos: string[];
  heading: string;
}

interface GratitudeSectionProps extends SectionProps {
  hosts: Host[];
  message: string;
}

interface FooterSectionProps extends SectionProps {
  hosts: Host[];
  message: string;
}

// --- STORY / QUEST LEVEL MILESTONES ---
export function StorySection({
  stories,
  heading,
  fallbackImageUrl,
  isReady,
}: StorySectionProps) {
  const assets = useOverlayAssets();
  const heroImage = stories[0]?.imageUrl ?? fallbackImageUrl;

  if (!isReady || !stories.length) return null;

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* Dynamic background vectors */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />
        <motion.div
          className="absolute right-6 top-10"
          animate={{ y: [0, -10, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet2} alt="" className="w-14 h-auto opacity-30" />
        </motion.div>
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
              {heading || "MEMORIES UNLOCKED"}
            </h3>
          </motion.div>

          {/* Hero cover image slots */}
          {heroImage && (
            <motion.div variants={rowVariants} className="relative aspect-[16/9] w-full border-[4px] border-black bg-black rounded-[12px] overflow-hidden my-4">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85"
                style={{ backgroundImage: `url(${heroImage})` }}
              />
              <div aria-hidden className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] opacity-15 pointer-events-none" />
            </motion.div>
          )}

          {/* Story slots list */}
          <div className="space-y-4 mt-6">
            {stories.map((story, i) => (
              <motion.div
                key={i}
                variants={rowVariants}
                className="bg-black/50 border-[3px] border-black p-4 rounded-[12px] shadow-[4px_4px_0_0_black]"
              >
                <div className="font-mono text-[9px] text-wedding-accent-2 font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🏆 LEVEL COMPLETED:</span>
                  <span className="text-white bg-wedding-accent px-1.5 py-0.5 rounded border border-black text-[8px] shadow-[1px_1px_0_0_black]">
                    {formatInvitationMonthYear(story.date)}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-white/80 uppercase tracking-wide leading-relaxed">
                  {story.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Swipe support calculation
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 600 : -600,
    opacity: 0,
  }),
};

// --- PHOTO GALLERY / INVENTORY SLOTS ---
export function GallerySection({
  photos,
  heading,
  isReady,
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const assets = useOverlayAssets();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const handleDownload = async (e: React.MouseEvent, url: string, index: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `inventory-photo-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + newDirection + photos.length) % photos.length;
    });
  }, [photos.length]);

  const showNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    paginate(1);
  }, [paginate]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    paginate(-1);
  }, [paginate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  if (!isReady || !photos.length) return null;

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* Background perspective details */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 w-full h-[120px] opacity-20"
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
          <motion.div variants={rowVariants} className="text-center mb-6">
            <h3 className="font-mono font-black text-[22px] text-white uppercase tracking-widest [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)]">
              {heading || "LOOT INVENTORY"}
            </h3>
          </motion.div>

          {/* Photo slots grid */}
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo, i) => {
              const itemSpan = i % 3 === 0 ? "col-span-2 aspect-[16/10]" : "col-span-1 aspect-square";

              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(0);
                    setSelectedIndex(i);
                  }}
                  variants={rowVariants}
                  className={`relative w-full ${itemSpan} border-[3px] border-black rounded-[12px] bg-black overflow-hidden shadow-[4px_4px_0_0_black] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_black] active:scale-[0.98] transition-all group`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500 opacity-90"
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                  {/* Neon screen grid inside image */}
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[size:100%_4px] opacity-15 pointer-events-none" />

                  {/* Slot identifier sticker */}
                  <div className="absolute top-2 left-2 bg-black border border-white/20 text-wedding-accent-2 px-1.5 py-0.5 rounded font-mono font-black text-[8px] uppercase tracking-wider opacity-90">
                    SLOT {i + 1}
                  </div>

                  {/* Floating Action Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity z-20 pointer-events-none">
                    <span className="font-mono font-black text-[10px] uppercase bg-yellow-400 border-[2px] border-black text-black px-3 py-1 rounded shadow-[2px_2px_0_0_black]">
                      🔎 INSPECT
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Inspector Portal */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-[var(--invitation-dark)] flex flex-col items-center justify-center p-4 bg-wedding-dark/95"
              onClick={() => setSelectedIndex(null)}
            >
              {/* Halftone CRT effect on background screen */}
              <div aria-hidden className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] bg-[size:100%_4px,6px_100%] opacity-20" />

              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-[100000] pointer-events-none">
                {/* Index tag */}
                <div className="font-mono font-black tracking-widest text-[12px] bg-black border-[3px] border-black text-wedding-accent-2 px-4 py-1.5 rounded-[6px] pointer-events-auto shadow-[4px_4px_0_0_black]">
                  SLOT {selectedIndex + 1} / {photos.length}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 pointer-events-auto">
                  {/* Download */}
                  <button
                    onClick={(e) => handleDownload(e, photos[selectedIndex], selectedIndex)}
                    className="p-2.5 bg-yellow-400 border-[2px] border-black rounded-[6px] shadow-[3px_3px_0_0_black] text-black active:translate-y-[2px] active:shadow-[1px_1px_0_0_black] hover:bg-yellow-300 transition-colors"
                  >
                    📥
                  </button>
                  {/* Close */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(null);
                    }}
                    className="p-2.5 bg-wedding-accent border-[2px] border-black rounded-[6px] shadow-[3px_3px_0_0_black] text-white active:translate-y-[2px] active:shadow-[1px_1px_0_0_black] hover:bg-wedding-accent/90 transition-colors"
                  >
                    ✖️
                  </button>
                </div>
              </div>

              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={showPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black border-[2px] border-black text-wedding-accent-2 rounded-full shadow-[3px_3px_0_0_black] active:translate-y-[1px] active:shadow-[2px_2px_0_0_black] z-[100000] pointer-events-auto"
                  >
                    ◀
                  </button>
                  <button
                    onClick={showNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black border-[2px] border-black text-wedding-accent-2 rounded-full shadow-[3px_3px_0_0_black] active:translate-y-[1px] active:shadow-[2px_2px_0_0_black] z-[100000] pointer-events-auto"
                  >
                    ▶
                  </button>
                </>
              )}

              {/* Main lightbox Image container */}
              <div
                className="relative w-full h-full flex justify-center items-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={selectedIndex}
                    src={photos[selectedIndex]}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 260, damping: 26 },
                      opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -8000) {
                        paginate(1);
                      } else if (swipe > 8000) {
                        paginate(-1);
                      }
                    }}
                    className="absolute max-h-[75vh] max-w-[85vw] border-[5px] border-black rounded-[16px] bg-black shadow-[10px_10px_0_0_black] object-contain cursor-grab active:cursor-grabbing"
                    alt=""
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

// --- GRATITUDE / STAGE CLEAR SCREEN ---
export function GratitudeSection({
  hosts,
  message,
  isReady,
}: GratitudeSectionProps) {
  const assets = useOverlayAssets();
  const celebrant = hosts[0];

  if (!isReady || !celebrant) return null;

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* perspective grid floor */}
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
          <motion.div variants={rowVariants} className="text-center mb-6">
            <motion.div
              className="inline-block bg-lime-500 border-[3px] border-black text-black px-6 py-2 rounded-[8px] font-mono font-black text-[20px] uppercase tracking-widest shadow-[4px_4px_0_0_black] animate-bounce"
            >
              STAGE CLEAR!
            </motion.div>
          </motion.div>

          {/* completion details */}
          <motion.div variants={rowVariants} className="py-2 text-center font-mono text-[10px] text-wedding-accent-2/95 tracking-widest uppercase font-black mb-4">
            🏆 LEVEL 100% COMPLETE 🏆
          </motion.div>

          {/* message bubble */}
          <motion.div variants={rowVariants} className="bg-black/50 border-[3px] border-black p-5 rounded-[16px] shadow-[4px_4px_0_0_black] relative mb-6">
            {/* Screw buttons */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/20" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/20" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/20" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/20" />

            <p className="font-mono text-[11px] leading-relaxed text-white/90 text-center uppercase tracking-wide">
              &quot;{message}&quot;
            </p>
          </motion.div>

          {/* Signature */}
          <motion.div variants={rowVariants} className="flex justify-center">
            <div className="bg-yellow-400 border-[2px] border-black text-black font-mono font-black text-[12px] uppercase px-5 py-2 rounded shadow-[3px_3px_0_0_black]">
              SIGNED: {celebrant.firstName}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- FOOTER CREDITS SECTION ---
export function FooterSection({
  hosts,
  message,
  isReady,
}: FooterSectionProps) {
  const assets = useOverlayAssets();
  const celebrant = hosts[0];

  if (!isReady || !celebrant) return null;

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-wedding-dark border-t-[5px] border-black">
      {/* Stars Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
        }}
      />

      {/* perspective mountain row */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 opacity-30"
        style={{
          backgroundImage: `url(${assets.footerGraphic})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[500px] text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* Main Footer title */}
          <motion.div variants={rowVariants}>
            <h4 className="font-mono font-black text-[30px] leading-none text-white uppercase tracking-wider [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)]">
              GAME OVER
            </h4>
            <p className="font-mono text-[9px] text-wedding-accent-2/80 tracking-widest uppercase font-black mt-2">
              THANKS FOR PLAYING!
            </p>
          </motion.div>

          {/* Desc */}
          <motion.div variants={rowVariants}>
            <p className="font-mono text-[10px] leading-relaxed text-white/50 uppercase tracking-widest max-w-[320px] mx-auto">
              {message || "MADE WITH ACTIVID RETRO ENGINE. ALL RIGHTS RESERVED."}
            </p>
          </motion.div>

          {/* Back Action button */}
          <motion.div variants={rowVariants} className="pt-2">
            <motion.a
              href="https://activid.web.id"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex flex-col items-center justify-center bg-wedding-accent border-[3px] border-black px-6 py-3 rounded-[10px] text-white shadow-[0_4px_0_0_black] hover:bg-wedding-accent/90 active:translate-y-[2px] active:shadow-[0_2px_0_0_black] text-center"
            >
              <span className="font-mono font-black text-[13px] tracking-widest [text-shadow:1px_1px_0_#000]">
                INSERT COIN TO REPLAY
              </span>
              <span className="block text-[7px] tracking-wider font-mono text-white/70 font-bold mt-1">
                RETURN TO ACTIVID HOME
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
