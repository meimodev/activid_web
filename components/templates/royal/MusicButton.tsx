"use client";

import { motion } from "framer-motion";
import { IconPlay, IconPause } from "./icons";

interface MusicButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function MusicButton({ isPlaying, onToggle }: MusicButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 40% 35%, var(--invitation-accent-2, #f2e3d5), color-mix(in srgb, var(--invitation-accent-2, #f2e3d5) 80%, black))",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.35), 0 0 0 1.5px color-mix(in srgb, var(--invitation-accent) 30%, transparent)",
        color: "var(--invitation-dark, #1a0e1c)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isPlaying ? "Pause Music" : "Play Music"}
    >
      {/* rotating ring on play */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px dashed color-mix(in srgb, var(--invitation-accent) 60%, transparent)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* inner glow ring */}
      <div
        className="absolute inset-1 rounded-full"
        style={{
          border: "1px solid color-mix(in srgb, var(--invitation-accent) 25%, transparent)",
        }}
      />

      {/* icon */}
      <motion.span
        className="relative z-[2] flex items-center justify-center"
        animate={isPlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </motion.span>

      {/* subtle shimmer on hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--invitation-accent) 25%, transparent) 0%, transparent 60%)",
        }}
      />
    </motion.button>
  );
}
