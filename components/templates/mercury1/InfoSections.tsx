"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
 collection,
 addDoc,
 Timestamp,
 query,
 where,
 getDocs,
} from "firebase/firestore";
import { FloralDivider } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

// ============================================
// TYPE DEFINITIONS
// ============================================
interface CoupleInfo {
 groom: {
  firstName: string;
  fullName: string;
  shortName: string;
  role: string;
  parents: string;
  photo: string;
 };
 bride: {
  firstName: string;
  fullName: string;
  shortName: string;
  role: string;
  parents: string;
  photo: string;
 };
}

interface EventInfo {
 title: string;
 date: string;
 time: string;
 venue: string;
 address: string;
 mapUrl: string;
}

interface EventsConfig {
 holyMatrimony: EventInfo;
 reception: EventInfo;
}

interface BankAccount {
 bankName: string;
 accountNumber: string;
 accountHolder: string;
}

// ============================================
// TITLE SECTION
// ============================================
interface TitleSectionProps {
 couple: CoupleInfo;
 date: string;
 heading: string;
 countdownTarget: string;
 galleryPhotos: string[];
 showCountdown?: boolean;
}

export function TitleSection({
 couple,
 date,
 heading,
 countdownTarget,
 galleryPhotos,
 showCountdown = true,
}: TitleSectionProps) {
 const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
 });

 useEffect(() => {
  const target = new Date(countdownTarget);

  const timer = window.setInterval(() => {
  const now = new Date();
  const difference = target.getTime() - now.getTime();

  if (difference > 0) {
  setTimeLeft({
  days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((difference / 1000 / 60) % 60),
  seconds: Math.floor((difference / 1000) % 60),
  });
  }
  }, 1000);

  return () => window.clearInterval(timer);
 }, [countdownTarget]);

 const displayHeading = heading?.trim() || "The Wedding of";

 const marqueePhotos = useMemo(() => {
  const pool = (galleryPhotos || []).filter(Boolean);
  if (pool.length === 0) return [];

  const seedSource = `${couple.groom.firstName}|${couple.bride.firstName}|${countdownTarget}`;

  const hashToUint32 = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
  h ^= input.charCodeAt(i);
  h = Math.imul(h, 16777619);
  }
  return h >>> 0;
  };

  const mulberry32 = (a: number) => {
  return () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  };

  const rand = mulberry32(hashToUint32(seedSource));
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
  const j = Math.floor(rand() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(10, shuffled.length));
  while (selected.length < 8) {
  selected.push(pool[selected.length % pool.length]);
  }

  return selected;
 }, [
  couple.bride.firstName,
  couple.groom.firstName,
  countdownTarget,
  galleryPhotos,
 ]);

 const calendarHref = useMemo(() => {
  const datePart = (countdownTarget || "").split("T")[0];
  if (!datePart) return "#";

  const [y, m, d] = datePart.split("-").map((v) => Number(v));
  if (!y || !m || !d) return "#";

  const startDate = new Date(y, m - 1, d);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const fmt = (dt: Date) =>
  `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}`;

  const title = `Wedding of ${couple.groom.firstName} & ${couple.bride.firstName}`;

  const params = new URLSearchParams({
  action: "TEMPLATE",
  text: title,
  dates: `${fmt(startDate)}/${fmt(endDate)}`,
  ctz: "Asia/Jakarta",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
 }, [countdownTarget, couple.bride.firstName, couple.groom.firstName]);

 return (
  <section className="h-[100svh] relative flex flex-col bg-[#612A35] text-[#fff4f6] overflow-hidden">
  {/* Subtle Texture */}
  <div className="absolute inset-0 opacity-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

  <div className="relative z-10 h-full w-full overflow-y-auto">
  <div className="mx-auto flex min-h-full w-full max-w-[920px] flex-col items-center justify-center text-center px-4 pt-[clamp(56px,8vh,96px)] pb-[clamp(110px,14vh,170px)]">
  <div className="relative w-[calc(100%+72px)] -mx-9 overflow-hidden pt-[clamp(12px,4vh,32px)]">
  <motion.div
  className="flex items-center gap-[clamp(18px,3vw,36px)] px-9 "
  initial={{ x: "-50%" }}
  animate={
  marqueePhotos.length > 0 ? { x: ["-50%", "0%"] } : { x: 0 }
  }
  transition={
  marqueePhotos.length > 0
  ? { duration: 34, repeat: Infinity, ease: "linear" }
  : { duration: 0.2 }
  }
  style={{ willChange: "transform" }}
  >
  {[...marqueePhotos, ...marqueePhotos].map((src, i) => (
  <motion.div
  key={`${src}-${i}`}
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
  duration: 0.75,
  delay:
  0.12 + (i % Math.max(1, marqueePhotos.length)) * 0.06,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="h-[clamp(132px,18vw,240px)] w-[clamp(132px,18vw,240px)] shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/20"
  style={{
  backgroundImage: `url(${src})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  willChange: "transform, opacity",
  }}
  />
  ))}
  </motion.div>
  </div>

  <div className="mt-[clamp(28px,5vh,48px)]">
  <motion.p
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.22,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="font-stoic text-[clamp(38px,6vw,54px)] leading-none text-[#fff4f6]"
  style={{ willChange: "transform, opacity" }}
  >
  {displayHeading}
  </motion.p>
  <motion.p
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.32,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="mt-[clamp(12px,2vh,18px)] font-tan-mon-cheri text-[clamp(52px,8vw,82px)] leading-[0.98] text-[#fffefe]"
  style={{ willChange: "transform, opacity" }}
  >
  {couple.groom.firstName} & {couple.bride.firstName}
  </motion.p>
  <motion.p
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.42,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="mt-[clamp(16px,2.6vh,26px)] font-poppins text-[clamp(16px,2.6vw,20px)] tracking-[0.12em] text-[#fff4f6]"
  style={{ willChange: "transform, opacity" }}
  >
  {date}
  </motion.p>
  </div>

  <motion.div
  initial={{ opacity: 0, y: 16, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.54,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  style={{ willChange: "transform, opacity" }}
  >
  <motion.a
  href={calendarHref}
  target="_blank"
  rel="noreferrer"
  className="mt-[clamp(22px,4.5vh,42px)] inline-flex items-center justify-center rounded-full bg-white/12 px-[clamp(30px,7vw,40px)] py-[clamp(10px,2.2vh,14px)] font-poppins text-[clamp(11px,1.8vw,14px)] uppercase tracking-[0.32em] text-white shadow-[0_10px_25px_rgba(44,11,19,0.35)] ring-1 ring-white/35 transition-colors hover:bg-white/18"
  animate={{
  y: [0, -3, 0],
  scale: [1, 1.02, 1],
  }}
  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.98 }}
  style={{ willChange: "transform" }}
  >
  SAVE THE DATE
  </motion.a>
  </motion.div>

  {showCountdown && (
  <div className="font-poppins mt-[clamp(26px,5vh,50px)] grid w-full max-w-[820px] grid-cols-2 gap-[clamp(12px,2.2vw,24px)] ">
  <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.68,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="rounded-2xl bg-white/95 px-[clamp(16px,3vw,24px)] py-[clamp(12px,2.2vw,16px)] text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
  style={{ willChange: "transform, opacity" }}
  >
  <div className="text-[clamp(26px,5.2vw,36px)] leading-none font-semibold">
  {String(timeLeft.days).padStart(2, "0")}
  </div>
  <div className="mt-1 text-[clamp(9px,1.7vw,10px)] tracking-[0.18em] uppercase">
  Hari
  </div>
  </motion.div>
  <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.76,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="rounded-2xl bg-white/95 px-[clamp(16px,3vw,24px)] py-[clamp(12px,2.2vw,16px)] text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
  style={{ willChange: "transform, opacity" }}
  >
  <div className="text-[clamp(26px,5.2vw,36px)] leading-none font-semibold">
  {String(timeLeft.hours).padStart(2, "0")}
  </div>
  <div className="mt-1 text-[clamp(9px,1.7vw,10px)] tracking-[0.18em] uppercase">
  Jam
  </div>
  </motion.div>
  <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.84,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="rounded-2xl bg-white/95 px-[clamp(16px,3vw,24px)] py-[clamp(12px,2.2vw,16px)] text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
  style={{ willChange: "transform, opacity" }}
  >
  <div className="text-[clamp(26px,5.2vw,36px)] leading-none font-semibold">
  {String(timeLeft.minutes).padStart(2, "0")}
  </div>
  <div className="mt-1 text-[clamp(9px,1.7vw,10px)] tracking-[0.18em] uppercase">
  Menit
  </div>
  </motion.div>
  <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
  duration: 0.85,
  delay: 0.92,
  ease: [0.2, 0.65, 0.3, 0.9],
  }}
  className="rounded-2xl bg-white/95 px-[clamp(16px,3vw,24px)] py-[clamp(12px,2.2vw,16px)] text-center text-[#612A35] shadow-[0_10px_25px_rgba(44,11,19,0.25)]"
  style={{ willChange: "transform, opacity" }}
  >
  <div className="text-[clamp(26px,5.2vw,36px)] leading-none font-semibold">
  {String(timeLeft.seconds).padStart(2, "0")}
  </div>
  <div className="mt-1 text-[clamp(9px,1.7vw,10px)] tracking-[0.18em] uppercase">
  Detik
  </div>
  </motion.div>
  </div>
  )}
  </div>
  </div>

  <motion.svg
  aria-hidden
  className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[clamp(180px,26vh,280px)] w-full"
  viewBox="0 0 1440 320"
  preserveAspectRatio="none"
  style={{ willChange: "transform" }}
  >
  <motion.g
  animate={{ x: [0, -1440], y: [0, 14, 0] }}
  transition={{
  x: { duration: 11.5, repeat: Infinity, ease: "linear" },
  y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
  }}
  style={{ willChange: "transform" }}
  >
  <path
  fill="rgba(255,255,255,0.14)"
  d="M0,224L80,234.7C160,245,320,267,480,250.7C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
  />
  <path
  fill="rgba(255,255,255,0.14)"
  d="M0,224L80,234.7C160,245,320,267,480,250.7C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
  transform="translate(1440 0)"
  />
  </motion.g>
  <motion.g
  animate={{ x: [0, -1440], y: [0, 10, 0] }}
  transition={{
  x: { duration: 17.5, repeat: Infinity, ease: "linear" },
  y: { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
  }}
  style={{ willChange: "transform" }}
  >
  <path
  fill="rgba(255,255,255,0.10)"
  d="M0,256L96,250.7C192,245,384,235,576,208C768,181,960,139,1152,154.7C1344,171,1536,245,1632,282.7L1728,320L1728,320L1632,320C1536,320,1344,320,1152,320C960,320,768,320,576,320C384,320,192,320,96,320L0,320Z"
  />
  <path
  fill="rgba(255,255,255,0.10)"
  d="M0,256L96,250.7C192,245,384,235,576,208C768,181,960,139,1152,154.7C1344,171,1536,245,1632,282.7L1728,320L1728,320L1632,320C1536,320,1344,320,1152,320C960,320,768,320,576,320C384,320,192,320,96,320L0,320Z"
  transform="translate(1440 0)"
  />
  </motion.g>
  <motion.g
  animate={{ x: [0, -1440], y: [0, 7, 0] }}
  transition={{
  x: { duration: 24.5, repeat: Infinity, ease: "linear" },
  y: { duration: 6.2, repeat: Infinity, ease: "easeInOut" },
  }}
  style={{ willChange: "transform" }}
  >
  <path
  fill="rgba(255,255,255,0.08)"
  d="M0,288L120,272C240,256,480,224,720,229.3C960,235,1200,277,1320,298.7L1440,320L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
  />
  <path
  fill="rgba(255,255,255,0.08)"
  d="M0,288L120,272C240,256,480,224,720,229.3C960,235,1200,277,1320,298.7L1440,320L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
  transform="translate(1440 0)"
  />
  </motion.g>
  </motion.svg>
  </section>
 );
}

// ============================================
// COUPLE SECTION
// ============================================
interface CoupleSectionProps {
 couple: CoupleInfo;
}

export function CoupleSection({
 couple,
}: CoupleSectionProps) {
 return (
  <section className="relative overflow-hidden bg-[#612A35] py-24 text-[#fff4f6] ">
  <div aria-hidden className="pointer-events-none absolute inset-0">
  <div className="absolute inset-0 z-0">
  <div
  className="absolute insets-x-0 -top-30 h-[500px] w-full bg-cover bg-no-repeat "
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})` }}
  />
  <div
  className="absolute inset-x-0 top-1/2 -translate-y-40 rotate-180 h-[600px] w-full bg-cover bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
  }}
  />
  <div
  className="absolute inset-x-0 bottom-10 h-[600px] w-[540px] bg-cover bg-no-repeat "
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
  }}
  />
  </div>

  <div className="absolute inset-0 z-10">
  <div
  className="absolute -left-20 top-24 h-[560px] w-[220px] bg-contain bg-left bg-no-repeat"
  >
  <motion.div
  className="h-full w-full bg-contain bg-left bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerSide})`,
  transformOrigin: "12% 8%",
  willChange: "transform",
  }}
  animate={{
  rotate: [0, -1.8, 1.1, -1.1, 0],
  x: [0, 1.5, -1, 1, 0],
  y: [0, -1.5, 0.8, -0.8, 0],
  }}
  transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
  />
  </div>
  <div
  className="absolute -right-20 bottom-24 h-[560px] w-[220px] bg-contain bg-right bg-no-repeat"
  style={{ transform: "scaleX(-1)" }}
  >
  <motion.div
  className="h-full w-full bg-contain bg-right bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerSide})`,
  transformOrigin: "12% 8%",
  willChange: "transform",
  }}
  animate={{
  rotate: [0, -1.6, 0.9, -1, 0],
  x: [0, 1.2, -0.9, 0.8, 0],
  y: [0, -1.2, 0.7, -0.7, 0],
  }}
  transition={{
  duration: 7.8,
  repeat: Infinity,
  ease: "easeInOut",
  delay: 0.45,
  }}
  />
  </div>
  </div>
  </div>

  <div className="relative z-20 mx-auto flex w-full max-w-[640px] flex-col items-center px-4 text-center">
  <div className="flex flex-col items-center">
  <RevealOnScroll direction="none" scale={1} delay={0.12} width="100%">
  <div
  aria-hidden
  className="mx-auto h-[30px] w-[240px] bg-contain bg-center bg-no-repeat opacity-90 "
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.topDivider})`,
  }}
  />
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.2} width="100%">
  <p className="mt-8 font-poppins text-[14px] leading-relaxed text-white/85 ">
  Tanpa Mengurangi rasa hormat dengan ini kami mengundang
  Bapak/Ibu/Saudara-i untuk hadir pada pernikahan kami
  </p>
  </RevealOnScroll>
  </div>

  <div className="mt-14 w-full">
  <RevealOnScroll direction="none" scale={1} delay={0.28} width="100%">
  <div className="relative mx-auto w-[250px] ">
  <div className="relative aspect-[3/4]">
  <div
  aria-hidden
  className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.photoFrame})`,
  }}
  />
  <div className="absolute inset-[18px] overflow-hidden ">
  <img
  src={couple.groom.photo}
  alt="Groom"
  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
  />
  </div>
  </div>
  </div>
  </RevealOnScroll>

  <div className="mt-10">
  <RevealOnScroll direction="none" scale={1} delay={0.36} width="100%">
  <p className="font-tan-mon-cheri text-[62px] leading-none text-white ">
  {couple.groom.firstName}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.42} width="100%">
  <p className="mt-2 font-poppins-bold text-[18px] text-white/90 ">
  {couple.groom.fullName}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.48} width="100%">
  <p className="mt-3 font-poppins italic text-[14px] text-white/80">
  {couple.groom.role}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.54} width="100%">
  <p className="mt-5 font-poppins text-[13px] leading-relaxed text-white/80 ">
  {couple.groom.parents}
  </p>
  </RevealOnScroll>
  </div>
  </div>

  <RevealOnScroll direction="none" scale={1} delay={0.62} width="100%">
  <div className="mt-14 flex w-full items-center justify-center">
  <div
  aria-hidden
  className="h-[34px] w-[260px] bg-contain bg-center bg-no-repeat opacity-90 "
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.brideAndGroomDivider})`,
  }}
  />
  </div>
  </RevealOnScroll>

  <div className="mt-14 w-full">
  <RevealOnScroll direction="none" scale={1} delay={0.7} width="100%">
  <div className="relative mx-auto w-[250px] ">
  <div className="relative aspect-[3/4]">
  <div
  aria-hidden
  className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.photoFrame})`,
  }}
  />
  <div className="absolute inset-[18px] overflow-hidden ">
  <img
  src={couple.bride.photo}
  alt="Bride"
  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
  />
  </div>
  </div>
  </div>
  </RevealOnScroll>

  <div className="mt-10">
  <RevealOnScroll direction="none" scale={1} delay={0.78} width="100%">
  <p className="font-tan-mon-cheri text-[62px] leading-none text-white ">
  {couple.bride.firstName}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.84} width="100%">
  <p className="mt-2 font-poppins-bold text-[18px] text-white/90 ">
  {couple.bride.fullName}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.9} width="100%">
  <p className="mt-3 font-poppins italic text-[14px] text-white/80">
  {couple.bride.role}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="none" scale={1} delay={0.96} width="100%">
  <p className="mt-5 font-poppins text-[13px] leading-relaxed text-white/80 ">
  {couple.bride.parents}
  </p>
  </RevealOnScroll>
  </div>
  </div>
  </div>
  </section>
 );
}

