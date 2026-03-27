"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BookingDialog from "./BookingDialog";
import CalendarView from "./CalendarView";
import ConfirmationView from "./ConfirmationView";
import FinishView from "./FinishView";
import HomeView from "./HomeView";
import PackageView from "./PackageView";
import Strip from "./Strip";
import TimeView from "./TimeView";
import BolBolFooter from "./BolBolFooter";
import { formatLongDate, formatTime } from "../date";
import {
  BB_FIRESTORE,
  minutesSinceMidnight,
  startOfDay,
  type Account,
  type Booking,
  type StudioInfo,
  type StudioPackage,
} from "../config";

const TOTAL_STEPS = 5;
const STEP_LABELS = ["Tanggal", "Jam", "Paket", "Konfirmasi", "Selesai"];

function updateUrlSlide(router: ReturnType<typeof useRouter>, searchParams: URLSearchParams, index: number) {
  const nextParams = new URLSearchParams(searchParams.toString());
  if (index === 0) {
    nextParams.delete("slide");
  } else {
    nextParams.set("slide", String(index));
  }
  const query = nextParams.toString();
  router.replace(query ? `/bol-bol-studio?${query}` : "/bol-bol-studio", { scroll: false });
}

export default function BolBolStudioClient({
  bookingsData,
  accountsData,
  studioInfo,
}: {
  bookingsData: Booking[];
  accountsData: Account[];
  studioInfo: StudioInfo;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const pin = searchParams.get("pin");
  const currentSlideParam = Number(searchParams.get("slide") ?? 0);

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<StudioPackage | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(startOfDay(new Date()));
  const [bookings, setBookings] = useState(bookingsData);
  const currentSlide = Number.isFinite(currentSlideParam) ? Math.min(Math.max(currentSlideParam, 0), TOTAL_STEPS) : 0;
  const isAdmin = Boolean(
    phone &&
      pin &&
      accountsData.find((candidate) => {
        if (candidate.phone !== phone) return false;
        if (candidate.pin !== pin) return false;
        return candidate.admin !== false;
      })
  );

  const goToSlide = (index: number) => {
    updateUrlSlide(router, new URLSearchParams(searchParams.toString()), index);
  };

  const showStepHeader = currentSlide > 0;
  const selectedDateLabel = formatLongDate(selectedDateTime);
  const selectedTimeLabel = `${formatTime(selectedDateTime)} ${studioInfo.timezoneLabel}`.trim();
  const selectedPackageLabel = selectedPackage ? selectedPackage.name : "Belum dipilih";
  const stepSummaries = [
    selectedDateLabel,
    selectedTimeLabel,
    selectedPackageLabel,
    `${selectedDateLabel} • ${selectedTimeLabel}`,
    "Permintaan dikirim",
  ];

  const slides = [
    <HomeView key="home" studioInfo={studioInfo} onClickBooking={() => {
      setSelectedPackage(null);
      setSelectedDateTime(startOfDay(new Date()));
      goToSlide(1);
    }} />,
    <CalendarView key="calendar" bookings={bookings} isAdmin={isAdmin} selectedDate={selectedDateTime} onCancelBooking={async (booking) => {
      await deleteDoc(doc(db, BB_FIRESTORE.BOOKINGS_COLLECTION, booking.id));
      setBookings((current) => current.filter((item) => item.id !== booking.id));
    }} onSelectDate={(date) => {
      setSelectedPackage(null);
      setSelectedDateTime(startOfDay(date));
      goToSlide(2);
    }} />,
    <TimeView key="time" studioInfo={studioInfo} selectedDateTime={selectedDateTime} onSelectDateTime={setSelectedDateTime} onContinue={() => goToSlide(3)} />,
    <PackageView key="package" studioInfo={studioInfo} onSelectPackage={(pkg) => {
      const durationMinutes = Number(pkg.duration || 0);
      const startMinutes = minutesSinceMidnight(selectedDateTime);
      const endMinutes = startMinutes + durationMinutes;
      if (durationMinutes > 0 && endMinutes > studioInfo.openingHours.closeMinutes) {
        window.alert("Waktu yang dipilih melebihi jam tutup studio");
        return;
      }
      setSelectedPackage(pkg);
      goToSlide(4);
    }} />,
    <ConfirmationView key="confirmation" studioInfo={studioInfo} selectedDateTime={selectedDateTime} selectedPackage={selectedPackage} onConfirmOrder={(order) => {
      const bookingDate = formatLongDate(order.dateTime);
      const bookingTime = `${formatTime(order.dateTime)} ${studioInfo.timezoneLabel}`.trim();
      const adminPhone = studioInfo.adminPhone;
      const url = `https://api.whatsapp.com/send?phone=${adminPhone}&text=Bol-bol%20studio%2C%20%F0%9F%93%B7%20booking%20info%3A%0A%F0%9F%91%A4%20nama%3A%20${encodeURIComponent(order.name)}%0A%F0%9F%93%9E%20phone%3A%20${encodeURIComponent(order.phone)}%0A%F0%9F%93%B8%20instagram%3A%20${encodeURIComponent(order.instagram)}%0A%F0%9F%93%85%20tanggal%20booking%3A%20${encodeURIComponent(bookingDate)}%0A%F0%9F%95%92%20jam%20booking%3A%20${encodeURIComponent(bookingTime)}%0A%F0%9F%93%A6%20paket%3A%20${encodeURIComponent(order.package.name)}%0A%F0%9F%97%84%EF%B8%8F%20kapasitas%20paket%20%3A%20${encodeURIComponent(String(order.package.capacity))}%20orang%20%0A%F0%9F%91%8D%20--mohon%20menunggu%20konfirmasi%20admin--`;
      window.open(url, "_blank", "noopener,noreferrer");
      goToSlide(5);
    }} />,
    <FinishView key="finish" onFinishOrder={() => {
      setSelectedPackage(null);
      setSelectedDateTime(startOfDay(new Date()));
      goToSlide(0);
    }} />,
  ];

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center text-stone-100">
      <div className="relative w-full border border-gray-700 bg-blue-800">
        {showStepHeader ? (
          <div className="sticky top-0 z-20 border-b border-white/10 bg-linear-to-b from-blue-900 to-blue-800 px-4 pb-4 pt-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goToSlide(currentSlide - 1)}
                className="rounded-full border border-white/60 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition hover:bg-white hover:text-blue-900"
                style={{ fontFamily: "var(--font-studio-display)" }}
              >
                Kembali
              </button>
              <div className="flex-1 overflow-clip pl-2">
                <Strip length={27} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {STEP_LABELS.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentSlide;
                const isComplete = stepNumber < currentSlide;
                const stepSummary = stepSummaries[index];

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (stepNumber <= currentSlide) {
                        goToSlide(stepNumber);
                      }
                    }}
                    className={`flex flex-col items-center gap-1 rounded-2xl border px-1 py-2 text-center transition ${isActive ? "border-white bg-white text-blue-900 shadow-lg" : isComplete ? "border-blue-100/60 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/45"}`}
                    aria-label={`Go to ${label} step`}
                    disabled={stepNumber > currentSlide}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] ${isActive ? "border-blue-900 bg-blue-900 text-white" : isComplete ? "border-white bg-white/15 text-white" : "border-white/25 text-white/45"}`}
                      style={{ fontFamily: "var(--font-studio-display)" }}
                    >
                      {stepNumber}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-[0.18em] ${isActive ? "text-blue-900" : isComplete ? "text-white" : "text-white/45"}`}
                      style={{ fontFamily: "var(--font-studio-body)" }}
                    >
                      {label}
                    </span>
                    <span
                      className={`line-clamp-2 min-h-7 text-[9px] leading-tight ${isActive ? "text-blue-800" : isComplete ? "text-blue-50" : "text-white/35"}`}
                      style={{ fontFamily: "var(--font-studio-body)" }}
                    >
                      {stepSummary}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="w-full shrink-0">
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isAdmin ? (
        <button
          type="button"
          onClick={() => setBookingDialogOpen(true)}
          className="w-full bg-blue-900 px-4 py-2 font-bold text-white"
        >
          [ADMIN] Add Booking
        </button>
      ) : null}

      <BolBolFooter />
     
      <BookingDialog
        packages={studioInfo.packages}
        studioInfo={studioInfo}
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        onSubmit={async (booking) => {
          const docRef = await addDoc(collection(db, BB_FIRESTORE.BOOKINGS_COLLECTION), booking);
          const updatedBooking = {
            ...booking,
            id: docRef.id,
            start: booking.start.getTime(),
            end: booking.end.getTime(),
            booking_timestamp: booking.booking_timestamp.getTime(),
          };
          await setDoc(doc(db, BB_FIRESTORE.BOOKINGS_COLLECTION, docRef.id), updatedBooking, { merge: true });
          setBookings((current) => [...current, updatedBooking]);
        }}
      />
    </main>
  );
}
