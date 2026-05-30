"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { PhotoPlaceholder, Divider } from "./graphics";
import { VineCascade } from "@/components/assets/vine-cascade";

interface GallerySectionProps {
  photos: string[];
}

export function GallerySection({ photos }: GallerySectionProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const tiles = photos && photos.length > 0
    ? photos.map((url, i) => ({
        w: i % 3 === 0 ? 2 : 1,
        h: i % 4 === 0 ? 2 : 1,
        src: url,
      }))
    : [
        { w: 2, h: 2, label: "PORTRAIT 01" },
        { w: 1, h: 1, label: "DETAIL" },
        { w: 1, h: 1, label: "CANDID" },
        { w: 1, h: 2, label: "BOUQUET" },
        { w: 2, h: 1, label: "TWO OF US" },
        { w: 1, h: 1, label: "RING" },
        { w: 2, h: 1, label: "GOLDEN HOUR" },
      ];

  // Filter tiles that are actual images for navigating in lightbox
  const images = tiles.filter(t => "src" in t && t.src) as { src: string }[];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx(prev => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <SectionWrap id="gallery">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0 overflow-hidden">
          <VineCascade className="w-full h-full opacity-45" />
        </div>
        <SectionHead eyebrow="Frozen in time" title="The" em="gallery" />
      </div>

      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "70px",
        }}
      >
        {tiles.map((t, i) => {
          const isImage = "src" in t && t.src;
          // Find index of this image in the filtered images array
          const imgIdx = isImage ? images.findIndex(img => img.src === t.src) : -1;

          return (
            <div
              key={i}
              onClick={() => {
                if (isImage && imgIdx !== -1) {
                  setActiveIdx(imgIdx);
                }
              }}
              className={`overflow-hidden relative transition-all duration-500 ${isImage ? "cursor-pointer hover:scale-[1.015] active:scale-[0.985]" : ""}`}
              style={{
                gridColumn: `span ${t.w}`,
                gridRow: `span ${t.h}`,
                border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
                boxShadow: isImage ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {isImage ? (
                <>
                  <img
                    src={t.src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-[var(--invitation-bg)] opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </>
              ) : (
                <PhotoPlaceholder label={"label" in t ? (t as { label: string }).label : "PHOTO"} />
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-7">
        <Divider width={180} />
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setActiveIdx(null)}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 select-none"
            style={{
              background: "rgba(29, 16, 32, 0.88)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            {/* Elegant Background Glow */}
            <div
              className="absolute pointer-events-none rounded-full w-[260px] h-[260px] blur-[80px]"
              style={{
                background: "radial-gradient(circle, color-mix(in srgb, var(--invitation-accent) 30%, transparent), transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Lightbox container */}
            <div className="relative max-w-[430px] w-full flex flex-col items-center">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setActiveIdx(null)}
                className="absolute top-[-52px] right-2.5 w-9 h-9 flex items-center justify-center rounded-full border cursor-pointer text-lg font-light transition-all duration-300"
                style={{
                  borderColor: "color-mix(in srgb, var(--invitation-accent) 40%, transparent)",
                  color: "var(--invitation-accent)",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                ✕
              </motion.button>

              {/* Main Image Frame */}
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative overflow-hidden p-1.5"
                style={{
                  width: "min(380px, 90vw)",
                  aspectRatio: "3/4",
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid color-mix(in srgb, var(--invitation-accent) 35%, transparent)",
                  boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8)",
                }}
              >
                {/* Corner ornaments inside lightbox */}
                <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[var(--invitation-accent)] opacity-70" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[var(--invitation-accent)] opacity-70" />

                <img
                  src={images[activeIdx]?.src}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </motion.div>

              {/* Pagination Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 font-[var(--font-royal-sans)] text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--invitation-accent-light)" }}
              >
                {activeIdx + 1} / {images.length}
              </motion.div>

              {/* Navigation Controls */}
              <div className="absolute left-[-16px] right-[-16px] top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center rounded-full border pointer-events-auto cursor-pointer transition-colors duration-300"
                  style={{
                    borderColor: "color-mix(in srgb, var(--invitation-accent) 25%, transparent)",
                    color: "var(--invitation-accent)",
                    background: "rgba(29, 16, 32, 0.6)",
                  }}
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 13L1 7L7 1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center rounded-full border pointer-events-auto cursor-pointer transition-colors duration-300"
                  style={{
                    borderColor: "color-mix(in srgb, var(--invitation-accent) 25%, transparent)",
                    color: "var(--invitation-accent)",
                    background: "rgba(29, 16, 32, 0.6)",
                  }}
                >
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 13L7 7L1 1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrap>
  );
}
