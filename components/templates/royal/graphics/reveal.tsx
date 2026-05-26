"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

const strokeVariants = {
  hidden: (custom: number) => ({
    strokeDasharray: custom,
    strokeDashoffset: custom,
  }),
  visible: {
    strokeDashoffset: 0,
    transition: { duration: 1.8, ease: [0.6, 0.1, 0.2, 1] as const },
  },
};

interface DrawRevealProps {
  children: ReactNode;
  length?: number;
  delay?: number;
  className?: string;
}

export function DrawReveal({
  children,
  length = 1000,
  delay = 0,
  className = "",
}: DrawRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  if (typeof window === "undefined") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ delay }}
        style={{ display: "inherit" }}
        custom={length}
        variants={strokeVariants}
      >
        {children}
      </motion.div>
    </div>
  );
}

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay,
      ease: [0.2, 0.7, 0.2, 1] as const,
    },
  }),
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({ children, delay = 0, className = "", style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        custom={delay}
        variants={revealVariants}
      >
        {children}
      </motion.div>
    </div>
  );
}
