"use client";

import { useMemo } from "react";
import AutoGallery from "./AutoGallery";
import type { BboldMasonryCard, GalleryGroup } from "../data";

function getCardGalleryDelay(index: number, isLast: boolean): number {
  const baseDelay = isLast ? 2000 : 2800;
  return baseDelay + (index % 4) * 320;
}

export default function BboldMasonryGrid({
  cards,
  featuredCard,
}: {
  cards: BboldMasonryCard[];
  featuredCard?: GalleryGroup;
}) {
  // Distribute items into 2 columns for a responsive mobile-first Pinterest layout
  const { leftColumn, rightColumn } = useMemo(() => {
    const left: { card: BboldMasonryCard; globalIndex: number }[] = [];
    const right: { card: BboldMasonryCard; globalIndex: number }[] = [];

    cards.forEach((card, index) => {
      if (index % 2 === 0) {
        left.push({ card, globalIndex: index });
      } else {
        right.push({ card, globalIndex: index });
      }
    });

    return { leftColumn: left, rightColumn: right };
  }, [cards]);

  return (
    <div className="flex flex-col gap-3 pt-6 sm:gap-4 sm:pt-8">
      {/* 2-Column Pinterest Waterfall / Masonry Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
        {/* Left Column */}
        <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
          {leftColumn.map(({ card, globalIndex }) => (
            <div
              key={card.id}
              className={`w-full ${card.aspectClassName} min-w-0`}
            >
              <AutoGallery
                group={card.group}
                delay={getCardGalleryDelay(globalIndex, false)}
                revealDelay={globalIndex * 0.12}
              />
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
          {rightColumn.map(({ card, globalIndex }) => (
            <div
              key={card.id}
              className={`w-full ${card.aspectClassName} min-w-0`}
            >
              <AutoGallery
                group={card.group}
                delay={getCardGalleryDelay(globalIndex, false)}
                revealDelay={globalIndex * 0.12}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Featured Full-Width Card (e.g. Custom Orders / Available Pictures) */}
      {featuredCard && (
        <div className="w-full aspect-[16/11] sm:aspect-[16/10] min-w-0 pt-1">
          <AutoGallery
            group={featuredCard}
            delay={2200}
            revealDelay={cards.length * 0.1}
          />
        </div>
      )}
    </div>
  );
}
