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
  const baseRotate = rotate;
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
        x: breeze
          ? [
              0,
              driftX * 0.75,
              -driftX * 1.15,
              driftX * 0.95,
              -driftX * 0.55,
              0,
            ]
          : [0, driftX, -driftX * 0.66, driftX * 0.66, 0],
        y: breeze
          ? [
              0,
              -driftY * 0.6,
              driftY * 0.95,
              -driftY * 0.85,
              driftY * 0.45,
              0,
            ]
          : [0, -driftY, driftY * 0.55, -driftY * 0.55, 0],
        rotate: breeze
          ? [
              baseRotate,
              baseRotate + rotateDrift * 0.85 * rotateSign,
              baseRotate - rotateDrift * 1.35 * rotateSign,
              baseRotate + rotateDrift * 1.1 * rotateSign,
              baseRotate - rotateDrift * 0.65 * rotateSign,
              baseRotate,
            ]
          : [
              baseRotate,
              baseRotate - rotateDrift * rotateSign,
              baseRotate + rotateDrift * 0.6 * rotateSign,
              baseRotate - rotateDrift * 0.6 * rotateSign,
              baseRotate,
            ],
      }}
      transition={{
        duration: breeze ? duration * 0.78 : duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
        repeatDelay: breeze ? 0.15 : 0,
        times: breeze ? [0, 0.18, 0.38, 0.6, 0.82, 1] : undefined,
      }}
    />
  );
}