// ============================================
// EVENT SECTION
// ============================================
interface EventSectionProps {
 events: EventsConfig;
 heading: string;
}

export function EventSection({ events, heading }: EventSectionProps) {
 const titleRight = heading?.trim().split(/\s+/).slice(-1)[0] || "Event";

 return (
  <section className="relative overflow-hidden bg-[#F8F4EC] py-24 text-[#612A35] ">
  <div aria-hidden className="pointer-events-none absolute inset-0">
  <motion.div
  className="absolute -left-40 top-16 h-[560px] w-[560px] rotate-[10deg] bg-contain bg-no-repeat opacity-14"
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})` }}
  animate={{ x: [0, 14, 0], y: [0, -10, 0], rotate: [10, 12, 10] }}
  transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute -right-52 bottom-12 h-[700px] w-[700px] -rotate-[12deg] bg-contain bg-no-repeat opacity-12"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
  }}
  animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-12, -10, -12] }}
  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
  />

  <motion.div
  className="absolute -right-24 -bottom-28 h-[380px] w-[380px] bg-contain bg-no-repeat opacity-90"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerBottom})`,
  }}
  animate={{ x: [0, -6, 0], y: [0, 4, 0], rotate: [0, -1.1, 0] }}
  transition={{ duration: 11.3, repeat: Infinity, ease: "easeInOut" }}
  />
  </div>

  <div className="container mx-auto px-4 relative z-10">
  <div className="mx-auto w-full max-w-4xl">
  <RevealOnScroll
  direction="up"
  distance={20}
  delay={0.08}
  width="100%"
  >
  <div className="flex items-start gap-6 ">
  <div className="shrink-0">
  <p className="font-tan-mon-cheri text-[56px] leading-none text-[#612A35] ">
  Wedding
  </p>
  <p className="-mt-3 font-stoic text-[56px] leading-none text-[#612A35] ">
  {titleRight}
  </p>
  </div>

  <div className="mt-10 flex w-full items-center gap-3">
  <div className="h-px flex-1 bg-[#612A35]" />
  <div className="h-2 w-2 rounded-full bg-[#612A35]" />
  <div className="h-px flex-1 bg-[#612A35]" />
  </div>
  </div>
  </RevealOnScroll>

  <div className="mt-14 space-y-10">
  <RevealOnScroll
  direction="up"
  distance={22}
  delay={0.18}
  width="100%"
  >
  <div className="relative overflow-visible overflow-hidden rounded-[38px] bg-[#62353f] px-8 py-12 text-center text-white shadow-[0_22px_55px_rgba(44,11,19,0.20)] ring-1 ring-white/10 ">
  <motion.div
  aria-hidden
  className="pointer-events-none absolute -bottom-8 -left-6 h-[180px] w-[180px] bg-contain bg-no-repeat opacity-95"
  animate={{
  x: [0, 4, -3, 6, -2, 2, 0],
  y: [0, -2, 1, -4, 2, -1, 0],
  rotate: [0, -1.1, 0.6, -2.2, 1.4, -0.7, 0],
  }}
  transition={{
  duration: 12.8,
  repeat: Infinity,
  ease: "easeInOut",
  times: [0, 0.14, 0.3, 0.5, 0.68, 0.84, 1],
  repeatDelay: 0.6,
  }}
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerCard})`,
  willChange: "transform",
  transformOrigin: "25% 88%",
  }}
  />

  <p className="font-poppins-bold text-[22px] tracking-[0.22em] uppercase text-white/90 ">
  {events.holyMatrimony.title}
  </p>
  <p className="mt-7 font-poppins-bold text-[20px] text-white ">
  {events.holyMatrimony.date}
  </p>
  <p className="mt-2 font-poppins text-[16px] text-white/85">
  {events.holyMatrimony.time}
  </p>
  <p className="mt-2 font-poppins text-[16px] text-white/85">
  {events.holyMatrimony.venue}
  </p>

  <a
  href={events.holyMatrimony.mapUrl}
  target="_blank"
  rel="noreferrer"
  className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#9a6a74] px-10 py-4 font-poppins-bold text-[12px] tracking-[0.26em] text-white/95 shadow-[0_14px_35px_rgba(44,11,19,0.25)] transition-colors hover:bg-[#a47680]"
  >
  LINK MAP
  </a>
  </div>
  </RevealOnScroll>

  <RevealOnScroll
  direction="up"
  distance={22}
  delay={0.28}
  width="100%"
  >
  <div className="relative overflow-visible rounded-[38px] bg-[#62353f] px-8 py-12 text-center text-white shadow-[0_22px_55px_rgba(44,11,19,0.20)] ring-1 ring-white/10 ">
  <motion.div
  aria-hidden
  className="pointer-events-none absolute -bottom-8 right-16 h-[180px] w-[180px] bg-contain bg-no-repeat opacity-95"
  animate={{
  x: [0, -5, 3, -7, 2, -2, 0],
  y: [0, -1, 2, -4, 2, -1, 0],
  rotate: [0, 1.2, -0.7, 2.4, -1.5, 0.8, 0],
  }}
  transition={{
  duration: 13.6,
  repeat: Infinity,
  ease: "easeInOut",
  times: [0, 0.12, 0.28, 0.5, 0.7, 0.86, 1],
  repeatDelay: 0.5,
  }}
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerCard})`,
  scaleX: -1,
  willChange: "transform",
  transformOrigin: "75% 88%",
  }}
  />

  <p className="font-poppins-bold text-[22px] tracking-[0.22em] uppercase text-white/90 ">
  {events.reception.title}
  </p>
  <p className="mt-7 font-poppins-bold text-[20px] text-white ">
  {events.reception.date}
  </p>
  <p className="mt-2 font-poppins text-[16px] text-white/85">
  {events.reception.time}
  </p>
  <p className="mt-2 font-poppins text-[16px] text-white/85">
  {events.reception.venue}
  </p>

  <a
  href={events.reception.mapUrl}
  target="_blank"
  rel="noreferrer"
  className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#9a6a74] px-10 py-4 font-poppins-bold text-[12px] tracking-[0.26em] text-white/95 shadow-[0_14px_35px_rgba(44,11,19,0.25)] transition-colors hover:bg-[#a47680]"
  >
  LINK MAP
  </a>
  </div>
  </RevealOnScroll>
  </div>
  </div>
  </div>
  </section>
 );
}

