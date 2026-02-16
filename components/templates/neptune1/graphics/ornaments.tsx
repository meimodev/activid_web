"use client";

import { motion } from "framer-motion";
import { type ReactNode, useId } from "react";

export function NeptuneIdle({
    children,
    amplitude,
    duration,
    delay,
    className,
}: {
    children: ReactNode;
    amplitude?: number;
    duration?: number;
    delay?: number;
    className?: string;
}) {
    const a = amplitude ?? 6;
    const d = duration ?? 6.8;
    const dl = delay ?? 0;

    return (
        <motion.div
            className={className}
            initial={false}
            animate={{ y: [0, -a, 0] }}
            transition={{ duration: d, repeat: Infinity, ease: "easeInOut", delay: dl }}
        >
            {children}
        </motion.div>
    );
}


export function ClassicOrnament() {
    return (
        <motion.svg
            width="260"
            height="30"
            viewBox="0 0 260 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
        >
            <path
                d="M10 15h75c5 0 9-2 12-6 4-6 10-9 18-9 8 0 14 3 18 9 3 4 7 6 12 6h75"
                stroke="rgba(86,118,150,0.65)"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M130 7c-6 0-11 4-11 9s5 9 11 9 11-4 11-9-5-9-11-9Z"
                stroke="rgba(86,118,150,0.6)"
                strokeWidth="1.6"
            />
            <path
                d="M130 12.2c-2.2 0-4 1.7-4 3.8 0 2.2 1.8 3.8 4 3.8s4-1.7 4-3.8c0-2.1-1.8-3.8-4-3.8Z"
                fill="rgba(86,118,150,0.35)"
            />
        </motion.svg>
    );
}

// export function FlowerMark() {
//     return (
//         <motion.svg
//             width="46"
//             height="46"
//             viewBox="0 0 46 46"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             initial={false}
//             animate={{ y: [0, -5, 0] }}
//             transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
//         >
//             <path
//                 d="M23 9c3 0 5 3 5 6 0 2-1 4-2 5 2 0 5 2 6 5 0 4-3 7-7 7-2 0-4-1-5-2-1 1-3 2-5 2-4 0-7-3-7-7 1-3 4-5 6-5-1-1-2-3-2-5 0-3 2-6 5-6 2 0 4 1 5 3 1-2 3-3 5-3Z"
//                 fill="rgba(255,255,255,0.82)"
//             />
//             <path
//                 d="M23 18c2.7 0 5 2.2 5 5s-2.3 5-5 5-5-2.2-5-5 2.3-5 5-5Z"
//                 fill="rgba(180,150,90,0.55)"
//             />
//         </motion.svg>
//     );
// }

export function ClassicFlourishDivider() {
    return (
        <motion.svg
            width="240"
            height="34"
            viewBox="0 0 240 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
        >
            <path d="M8 17h86" stroke="#3A3F45" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M146 17h86" stroke="#3A3F45" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
            <path
                d="M120 10c-5.2 0-9.4 3.8-9.4 8.4 0 4.6 4.2 8.4 9.4 8.4s9.4-3.8 9.4-8.4c0-4.6-4.2-8.4-9.4-8.4Z"
                stroke="#3A3F45"
                strokeOpacity="0.6"
                strokeWidth="1.6"
            />
            <path
                d="M120 13.8c-2.5 0-4.6 2-4.6 4.6s2.1 4.6 4.6 4.6c2.6 0 4.7-2 4.7-4.6s-2.1-4.6-4.7-4.6Z"
                fill="#3A3F45"
                fillOpacity="0.25"
            />
        </motion.svg>
    );
}

