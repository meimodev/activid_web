"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BackgroundSlideshowProps {
    photos: string[];
    className?: string;
}

export function BackgroundSlideshow({ photos, className }: BackgroundSlideshowProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (photos.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % photos.length);
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(timer);
    }, [photos.length]);

    if (photos.length === 0) return null;

    const safeIndex = index % photos.length;

    return (
        <div className={className ?? "fixed inset-0 z-0 overflow-hidden pointer-events-none"}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={photos[safeIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${photos[safeIndex]})`,
                        willChange: "opacity, transform"
                    }}
                />
            </AnimatePresence>
        </div>
    );
}