// ============================================
// CONFIRMATION SECTION (RSVP)
// ============================================
interface ConfirmationSectionProps {
 invitationId: string;
 rsvpDeadline: string;
}

export function ConfirmationSection({
 invitationId,
 rsvpDeadline,
}: ConfirmationSectionProps) {
 const searchParams = useSearchParams();
 const inviteeName = searchParams.get("to") || "";

 const [formData, setFormData] = useState({ guests: "1" });
 const [status, setStatus] = useState<
  "idle" | "submitting" | "success" | "error" | "already_submitted"
 >("idle");

 useEffect(() => {
  const checkRSVP = async () => {
  if (!inviteeName || !invitationId) return;
  try {
  const q = query(
  collection(db, "rsvps"),
  where("invitationId", "==", invitationId),
  where("name", "==", inviteeName),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
  setStatus("already_submitted");
  }
  } catch (e) {
  console.error("Error checking RSVP:", e);
  }
  };
  checkRSVP();
 }, [inviteeName, invitationId]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!inviteeName) return;

  setStatus("submitting");
  try {
  await addDoc(collection(db, "rsvps"), {
  invitationId,
  name: inviteeName,
  ...formData,
  createdAt: Timestamp.now(),
  });

  setStatus("success");
  } catch (err) {
  console.error(err);
  setStatus("error");
  }
 };

 return (
  <section className="py-24 relative text-center bg-stone-100 text-stone-800">
  <div className="max-w-2xl mx-auto px-4 relative z-10">
  <RevealOnScroll direction="down" width="100%">
  <h2 className="font-serif text-4xl text-stone-800 mb-8">R.S.V.P</h2>
  <FloralDivider />
  </RevealOnScroll>

  <div className="bg-white p-10 rounded-sm shadow-md border border-stone-200 mt-8">
  {status === "success" || status === "already_submitted" ? (
  <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  className="py-10"
  >
  <h3 className="font-serif text-3xl mb-4">
  {status === "already_submitted" ? "Welcome Back" : "Thank You"}
  </h3>
  <p className="font-body text-stone-600 mb-8">
  {status === "already_submitted"
  ? "We have already received your confirmation."
  : "We look forward to celebrating with you."}
  </p>
  </motion.div>
  ) : (
  <RevealOnScroll direction="up" delay={0.2} width="100%">
  <div>
  <p className="font-body mb-8 text-stone-600 italic leading-relaxed">
  {!inviteeName ? (
  "Please access the invitation via your unique link."
  ) : (
  <>Kindly confirm your attendance before {rsvpDeadline}</>
  )}
  </p>

  <form onSubmit={handleSubmit} className="space-y-6 text-left">
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">
  Name
  </label>
  <div className="w-full bg-stone-50 border border-stone-200 p-4 font-serif text-stone-800">
  {inviteeName || "Guest"}
  </div>
  </div>
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">
  Guests
  </label>
  <select
  value={formData.guests}
  onChange={(e) =>
  setFormData({ ...formData, guests: e.target.value })
  }
  className="w-full bg-white border border-stone-200 p-4 focus:outline-none focus:border-stone-400 font-body text-stone-800"
  disabled={status === "submitting" || !inviteeName}
  >
  <option value="1">1 Person</option>
  <option value="2">2 People</option>
  </select>
  </div>

  <button
  type="submit"
  disabled={status === "submitting" || !inviteeName}
  className="w-full bg-stone-800 text-white py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-stone-700 transition-all duration-300 disabled:opacity-50 mt-4"
  >
  {status === "submitting" ? "Sending..." : "Confirm"}
  </button>
  {status === "error" && (
  <p className="text-red-400 text-xs text-center mt-4">
  Something went wrong. Please try again.
  </p>
  )}
  </form>
  </div>
  </RevealOnScroll>
  )}
  </div>
  </div>
  </section>
 );
}

