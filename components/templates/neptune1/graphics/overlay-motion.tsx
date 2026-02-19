"use client";

import { motion } from "framer-motion";

import { useReducedMotion, useWindowSize } from "@/hooks";

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
  const prefersReducedMotion = useReducedMotion();
  const { isMobile } = useWindowSize();

  const mobileAmplitude = isMobile ? Math.min(amplitude, 4.5) : amplitude;
  const yAmplitude = prefersReducedMotion
    ? Math.min(Math.max(amplitude, 4), 6)
    : mobileAmplitude;

  const rotateAmplitude = prefersReducedMotion
    ? Math.sign(rotate) * Math.min(Math.abs(rotate), 1)
    : rotate;

  const breezeXAmplitude = prefersReducedMotion
    ? Math.min(Math.max(yAmplitude * 0.16, 0.75), 1.45)
    : Math.min(Math.max(yAmplitude * 0.72, 3), 8.4);

  const baseRotateAmplitude =
    rotateAmplitude !== 0
      ? prefersReducedMotion
        ? rotateAmplitude
        : rotateAmplitude * 1.8
      : prefersReducedMotion
        ? 0.95
        : Math.min(Math.max(yAmplitude * 0.72, 3), 8);

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      draggable={draggable}
      initial={false}
      animate={
        breeze
          ? {
              x: [
                0,
                breezeXAmplitude * 1.35,
                -breezeXAmplitude * 1.45,
                breezeXAmplitude * 1.05,
                -breezeXAmplitude * 0.7,
                breezeXAmplitude * 0.4,
                0,
              ],
              y: [
                0,
                -yAmplitude * 0.48,
                -yAmplitude * 1.38,
                -yAmplitude * 0.62,
                -yAmplitude * 1.08,
                -yAmplitude * 0.35,
                0,
              ],
              rotate: [
                0,
                baseRotateAmplitude,
                -baseRotateAmplitude * 1.2,
                baseRotateAmplitude * 0.9,
                -baseRotateAmplitude * 0.6,
                baseRotateAmplitude * 0.32,
                0,
              ],
            }
          : rotateAmplitude !== 0
            ? {
                y: [0, -yAmplitude, 0],
                rotate: [0, rotateAmplitude, 0, -rotateAmplitude, 0],
              }
            : { y: [0, -yAmplitude, 0] }
      }
      transition={
        breeze
          ? {
              x: {
                duration: duration * 0.68,
                repeat: Infinity,
                times: [0, 0.16, 0.34, 0.52, 0.68, 0.84, 1],
                ease: "easeInOut",
                delay,
              },
              y: {
                duration: duration * 0.72,
                repeat: Infinity,
                times: [0, 0.12, 0.29, 0.47, 0.65, 0.82, 1],
                ease: "easeInOut",
                delay,
              },
              rotate: {
                duration: duration * 0.74,
                repeat: Infinity,
                times: [0, 0.14, 0.31, 0.49, 0.67, 0.84, 1],
                ease: "easeInOut",
                delay,
              },
            }
          : rotateAmplitude !== 0
            ? {
                y: { duration, repeat: Infinity, ease: "easeInOut", delay },
                rotate: {
                  duration: duration * 1.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                },
              }
            : { duration, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}
