"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface QuoteSectionProps {
 quote: {
  text: string;
  author: string;
 };
}

export function QuoteSection({ quote }: QuoteSectionProps) {
 if (!quote || !quote.text) return null;

 return (
  <section className="relative py-8 flex flex-col items-center justify-center text-center overflow-hidden bg-white text-stone-800">
  <div className="container mx-auto px-2  max-w-5xl relative z-10">
  <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white px-6 py-16  shadow-[0_22px_70px_rgba(44,11,19,0.12)]">
  <motion.div
  aria-hidden
  className="pointer-events-none absolute left-8 bottom-8 h-[140px] w-[140px] bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sidedCorner})`,
  willChange: "transform",
  }}
  animate={{
  x: [0, 2, -1, 0],
  y: [0, -2, 1, 0],
  rotate: [180, 181.2, 179.4, 180],
  }}
  transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
  aria-hidden
  className="pointer-events-none absolute right-8 top-8 h-[140px] w-[140px] bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sidedCorner})`,
  willChange: "transform",
  }}
  animate={{
  x: [0, -2, 1, 0],
  y: [0, 2, -1, 0],
  rotate: [0, -1.1, 0.6, 0],
  }}
  transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
  />

  <motion.div
  aria-hidden
  className="pointer-events-none absolute -left-8 -top-8 h-[220px] w-[220px] bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerSecond})`,
  willChange: "transform",
  }}
  animate={{
  x: [0, 5, -3, 0],
  y: [0, -4, 2, 0],
  rotate: [0, 1.2, -0.8, 0],
  }}
  transition={{ duration: 12.8, repeat: Infinity, ease: "easeInOut" }}
  />

  <motion.div
  aria-hidden
  className="pointer-events-none absolute -bottom-8 -right-8 h-[240px] w-[240px] bg-contain bg-no-repeat"
  style={{
  backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.flowerCornerSecond})`,
  willChange: "transform",
  }}
  animate={{
  x: [0, -4, 3, 0],
  y: [0, 3, -2, 0],
  rotate: [180, 178.8, 180.6, 180],
  }}
  transition={{ duration: 13.6, repeat: Infinity, ease: "easeInOut" }}
  />

  <div className="relative z-10 mx-auto max-w-[980px]">
  <RevealOnScroll
  direction="up"
  distance={18}
  delay={0.12}
  width="100%"
  >
  <blockquote className="font-poppins text-[20px] pt-12 leading-tight text-[#9a6a74] tracking-wide">
  {quote.text}
  </blockquote>
  </RevealOnScroll>

  <RevealOnScroll
  direction="up"
  distance={18}
  delay={0.24}
  width="100%"
  >
  <p className="mt-4 font-poppins-bold text-[24px] text-[#9a6a74]">
  {quote.author}
  </p>
  </RevealOnScroll>
  </div>
  </div>
  </div>
  </section>
 );
}
