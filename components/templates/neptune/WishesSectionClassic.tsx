"use client";

import type { ReactNode } from "react";

import { SplitText } from "@/components/animations";

import { neptuneSerif } from "./fonts";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";
import { NeptuneStagger } from "./reveal";
import type { NavSectionId } from "./types";

export function WishesSectionClassic({
  id,
  heading,
  children,
}: {
  id: NavSectionId;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-wedding-bg text-wedding-text px-6 py-16"
    >
      <div className="absolute inset-0 pointer-events-none">
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.flourishes}
          alt=""
          className="absolute left-1/2 top-10 w-[260px] opacity-18 -translate-x-1/2"
          amplitude={4.2}
          duration={10.2}
          rotate={0.6}
          breeze
          loading="lazy"
          draggable={false}
        />
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
          alt=""
          className="absolute left-0 bottom-0 w-[190px] opacity-22 -translate-x-12 translate-y-10"
          amplitude={4.6}
          duration={9.6}
          delay={0.12}
          rotate={1}
          breeze
          loading="lazy"
          draggable={false}
        />
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafRight}
          alt=""
          className="absolute right-0 top-0 w-[190px] opacity-18 translate-x-12 -translate-y-10"
          amplitude={5}
          duration={10.1}
          delay={0.28}
          rotate={-1}
          breeze
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <NeptuneStagger baseDelay={0.1}>
          <h3
            className={`${neptuneSerif.className} text-4xl text-wedding-text-light text-center`}
          >
            <SplitText text={heading} splitBy="word" staggerDelay={0.09} />
          </h3>
          <div className="mt-8">{children}</div>
        </NeptuneStagger>
      </div>
    </section>
  );
}
