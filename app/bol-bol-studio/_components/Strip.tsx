"use client";

import { motion } from "framer-motion";

// Decorative photo-booth checkerboard band. Idle: drifts horizontally for a
// retro film-strip feel. The pattern repeats every 2 cells (2 × 16px = 32px),
// so animating x by -32px loops seamlessly; overflow-clip on the parent hides
// the seam. Reduced-motion users get a static strip via MotionConfig.
export default function Strip({ length, invert = false }: { length: number; invert?: boolean }) {
  return (
    <motion.div
      className="inline-grid grid-flow-col grid-rows-3"
      animate={{ x: [0, -32] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length }).map((_, index) => {
        const isLight = index % 2 === 0;
        const color = invert ? (isLight ? "bg-blue-800" : "bg-white") : isLight ? "bg-white" : "bg-blue-800";
        return <div key={index} className={`h-4 w-4 ${color}`} />;
      })}
    </motion.div>
  );
}