// ============================================
// GIFT SECTION
// ============================================
interface GiftSectionProps {
 bankAccounts: BankAccount[];
 heading: string;
 description: string;
 templateName: string;
 eventDate: string;
}

export function GiftSection({
 bankAccounts,
 heading,
 description,
 templateName,
 eventDate,
}: GiftSectionProps) {
 const [copiedKey, setCopiedKey] = useState<string | null>(null);
 const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
 const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);

 const waText = `ACTIVID INVITATION-${templateName}-${eventDate}`;
 const waUrl = `https://wa.me/6285756681077?text=${encodeURIComponent(waText)}`;

 const copy = async (value: string, key: string) => {
  try {
  await navigator.clipboard.writeText(value);
  } catch {
  const ta = document.createElement("textarea");
  ta.value = value;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  }

  setCopiedKey(key);
  window.setTimeout(() => setCopiedKey(null), 1400);
 };

 return (
  <section className="relative overflow-hidden bg-[#F8F4EC] py-24 text-[#612A35] ">
  <div aria-hidden className="pointer-events-none absolute inset-0">
  <motion.div
  className="absolute -left-32 top-10 h-[520px] w-[520px] rotate-[8deg] bg-contain bg-no-repeat opacity-14"
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})` }}
  animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [8, 10, 8] }}
  transition={{ duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  className="absolute -right-44 bottom-10 h-[640px] w-[640px] -rotate-[10deg] bg-contain bg-no-repeat opacity-12"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})`,
  }}
  animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-10, -8, -10] }}
  transition={{ duration: 14.5, repeat: Infinity, ease: "easeInOut" }}
  />

  
  </div>

  <div className="container mx-auto px-4 relative z-10">
  <div className="mx-auto w-full max-w-4xl">
  <RevealOnScroll direction="none" scale={1} delay={0.1} width="100%">
  <div className="flex items-center justify-end gap-4">
  <div className="h-px flex-1 bg-[#612A35]/40" />
  <div className="h-2 w-2 rounded-full bg-[#612A35]" />
  <h2 className="font-tan-mon-cheri text-[58px] leading-none text-[#612A35] ">
  {heading}
  </h2>
  </div>
  </RevealOnScroll>

  {description ? (
  <RevealOnScroll
  direction="up"
  distance={18}
  delay={0.18}
  width="100%"
  >
  <div className="mt-10 rounded-3xl border border-black/10 bg-white/70 backdrop-blur p-7 shadow-[0_18px_50px_rgba(44,11,19,0.12)]">
  <p className="text-center text-sm text-[#3A2F2F] whitespace-pre-line font-poppins">
  {description}
  </p>
  </div>
  </RevealOnScroll>
  ) : null}

  <RevealOnScroll
  direction="up"
  distance={18}
  delay={0.22}
  width="100%"
  >
  <button
  type="button"
  onClick={() => setIsGiftDialogOpen(true)}
  className="border-1 border-[#612A35] mt-8 w-full inline-flex items-center justify-center rounded-full px-6 py-3 bg-white/70 text-[#612A35] hover:bg-white transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-poppins">
  KIRIM HADIAH
  </span>
  </button>
  </RevealOnScroll>

  <div className="relative mt-4">
  <motion.div
  className="pointer-events-none translate-y-2 h-[65px] bg-cover bg-no-repeat opacity-90"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerBottom})`,
  }}
  animate={{ y: [0, 4, 0] }}
  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  />

  <div className="relative z-10 grid grid-cols-1 gap-4 ">
  {bankAccounts.map((account, index) => {
  const k = `${account.bankName}-${index}`;
  const isExpanded = !!expandedKeys[k];

  return (
  <RevealOnScroll
  key={k}
  direction="up"
  distance={18}
  delay={0.24 + index * 0.08}
  width="100%"
  >
  <div className="relative overflow-hidden rounded-3xl border border-white/12 shadow-[0_18px_50px_rgba(44,11,19,0.20)]">
  <div aria-hidden className="absolute inset-0 bg-[#612A35]" />
  <div aria-hidden className="absolute inset-0 bg-white/8 backdrop-blur" />

  <div className="relative p-7">
  <div className="flex items-start justify-between gap-4">
  <div className="min-w-0">
  <p className="text-xs tracking-[0.35em] uppercase text-white/70 font-poppins">
  {account.bankName}
  </p>
  <p className="mt-3 text-sm text-white/90 font-poppins truncate">
  {account.accountHolder}
  </p>
  </div>

  <button
  type="button"
  onClick={() =>
  setExpandedKeys((prev) => ({
  ...prev,
  [k]: !prev[k],
  }))
  }
  className="shrink-0 inline-flex items-center justify-center rounded-full h-9 w-9 border border-white/15 bg-white/6 hover:bg-white/10 transition"
  aria-expanded={isExpanded}
  aria-label={isExpanded ? "Collapse" : "Expand"}
  >
  <svg
  viewBox="0 0 24 24"
  fill="none"
  className={`h-4 w-4 text-white transition-transform duration-200 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
  >
  <path
  d="M8 5l8 7-8 7"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  />
  </svg>
  </button>
  </div>

  <AnimatePresence initial={false}>
  {isExpanded ? (
  <motion.div
  key="expanded"
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.28, ease: "easeOut" }}
  className="mt-5 overflow-hidden"
  >
  <p className="font-mono text-2xl tracking-wide text-white">
  {account.accountNumber}
  </p>

  <button
  type="button"
  onClick={() => copy(account.accountNumber, k)}
  className="mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 border border-white/15 bg-white/10 hover:bg-white/15 transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-poppins text-white">
  {copiedKey === k ? "Copied" : "Copy"}
  </span>
  </button>
  </motion.div>
  ) : null}
  </AnimatePresence>
  </div>
  </div>
  </RevealOnScroll>
  );
  })}
  </div>
  </div>

  {typeof document !== "undefined"
  ? createPortal(
  <AnimatePresence>
  {isGiftDialogOpen ? (
  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={() => setIsGiftDialogOpen(false)}
  className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
  role="dialog"
  aria-modal="true"
  aria-label="Kirim hadiah"
  >
  <motion.div
  initial={{ opacity: 0, y: 18, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 18, scale: 0.98 }}
  transition={{ duration: 0.22, ease: "easeOut" }}
  onClick={(e) => e.stopPropagation()}
  className="w-full max-w-lg rounded-3xl border border-black/10 bg-[#F8F4EC] p-7 shadow-2xl"
  >
  <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-poppins">
  Info
  </p>
  <h4 className="mt-3 font-tan-mon-cheri text-4xl leading-none text-[#2B2424]">
  Exclusive Discount
  </h4>
  <p className="mt-4 text-sm text-[#3A2F2F] font-poppins">
  Anda akan mendapatkan exclusive discount hingga{" "}
  <span className="font-poppins-bold text-[#2B2424]">
  25%
  </span>{" "}
  untuk pemesanan hadiah dari link ini. &quot;Chat
  WhatsApp&quot; untuk informasi lebih lanjut.
  </p>

  <div className="mt-7 grid grid-cols-1 gap-3">
  <button
  type="button"
  onClick={() => setIsGiftDialogOpen(false)}
  className="rounded-full px-6 py-3 border border-black/10 bg-white/70 hover:bg-white transition"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-poppins">
  Tutup
  </span>
  </button>

  <a
  href={waUrl}
  target="_blank"
  rel="noreferrer"
  className="rounded-full px-6 py-3 bg-[#2B2424] text-white hover:bg-black transition text-center"
  >
  <span className="text-xs uppercase tracking-[0.25em] font-poppins">
  Chat WhatsApp
  </span>
  </a>
  </div>
  </motion.div>
  </motion.div>
  ) : null}
  </AnimatePresence>,
  document.body,
  )
  : null}
  </div>
  </div>
  </section>
 );
}

