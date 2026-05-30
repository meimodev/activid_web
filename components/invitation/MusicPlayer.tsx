"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MusicPlayerProps {
    shouldStart: boolean;
    audioUrl: string;
    variant?: "default" | "fun" | "space" | "arcade" | "candy";
}

function readThemeColors() {
    if (typeof document === "undefined") return { accent: "", accent2: "", dark: "", bg: "" };
    const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
    const el = shell ?? document.documentElement;
    const style = window.getComputedStyle(el);
    return {
        accent: style.getPropertyValue("--invitation-accent").trim(),
        accent2: style.getPropertyValue("--invitation-accent-2").trim(),
        dark: style.getPropertyValue("--invitation-dark").trim(),
        bg: style.getPropertyValue("--invitation-bg").trim(),
    };
}

export function MusicPlayer({ shouldStart, audioUrl, variant = "default" }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const isFun = variant === "fun";
    const isSpace = variant === "space";
    const isArcade = variant === "arcade";
    const isCandy = variant === "candy";

    const [themeColors, setThemeColors] = useState(() => readThemeColors());

    const recomputeThemeColors = useCallback(() => {
        setThemeColors(readThemeColors());
    }, []);

    useEffect(() => {
        if (!isSpace && !isArcade && !isCandy) return;

        const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
        const target = shell ?? document.documentElement;

        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing CSS custom properties from .invitation-mobile-shell
        recomputeThemeColors();

        const observer = new MutationObserver(() => {
            recomputeThemeColors();
        });

        observer.observe(target, {
            attributes: true,
            attributeFilter: ["style"],
        });

        return () => observer.disconnect();
    }, [isSpace, isArcade, isCandy, recomputeThemeColors]);

    const detectThemeVariant = (accent: string) => {
        const a = accent.toLowerCase().trim();
        if (a === "#306230" || a === "306230" || a === "#8bac0f" || a === "8bac0f") return "gameboy-classic";
        if (a === "#ff5e00" || a === "ff5e00") return "neon-sunset";
        return "cyber-arcade";
    };

    const arcadeSubTheme = isArcade ? detectThemeVariant(themeColors.accent) : "cyber-arcade";

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
            className={`fixed bottom-6 right-6 z-50 ${(!isFun && !isSpace && !isArcade && !isCandy) ? 'mix-blend-difference' : ''}`}
        >
            <audio ref={audioRef} src={streamUrl} loop preload="auto" />

            {isArcade ? (
                <div
                    onClick={togglePlay}
                    className="relative flex items-center gap-3 rounded-[8px] border-[3px] border-black p-2 pr-3 shadow-[4px_4px_0_0_black] font-mono select-none overflow-hidden cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_black] transition-all"
                    style={{
                        backgroundColor: 
                            arcadeSubTheme === "gameboy-classic" ? "#b5b5ad" :
                            arcadeSubTheme === "neon-sunset" ? themeColors.dark || "#16002c" :
                            themeColors.dark || "#0c061a",
                        borderColor: "black"
                    }}
                >
                    {/* Glowing LED Blinking indicator */}
                    <div className="absolute top-1 left-2 flex items-center gap-1">
                        <span 
                            className={`h-1.5 w-1.5 rounded-full border border-black/40 ${
                                isPlaying 
                                    ? arcadeSubTheme === "gameboy-classic"
                                        ? "bg-[#306230] animate-pulse"
                                        : "bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] animate-pulse"
                                    : "bg-red-600/50"
                            }`}
                        />
                        <span className="text-[7px] font-bold text-black/50 leading-none uppercase">
                            {arcadeSubTheme === "gameboy-classic" ? "PWR" : "LED"}
                        </span>
                    </div>

                    {/* Tiny Pixel CRT Screen */}
                    <div 
                        className="relative flex flex-col justify-center items-center h-10 w-20 rounded border-[2px] border-black overflow-hidden mt-1.5"
                        style={{
                            backgroundColor:
                                arcadeSubTheme === "gameboy-classic" ? "#8bac0f" :
                                arcadeSubTheme === "neon-sunset" ? "#2d004d" :
                                "#07120e",
                            borderColor: "black"
                        }}
                    >
                        {/* CRT Scanline overlay effect */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-35" />

                        {/* Top Line label */}
                        <span 
                            className="text-[8px] font-black tracking-tight"
                            style={{
                                color:
                                    arcadeSubTheme === "gameboy-classic" ? "#0f380f" :
                                    arcadeSubTheme === "neon-sunset" ? "#ffea00" :
                                    "#00f0ff"
                            }}
                        >
                            {isPlaying ? "BGM: ON" : "BGM: OFF"}
                        </span>

                        {/* Equalizer Bars */}
                        <div className="flex items-end gap-0.5 h-4 mt-0.5">
                            {[1, 2, 3, 4, 5].map((bar) => (
                                <motion.div
                                    key={bar}
                                    className="w-1 rounded-[1px]"
                                    style={{ 
                                        backgroundColor: 
                                            arcadeSubTheme === "gameboy-classic" ? "#0f380f" :
                                            arcadeSubTheme === "neon-sunset" ? "#ff5e00" :
                                            themeColors.accent || "#ff007f",
                                        height: 4 
                                    }}
                                    animate={isPlaying ? { height: [4, 14, 4] } : { height: 4 }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: bar * 0.1,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Physical Push Button */}
                    <div className="flex flex-col items-center justify-center mt-1">
                        <button
                            type="button"
                            className="relative flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-black select-none pointer-events-none"
                            style={{
                                backgroundColor:
                                    arcadeSubTheme === "gameboy-classic" ? "#306230" :
                                    arcadeSubTheme === "neon-sunset" ? "#ff5e00" :
                                    themeColors.accent || "#ff007f",
                                color: "white",
                                boxShadow: "inset 0 3px 0 rgba(255,255,255,0.4), 0 3px 0 black"
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isPlaying ? (
                                    <motion.div
                                        key="pause"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <PixelPauseIcon arcadeSubTheme={arcadeSubTheme} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="play"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <PixelPlayIcon arcadeSubTheme={arcadeSubTheme} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                        <span 
                            className="text-[7px] font-black mt-1 uppercase"
                            style={{
                                color:
                                    arcadeSubTheme === "gameboy-classic" ? "#306230" :
                                    arcadeSubTheme === "neon-sunset" ? "#ffea00" :
                                    "black"
                            }}
                        >
                            {arcadeSubTheme === "gameboy-classic" ? "START" : "COIN"}
                        </span>
                    </div>

                    {/* Floating 8-bit visual particles (when music is playing) */}
                    {isPlaying && (
                        <div className="pointer-events-none absolute inset-0 -z-10">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={`arcade-part-${i}`}
                                    className="absolute left-1/2 top-1/2 select-none"
                                    initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.4 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        y: ["-50%", "-160%"],
                                        x: ["-50%", i === 1 ? "-180%" : i === 2 ? "-80%" : "30%"],
                                        rotate: [0, i % 2 === 0 ? 90 : -90],
                                        scale: [0.4, 1.2, 0.6]
                                    }}
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        delay: i * 0.7,
                                        ease: "easeOut"
                                    }}
                                >
                                    {arcadeSubTheme === "gameboy-classic" ? (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#306230">
                                            {/* Pixel art heart */}
                                            <path d="M2 1h2v1H2zm4 0h2v1H6zM1 2h8v1H1zm0 1h8v1H1zm1 1h6v1H2zm1 1h4v1H3zm1 1h2v1H4z" />
                                        </svg>
                                    ) : arcadeSubTheme === "neon-sunset" ? (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#ffea00">
                                            {/* Pixel art star */}
                                            <path d="M4 1h2v1H4zm0 7h2v1H4zM1 4h8v2H1zm1-1h6v4H2z" />
                                        </svg>
                                    ) : (
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="#00f0ff">
                                            {/* Pixel art sound note */}
                                            <path d="M4 1h4v1H4zm3 1h1v6H7zm-5 4h3v3H2zm3-1h1v1H5z" />
                                        </svg>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : isCandy ? (
                <motion.button
                    onClick={togglePlay}
                    className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-[#4A1E12] focus:outline-none cursor-pointer"
                    style={{
                        backgroundColor: "#FF4793",
                        boxShadow: `0 6px 0 0 #D01C6B, 0 12px 24px rgba(208,28,107,0.3)`
                    }}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.9, y: 4 }}
                    aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {/* Swirling peppermint swirl background decoration (highly vibrant & joyful) */}
                    <motion.div 
                        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0"
                        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                        transition={isPlaying ? { rotate: { duration: 8, repeat: Infinity, ease: "linear" } } : undefined}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full opacity-100">
                            {/* Background base circle (joyful candy pink) */}
                            <circle cx="50" cy="50" r="50" fill="#FF4793" />
                            {/* Swirl slices (pure bright white) */}
                            <path d="M 50 50 L 50 0 A 50 50 0 0 1 85 15 Z" fill="#FFFFFF" />
                            <path d="M 50 50 L 100 50 A 50 50 0 0 1 85 85 Z" fill="#FFFFFF" />
                            <path d="M 50 50 L 50 100 A 50 50 0 0 1 15 85 Z" fill="#FFFFFF" />
                            <path d="M 50 50 L 0 50 A 50 50 0 0 1 15 15 Z" fill="#FFFFFF" />
                            {/* Central sweet highlight (sunny yellow lemon drop) */}
                            <circle cx="50" cy="50" r="14" fill="#FFD700" stroke="#FFFFFF" strokeWidth="2.5" />
                        </svg>
                    </motion.div>

                    {/* Lollipop wooden stick extending at a tilt, placed behind the button */}
                    <div 
                        className="absolute -bottom-7 -left-2.5 w-2 h-8 rounded-full border-[2px] border-amber-900/10 origin-top -z-10 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                        style={{
                            backgroundColor: "#FDE68A",
                            transform: "rotate(30deg)"
                        }}
                    />

                    {/* Ribbon bow tie on lollipop stick */}
                    <div 
                        className="absolute -bottom-1 -left-1 z-10 pointer-events-none"
                        style={{ transform: "rotate(15deg)" }}
                    >
                        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                            {/* Left bow */}
                            <path d="M10 6C6 2 2 3 2 6C2 9 6 10 10 6Z" fill="#F472B6" stroke="white" strokeWidth="1" />
                            {/* Right bow */}
                            <path d="M10 6C14 2 18 3 18 6C18 9 14 10 10 6Z" fill="#F472B6" stroke="white" strokeWidth="1" />
                            {/* Center knot */}
                            <circle cx="10" cy="6" r="2.5" fill="#F43F5E" stroke="white" strokeWidth="1" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <motion.div
                                    key="pause"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PauseIcon isFun={true} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-0.5"
                                >
                                    <PlayIcon isFun={true} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Floating treats (cotton candy, lollipop, cupcake) */}
                    {isPlaying && (
                        <div className="pointer-events-none absolute inset-0 -z-25">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={`note-candy-${i}`}
                                    className="absolute left-1/2 top-1/2 text-lg select-none"
                                    initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.4 }}
                                    animate={{ 
                                        opacity: [0, 1, 0],
                                        y: ["-50%", "-160%"],
                                        x: ["-50%", i === 1 ? "-160%" : i === 2 ? "-70%" : "60%"],
                                        rotate: [0, i % 2 === 0 ? -90 : 90],
                                        scale: [0.4, 1.2, 0.7]
                                    }}
                                    transition={{
                                        duration: 2.4,
                                        repeat: Infinity,
                                        delay: i * 0.7,
                                        ease: "easeOut"
                                    }}
                                >
                                    {i === 1 ? "🍭" : i === 2 ? "🍬" : "🧁"}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.button>
            ) : (
                <motion.button
                    onClick={togglePlay}
                    className={
                        isSpace
                            ? `relative flex h-12 w-12 items-center justify-center rounded-full text-white focus:outline-none ml-2 mb-2`
                            : isFun
                                ? `relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#FFB703] text-white shadow-[0_8px_0_0_#FB8500,0_15px_20px_rgba(0,0,0,0.2)] focus:outline-none`
                                : `flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 focus:outline-none`
                    }
                    style={isSpace ? {
                        backgroundColor: themeColors.accent,
                        boxShadow: "0 0 0 3px white, 0 0 0 7px black, 11px 11px 0 7px black",
                        color: "white"
                    } : undefined}
                    whileTap={
                        isSpace ? { y: 4, x: 4, boxShadow: "0 0 0 3px white, 0 0 0 7px black, 7px 7px 0 7px black" }
                        : isFun ? { y: 6, boxShadow: "0 2px 0 0 #FB8500,0 5px 10px rgba(0,0,0,0.2)" } 
                        : undefined
                    }
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
                        <div className="pointer-events-none absolute inset-[-18px] -z-10">
                            <motion.div
                                className="absolute inset-0 rounded-full border-[3px] border-black border-dashed"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                                <PauseIcon isFun={isFun} isSpace={isSpace} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="play"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={isSpace ? "ml-1.5" : "ml-1"}
                            >
                                <PlayIcon isFun={isFun} isSpace={isSpace} />
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
            )}
        </motion.div>
    );

    return createPortal(player, document.body);
}

function PlayIcon({ isFun, isSpace }: { isFun?: boolean; isSpace?: boolean }) {
    return (
        <svg
            width={isFun ? "18" : isSpace ? "20" : "14"}
            height={isFun ? "18" : isSpace ? "20" : "14"}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke={isSpace ? "black" : undefined}
            strokeWidth={isSpace ? "2.5" : undefined}
            strokeLinejoin="round"
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseIcon({ isFun, isSpace }: { isFun?: boolean; isSpace?: boolean }) {
    return (
        <svg
            width={isFun ? "18" : isSpace ? "20" : "18"}
            height={isFun ? "18" : isSpace ? "20" : "14"}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke={isSpace ? "black" : undefined}
            strokeWidth={isSpace ? "2.5" : undefined}
            strokeLinejoin="round"
        >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );
}

function PixelPlayIcon({ arcadeSubTheme }: { arcadeSubTheme: string }) {
    return (
        <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="currentColor"
            style={{
                color: arcadeSubTheme === "gameboy-classic" ? "#8bac0f" : "white"
            }}
        >
            <path d="M2 1h2v12H2zm2 2h2v8H4zm2 2h2v4H6zm2 2h2v2H8z" />
        </svg>
    );
}

function PixelPauseIcon({ arcadeSubTheme }: { arcadeSubTheme: string }) {
    return (
        <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="currentColor"
            style={{
                color: arcadeSubTheme === "gameboy-classic" ? "#8bac0f" : "white"
            }}
        >
            <path d="M2 1h3v12H2zm7 0h3v12H9z" />
        </svg>
    );
}
