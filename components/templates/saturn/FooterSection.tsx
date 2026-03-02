"use client";

import { Host } from "@/types/invitation";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";
import { motion } from "framer-motion";
import { DateTime } from "luxon";

interface FooterSectionProps {
  hosts: Host[];
  message: string;
}

export function FooterSection({ hosts }: FooterSectionProps) {
  const names = hosts.map((h) => h?.firstName).filter(Boolean);
  const year = DateTime.now().year;

  // Generate random stars for the background
  const stars = Array.from({ length: 42 }).map((_, i) => ({
    id: i,
    x: (i * 37) % 100,
    y: (i * 19) % 100,
    size: 1 + ((i * 11) % 3),
    dur: 2.4 + ((i * 7) % 10) * 0.38,
    delay: ((i * 5) % 12) * 0.28,
    opacity: 0.18 + ((i * 13) % 10) * 0.05,
  }));

  return (
    <footer className="relative mt-8 py-24 bg-wedding-dark border-t border-wedding-on-dark/5 text-center text-wedding-on-dark/80 overflow-hidden">
      {/* Simple stars background just for footer */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--invitation-on-dark) 85%, transparent) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      
      {/* Animated starry night overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 260, repeat: Infinity, ease: "linear" }}
        >
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-wedding-on-dark shadow-[0_0_4px_color-mix(in_srgb,var(--invitation-on-dark)_90%,transparent)]"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
              }}
              animate={{
                opacity: [star.opacity, Math.min(1, star.opacity + 0.6), star.opacity],
                scale: [1, 1.35, 1],
              }}
              transition={{
                duration: star.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.delay,
              }}
            />
          ))}
        </motion.div>

        {/* Shooting Star */}
        <motion.div
          className="absolute -top-12 left-[-35%] w-[65%] h-[2px] bg-linear-to-r from-transparent via-wedding-on-dark/70 to-transparent opacity-0"
          animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3.1,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 4.2,
          }}
          style={{ transform: "rotate(18deg)" }}
        />

        {/* Orbit Rings mimicking Saturn theme */}
        <motion.div
          className="absolute left-[22%] top-[50%] w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-2 right-12 w-2.5 h-2.5 rounded-full bg-wedding-accent/70 shadow-[0_0_18px_color-mix(in_srgb,var(--invitation-accent)_55%,transparent)]" />
        </motion.div>

        <motion.div
          className="absolute left-[78%] top-[38%] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 74, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-wedding-accent-2/80 shadow-[0_0_18px_color-mix(in_srgb,var(--invitation-accent-2)_55%,transparent)]" />
        </motion.div>
      </div>
      
      {/* Gradient fade to blend with above section */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-wedding-dark to-transparent z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.25} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-on-dark/5 border border-wedding-on-dark/10 text-xs font-mono text-wedding-on-dark/80 backdrop-blur-md relative overflow-hidden mb-4">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-wedding-accent/20 to-transparent animate-[gradient_4s_linear_infinite]" />
            <span className="relative w-2 h-2 rounded-full bg-wedding-accent animate-pulse shadow-[0_0_10px_var(--invitation-accent)]" />
            <span className="relative">
              {names.length <= 2 
                ? `${names[0] ?? ""}${names[1] ? ` & ${names[1]}` : ""}`
                : names.join(" • ")}
            </span>
          </div>
          
          <h3
            className={`mt-4 font-heading text-3xl bg-linear-to-r from-wedding-accent via-wedding-accent-2 to-wedding-accent bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite] drop-shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-accent)_40%,transparent)] tracking-[0.2em]`}
          >
            Misi Berhasil
          </h3>
          
          <p className="mt-6 text-sm text-wedding-on-dark/70 font-body leading-relaxed max-w-md mx-auto">
            MISI SELESAI! <br />
            Terima kasih sudah menjelajah bersama <br />
            Activid Invitation
          </p>
          
          <div className="mt-10 flex items-center justify-center">
            <a
              href="https://invitation.activid.id"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-wedding-on-dark/5 border border-wedding-on-dark/10 text-xs font-heading text-wedding-on-dark/80 backdrop-blur-md transition-all hover:border-wedding-accent/30 hover:shadow-[0_0_40px_-10px_color-mix(in_srgb,var(--invitation-accent)_35%,transparent)]"
            >
              <span className="uppercase tracking-[0.25em]">
                Kembali Pulang 🚀
              </span>
            </a>
          </div>
          
          <div className="mt-12 h-px w-full max-w-md bg-wedding-on-dark/10" />
          
          <p className="mt-8 text-[11px] tracking-[0.25em] uppercase text-wedding-on-dark/40 font-body">
            © {year} Activid Invitation
          </p>
        </StaggerRevealOnScroll>
      </div>
    </footer>
  );
}
