"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const topLineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 22,
    },
  },
};

export default function BboldFooter() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="mt-8 w-full max-w-lg mx-auto"
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-7 sm:p-9 text-center shadow-xl backdrop-blur-md"
      >
        {/* Top razor-edge light accent with reveal expansion */}
        <motion.div
          variants={topLineVariants}
          className="pointer-events-none absolute inset-x-8 top-0 h-px origin-center bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
        />

        {/* Ambient subtle glow with idle breathing animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.55, 0.25],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-52 rounded-full bg-amber-400/20 blur-2xl"
        />

        {/* Reveal light sweep */}
        <motion.div
          variants={{
            hidden: { x: "-120%", opacity: 0 },
            visible: {
              x: "180%",
              opacity: [0, 0.35, 0],
              transition: { duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] },
            },
          }}
          className="pointer-events-none absolute -inset-y-12 w-36 -skew-x-20 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        {/* Headline with metallic idle sheen */}
        <motion.h2
          variants={itemVariants}
          className="relative text-xl sm:text-2xl font-bold uppercase tracking-wider text-stone-100 leading-snug"
          style={{ fontFamily: "var(--font-bbold-display)" }}
        >
          Website / Aplikasi
          <br />
          <motion.span
            animate={{
              backgroundPosition: ["0% 50%", "200% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-block bg-[linear-gradient(110deg,#fbbf24,35%,#fffbeb,50%,#f59e0b,65%,#fbbf24)] bg-[length:200%_auto] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
          >
            Gak Harus Mahal!
          </motion.span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-2 text-xs sm:text-sm text-stone-400 font-normal"
          style={{ fontFamily: "var(--font-bbold-body)" }}
        >
          Mau punya website atau katalog sekeren ini untuk brand kamu?
        </motion.p>

        {/* Action button with spring entrance, idle glow & micro-pulse */}
        <motion.div variants={buttonVariants} className="mt-6 flex justify-center">
          <div className="relative inline-flex">
            {/* Idle breathing halo behind button */}
            <motion.span
              animate={{
                scale: [0.96, 1.08, 0.96],
                opacity: [0.3, 0.65, 0.3],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -inset-1 rounded-full bg-amber-400/30 blur-md"
            />

            <motion.a
              href="/services/website-app"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="group relative inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-400/20 transition-all hover:bg-amber-300 hover:shadow-amber-400/35 cursor-pointer select-none"
              style={{ fontFamily: "var(--font-bbold-display)" }}
            >
              <span>Hubungi Kami</span>
              <motion.span
                animate={{
                  x: [0, 2, 0],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
                className="inline-flex"
              >
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}



