"use client";

import { motion } from "framer-motion";
import Strip from "./Strip";
import { fadeUp, popIn, stagger } from "./motion";
import { formatTime, fromMinutes } from "../date";
import type { StudioInfo } from "../config";

export default function HomeView({
  studioInfo,
  onClickBooking,
  isActive = true,
}: {
  studioInfo: StudioInfo;
  onClickBooking: () => void;
  isActive?: boolean;
}) {
  const openMinutes = studioInfo.openingHours.openMinutes;
  const closeMinutes = studioInfo.openingHours.closeMinutes;
  const timezoneLabel = studioInfo.timezoneLabel;
  const socials = studioInfo.socials;

  const openLabel = formatTime(fromMinutes(openMinutes));
  const closeLabel = formatTime(fromMinutes(closeMinutes));

  return (
    <div className="flex h-full flex-col justify-center bg-blue-800 text-white">
      <div
        className="relative h-full w-full bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://ik.imagekit.io/geb6bfhmhx/bol-bol-studio/main.jpg?updatedAt=1754041084936)" }}
      >
        <div className="absolute left-0 right-0 top-4 flex justify-center overflow-clip">
          <Strip length={115} />
        </div>
        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          animate={isActive ? "show" : "hidden"}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-800 via-blue-800 to-transparent text-center"
        >
          <div className="pt-12 font-bold">
            <motion.div variants={fadeUp} className="text-5xl" style={{ fontFamily: "var(--font-studio-display)" }}>
              OPEN EVERYDAY!
            </motion.div>
            <motion.div variants={fadeUp} className="flex justify-center gap-2 text-xl" style={{ fontFamily: "var(--font-studio-body)" }}>
              <span>{openLabel}</span>
              <span className="text-xs font-thin">{timezoneLabel}</span>
              <span>-</span>
              <span>{closeLabel}</span>
              <span className="text-xs font-thin">{timezoneLabel}</span>
            </motion.div>
          </div>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-around gap-3 px-4 pb-4 pt-4 text-xs font-bold" style={{ fontFamily: "var(--font-studio-body)" }}>
            <a href={socials.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              Instagram {socials.instagramHandle}
            </a>
            <a href={socials.tiktokUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              TikTok {socials.tiktokHandle}
            </a>
            <a href={socials.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              Facebook {socials.facebookLabel}
            </a>
          </motion.div>
          <motion.div variants={popIn} className="mt-4 inline-block">
            <motion.button
              type="button"
              onClick={onClickBooking}
              // Idle: gentle breathing draws the eye to the primary action.
              animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              whileTap={{ scale: 0.96 }}
              className="rounded-2xl bg-white px-8 py-4 text-blue-800 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
              style={{ fontFamily: "var(--font-studio-display)" }}
            >
              Pesan Sekarang
            </motion.button>
          </motion.div>
          <div className="my-4 flex justify-center overflow-clip">
            <Strip length={115} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
