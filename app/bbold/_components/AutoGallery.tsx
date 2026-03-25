"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryGroup, ImageFit } from "../data";

function imageClassName(fit: ImageFit): string {
  return fit === "contain" ? "bg-contain bg-center bg-no-repeat" : "bg-cover bg-center";
}

export default function AutoGallery({
  group,
  delay = 2800,
  className = "",
}: {
  group: GalleryGroup;
  delay?: number;
  className?: string;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const images = group.images;

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay, images.length]);

  const safeIndex = images.length > 0 ? index % images.length : 0;
  const slide = useMemo(() => images[safeIndex] ?? images[0] ?? "", [images, safeIndex]);
  const labelClassName = group.labelWidthClassName ?? "h-12 w-12";

  const content = (
    <div
      className={`relative h-full w-full overflow-hidden ${group.href ? "cursor-pointer" : ""} ${className}`}
      onClick={() => {
        if (group.href) {
          router.push(group.href);
        }
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${imageClassName(group.fit)}`}
        style={{ backgroundImage: `url(${slide})` }}
      />
      <div className={`absolute left-4 top-4 flex items-center justify-center rounded-full bg-[#372f2d]/80 px-4 text-center shadow-lg backdrop-blur-sm ${labelClassName}`}>
        <span className="text-lg leading-none" style={{ fontFamily: "var(--font-bbold-display)" }}>{group.label}</span>
      </div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {images.slice(0, 6).map((_, dotIndex) => (
          <button
            key={`${group.label}-${dotIndex}`}
            type="button"
            aria-label={`Show ${group.label} image ${dotIndex + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              setIndex(dotIndex);
            }}
            className={`h-2.5 rounded-full transition-all ${dotIndex === safeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
          />
        ))}
      </div>
    </div>
  );

  return content;
}
