"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MusicPlayerProps {
    shouldStart: boolean;
    audioUrl: string;
    variant?: "default" | "fun" | "space";
}

function readSpaceColors() {
    if (typeof document === "undefined") return { accent: "", accent2: "", dark: "" };
    const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
    const el = shell ?? document.documentElement;
    const style = window.getComputedStyle(el);
    return {
        accent: style.getPropertyValue("--invitation-accent").trim(),
        accent2: style.getPropertyValue("--invitation-accent-2").trim(),
        dark: style.getPropertyValue("--invitation-dark").trim(),
    };
}

export function MusicPlayer({ shouldStart, audioUrl, variant = "default" }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const isFun = variant === "fun";
    const isSpace = variant === "space";

    const [spaceColors, setSpaceColors] = useState(() => readSpaceColors());

    const recomputeSpaceColors = useCallback(() => {
        setSpaceColors(readSpaceColors());
    }, []);

    useEffect(() => {
        if (!isSpace) return;

        const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
        const target = shell ?? document.documentElement;

        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing CSS custom properties from .invitation-mobile-shell
        recomputeSpaceColors();

        const observer = new MutationObserver(() => {
            recomputeSpaceColors();
        });

        observer.observe(target, {
            attributes: true,
            attributeFilter: ["style"],
        });

        return () => observer.disconnect();
    }, [isSpace, recomputeSpaceColors]);

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
            className={`fixed bottom-6 right-6 z-50 ${(!isFun && !isSpace) ? 'mix-blend-difference' : ''}`}
        >
            <audio ref={audioRef} src={streamUrl} loop preload="auto" />

            <motion.button
                onClick={togglePlay}
                className={
                    isSpace
                        ? `relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 text-white focus:outline-none`
                        : isFun
                            ? `relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#FFB703] text-white shadow-[0_8px_0_0_#FB8500,0_15px_20px_rgba(0,0,0,0.2)] focus:outline-none`
                            : `flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 focus:outline-none`
                }
                style={isSpace ? {
                    background: `radial-gradient(circle at 40% 40%, ${spaceColors.accent2}99, ${spaceColors.dark})`,
                    boxShadow: `0 0 20px ${spaceColors.accent2}, 0 0 40px ${spaceColors.accent}`,
                } : undefined}
                whileTap={isFun ? { y: 6, boxShadow: "0 2px 0 0 #FB8500,0 5px 10px rgba(0,0,0,0.2)" } : undefined}
                animate={
                    isSpace && isPlaying
                        ? { scale: [1, 1.08, 1] }
                        : isFun && isPlaying
                            ? { rotate: [-5, 5, -5], scale: [1, 1.05, 1] }
                            : undefined
                }
                transition={
                    isSpace
                        ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        : isFun
                            ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                            : undefined
                }
                aria-label={isPlaying ? "Pause Music" : "Play Music"}
            >
                {/* Orbital ring decoration for space variant */}
                {isSpace && isPlaying && (
                    <div className="pointer-events-none absolute inset-[-6px] -z-10">
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `2px solid ${spaceColors.accent2}30` }}
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-[-4px] rounded-full"
                            style={{ border: `2px solid ${spaceColors.accent}20` }}
                            animate={{ rotate: [360, 0] }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                )}

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
                            className="ml-1"
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

                {/* Floating stars for space variant */}
                {isSpace && isPlaying && (
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        {[1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={`star-${i}`}
                                className="absolute left-1/2 top-1/2 text-base"
                                initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.3 }}
                                animate={{ 
                                    opacity: [0, 0.9, 0],
                                    y: ["-50%", `${-50 - (i % 2 === 0 ? 60 : 80)}%`],
                                    x: ["-50%", `${-50 + (i % 3 === 0 ? -60 : i % 3 === 1 ? 60 : 0)}%`],
                                    rotate: [0, i % 2 === 0 ? 180 : -180],
                                    scale: [0.3, 1, 0.4]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeOut"
                                }}
                            >
                                &#10024;
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
