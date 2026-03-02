"use client";

import { Host } from "@/types/invitation";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { CosmicDivider } from "./graphics/ornaments";

interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
  isReady?: boolean;
}

export function TitleSection({ hosts, date, heading, isReady = true }: TitleSectionProps) {
  const primaryName = hosts[0]?.firstName ?? "";
  const secondaryName = hosts[1]?.firstName ?? "";
  const extraNames = hosts.slice(2).map((h) => h?.firstName).filter(Boolean);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-wedding-dark/70 text-wedding-on-dark ">

      {/* Nebula effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-2xl max-h-2xl bg-wedding-accent/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center">
        <StaggerRevealOnScroll
          direction="up"
          width="100%"
          delay={0.6}
          staggerDelay={0.18}
          isReady={isReady}
          className="w-full flex flex-col items-center"
        >
          <div className="mb-1">
            <CosmicDivider />
          </div>
          <p className="font-heading text-xs capitalize tracking-[0.5em] text-wedding-accent mb-8 leading-loose">
            {heading}
          </p>

          {hosts.length <= 2 ? (
            <>
              <h2 className="font-heading text-5xl tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)] mb-6">
                {primaryName}
              </h2>

              {hosts.length > 1 ? (
                <>
                  <div className="font-heading text-xl text-wedding-accent/80 italic mb-6" aria-hidden="true">
                    &amp;
                  </div>
                  <h2 className="font-heading text-5xl tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)] mb-16">
                    {secondaryName}
                  </h2>
                </>
              ) : (
                <div className="mb-16" />
              )}
            </>
          ) : (
            <div className="mb-16 flex flex-col items-center gap-4">
              <h2 className="font-heading text-5xl capitalize tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
                {primaryName}
              </h2>
              {secondaryName ? (
                <h2 className="font-heading text-5xl capitalize tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
                  {secondaryName}
                </h2>
              ) : null}
              {extraNames.map((name, idx) => (
                <h2
                  key={`${name}-${idx}`}
                  className="font-heading text-5xl capitalize tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]"
                >
                  {name}
                </h2>
              ))}
            </div>
          )}

            <div className="inline-block relative mt-10">
              <div className="absolute inset-0 bg-wedding-on-dark/5 blur-xl rounded-full" />
              <p className="relative font-body text-sm uppercase tracking-[0.4em] text-wedding-on-dark/80 border-t border-b border-wedding-on-dark/20 py-4 px-8 backdrop-blur-sm">
                {date}
              </p>
            </div>
        </StaggerRevealOnScroll>

         <div className=" w-full opacity-50">
        <CosmicDivider />
      </div>
      
      </div>

     
    </section>
  );
}
