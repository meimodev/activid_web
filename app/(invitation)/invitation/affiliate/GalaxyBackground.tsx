"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
};

export default function GalaxyBackground() {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>(() => {
    // Generate empty array on first pass to allow hydrating, then fill on client
    return [];
  });

  useEffect(() => {
    // Generate random stars on mount to avoid hydration mismatch
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    
    // Use timeout to schedule after hydration finishes to avoid the strict lint warning
    const timer = setTimeout(() => {
      setStars(generatedStars);
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black" />
      
      {/* Animated Glowing Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[20%] w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] bg-indigo-500/10 blur-[120px] rounded-full"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-fuchsia-500/5 blur-[150px] rounded-full"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 60, -60, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
          }}
          animate={{
            opacity: [0.1, 1, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
