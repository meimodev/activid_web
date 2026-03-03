"use client";

import { Host } from "@/types/invitation";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";

export function GratitudeSection({
  hosts,
  purpose,
  message,
}: {
  hosts: Host[];
  purpose: "marriage" | "birthday" | "event";
  message?: string;
}) {
  const names = hosts.map((h) => h?.firstName).filter(Boolean);
  const isMarriage = purpose === "marriage";
  const effectiveMessage = message?.trim();

  return (
    <section className="py-24 relative text-center text-wedding-on-dark overflow-hidden bg-wedding-dark">
      {/* Space Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wedding-dark via-wedding-dark/95 to-wedding-dark z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl bg-wedding-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.16} className="w-full">
          <div className="mb-12">
            <div className="w-px h-24 bg-linear-to-b from-transparent via-wedding-accent/50 to-transparent mx-auto mb-12" />
          </div>

          <p className="font-body text-wedding-on-dark/70 mb-12 italic leading-relaxed text-lg max-w-2xl mx-auto whitespace-pre-line">
            {effectiveMessage
              ? effectiveMessage
              : isMarriage
                ? (
                  <>
                    &quot;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i 
                    berkenan hadir untuk memberikan doa restu kepada kedua mempelai.&quot;
                  </>
                )
                : (
                  <>
                    &quot;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i 
                    berkenan hadir untuk merayakan momen spesial ini bersama kami.&quot;
                  </>
                )}
          </p>

          <p className="font-heading text-xs uppercase tracking-[0.4em] text-wedding-accent mb-6">
            Kami yang berbahagia,
          </p>

          {names.length <= 2 ? (
            <h2 className="font-heading text-3xl capitalize tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
              {names[0] ?? ""}{names[1] ? ` & ${names[1]}` : ""}
            </h2>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {names.map((name, idx) => (
                <h2
                  key={`${name}-${idx}`}
                  className="font-heading text-3xl capitalize tracking-[0.2em] text-wedding-on-dark drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]"
                >
                  {name}
                </h2>
              ))}
            </div>
          )}
          
          <div className="mt-16">
            <div className="w-px h-24 bg-linear-to-b from-transparent via-wedding-accent/50 to-transparent mx-auto" />
          </div>
        </StaggerRevealOnScroll>
      </div>
    </section>
  );
}
