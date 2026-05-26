"use client";

import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { PhotoPlaceholder, Divider } from "./graphics";
import { VineCascade } from "@/components/assets/vine-cascade";

interface GallerySectionProps {
  photos: string[];
}

export function GallerySection({ photos }: GallerySectionProps) {
  const tiles = photos && photos.length > 0
    ? photos.map((url, i) => ({
        w: i % 3 === 0 ? 2 : 1,
        h: i % 4 === 0 ? 2 : 1,
        src: url,
      }))
    : [
        { w: 2, h: 2, label: "PORTRAIT 01" },
        { w: 1, h: 1, label: "DETAIL" },
        { w: 1, h: 1, label: "CANDID" },
        { w: 1, h: 2, label: "BOUQUET" },
        { w: 2, h: 1, label: "TWO OF US" },
        { w: 1, h: 1, label: "RING" },
        { w: 2, h: 1, label: "GOLDEN HOUR" },
      ];

  return (
    <SectionWrap id="gallery">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-0 overflow-hidden">
          <VineCascade className="w-full h-full opacity-45" />
        </div>
        <SectionHead eyebrow="Frozen in time" title="The" em="gallery" />
      </div>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "70px",
        }}
      >
        {tiles.map((t, i) => (
          <div
            key={i}
            className="overflow-hidden relative hover:scale-[1.02] transition-transform duration-800"
            style={{
              gridColumn: `span ${t.w}`,
              gridRow: `span ${t.h}`,
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
            }}
          >
            {"src" in t && t.src ? (
              <img
                src={t.src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <PhotoPlaceholder label={"label" in t ? (t as { label: string }).label : "PHOTO"} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-7">
        <Divider width={180} />
      </div>
    </SectionWrap>
  );
}
