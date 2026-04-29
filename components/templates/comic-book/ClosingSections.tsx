"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Host, StoryItem } from "@/types/invitation";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import { useOverlayAssets } from "./overlays";

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

const panelVariants = {
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
} as const;

interface SectionProps {
  isReady?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
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

export function StorySection({
  stories,
  heading,
  fallbackImageUrl,
  isReady,
}: StorySectionProps) {
  const assets = useOverlayAssets();
  const heroImage = stories[0]?.imageUrl ?? fallbackImageUrl;

  if (!isReady) return null;

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-0 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <motion.div
          className="absolute right-6 top-10"
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet1} alt="" className="w-16 h-auto opacity-30" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-[110%] -ml-[5%] -rotate-1 mb-16"
        >
          {/* Chaotic Solid Shadow */}
          <div className="absolute inset-0 bg-black -rotate-[1.5deg] translate-y-[12px] z-0" />
          
          <div className="relative bg-black p-[5px] grid grid-cols-2 gap-[5px] z-10">
            {/* Asymmetrical Top Border (jagged edge built from SVG blending with bg-black) */}
            <svg className="absolute top-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
              <polygon points="0,0 100,12 0,12" fill="black" />
            </svg>
            <svg className="absolute bottom-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
              <polygon points="0,0 100,0 100,12" fill="black" />
            </svg>

            {/* Header Panel */}
            <motion.div variants={panelVariants} className="col-span-2 bg-wedding-accent flex justify-center items-center py-12 relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px]">
              <motion.div variants={popVariants} className="relative z-20">
                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 pointer-events-none" style={{ clipPath: "polygon(5% 0%, 100% 5%, 95% 100%, 0% 90%)" }} />
                <div className="relative bg-white px-8 py-5 flex items-center justify-center border-4 border-black" style={{ clipPath: "polygon(5% 0%, 100% 5%, 95% 100%, 0% 90%)" }}>
                  <h2 className="font-black text-[32px] leading-none tracking-tight text-black uppercase rotate-[-2deg]">
                    {heading}
                  </h2>
                </div>
              </motion.div>
            </motion.div>

