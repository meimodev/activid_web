"use client";

import { motion } from "framer-motion";

export function HeaderIntroBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <motion.div
                className="absolute left-1/2 top-1/2 w-[520px] h-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-0 left-1/2 w-3 h-3 -translate-x-1/2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" />
            </motion.div>
            <motion.div
                className="absolute -bottom-56 left-1/2 w-[620px] h-[620px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
                animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -18, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
