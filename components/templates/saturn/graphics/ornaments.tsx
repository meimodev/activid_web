"use client";

import { motion } from "framer-motion";

export function CosmicDivider() {
    return (
        <div className="w-full flex items-center justify-center py-8 opacity-70">
            <div className="relative flex items-center gap-1">
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="h-px w-24 bg-gradient-to-r from-transparent via-wedding-accent-2 to-transparent"
                />
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    viewport={{ once: true }}
                    className="h-[2px] bg-wedding-accent-2/50 relative overflow-hidden"
                >
                    <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-wedding-accent-light to-transparent opacity-50"
                    />
                </motion.div>
                <motion.div 
                    animate={{ rotate: [45, 225] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-2 h-2 border border-wedding-accent-2 shrink-0" 
                />
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    viewport={{ once: true }}
                    className="h-[2px] bg-wedding-accent-2/50 relative overflow-hidden"
                >
                    <motion.div 
                        animate={{ x: ["200%", "-100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-wedding-accent-light to-transparent opacity-50"
                    />
                </motion.div>
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="h-px w-24 bg-gradient-to-l from-transparent via-wedding-accent-2 to-transparent"
                />
            </div>
        </div>
    );
}

export function VerticalCosmicLine() {
    return (
        <div className="h-48 w-px mx-auto my-8 relative flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wedding-accent-2/50 to-transparent" />
            <motion.div
                animate={{ y: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-20 bg-gradient-to-b from-transparent via-wedding-accent-2 to-transparent opacity-50 blur-sm"
            />
        </div>
    );
}

export function SectionOrnament() {
    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <div className="w-1 h-1 bg-wedding-accent-2 rounded-full" />
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-wedding-accent to-transparent" />
            <div className="w-1 h-1 bg-wedding-accent rounded-full" />
        </div>
    );
}

export function SatrunIcon() {
    return (
        <div className="flex items-center justify-center py-10 relative">
            <div className="w-12 h-12 border border-wedding-accent-2/30 rounded-full flex items-center justify-center relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t border-wedding-accent-2 rounded-full"
                />
                <div className="w-8 h-8 bg-wedding-accent/10 rounded-full backdrop-blur-sm border border-wedding-accent/30" />
            </div>

            {/* HUD Lines */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent via-wedding-accent-2/20 to-transparent" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-wedding-accent/20 to-transparent" />
        </div>
    );
}

export function StarDivider() {
    return (
        <div className="flex items-center justify-center py-8 gap-2 opacity-80">
            <motion.div 
                animate={{ opacity: [0.3, 1, 0.3], width: ["40px", "60px", "40px"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-px bg-gradient-to-r from-transparent to-wedding-accent-2/80" 
            />
            <motion.div 
                animate={{ rotate: 180, scale: [1, 1.2, 1] }}
                transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                className="relative w-4 h-4 shrink-0"
            >
                <div className="absolute inset-0 border border-wedding-accent-2 rotate-45" />
                <div className="absolute inset-0 border border-wedding-accent" />
            </motion.div>
            <motion.div 
                animate={{ opacity: [0.3, 1, 0.3], width: ["40px", "60px", "40px"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="h-px bg-gradient-to-l from-transparent to-wedding-accent-2/80" 
            />
        </div>
    );
}

export function SignalDivider() {
    return (
        <div className="w-full flex items-center justify-center py-8 opacity-70">
            <div className="flex items-center gap-2">
                <motion.div 
                    animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-px bg-gradient-to-r from-transparent to-wedding-accent-2 origin-right" 
                />
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 bg-wedding-accent-2 rounded-full shrink-0 shadow-[0_0_5px_var(--invitation-accent-2)]"
                        />
                    ))}
                </div>
                <motion.div 
                    animate={{ scaleX: [1, 1.5, 1], opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="w-16 h-px bg-gradient-to-l from-transparent to-wedding-accent-2 origin-left" 
                />
            </div>
        </div>
    );
}

export function OrbitDivider() {
    return (
        <div className="w-full flex items-center justify-center py-8">
            <div className="relative w-full max-w-xs h-px bg-gradient-to-r from-transparent via-wedding-accent-2/30 to-transparent overflow-hidden">
                <motion.div
                    animate={{ left: ["-10%", "110%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-wedding-accent to-transparent"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-wedding-accent-2/50 bg-wedding-dark z-10" />
            </div>
        </div>
    );
}

export function HexagonFrame({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <div
                className="absolute inset-0 bg-gradient-to-br from-wedding-accent-2/20 to-wedding-accent/20"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            <div
                className="relative z-10 w-full h-full overflow-hidden p-[2px]"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
                <div className="w-full h-full bg-wedding-dark">
                    {children}
                </div>
            </div>
        </div>
    )
}
