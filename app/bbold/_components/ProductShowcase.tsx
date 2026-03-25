"use client";

import { useEffect, useMemo, useState } from "react";

function shuffleImages(images: string[]): string[] {
  const next = [...images];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

export default function ProductShowcase({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const orderedImages = useMemo(() => shuffleImages(images), [images]);
  const safeIndex = orderedImages.length > 0 ? index % orderedImages.length : 0;

  useEffect(() => {
    if (orderedImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % orderedImages.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [orderedImages]);

  const image = useMemo(() => orderedImages[safeIndex] ?? orderedImages[0] ?? "", [orderedImages, safeIndex]);

  return (
    <div className="relative h-[22rem] overflow-hidden rounded-[2rem] bg-[#4b5563] shadow-2xl">
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-x-0 bottom-4 flex flex-wrap justify-center gap-2 px-4">
        {orderedImages.slice(0, 10).map((_, dotIndex) => (
          <button
            key={`${dotIndex}-${orderedImages[dotIndex]}`}
            type="button"
            aria-label={`Show image ${dotIndex + 1}`}
            onClick={() => setIndex(dotIndex)}
            className={`h-2.5 rounded-full transition-all ${dotIndex === safeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  );
}
