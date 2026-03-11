"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MusicPlayerProps {
    shouldStart: boolean;
    audioUrl: string;
    variant?: "default" | "fun";
}

export function MusicPlayer({ shouldStart, audioUrl, variant = "default" }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const isFun = variant === "fun";

    // Convert Dropbox "dl=1" or "dl=0" to "raw=1" for reliable streaming
    const streamUrl = audioUrl.replace(/dl=[01]/, "raw=1");

    useEffect(() => {
        if (shouldStart && audioRef.current) {
            // Attempt to play automatically when the invitation opens (user just interacted)
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.warn("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, [shouldStart]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Only show the player after the invitation has been opened
    if (!shouldStart || typeof document === "undefined") return null;

    const player = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`fixed bottom-6 right-6 z-50 ${!isFun && 'mix-blend-difference'}`}
        >
            <audio ref={audioRef} src={streamUrl} loop preload="auto" />

            <motion.button
                onClick={togglePlay}
                className={
                    isFun
                        ? `relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#FFB703] text-white shadow-[0_8px_0_0_#FB8500,0_15px_20px_rgba(0,0,0,0.2)] focus:outline-none`
                        : `flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 focus:outline-none`
                }
                whileTap={isFun ? { y: 6, boxShadow: "0 2px 0 0 #FB8500,0 5px 10px rgba(0,0,0,0.2)" } : undefined}
                animate={isFun && isPlaying ? { 
                    rotate: [-5, 5, -5],
                    scale: [1, 1.05, 1],
                } : undefined}
                transition={isFun ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
            >
                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.div
                            key="pause"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PauseIcon isFun={isFun} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="play"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-1" // Optical alignment for play icon
                        >
                            <PlayIcon isFun={isFun} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating music notes for fun variant */}
                {isFun && isPlaying && (
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={`note-${i}`}
                                className="absolute left-1/2 top-1/2 text-xl"
                                initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.5 }}
                                animate={{ 
                                    opacity: [0, 1, 0],
                                    y: ["-50%", "-150%"],
                                    x: ["-50%", i % 2 === 0 ? "-150%" : "50%"],
                                    rotate: [0, i % 2 === 0 ? -45 : 45],
                                    scale: [0.5, 1.2, 0.8]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.6,
                                    ease: "easeOut"
                                }}
                            >
                                {i % 2 === 0 ? "🎵" : "🎶"}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.button>

            {/* Visual equalizer bars (optional aesthetic touch) */}
            {/* {isPlaying && (
           <div className="absolute left-14 top-1/2 flex -translate-y-1/2 gap-1 px-2">
                 {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        className="w-1 bg-white/80"
                        animate={{ height: [4, 12, 4] }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                         }}
                    />
                ))}
           </div>
       )} */}
        </motion.div>
    );

    return createPortal(player, document.body);
}

function PlayIcon({ isFun }: { isFun?: boolean }) {
    return (
        <svg
            width={isFun ? "18" : "14"}
            height={isFun ? "18" : "14"}
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseIcon({ isFun }: { isFun?: boolean }) {
    return (
        <svg
            width={isFun ? "18" : "18"}
            height={isFun ? "18" : "14"}
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );
}
