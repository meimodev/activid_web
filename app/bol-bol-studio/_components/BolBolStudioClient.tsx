"use client";

import { Fragment, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BookingDialog from "./BookingDialog";
import BackgroundView from "./BackgroundView";
import CalendarView from "./CalendarView";
import ConfirmationView from "./ConfirmationView";
import FinishView from "./FinishView";
import HomeView from "./HomeView";
import PackageView from "./PackageView";
import TimeView from "./TimeView";
import BolBolFooter from "./BolBolFooter";
import FitToViewport from "./FitToViewport";
import { formatLongDate, formatTime } from "../date";
import {
  BB_FIRESTORE,
  minutesSinceMidnight,
  startOfDay,
  type Account,
  type Booking,
  type StudioBackground,
  type StudioInfo,
  type StudioPackage,
} from "../config";

const TOTAL_STEPS = 6;
const STEP_LABELS = ["Tanggal", "Jam", "Paket", "Latar", "Konfirmasi", "Selesai"];

function updateUrlSlide(router: ReturnType<typeof useRouter>, searchParams: URLSearchParams, index: number) {
  const nextParams = new URLSearchParams(searchParams.toString());
  if (index === 0) {
    nextParams.delete("slide");
  } else {
    nextParams.set("slide", String(index));
  }
  const query = nextParams.toString();
  router.push(query ? `/bol-bol-studio?${query}` : "/bol-bol-studio", { scroll: false });
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
  const [selectedBackground, setSelectedBackground] = useState<StudioBackground | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(startOfDay(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerInstagram, setCustomerInstagram] = useState("");
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

  // Wipe the whole order — used on confirm and on returning Home.
  const resetOrder = () => {
    setSelectedPackage(null);
    setSelectedBackground(null);
    setSelectedDateTime(startOfDay(new Date()));
    setCustomerName("");
    setCustomerPhone("");
    setCustomerInstagram("");
  };

  // Stepping back to step N clears selections owned by the steps AFTER N
  // (stale-invalidation). The contact form is exempt and preserved.
  const goBackToStep = (stepNumber: number) => {
    if (stepNumber < 2) setSelectedDateTime((current) => startOfDay(current)); // clear time
    if (stepNumber < 3) setSelectedPackage(null);
    if (stepNumber < 4) setSelectedBackground(null);
    goToSlide(stepNumber);
  };

  const isFinishStep = currentSlide === TOTAL_STEPS;
  const showStepHeader = currentSlide > 0;

  const slides = [
    <HomeView key="home" isActive={currentSlide === 0} studioInfo={studioInfo} onClickBooking={() => {
      resetOrder();
      goToSlide(1);
    }} />,
    <CalendarView key="calendar" isActive={currentSlide === 1} bookings={bookings} selectedDate={selectedDateTime} onSelectDate={(date) => {
      setSelectedPackage(null);
      setSelectedBackground(null);
      setSelectedDateTime(startOfDay(date));
      goToSlide(2);
    }} />,
    <TimeView key="time" isActive={currentSlide === 2} studioInfo={studioInfo} selectedDateTime={selectedDateTime} onSelectDateTime={setSelectedDateTime} onContinue={() => goToSlide(3)} />,
    <PackageView key="package" isActive={currentSlide === 3} studioInfo={studioInfo} onSelectPackage={(pkg) => {
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
    <BackgroundView key="background" isActive={currentSlide === 4} onSelectBackground={(background) => {
      setSelectedBackground(background);
      goToSlide(5);
    }} />,
    <ConfirmationView key="confirmation" isActive={currentSlide === 5} studioInfo={studioInfo} selectedDateTime={selectedDateTime} selectedPackage={selectedPackage} selectedBackground={selectedBackground} name={customerName} phone={customerPhone} instagram={customerInstagram} onNameChange={setCustomerName} onPhoneChange={setCustomerPhone} onInstagramChange={setCustomerInstagram} onConfirmOrder={(order) => {
      const bookingDate = formatLongDate(order.dateTime);
      const bookingTime = `${formatTime(order.dateTime)} ${studioInfo.timezoneLabel}`.trim();
      const adminPhone = studioInfo.adminPhone;
      const url = `https://api.whatsapp.com/send?phone=${adminPhone}&text=Bol-bol%20studio%2C%20%F0%9F%93%B7%20booking%20info%3A%0A%F0%9F%91%A4%20nama%3A%20${encodeURIComponent(order.name)}%0A%F0%9F%93%9E%20phone%3A%20${encodeURIComponent(order.phone)}%0A%F0%9F%93%B8%20instagram%3A%20${encodeURIComponent(order.instagram)}%0A%F0%9F%93%85%20tanggal%20booking%3A%20${encodeURIComponent(bookingDate)}%0A%F0%9F%95%92%20jam%20booking%3A%20${encodeURIComponent(bookingTime)}%0A%F0%9F%93%A6%20paket%3A%20${encodeURIComponent(order.package.name)}%0A%F0%9F%97%84%EF%B8%8F%20kapasitas%20paket%20%3A%20${encodeURIComponent(String(order.package.capacity))}%20orang%20%0A%F0%9F%8E%A8%20background%3A%20${encodeURIComponent(order.background.name)}%0A%F0%9F%91%8D%20--mohon%20menunggu%20konfirmasi%20admin--`;
      window.open(url, "_blank", "noopener,noreferrer");
      resetOrder();
      goToSlide(6);
    }} />,
    <FinishView key="finish" isActive={currentSlide === 6} onFinishOrder={() => {
      resetOrder();
      goToSlide(0);
    }} />,
  ];

  return (
    <MotionConfig reducedMotion="user">
    <FitToViewport>
      <main className="flex h-full w-full flex-col border border-gray-700 bg-blue-800 text-stone-100">
        {showStepHeader ? (
          <div className="z-20 flex-none border-b border-white/10 bg-linear-to-b from-blue-900 to-blue-800 px-4 pb-3 pt-3 text-white">
            <div className="flex items-center">
              {STEP_LABELS.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentSlide;
                const isComplete = stepNumber < currentSlide;
                const isReachable = stepNumber <= currentSlide;

                return (
                  <Fragment key={label}>
                    {index > 0 ? (
                      <div className={`h-px flex-1 ${isReachable ? "bg-white/60" : "bg-white/15"}`} />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        if (isFinishStep) return;
                        if (stepNumber > currentSlide) return;
                        if (stepNumber === currentSlide) {
                          if (stepNumber === 1) {
                            resetOrder();
                            goToSlide(0);
                          }
                          return;
                        }
                        goBackToStep(stepNumber);
                      }}
                      disabled={stepNumber > currentSlide || isFinishStep}
                      aria-label={stepNumber === 1 && isActive ? "Kembali ke beranda" : `Ke langkah ${label}`}
                      aria-current={isActive ? "step" : undefined}
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-[11px] transition ${isActive ? "border-white bg-white text-blue-900 shadow-lg" : isComplete ? "border-white bg-white/15 text-white" : "border-white/25 text-white/45"}`}
                      style={{ fontFamily: "var(--font-studio-display)" }}
                    >
                      {isComplete ? "✓" : stepNumber}
                    </button>
                  </Fragment>
                );
              })}
            </div>
            <div className="mt-2 h-7 overflow-hidden text-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="text-lg text-white"
                  style={{ fontFamily: "var(--font-studio-display)" }}
                >
                  {STEP_LABELS[currentSlide - 1]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full transition-transform duration-500" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="h-full w-full shrink-0 overflow-y-auto">
                {slide}
              </div>
            ))}
          </div>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setBookingDialogOpen(true)}
            className="w-full flex-none bg-blue-900 px-4 py-2 font-bold text-white"
          >
            [ADMIN] Add Booking
          </button>
        ) : null}

        <div className="flex-none">
          <BolBolFooter />
        </div>
      </main>

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
    </FitToViewport>
    </MotionConfig>
  );
}
