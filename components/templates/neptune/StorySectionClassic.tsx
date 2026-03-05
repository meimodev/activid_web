"use client";

import Image from "next/image";

import { SplitText } from "@/components/animations";
import { formatInvitationMonthYear } from "@/lib/date-utils";
import type { InvitationConfig } from "@/types/invitation";

import { neptuneScript, neptuneSerif } from "./fonts";
import {
  NEPTUNE_OVERLAY_ASSETS,
  NeptuneOverlayFloat,
} from "./graphics";
import { NeptuneReveal } from "./reveal";
import type { NavSectionId } from "./types";

export function StorySectionClassic({
  id,
  heading,
  coupleLabel,
  photo,
  stories,
}: {
  id: NavSectionId;
  heading: string;
  coupleLabel: string;
  photo: string;
  stories: InvitationConfig["sections"]["story"]["stories"];
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-wedding-bg text-wedding-text px-6 py-16"
    >
      <div className="absolute inset-0 pointer-events-none">
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafLeft}
          alt=""
          className="absolute left-0 top-12 w-[180px] opacity-22 -translate-x-10"
          amplitude={4.4}
          duration={9.2}
          rotate={1}
          breeze
          loading="lazy"
          draggable={false}
        />
        <NeptuneOverlayFloat
          src={NEPTUNE_OVERLAY_ASSETS.leafRight}
          alt=""
          className="absolute right-0 bottom-10 w-[180px] opacity-20 translate-x-10"
          amplitude={4.8}
          duration={9.6}
          delay={0.25}
          rotate={-1}
          breeze
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <div className="rounded-[34px] border border-wedding-text/10 bg-wedding-bg/70 shadow-[0_24px_60px_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]">
          <div className="p-[10px]">
            <div className="rounded-[28px] border border-wedding-text/10 bg-wedding-bg/70 overflow-hidden">
              <div className="relative px-8 pb-10 text-center">
                <NeptuneReveal
                  direction="up"
                  width="100%"
                  delay={0.1}
                  className="absolute -top-2 left-0 right-0 flex justify-center pointer-events-none"
                >
                  <NeptuneOverlayFloat
                    src={NEPTUNE_OVERLAY_ASSETS.flowerDivider}
                    alt=""
                    className="w-full -translate-y-24"
                    amplitude={4.6}
                    duration={8.4}
                    loading="lazy"
                    draggable={false}
                  />
                </NeptuneReveal>

                <NeptuneReveal direction="up" width="100%" delay={0.15}>
                  <p
                    className={`${neptuneSerif.className} pt-20 text-4xl text-wedding-text-light`}
                  >
                    <SplitText
                      text={coupleLabel}
                      splitBy="word"
                      staggerDelay={0.09}
                    />
                  </p>
                </NeptuneReveal>
                <NeptuneReveal direction="up" width="100%" delay={0.35}>
                  <p
                    className={`${neptuneScript.className} pt-2 text-5xl text-wedding-accent`}
                  >
                    <SplitText
                      text={heading}
                      splitBy="word"
                      staggerDelay={0.12}
                    />
                  </p>
                </NeptuneReveal>

                <NeptuneReveal direction="up" width="100%" delay={0.55}>
                  <div className="mt-8">
                    <div className="relative rounded-t-[999px] border border-wedding-text/25 bg-wedding-bg p-[7px] shadow-[0_14px_40px_color-mix(in_srgb,var(--invitation-dark)_12%,transparent)]">
                      <NeptuneOverlayFloat
                        src={NEPTUNE_OVERLAY_ASSETS.flowerDouble}
                        alt=""
                        className="absolute w-30 -bottom-10 -right-8 opacity-90 scale-x-[-1] z-10"
                        amplitude={5.2}
                        duration={7.2}
                        delay={0.25}
                        rotate={1.4}
                        breeze
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="relative aspect-[4/5] rounded-t-[999px] overflow-hidden border border-wedding-text/25 bg-wedding-bg">
                        <Image
                          src={photo}
                          alt="Story"
                          fill
                          sizes="360px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </NeptuneReveal>

                <div className="mt-10 space-y-10">
                  {stories.map((s, idx) => (
                    <NeptuneReveal
                      key={idx}
                      direction="up"
                      width="100%"
                      delay={0.75 + idx * 0.22}
                    >
                      <div className="text-center">
                        <p className="text-xs tracking-[0.28em] uppercase text-wedding-text-light font-body">
                          {formatInvitationMonthYear(s.date)}
                        </p>
                        <p className="mt-5 text-[15px] leading-relaxed text-wedding-text-light whitespace-pre-line">
                          {s.description}
                        </p>
                        {idx < stories.length - 1 ? (
                          <div className="mt-10 flex justify-center">
                            <div className="h-10 w-px bg-wedding-text/20" />
                          </div>
                        ) : null}
                      </div>
                    </NeptuneReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
