"use client";

import React from "react";
import { motion } from "framer-motion";

export function SpaceNavbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5 sticky top-0 z-50 supports-backdrop-filter:bg-black/10">
      <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border border-indigo-500/50 border-t-white"
        />
        <span className="bg-linear-to-r from-indigo-200 to-white bg-clip-text text-transparent">
          Activid<span className="text-indigo-500">.</span>Invitation
        </span>
      </div>
    </nav>
  );
}
