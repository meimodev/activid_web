"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { DateTime } from "luxon";
import { Host } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

interface FooterSectionProps {
  hosts: Host[];
  message: string;
}

export function FooterSection({ hosts, message }: FooterSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;
  const year = DateTime.now().year;

  void message;

  const stars = useMemo(() => {
    const count = 28;
    return Array.from({ length: count }, (_, i) => {
      const x = (i * 37) % 100;
      const y = (i * 71) % 100;
      const size = 1 + ((i * 13) % 3);
      const dur = 3.4 + ((i * 11) % 25) / 10;
      const delay = ((i * 17) % 20) / 10;
      const opacity = 0.18 + ((i * 13) % 10) * 0.05;
      return { x, y, size, dur, delay, opacity };
    });
  }, []);

  return (
    <footer className="relative mt-0 overflow-hidden bg-[#070712] border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent)]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/85" />

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
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
          className="absolute left-1/2 top-[42%] w-[540px] h-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
          animate={{ rotate: -360 }}
          transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-4 left-1/2 w-3 h-3 -translate-x-1/2 bg-amber-200/80 rounded-full blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.55)]" />
        </motion.div>

        <motion.div
          className="absolute left-[72%] top-[62%] w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 54, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute bottom-6 left-10 w-2 h-2 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        </motion.div>

        <div className="absolute -bottom-56 left-1/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -top-56 left-3/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <motion.div
          className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
          animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
          transition={{
            duration: 3.0,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 4.2,
          }}
          style={{ transform: "rotate(18deg)" }}
        />
      </div>

      <div className="relative px-6 py-14">
        <div className="max-w-3xl mx-auto text-center text-white">
          <RevealOnScroll
            direction="up"
            width="100%"
            delay={0.15}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 backdrop-blur-md relative overflow-hidden">
              <span className="relative w-2 h-2 rounded-full bg-amber-200 animate-pulse shadow-[0_0_10px_#fbbf24]" />
              <span className="relative">{names}</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.35}>
            <h3 className="font-tan-mon-cheri mt-7 text-5xl leading-none text-white">
              Terima kasih
            </h3>
            <p className="font-garet-book font-bold mt-4 text-md text-white/70 whitespace-pre-line">
              MISI SELESAI!{" "}
            </p>
            <p className=" text-sm text-white/70 whitespace-pre-line">
              Kabar bahagia behasil disebar diseluruh pelosok antariksa{" "}
            </p>
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.55}>
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
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.75}>
            <div className="mt-10 h-px w-full bg-white/10" />
          </RevealOnScroll>

          <RevealOnScroll direction="up" width="100%" delay={0.95}>
            <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-white/40 font-body">
              © {year} Activid Invitation
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </footer>
  );
}
