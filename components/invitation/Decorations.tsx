"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
    return (
        <div className="w-full flex justify-center py-8 opacity-80">
            <svg width="280" height="30" viewBox="0 0 280 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 25C165 25 180 15 200 15C220 15 240 20 260 20C270 20 275 10 280 5" stroke="#C5A059" strokeWidth="1.5" />
                <path d="M140 25C115 25 100 15 80 15C60 15 40 20 20 20C10 20 5 10 0 5" stroke="#C5A059" strokeWidth="1.5" />
                <circle cx="140" cy="22" r="4" fill="#C5A059" />
                <circle cx="140" cy="22" r="2" fill="#F9F7F2" />
                {/* Extra decorative dots */}
                <circle cx="100" cy="18" r="1.5" fill="#C5A059" opacity="0.6" />
                <circle cx="180" cy="18" r="1.5" fill="#C5A059" opacity="0.6" />
                <circle cx="60" cy="15" r="1" fill="#C5A059" opacity="0.4" />
                <circle cx="220" cy="15" r="1" fill="#C5A059" opacity="0.4" />
            </svg>
        </div>
    );
}



export function VerticalLine() {
    return (
        <div className="h-32 w-[2px] bg-linear-to-b from-transparent via-wedding-accent to-transparent mx-auto my-4 opacity-60 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-wedding-accent rotate-45 opacity-80" />
        </div>
    );
}

export function SectionOrnament() {
    return (
        <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-wedding-accent/50" />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border border-wedding-accent/60 rotate-45"
            />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-wedding-accent/50" />
        </div>
    );
}

export function HeartDivider() {
    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <div className="h-px w-20 bg-linear-to-r from-transparent to-wedding-accent/40" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-wedding-accent/60">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div className="h-px w-20 bg-linear-to-l from-transparent to-wedding-accent/40" />
        </div>
    );
}

export function RingsDivider() {
    return (
        <div className="flex items-center justify-center py-8">
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="text-wedding-accent">
                <circle cx="22" cy="15" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
                <circle cx="38" cy="15" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
                <circle cx="22" cy="15" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
                <circle cx="38" cy="15" r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
            </svg>
        </div>
    );
}



export function DecorativeLine({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
    if (direction === "vertical") {
        return (
            <div className="w-px h-full bg-linear-to-b from-transparent via-wedding-accent/40 to-transparent" />
        );
    }
    return (
        <div className="h-px w-full bg-linear-to-r from-transparent via-wedding-accent/40 to-transparent" />
    );
}

export function DiamondAccent() {
    return (
        <div className="flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-wedding-accent/40 rotate-45" />
            <div className="w-2 h-2 bg-wedding-accent/60 rotate-45" />
            <div className="w-1 h-1 bg-wedding-accent/40 rotate-45" />
        </div>
    );
}

export function GoldLeafBorder({ position }: { position: "top" | "bottom" }) {
    return (
        <div className={`absolute left-0 right-0 ${position === "top" ? "top-0" : "bottom-0"} h-8 overflow-hidden pointer-events-none`}>
            <svg className="w-full h-full" viewBox="0 0 1200 32" preserveAspectRatio="none">
                {position === "top" ? (
                    <>
                        <path d="M0 32 Q300 0 600 16 T1200 32" stroke="#C5A059" strokeWidth="1" fill="none" opacity="0.4" />
                        <path d="M0 32 Q300 8 600 20 T1200 32" stroke="#C5A059" strokeWidth="0.5" fill="none" opacity="0.2" />
                    </>
                ) : (
                    <>
                        <path d="M0 0 Q300 32 600 16 T1200 0" stroke="#C5A059" strokeWidth="1" fill="none" opacity="0.4" />
                        <path d="M0 0 Q300 24 600 12 T1200 0" stroke="#C5A059" strokeWidth="0.5" fill="none" opacity="0.2" />
                    </>
                )}
            </svg>
        </div>
    );
}
