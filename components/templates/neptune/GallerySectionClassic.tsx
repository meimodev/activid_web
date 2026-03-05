"use client";

import type { ReactNode } from "react";

import { SplitText } from "@/components/animations";

import { neptuneSerif } from "./fonts";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";
import { NeptuneStagger } from "./reveal";
import type { NavSectionId } from "./types";

export function GallerySectionClassic({
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
        {/* <FloralCorner className="left-0 bottom-0 w-56 opacity-30" flipX /> */}
        {/* <FloralCorner className="right-0 top-0 w-52 opacity-25" /> */}
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
          alt=""
          className="absolute left-0 bottom-0 w-[200px] opacity-30 -translate-x-12 translate-y-10"
          amplitude={4.6}
          duration={9.4}
          rotate={1.1}
          breeze
          loading="lazy"
          draggable={false}
        />
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafRight}
          alt=""
          className="absolute right-0 top-0 w-[200px] opacity-25 translate-x-12 -translate-y-10"
          amplitude={5.1}
          duration={9.8}
          delay={0.2}
          rotate={-1.1}
          breeze
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="rounded-[34px] border border-wedding-text/10 bg-wedding-bg/70 shadow-[0_24px_60px_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]">
          <div className="p-10">
            <NeptuneStagger baseDelay={0.1}>
              <h3
                className={`${neptuneSerif.className} text-4xl text-wedding-text-light text-center`}
              >
                <SplitText text={heading} splitBy="word" staggerDelay={0.09} />
              </h3>
              <div className="mt-8">{children}</div>
            </NeptuneStagger>
          </div>
        </div>
      </div>
    </section>
  );
}