export function StoryFloralBand() {
    return (
        <motion.svg
            width="260"
            height="64"
            viewBox="0 0 260 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={false}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
        >
            <path d="M22 44c24-16 54-24 86-24 32 0 62 8 86 24" stroke="#6E7B6E" strokeOpacity="0.35" strokeWidth="2" />
            <path
                d="M130 12c4.5 0 8.2 4 8.2 8.2 0 3.7-2.4 6.8-5.6 7.9 2.7.8 5.6 3.2 5.6 7.1 0 4.7-3.9 8.6-8.6 8.6-2.4 0-4.6-.9-6.2-2.4-1.6 1.5-3.8 2.4-6.2 2.4-4.7 0-8.6-3.9-8.6-8.6 0-3.9 2.9-6.3 5.6-7.1-3.2-1.1-5.6-4.2-5.6-7.9 0-4.2 3.7-8.2 8.2-8.2 2.8 0 5.3 1.5 6.6 3.7 1.3-2.2 3.8-3.7 6.6-3.7Z"
                fill="#6E7B6E"
                fillOpacity="0.18"
            />
        </motion.svg>
    );
}

export function OrnamentDivider() {
    const id = useId();
    const gradId = `neptune-orn-${id}`;

    return (
        <motion.svg
            width="220"
            height="24"
            viewBox="0 0 220 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-90"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="12" x2="220" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(34,211,238,0)" />
                    <stop offset="0.18" stopColor="rgba(94,234,212,0.55)" />
                    <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
                    <stop offset="0.82" stopColor="rgba(167,243,208,0.55)" />
                    <stop offset="1" stopColor="rgba(34,211,238,0)" />
                </linearGradient>
            </defs>

            <motion.path
                d="M6 12H88"
                stroke={`url(#${gradId})`}
                strokeWidth="1"
                strokeLinecap="round"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
                d="M132 12H214"
                stroke={`url(#${gradId})`}
                strokeWidth="1"
                strokeLinecap="round"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />

            <motion.path
                d="M110 5c-3.4 0-6.2 2.8-6.2 6.2 0 1.5.6 3 1.6 4.1 1 .9 2.3 1.6 3.9 1.6s2.9-.7 3.9-1.6c1-.9 1.6-2.5 1.6-4.1C116.2 7.8 113.4 5 110 5Z"
                stroke="rgba(255,255,255,0.38)"
                strokeWidth="1"
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <path
                d="M110 8.25c-1.7 0-3.05 1.38-3.05 3.05 0 1.7 1.36 3.05 3.05 3.05s3.05-1.36 3.05-3.05c0-1.67-1.35-3.05-3.05-3.05Z"
                fill="rgba(255,255,255,0.28)"
            />
        </motion.svg>
    );
}

export function WaveDivider({ flip }: { flip?: boolean }) {
    const id = useId();
    const gradId = `neptune-wave-${id}`;

    return (
        <div className={flip ? "rotate-180" : ""}>
            <motion.svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="w-full h-16 md:h-24 opacity-90"
                initial={false}
                animate={{ x: [0, -36, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            >
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="rgba(34,211,238,0.0)" />
                        <stop offset="0.18" stopColor="rgba(45,212,191,0.18)" />
                        <stop offset="0.52" stopColor="rgba(255,255,255,0.10)" />
                        <stop offset="0.82" stopColor="rgba(16,185,129,0.16)" />
                        <stop offset="1" stopColor="rgba(34,211,238,0.0)" />
                    </linearGradient>
                </defs>

                <path
                    fill="rgba(255,255,255,0.04)"
                    d="M0,72 C120,52 240,92 360,72 C480,52 600,12 720,22 C840,32 960,92 1080,82 C1200,72 1320,32 1440,18 L1440,120 L0,120 Z"
                />
                <path
                    fill={`url(#${gradId})`}
                    opacity="0.9"
                    d="M0,84 C120,72 240,96 360,86 C480,76 600,44 720,50 C840,56 960,98 1080,90 C1200,82 1320,58 1440,40 L1440,120 L0,120 Z"
                />
                <path
                    fill="rgba(255,255,255,0.06)"
                    d="M0,94 C120,84 240,108 360,100 C480,92 600,70 720,74 C840,78 960,110 1080,104 C1200,98 1320,82 1440,70 L1440,120 L0,120 Z"
                />
            </motion.svg>
        </div>
    );
}
