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

interface FooterSectionProps {
  hosts: Host[];
  message: string;
}

export function FooterSection({ hosts, message }: FooterSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  return (
    <footer className="py-24 bg-wedding-dark text-center text-wedding-on-dark/80 relative overflow-hidden">
      {/* Simple stars background just for footer */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--invitation-on-dark) 85%, transparent) 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>

      <div className="relative z-10">
        <RevealOnScroll direction="up" delay={0.1} width="100%">
          <FloatingParallax speed={0.4}>
            <div className="mb-12">
              <h2 className="font-script text-5xl text-wedding-on-dark mb-4 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">{names}</h2>
            </div>
            <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-wedding-on-dark/40 max-w-md mx-auto leading-loose">{message}</p>
          </FloatingParallax>
        </RevealOnScroll>
      </div>
    </footer>
  );
}
