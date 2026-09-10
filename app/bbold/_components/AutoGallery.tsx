"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryGroup } from "../data";

function imageClassName(): string {
  return "bg-cover bg-center";
}

function shuffleImages(images: string[]): string[] {
  const next = [...images];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function toPositiveModulo(value: number, length: number): number {
  return ((value % length) + length) % length;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
    scale: 1.015,
  }),
  center: {
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
    scale: 1.015,
  }),
};

export default function AutoGallery({
  group,
  delay = 2800,
  revealDelay = 0,
  className = "",
  showCounter = false,
}: {
  group: GalleryGroup;
  delay?: number;
  revealDelay?: number;
  className?: string;
  showCounter?: boolean;
}) {
  const router = useRouter();
  const images = useMemo(() => shuffleImages(group.images), [group.images]);
  const [[page, direction], setPage] = useState<[number, number]>([0, 1]);
  const [isRevealed, setIsRevealed] = useState(false);
  const draggedRef = useRef(false);

  const paginate = useCallback(
    (nextDirection: number) => {
      if (images.length <= 1) return;
      setPage(([currentPage]) => [currentPage + nextDirection, nextDirection]);
    },
    [images.length],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsRevealed(true);
    }, revealDelay * 1000);

    return () => window.clearTimeout(timer);
  }, [revealDelay]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => {
      paginate(1);
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay, images.length, paginate]);

  const safeIndex = useMemo(
    () => (images.length > 0 ? toPositiveModulo(page, images.length) : 0),
    [images.length, page],
  );
  const slide = useMemo(() => images[safeIndex] ?? images[0] ?? "", [images, safeIndex]);
  const isShortLabel = group.label.length <= 3;
  const labelBadgeClasses = group.labelWidthClassName
    ? `${group.labelWidthClassName} max-w-[calc(100%-1.5rem)]`
    : isShortLabel
      ? "h-9 w-9 sm:h-11 sm:w-11 px-0"
      : "h-9 sm:h-11 px-3 sm:px-4 max-w-[calc(100%-1.5rem)]";

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      draggedRef.current = true;
      const { offset, velocity } = info;

      if (offset.x <= -60 || velocity.x <= -500) {
        paginate(1);
        return;
      }

      if (offset.x >= 60 || velocity.x >= 500) {
        paginate(-1);
      }
    },
    [paginate],
  );

  const content = (
    <motion.div
      initial={false}
      animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.985 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className={`group relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-white/5 transition-transform duration-300 hover:scale-[1.015] active:scale-[0.99] ${group.href ? "cursor-pointer" : ""} ${className}`}
      onClick={() => {
        if (draggedRef.current) {
          draggedRef.current = false;
          return;
        }

        if (group.href) {
          router.push(group.href);
        }
      }}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={`${group.label}-${page}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onPointerDownCapture={() => {
            draggedRef.current = false;
          }}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={handleDragEnd}
          className={`absolute inset-0 touch-pan-y ${imageClassName()}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />

      {/* Product label badge */}
      <div
        className={`absolute left-3 top-3 sm:left-4 sm:top-4 z-10 flex items-center justify-center rounded-full bg-[#1c1917]/85 text-center shadow-lg backdrop-blur-md border border-white/10 ${labelBadgeClasses}`}
      >
        <span
          className="text-sm sm:text-base leading-none text-stone-100"
          style={{ fontFamily: "var(--font-bbold-display)" }}
        >
          {group.label}
        </span>
      </div>

      {/* Multi-photo indicator */}
      {showCounter && images.length > 1 && (
        <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-white/90 backdrop-blur-md border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-3 h-3 text-white/80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="16" height="16" x="5" y="5" rx="2" />
            <path d="M3 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          <span className="tracking-wide">
            {safeIndex + 1}/{images.length}
          </span>
        </div>
      )}

      {/* Pinterest-style destination link indicator on desktop hover */}
      {group.href && (
        <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/25 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 border border-white/20 shadow-md">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
      )}
    </motion.div>
  );

  return content;
}
