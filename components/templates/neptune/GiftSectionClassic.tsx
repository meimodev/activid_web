"use client";

import type { ReactNode } from "react";

import { SplitText } from "@/components/animations";

import { neptuneSerif } from "./fonts";
import { NEPTUNE_OVERLAY_ASSETS, NeptuneOverlayFloat } from "./graphics";
import { NeptuneStagger } from "./reveal";
import type { NavSectionId } from "./types";

export function GiftSectionClassic({
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
      className="relative scroll-mt-24 overflow-hidden bg-wedding-dark text-wedding-on-dark px-6 py-16"
    >
      <div className="absolute inset-0 bg-linear-to-b from-wedding-accent-2/20 via-wedding-dark to-wedding-dark" />

      <div className="absolute inset-0 pointer-events-none">
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
          alt=""
          className="absolute -left-6 top-[4.5rem] w-[190px] opacity-18"
          amplitude={4.8}
          duration={9.8}
          rotate={1.1}
          breeze
          loading="lazy"
          draggable={false}
        />
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafRight}
          alt=""
          className="absolute -right-8 bottom-10 w-[210px] opacity-16"
          amplitude={5.2}
          duration={10.3}
          delay={0.2}
          rotate={-1.1}
          breeze
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="rounded-[34px] border border-wedding-on-dark/10 bg-wedding-dark/75 backdrop-blur shadow-[0_24px_60px_color-mix(in_srgb,var(--invitation-dark)_45%,transparent)]">
          <div className="p-10">
            <NeptuneStagger baseDelay={0.1}>
              <h3
                className={`${neptuneSerif.className} text-4xl text-wedding-on-dark text-center`}
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
