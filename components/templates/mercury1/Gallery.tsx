"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { MERCURY_OVERLAY_ASSETS } from "./graphics/overlays";

interface GalleryProps {
    photos: string[];
    heading: string;
}

export function Gallery({ photos, heading }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Limit to 9 photos for the grid
    const displayPhotos = photos.slice(0, 9);
    const collagePhotos = displayPhotos.slice(0, 5);
    const lightboxPhotos = photos;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setDirection(1);
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % lightboxPhotos.length));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setDirection(-1);
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length));
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;

        const imageUrl = lightboxPhotos[selectedIndex];
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Extract filename from URL or use a default
            const filename = `memory-${selectedIndex + 1}.jpg`;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback: Open in new tab
            window.open(imageUrl, '_blank');
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <section className="relative overflow-hidden bg-[#612A35] py-24 text-white sm:py-28">
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <motion.div
                    className="absolute -left-32 top-12 h-[520px] w-[520px] rotate-[8deg] bg-contain bg-no-repeat opacity-14"
                    style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle})` }}
                    animate={{ x: [0, 14, 0], y: [0, -8, 0], rotate: [8, 10, 8] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-44 bottom-10 h-[640px] w-[640px] -rotate-[10deg] bg-contain bg-no-repeat opacity-12"
                    style={{ backgroundImage: `url(${MERCURY_OVERLAY_ASSETS.sprinkle2})` }}
                    animate={{ x: [0, -12, 0], y: [0, 10, 0], rotate: [-10, -8, -10] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mx-auto w-full max-w-[560px]">
                    <RevealOnScroll direction="none" scale={1} delay={0.1} width="100%">
                        <div className="flex items-center justify-end gap-4">
                            <div className="h-px flex-1 bg-white/25" />
                            <div className="h-2 w-2 rounded-full bg-white/55" />
                            <h2 className="font-tan-mon-cheri text-[58px] leading-none text-white sm:text-[66px]">{heading}</h2>
                        </div>
                    </RevealOnScroll>

                    <div className="mt-14 grid grid-cols-2 gap-6 sm:gap-7">
                        {collagePhotos[0] && (
                            <RevealOnScroll direction="none" scale={1} delay={0.18} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="relative col-span-2 aspect-[16/10] cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-white/15"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(0);
                                    }}
                                >
                                    <img src={collagePhotos[0]} alt="Gallery photo 1" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </motion.div>
                            </RevealOnScroll>
                        )}

                        {collagePhotos[1] && (
                            <RevealOnScroll direction="none" scale={1} delay={0.26} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-white/15"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(1);
                                    }}
                                >
                                    <img src={collagePhotos[1]} alt="Gallery photo 2" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </motion.div>
                            </RevealOnScroll>
                        )}

                        {collagePhotos[2] && (
                            <RevealOnScroll direction="none" scale={1} delay={0.34} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-white/15"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(2);
                                    }}
                                >
                                    <img src={collagePhotos[2]} alt="Gallery photo 3" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </motion.div>
                            </RevealOnScroll>
                        )}

                        {collagePhotos[3] && (
                            <RevealOnScroll direction="none" scale={1} delay={0.42} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="relative col-span-2 aspect-[16/10] cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-white/15"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(3);
                                    }}
                                >
                                    <img src={collagePhotos[3]} alt="Gallery photo 4" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </motion.div>
                            </RevealOnScroll>
                        )}

                        {collagePhotos[4] && (
                            <RevealOnScroll direction="none" scale={1} delay={0.5} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="relative col-span-2 aspect-[16/10] cursor-pointer overflow-hidden rounded-[28px] ring-1 ring-white/15"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(4);
                                    }}
                                >
                                    <img src={collagePhotos[4]} alt="Gallery photo 5" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/10" />
                                </motion.div>
                            </RevealOnScroll>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
                    >
                        <div
                            className="relative h-[86vh] w-full max-w-5xl pointer-events-none"
                        >
                            {/* Image Container */}
                            <div
                                className="relative h-full w-full overflow-hidden rounded-2xl bg-white p-2 pointer-events-auto shadow-2xl sm:p-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-4 bg-white/85 px-4 py-3 text-xs tracking-widest uppercase backdrop-blur">
                                    <button
                                        onClick={handleDownload}
                                        className="text-stone-800 hover:text-stone-500 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-lg group-hover:animate-bounce">↓</span> Download
                                    </button>

                                    <div className="font-poppins text-[10px] text-stone-600">
                                        {selectedIndex + 1} / {lightboxPhotos.length}
                                    </div>

                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="text-stone-800 hover:text-stone-500 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>

                                {/* Image Viewport - Overflow hidden for slide animation */}
                                <div className="relative h-full w-full overflow-hidden bg-stone-100 pt-12 sm:pt-14">
                                    <AnimatePresence initial={false} custom={direction} mode="wait">
                                        <motion.img
                                            key={selectedIndex}
                                            src={lightboxPhotos[selectedIndex]}
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            alt={`Memory ${selectedIndex + 1}`}
                                            className="w-full h-full object-contain absolute inset-0"
                                        />
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/85 p-3 text-stone-700 shadow-lg backdrop-blur transition-colors hover:bg-white pointer-events-auto sm:left-4 sm:p-4"
                                aria-label="Previous image"
                            >
                                <span className="text-3xl font-light sm:text-4xl">&lt;</span>
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/85 p-3 text-stone-700 shadow-lg backdrop-blur transition-colors hover:bg-white pointer-events-auto sm:right-4 sm:p-4"
                                aria-label="Next image"
                            >
                                <span className="text-3xl font-light sm:text-4xl">&gt;</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
