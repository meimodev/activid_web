"use client";

import { useRef, useState } from "react";

/** Before/after drag slider for an enhanced photo: original left of the
 *  handle, enhanced right. Both files are the same frame, so a clip-path on
 *  the overlay keeps them pixel-aligned. Pointer events stop propagating so
 *  the lightbox swipe/close underneath never fires mid-drag. */
export default function KkCompareSlider({
  originalSrc,
  enhancedSrc,
  alt,
  dim,
  onReady,
}: {
  originalSrc: string;
  enhancedSrc: string;
  alt: string;
  /** Host moderation "hidden" treatment — mirrors kk-lightbox-img[data-dim]. */
  dim?: boolean;
  onReady?: () => void;
}) {
  // Handle position, % from the left edge.
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function update(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={frameRef}
      className="kk-compare"
      data-dim={dim}
      onPointerDown={(e) => {
        e.stopPropagation();
        draggingRef.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) update(e.clientX);
      }}
      onPointerUp={() => {
        draggingRef.current = false;
      }}
      onPointerCancel={() => {
        draggingRef.current = false;
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={enhancedSrc}
        alt={alt}
        className="kk-compare-img"
        draggable={false}
        onLoad={onReady}
      />
      <div
        className="kk-compare-overlay"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        <img src={originalSrc} alt="" className="kk-compare-img" draggable={false} />
      </div>
      <div className="kk-compare-divider" style={{ left: `${pos}%` }} aria-hidden="true">
        <span className="kk-compare-knob" />
      </div>
      <span className="kk-compare-label" data-side="left">Asli</span>
      <span className="kk-compare-label" data-side="right">Hasil AI</span>
    </div>
  );
}