// ============================================
// FOOTER SECTION
// ============================================
interface FooterSectionProps {
 couple: CoupleInfo;
 message: string;
}

export function FooterSection({ couple, message }: FooterSectionProps) {
 const names = `${couple.groom.firstName} & ${couple.bride.firstName}`;
 const year = new Date().getFullYear();

 void message;

 const stars = useMemo(() => {
  const count = 28;
  return Array.from({ length: count }, (_, i) => {
  const x = (i * 37) % 100;
  const y = (i * 71) % 100;
  const size = 1 + ((i * 13) % 3);
  const dur = 3.4 + ((i * 11) % 25) / 10;
  const delay = ((i * 17) % 20) / 10;
  const opacity = 0.18 + ((i * 13) % 10) * 0.05;
  return { x, y, size, dur, delay, opacity };
  });
 }, []);

 return (
  <footer className="relative mt-0 overflow-hidden bg-[#070712] border-t border-white/5">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12),transparent)]" />
  <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/85" />

  <div className="absolute inset-0 pointer-events-none">
  <motion.div
  className="absolute inset-0 origin-center"
  animate={{ rotate: 360 }}
  transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
  >
  {stars.map((s, idx) => (
  <motion.span
  key={idx}
  className="absolute rounded-full bg-white"
  style={{
  left: `${s.x}%`,
  top: `${s.y}%`,
  width: s.size,
  height: s.size,
  opacity: s.opacity,
  }}
  animate={{
  opacity: [s.opacity, Math.min(1, s.opacity + 0.55), s.opacity],
  scale: [1, 1.35, 1],
  }}
  transition={{
  duration: s.dur,
  repeat: Infinity,
  ease: "easeInOut",
  delay: s.delay,
  }}
  />
  ))}
  </motion.div>

  <motion.div
  className="absolute left-1/2 top-[42%] w-[540px] h-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
  animate={{ rotate: -360 }}
  transition={{ duration: 72, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute top-4 left-1/2 w-3 h-3 -translate-x-1/2 bg-amber-200/80 rounded-full blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.55)]" />
  </motion.div>

  <motion.div
  className="absolute left-[72%] top-[62%] w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/5"
  animate={{ rotate: 360 }}
  transition={{ duration: 54, repeat: Infinity, ease: "linear" }}
  >
  <div className="absolute bottom-6 left-10 w-2 h-2 rounded-full bg-cyan-200/80 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
  </motion.div>

  <div className="absolute -bottom-56 left-1/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
  <div className="absolute -top-56 left-3/4 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

  <motion.div
  className="absolute -top-12 left-[-30%] w-[55%] h-[2px] bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0"
  animate={{ x: ["0%", "220%"], y: ["0%", "120%"], opacity: [0, 1, 0] }}
  transition={{
  duration: 3.0,
  repeat: Infinity,
  ease: "easeInOut",
  repeatDelay: 4.2,
  }}
  style={{ transform: "rotate(18deg)" }}
  />
  </div>

  <div className="relative px-6 py-14">
  <div className="max-w-3xl mx-auto text-center text-white">
  <RevealOnScroll
  direction="up"
  width="100%"
  delay={0.15}
  className="flex justify-center"
  >
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 backdrop-blur-md relative overflow-hidden">
  <span className="relative w-2 h-2 rounded-full bg-amber-200 animate-pulse shadow-[0_0_10px_#fbbf24]" />
  <span className="relative">{names}</span>
  </div>
  </RevealOnScroll>

  <RevealOnScroll direction="up" width="100%" delay={0.35}>
  <h3 className="font-tan-mon-cheri mt-7 text-5xl leading-none text-white">
  Terima kasih
  </h3>
  <p className="font-garet-book font-bold mt-4 text-md text-white/70 whitespace-pre-line">
  MISI SELESAI!{" "}
  </p>
  <p className=" text-sm text-white/70 whitespace-pre-line">
  Kabar bahagia behasil disebar diseluruh pelosok antariksa{" "}
  </p>
  </RevealOnScroll>

  <RevealOnScroll direction="up" width="100%" delay={0.55}>
  <div className="mt-7 flex items-center justify-center">
  <a
  href="https://invitation.activid.id"
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-200 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.35)]"
  >
  <span className="uppercase tracking-[0.25em]">
  Kembali Pulang 🚀
  </span>
  </a>
  </div>
  </RevealOnScroll>

  <RevealOnScroll direction="up" width="100%" delay={0.75}>
  <div className="mt-10 h-px w-full bg-white/10" />
  </RevealOnScroll>

  <RevealOnScroll direction="up" width="100%" delay={0.95}>
  <p className="mt-6 text-[11px] tracking-[0.25em] uppercase text-white/40 font-body">
  © {year} Activid Invitation
  </p>
  </RevealOnScroll>
  </div>
  </div>
  </footer>
 );
}
