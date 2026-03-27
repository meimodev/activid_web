"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BboldFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-12  w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-xl"
    >
      {/* Background glow effects */}
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-teal-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >

          <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl leading-snug">
            <span className="bg-linear-to-br from-white via-teal-100 to-blue-300 bg-clip-text text-transparent">
              Website / Aplikasi <br />
              yang sesuai kebutuhan, <br />
            </span>
            <motion.span
              animate={{ backgroundPosition: ["0%", "200%"] }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              className=" inline-block bg-[linear-gradient(90deg,#fbbf24,#f43f5e,#a855f7,#f43f5e,#fbbf24)] bg-size-[200%_auto] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] text-2xl sm:text-3xl"
            >
              GAK HARUS MAHAL!
            </motion.span>
          </h2>

          <Link href="/services/website-app" target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative mt-6 inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-teal-500 px-8 py-4 font-semibold text-white shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)]"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:transform-[skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-12 bg-white/20" />
              </div>
              <span className="relative z-10 flex items-center gap-2">
                Hubungi Kami
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