            {/* Image Panel */}
            {heroImage && (
              <motion.div variants={panelVariants} className="col-span-2 bg-white p-4 flex justify-center items-center relative">
                <motion.div variants={popVariants} className="w-full">
                  <img
                    src={heroImage}
                    alt="Story hero"
                    className="w-full aspect-video border-4 border-black object-cover"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Stories Grid Panels */}
            {stories.map((story, i) => {
              const spanClass = "col-span-2";
              const bgClass = ["bg-white", "bg-wedding-accent-2", "bg-wedding-accent"][i % 3];
              const textClass = i % 3 === 0 ? "text-black" : "text-white";
              const labelBgClass = i % 3 === 0 ? "bg-wedding-accent" : "bg-black";
              const labelTextClass = "text-white";

              return (
                <motion.div variants={panelVariants} key={i} className={`relative ${spanClass} ${bgClass} p-5 flex flex-col justify-center items-start overflow-hidden`}>
                  {/* Subtle texture in panel */}
                  <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "120px" }} />
                  
                  <div className="relative z-10 w-full">
                    <motion.div variants={popVariants} className={`inline-flex items-center justify-center ${labelBgClass} px-3 py-1 font-garet-book font-bold text-[10px] uppercase tracking-[0.2em] ${labelTextClass} border-2 border-black -rotate-2 mb-3 shadow-[2px_2px_0_0_black]`}>
                      {formatInvitationMonthYear(story.date)}
                    </motion.div>
                    <motion.div variants={popVariants}>
                      <p className={`font-garet-book font-black text-[15px] leading-snug ${textClass} ${textClass === "text-white" ? "[text-shadow:1.5px_1.5px_0_black]" : ""}`}>
                        {story.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Utility to calculate swipe power
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Animation variants for sliding photos
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

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
      link.download = `gallery-photo-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
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

  // Keyboard navigation
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
    <section className="relative overflow-hidden bg-wedding-bg px-0 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-4 top-14"
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet2} alt="" className="w-12 h-auto opacity-30" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-[110%] -ml-[5%] bg-black p-[6px] grid grid-cols-2 gap-[6px] z-10 rotate-1 shadow-[8px_8px_0_0_black] mb-20"
        >
          {/* Asymmetrical Top Border */}
          <svg className="absolute top-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,0 100,12 0,12" fill="black" />
          </svg>
          {/* Asymmetrical Bottom Border */}
          <svg className="absolute bottom-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,12 100,0 100,12" fill="black" />
          </svg>

          {/* Header Panel */}
          <motion.div variants={panelVariants} className="col-span-2 bg-wedding-accent flex justify-center items-center py-10 relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px]">
            <motion.div variants={popVariants} className="relative z-20">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 pointer-events-none" style={{ clipPath: "polygon(2% 8%, 98% 2%, 95% 95%, 5% 98%)" }} />
              <div className="relative bg-white px-8 py-4 flex items-center justify-center border-4 border-black" style={{ clipPath: "polygon(2% 8%, 98% 2%, 95% 95%, 5% 98%)" }}>
                <h2 className="font-black text-[32px] leading-none tracking-tight text-black uppercase rotate-[1deg]">
                  {heading}
                </h2>
              </div>
            </motion.div>
          </motion.div>

          {/* Photos Grid */}
          {photos.map((photo, i) => {
            const spanClass = i % 3 === 0 ? "col-span-2 aspect-[16/9]" : "col-span-1 aspect-square";
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => {
                  setDirection(0);
                  setSelectedIndex(i);
                }}
                variants={popVariants}
                className={`relative w-full ${spanClass} overflow-hidden bg-white transition-transform hover:scale-[0.98] active:scale-[0.95] group cursor-pointer`}
              >
                <img
                  src={photo}
                  alt={`Gallery photo ${i + 1}`}
                  className="w-full h-full object-cover contrast-[1.1] transition-all duration-500 group-hover:scale-105"
                />
                {/* Action word on hover/active */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  <div className="bg-wedding-accent-2 border-4 border-black px-4 py-2 rotate-[-10deg] shadow-[4px_4px_0_0_black] scale-75 group-hover:scale-100 transition-transform">
                    <span className="font-black text-white text-xl uppercase tracking-widest">TAP!</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[99999] bg-wedding-accent flex flex-col items-center justify-center p-4"
              onClick={() => setSelectedIndex(null)}
            >
              {/* Comic Halftone Background for Lightbox */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center text-black z-[100000] pointer-events-none">
                <div className="font-garet-book font-black tracking-[0.2em] bg-white border-4 border-black px-5 py-2 rounded-xl pointer-events-auto shadow-[4px_4px_0_0_black] -rotate-2">
                  {selectedIndex + 1} / {photos.length}
                </div>
                <div className="flex items-center gap-4 pointer-events-auto">
                  <button
                    className="p-3 hover:bg-wedding-accent-2 hover:text-white transition-colors bg-white border-4 border-black rounded-xl group shadow-[4px_4px_0_0_black] rotate-2 active:scale-95"
                    onClick={(e) => handleDownload(e, photos[selectedIndex], selectedIndex)}
                    title="Download Photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button
                    className="p-3 hover:bg-wedding-accent-2 hover:text-white transition-colors bg-white border-4 border-black rounded-xl group shadow-[4px_4px_0_0_black] -rotate-2 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(null);
                    }}
                    title="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-black hover:bg-wedding-accent-2 hover:text-white transition-colors bg-white border-4 border-black rounded-full shadow-[4px_4px_0_0_black] z-[100000] pointer-events-auto active:scale-95"
                    onClick={showPrev}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-black hover:bg-wedding-accent-2 hover:text-white transition-colors bg-white border-4 border-black rounded-full shadow-[4px_4px_0_0_black] z-[100000] pointer-events-auto active:scale-95"
                    onClick={showNext}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </>
              )}

              <div
                className="relative w-full h-full flex justify-center items-center overflow-hidden pointer-events-auto"
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
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -10000) {
                        paginate(1);
                      } else if (swipe > 10000) {
                        paginate(-1);
                      }
                    }}
                    alt={`Full view ${selectedIndex + 1}`}
                    className="absolute max-h-[80vh] max-w-[85vw] border-4 border-black object-contain bg-white shadow-[16px_16px_0_0_black] cursor-grab active:cursor-grabbing rotate-1"
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

export function GratitudeSection({
  hosts,
  message,
  isReady,
}: GratitudeSectionProps) {
  const assets = useOverlayAssets();

  if (!isReady) return null;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--invitation-bg),color-mix(in_srgb,var(--invitation-accent-2)_8%,var(--invitation-bg)))] px-0 py-24 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0">
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
      </div>

      <div className="relative z-10 mx-auto max-w-[520px] text-center">
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-[110%] -ml-[5%] bg-black p-[5px] z-10 -rotate-1 shadow-[8px_8px_0_0_black]"
        >
          {/* Asymmetrical Top Border */}
          <svg className="absolute top-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,12 100,0 100,12" fill="black" />
          </svg>
          {/* Asymmetrical Bottom Border */}
          <svg className="absolute bottom-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,0 100,12 0,12" fill="black" />
          </svg>

          {/* Inner Grid Panel */}
          <motion.div variants={panelVariants} className="relative bg-wedding-accent bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px] px-6 py-16 flex flex-col items-center overflow-hidden">
            
            {/* Doodle Overlay */}
            <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none z-10" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "180px" }} />

            <div className="relative z-20 flex flex-col items-center w-full">
              <motion.div variants={itemVariants}>
                <p className="font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-white bg-black inline-block px-5 py-1.5 rounded-full shadow-[4px_4px_0_0_var(--invitation-accent-2)] -rotate-2">
                  Terima Kasih
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="mt-6 font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black,4px_4px_0_var(--invitation-accent-2),6px_6px_0_black]">
                  Sampai Jumpa di Pesta!
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="w-full mt-10">
                <div className="relative rounded-[24px] border-4 border-black bg-white px-6 py-8 shadow-[8px_8px_0_0_black] rotate-1">
                  {/* Speech bubble pointer */}
                  <div className="absolute top-[-10px] right-10 w-5 h-5 bg-white border-l-4 border-t-4 border-black rotate-45" />
                  <p className="font-garet-book font-bold text-[16px] leading-relaxed text-black">
                    {message}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8">
                <div className="inline-flex items-center gap-2 rounded-xl border-4 border-black bg-wedding-accent-2 px-8 py-3 font-garet-book font-black text-[22px] text-black shadow-[6px_6px_0_0_black] -rotate-2">
                  {hosts[0]?.firstName}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function FooterSection({
  hosts,
  message,
  isReady,
}: FooterSectionProps) {
  const assets = useOverlayAssets();

  if (!isReady) return null;

  return (
    <section className="relative overflow-hidden py-24" style={{ background: "var(--invitation-dark)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />
        <motion.div
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
      </div>

      <div className="relative z-10 mx-auto max-w-[520px] text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {hosts.length > 0 ? (
            <motion.div variants={popVariants}>
              <p className="font-garet-book font-bold text-[14px] uppercase tracking-[0.2em] text-wedding-dark bg-white inline-block px-5 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0_0_black] -rotate-2">
                {hosts[0]?.firstName}
                {hosts[1] ? ` & ${hosts[1].firstName}` : ""}
              </p>
            </motion.div>
          ) : null}

          <motion.div variants={popVariants}>
            <h2 className="mt-6 font-black text-[46px] leading-none tracking-tight text-white [text-shadow:-1.5px_-1.5px_0_black,1.5px_-1.5px_0_black,-1.5px_1.5px_0_black,1.5px_1.5px_0_black,4px_4px_0_var(--invitation-accent-2)]">
              Waktunya Pesta!
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="mt-5 font-garet-book text-[14px] leading-relaxed text-white/55">
              {message}
            </p>
          </motion.div>

          <motion.a
            href="https://invitation.activid.id"
            variants={itemVariants}
            className="mt-8 inline-flex items-center justify-center rounded-full border-4 border-black bg-wedding-accent px-8 py-4 font-garet-book font-bold text-[13px] uppercase tracking-widest text-white shadow-[6px_6px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] rotate-1"
          >
            Kembali ke Undangan
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
