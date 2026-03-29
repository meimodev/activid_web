"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryGroup, ImageFit } from "../data";

function imageClassName(fit: ImageFit): string {
  return fit === "contain" ? "bg-contain bg-center bg-no-repeat" : "bg-cover bg-center";
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
}: {
  group: GalleryGroup;
  delay?: number;
  revealDelay?: number;
  className?: string;
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
  const labelClassName = group.labelWidthClassName ?? "h-12 w-12";

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
      className={`relative h-full w-full overflow-hidden ${group.href ? "cursor-pointer" : ""} ${className}`}
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
          className={`absolute inset-0 touch-pan-y ${imageClassName(group.fit)}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-black/10" />
      <div className={`absolute left-4 top-4 z-10 flex items-center justify-center rounded-full bg-[#372f2d]/80 px-4 text-center shadow-lg backdrop-blur-sm ${labelClassName}`}>
        <span className="text-lg leading-none" style={{ fontFamily: "var(--font-bbold-display)" }}>{group.label}</span>
      </div>
    </motion.div>
  );

  return content;
}
