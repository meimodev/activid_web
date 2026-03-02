"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { SatrunIcon } from "./graphics";

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

  // Limit to 9 photos for the grid
  const displayPhotos = photos.slice(0, 9);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + newDirection + displayPhotos.length) % displayPhotos.length;
    });
  }, [displayPhotos.length]);

  const showNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    paginate(1);
  }, [paginate]);

  const showPrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    paginate(-1);
  }, [paginate]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;

    const imageUrl = displayPhotos[selectedIndex];
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from URL or use a default
      const filename = `memory-${selectedIndex + 1}.jpg`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: Open in new tab
      window.open(imageUrl, '_blank');
    }
  };

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
    <section className="py-32 relative text-wedding-on-dark bg-wedding-dark pointer-events-auto">

      <div className="container mx-auto px-4 relative z-10">
        <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.18} className="w-full">
          <div className="flex flex-col items-center mb-20 text-center">
            <SatrunIcon />
            <h2 className="font-heading text-3xl tracking-[0.2em]">{heading}</h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Constellation Lines SVG Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 hidden ">
              <svg width="100%" height="100%">
                <line x1="16%" y1="16%" x2="50%" y2="50%" stroke="var(--invitation-accent-2)" strokeWidth="1" />
                <line x1="84%" y1="16%" x2="50%" y2="50%" stroke="var(--invitation-accent-2)" strokeWidth="1" />
                <line x1="16%" y1="84%" x2="50%" y2="50%" stroke="var(--invitation-accent-2)" strokeWidth="1" />
                <line x1="84%" y1="84%" x2="50%" y2="50%" stroke="var(--invitation-accent-2)" strokeWidth="1" />
                <line x1="50%" y1="16%" x2="50%" y2="84%" stroke="var(--invitation-accent)" strokeWidth="1" strokeDasharray="5,5" />
              </svg>
            </div>

            <StaggerRevealOnScroll
              direction="up"
              width="100%"
              staggerDelay={0.12}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10"
            >
              {displayPhotos.map((photo, index) => (
                <button
                  key={index}
                  type="button"
                  className="block w-full relative aspect-[4/5] cursor-pointer group pointer-events-auto rounded-xl overflow-hidden border border-wedding-on-dark/10 hover:border-wedding-accent/50 transition-all duration-700 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_30%,transparent)] bg-wedding-dark/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(0);
                    setSelectedIndex(index);
                  }}
                >
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    className="block w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 pointer-events-none"
                  />
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-wedding-dark/90 via-wedding-dark/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Subtle Scanline */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wedding-accent/10 to-transparent h-[200%] w-full animate-scan pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Memory Label */}
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-wedding-accent/80 tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    MEM_SEQ_{index + 1}
                  </div>
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-wedding-accent opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100" />
                </button>
              ))}
            </StaggerRevealOnScroll>
          </div>
        </StaggerRevealOnScroll>
      </div>

      {/* Lightbox Modal - Portalled to body to cover full viewport */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 z-[99999] bg-wedding-dark/90 flex flex-col items-center justify-center p-4 md:p-12 cursor-pointer"
            >
              {/* Top Bar Controls */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="text-wedding-on-dark font-mono text-xs tracking-widest  px-4 py-2 rounded-full   backdrop-blur-md pointer-events-auto">
                  {selectedIndex + 1} / {displayPhotos.length}
                </div>
                <div className="flex items-center gap-4 pointer-events-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(e); }}
                    className="flex items-center gap-2 px-4 py-2 bg-wedding-on-dark/5 hover:bg-wedding-accent hover:text-wedding-dark text-wedding-on-dark border border-wedding-on-dark/20 hover:border-wedding-accent rounded-full font-body text-xs tracking-widest transition-all duration-300"
                  >
                    <span>Download</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-wedding-on-dark/5 hover:bg-wedding-accent hover:text-wedding-dark text-wedding-on-dark border border-wedding-on-dark/20 hover:border-wedding-accent rounded-full font-body text-xs tracking-widest transition-all duration-300"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>

              {/* Main Image Viewer */}
              <div className="relative w-full h-full flex items-center justify-center pointer-events-none max-w-6xl mx-auto">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.img
                    key={selectedIndex}
                    src={displayPhotos[selectedIndex]}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
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
                    onClick={(e) => e.stopPropagation()}
                    alt={`Memory ${selectedIndex + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain cursor-grab active:cursor-grabbing rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-wedding-on-dark/10 pointer-events-auto"
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              {displayPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); showPrev(e); }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-wedding-on-dark/50 hover:text-wedding-accent transition-colors z-50 group bg-wedding-dark/30 hover:bg-wedding-dark/80 rounded-full backdrop-blur-md border border-transparent hover:border-wedding-accent/30 pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <span className="text-2xl group-hover:-translate-x-1 transition-transform inline-block">←</span>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); showNext(e); }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-wedding-on-dark/50 hover:text-wedding-accent transition-colors z-50 group bg-wedding-dark/30 hover:bg-wedding-dark/80 rounded-full backdrop-blur-md border border-transparent hover:border-wedding-accent/30 pointer-events-auto"
                    aria-label="Next image"
                  >
                    <span className="text-2xl group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
