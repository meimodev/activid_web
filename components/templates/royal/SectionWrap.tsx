"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface SectionWrapProps {
  id?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionWrap({ id, children, className = "", style }: SectionWrapProps) {
  return (
    <motion.section
      id={id}
      className={`relative px-6 py-16 ${className}`}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px" }}
      variants={revealVariants}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] as const }}
    >
      {children}
    </motion.section>
  );
}

export function SectionDivider() {
  return (
    <hr
      className="border-t border-[var(--invitation-accent)]/15"
      aria-hidden
    />
  );
}
