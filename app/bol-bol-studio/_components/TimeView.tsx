"use client";

import Strip from "./Strip";
import { formatLongDate, formatTime, fromMinutes } from "../date";
import { minutesSinceMidnight, timeOptions, withMinutesSinceMidnight, type StudioInfo } from "../config";

export default function TimeView({
  studioInfo,
  selectedDateTime,
  onSelectDateTime,
  onContinue,
}: {
  studioInfo: StudioInfo;
  selectedDateTime: Date;
  onSelectDateTime: (date: Date) => void;
  onContinue: () => void;
}) {
  const openMinutes = studioInfo.openingHours.openMinutes;
  const closeMinutes = studioInfo.openingHours.closeMinutes;
  const stepMinutes = studioInfo.timeStepMinutes;
  const options = timeOptions({ openMinutes, closeMinutes, stepMinutes });
  const selectedMinutes = minutesSinceMidnight(selectedDateTime);
  const hasValidSelection = selectedMinutes >= openMinutes && selectedMinutes < closeMinutes;

  return (
    <div className="w-full bg-blue-800 p-4 text-white">
      <div className="my-4 flex items-center justify-between gap-6 overflow-clip">
        <div className="w-full">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-studio-display)" }}>Pilih Jam</h2>
        </div>
        <div className="overflow-clip">
          <Strip length={40} />
        </div>
      </div>
      <div className="mb-4 flex gap-4 items-center" style={{ fontFamily: "var(--font-studio-display)" }}>
        <div className="text-sm text-blue-50">Tanggal</div>
        <div className="text-lg">{formatLongDate(selectedDateTime)}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-1">
        {options.map((minutes) => {
          const isSelected = minutes === selectedMinutes;
          return (
            <button
              key={minutes}
              type="button"
              onClick={() => onSelectDateTime(withMinutesSinceMidnight(selectedDateTime, minutes))}
              className={`rounded-xl border-2 px-3 py-3 text-sm transition duration-200 hover:scale-[0.98] active:scale-95 ${isSelected ? "border-amber-400 bg-white text-blue-800" : "border-white bg-blue-800 text-white hover:bg-white hover:text-blue-800"}`}
            >
              {formatTime(fromMinutes(minutes))}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        
        <button
          type="button"
          onClick={() => {
            if (!hasValidSelection) {
              window.alert("Silahkan pilih jam terlebih dahulu");
              return;
            }
            onContinue();
          }}
          className="w-full rounded-xl border-2 bg-white px-4 py-2 text-blue-800 transition duration-200 hover:bg-blue-800 hover:text-white active:scale-[0.99]"
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
