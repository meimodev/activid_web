"use client";

import { motion } from "framer-motion";

const VW = 500;
const VH = 140;

const stemTransition = {
  duration: 1.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

const flourishPath =
  "M0,50 Q60,35 100,40 Q160,50 200,30 Q260,8 320,25 Q380,42 420,20 Q460,2 500,15";
const arch1 = "M100,40 Q120,5 140,40";
const arch2 = "M200,30 Q225,0 250,30";
const arch3 = "M320,25 Q345,-5 370,25";
const arch4 = "M420,20 Q445,-10 470,20";
const diamondPath = "M0,-8 L6,0 L0,8 L-6,0 Z";
const leafShape = "M0,7 Q4,0 8,7 Q12,14 8,20 Q4,26 0,20 Q-4,14 0,7 Z";

const elementReveal = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};

function pct(x: number, y: number) {
  return `${((x / VW) * 100).toFixed(1)}% ${((y / VH) * 100).toFixed(1)}%`;
}

export function VineOrnamental({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.svg
        viewBox={`0 0 ${VW} ${VH}`}
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", color: "var(--invitation-accent)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
      >
        {/* Flourish + arches + parallels sway together */}
        <motion.g
          animate={{ x: [0, 1.5, -0.8, 1, -0.4, 0], y: [0, -0.3, 0.2, -0.2, 0.1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path d={flourishPath} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55, transition: stemTransition } }} />
          <motion.path d="M0,60 Q60,45 100,50 Q160,60 200,40 Q260,18 320,35 Q380,52 420,30 Q460,12 500,25"
            stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" fill="none" strokeDasharray="2 4"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.3, transition: { ...stemTransition, delay: 0.3 } } }} />
          {[arch1, arch2, arch3, arch4].map((arch, i) => (
            <motion.path key={i} d={arch} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"
              variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay: 0.5 + i * 0.35 } } }} />
          ))}
          <motion.path d="M0,90 Q60,105 100,100 Q160,90 200,110 Q260,132 320,115 Q380,98 420,120 Q460,138 500,125"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.35, transition: { ...stemTransition, delay: 0.6 } } }} />
        </motion.g>

        {[
          { x: 120, y: 5, d: 0.7 }, { x: 225, y: 0, d: 1.1 }, { x: 345, y: -5, d: 1.5 }, { x: 445, y: -10, d: 1.9 },
        ].map(({ x, y, d }, i) => (
          <motion.g key={i} custom={d} variants={elementReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, -2, 1.5, -0.8, 0], scale: [1, 1.02, 0.99, 1.01, 1] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={diamondPath} fill="currentColor" opacity={0.5} transform={`translate(${x},${y})`} />
            </motion.g>
          </motion.g>
        ))}

        {[
          { x: 60, y: 35, r: -55, d: 0.3 }, { x: 160, y: 50, r: 20, d: 0.8 },
          { x: 260, y: 8, r: -35, d: 1.3 }, { x: 380, y: 42, r: 25, d: 1.6 }, { x: 460, y: 2, r: -20, d: 1.8 },
        ].map(({ x, y, r, d }, i) => (
          <motion.g key={i} custom={d} variants={elementReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, 1.5, -0.6, 0.8, -0.3, 0], x: [0, 0.4, -0.2, 0.3, -0.1, 0] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={leafShape} fill="currentColor" opacity={0.45} transform={`translate(${x},${y}) scale(0.65) rotate(${r})`} />
            </motion.g>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
