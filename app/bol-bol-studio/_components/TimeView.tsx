"use client";

import { motion } from "framer-motion";
import { fadeUp, popIn, stagger } from "./motion";
import { formatLongDate, formatTime, fromMinutes } from "../date";
import { minutesSinceMidnight, timeOptions, withMinutesSinceMidnight, type StudioInfo } from "../config";

export default function TimeView({
  studioInfo,
  selectedDateTime,
  onSelectDateTime,
  onContinue,
  isActive = false,
}: {
  studioInfo: StudioInfo;
  selectedDateTime: Date;
  onSelectDateTime: (date: Date) => void;
  onContinue: () => void;
  isActive?: boolean;
}) {
  const openMinutes = studioInfo.openingHours.openMinutes;
  const closeMinutes = studioInfo.openingHours.closeMinutes;
  const stepMinutes = studioInfo.timeStepMinutes;
  const options = timeOptions({ openMinutes, closeMinutes, stepMinutes });
  const selectedMinutes = minutesSinceMidnight(selectedDateTime);

  return (
    <motion.div
      variants={stagger(0.04, 0.05)}
      initial="hidden"
      animate={isActive ? "show" : "hidden"}
      className="flex h-full w-full flex-col bg-blue-800 p-4 text-white"
    >
      <motion.div variants={fadeUp} className="mb-4 mt-4 flex gap-4 items-center" style={{ fontFamily: "var(--font-studio-display)" }}>
        <div className="text-sm text-blue-50">Tanggal</div>
        <div className="text-lg">{formatLongDate(selectedDateTime)}</div>
      </motion.div>
      <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-3 overflow-y-auto pr-1">
        {options.map((minutes) => {
          const isSelected = minutes === selectedMinutes;
          return (
            <motion.button
              key={minutes}
              type="button"
              variants={popIn}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                onSelectDateTime(withMinutesSinceMidnight(selectedDateTime, minutes));
                onContinue();
              }}
              className={`rounded-xl border-2 px-3 py-3 text-sm transition-colors ${isSelected ? "border-amber-400 bg-white text-blue-800" : "border-white bg-blue-800 text-white hover:bg-white hover:text-blue-800"}`}
            >
              {formatTime(fromMinutes(minutes))}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
