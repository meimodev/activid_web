"use client";

import { type ReactNode, useMemo, useState, useTransition } from "react";

import { createBolBolBooking, deleteBolBolBooking } from "../actions";
import {
  BB_DEFAULTS,
  StudioBooking,
  StudioInfo,
  formatCurrency,
  formatDateLabel,
  formatMonthLabel,
  formatTimeLabel,
  minutesSinceMidnight,
  obfuscateLabel,
  startOfDay,
  timeOptions,
  withMinutesSinceMidnight,
} from "../shared";

type AdminAuth = {
  phone: string;
  pin: string;
};

type StepKey = "home" | "date" | "time" | "package" | "confirm" | "done";

interface BolBolStudioClientProps {
  initialBookings: StudioBooking[];
  studioInfo: StudioInfo;
  initialIsAdmin: boolean;
  adminAuth: AdminAuth | null;
  warning: string | null;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toWhatsAppOrderUrl({
  adminPhone,
  name,
  phone,
  date,
  packageName,
  capacity,
  timezoneLabel,
  instagram,
}: {
  adminPhone: string;
  name: string;
  phone: string;
  date: Date;
  packageName: string;
  capacity: number;
  timezoneLabel: string;
  instagram?: string;
}) {
  const bookingDate = formatDateLabel(date);
  const bookingTime = `${formatTimeLabel(minutesSinceMidnight(date))} ${timezoneLabel}`.trim();

  const instagramLine = instagram?.trim()
    ? `%0A%F0%9F%93%B8%20instagram%3A%20${encodeURIComponent(instagram.trim())}`
    : "";

  return `https://api.whatsapp.com/send?phone=${adminPhone}&text=Bol-bol%20studio%2C%20%F0%9F%93%B7%20booking%20info%3A%0A%F0%9F%91%A4%20nama%3A%20${encodeURIComponent(name)}%0A%F0%9F%93%9E%20phone%3A%20${encodeURIComponent(phone)}${instagramLine}%0A%F0%9F%93%85%20tanggal%20booking%3A%20${encodeURIComponent(bookingDate)}%0A%F0%9F%95%92%20jam%20booking%3A%20${encodeURIComponent(bookingTime)}%0A%F0%9F%93%A6%20paket%3A%20${encodeURIComponent(packageName)}%0A%F0%9F%97%84%EF%B8%8F%20kapasitas%20paket%20%3A%20${encodeURIComponent(String(capacity))}%20orang%20%0A%F0%9F%91%8D%20--mohon%20menunggu%20konfirmasi%20admin--`;
}

function StepBadge({ active, index, label }: { active: boolean; index: number; label: string }) {
  return (
    <div className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${active ? "bg-white text-blue-800" : "border border-white/20 text-white/70"}`}>
      {index}. {label}
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[2rem] border border-white/15 bg-[#1b56d4] p-6 shadow-[0_24px_60px_rgba(5,15,45,0.28)] ${className}`}>{children}</section>;
}

function BookingCard({
  booking,
  isAdmin,
  onDelete,
}: {
  booking: StudioBooking;
  isAdmin: boolean;
  onDelete?: (bookingId: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-4 text-sm text-white/90">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{formatTimeLabel(minutesSinceMidnight(new Date(booking.startMs)))} - {formatTimeLabel(minutesSinceMidnight(new Date(booking.endMs)))}</p>
          <p className="mt-1 text-white/80">{obfuscateLabel(booking.name, isAdmin)}</p>
          <p className="text-white/60">{isAdmin ? booking.package : booking.note || "Booking"}</p>
        </div>
        {isAdmin && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            className="rounded-full border border-red-300/50 px-3 py-1 text-xs font-semibold text-red-100 transition-colors hover:bg-red-500/20"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}

function AddBookingDialog({
  isOpen,
  onClose,
  onSubmit,
  packages,
  studioInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    bookingDateIso: string;
    startMinutes: number;
    endMinutes: number;
    name: string;
    phone: string;
    note: string;
    packageName: string;
  }) => Promise<void>;
  packages: StudioInfo["packages"];
  studioInfo: StudioInfo;
}) {
  const [bookingDateIso, setBookingDateIso] = useState("");
  const [startMinutes, setStartMinutes] = useState<number | null>(null);
  const [endMinutes, setEndMinutes] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [packageName, setPackageName] = useState(packages[0]?.name ?? "");

  const options = useMemo(
    () =>
      timeOptions({
        openMinutes: studioInfo.openingHours.openMinutes,
        closeMinutes: studioInfo.openingHours.closeMinutes,
        stepMinutes: studioInfo.timeStepMinutes,
      }),
    [studioInfo.openingHours.closeMinutes, studioInfo.openingHours.openMinutes, studioInfo.timeStepMinutes],
  );

  if (!isOpen) return null;

  const canSubmit =
    Boolean(bookingDateIso) &&
    typeof startMinutes === "number" &&
    typeof endMinutes === "number" &&
    endMinutes > startMinutes &&
    Boolean(name.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(packageName.trim());

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-[#10172e] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Tambah Booking Admin</h3>
            <p className="mt-2 text-sm text-white/70">Gunakan modal ini untuk menambahkan slot booking manual.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/70">
            Tutup
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span>Tanggal booking</span>
            <input
              type="date"
              value={bookingDateIso}
              onChange={(event) => setBookingDateIso(event.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Paket</span>
            <select
              value={packageName}
              onChange={(event) => setPackageName(event.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.name} className="text-black">
                  {pkg.name} - {formatCurrency(pkg.price)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Jam mulai</span>
            <select
              value={typeof startMinutes === "number" ? String(startMinutes) : ""}
              onChange={(event) => setStartMinutes(event.target.value ? Number(event.target.value) : null)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            >
              <option value="" className="text-black">Pilih jam</option>
              {options.map((option) => (
                <option key={option} value={option} className="text-black">
                  {formatTimeLabel(option)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Jam selesai</span>
            <select
              value={typeof endMinutes === "number" ? String(endMinutes) : ""}
              onChange={(event) => setEndMinutes(event.target.value ? Number(event.target.value) : null)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            >
              <option value="" className="text-black">Pilih jam</option>
              {options.map((option) => (
                <option key={option} value={option} className="text-black">
                  {formatTimeLabel(option)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Atas nama</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Nomor telepon</span>
            <input
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span>Catatan</span>
          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/75">
            Batal
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={async () => {
              if (!canSubmit || typeof startMinutes !== "number" || typeof endMinutes !== "number") return;
              await onSubmit({ bookingDateIso, startMinutes, endMinutes, name, phone, note, packageName });
              setBookingDateIso("");
              setStartMinutes(null);
              setEndMinutes(null);
              setName("");
              setPhone("");
              setNote("");
              setPackageName(packages[0]?.name ?? "");
            }}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tambah booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BolBolStudioClient({
  initialBookings,
  studioInfo,
  initialIsAdmin,
  adminAuth,
  warning,
}: BolBolStudioClientProps) {
  const [step, setStep] = useState<StepKey>("home");
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestInstagram, setGuestInstagram] = useState("");
  const [message, setMessage] = useState<string | null>(warning);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedDateInput = toDateInputValue(selectedDate);
  const timeChoices = useMemo(
    () =>
      timeOptions({
        openMinutes: studioInfo.openingHours.openMinutes,
        closeMinutes: studioInfo.openingHours.closeMinutes,
        stepMinutes: studioInfo.timeStepMinutes,
      }),
    [studioInfo.openingHours.closeMinutes, studioInfo.openingHours.openMinutes, studioInfo.timeStepMinutes],
  );

  const selectedDateBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const bookingDate = startOfDay(new Date(booking.startMs));
        return bookingDate.getTime() === selectedDate.getTime();
      })
      .sort((a, b) => a.startMs - b.startMs);
  }, [bookings, selectedDate]);

  const selectedDateTakenSlots = useMemo(() => {
    return new Set(
      selectedDateBookings.flatMap((booking) => {
        const slots: number[] = [];
        for (
          let value = minutesSinceMidnight(new Date(booking.startMs));
          value < minutesSinceMidnight(new Date(booking.endMs));
          value += studioInfo.timeStepMinutes
        ) {
          slots.push(value);
        }
        return slots;
      }),
    );
  }, [selectedDateBookings, studioInfo.timeStepMinutes]);

  const selectedPackage = useMemo(
    () => studioInfo.packages.find((pkg) => pkg.id === selectedPackageId) ?? null,
    [selectedPackageId, studioInfo.packages],
  );

  const selectedDateTime = useMemo(() => {
    if (typeof selectedMinutes !== "number") return selectedDate;
    return withMinutesSinceMidnight(selectedDate, selectedMinutes);
  }, [selectedDate, selectedMinutes]);

  const canContinueToPackage = typeof selectedMinutes === "number";
  const canContinueToConfirm = Boolean(selectedPackage);
  const canSubmitOrder = Boolean(guestName.trim() && guestPhone.trim() && selectedPackage && typeof selectedMinutes === "number");

  const currentPackageEndMinutes =
    selectedPackage && typeof selectedMinutes === "number"
      ? selectedMinutes + Number(selectedPackage.duration || 0)
      : null;

  const hasPackageOverflow =
    typeof currentPackageEndMinutes === "number" &&
    currentPackageEndMinutes > studioInfo.openingHours.closeMinutes;

  async function handleAddBooking(payload: {
    bookingDateIso: string;
    startMinutes: number;
    endMinutes: number;
    name: string;
    phone: string;
    note: string;
    packageName: string;
  }) {
    if (!adminAuth) return;

    startTransition(() => {
      void (async () => {
        const result = await createBolBolBooking({
          auth: adminAuth,
          ...payload,
        });

        if (result.error) {
          setMessage(result.error);
          return;
        }

        if (result.booking) {
          setBookings((current) => [...current, result.booking].sort((a, b) => a.startMs - b.startMs));
        }

        setMessage("Booking admin berhasil ditambahkan.");
        setIsAddDialogOpen(false);
      })();
    });
  }

  function handleDeleteBooking(bookingId: string) {
    if (!adminAuth) return;

    startTransition(() => {
      void (async () => {
        const result = await deleteBolBolBooking({ auth: adminAuth, bookingId });
        if (result.error) {
          setMessage(result.error);
          return;
        }

        setBookings((current) => current.filter((booking) => booking.id !== bookingId));
        setMessage("Booking berhasil dihapus.");
      })();
    });
  }

  function openWhatsAppOrder() {
    if (!selectedPackage) return;

    const url = toWhatsAppOrderUrl({
      adminPhone: studioInfo.adminPhone,
      name: guestName.trim(),
      phone: guestPhone.trim(),
      date: selectedDateTime,
      packageName: selectedPackage.name,
      capacity: selectedPackage.capacity,
      timezoneLabel: studioInfo.timezoneLabel,
      instagram: guestInstagram.trim(),
    });

    window.open(url, "_blank", "noopener,noreferrer");
    setStep("done");
    setGuestName("");
    setGuestPhone("");
    setGuestInstagram("");
  }

  return (
    <main className="min-h-screen bg-[#0d1b45] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 lg:px-10 lg:py-18">
        <div className="flex flex-wrap gap-3">
          <StepBadge active={step === "home"} index={1} label="Home" />
          <StepBadge active={step === "date"} index={2} label="Tanggal" />
          <StepBadge active={step === "time"} index={3} label="Jam" />
          <StepBadge active={step === "package"} index={4} label="Paket" />
          <StepBadge active={step === "confirm"} index={5} label="Konfirmasi" />
        </div>

        {message ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-white/90">
            {message}
          </div>
        ) : null}

        {step === "home" ? (
          <Panel className="overflow-hidden p-0">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div
                className="min-h-[520px] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(8,13,35,0.08), rgba(8,13,35,0.72)), url(${BB_DEFAULTS.HERO_IMAGE})` }}
              />
              <div className="flex flex-col justify-between gap-8 p-8 lg:p-10">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-white/60">activid.id/bol-bol-studio</p>
                  <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.06em]">Bol Bol Studio</h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-white/78">
                    Self photo studio booking flow, now isolated under its own route section while still living inside the main ACTIVID site shell.
                  </p>
                  <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">Open everyday</p>
                    <p className="mt-3 text-3xl font-bold">
                      {formatTimeLabel(studioInfo.openingHours.openMinutes)} - {formatTimeLabel(studioInfo.openingHours.closeMinutes)} {studioInfo.timezoneLabel}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <a href={studioInfo.socials.instagramUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90">
                      Instagram {studioInfo.socials.instagramHandle}
                    </a>
                    <a href={studioInfo.socials.tiktokUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90">
                      TikTok {studioInfo.socials.tiktokHandle}
                    </a>
                    <a href={studioInfo.socials.facebookUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90">
                      Facebook {studioInfo.socials.facebookLabel}
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("date")}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-800 transition-transform hover:-translate-y-0.5"
                    >
                      Pesan sekarang
                    </button>
                    {initialIsAdmin ? (
                      <button
                        type="button"
                        onClick={() => setIsAddDialogOpen(true)}
                        className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90"
                      >
                        [ADMIN] Add booking
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        ) : null}

        {step === "date" ? (
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/60">Pilih tanggal</p>
                <h2 className="mt-2 text-3xl font-bold">{formatMonthLabel(selectedDate)}</h2>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("home")} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90">
                  Kembali
                </button>
                <button type="button" onClick={() => setStep("time")} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-800">
                  Lanjut pilih jam
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4">
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  <span>Tanggal booking</span>
                  <input
                    type="date"
                    value={selectedDateInput}
                    onChange={(event) => {
                      const next = event.target.value ? startOfDay(new Date(event.target.value)) : startOfDay(new Date());
                      setSelectedDate(next);
                    }}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
                  />
                </label>
                <div className="rounded-[1.5rem] border border-white/15 bg-white/5 p-5">
                  <p className="text-sm text-white/60">Tanggal terpilih</p>
                  <p className="mt-2 text-2xl font-bold">{formatDateLabel(selectedDate)}</p>
                  <p className="mt-3 text-sm text-white/70">Jumlah booking hari ini: {selectedDateBookings.length}</p>
                </div>
              </div>

              <div>
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedDateBookings.length > 0 ? (
                    selectedDateBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        isAdmin={initialIsAdmin}
                        onDelete={initialIsAdmin ? handleDeleteBooking : undefined}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/75 md:col-span-2">
                      Belum ada booking pada tanggal ini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        ) : null}

        {step === "time" ? (
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/60">Pilih jam</p>
                <h2 className="mt-2 text-3xl font-bold">{formatDateLabel(selectedDate)}</h2>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("date")} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90">
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!canContinueToPackage}
                  onClick={() => setStep("package")}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Lanjut pilih paket
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {timeChoices.map((slot) => {
                const active = slot === selectedMinutes;
                const occupied = selectedDateTakenSlots.has(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={occupied}
                    onClick={() => setSelectedMinutes(slot)}
                    className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition ${active ? "border-white bg-white text-blue-800" : "border-white/15 bg-white/10 text-white"} ${occupied ? "cursor-not-allowed opacity-35" : "hover:-translate-y-0.5"}`}
                  >
                    {formatTimeLabel(slot)} {studioInfo.timezoneLabel}
                  </button>
                );
              })}
            </div>
          </Panel>
        ) : null}

        {step === "package" ? (
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/60">Pilih paket</p>
                <h2 className="mt-2 text-3xl font-bold">Paket dasar & tambahan</h2>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("time")} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90">
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!canContinueToConfirm || hasPackageOverflow}
                  onClick={() => setStep("confirm")}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Lanjut konfirmasi
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {studioInfo.packages.map((pkg) => {
                const active = pkg.id === selectedPackageId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      if (typeof selectedMinutes === "number") {
                        const endMinutes = selectedMinutes + Number(pkg.duration || 0);
                        if (endMinutes > studioInfo.openingHours.closeMinutes) {
                          setMessage("Waktu yang dipilih melebihi jam tutup studio.");
                        } else {
                          setMessage(null);
                        }
                      }
                    }}
                    className={`rounded-[1.75rem] border p-5 text-left transition ${active ? "border-white bg-white text-blue-800" : "border-white/15 bg-white/8 text-white hover:-translate-y-0.5"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl font-bold uppercase">{pkg.name}</p>
                        <p className="mt-3 text-sm opacity-80">{pkg.duration} menit · maks {pkg.capacity} orang</p>
                      </div>
                      <p className="text-lg font-semibold">{formatCurrency(pkg.price)}</p>
                    </div>
                    {pkg.notes?.length ? (
                      <ul className="mt-4 space-y-2 text-sm opacity-80">
                        {pkg.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {studioInfo.addsOn.length ? (
              <div className="mt-8 rounded-[1.75rem] border border-white/15 bg-white/8 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-white/60">Tambahan</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {studioInfo.addsOn.map((item) => (
                    <div key={`${item.title}-${item.price}`} className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                      <div className="font-semibold">{item.title}</div>
                      <div className="mt-1 text-white/75">{formatCurrency(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Panel>
        ) : null}

        {step === "confirm" ? (
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/60">Konfirmasi pemesanan</p>
                <h2 className="mt-2 text-3xl font-bold">Lengkapi data pemesan</h2>
              </div>
              <button type="button" onClick={() => setStep("package")} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90">
                Kembali
              </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4 rounded-[1.75rem] border border-white/15 bg-white/8 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">Rincian pesanan</p>
                <div>
                  <div className="text-sm text-white/60">Tanggal</div>
                  <div className="text-xl font-bold">{formatDateLabel(selectedDateTime)}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Jam</div>
                  <div className="text-xl font-bold">{formatTimeLabel(minutesSinceMidnight(selectedDateTime))} {studioInfo.timezoneLabel}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Paket</div>
                  <div className="text-xl font-bold">{selectedPackage?.name ?? "Belum pilih paket"}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Estimasi harga</div>
                  <div className="text-xl font-bold">{selectedPackage ? formatCurrency(selectedPackage.price) : "-"}</div>
                </div>
                <div className="text-xs leading-6 text-white/70">
                  Harga yang tertera hanya estimasi. Harga final akan dikonfirmasi admin Bol Bol Studio.
                </div>
              </div>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  <span>Atas nama</span>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
                    placeholder="Untuk mempermudah pencarian dan pengiriman foto"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  <span>Nomor handphone aktif</span>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(event) => setGuestPhone(event.target.value)}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
                    placeholder="Nomor HP WA / Telegram untuk pengiriman link foto"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-white/80">
                  <span>Instagram handler</span>
                  <input
                    type="text"
                    value={guestInstagram}
                    onChange={(event) => setGuestInstagram(event.target.value)}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none"
                    placeholder="Untuk tag, follow-followan, promosi & diskon"
                  />
                </label>
                <button
                  type="button"
                  disabled={!canSubmitOrder || hasPackageOverflow}
                  onClick={openWhatsAppOrder}
                  className="mt-4 rounded-full bg-white px-6 py-4 text-sm font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Konfirmasi pesanan
                </button>
              </div>
            </div>
          </Panel>
        ) : null}

        {step === "done" ? (
          <Panel className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold">Thank You</h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Pesanan anda telah diterima. Admin akan menghubungi anda untuk konfirmasi lanjutan ya.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button type="button" onClick={() => setStep("home")} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-800">
                Kembali ke awal
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedPackageId("");
                  setSelectedMinutes(null);
                  setStep("date");
                }}
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90"
              >
                Buat booking baru
              </button>
            </div>
          </Panel>
        ) : null}
      </section>

      <AddBookingDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddBooking}
        packages={studioInfo.packages}
        studioInfo={studioInfo}
      />

      {isPending ? (
        <div className="fixed bottom-6 right-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-lg">
          Processing...
        </div>
      ) : null}
    </main>
  );
}
