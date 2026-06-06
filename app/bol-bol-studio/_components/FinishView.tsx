"use client";

import { motion } from "framer-motion";
import { EASE_OUT, POP } from "./motion";

export default function FinishView({ onFinishOrder, isActive = false }: { onFinishOrder: () => void; isActive?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center bg-blue-800 p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 24 }}
        transition={POP}
        className="relative w-full max-w-sm rounded-3xl border-2 border-blue-800 bg-white p-8 text-center text-blue-800 shadow-lg"
      >
        {/* Animated success badge */}
        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
          {/* Idle: soft pulsing ring celebrates the completed booking. */}
          <motion.span
            className="absolute inset-0 rounded-full bg-amber-400/30"
            animate={isActive ? { scale: [1, 1.5], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-800 text-3xl text-white"
            initial={{ scale: 0 }}
            animate={isActive ? { scale: 1 } : { scale: 0 }}
            transition={{ ...POP, delay: 0.15 }}
          >
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
              transition={{ ...POP, delay: 0.3 }}
            >
              ✓
            </motion.span>
          </motion.span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.25 }}
          className="mb-4 text-3xl"
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Thank You
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.35 }}
          className="mb-4 text-sm"
          style={{ fontFamily: "var(--font-studio-body)" }}
        >
          Pesanan anda telah diterima, anda akan dihubungi admin kami yaaa.
        </motion.p>
        <motion.button
          type="button"
          onClick={onFinishOrder}
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.45 }}
          whileTap={{ scale: 0.96 }}
          className="mt-4 rounded-xl border-2 border-blue-800 bg-blue-800 px-6 py-2 text-white transition-colors hover:bg-white hover:text-blue-800"
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Kembali
        </motion.button>
      </motion.div>
    </div>
  );
}
