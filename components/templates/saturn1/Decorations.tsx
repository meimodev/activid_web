"use client";

import { motion } from "framer-motion";

export function CosmicDivider() {
    return (
        <div className="w-full flex items-center justify-center py-16 opacity-70">
            <div className="relative flex items-center gap-1">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    className="h-[2px] bg-cyan-400/50"
                />
                <div className="w-2 h-2 border border-cyan-400 rotate-45" />
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    className="h-[2px] bg-cyan-400/50"
                />
                <div className="h-px w-24 bg-gradient-to-l from-transparent via-cyan-400 to-transparent" />
            </div>
        </div>
    );
}

export function VerticalCosmicLine() {
    return (
        <div className="h-48 w-px mx-auto my-8 relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
            <motion.div
                animate={{ y: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 blur-sm"
            />
        </div>
    );
}

export function SectionOrnament() {
    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <div className="w-1 h-1 bg-purple-500 rounded-full" />
        </div>
    );
}

export function SatrunIcon() {
    return (
        <div className="flex items-center justify-center py-10 relative">
            <div className="w-12 h-12 border border-cyan-500/30 rounded-full flex items-center justify-center relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t border-cyan-400 rounded-full"
                />
                <div className="w-8 h-8 bg-purple-500/10 rounded-full backdrop-blur-sm border border-purple-500/30" />
            </div>

            {/* HUD Lines */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        </div>
    );
}

export function StarDivider() {
    return (
        <div className="flex items-center justify-center py-8 gap-2">
            <div className="h-px w-10 bg-cyan-500/50" />
            <div className="relative w-4 h-4">
                <div className="absolute inset-0 border border-cyan-400 rotate-45" />
                <div className="absolute inset-0 border border-purple-400" />
            </div>
            <div className="h-px w-10 bg-cyan-500/50" />
        </div>
    );
}

export function HexagonFrame({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div
                className="relative z-10 w-full h-full overflow-hidden p-[2px]"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
                <div className="w-full h-full bg-[#0B0D17]">
                    {children}
                </div>
            </div>
        </div>
    )
}
