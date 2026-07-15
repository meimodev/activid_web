"use client";

import { useEffect, useRef, useState } from "react";
import type { KenanganLutId } from "@/data/kenangan-luts";
import { gradeImageToCanvas } from "@/lib/kenangan-lut-webgl";

/**
 * Live-feed thumbnail with the photo's LUT applied client-side (shared WebGL
 * grader). Originals are stored ungraded; this keeps the feed looking exactly
 * like the capture preview. Falls back to the ungraded image when WebGL or
 * CORS is unavailable.
 */
export default function GradedThumb({
  src,
  lutId,
  alt,
  className,
  onReady,
}: {
  src: string;
  lutId: KenanganLutId;
  alt: string;
  className?: string;
  // Fires once the graded canvas (or fallback img) has painted. Lets the
  // lightbox drop its spinner. Optional — the feed grid ignores it.
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallback, setFallback] = useState(false);
  // Drives the fade-in: the tile paints transparent, then eases to opaque once
  // the grade (or fallback img) has actually rendered. Set once; stays set.
  const [ready, setReady] = useState(false);
  // Gates the WebGL grade to the viewport. The grade + full-res decode is the
  // feed's real cost; running it for every appended offscreen tile is what
  // melts a long feed. One-shot: flips true when the tile nears the viewport
  // and stays true, so scroll-back never re-grades (no flicker, no rework).
  const [visible, setVisible] = useState(false);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    // Canvas is present on first mount (fallback starts false), so this guards
    // only the impossible; the effect runs once and observes that canvas.
    const el = canvasRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      let ok = false;
      if (canvas) {
        try {
          ok = gradeImageToCanvas(image, lutId, canvas);
        } catch {
          ok = false;
        }
      }
      if (!ok) setFallback(true);
      else {
        setReady(true);
        onReadyRef.current?.();
      }
    };
    image.onerror = () => {
      if (!cancelled) setFallback(true);
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, lutId, visible]);

  const cls = ["kk-thumb", className].filter(Boolean).join(" ");

  if (fallback) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cls}
        data-ready={ready}
        onLoad={() => {
          setReady(true);
          onReadyRef.current?.();
        }}
      />
    );
  }
  return (
    <canvas ref={canvasRef} role="img" aria-label={alt} className={cls} data-ready={ready} />
  );
}
