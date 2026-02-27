"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { InvitationConfig } from "@/types/invitation";
import { venusScript } from "./fonts";
import { VenusReveal } from "./reveal";

export function FooterSection({
  couple,
}: {
  couple: InvitationConfig["couple"];
}) {
  const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;

  const stars = useMemo(() => {
    return Array.from({ length: 34 }, (_, i) => {
      const x = (i * 23 + 11) % 100;
      const y = (i * 37 + 19) % 100;
      const size = 1 + ((i * 13) % 3);
      const dur = 2.2 + ((i * 7) % 10) * 0.35;
      const delay = ((i * 5) % 10) * 0.25;
      const opacity = 0.25 + ((i * 11) % 10) * 0.04;
      return { x, y, size, dur, delay, opacity };
    });
  }, []);

  return (
    <footer className="relative mt-8 overflow-hidden bg-[#0d0d1f] border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent)]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/70" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%] animate-[shimmer_2s_linear_infinite]" />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
        >
          {stars.map((s, idx) => (
            <motion.span
              key={idx}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
              }}
              animate={{
                opacity: [s.opacity, Math.min(1, s.opacity + 0.55), s.opacity],
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
          className="absolute left-[18%] top-[32%] w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-2 right-10 w-2.5 h-2.5 rounded-full bg-purple-300/70 shadow-[0_0_18px_rgba(192,132,252,0.55)]" />
        </motion.div>

        <motion.div
          className="absolute left-[82%] top-[58%] w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-indigo-200/80 shadow-[0_0_18px_rgba(165,180,252,0.55)]" />
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" />
          <div className="absolute bottom-8 left-10 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.65)]" />
        </motion.div>

        <motion.div
          className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
          animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3.2,
          }}
          style={{ transform: "rotate(18deg)" }}
        />

        <motion.div
          className="absolute top-[10%] left-[-25%] w-[45%] h-[2px] bg-linear-to-r from-transparent via-cyan-200/80 to-transparent opacity-0"
          animate={{ x: ["0%", "240%"], y: ["0%", "140%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 5.5,
            delay: 1.8,
          }}
          style={{ transform: "rotate(14deg)" }}
        />

        <motion.div
          className="absolute top-[35%] left-[-35%] w-[65%] h-[2px] bg-linear-to-r from-transparent via-purple-200/70 to-transparent opacity-0"
          animate={{ x: ["0%", "220%"], y: ["0%", "90%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3.1,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 6.2,
            delay: 4.1,
          }}
          style={{ transform: "rotate(22deg)" }}
        />

        <motion.div
          className="absolute -bottom-40 left-1/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{ x: [0, 26, 0], y: [0, -18, 0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -top-56 left-3/4 w-[520px] h-[520px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ x: [0, -22, 0], y: [0, 24, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative px-6 py-12 ">
        <div className="max-w-3xl mx-auto text-center text-white">
          <VenusReveal
            direction="up"
            width="100%"
            delay={0.15}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-300 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent animate-[gradient_4s_linear_infinite]" />
              <span className="relative w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
              <span className="relative">{names}</span>
            </div>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.35}>
            <h3
              className={`mt-4 ${venusScript.className} text-5xl bg-linear-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_4s_linear_infinite]`}
              style={{
                textShadow: "0 0 40px rgba(79, 70, 229, 0.4)",
                WebkitBackgroundClip: "text",
              }}
            >
              Misi selesai
            </h3>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.55}>
            <p className="mt-4 text-sm text-indigo-200/70 font-light leading-relaxed">
              Terima kasih sudah menjelajah bersama <br />Activid Invitation
            </p>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.75}>
            <div className="mt-7 flex items-center justify-center">
              <a
                href="https://invitation.activid.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-200 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.35)]"
              >
                <span className="uppercase tracking-[0.25em]">
                  Kembali Pulang 🚀
                </span>
              </a>
            </div>
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={0.95}>
            <div className="mt-10 h-px w-full bg-white/10" />
          </VenusReveal>

          <VenusReveal direction="up" width="100%" delay={1.15}>
            <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-white/40 font-body">
              © {new Date().getFullYear()} Activid Invitation
            </p>
          </VenusReveal>
        </div>
      </div>
    </footer>
  );
}
