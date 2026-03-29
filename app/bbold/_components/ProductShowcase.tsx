"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export default function ProductShowcase({ images }: { images: string[] }) {
  const orderedImages = useMemo(() => shuffleImages(images), [images]);
  const [[page, direction], setPage] = useState<[number, number]>([0, 1]);
  const draggedRef = useRef(false);

  const paginate = useCallback(
    (nextDirection: number) => {
      if (orderedImages.length <= 1) return;
      setPage(([currentPage]) => [currentPage + nextDirection, nextDirection]);
    },
    [orderedImages.length],
  );

  useEffect(() => {
    if (orderedImages.length <= 1) return;
    const timer = window.setInterval(() => {
      paginate(1);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [orderedImages.length, paginate]);

  const safeIndex = useMemo(
    () => (orderedImages.length > 0 ? toPositiveModulo(page, orderedImages.length) : 0),
    [orderedImages.length, page],
  );
  const image = useMemo(() => orderedImages[safeIndex] ?? orderedImages[0] ?? "", [orderedImages, safeIndex]);

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

  return (
    <div
      className="relative h-88 overflow-hidden rounded-4xl bg-[#4b5563] shadow-2xl"
      onClick={() => {
        if (draggedRef.current) {
          draggedRef.current = false;
        }
      }}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={`product-showcase-${page}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
          drag={orderedImages.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onPointerDownCapture={() => {
            draggedRef.current = false;
          }}
          onDragStart={() => {
            draggedRef.current = true;
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 touch-pan-y bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${image})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-black/10" />
    </div>
  );
}
