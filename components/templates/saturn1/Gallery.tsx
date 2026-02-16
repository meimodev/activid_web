"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { SatrunIcon } from "./graphics";

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
        <section className="py-32 relative text-white bg-[#0B0D17]">

            <div className="container mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-20 text-center">
                        <SatrunIcon />
                        <h2 className="font-heading text-3xl md:text-5xl uppercase tracking-[0.2em]">{heading}</h2>
                        <p className="mt-4 font-mono text-cyan-400/60 text-xs tracking-widest">ARCHIVED MEMORIES // STARDATE 2026</p>
                    </div>
                </RevealOnScroll>

                <div className="relative max-w-5xl mx-auto">
                    {/* Constellation Lines SVG Layer */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 hidden md:block">
                        <svg width="100%" height="100%">
                            <line x1="16%" y1="16%" x2="50%" y2="50%" stroke="cyan" strokeWidth="1" />
                            <line x1="84%" y1="16%" x2="50%" y2="50%" stroke="cyan" strokeWidth="1" />
                            <line x1="16%" y1="84%" x2="50%" y2="50%" stroke="cyan" strokeWidth="1" />
                            <line x1="84%" y1="84%" x2="50%" y2="50%" stroke="cyan" strokeWidth="1" />
                            <line x1="50%" y1="16%" x2="50%" y2="84%" stroke="purple" strokeWidth="1" strokeDasharray="5,5" />
                        </svg>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                        {displayPhotos.map((photo, index) => (
                            <RevealOnScroll key={index} delay={index * 0.1} width="100%">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="relative aspect-square cursor-pointer group"
                                    onClick={() => {
                                        setDirection(0);
                                        setSelectedIndex(index);
                                    }}
                                >
                                    {/* Connection Node */}
                                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#0B0D17] border border-cyan-500 rounded-full z-20 group-hover:bg-cyan-400 transition-colors duration-300" />

                                    <div
                                        className="absolute inset-0 p-1 bg-gradient-to-br from-cyan-500/20 to-purple-500/20"
                                        style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                                    >
                                        <div className="w-full h-full relative overflow-hidden bg-black/50">
                                            <img
                                                src={photo}
                                                alt={`Memory ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                            />
                                            {/* Overlay Scanline */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[200%] w-full animate-scan pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="absolute -bottom-4 -right-4 font-mono text-[10px] text-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        IMG_SEQ_{index + 10}
                                    </div>
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
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <div
                            className="relative max-w-6xl w-full h-full max-h-[90vh] flex items-center justify-center pointer-events-none"
                        >
                            {/* Image Container */}
                            <div
                                className="relative max-w-4xl w-full aspect-video border border-white/10 p-2 bg-white/5 pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Image Viewport - Overflow hidden for slide animation */}
                                <div className="relative w-full h-full overflow-hidden">
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
                                        className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-lg group-hover:animate-bounce">↓</span> [ Download ]
                                    </button>

                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="text-white hover:text-cyan-400 transition-colors"
                                    >
                                        [ Close Transmission ]
                                    </button>
                                </div>

                                {/* Counter */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-cyan-400/80 font-mono text-sm tracking-widest">
                                    [{selectedIndex + 1} / {displayPhotos.length}]
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-cyan-400 transition-colors pointer-events-auto z-50 group"
                                aria-label="Previous image"
                            >
                                <span className="text-4xl group-hover:-translate-x-1 transition-transform inline-block">&lt;</span>
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-cyan-400 transition-colors pointer-events-auto z-50 group"
                                aria-label="Next image"
                            >
                                <span className="text-4xl group-hover:translate-x-1 transition-transform inline-block">&gt;</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
