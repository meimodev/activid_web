"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT, fadeUp, popIn, stagger } from "./motion";
import { formatLongDate, formatTime } from "../date";
import type { StudioBackground, StudioInfo, StudioPackage } from "../config";
import BackgroundImageCycle from "./BackgroundImageCycle";

function formatPrice(price?: number) {
  if (!price) return "";
  return `Rp ${price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
}

// --- Live input formatting (runs on every keystroke) -----------------------

// Names: letters / spaces / apostrophes / dots / hyphens only, single spaces.
function formatName(value: string) {
  return value
    .replace(/[^\p{L}\s'’.-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "");
}

// Phone: keep an optional leading +, group digits in 4s for readability.
function formatPhone(value: string) {
  const hasPlus = value.trimStart().startsWith("+");
  const digits = value.replace(/\D/g, "").slice(0, 15);
  const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  return (hasPlus ? "+" : "") + grouped;
}

// Instagram: strip a typed @, allow only handle-legal chars, re-prefix @.
function formatInstagram(value: string) {
  const handle = value
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, 30);
  return handle ? `@${handle}` : "";
}

// --- Validation ------------------------------------------------------------

function isNameValid(value: string) {
  const trimmed = value.trim();
  return trimmed.length >= 2 && /\p{L}/u.test(trimmed);
}

// Indonesian mobile: 08… or 62…8… , 9–14 digits total.
function isPhoneValid(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^(0|62)8\d{7,12}$/.test(digits);
}

// Optional, but if present must be a legal Instagram handle.
function isInstagramValid(value: string) {
  const handle = value.replace(/^@/, "");
  if (handle === "") return true;
  return /^(?!.*\.\.)[a-zA-Z0-9._]{1,30}$/.test(handle) && !handle.endsWith(".");
}

export default function ConfirmationView({
  studioInfo,
  selectedDateTime,
  selectedPackage,
  selectedBackground,
  name,
  phone,
  instagram,
  onNameChange,
  onPhoneChange,
  onInstagramChange,
  onConfirmOrder,
  isActive = false,
}: {
  studioInfo: StudioInfo;
  selectedDateTime: Date;
  selectedPackage: StudioPackage | null;
  selectedBackground: StudioBackground | null;
  name: string;
  phone: string;
  instagram: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onConfirmOrder: (order: {
    name: string;
    phone: string;
    instagram: string;
    package: StudioPackage;
    background: StudioBackground;
    dateTime: Date;
  }) => void;
  isActive?: boolean;
}) {
  const [touched, setTouched] = useState({ name: false, phone: false, instagram: false });
  const [attempted, setAttempted] = useState(false);

  const nameOk = isNameValid(name);
  const phoneOk = isPhoneValid(phone);
  const instagramOk = isInstagramValid(instagram);
  const formOk = nameOk && phoneOk && instagramOk;

  const showNameError = (touched.name || attempted) && !nameOk;
  const showPhoneError = (touched.phone || attempted) && !phoneOk;
  const showInstagramError = (touched.instagram || attempted) && !instagramOk;

  const inputClass = (invalid: boolean) =>
    `rounded border bg-blue-50 p-2 text-sm text-black transition-colors ${invalid ? "border-red-500" : "border-white"}`;

  const handleConfirm = () => {
    if (!selectedPackage || !selectedBackground) return;
    if (!formOk) {
      setAttempted(true);
      setTouched({ name: true, phone: true, instagram: true });
      return;
    }
    onConfirmOrder({
      name: name.trim(),
      phone,
      instagram,
      package: selectedPackage,
      background: selectedBackground,
      dateTime: selectedDateTime,
    });
  };

  return (
    <motion.div
      variants={stagger(0.07, 0.05)}
      initial="hidden"
      animate={isActive ? "show" : "hidden"}
      className="flex h-full w-full flex-col bg-blue-800 p-4 text-white"
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <motion.div variants={fadeUp} className="flex flex-col space-y-2">
          <label className="text-sm text-white">Rincian Pesanan</label>
          <motion.div variants={popIn} className="mx-6 flex overflow-hidden rounded-3xl border border-blue-800 bg-white text-left text-sm text-blue-800" style={{ fontFamily: "var(--font-studio-body)" }}>
            {selectedPackage ? (
              <>
                {selectedBackground ? (
                  <div className="relative w-28 flex-none self-stretch bg-blue-900">
                    <BackgroundImageCycle
                      images={selectedBackground.images}
                      alt={selectedBackground.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-col gap-0.5 p-3">
                  <span className="text-xl" style={{ fontFamily: "var(--font-studio-display)" }}>Paket {selectedPackage.name}</span>
                  <span>{formatPrice(selectedPackage.price)}</span>
                  <span>{formatLongDate(selectedDateTime)} - {`${formatTime(selectedDateTime)} ${studioInfo.timezoneLabel}`}</span>
                  {selectedBackground ? <span>Latar {selectedBackground.name}</span> : null}
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} animate={showNameError ? { x: [0, -5, 5, -3, 3, 0] } : undefined} className="flex flex-col space-y-1.5">
          <label className="text-sm text-white">
            Atas Nama <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            inputMode="text"
            autoComplete="name"
            value={name}
            onChange={(event) => onNameChange(formatName(event.target.value))}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            aria-invalid={showNameError}
            className={inputClass(showNameError)}
            placeholder="Untuk mempermudah pencarian dan pengiriman foto"
          />
          <AnimatePresence>
            {showNameError ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="text-xs text-amber-300"
              >
                Masukkan nama yang valid (minimal 2 huruf).
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} animate={showPhoneError ? { x: [0, -5, 5, -3, 3, 0] } : undefined} className="flex flex-col space-y-1.5">
          <label className="text-sm text-white">
            Nomor Handphone aktif <span className="text-amber-400">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => onPhoneChange(formatPhone(event.target.value))}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            aria-invalid={showPhoneError}
            className={inputClass(showPhoneError)}
            placeholder="Nomor HP WA / Telegram untuk pengiriman link foto"
          />
          <AnimatePresence>
            {showPhoneError ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="text-xs text-amber-300"
              >
                Masukkan nomor HP Indonesia yang valid (contoh: 0812xxxxxxx).
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} animate={showInstagramError ? { x: [0, -5, 5, -3, 3, 0] } : undefined} className="flex flex-col space-y-1.5">
          <label className="text-sm text-white">
            Instagram Handler <span className="text-xs text-blue-200">(opsional)</span>
          </label>
          <input
            type="text"
            autoComplete="off"
            value={instagram}
            onChange={(event) => onInstagramChange(formatInstagram(event.target.value))}
            onBlur={() => setTouched((prev) => ({ ...prev, instagram: true }))}
            aria-invalid={showInstagramError}
            className={inputClass(showInstagramError)}
            placeholder="Untuk Tag, Follow-Followan, Promosi & Diskon"
          />
          <AnimatePresence>
            {showInstagramError ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="text-xs text-amber-300"
              >
                Username Instagram tidak valid.
              </motion.span>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="flex-none py-4">
        <motion.button
          type="button"
          onClick={handleConfirm}
          aria-disabled={!formOk}
          // Idle: when the form is ready, the conversion CTA breathes to invite the tap.
          animate={isActive && formOk ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.97 }}
          className={`w-full rounded-xl border-2 px-4 py-2 transition-colors ${formOk ? "bg-white text-blue-800 hover:bg-blue-800 hover:text-white" : "cursor-not-allowed border-white/40 bg-white/40 text-blue-900/60"}`}
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Konfirmasi Pesanan
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
