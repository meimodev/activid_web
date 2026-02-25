"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";

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
    <section className="relative overflow-hidden bg-[#EFE7D6] py-24 text-[#2B2424] ">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-25 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
        <OverlayReveal
          delay={0.06}
          className="pointer-events-none absolute -left-40 top-10 h-[560px] w-[560px] rotate-[8deg]"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [8, 10, 8] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>

        <OverlayReveal
          delay={0.14}
          className="pointer-events-none absolute -right-44 bottom-10 h-[640px] w-[640px] -rotate-[10deg]"
        >
          <motion.div
            className="h-full w-full bg-contain bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.sprinkle})` }}
            animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-10, -8, -10] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </OverlayReveal>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-[560px]">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.08}
            width="100%"
          >
            <div className="flex items-center justify-end ">
              <div className="h-px flex-1 bg-[#4F5B4B]" />
              <div className="h-2 w-2 rounded-full bg-[#4F5B4B]" />
              <h2 className="font-brittany-signature text-[62px] leading-none text-[#4F5B4B] px-6 ">
                {heading}
              </h2>
                
              <div className="h-2 w-2 rounded-full bg-[#4F5B4B]" />
              <div className="h-px flex-1 bg-[#4F5B4B]" />
            </div>
          </RevealOnScroll>

          <div className="mt-12 overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-[#8b7a57]/35 shadow-[0_18px_55px_rgba(0,0,0,0.10)]">
            <div className="grid grid-cols-2 gap-0 ">
              {displayPhotos.map((p, idx) => (
                <RevealOnScroll
                  key={`${p}-${idx}`}
                  direction="none"
                  scale={1}
                  delay={0.14 + idx * 0.06}
                  width="100%"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setDirection(1);
                      setSelectedIndex(idx);
                    }}
                    className="group relative w-full aspect-square overflow-hidden bg-[#EFE7D6]"
                  >
                    <img
                      src={p}
                      alt={`Gallery photo ${idx + 1}`}
                      className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/15 opacity-0 transition-opacity group-hover:opacity-100" />
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
                  className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md "
                >
                  <div className="relative h-[86vh] w-full max-w-5xl pointer-events-none">
                    <div
                      className="relative h-full w-full overflow-hidden rounded-2xl bg-white p-2 pointer-events-auto shadow-2xl "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 bg-white/85 px-4 py-3 text-xs tracking-widest uppercase backdrop-blur">
                        <button
                          onClick={handleDownload}
                          className="text-stone-800 hover:text-stone-500 transition-colors flex items-center gap-2 group"
                        >
                          <span className="text-lg group-hover:animate-bounce">
                            ↓
                          </span>{" "}
                          Download
                        </button>

                        <div className="font-poppins text-[10px] text-stone-600">
                          {selectedIndex + 1} / {total}
                        </div>

                        <button
                          onClick={() => setSelectedIndex(null)}
                          className="text-stone-800 hover:text-stone-500 transition-colors"
                        >
                          Close
                        </button>
                      </div>

                      <div className="relative h-full w-full overflow-hidden bg-stone-100 pt-12 ">
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
                            className="w-full h-full object-contain absolute inset-0"
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
                          className="absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/85 p-3 text-stone-700 shadow-lg backdrop-blur transition-colors hover:bg-white pointer-events-auto "
                          aria-label="Previous image"
                        >
                          <span className="text-3xl font-light ">&lt;</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            paginate(1);
                          }}
                          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/85 p-3 text-stone-700 shadow-lg backdrop-blur transition-colors hover:bg-white pointer-events-auto "
                          aria-label="Next image"
                        >
                          <span className="text-3xl font-light ">&gt;</span>
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
