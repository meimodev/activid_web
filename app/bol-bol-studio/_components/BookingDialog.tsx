"use client";

import { useState } from "react";
import { formatDateInputValue, formatTime, parseDateInputValue, withStartOfDay } from "../date";
import type { StudioInfo, StudioPackage } from "../config";

export default function BookingDialog({
  isOpen,
  onClose,
  onSubmit,
  packages,
  studioInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: {
    start: Date;
    end: Date;
    name: string;
    phone: string;
    note: string;
    booking_timestamp: Date;
    package: string;
  }) => Promise<void> | void;
  packages: StudioPackage[];
  studioInfo: StudioInfo;
}) {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [startMinutes, setStartMinutes] = useState<number | null>(null);
  const [endMinutes, setEndMinutes] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");

  if (!isOpen) return null;

  const toTimeLabel = (minutes: number | null) => {
    if (typeof minutes !== "number") return "";
    const base = new Date();
    base.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return formatTime(base);
  };

  const parseTimeToMinutes = (value: string) => {
    if (!value) return null;
    const [hours, minutes] = value.split(":").map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-gray-900 p-6 text-gray-400">
        <h2 className="mb-4 text-center text-lg font-bold text-white">Tambah Booking</h2>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Booking Date</label>
          <input
            type="date"
            value={bookingDate ? formatDateInputValue(bookingDate) : ""}
            onChange={(event) => setBookingDate(parseDateInputValue(event.target.value))}
            className="w-1/2 rounded bg-gray-800 p-2 text-white"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Time Range</label>
          <div className="flex gap-4">
            <input
              type="time"
              min={toTimeLabel(studioInfo.openingHours.openMinutes)}
              max={toTimeLabel(studioInfo.openingHours.closeMinutes)}
              value={toTimeLabel(startMinutes)}
              onChange={(event) => setStartMinutes(parseTimeToMinutes(event.target.value))}
              className="w-1/2 rounded bg-gray-800 p-2 text-white"
            />
            <span className="self-center text-sm font-bold">to</span>
            <input
              type="time"
              min={toTimeLabel(studioInfo.openingHours.openMinutes)}
              max={toTimeLabel(studioInfo.openingHours.closeMinutes)}
              value={toTimeLabel(endMinutes)}
              onChange={(event) => setEndMinutes(parseTimeToMinutes(event.target.value))}
              className="w-1/2 rounded bg-gray-800 p-2 text-white"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Booking Name</label>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="rounded bg-gray-800 p-2 text-white" placeholder="Enter Booking Name" />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Booking Phone Number</label>
          <input type="text" value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded bg-gray-800 p-2 text-white" placeholder="Enter Phone Number" />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Packages</label>
          <select value={selectedPackage} onChange={(event) => setSelectedPackage(event.target.value)} className="rounded border border-gray-700 bg-gray-800 p-2 text-white focus:border-blue-500 focus:outline-none">
            <option value="">Select package</option>
            {packages.map((pkg) => (
              <option key={pkg.id ?? pkg.name} value={pkg.name}>{`${pkg.name} per ${pkg.price} duration:${pkg.duration}`}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Note</label>
          <input type="text" value={note} onChange={(event) => setNote(event.target.value)} className="rounded bg-gray-800 p-2 text-white" placeholder="Note" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button type="button" onClick={onClose} className="rounded-2xl bg-red-700 px-6 py-2 text-white hover:bg-gray-600">X</button>
          {bookingDate && typeof startMinutes === "number" && typeof endMinutes === "number" && name && phone && selectedPackage ? (
            <button
              type="button"
              onClick={async () => {
                if (endMinutes <= startMinutes) {
                  window.alert("End time must be after start time");
                  return;
                }
                const start = withStartOfDay(bookingDate);
                start.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
                const end = withStartOfDay(bookingDate);
                end.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
                await onSubmit({
                  start,
                  end,
                  name,
                  phone,
                  note,
                  booking_timestamp: bookingDate,
                  package: selectedPackage,
                });
                setBookingDate(null);
                setStartMinutes(null);
                setEndMinutes(null);
                setName("");
                setPhone("");
                setNote("");
                setSelectedPackage("");
                onClose();
              }}
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Add Booking
            </button>
          ) : (
            <p className="text-xs">form not complete</p>
          )}
        </div>
      </div>
    </div>
  );
}
