"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
    shouldStart: boolean;
    audioUrl: string;
}

export function MusicPlayer({ shouldStart, audioUrl }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

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
    if (!shouldStart) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed bottom-6 right-6 z-50 mix-blend-difference"
        >
            <audio ref={audioRef} src={streamUrl} loop preload="auto" />

            <button
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 focus:outline-none"
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
                            <PauseIcon />
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
                            <PlayIcon />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

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
}

function PlayIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );
}
