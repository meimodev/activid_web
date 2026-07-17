"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { KenanganLutId } from "@/data/kenangan-luts";
import GradedThumb from "./GradedThumb";
import KkCompareSlider from "@/app/(kenangan)/kenangan/KkCompareSlider";

export interface LightboxPhoto {
  id: string;
  displaySrc: string;
  fullSrc: string;
  lutId: KenanganLutId;
  // AI-enhanced: displaySrc/fullSrc are the server-graded result; the original
  // backs the compare slider and its own download.
  enhanced: boolean;
  originalDisplaySrc?: string;
  originalFullSrc?: string;
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
  // Before/after compare, opt-in per photo. A toggle (not inline-always like
  // the host viewer) so swipe-nav keeps working on enhanced photos — the
  // slider owns horizontal drags while it's up. Keyed by photo id so
  // navigating away (swipe or arrows) drops back to normal view for free.
  const [comparingFor, setComparingFor] = useState<string | null>(null);
  const comparing = comparingFor !== null && comparingFor === openId;
  // Every close path clears compare state — otherwise reopening the same
  // photo lands straight back in compare with swipe-nav disabled (hardware
  // back on Android closes the lightbox mid-compare).
  const close = useCallback(() => {
    setComparingFor(null);
    onClose();
  }, [onClose]);
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
      // Plain onClose (no compare-state clear): setState is banned in effects,
      // and a comparingFor pointing at an evicted photo can't re-trigger.
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
    const onPop = () => close();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Only when closed by UI (our entry is still on top) — not when the pop
      // itself closed us (browser already removed it).
      if (window.history.state?.kkLightbox) window.history.back();
    };
  }, [isOpen, close]);

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
      // Escape backs out of compare first; a second press closes the lightbox.
      if (e.key === "Escape") {
        if (comparing) setComparingFor(null);
        else close();
      }
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
  }, [isOpen, openId, photos, onOpenId, close, comparing]);

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
          onClick={close}
        >
          <div className="kk-lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span className="kk-lightbox-count">
              {comparing ? "Asli vs Hasil AI" : `${index + 1} / ${total}`}
            </span>
            <div className="kk-lightbox-actions">
              {/* Contextual bar (430px budget, no wrap): normal view offers one
                  download; compare swaps in both — same pair as the published
                  gallery. Enhancement never replaces the original file. */}
              {canDownload && comparing && current.originalFullSrc ? (
                <>
                  <a
                    href={current.originalFullSrc}
                    className="kk-lightbox-action"
                    aria-label="Unduh foto asli"
                  >
                    Unduh Asli
                  </a>
                  <a
                    href={current.fullSrc}
                    className="kk-lightbox-action"
                    aria-label="Unduh hasil AI"
                  >
                    Unduh Hasil AI
                  </a>
                </>
              ) : canDownload && !comparing ? (
                <a href={current.fullSrc} className="kk-lightbox-action" aria-label="Unduh foto">
                  Unduh
                </a>
              ) : null}
              {current.enhanced && current.originalDisplaySrc && !comparing ? (
                <button
                  type="button"
                  className="kk-lightbox-action"
                  onClick={() => setComparingFor(current.id)}
                  aria-label="Bandingkan dengan foto asli"
                >
                  Bandingkan
                </button>
              ) : null}
              <button
                type="button"
                className="kk-lightbox-action"
                autoFocus
                onClick={() => (comparing ? setComparingFor(null) : close())}
                aria-label={comparing ? "Tutup perbandingan" : "Tutup"}
              >
                Tutup
              </button>
            </div>
          </div>

          <div
            className="kk-lightbox-stage"
            onClick={(e) => {
              // Backdrop tap backs out of compare first (gallery parity);
              // stop it so the root onClose doesn't also fire.
              if (comparing) {
                e.stopPropagation();
                setComparingFor(null);
              } else {
                close();
              }
            }}
          >
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
                // Swipe-nav off while comparing: framer's native pointer
                // listeners fire despite the slider's stopPropagation, so the
                // slider must own horizontal drags exclusively.
                drag={total > 1 && !comparing ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (total <= 1 || comparing) return;
                  const swipe = swipePower(info.offset.x, info.velocity.x);
                  if (swipe < -8000) paginate(1);
                  else if (swipe > 8000) paginate(-1);
                }}
              >
                {current.enhanced && !comparing ? (
                  <span className="kk-photo-status" data-status="enhanced">✨ Ditingkatkan</span>
                ) : null}
                {current.enhanced && comparing && current.originalDisplaySrc ? (
                  // Slider owns pointer events, so framer's swipe-drag never
                  // fires mid-compare; exiting restores swipe-nav.
                  <KkCompareSlider
                    originalSrc={current.originalDisplaySrc}
                    enhancedSrc={current.displaySrc}
                    alt="Foto tamu"
                    onReady={() => setLoadedId(current.id)}
                  />
                ) : current.enhanced ? (
                  // Server-graded result — render as-is, no LUT.
                  <img
                    src={current.displaySrc}
                    alt="Foto tamu"
                    className="kk-lightbox-img"
                    draggable={false}
                    onLoad={() => setLoadedId(current.id)}
                  />
                ) : (
                  <GradedThumb
                    src={current.displaySrc}
                    lutId={current.lutId}
                    alt="Foto tamu"
                    className="kk-lightbox-img"
                    onReady={() => setLoadedId(current.id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
