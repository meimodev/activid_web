"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VW = 500;
const VH = 100;

const stemTransition = {
  duration: 1.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

const wavePath =
  "M0,50 C40,10 80,90 120,50 C160,10 200,90 240,50 C280,10 320,90 360,50 C400,10 440,90 480,50 L500,50";
const tendril1 = "M120,50 C130,20 145,10 150,6 M140,18 C148,12 152,14 154,10";
const tendril2 = "M240,50 C250,80 265,90 270,94 M260,82 C268,88 272,86 274,90";
const tendril3 = "M360,50 C370,20 385,10 390,6 M380,18 C388,12 392,14 394,10";
const budPath =
  "M0,0 C-2,-6 -6,-8 -6,-12 C-6,-16 -2,-18 0,-18 C2,-18 6,-16 6,-12 C6,-8 2,-6 0,0 Z";

const leafReveal = {
  hidden: { scale: 0, rotate: -30, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, rotate: 0, opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};
const budReveal = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};

function pct(x: number, y: number) {
  return `${((x / VW) * 100).toFixed(1)}% ${((y / VH) * 100).toFixed(1)}%`;
}

export function VineWavy({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={className}>
      <motion.svg
        viewBox={`0 0 ${VW} ${VH}`}
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", color: "var(--invitation-accent)" }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Wave stem + tendrils sway together */}
        <motion.g
          animate={{ x: [0, 3, -1.5, 2, -0.5, 0], y: [0, -0.6, 0.4, -0.3, 0.2, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path d={wavePath} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.6, transition: stemTransition } }} />
          <motion.path d={tendril1} stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.45, transition: { ...stemTransition, delay: 0.4 } } }} />
          <motion.path d={tendril2} stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.45, transition: { ...stemTransition, delay: 0.8 } } }} />
          <motion.path d={tendril3} stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.45, transition: { ...stemTransition, delay: 1.2 } } }} />
        </motion.g>

        {[
          { x: 60, y: 32, r: -50, d: 0.6 },
          { x: 170, y: 80, r: 30, d: 0.9 },
          { x: 290, y: 19, r: -60, d: 1.2 },
          { x: 410, y: 74, r: 40, d: 1.5 },
        ].map(({ x, y, r, d }, i) => (
          <motion.g key={i} custom={d} variants={leafReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, 2, -0.8, 1, -0.5, 0], x: [0, -0.5, 0.3, -0.4, 0.2, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M0,7 Q4,0 8,7 Q12,14 8,20 Q4,26 0,20 Q-4,14 0,7 Z" fill="currentColor" opacity={0.5} transform={`translate(${x},${y}) scale(0.7) rotate(${r})`} />
            </motion.g>
          </motion.g>
        ))}

        {[
          { x: 60, y: 20, d: 1.7 },
          { x: 170, y: 92, d: 2.1 },
          { x: 290, y: 8, d: 2.4 },
        ].map(({ x, y, d }, i) => (
          <motion.g key={i} custom={d} variants={budReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, -3, 1.5, -1, 0], scale: [1, 1.02, 0.99, 1.01, 1] }}
              transition={{ duration: 3.5 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={budPath} fill="currentColor" opacity={0.55} transform={`translate(${x},${y}) scale(0.55)`} />
            </motion.g>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
