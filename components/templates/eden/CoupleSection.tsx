"use client";

import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { CoupleSectionProps } from "./InfoSections.types";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, TwinLineDivider, HairlineDivider } from "./graphics/ornaments";

function FramedPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] p-4">
      {/* Rich floral layers */}
      <div className="absolute -top-12 -left-12 w-40 h-40 z-20 pointer-events-none opacity-90 mix-blend-multiply">
        <img src={EDEN_OVERLAY_ASSETS.frameFlower} alt="" className="w-full h-full object-contain -rotate-12" />
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 z-20 pointer-events-none opacity-90 mix-blend-multiply">
        <img src={EDEN_OVERLAY_ASSETS.frameFlower} alt="" className="w-full h-full object-contain rotate-[160deg] scale-x-[-1]" />
      </div>

      {/* Line graphic corners */}
      <div className="absolute -top-2 -left-2 z-10 pointer-events-none opacity-50">
        <CornerLineTopLeft />
      </div>
      <div className="absolute -bottom-2 -right-2 z-10 pointer-events-none opacity-50">
        <CornerLineBottomRight />
      </div>

      <div className="relative aspect-[3/4] w-full p-3">
        <div className="absolute inset-0 rounded-t-[180px] rounded-b-[40px] border-[1px] border-wedding-accent/40" />
        <div className="absolute inset-2 rounded-t-[170px] rounded-b-[30px] border-[1px] border-wedding-accent/20" />
        <div className="relative h-full w-full overflow-hidden rounded-t-[160px] rounded-b-[20px] bg-wedding-dark/5">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-wedding-bg/60 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function CoupleSection({ hosts }: CoupleSectionProps) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
    <section className="relative bg-wedding-bg py-24 text-wedding-text overflow-hidden">
      <div className="relative z-10 mx-auto w-full max-w-[600px] px-6 text-center">
        <RevealOnScroll direction="up" distance={20} delay={0.1}>
          <p className="font-body text-[16px] leading-relaxed text-wedding-accent/80 italic">
            Tanpa Mengurangi rasa hormat dengan ini kami mengundang
            Bapak/Ibu/Saudara-i untuk hadir pada pernikahan kami
          </p>
          <HairlineDivider />
        </RevealOnScroll>

        <div className="mt-20">
          <RevealOnScroll direction="up" distance={20} delay={0.2}>
            <FramedPhoto src={primary?.photo ?? ""} alt="Host" />
          </RevealOnScroll>

          <div className="mt-12">
            <RevealOnScroll direction="up" distance={20} delay={0.3}>
              <p className="font-display text-[44px] leading-none text-wedding-accent font-medium">
                {primary?.firstName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" distance={20} delay={0.4}>
              <p className="mt-3 font-body text-[18px] tracking-[0.15em] text-wedding-accent uppercase font-semibold">
                {primary?.fullName ?? ""}
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" distance={20} delay={0.5}>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-wedding-accent/70 italic max-w-[280px] mx-auto">
                {primary?.parents ?? ""}
              </p>
            </RevealOnScroll>

            {primary?.role && (
              <RevealOnScroll direction="up" distance={20} delay={0.6}>
                <p className="mt-2 font-body text-[14px] uppercase tracking-wider text-wedding-accent/60 font-bold">
                  {primary.role}
                </p>
              </RevealOnScroll>
            )}
          </div>
        </div>

        {secondary && (
          <>
            <RevealOnScroll direction="up" distance={20} delay={0.2}>
              <div className="my-20 flex flex-col items-center justify-center gap-4">
                <TwinLineDivider />
                <div className="font-display italic text-[42px] text-wedding-accent/60">
                  &
                </div>
                <TwinLineDivider />
              </div>
            </RevealOnScroll>

            <div>
              <RevealOnScroll direction="up" distance={20} delay={0.3}>
                <FramedPhoto src={secondary.photo} alt="Host" />
              </RevealOnScroll>

              <div className="mt-12">
                <RevealOnScroll direction="up" distance={20} delay={0.4}>
                  <p className="font-display text-[44px] leading-none text-wedding-accent font-medium">
                    {secondary.firstName}
                  </p>
                </RevealOnScroll>

                <RevealOnScroll direction="up" distance={20} delay={0.5}>
                  <p className="mt-3 font-body text-[18px] tracking-[0.15em] text-wedding-accent uppercase font-semibold">
                    {secondary.fullName}
                  </p>
                </RevealOnScroll>

                {secondary.role && (
                  <RevealOnScroll direction="up" distance={20} delay={0.6}>
                    <p className="mt-2 font-body text-[14px] uppercase tracking-wider text-wedding-accent/60 font-bold">
                      {secondary.role}
                    </p>
                  </RevealOnScroll>
                )}

                <RevealOnScroll direction="up" distance={20} delay={0.7}>
                  <p className="mt-4 pb-10 font-body text-[15px] leading-relaxed text-wedding-accent/70 italic max-w-[280px] mx-auto">
                    {secondary.parents}
                  </p>
                </RevealOnScroll>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
