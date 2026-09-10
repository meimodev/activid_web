"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function shuffleImages(images: string[]): string[] {
  const next = [...images];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export default function ProductShowcase({ images }: { images: string[] }) {
  const orderedImages = useMemo(() => shuffleImages(images), [images]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      const el = scrollerRef.current;
      if (!el || orderedImages.length === 0) return;
      const targetIndex = ((index % orderedImages.length) + orderedImages.length) % orderedImages.length;
      el.scrollTo({
        left: targetIndex * el.clientWidth,
        behavior: smooth ? "smooth" : "auto",
      });
      setActiveIndex(targetIndex);
    },
    [orderedImages.length],
  );

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index >= 0 && index < orderedImages.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex, orderedImages.length]);

  // Automatic carousel rotation
  useEffect(() => {
    if (orderedImages.length <= 1) return;
    if (isHovered || isTouching) return;

    const timer = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const nextIndex = (activeIndex + 1) % orderedImages.length;
      scrollToIndex(nextIndex, true);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [activeIndex, isHovered, isTouching, orderedImages.length, scrollToIndex]);

  // Mouse drag-to-scroll support for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragStateRef.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.isDown) return;
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - state.startX) * 1.3;
    if (Math.abs(walk) > 6) {
      state.hasMoved = true;
    }
    el.scrollLeft = state.scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    const state = dragStateRef.current;
    if (!state.isDown) return;
    state.isDown = false;
    const el = scrollerRef.current;
    if (el) {
      const targetIndex = Math.round(el.scrollLeft / el.clientWidth);
      const clampedIndex = Math.max(0, Math.min(orderedImages.length - 1, targetIndex));
      scrollToIndex(clampedIndex, true);
    }
  };

  return (
    <div
      className="group relative h-88 sm:h-96 md:h-[26rem] w-full overflow-hidden rounded-3xl sm:rounded-4xl bg-neutral-900 shadow-2xl border border-white/10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUpOrLeave();
      }}
    >
      {/* Horizontally scrollable track */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {orderedImages.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="relative h-full w-full min-w-full shrink-0 snap-center overflow-hidden"
          >
            {/* Image filling end-to-end */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${img})` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Slide Counter Badge */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wider text-white/90 shadow-lg backdrop-blur-md border border-white/10 pointer-events-none select-none">
        <span>{activeIndex + 1}</span>
        <span className="text-white/40">/</span>
        <span>{orderedImages.length}</span>
      </div>

      {/* Desktop Navigation Chevrons (visible on hover) */}
      {orderedImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToIndex(activeIndex - 1);
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 opacity-0 shadow-lg backdrop-blur-md border border-white/10 transition-all duration-200 hover:bg-black/80 hover:scale-105 active:scale-95 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToIndex(activeIndex + 1);
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/90 opacity-0 shadow-lg backdrop-blur-md border border-white/10 transition-all duration-200 hover:bg-black/80 hover:scale-105 active:scale-95 group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      {/* Indicators at bottom */}
      {orderedImages.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center select-none pointer-events-auto">
          {orderedImages.length <= 8 ? (
            <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-lg">
              {orderedImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToIndex(i);
                  }}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="h-1.5 w-24 sm:w-32 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{
                    width: `${((activeIndex + 1) / orderedImages.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
