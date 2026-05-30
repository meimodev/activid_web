"use client";

import { motion } from "framer-motion";

const VW = 280;
const VH = 150;

const stemTransition = {
  duration: 2.0,
  ease: [0.4, 0, 0.2, 1] as const,
};

const drop1 = "M40,0 Q42,30 45,60 Q46,80 44,100 Q42,110 38,120 Q33,130 30,135";
const drop2 = "M140,0 Q142,25 144,50 Q145,70 143,85 Q140,98 135,108 Q130,115 126,120";
const drop3 = "M240,0 Q243,35 246,65 Q247,85 244,105 Q240,118 234,128 Q228,135 222,140";
const leaf1 = "M44,70 Q55,60 60,55";
const leaf2 = "M44,90 Q32,80 28,75";
const leaf3 = "M144,55 Q158,48 164,42";
const leaf4 = "M143,80 Q130,70 125,66";
const leaf5 = "M245,72 Q260,62 266,54";
const leaf6 = "M244,98 Q230,90 224,86";
const leafShape = "M0,7 Q4,0 8,7 Q12,14 8,20 Q4,26 0,20 Q-4,14 0,7 Z";
const rosePath = "M0,0 C-4,-8 -12,-10 -8,-16 C-4,-22 4,-22 8,-16 C12,-10 4,-8 0,0 Z";

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

export function VineCascade({ className }: { className?: string }) {
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
        {/* Drops + connecting vine sway together */}
        <motion.g
          animate={{ x: [0, 1.8, -1, 1.2, -0.5, 0], y: [0, -0.3, 0.2, -0.2, 0.1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {[drop1, drop2, drop3].map((d, i) => (
            <motion.path key={i} d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
              variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.55, transition: { ...stemTransition, delay: i * 0.3 } } }} />
          ))}
          <motion.path d="M40,0 Q90,-10 140,0 Q190,-10 240,0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay: 0.15 } } }} />
          {[{ d: leaf1, delay: 0.8 }, { d: leaf2, delay: 1.0 }, { d: leaf3, delay: 1.1 }, { d: leaf4, delay: 1.3 }, { d: leaf5, delay: 1.4 }, { d: leaf6, delay: 1.6 }].map(({ d, delay }, i) => (
            <motion.path key={i} d={d} stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none"
              variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 0.4, transition: { ...stemTransition, delay } } }} />
          ))}
        </motion.g>

        {[
          { x: 60, y: 55, r: 30, d: 1.2 }, { x: 28, y: 75, r: -140, d: 1.4 },
          { x: 164, y: 42, r: 25, d: 1.5 }, { x: 125, y: 66, r: -150, d: 1.7 },
          { x: 266, y: 54, r: 20, d: 1.9 }, { x: 224, y: 86, r: -155, d: 2.1 },
        ].map(({ x, y, r, d }, i) => (
          <motion.g key={i} custom={d} variants={elementReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, 1.8, -0.6, 0.7, -0.3, 0], x: [0, 0.5, -0.3, 0.3, -0.2, 0] }}
              transition={{ duration: 2.7 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={leafShape} fill="currentColor" opacity={0.5} transform={`translate(${x},${y}) scale(0.6) rotate(${r})`} />
            </motion.g>
          </motion.g>
        ))}

        {[
          { x: 30, y: 135, d: 1.8 }, { x: 126, y: 120, d: 2.1 }, { x: 222, y: 140, d: 2.5 },
        ].map(({ x, y, d }, i) => (
          <motion.g key={i} custom={d} variants={elementReveal} style={{ transformOrigin: pct(x, y) }}>
            <motion.g
              animate={{ rotate: [0, -1.5, 0.8, -0.5, 0], scale: [1, 1.015, 0.99, 1.01, 1] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <g transform={`translate(${x},${y}) scale(0.75)`}>
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <path key={angle} d={rosePath} fill="currentColor" opacity={0.55} transform={`rotate(${angle})`} />
                ))}
                <circle cx="0" cy="0" r="1.8" fill="currentColor" opacity={0.7} />
              </g>
            </motion.g>
          </motion.g>
        ))}
      </motion.svg>
    </div>
  );
}
