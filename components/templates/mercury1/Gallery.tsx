"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { SectionOrnament } from "./graphics";

interface GalleryProps {
    photos: string[];
    heading: string;
}

export function Gallery({ photos, heading }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(0);

    // Limit to 9 photos for the grid
    const displayPhotos = photos.slice(0, 9);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setDirection(1);
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % displayPhotos.length));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setDirection(-1);
        setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + displayPhotos.length) % displayPhotos.length));
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;

        const imageUrl = displayPhotos[selectedIndex];
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
        <section className="py-24 relative text-stone-800 bg-stone-50">
            <div className="container mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <SectionOrnament />
                        <h2 className="font-serif text-3xl md:text-5xl mt-6">{heading}</h2>
                        <p className="mt-4 font-sans text-stone-500 text-xs tracking-widest uppercase">Capturing the Moments</p>
                    </div>
                </RevealOnScroll>

                <div className="relative max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 relative z-10">
                        {displayPhotos.map((photo, index) => (
                            <RevealOnScroll key={index} delay={index * 0.1} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative aspect-square cursor-pointer group overflow-hidden rounded-sm shadow-sm"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(index);
                                    }}
                                >
                                    <img
                                        src={photo}
                                        alt={`Memory ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                </motion.div>
                            </RevealOnScroll>
                        ))}
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
                        className="fixed inset-0 z-100 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <div
                            className="relative max-w-6xl w-full h-full max-h-[90vh] flex items-center justify-center pointer-events-none"
                        >
                            {/* Image Container */}
                            <div
                                className="relative max-w-4xl w-full aspect-video p-2 pointer-events-auto shadow-2xl bg-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Image Viewport - Overflow hidden for slide animation */}
                                <div className="relative w-full h-full overflow-hidden bg-stone-100">
                                    <AnimatePresence initial={false} custom={direction} mode="wait">
                                        <motion.img
                                            key={selectedIndex}
                                            src={displayPhotos[selectedIndex]}
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

                                {/* Controls Header */}
                                <div className="absolute -top-12 left-0 right-0 flex justify-between items-center text-xs tracking-widest uppercase">
                                    <button
                                        onClick={handleDownload}
                                        className="text-stone-800 hover:text-stone-500 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-lg group-hover:animate-bounce">↓</span> Download
                                    </button>

                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="text-stone-800 hover:text-stone-500 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-stone-400 hover:text-stone-800 transition-colors pointer-events-auto z-50 group"
                                aria-label="Previous image"
                            >
                                <span className="text-4xl font-light group-hover:-translate-x-1 transition-transform inline-block">&lt;</span>
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-stone-400 hover:text-stone-800 transition-colors pointer-events-auto z-50 group"
                                aria-label="Next image"
                            >
                                <span className="text-4xl font-light group-hover:translate-x-1 transition-transform inline-block">&gt;</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
