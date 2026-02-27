"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";
import { SectionWrap } from "./SectionWrap";
import { VenusReveal } from "./reveal";

export function GallerySection({
  heading,
  photos,
}: {
  heading: string;
  photos: string[];
}) {
  return (
    <SectionWrap id="gallery" title={heading || "Gallery"}>
      <GalleryGrid photos={photos} />
    </SectionWrap>
  );
}

function GalleryGrid({ photos }: { photos: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const display = photos.slice(0, 12);
  const total = display.length;
  const selected = selectedIndex === null ? null : display[selectedIndex];

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
    if (selectedIndex === null) return;

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
  }, [paginate, selectedIndex]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 140 : -140, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -140 : 140, opacity: 0 }),
  };

  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {display.map((p, idx) => (
          <VenusReveal key={`${p}-${idx}`} delay={0.14 + idx * 0.06} width="100%">
            <button
              type="button"
              onClick={() => {
                setDirection(1);
                setSelectedIndex(idx);
              }}
              className="group relative w-full aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white/50"
            >
              <Image
                src={p}
                alt="Gallery"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </VenusReveal>
        ))}
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {selected && selectedIndex !== null && total > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedIndex(null)}
                  className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                >
                  <div
                    className="relative max-w-5xl w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="absolute -top-12 left-0 right-0 flex items-center justify-between gap-3 text-white/85">
                      <a
                        href={selected}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs tracking-[0.25em] uppercase font-body hover:text-white"
                      >
                        Download
                      </a>
                      <span className="text-xs tracking-[0.25em] uppercase font-body">
                        {selectedIndex + 1} / {total}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(null)}
                        className="text-xs tracking-[0.25em] uppercase font-body hover:text-white"
                      >
                        Close
                      </button>
                    </div>

                    {total > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => paginate(-1)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
                          aria-label="Previous image"
                        >
                          <span className="text-2xl leading-none">‹</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => paginate(1)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur flex items-center justify-center text-white"
                          aria-label="Next image"
                        >
                          <span className="text-2xl leading-none">›</span>
                        </button>
                      </>
                    ) : null}

                    <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden bg-black/20">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={selected}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 320, damping: 32 },
                            opacity: { duration: 0.2 },
                          }}
                          className="absolute inset-0"
                          drag={total > 1 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={1}
                          onDragEnd={(_, info) => {
                            if (total <= 1) return;
                            const swipe = swipePower(info.offset.x, info.velocity.x);
                            if (swipe < -9000) paginate(1);
                            else if (swipe > 9000) paginate(-1);
                          }}
                        >
                          <Image
                            src={selected}
                            alt="Full"
                            fill
                            sizes="100vw"
                            className="object-contain"
                            unoptimized
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
