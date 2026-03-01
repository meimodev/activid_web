"use client";

import { Host } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

function FloatingParallax({ children, speed = 1 }: { children: ReactNode, speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>;
}

export function GratitudeSection({ hosts }: { hosts: Host[] }) {
  const primaryName = hosts[0]?.firstName ?? "";
  const secondaryName = hosts[1]?.firstName ?? "";
  const names = secondaryName ? `${primaryName} & ${secondaryName}` : primaryName;

  return (
    <section className="py-24 relative text-center text-wedding-on-dark overflow-hidden bg-wedding-dark">
      {/* Space Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wedding-dark via-wedding-dark/95 to-wedding-dark z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl bg-wedding-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <FloatingParallax speed={0.3}>
            <div className="mb-12">
              <div className="w-px h-24 bg-linear-to-b from-transparent via-wedding-accent/50 to-transparent mx-auto mb-12" />
            </div>

            <p className="font-body text-wedding-on-dark/70 mb-12 italic leading-relaxed text-lg max-w-2xl mx-auto">
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i 
              berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
            </p>

            <p className="font-heading text-xs uppercase tracking-[0.4em] text-wedding-accent mb-6">
              Kami yang berbahagia,
            </p>

            <h2 className="font-script text-6xl md:text-7xl text-wedding-on-dark drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
              {names}
            </h2>
            
            <div className="mt-16">
              <div className="w-px h-24 bg-linear-to-b from-transparent via-wedding-accent/50 to-transparent mx-auto" />
            </div>
          </FloatingParallax>
        </RevealOnScroll>
      </div>
    </section>
  );
}
