"use client";

import React from "react";
import { motion } from "framer-motion";

export function SpaceBackground() {
  return (
    <>
      {/* Deep Space Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,#020205_60%)]" />

        {/* Animated Nebulas */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"
        />

        {/* Passing Meteor */}
        <motion.div
          initial={{ left: "-10%", top: "10%" }}
          animate={{ left: "120%", top: "30%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "linear",
          }}
          className="absolute w-64 h-[2px] bg-linear-to-r from-transparent via-cyan-200 to-transparent rotate-12 blur-[1px]"
        />
      </div>

      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-200 mix-blend-overlay pointer-events-none z-50" />
    </>
  );
}
