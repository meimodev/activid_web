"use client";

import { Host } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { CosmicDivider } from "./graphics/ornaments";
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

interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
}

export function TitleSection({ hosts, date, heading }: TitleSectionProps) {
  const primaryName = hosts[0]?.firstName ?? "";
  const secondaryName = hosts[1]?.firstName ?? "";

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-wedding-dark text-wedding-on-dark py-32">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-linear-to-b from-wedding-dark via-wedding-dark/95 to-wedding-dark z-0" />
      
      {/* Nebula effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-2xl max-h-2xl bg-wedding-accent/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center">
        <RevealOnScroll direction="down" delay={0.2} width="100%">
          <FloatingParallax speed={0.5}>
            <div className="mb-16">
              <CosmicDivider />
            </div>
            <p className="font-heading text-xs uppercase tracking-[0.5em] text-wedding-accent mb-8 leading-loose">
              {heading}
            </p>
          </FloatingParallax>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={0.4} width="100%">
          <FloatingParallax speed={0.8}>
            <h2 className="flex flex-col items-center gap-6 mb-16">
              <span className="font-script text-7xl md:text-8xl lg:text-9xl text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
                {primaryName}
              </span>
              <span className="font-heading text-xl text-wedding-accent/80 italic">&amp;</span>
              <span className="font-script text-7xl md:text-8xl lg:text-9xl text-wedding-on-dark drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">
                {secondaryName}
              </span>
            </h2>
          </FloatingParallax>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={0.6} width="100%">
          <FloatingParallax speed={0.3}>
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-wedding-on-dark/5 blur-xl rounded-full" />
              <p className="relative font-body text-sm uppercase tracking-[0.4em] text-wedding-on-dark/80 border-t border-b border-wedding-on-dark/20 py-4 px-8 backdrop-blur-sm">
                {date}
              </p>
            </div>
          </FloatingParallax>
        </RevealOnScroll>
      </div>

      <div className="absolute bottom-0 w-full opacity-50">
        <CosmicDivider />
      </div>
    </section>
  );
}
