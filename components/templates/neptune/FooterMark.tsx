"use client";

import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { useMemo } from "react";

import type { Host } from "@/types/invitation";

import { neptuneScript } from "./fonts";
import { NeptuneReveal } from "./reveal";

export function FooterMark({ hosts }: { hosts: Host[] }) {
  const year = DateTime.now().year;
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  const stars = useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => {
      const x = (i * 37) % 100;
      const y = (i * 19) % 100;
      const size = 1 + ((i * 11) % 3);
      const dur = 2.4 + ((i * 7) % 10) * 0.38;
      const delay = ((i * 5) % 12) * 0.28;
      const opacity = 0.18 + ((i * 13) % 10) * 0.05;
      return { x, y, size, dur, delay, opacity };
    });
  }, []);

  return (
    <footer className="relative mt-8 overflow-hidden bg-wedding-dark border-t border-wedding-on-dark/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--invitation-accent-2)_10%,transparent),transparent)]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-wedding-dark/25 to-wedding-dark/80" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,transparent_25%,color-mix(in_srgb,var(--invitation-on-dark)_28%,transparent)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 260, repeat: Infinity, ease: "linear" }}
        >
          {stars.map((s, idx) => (
            <motion.span
              key={idx}
              className="absolute rounded-full bg-wedding-on-dark"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
              }}
              animate={{
                opacity: [s.opacity, Math.min(1, s.opacity + 0.6), s.opacity],
                scale: [1, 1.35, 1],
              }}
              transition={{
                duration: s.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.delay,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute left-[22%] top-[50%] w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 68, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-2 right-12 w-2.5 h-2.5 rounded-full bg-wedding-accent-2-light/70 shadow-[0_0_18px_color-mix(in_srgb,var(--invitation-accent-2-light)_55%,transparent)]" />
        </motion.div>

        <motion.div
          className="absolute left-[78%] top-[38%] w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-wedding-on-dark/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 74, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-wedding-accent/80 shadow-[0_0_18px_color-mix(in_srgb,var(--invitation-accent)_55%,transparent)]" />
        </motion.div>

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
      </div>

      <div className="relative px-6 py-12 ">
        <div className="max-w-3xl mx-auto text-center text-wedding-on-dark">
          <NeptuneReveal
            direction="up"
            width="100%"
            delay={0.25}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wedding-on-dark/5 border border-wedding-on-dark/10 text-xs font-mono text-wedding-on-dark/80 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-wedding-accent-2/20 to-transparent animate-[gradient_4s_linear_infinite]" />
              <span className="relative w-2 h-2 rounded-full bg-wedding-accent-2 animate-pulse shadow-[0_0_10px_var(--invitation-accent-2)]" />
              <span className="relative">{names}</span>
            </div>
          </NeptuneReveal>

          <NeptuneReveal direction="up" width="100%" delay={0.75}>
            <h3
              className={`mt-4 ${neptuneScript.className} text-2xl bg-linear-to-r from-wedding-accent via-wedding-accent-2-light to-wedding-accent-2 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]`}
              style={{
                textShadow:
                  "0 0 40px color-mix(in srgb, var(--invitation-accent-2) 40%, transparent)",
                WebkitBackgroundClip: "text",
              }}
            >
              Selamat Berbahagia
            </h3>
          </NeptuneReveal>

          <NeptuneReveal direction="up" width="100%" delay={1.25}>
            <p className="mt-4 text-sm text-wedding-on-dark/70 font-light leading-relaxed">
              MISI SELESAI! <br />
              Terima kasih sudah menjelajah bersama <br />
              Activid Invitation
            </p>
          </NeptuneReveal>

          <NeptuneReveal direction="up" width="100%" delay={1.75}>
            <div className="mt-7 flex items-center justify-center">
              <a
                href="https://invitation.activid.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-wedding-on-dark/5 border border-wedding-on-dark/10 text-xs font-mono text-wedding-on-dark/80 backdrop-blur-md transition-all hover:border-wedding-accent-2/30 hover:shadow-[0_0_40px_-10px_color-mix(in_srgb,var(--invitation-accent-2)_35%,transparent)]"
              >
                <span className="uppercase tracking-[0.25em]">
                  Kembali Pulang 🚀
                </span>
              </a>
            </div>
          </NeptuneReveal>

          <NeptuneReveal direction="up" width="100%" delay={2.25}>
            <div className="mt-10 h-px w-full bg-wedding-on-dark/10" />
          </NeptuneReveal>

          <NeptuneReveal direction="up" width="100%" delay={2.55}>
            <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-wedding-on-dark/40 font-body">
              © {year} Activid Invitation
            </p>
          </NeptuneReveal>
        </div>
      </div>
    </footer>
  );
}
