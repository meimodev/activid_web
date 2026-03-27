"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BolBolFooter() {
  return (
    <div className="-mt-6 w-full p-4 mb-2">
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-[#fbbf24]/50 bg-blue-900/60 p-6 text-center shadow-[0_0_20px_rgba(251,191,36,0.15)] backdrop-blur-md"
      >
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
    </div>
  );
}
