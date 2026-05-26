"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { RoyalSectionId } from "./types";

interface NavItem {
  id: RoyalSectionId;
  label: string;
  icon: ReactNode;
}

interface FloatingNavProps {
  items: NavItem[];
  active: RoyalSectionId;
  onSelect: (id: RoyalSectionId) => void;
  right?: ReactNode;
}

export function FloatingNav({
  items,
  active,
  onSelect,
  right,
}: FloatingNavProps) {
  return (
    <motion.div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 px-2 py-2 rounded-full shadow-xl"
      style={{
        background: "color-mix(in srgb, var(--invitation-bg) 88%, transparent)",
        border: "1px solid color-mix(in srgb, var(--invitation-accent) 12%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] px-2 py-1.5 rounded-full transition-colors duration-200 text-[10px] font-[var(--font-royal-sans)] tracking-[0.04em]"
          style={{
            color:
              active === item.id
                ? "var(--invitation-accent)"
                : "var(--invitation-text-light)",
            background:
              active === item.id
                ? "color-mix(in srgb, var(--invitation-accent) 12%, transparent)"
                : "transparent",
          }}
        >
          <span className="text-base">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      {right && <div className="ml-1">{right}</div>}
    </motion.div>
  );
}
