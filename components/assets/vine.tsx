"use client";

import { motion } from "framer-motion";

const VW = 500;
const VH = 100;

const stemTransition = {
  duration: 1.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

const basePath =
  "M0,80 Q60,60 120,65 Q180,70 220,55 Q280,38 340,45 Q400,52 460,40 Q490,32 500,30";
const branch2 = "M220,55 Q240,28 280,18";
const branch3 = "M340,45 Q350,20 390,14";
const leafShape =
  "M0,7 Q4,1 8,7 Q12,13 8,19 Q4,25 0,19 Q-4,13 0,7 Z";
const petalPath =
  "M0,0 C-3,-10 -12,-12 -8,-18 C-4,-24 4,-24 8,-18 C12,-12 3,-10 0,0 Z";

const leafReveal = {
  hidden: { scale: 0, rotate: -40, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, rotate: 0, opacity: 1,
    transition: { duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};
const flowerReveal = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1, opacity: 1,
    transition: { duration: 0.8, delay, ease: [0.34, 1.56, 0.64, 1] as const },
  }),
};

function pct(x: number, y: number) {
  return `${((x / VW) * 100).toFixed(1)}% ${((y / VH) * 100).toFixed(1)}%`;
}

export function Vine({ className }: { className?: string }) {
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
        {/* Stem + branches sway together */}
        <motion.g
          animate={{ x: [0, 2, -1, 1.5, -0.5, 0], y: [0, -0.5, 0.3, -0.4, 0.2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.path
            d={basePath}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.6, transition: stemTransition },
            }}
          />
          <motion.path
            d={branch2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.5, transition: { ...stemTransition, delay: 0.5 } },
            }}
          />
          <motion.path
            d={branch3}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 0.45, transition: { ...stemTransition, delay: 0.9 } },
            }}
          />
        </motion.g>

        {/* Leaves — entrance + breeze wiggle */}
        {[
          { x: 120, y: 65, r: -20, d: 0.7, s: 0.8 },
          { x: 220, y: 55, r: -45, d: 1.1, s: 0.75 },
          { x: 280, y: 18, r: 20, d: 1.3, s: 0.7 },
          { x: 340, y: 45, r: -30, d: 0.9, s: 0.75 },
          { x: 390, y: 14, r: 35, d: 1.2, s: 0.65 },
          { x: 460, y: 40, r: -15, d: 1.4, s: 0.7 },
          { x: 60, y: 60, r: -60, d: 0.5, s: 0.8 },
        ].map(({ x, y, r, d, s }, i) => (
          <motion.g
            key={i}
            custom={d}
            variants={leafReveal}
            style={{ transformOrigin: pct(x, y) }}
          >
            <motion.g
              animate={{
                rotate: [0, 1.8, -0.8, 0.6, -0.4, 0],
                x: [0, 0.6, -0.3, 0.4, -0.2, 0],
              }}
              transition={{
                duration: 2.8 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d={leafShape}
                fill="currentColor"
                opacity={0.55}
                transform={`translate(${x},${y}) scale(${s}) rotate(${r})`}
              />
            </motion.g>
          </motion.g>
        ))}

        {/* Flowers — entrance + gentle breeze wobble */}
        {[
          { x: 280, y: 18, d: 1.9, s: 1.15 },
          { x: 220, y: 55, d: 1.6, s: 1 },
          { x: 390, y: 14, d: 2.2, s: 1.1 },
        ].map(({ x, y, d, s }, i) => (
          <motion.g
            key={i}
            custom={d}
            variants={flowerReveal}
            style={{ transformOrigin: pct(x, y) }}
          >
            <motion.g
              animate={{
                rotate: [0, 1.2, -0.6, 0.4, 0],
                scale: [1, 1.015, 0.99, 1.01, 1],
              }}
              transition={{
                duration: 3.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              transform={`translate(${x},${y}) scale(${s})`}
            >
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <path
                  key={angle}
                  d={petalPath}
                  fill="currentColor"
                  opacity={0.6}
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="2.5" fill="currentColor" opacity={0.8} />
            </motion.g>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
