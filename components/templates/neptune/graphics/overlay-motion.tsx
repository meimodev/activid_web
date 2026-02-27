"use client";

import { motion } from "framer-motion";

import { useWindowSize } from "@/hooks";

type NeptuneOverlayFloatProps = {
  src: string;
  alt?: string;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
  breeze?: boolean;
  loading?: "eager" | "lazy";
  draggable?: boolean;
};

export function NeptuneOverlayFloat({
  src,
  alt = "",
  className,
  amplitude = 5,
  duration = 8,
  delay = 0,
  rotate = 0,
  breeze = false,
  loading = "lazy",
  draggable = false,
}: NeptuneOverlayFloatProps) {
  const { isMobile } = useWindowSize();

  const baseAmplitude = isMobile ? Math.min(amplitude, 6.5) : amplitude;
  const drift = baseAmplitude * 0.55;
  const driftX = drift * (breeze ? 1.35 : 1.15);
  const driftY = drift * (breeze ? 1.25 : 1.05);

  const rotateSign = rotate < 0 ? -1 : 1;
  const rotateDrift =
    Math.max(rotate !== 0 ? Math.abs(rotate) : 0, baseAmplitude * 0.6) *
    (breeze ? 1.25 : 1.15);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      draggable={draggable}
      initial={false}
      animate={{
        x: [0, driftX, -driftX * 0.66, driftX * 0.66, 0],
        y: [0, -driftY, driftY * 0.55, -driftY * 0.55, 0],
        rotate: [
          0,
          -rotateDrift * rotateSign,
          rotateDrift * 0.6 * rotateSign,
          -rotateDrift * 0.6 * rotateSign,
          0,
        ],
      }}
      transition={{
        duration: breeze ? duration * 0.95 : duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
