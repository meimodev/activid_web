"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface GalleryProps {
  photos: string[];
  heading: string;
}

export function Gallery({ photos, heading }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Limit to 10 photos for the grid
  const displayPhotos = photos.slice(0, 10);
  const lightboxPhotos = displayPhotos;
  const total = lightboxPhotos.length;
  const selected = selectedIndex === null ? null : lightboxPhotos[selectedIndex];
  const isLightboxOpen = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < total;

  const paginate = useCallback(
  (nextDirection: 1 | -1) => {
  if (!total) return;
  setDirection(nextDirection);
  setSelectedIndex((prev) => {
  if (prev === null) return 0;
  return (prev + nextDirection + total) % total;
  });
  },
  [total]
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

  const slideVariants = {
  enter: (direction: number) => ({
  x: direction > 0 ? 140 : -140,
  opacity: 0
  }),
  center: {
  zIndex: 1,
  x: 0,
  opacity: 1
  },
  exit: (direction: number) => ({
  zIndex: 0,
  x: direction > 0 ? -140 : 140,
  opacity: 0
  })
  };

  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  return (
  <section className="relative overflow-hidden bg-[#612A35] py-24 text-white ">
  <div aria-hidden className="pointer-events-none absolute inset-0">
  <div className="absolute inset-0 z-0">
  <motion.div
  className="absolute -left-32 top-16 h-[520px] w-[520px] rounded-full blur-3xl opacity-35"
  style={{
  background:
  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0) 62%)",
  willChange: "transform, opacity",
  }}
  animate={{ x: [0, 28, -14, 0], y: [0, -18, 10, 0], opacity: [0.26, 0.4, 0.3, 0.26] }}
  transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute -right-40 top-40 h-[620px] w-[620px] rounded-full blur-3xl opacity-30"
  style={{
  background:
  "radial-gradient(circle at 60% 45%, rgba(255,220,230,0.16), rgba(255,255,255,0) 64%)",
  willChange: "transform, opacity",
  }}
  animate={{ x: [0, -26, 12, 0], y: [0, 16, -10, 0], opacity: [0.2, 0.34, 0.26, 0.2] }}
  transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute left-1/2 bottom-[-220px] h-[720px] w-[720px] -translate-x-1/2 rounded-full blur-3xl opacity-25"
  style={{
  background:
  "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18), rgba(255,255,255,0) 66%)",
  willChange: "transform, opacity",
  }}
  animate={{ y: [0, -22, 0], opacity: [0.18, 0.3, 0.18] }}
  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
  />
  </div>

  <div className="absolute inset-0 z-10">
  <motion.div
  className="absolute -left-32 top-12 h-[520px] w-[520px] rotate-[8deg] bg-contain bg-no-repeat opacity-14"
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})` }}
  animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [8, 10, 8] }}
  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute -right-44 bottom-10 h-[640px] w-[640px] -rotate-[10deg] bg-contain bg-no-repeat opacity-12"
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})` }}
  animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-10, -8, -10] }}
  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
  />
  </div>
  </div>

  <div className="container mx-auto px-4 relative z-20">
  <div className="mx-auto w-full max-w-[560px]">
  <RevealOnScroll direction="none" scale={1} delay={0.1} width="100%">
  <div className="flex items-center justify-end gap-4">
  <div className="h-px flex-1 bg-white/25" />
  <div className="h-2 w-2 rounded-full bg-white/55" />
  <h2 className="font-tan-mon-cheri text-[58px] leading-none text-white ">{heading}</h2>
  </div>
  </RevealOnScroll>

  <div className="mt-14 overflow-hidden rounded-[28px] bg-white/12 ring-1 ring-white/15">
  <div className="grid grid-cols-2 gap-0 ">
  {displayPhotos.map((p, idx) => (
  <RevealOnScroll
  key={`${p}-${idx}`}
  direction="none"
  scale={1}
  delay={0.18 + idx * 0.08}
  width="100%"
  >
  <button
  type="button"
  onClick={() => {
  setDirection(1);
  setSelectedIndex(idx);
  }}
  className="group relative w-full aspect-square overflow-hidden bg-[#612A35]"
  >
  <img
  src={p}
  alt={`Gallery photo ${idx + 1}`}
  className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
  />
  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
  </button>
  </RevealOnScroll>
  ))}
  </div>
  </div>
  </div>
  </div>

  {/* Lightbox Modal */}
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
  <div
  className="relative h-[86vh] w-full max-w-5xl pointer-events-none"
  >
  {/* Image Container */}
  <div
  className="relative h-full w-full overflow-hidden rounded-2xl bg-white p-2 pointer-events-auto shadow-2xl "
  onClick={(e) => e.stopPropagation()}
  >
  <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 bg-white/85 px-4 py-3 text-xs tracking-widest uppercase backdrop-blur">
  <button
  onClick={handleDownload}
  className="text-stone-800 hover:text-stone-500 transition-colors flex items-center gap-2 group"
  >
  <span className="text-lg group-hover:animate-bounce">↓</span> Download
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

  {/* Image Viewport - Overflow hidden for slide animation */}
  <div className="relative h-full w-full overflow-hidden bg-stone-100 pt-12 ">
  <AnimatePresence initial={false} custom={direction} mode="wait">
  <motion.img
  key={selected}
  src={selected}
  custom={direction}
  variants={slideVariants}
  initial="enter"
  animate="center"
  exit="exit"
  transition={{
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
  }}
  alt={`Memory ${selectedIndex + 1}`}
  className="w-full h-full object-contain absolute inset-0"
  drag={total > 1 ? "x" : false}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={1}
  onDragEnd={(_, info) => {
  if (total <= 1) return;
  const swipe = swipePower(info.offset.x, info.velocity.x);
  if (swipe < -9000) paginate(1);
  else if (swipe > 9000) paginate(-1);
  }}
  />
  </AnimatePresence>
  </div>
  </div>

  {/* Navigation Buttons */}
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
  document.body
  )
  : null}
  </section>
  );
}
