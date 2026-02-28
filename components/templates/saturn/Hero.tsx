"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { Host } from "@/types/invitation";

interface HeroProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  subtitle: string;
  coverImage: string;
}

export function Hero({ onOpen, hosts, date, subtitle, coverImage }: HeroProps) {
  const primary = hosts[0];
  const secondary = hosts[1];
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);

  return (
  <div className="relative h-screen w-full overflow-hidden bg-wedding-bg">
  {/* Background Image - Full Screen with Fade */}
  <motion.div
  className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
  style={{
  backgroundImage: `url(${coverImage})`,
  scale
  }}
  >
  <div className="absolute inset-0 bg-gradient-to-b from-wedding-bg via-transparent to-wedding-bg" />
  <div className="absolute inset-0 bg-gradient-to-r from-wedding-bg via-transparent to-wedding-bg" />
  </motion.div>

  {/* Scanning Scanline Effect */}
  <div className="absolute inset-0 pointer-events-none z-0">
  <div className="w-full h-[2px] bg-wedding-accent/20 blur-[1px] animate-scan-slow opacity-50" />
  </div>

  {/* Central Content */}
  <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
  <motion.div
  style={{ opacity }}
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="flex flex-col items-center gap-6 "
  >
  {/* Top Tagline */}
  <div className="flex items-center gap-4">
  <div className="w-8 h-px bg-gradient-to-r from-transparent to-wedding-accent" />
  <span className="font-heading text-xs tracking-[0.5em] uppercase text-wedding-accent/80">
  {subtitle || "THE WEDDING OF"}
  </span>
  <div className="w-8 h-px bg-gradient-to-l from-transparent to-wedding-accent" />
  </div>

  {/* Names - Massive & Glowing */}
  <div className="relative py-4">
  <h1 className="font-heading text-5xl  text-white leading-tight filter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
  <span className="block">{primary?.firstName ?? ""}</span>
  {secondary ? (
  <>
  <span className="block text-2xl  text-wedding-accent my-2 opacity-80">&</span>
  <span className="block">{secondary.firstName}</span>
  </>
  ) : null}
  </h1>

  {/* Decorative Brackets around Names */}
  <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-wedding-accent/50" />
  <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-wedding-accent/50" />
  <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-wedding-accent/50" />
  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-wedding-accent/50" />
  </div>

  {/* Date / Stardate */}
  <p className="mt-4 font-mono text-sm text-wedding-text-light tracking-[0.3em]">
  STARDATE {date.replace(/ /g, ".")}{" // SECTOR 001"}
  </p>

  {/* Initialize Button */}
  <motion.button
  whileHover={{ scale: 1.05, letterSpacing: "0.4em" }}
  whileTap={{ scale: 0.95 }}
  onClick={onOpen}
  className="mt-12 group relative px-10 py-4 bg-wedding-bg-alt/30 border border-wedding-accent/30 overflow-hidden"
  >
  <div className="absolute inset-0 bg-wedding-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
  <div className="relative z-10 flex items-center gap-3">
  <span className="w-1.5 h-1.5 rounded-full bg-wedding-accent animate-pulse" />
  <span className="font-heading text-xs uppercase tracking-[0.3em] text-wedding-accent-light group-hover:text-white transition-colors">
  Initialize Sequence
  </span>
  </div>

  {/* Button Corner Accents */}
  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-wedding-accent" />
  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-wedding-accent" />
  </motion.button>
  </motion.div>
  </div>

  {/* HUD Elements - Corners */}
  <div className="absolute top-8 left-8 hidden ">
  <div className="flex flex-col gap-1">
  <span className="text-[10px] items-center text-cyan-500/40 font-mono tracking-widest">SYS.READY</span>
  <div className="w-24 h-[1px] bg-cyan-500/20" />
  </div>
  </div>
  <div className="absolute bottom-8 right-8 hidden ">
  <div className="flex flex-col items-end gap-1">
  <span className="text-[10px] items-center text-cyan-500/40 font-mono tracking-widest">V.1.0.4</span>
  <div className="w-24 h-[1px] bg-cyan-500/20" />
  </div>
  </div>

  {/* Vertical Data Lines */}
  <div className="absolute top-1/2 left-6 -translate-y-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden " />
  <div className="absolute top-1/2 right-6 -translate-y-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent hidden " />
  </div>
  );
}
