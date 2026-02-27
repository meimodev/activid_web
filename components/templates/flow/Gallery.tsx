"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GoldLeafBorder, DiamondAccent, SectionOrnament } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

interface GalleryProps {
  photos: string[];
  heading: string;
}

export function Gallery({ photos, heading }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [spans, setSpans] = useState<{ [key: number]: string }>({});

  useEffect(() => {
  photos.forEach((photo, index) => {
  const img = new Image();
  img.src = photo;
  img.onload = () => {
  const ratio = img.width / img.height;
  let spanClass = "col-span-1 row-span-1";

  if (ratio > 1.4) {
  // Landscape
  spanClass = "col-span-2 row-span-1";
  } else if (ratio < 0.6) {
  // Portrait
  spanClass = "col-span-1 row-span-2";
  }

  setSpans((prev) => ({ ...prev, [index]: spanClass }));
  };
  });
  }, [photos]);

  return (
  <section className="section-curved py-24 px-4 bg-white/30 backdrop-blur-sm relative border-b border-wedding-accent/30">
  <GoldLeafBorder position="top" />
  <RevealOnScroll direction="down" width="100%">
  <div className="flex flex-col items-center">
  <DiamondAccent />
  <h2 className="text-center font-heading text-3xl text-gold-gradient mb-4 mt-4 uppercase tracking-[0.2em]">
  {heading}
  </h2>
  <SectionOrnament />
  </div>
  </RevealOnScroll>

  <div className="grid grid-cols-2 gap-2 max-w-6xl mx-auto auto-rows-[250px] p-2 bg-white shadow-2xl border border-wedding-accent/10 mt-12 grid-flow-dense rounded-xl">
  {photos.map((photo, i) => (
  <RevealOnScroll key={i} delay={i * 0.1} width="100%" className={spans[i] || "col-span-1 row-span-1"} fullHeight={true}>
  <motion.div
  className={`relative overflow-hidden cursor-pointer w-full h-full group rounded-lg`}
  whileHover={{ scale: 0.98 }}
  onClick={() => setSelectedPhoto(photo)}
  >
  <div className="absolute inset-0 bg-wedding-accent/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
  <img src={photo} alt="Gallery" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 rounded-lg" />
  </motion.div>
  </RevealOnScroll>
  ))}
  </div>

  {/* Lightbox - Portalled to body to avoid z-index/transform issues */}
  {selectedPhoto && typeof document !== 'undefined' && createPortal(
  <div
  className="fixed inset-0 z-100 bg-wedding-dark/95 flex items-center justify-center p-4 backdrop-blur-md"
  onClick={() => setSelectedPhoto(null)}
  >
  <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  className="relative max-w-5xl w-full flex justify-center"
  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image wrapper
  >
  <button
  className="absolute -top-12 right-0 text-white hover:text-wedding-gold transition-colors"
  onClick={() => setSelectedPhoto(null)}
  >
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  </button>
  <img
  src={selectedPhoto}
  alt="Full view"
  className="max-h-[85vh] max-w-full rounded-sm shadow-2xl border-4 border-white object-contain"
  />
  </motion.div>
  </div>,
  document.body
  )}
  <GoldLeafBorder position="bottom" />
  </section>
  );
}
