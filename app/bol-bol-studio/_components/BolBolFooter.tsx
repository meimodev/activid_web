"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTO_COLLAPSE_MS = 10000;

export default function BolBolFooter() {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!expanded) return;
    const timer = setTimeout(() => setExpanded(false), AUTO_COLLAPSE_MS);
    return () => clearTimeout(timer);
  }, [expanded]);

  return (
    <div className="w-full px-4 pb-2">
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-[#fbbf24]/50 bg-blue-900/60 p-6 text-center shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Tutup"
                className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#fbbf24]/50 text-[11px] text-[#fbbf24] transition hover:bg-[#fbbf24] hover:text-blue-900"
              >
                ✕
              </button>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#fbbf24]/20 blur-2xl"
              />
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl"
              />

              <h2 className="relative z-10 mb-5  text-sm leading-relaxed" style={{ fontFamily: "var(--font-studio-body)" }}>
                <span className="block uppercase font-bold text-blue-100 text-sm">Website / Aplikasi</span>
                <span className="block text-blue-100">yang sesuai kebutuhan,</span>
                <motion.span
                  animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="block pt-2 text-xl font-bold tracking-widest text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                  style={{ fontFamily: "var(--font-studio-display)" }}
                >
                  GAK HARUS MAHALL!!
                </motion.span>
              </h2>

              <Link href="/services/website-app" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#1e3a8a", borderColor: "#ffffff" }}
                  whileTap={{ scale: 0.95 }}
                  className="relative z-10 rounded-full border border-[#fbbf24] bg-transparent px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#fbbf24] transition-colors shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                  style={{ fontFamily: "var(--font-studio-display)" }}
                >
                  Lihat Layanan
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Lihat info layanan"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-dashed border-[#fbbf24]/50 bg-blue-900/60 px-4 py-2 text-[11px] text-blue-100 backdrop-blur-md transition hover:bg-blue-900/80"
            style={{ fontFamily: "var(--font-studio-body)" }}
          >
            <span className="font-bold text-[#fbbf24]">Website / Aplikasi</span>
            <span className="truncate">gak harus mahal!</span>
            <span className="font-bold text-[#fbbf24]">＋</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
