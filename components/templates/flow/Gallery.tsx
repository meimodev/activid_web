"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { GoldLeafBorder, DiamondAccent, SectionOrnament } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

interface GalleryProps {
  photos: string[];
  heading: string;
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

export function Gallery({ photos, heading }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [spans, setSpans] = useState<{ [key: number]: string }>({});

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    photos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        const ratio = img.width / img.height;
        let spanClass = "col-span-1 row-span-1";

        if (ratio > 1.4) {
          // Landscape
          spanClass = "col-span-2 row-span-1";
        } else if (ratio < 0.6) {
          // Portrait
          spanClass = "col-span-1 row-span-2";
        }

        setSpans((prev) => ({ ...prev, [index]: spanClass }));
      };
    });
  }, [photos]);

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
      // Fallback: open in new tab
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

  return (
    <section className="py-24 px-4 bg-wedding-bg/30 backdrop-blur-sm relative border-b border-wedding-accent/30 pointer-events-auto">
      <GoldLeafBorder position="top" />
      <RevealOnScroll direction="down" width="100%">
        <div className="flex flex-col items-center">
          <DiamondAccent />
          <h2 className="text-center font-script text-4xl text-gold-gradient mb-4 mt-4 py-5">
            {heading}
          </h2>
          <SectionOrnament />
        </div>
      </RevealOnScroll>

      <div className="relative z-20 grid grid-cols-2 gap-2 max-w-6xl mx-auto auto-rows-[250px] p-2 bg-wedding-bg shadow-2xl border border-wedding-accent/10 mt-12 grid-flow-dense rounded-xl">
        {photos.map((photo, i) => (
          <RevealOnScroll key={i} delay={i * 0.1} width="100%" className={spans[i] || "col-span-1 row-span-1"} fullHeight={true}>
            <button
              type="button"
              className="group relative block w-full h-full overflow-hidden rounded-lg bg-wedding-bg pointer-events-auto"
              onClick={() => {
                setDirection(0);
                setSelectedIndex(i);
              }}
            >
              <img 
                src={photo} 
                alt={`Gallery photo ${i + 1}`} 
                className="block w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-wedding-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </button>
          </RevealOnScroll>
        ))}
      </div>

      {/* Lightbox - Portalled to body to cover full viewport */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[99999] bg-wedding-dark/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
              onClick={() => setSelectedIndex(null)}
            >
              {/* Top Bar: Counter & Close */}
              <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center text-wedding-on-dark z-[100000] pointer-events-none">
                <div className="font-garet-book text-sm tracking-[0.2em] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md pointer-events-auto">
                  {selectedIndex + 1} / {photos.length}
                </div>
                <div className="flex items-center gap-4 pointer-events-auto">
                  <button
                    className="p-2 hover:text-wedding-accent-light transition-colors bg-black/40 rounded-full backdrop-blur-md group"
                    onClick={(e) => handleDownload(e, photos[selectedIndex], selectedIndex)}
                    title="Download Photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button
                    className="p-2 hover:text-wedding-accent-light transition-colors bg-black/40 rounded-full backdrop-blur-md group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(null);
                    }}
                    title="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform duration-300">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Buttons (Always visible as requested) */}
              {photos.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-wedding-on-dark hover:text-wedding-accent-light transition-colors bg-black/40 rounded-full backdrop-blur-md z-[100000] pointer-events-auto"
                    onClick={showPrev}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-wedding-on-dark hover:text-wedding-accent-light transition-colors bg-black/40 rounded-full backdrop-blur-md z-[100000] pointer-events-auto"
                    onClick={showNext}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </>
              )}

              <div
                className="relative w-full h-full flex justify-center items-center overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
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
                    className="absolute max-h-[85vh] max-w-[90vw] rounded-sm shadow-2xl border-2 border-wedding-on-dark/20 object-contain bg-black/50 cursor-grab active:cursor-grabbing"
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      <GoldLeafBorder position="bottom" />
    </section>
  );
}
