"use client";

import { motion } from "framer-motion";

const VW = 200;
const VH = 520;

const stemTransition = {
  duration: 2.2,
  ease: [0.4, 0, 0.2, 1] as const,
};

const spinePath =
  "M100,520 Q90,440 110,390 Q130,340 100,290 Q70,240 90,190 Q110,140 100,90 Q90,40 100,0";
const shoot1 = "M100,400 Q125,385 145,360 Q160,340 170,320";
const shoot2 = "M90,290 Q65,270 45,245 Q30,225 20,205";
const shoot3 = "M105,190 Q130,175 150,155 Q165,140 175,120";
const leafShape = "M0,7 Q4,0 8,7 Q12,14 8,20 Q4,26 0,20 Q-4,14 0,7 Z";
const bellPetal = "M0,0 C-5,-8 -8,-16 -6,-20 C-4,-24 4,-24 6,-20 C8,-16 5,-8 0,0 Z";

const leafReveal = {
  hidden: { scale: 0, rotate: -30, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, rotate: 0, opacity: 1,
    transition: { duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};
const flowerReveal = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};

function pct(x: number, y: number) {
  return `${((x / VW) * 100).toFixed(1)}% ${((y / VH) * 100).toFixed(1)}%`;
}

export function VineVertical({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.svg
        viewBox={`0 0 ${VW} ${VH}`}
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        style={{ width: "100%", height: "100%", color: "var(--invitation-accent)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
      >
        {/* Spine + shoots sway together */}
        <motion.g
          animate={{ x: [0, 2, -1.2, 1.5, -0.6, 0], y: [0, -0.3, 0.2, -0.4, 0.2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path d={spinePath} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55, transition: stemTransition } }} />
          <motion.path d={shoot1} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay: 0.6 } } }} />
          <motion.path d={shoot2} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay: 1.0 } } }} />
          <motion.path d={shoot3} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay: 1.4 } } }} />
        </motion.g>

        {[
          { x: 115, y: 440, r: -15, d: 0.4 }, { x: 78, y: 390, r: -135, d: 0.7 },
          { x: 115, y: 340, r: -25, d: 1.0 }, { x: 80, y: 290, r: -145, d: 1.3 },
          { x: 115, y: 240, r: -15, d: 1.6 }, { x: 82, y: 190, r: -140, d: 1.9 },
          { x: 108, y: 140, r: -20, d: 2.1 }, { x: 85, y: 90, r: -135, d: 2.3 },
          { x: 105, y: 40, r: -25, d: 2.5 },
        ].map(({ x, y, r, d }, i) => (
          <motion.g key={i} custom={d} variants={leafReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, 1.5, -0.7, 0.5, -0.3, 0], x: [0, 0.4, -0.3, 0.2, -0.2, 0] }}
              transition={{ duration: 2.6 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={leafShape} fill="currentColor" opacity={0.5} transform={`translate(${x},${y}) scale(0.7) rotate(${r})`} />
            </motion.g>
          </motion.g>
        ))}

        {[
          { x: 170, y: 320, d: 2.0 }, { x: 20, y: 205, d: 2.3 }, { x: 175, y: 120, d: 2.7 },
        ].map(({ x, y, d }, i) => (
          <motion.g key={i} custom={d} variants={flowerReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, -1.2, 0.6, -0.4, 0], scale: [1, 1.012, 0.99, 1.008, 1] }}
              transition={{ duration: 3.8 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <g transform={`translate(${x},${y}) scale(0.8)`}>
                {[-45, -22, 0, 22, 45].map((angle) => (
                  <path key={angle} d={bellPetal} fill="currentColor" opacity={0.55} transform={`rotate(${angle})`} />
                ))}
                <circle cx="0" cy="0" r="1.8" fill="currentColor" opacity={0.75} />
              </g>
            </motion.g>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
