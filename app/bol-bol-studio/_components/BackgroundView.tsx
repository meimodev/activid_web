"use client";

import { motion } from "framer-motion";
import { popIn, stagger } from "./motion";
import { BB_BACKGROUNDS, type StudioBackground } from "../config";
import BackgroundImageCycle from "./BackgroundImageCycle";

export default function BackgroundView({
  onSelectBackground,
  isActive = false,
}: {
  onSelectBackground: (value: StudioBackground) => void;
  isActive?: boolean;
}) {
  return (
    <motion.div
      variants={stagger(0.07, 0.05)}
      initial="hidden"
      animate={isActive ? "show" : "hidden"}
      className="min-h-full bg-blue-800 p-4 text-white"
    >
      <div className="grid grid-cols-2 gap-3">
        {BB_BACKGROUNDS.map((background) => (
          <motion.button
            key={background.id}
            type="button"
            variants={popIn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectBackground(background)}
            className="group relative aspect-square overflow-hidden rounded-xl border-2 border-white bg-blue-900 transition-colors hover:border-amber-400 focus:border-amber-400"
          >
            <BackgroundImageCycle
              images={background.images}
              alt={background.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-blue-900/70 px-2 py-1 text-center text-sm" style={{ fontFamily: "var(--font-studio-display)" }}>
              {background.name.toUpperCase()}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
