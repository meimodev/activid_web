"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface CoupleInfo {
  groom: { firstName: string; shortName?: string; fullName?: string };
  bride: { firstName: string; shortName?: string; fullName?: string };
}

interface HeroProps {
  onOpen: () => void;
  couple: CoupleInfo;
  date: string;
  subtitle: string;
  coverImage: string;
  guestName?: string;
}

const revealEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Hero({ onOpen, couple, date, subtitle, coverImage, guestName }: HeroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const openTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
  return () => {
  if (openTimeoutRef.current !== null) {
  window.clearTimeout(openTimeoutRef.current);
  }
  };
  }, []);

  const groomInitial = couple.groom.firstName?.charAt(0).toUpperCase() || "G";
  const brideInitial = couple.bride.firstName?.charAt(0).toUpperCase() || "B";
  const displayGuest = guestName?.trim() || "NAMA TAMU";
  const heading = subtitle?.trim() || "The Wedding ";
  const groomName = couple.groom.shortName || couple.groom.firstName;
  const brideName = couple.bride.shortName || couple.bride.firstName;

  const handleOpen = () => {
  if (isOpening) return;

  setIsOpening(true);
  openTimeoutRef.current = window.setTimeout(() => {
  onOpen();
  }, 1240);
  };

  return (
  <div className="relative h-screen w-full overflow-hidden bg-[#612A35]">
  <motion.div
  className="absolute inset-0"
  style={{
  backgroundImage: `url(${coverImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  }}
  initial={{ opacity: 0, scale: 1.04 }}
  animate={isOpening ? { opacity: 0, scale: 1.02 } : { opacity: 0.16, scale: 1 }}
  transition={isOpening ? { duration: 0.64, ease: revealEase } : { duration: 1.2, ease: "easeOut" }}
  >
  <div className="absolute inset-0 bg-[#431A23]/85" />
  </motion.div>
  <motion.div
  className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_82%_88%,rgba(255,255,255,0.06),transparent_45%)]"
  animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
  transition={isOpening ? { duration: 0.56, delay: 0.06, ease: revealEase } : { duration: 0.3, ease: "linear" }}
  />

  <motion.div
  aria-hidden
  className="pointer-events-none absolute inset-0 z-10 bg-center bg-cover bg-no-repeat"
  style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.smoke})` }}
  initial={{ opacity: 0.6, scale: 1 }}
  animate={
  isOpening
  ? { opacity: 0, scale: 1.03 }
  : { opacity: [0.7, 1, 0.7], x: [0, 0, 0], y: [0, -10, 0], scale: [1, 1.04, 1] }
  }
  transition={isOpening ? { duration: 0.56, ease: [0.22, 1, 0.36, 1] } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
  />

  <motion.div
  aria-hidden
  className="pointer-events-none absolute -left-10 -top-10 z-[60] h-full w-[300px] bg-contain bg-no-repeat"
  initial={{ opacity: 0, scale: 0.92, y: -14 }}
  animate={isOpening ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1, y: 0, x: 0 }}
  transition={isOpening ? { duration: 0.72, delay: 0.12, ease: revealEase } : { duration: 0.95, delay: 0.18, ease: revealEase }}
  >
  <motion.div
  className="h-full w-full bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCorner})`,
  transformOrigin: "12% 8%",
  }}
  animate={{
  rotate: [0, -1.8, 1.1, -1.1, 0],
  x: [0, 1.5, -1, 1, 0],
  y: [0, -1.5, 0.8, -0.8, 0],
  }}
  transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
  />
  </motion.div>
  <motion.div
  aria-hidden
  className="pointer-events-none absolute -bottom-12 -right-12 z-[60] h-[300px] rotate-180 w-[300px] bg-contain bg-no-repeat"
  initial={{ opacity: 0, scale: 0.92, y: 14 }}
  animate={isOpening ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1, y: 0, x: 0 }}
  transition={isOpening ? { duration: 0.72, delay: 0.3, ease: revealEase } : { duration: 0.95, delay: 0.32, ease: revealEase }}
  >
  <motion.div
  className="h-full w-full bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCorner})`,
  transformOrigin: "12% 8%",
  }}
  animate={{
  rotate: [0, -1.6, 0.9, -1, 0],
  x: [0, 1.2, -0.9, 0.8, 0],
  y: [0, -1.2, 0.7, -0.7, 0],
  }}
  transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
  />
  </motion.div>

  <div className="relative z-30 mx-auto flex h-full w-full max-w-[610px] items-center justify-center p-3 ">
  <motion.div
  initial={{ y: 28, opacity: 0, scale: 0.985 }}
  animate={isOpening ? { opacity: 0, scale: 0.99 } : { y: 0, opacity: 1, scale: 1 }}
  transition={isOpening ? { duration: 0.44, delay: 0.42, ease: revealEase } : { duration: 0.95, delay: 0.48, ease: revealEase }}
  className="relative flex h-full w-full max-h-[750px] min-h-[500px] flex-col items-center overflow-hidden rounded-[210px] border border-[#f3d8df] bg-[#fffefe] px-6 pb-12 pt-11 text-center shadow-[0_25px_90px_rgba(44,11,19,0.5)] "
  >

  <motion.div
  className="flex gap-4 font-brittany-signature font-bold text-shadow-lg text-[#8b5864] z-10 mt-15"
  initial={{ opacity: 0, y: 16 }}
  animate={isOpening ? { opacity: 0 } : { opacity: 1, y: 0 }}
  transition={isOpening ? { duration: 0.48, delay: 0.3, ease: revealEase } : { duration: 0.82, delay: 0.7, ease: revealEase }}
  >
  
  <h1 className="relative text-[86px]  pb-10">
  {groomInitial}
  </h1>
  <h1 className="relative self-center text-[60px]  ">
  & 
  </h1>
  <h1 className="relative text-[86px]  pt-24">
  {brideInitial}
  </h1>
  </motion.div>

  <motion.div
  className="relative z-10 mt-14 px-2"
  initial={{ opacity: 0, y: 16 }}
  animate={isOpening ? { opacity: 0 } : { opacity: 1, y: 0 }}
  transition={isOpening ? { duration: 0.46, delay: 0.2, ease: revealEase } : { duration: 0.82, delay: 0.84, ease: revealEase }}
  >
  <p className="font-stoic text-[32px] leading-none text-[#6f4a53] ">{heading}</p>
  <p className="mt-3 font-tan-mon-cheri text-[30px] leading-tight text-[#5f323c] ">
  {groomName} & {brideName}
  </p>
  <p className="font-garet-book mt-4 text-[20px] tracking-[0.22em] text-[#5f323c] ">{date}</p>
  </motion.div>

  <motion.div
  className="relative font-poppins z-10 mt-10 space-y-2 text-[#62414b] "
  initial={{ opacity: 0, y: 16 }}
  animate={isOpening ? { opacity: 0 } : { opacity: 1, y: 0 }}
  transition={isOpening ? { duration: 0.44, delay: 0.1, ease: revealEase } : { duration: 0.82, delay: 0.98, ease: revealEase }}
  >
  <p className="text-md font-medium leading-tight">Kepada Yth.</p>
  <p className="text-md font-medium leading-tight">Bapak/Ibu/Saudara-i</p>
  <p className="pt-2 text-2xl font-semibold tracking-wide text-[#4f2a31] ">{displayGuest}</p>
  </motion.div>

  <motion.button
  whileHover={isOpening ? {} : { scale: 1.03 }}
  whileTap={isOpening ? {} : { scale: 0.97 }}
  initial={{ opacity: 0, y: 16 }}
  animate={isOpening ? { opacity: 0 } : { opacity: 1, y: 0 }}
  transition={isOpening ? { duration: 0.38, delay: 0, ease: revealEase } : { duration: 0.82, delay: 1.12, ease: revealEase }}
  onClick={handleOpen}
  disabled={isOpening}
  className="relative z-10 mt-4 rounded-full bg-[#5d2e36] px-10 py-3 text-md font-poppins tracking-wide text-[#fff4f6] shadow-[0_10px_25px_rgba(68,26,35,0.35)] transition-colors hover:bg-[#4f252d]"
  >
  Buka Undangan
  </motion.button>
  </motion.div>
  </div>

  <div className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_100px_rgba(43,12,19,0.32)]" />
  </div>
  );
}
