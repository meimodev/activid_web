"use client";

import type { ReactNode } from "react";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";
import type { NavSectionId } from "./types";

export function SectionWrap({
  id,
  title,
  maskBackground = false,
  children,
}: {
  id: NavSectionId;
  title: string;
  maskBackground?: boolean;
  children: ReactNode;
}) {
  const isOverPhoto = !maskBackground;

  return (
    <section id={id} className="relative scroll-mt-24 py-14 px-6">
      {maskBackground ? <div className="absolute inset-0 bg-wedding-bg" /> : null}
      <div className="max-w-5xl mx-auto">
        <VenusReveal direction="up" width="100%">
          <div className="text-center mb-10">
            <h3
              className={`${venusScript.className} text-5xl leading-none ${isOverPhoto ? "text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.75)]" : "text-wedding-text"}`}
            >
              {title}
            </h3>
            <div
              className={`mt-5 mx-auto h-px w-24 ${isOverPhoto ? "bg-white/35" : "bg-wedding-text/15"}`}
            />
          </div>
        </VenusReveal>

        {children}
      </div>
    </section>
  );
}
