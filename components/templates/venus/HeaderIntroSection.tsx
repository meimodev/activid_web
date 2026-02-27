"use client";

import { HeaderIntroBackground } from "./graphics";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";
import type { InvitationConfig } from "@/types/invitation";

export function HeaderIntroSection({
  couple,
}: {
  couple: InvitationConfig["couple"];
}) {
  const subtitle = "The Wedding Of";

  return (
    <section
      id="home"
      className="relative min-h-screen min-h-[100svh] min-h-[100dvh] px-6 overflow-hidden scroll-mt-24"
    >
      <HeaderIntroBackground />

      <div className="relative z-10 min-h-screen min-h-[100svh] min-h-[100dvh] max-w-3xl mx-auto flex items-center justify-center text-center text-white">
        <div>
          <VenusReveal direction="up" width="100%" delay={0.08}>
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/80 font-body">
              {subtitle}
            </p>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.18}>
            <h2 className={`mt-6 ${venusScript.className} text-6xl leading-none`}>
              {couple.bride.firstName}
            </h2>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.26}>
            <div className="mt-2 mb-2 text-3xl opacity-90">&</div>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.34}>
            <h2 className={`${venusScript.className} text-6xl leading-none`}>
              {couple.groom.firstName}
            </h2>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.44}>
            <div className="mt-10 mx-auto h-px w-24 bg-white/35" />
          </VenusReveal>
        </div>
      </div>
    </section>
  );
}
