"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Crossfades randomly through a background's image set. Shared by the Latar
// grid tiles and the Konfirmasi summary card so both animate identically.
export default function BackgroundImageCycle({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    // Random per-instance cadence so multiple cyclers fade independently.
    const delay = 2200 + Math.random() * 2600;
    const timer = setTimeout(() => {
      setIndex((current) => {
        let next = Math.floor(Math.random() * images.length);
        if (next === current) next = (current + 1) % images.length;
        return next;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [images, index]);

  return (
    <AnimatePresence initial={false}>
      <motion.img
        key={images[index]}
        src={images[index]}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className={className}
      />
    </AnimatePresence>
  );
}
