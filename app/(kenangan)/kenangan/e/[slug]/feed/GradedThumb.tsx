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
}: {
  src: string;
  lutId: KenanganLutId;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
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
    };
    image.onerror = () => {
      if (!cancelled) setFallback(true);
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, lutId]);

  if (fallback) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" />;
  }
  return <canvas ref={canvasRef} role="img" aria-label={alt} />;
}
