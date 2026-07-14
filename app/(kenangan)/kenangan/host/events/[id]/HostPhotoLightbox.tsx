"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { kenanganFullUrl } from "@/types/kenangan";
import type { HostMode, HostPhoto } from "./HostPhotosClient";
import { HostPhotoIcon, STATUS_LABELS } from "./HostPhotosClient";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 160 : -160, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -160 : 160, opacity: 0 }),
};

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

/** Host-side full-screen viewer over the already-loaded photos. Separate from
 *  the guest Lightbox (which grades via canvas, offers downloads, and evicts
 *  moderated photos). Here photos never leave the set — hiding only flips
 *  status — so pagination is a plain clamp over the loaded array, and the
 *  same hide/keeper actions as the grid bar live in the top bar. */
export default function HostPhotoLightbox({
  photos,
  openId,
  onOpenId,
  onClose,
  mode,
  onSetStatus,
}: {
  photos: HostPhoto[];
  openId: string | null;
  onOpenId: (id: string | null) => void;
  onClose: () => void;
  mode: HostMode;
  onSetStatus: (photo: HostPhoto, status: "live" | "hidden" | "keeper") => void;
}) {
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const lastIndexRef = useRef(0);

  const total = photos.length;
  const index = openId === null ? -1 : photos.findIndex((p) => p.id === openId);
  const current = index >= 0 ? (photos[index] ?? null) : null;

  useEffect(() => {
    if (index >= 0) lastIndexRef.current = index;
  }, [index]);

  const isOpen = current !== null;
  const loaded = current !== null && loadedId === current.id;

  // Back button closes the lightbox instead of leaving the page.
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ kkHostLightbox: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (window.history.state?.kkHostLightbox) window.history.back();
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

  if (typeof document === "undefined" || !current) return null;

  const canKeeper = mode === "curate" && current.status !== "hidden";
  const isKeeper = current.status === "keeper";
  const isHidden = current.status === "hidden";

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
              {canKeeper ? (
                <button
                  type="button"
                  className="kk-lightbox-action"
                  data-on={isKeeper}
                  onClick={() => onSetStatus(current, isKeeper ? "live" : "keeper")}
                  aria-label={isKeeper ? "Batal pilih" : "Pilih"}
                >
                  <HostPhotoIcon name={isKeeper ? "star-filled" : "star"} />
                  {isKeeper ? "Batal" : "Pilih"}
                </button>
              ) : null}
              <button
                type="button"
                className="kk-lightbox-action"
                onClick={() => onSetStatus(current, isHidden ? "live" : "hidden")}
                aria-label={isHidden ? "Tampilkan" : "Sembunyikan"}
              >
                <HostPhotoIcon name={isHidden ? "eye" : "eye-off"} />
                {isHidden ? "Tampilkan" : "Sembunyikan"}
              </button>
              <button
                type="button"
                className="kk-lightbox-action"
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
                {current.status !== "live" ? (
                  <span className="kk-photo-status" data-status={current.status}>
                    {STATUS_LABELS[current.status] ?? current.status}
                  </span>
                ) : null}
                <img
                  src={kenanganFullUrl(current.originalPath)}
                  alt="Foto tamu"
                  className="kk-lightbox-img"
                  data-dim={isHidden}
                  onLoad={() => setLoadedId(current.id)}
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
