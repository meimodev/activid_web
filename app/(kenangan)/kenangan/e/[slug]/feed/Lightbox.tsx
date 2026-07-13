"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KenanganLutId } from "@/data/kenangan-luts";
import GradedThumb from "./GradedThumb";

export interface LightboxPhoto {
  id: string;
  displaySrc: string;
  fullSrc: string;
  lutId: KenanganLutId;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 160 : -160, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -160 : 160, opacity: 0 }),
};

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

export default function Lightbox({
  photos,
  openId,
  onOpenId,
  onClose,
  canDownload,
}: {
  photos: LightboxPhoto[];
  openId: string | null;
  onOpenId: (id: string | null) => void;
  onClose: () => void;
  canDownload: boolean;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  // Which photo's graded canvas has painted — spinner shows until it matches.
  const [loadedId, setLoadedId] = useState<string | null>(null);
  // Last index the guest actually viewed. When the open photo is removed
  // (moderation), we clamp to this to auto-advance instead of closing.
  const lastIndexRef = useRef(0);

  const total = photos.length;
  const index = openId === null ? -1 : photos.findIndex((p) => p.id === openId);
  const current = index >= 0 ? (photos[index] ?? null) : null;

  useEffect(() => {
    if (index >= 0) lastIndexRef.current = index;
  }, [index]);

  // Open photo evicted by realtime (moderation hidden). Re-point openId to a
  // neighbour at the old position; close only if nothing is left. Brief exit
  // animation may flash — rare (moderation while a guest is viewing).
  // ponytail: accept the flash; hold the last frame if it reads bad.
  useEffect(() => {
    if (openId === null || index !== -1) return;
    if (total === 0) {
      onClose();
      return;
    }
    onOpenId(photos[Math.min(lastIndexRef.current, total - 1)].id);
  }, [openId, index, total, photos, onOpenId, onClose]);

  const loaded = current !== null && loadedId === current.id;
  const isOpen = current !== null;

  // Back button closes the lightbox instead of leaving the feed. Push one
  // history entry when it opens; a popstate (hardware/browser back) closes it.
  // Closing via UI runs cleanup, which pops the entry we pushed.
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ kkLightbox: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Only when closed by UI (our entry is still on top) — not when the pop
      // itself closed us (browser already removed it).
      if (window.history.state?.kkLightbox) window.history.back();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const paginate = (dir: 1 | -1) => {
      const i = photos.findIndex((p) => p.id === openId);
      if (i === -1) return;
      const next = i + dir;
      if (next < 0 || next >= photos.length) return; // clamp, no wrap
      setDirection(dir);
      onOpenId(photos[next].id);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [isOpen, openId, photos, onOpenId, onClose]);

  const paginate = (dir: 1 | -1) => {
    if (index === -1) return;
    const next = index + dir;
    if (next < 0 || next >= total) return; // clamp, no wrap
    setDirection(dir);
    onOpenId(photos[next].id);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {current ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="kk-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Foto"
          onClick={onClose}
        >
          <div className="kk-lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span className="kk-lightbox-count">
              {index + 1} / {total}
            </span>
            <div className="kk-lightbox-actions">
              {canDownload ? (
                <a href={current.fullSrc} className="kk-lightbox-action" aria-label="Unduh foto">
                  Unduh
                </a>
              ) : null}
              <button
                type="button"
                className="kk-lightbox-action"
                autoFocus
                onClick={onClose}
                aria-label="Tutup"
              >
                Tutup
              </button>
            </div>
          </div>

          <div className="kk-lightbox-stage" onClick={onClose}>
            {!loaded ? <div className="kk-lightbox-spinner" aria-hidden /> : null}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                className="kk-lightbox-slide"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                onClick={(e) => e.stopPropagation()}
                drag={total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (total <= 1) return;
                  const swipe = swipePower(info.offset.x, info.velocity.x);
                  if (swipe < -8000) paginate(1);
                  else if (swipe > 8000) paginate(-1);
                }}
              >
                <GradedThumb
                  src={current.displaySrc}
                  lutId={current.lutId}
                  alt="Foto tamu"
                  className="kk-lightbox-img"
                  onReady={() => setLoadedId(current.id)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
