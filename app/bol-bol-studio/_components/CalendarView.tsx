"use client";

import { useMemo, useState } from "react";
import Strip from "./Strip";
import { addMonths, dayOfWeek, daysInMonth, formatLongDate, formatMonth, formatTime, formatYear, isSameDay, setDateOfMonth, startOfMonth } from "../date";
import type { Booking } from "../config";

function obfuscateBookingName(isAdmin: boolean, value?: string) {
  if (!value) return "";
  if (isAdmin) return value;
  if (value.length > 4) return `${value.slice(0, -4)}****`;
  if (value.length > 2) return `${value.slice(0, 2)}****`;
  return `${value.slice(0, 2)}****`;
}

export default function CalendarView({
  bookings,
  isAdmin,
  onCancelBooking,
  onSelectDate,
  selectedDate,
}: {
  bookings: Booking[];
  isAdmin: boolean;
  onCancelBooking: (booking: Booking) => void | Promise<void>;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
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
        <button
          key={day}
          type="button"
          className={`h-14 rounded-lg text-blue-800 transition duration-200 hover:scale-90 ${isSelectedDate ? "border-2 border-white bg-blue-800 text-white" : "bg-white"}`}
          onClick={() => setSelected(date)}
        >
          <div className={`${isTodayDate ? "underline decoration-2 underline-offset-2" : ""}`} style={{ fontFamily: "var(--font-studio-display)" }}>
            {day}
          </div>
          {dayBookings.length > 0 ? (
            <div className={`text-xs ${isSelectedDate ? "text-white" : "text-blue-800"}`} style={{ fontFamily: "var(--font-studio-display)" }}>
              {dayBookings.length}
            </div>
          ) : null}
        </button>
      );
    }

    return items;
  }, [bookings, currentDate, monthDays, selected, startDay]);

  const selectedDayBookings = bookings.filter((booking) => isSameDay(new Date(booking.start), selected));

  return (
    <div className="w-full bg-blue-800 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => setCurrentDate((value) => addMonths(value, -1))} className="rounded-full border-2 bg-white px-4 py-2 text-blue-800 hover:bg-blue-800 hover:text-white">
          {"<"}
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-xl" style={{ fontFamily: "var(--font-studio-display)" }}>{formatMonth(currentDate)}</h2>
          <p className="text-xs" style={{ fontFamily: "var(--font-studio-display)" }}>{formatYear(currentDate)}</p>
        </div>
        <button type="button" onClick={() => setCurrentDate((value) => addMonths(value, 1))} className="rounded-full border-2 bg-white px-4 py-2 text-blue-800 hover:bg-blue-800 hover:text-white">
          {">"}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-3 text-center text-sm">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((title) => (
          <div key={title} className="rounded border-b-2 border-blue-200 py-2 text-xs text-blue-50" style={{ fontFamily: "var(--font-studio-display)" }}>
            {title}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-3">{days}</div>
      <div className="my-4 flex justify-center overflow-clip">
        <Strip length={115} />
      </div>
      <div className="mt-4 text-center">
        <h3 className="mb-2 text-lg" style={{ fontFamily: "var(--font-studio-display)" }}>{formatLongDate(selected)}</h3>
        {selectedDayBookings.length > 0 ? (
          selectedDayBookings.map((booking) => (
            <div key={booking.id} className="my-6">
              <div className="my-4 rounded-xl border-2 border-white p-4">
                <div className="flex gap-3 text-sm">
                  <div className="text-start">
                    <p>Start</p>
                    <p>End</p>
                  </div>
                  <div className="font-semibold text-start">
                    <p>{formatTime(new Date(booking.start))}</p>
                    <p>{formatTime(new Date(booking.end))}</p>
                  </div>
                  <div className="text-start">
                    <p className="text-gray-100">{obfuscateBookingName(isAdmin, booking.name)}</p>
                    <p className="text-gray-300">{isAdmin && booking.package ? `${booking.package} | ` : ""}{booking.note}</p>
                  </div>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => onCancelBooking(booking)}
                      className="mt-2 rounded-2xl bg-red-500 px-4 py-2 font-bold text-white hover:bg-blue-500"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="pb-4 text-xs text-blue-50" style={{ fontFamily: "var(--font-studio-display)" }}>(¬_¬&quot;)</p>
        )}
        <button
          type="button"
          onClick={() => onSelectDate(selected)}
          className="w-full rounded-xl border-2 bg-white px-4 py-2 text-blue-800 transition duration-200 hover:bg-blue-800 hover:text-white"
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}
