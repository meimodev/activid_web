"use client";

import { motion } from "framer-motion";
import { popIn, slideInLeft, stagger } from "./motion";
import type { StudioInfo, StudioPackage } from "../config";

function formatPrice(price: number) {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)} K`;
  }
  return `${price}`;
}

export default function PackageView({
  studioInfo,
  onSelectPackage,
  isActive = false,
}: {
  studioInfo: StudioInfo;
  onSelectPackage: (value: StudioPackage) => void;
  isActive?: boolean;
}) {
  return (
    <motion.div
      variants={stagger(0.07, 0.05)}
      initial="hidden"
      animate={isActive ? "show" : "hidden"}
      className="min-h-full bg-blue-800 p-4 text-white"
    >
      <div className="mt-4 flex flex-col gap-3 rounded">
        {studioInfo.packages.map((pkg) => (
          <motion.button
            key={pkg.id ?? pkg.name}
            type="button"
            variants={slideInLeft}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPackage(pkg)}
            className="rounded-xl border-2 border-white px-3 py-2.5 text-left transition-colors hover:bg-white hover:text-blue-800 focus:border-amber-400 focus:bg-white focus:text-blue-800"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-[5rem] leading-tight" style={{ fontFamily: "var(--font-studio-display)" }}>
                <div>{pkg.name.toUpperCase()}</div>
                <div className="text-xl">{formatPrice(pkg.price)}</div>
              </div>
              <div className="flex flex-grow flex-col text-xs leading-tight" style={{ fontFamily: "var(--font-studio-body)" }}>
                <div>
                  <span className="font-bold">{pkg.duration} Menit</span> · max <span className="font-bold">{pkg.capacity} orang</span>
                </div>
                {pkg.notes?.length ? (
                  <div className="mt-1">
                    {pkg.notes.map((note) => (
                      <div key={note}>{note}</div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="mb-4 mt-3 grid grid-cols-2 gap-2">
        {studioInfo.addsOn.map((addOn, index) => (
          <motion.div key={`${addOn.title}-${index}`} variants={popIn} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-blue-800" style={{ fontFamily: "var(--font-studio-body)" }}>
            <div className="flex-grow text-xs leading-tight">{addOn.title}</div>
            <div className="shrink-0 whitespace-nowrap text-sm font-bold" style={{ fontFamily: "var(--font-studio-display)" }}>
              {formatPrice(addOn.price)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
