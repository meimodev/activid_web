"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { CornerLineTopLeft, CornerLineBottomRight, SwoopingLineLeft, HairlineDivider } from "./graphics/ornaments";

interface GalleryProps {
  photos: string[];
  heading: string;
}

export function Gallery({ photos, heading }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const displayPhotos = photos.slice(0, 10);
  const lightboxPhotos = displayPhotos;
  const total = lightboxPhotos.length;
  const selected =
    selectedIndex === null ? null : (lightboxPhotos[selectedIndex] ?? null);
  const isLightboxOpen =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < total;

  const paginate = useCallback(
    (nextDirection: 1 | -1) => {
      if (!total) return;
      setDirection(nextDirection);
      setSelectedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + nextDirection + total) % total;
      });
    },
    [total],
  );

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isLightboxOpen, paginate]);

  const handleDownload = async (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;

    const imageUrl = lightboxPhotos[selectedIndex];
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `memory-${selectedIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank");
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 140 : -140, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir > 0 ? -140 : 140, opacity: 0 }),
  };

  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent ">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto w-full max-w-[600px]">
          <RevealOnScroll
            direction="up"
            distance={20}
            delay={0.1}
            width="100%"
          >
            <div className="flex items-center justify-center gap-6 mb-16">
              <div className="h-px flex-1 bg-wedding-accent/30" />
              <h2 className="font-display italic text-center text-[48px] leading-none text-wedding-accent">
                {heading}
              </h2>
              <div className="h-px flex-1 bg-wedding-accent/30" />
            </div>
          </RevealOnScroll>

          <div className="mt-8 border border-wedding-accent/20 bg-transparent rounded-[16px] p-4 relative">
            <HairlineDivider />
            <div className="absolute -top-3 -left-3 z-10 pointer-events-none opacity-40">
              <CornerLineTopLeft />
            </div>
            <div className="absolute -bottom-3 -right-3 z-10 pointer-events-none opacity-40">
              <CornerLineBottomRight />
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-40">
              <SwoopingLineLeft />
            </div>
            <div className="grid grid-cols-2 gap-4 rounded-[12px] overflow-hidden">
              {displayPhotos.map((p, idx) => (
                <RevealOnScroll
                  key={`${p}-${idx}`}
                  direction="up"
                  distance={20}
                  delay={0.1 + (idx % 2) * 0.1}
                  width="100%"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDirection(1);
                      setSelectedIndex(idx);
                    }}
                    className="group relative w-full aspect-[4/5] overflow-hidden bg-wedding-accent/5 rounded-[8px]"
                  >
                    <img
                      src={p}
                      alt={`Gallery photo ${idx + 1}`}
                      loading="lazy"
                      className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-wedding-bg/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selectedIndex !== null && selected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedIndex(null)}
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-wedding-bg/95 p-3 backdrop-blur-sm "
                >
                  <div className="relative h-[86vh] w-full max-w-5xl pointer-events-none">
                    <div
                      className="relative h-full w-full overflow-hidden rounded-[20px] bg-wedding-bg border border-wedding-accent/20 pointer-events-auto shadow-2xl "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 bg-wedding-bg/85 border-b border-wedding-accent/10 px-6 py-4 text-xs tracking-widest uppercase backdrop-blur">
                        <button
                          onClick={handleDownload}
                          className="text-wedding-accent hover:text-wedding-accent/70 transition-colors flex items-center gap-2 group font-body font-bold"
                        >
                          <span className="text-lg group-hover:animate-bounce">
                            ↓
                          </span>{" "}
                          Download
                        </button>

                        <div className="font-body font-bold text-[11px] text-wedding-accent/70">
                          {selectedIndex + 1} / {total}
                        </div>

                        <button
                          onClick={() => setSelectedIndex(null)}
                          className="text-wedding-accent hover:text-wedding-accent/70 transition-colors font-body font-bold"
                        >
                          Tutup
                        </button>
                      </div>

                      <div className="relative h-full w-full overflow-hidden bg-wedding-bg pt-14 pb-4 px-4">
                        <AnimatePresence
                          initial={false}
                          custom={direction}
                          mode="wait"
                        >
                          <motion.img
                            key={selected}
                            src={selected}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              },
                              opacity: { duration: 0.2 },
                            }}
                            alt={`Memory ${selectedIndex + 1}`}
                            className="w-full h-full object-contain absolute inset-0 pt-14 pb-4 px-4 rounded-[8px]"
                            drag={total > 1 ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(_, info) => {
                              if (total <= 1) return;
                              const swipe = swipePower(
                                info.offset.x,
                                info.velocity.x,
                              );
                              if (swipe < -9000) paginate(1);
                              else if (swipe > 9000) paginate(-1);
                            }}
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    {total > 1 ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            paginate(-1);
                          }}
                          className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full border border-wedding-accent/30 bg-wedding-bg/90 p-4 text-wedding-accent shadow-lg backdrop-blur transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent pointer-events-auto "
                          aria-label="Previous image"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            paginate(1);
                          }}
                          className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full border border-wedding-accent/30 bg-wedding-bg/90 p-4 text-wedding-accent shadow-lg backdrop-blur transition-colors hover:bg-wedding-accent hover:text-wedding-on-accent pointer-events-auto "
                          aria-label="Next image"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </section>
  );
}
