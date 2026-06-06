"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Strip from "./Strip";
import { fadeUp, popIn, stagger } from "./motion";
import { addMonths, dayOfWeek, daysInMonth, formatMonth, formatYear, isSameDay, setDateOfMonth, startOfMonth } from "../date";
import type { Booking } from "../config";

export default function CalendarView({
  bookings,
  onSelectDate,
  selectedDate,
  isActive = false,
}: {
  bookings: Booking[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  isActive?: boolean;
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selected, setSelected] = useState(selectedDate);

  const monthStart = startOfMonth(currentDate);
  const startDay = dayOfWeek(monthStart);
  const monthDays = daysInMonth(currentDate);

  const days = useMemo(() => {
    const today = new Date();
    const items: React.ReactNode[] = [];
    for (let index = 0; index < startDay; index += 1) {
      items.push(<div key={`empty-${index}`} className="h-10 rounded-full" />);
    }

    for (let day = 1; day <= monthDays; day += 1) {
      const date = setDateOfMonth(currentDate, day);
      const isTodayDate = isSameDay(today, date);
      const isSelectedDate = isSameDay(selected, date);
      const dayBookings = bookings.filter((booking) => isSameDay(new Date(booking.start), date));

      items.push(
        <motion.button
          key={day}
          type="button"
          variants={popIn}
          whileTap={{ scale: 0.88 }}
          className={`h-14 rounded-lg text-blue-800 ${isSelectedDate ? "border-2 border-white bg-blue-800 text-white" : "bg-white"}`}
          onClick={() => {
            setSelected(date);
            onSelectDate(date);
          }}
        >
          <div className={`${isTodayDate ? "underline decoration-2 underline-offset-2" : ""}`} style={{ fontFamily: "var(--font-studio-display)" }}>
            {day}
          </div>
          {dayBookings.length > 0 ? (
            <div className={`text-xs ${isSelectedDate ? "text-white" : "text-blue-800"}`} style={{ fontFamily: "var(--font-studio-display)" }}>
              {dayBookings.length}
            </div>
          ) : null}
        </motion.button>
      );
    }

    return items;
  }, [bookings, currentDate, monthDays, selected, startDay, onSelectDate]);

  return (
    <motion.div
      variants={stagger(0.05, 0.05)}
      initial="hidden"
      animate={isActive ? "show" : "hidden"}
      className="flex h-full w-full flex-col bg-blue-800 p-4 text-white"
    >
      <motion.div variants={fadeUp} className="mb-4 flex items-center justify-between">
        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate((value) => addMonths(value, -1))} className="rounded-full border-2 bg-white px-4 py-2 text-blue-800 transition hover:bg-blue-800 hover:text-white">
          {"<"}
        </motion.button>
        <div className="flex items-center gap-2">
          <h2 className="text-xl" style={{ fontFamily: "var(--font-studio-display)" }}>{formatMonth(currentDate)}</h2>
          <p className="text-xs" style={{ fontFamily: "var(--font-studio-display)" }}>{formatYear(currentDate)}</p>
        </div>
        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => setCurrentDate((value) => addMonths(value, 1))} className="rounded-full border-2 bg-white px-4 py-2 text-blue-800 transition hover:bg-blue-800 hover:text-white">
          {">"}
        </motion.button>
      </motion.div>
      <motion.div variants={fadeUp} className="grid grid-cols-7 gap-3 text-center text-sm">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((title) => (
          <div key={title} className="rounded border-b-2 border-blue-200 py-2 text-xs text-blue-50" style={{ fontFamily: "var(--font-studio-display)" }}>
            {title}
          </div>
        ))}
      </motion.div>
      {/* Re-stagger the day cells whenever the month changes (key on month). */}
      <motion.div
        key={formatMonth(currentDate) + formatYear(currentDate)}
        variants={stagger(0.012, 0)}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
        className="mt-4 grid grid-cols-7 gap-3"
      >
        {days}
      </motion.div>
      <div className="my-4 flex justify-center overflow-clip">
        <Strip length={115} />
      </div>
    </motion.div>
  );
}
