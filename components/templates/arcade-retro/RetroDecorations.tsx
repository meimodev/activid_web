"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSpriteProps {
  children: React.ReactNode;
  speed: number; // positive = background drift, negative = foreground drift
  top: string;
  left?: string;
  right?: string;
  zIndex?: number;
  className?: string;
}

function ParallaxSprite({ children, speed, top, left, right, zIndex = 0, className = "" }: ParallaxSpriteProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (val) => val * speed);

  return (
    <motion.div
      style={{
        position: "absolute",
        top,
        left,
        right,
        y,
        zIndex,
        pointerEvents: "none",
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RetroBackgroundDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side mount check
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-0 overflow-hidden min-h-full">
      {/* Scoped custom css keyframe animations */}
      <style jsx global>{`
        @keyframes arcade-coin-spin {
          0% { transform: rotateY(0deg) translateY(0px); }
          50% { transform: rotateY(180deg) translateY(-8px); }
          100% { transform: rotateY(360deg) translateY(0px); }
        }
        @keyframes arcade-heart-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(3deg); }
        }
        @keyframes arcade-drift-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(8px); }
        }
        @keyframes arcade-drift-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(12px) translateX(-8px); }
        }
        @keyframes arcade-blink {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
        @keyframes arcade-laser-travel {
          0% { left: -100px; }
          100% { left: 100%; }
        }
        .animate-arcade-coin {
          animation: arcade-coin-spin 3.5s infinite linear;
        }
        .animate-arcade-heart {
          animation: arcade-heart-pulse 1.8s infinite ease-in-out;
        }
        .animate-arcade-drift {
          animation: arcade-drift-slow 6s infinite ease-in-out;
        }
        .animate-arcade-drift-rev {
          animation: arcade-drift-reverse 6.5s infinite ease-in-out;
        }
        .animate-arcade-blink {
          animation: arcade-blink 1.2s infinite steps(2);
        }
      `}</style>

      {/* 1. Twinkling Retro Star (Yellow) - Top Section */}
      <ParallaxSprite speed={0.12} top="3%" left="8%" zIndex={0} className="animate-arcade-drift animate-arcade-blink">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#EAB308" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2h2v4H9V2zm0 12h2v4H9v-4zM2 9h4v2H2V9zm12 0h4v2h-4V9z" />
        </svg>
      </ParallaxSprite>

      {/* 2. Spinning Golden 8-Bit Coin - Title Section */}
      <ParallaxSprite speed={0.08} top="7%" right="10%" zIndex={0} className="animate-arcade-coin">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="20" height="12" fill="#EAB308" />
          <rect x="6" y="2" width="12" height="20" fill="#EAB308" />
          <rect x="4" y="8" width="16" height="8" fill="#FACC15" />
          <rect x="8" y="4" width="8" height="16" fill="#FACC15" />
          <rect x="8" y="8" width="4" height="8" fill="#FEF08A" />
          <rect x="6" y="6" width="2" height="2" fill="#FEF08A" />
          <rect x="11" y="7" width="2" height="10" fill="#CA8A04" />
          <rect x="9" y="9" width="6" height="2" fill="#CA8A04" />
        </svg>
      </ParallaxSprite>

      {/* 3. Flashing INSERT COIN Banner ticker - Quote Section */}
      <ParallaxSprite speed={0.05} top="24%" left="4%" zIndex={0} className="animate-arcade-blink rotate-90 origin-left border-2 border-black bg-black px-2 py-0.5 rounded shadow-[2px_2px_0_0_black]">
        <span className="font-mono text-[9px] font-black tracking-widest text-wedding-accent">
          INSERT COIN
        </span>
      </ParallaxSprite>

      {/* 4. Spinning Golden Coin - Quote Section */}
      <ParallaxSprite speed={0.15} top="27%" right="12%" zIndex={0} className="animate-arcade-coin">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="20" height="12" fill="#EAB308" />
          <rect x="6" y="2" width="12" height="20" fill="#EAB308" />
          <rect x="4" y="8" width="16" height="8" fill="#FACC15" />
          <rect x="8" y="4" width="8" height="16" fill="#FACC15" />
          <rect x="8" y="8" width="4" height="8" fill="#FEF08A" />
          <rect x="11" y="7" width="2" height="10" fill="#CA8A04" />
        </svg>
      </ParallaxSprite>

      {/* 5. Retro Space Invader (Cyan) - Event Section */}
      <ParallaxSprite speed={0.14} top="43%" left="12%" zIndex={0} className="animate-arcade-drift">
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0h4v2H8V0zm8 0h4v2h-4V0zm-10 2h4v2H6V2zm12 0h4v2h-4V2zm-14 4h4v2H4V6zm16 0h4v2h-4V6zm-20 2h24v4H0V8zm4 4h4v2H4v-2zm12 0h4v2h-4v-2zm-16 2h4v2H2v-2zm8 0h8v2h-8v-2zm12 0h4v2h-4v-2zm-18 2h4v4H4v-4zm12 0h4v4h-4v-4z" fill="var(--invitation-accent-2)" />
          <rect x="6" y="10" width="4" height="2" fill="#000" />
          <rect x="18" y="10" width="4" height="2" fill="#000" />
        </svg>
      </ParallaxSprite>

      {/* 6. 8-Bit Chest Key - Event Section */}
      <ParallaxSprite speed={0.18} top="48%" right="9%" zIndex={0} className="animate-arcade-drift-rev">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="8" height="8" fill="#EAB308" stroke="#000" strokeWidth="2" />
          <rect x="6" y="4" width="4" height="4" fill="var(--invitation-bg)" />
          <rect x="7" y="10" width="2" height="10" fill="#EAB308" stroke="#000" strokeWidth="2" />
          <rect x="9" y="14" width="4" height="2" fill="#EAB308" stroke="#000" strokeWidth="2" />
          <rect x="9" y="18" width="4" height="2" fill="#EAB308" stroke="#000" strokeWidth="2" />
        </svg>
      </ParallaxSprite>

      {/* 7. Pulsing Heart - Gallery Section */}
      <ParallaxSprite speed={0.08} top="65%" left="11%" zIndex={0} className="animate-arcade-heart">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h4v2H4V6zm4-2h8v2H8V4zm8 2h4v2h-4V6zm4 2h2v6h-2V8zm-2 6h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2H2v-2zm0-6h2v6H2V8z" fill="#000" />
          <path d="M4 8h4v2H4V8zm4 0h8v2H8V8zm8 0h4v2h-4V8zm4 2h2v4h-2v-4zm-2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4V10z" fill="var(--invitation-accent)" />
        </svg>
      </ParallaxSprite>

      {/* 8. Twinkling Yellow Star - Gallery Section */}
      <ParallaxSprite speed={0.11} top="70%" right="6%" zIndex={0} className="animate-arcade-drift animate-arcade-blink">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#EAB308" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2h2v4H9V2zm0 12h2v4H9v-4zM2 9h4v2H2V9zm12 0h4v2h-4V9z" />
        </svg>
      </ParallaxSprite>

      {/* 9. Spinning Golden Coin - Wishes/Leaderboard */}
      <ParallaxSprite speed={0.12} top="84%" left="10%" zIndex={0} className="animate-arcade-coin">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="20" height="12" fill="#EAB308" />
          <rect x="6" y="2" width="12" height="20" fill="#EAB308" />
          <rect x="4" y="8" width="16" height="8" fill="#FACC15" />
          <rect x="8" y="4" width="8" height="16" fill="#FACC15" />
          <rect x="8" y="8" width="4" height="8" fill="#FEF08A" />
          <rect x="11" y="7" width="2" height="10" fill="#CA8A04" />
        </svg>
      </ParallaxSprite>

      {/* 10. Twinkling Cyan Star - Wishes/Leaderboard */}
      <ParallaxSprite speed={0.06} top="88%" right="8%" zIndex={0} className="animate-arcade-drift animate-arcade-blink">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="var(--invitation-accent-2)" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2h2v4H9V2zm0 12h2v4H9v-4zM2 9h4v2H2V9zm12 0h4v2h-4V9z" />
        </svg>
      </ParallaxSprite>

      {/* Infinite Horizontal Retro Laser Sweeper Track */}
      <div className="absolute left-0 w-full overflow-hidden pointer-events-none h-6 opacity-35" style={{ top: "81%", zIndex: 0 }}>
        <div className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-wedding-accent2/25 w-full" />
        <div 
          className="absolute h-1.5 w-32 bg-gradient-to-r from-transparent via-wedding-accent2 to-transparent rounded"
          style={{ animation: "arcade-laser-travel 7.5s infinite linear" }}
        />
      </div>
    </div>
  );
}

export function RetroForegroundDecorations() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side mount check
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-30 overflow-hidden min-h-full">
      {/* Extra foreground keyframe animations */}
      <style jsx global>{`
        @keyframes arcade-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes arcade-float-spin {
          0% { transform: rotate(0deg) translateY(0px); }
          25% { transform: rotate(90deg) translateY(-6px); }
          50% { transform: rotate(180deg) translateY(0px); }
          75% { transform: rotate(270deg) translateY(6px); }
          100% { transform: rotate(360deg) translateY(0px); }
        }
        @keyframes arcade-wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes arcade-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-arcade-twinkle {
          animation: arcade-twinkle 2s infinite ease-in-out;
        }
        .animate-arcade-float-spin {
          animation: arcade-float-spin 8s infinite linear;
        }
        .animate-arcade-wiggle {
          animation: arcade-wiggle 1.5s infinite ease-in-out;
        }
        .animate-arcade-bob {
          animation: arcade-bob 3s infinite ease-in-out;
        }
      `}</style>

      {/* ===== ORIGINAL 10 FOREGROUND SPRITES ===== */}

      {/* 11. 8-Bit Blinking 1UP Sprite (Green) - Title/Quote Section */}
      <ParallaxSprite speed={-0.15} top="13%" left="6%" zIndex={30} className="animate-arcade-blink">
        <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4 h2 v10 h-2 z M4 2 h2 v2 h-2 z M0 14 h6 v2 h-6 z" fill="#84CC16" />
          <path d="M9 2 h2 v12 h-2 z M15 2 h2 v12 h-2 z M11 14 h4 v2 h-4 z" fill="#84CC16" />
          <path d="M20 2 h6 v6 h-6 z M20 8 h2 v8 h-2 z M22 8 h4 v2 h-4 z" fill="#84CC16" />
          <rect x="22" y="4" width="2" height="2" fill="black" />
        </svg>
      </ParallaxSprite>

      {/* 12. Pulsing Red 8-Bit Heart - Title/Quote Section */}
      <ParallaxSprite speed={-0.12} top="18%" right="8%" zIndex={30} className="animate-arcade-heart">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6h4v2H4V6zm4-2h8v2H8V4zm8 2h4v2h-4V6zm4 2h2v6h-2V8zm-2 6h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2H2v-2zm0-6h2v6H2V8z" fill="#000" />
          <path d="M4 8h4v2H4V8zm4 0h8v2H8V8zm8 0h4v2h-4V8zm4 2h2v4h-2v-4zm-2 4h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm-2-2h2v2H6v-2zm-2-2h2v2H4v-2zm0-2h2v2H4V10z" fill="var(--invitation-accent)" />
          <rect x="6" y="6" width="2" height="2" fill="#fff" />
        </svg>
      </ParallaxSprite>

      {/* 13. Floating Retro 8-bit Controller (Purple/Teal) - Host Section */}
      <ParallaxSprite speed={-0.2} top="32%" left="8%" zIndex={30} className="animate-arcade-drift-rev">
        <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="28" height="16" rx="4" fill="var(--invitation-dark)" stroke="var(--invitation-accent2)" strokeWidth="3" />
          <path d="M8 10h4v2H8v-2zm2-2h2v6h-2V8z" fill="var(--invitation-accent)" />
          <circle cx="20" cy="11" r="2.5" fill="var(--invitation-accent)" />
          <circle cx="25" cy="9" r="2.5" fill="#EAB308" />
        </svg>
      </ParallaxSprite>

      {/* 14. Twinkling Neon Cross (Cyan) - Host Section */}
      <ParallaxSprite speed={-0.1} top="38%" right="7%" zIndex={30} className="animate-arcade-drift animate-arcade-blink">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--invitation-accent-2)" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2h2v4H9V2zm0 12h2v4H9v-4zM2 9h4v2H2V9zm12 0h4v2h-4V9z" />
        </svg>
      </ParallaxSprite>

      {/* 15. Pacman Ghost (Rose/Pink) - Story Section */}
      <ParallaxSprite speed={-0.18} top="54%" left="9%" zIndex={30} className="animate-arcade-drift-rev">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2h12v2H6V2zm-4 4h20v14H2V6zm2 14h2v2H4v-2zm4 0h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-16-2h16v2H6v-2z" fill="#EC4899" />
          <rect x="6" y="8" width="4" height="4" fill="#fff" />
          <rect x="14" y="8" width="4" height="4" fill="#fff" />
          <rect x="8" y="10" width="2" height="2" fill="#2563EB" />
          <rect x="16" y="10" width="2" height="2" fill="#2563EB" />
        </svg>
      </ParallaxSprite>

      {/* 16. Spinning Golden Coin - Story Section */}
      <ParallaxSprite speed={-0.15} top="59%" right="11%" zIndex={30} className="animate-arcade-coin">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="20" height="12" fill="#EAB308" />
          <rect x="6" y="2" width="12" height="20" fill="#EAB308" />
          <rect x="4" y="8" width="16" height="8" fill="#FACC15" />
          <rect x="8" y="8" width="4" height="8" fill="#FEF08A" />
          <rect x="11" y="7" width="2" height="10" fill="#CA8A04" />
        </svg>
      </ParallaxSprite>

      {/* 17. Flashing PRESS START Banner - Gift Section */}
      <ParallaxSprite speed={-0.25} top="74%" left="7%" zIndex={30} className="animate-arcade-blink -rotate-90 origin-left border-2 border-black bg-black px-2 py-0.5 rounded shadow-[2px_2px_0_0_black]">
        <span className="font-mono text-[9px] font-black tracking-widest text-wedding-accent2">
          PRESS START
        </span>
      </ParallaxSprite>

      {/* 18. 8-Bit Pixel Cherry - Gift Section */}
      <ParallaxSprite speed={-0.2} top="79%" right="10%" zIndex={30} className="animate-arcade-drift">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4h4v2h-4V4zm-2 2h2v4h-2V6zm-2 4h2v2H8v-2zm-2 2h2v2H6v-2z" fill="#10B981" />
          <rect x="2" y="14" width="8" height="6" fill="#EF4444" />
          <rect x="4" y="12" width="4" height="10" fill="#EF4444" />
          <rect x="4" y="14" width="2" height="2" fill="#fff" />
          <rect x="12" y="14" width="8" height="6" fill="#F59E0B" />
          <rect x="14" y="12" width="4" height="10" fill="#F59E0B" />
          <rect x="14" y="14" width="2" height="2" fill="#fff" />
        </svg>
      </ParallaxSprite>

      {/* 19. Space Invader Enemy Sprite (Lime/Green) - Gratitude */}
      <ParallaxSprite speed={-0.15} top="92%" left="7%" zIndex={30} className="animate-arcade-drift-rev">
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0h4v2H8V0zm8 0h4v2h-4V0zm-10 2h4v2H6V2zm12 0h4v2h-4V2zm-14 4h4v2H4V6zm16 0h4v2h-4V6zm-20 2h24v4H0V8zm4 4h4v2H4v-2zm12 0h4v2h-4v-2zm-16 2h4v2H2v-2zm8 0h8v2h-8v-2zm12 0h4v2h-4v-2zm-18 2h4v4H4v-4zm12 0h4v4h-4v-4z" fill="#84CC16" />
          <rect x="6" y="10" width="4" height="2" fill="#000" />
          <rect x="18" y="10" width="4" height="2" fill="#000" />
        </svg>
      </ParallaxSprite>

      {/* 20. Golden 8-Bit Pixel Crown - Footer Section */}
      <ParallaxSprite speed={-0.18} top="96%" right="12%" zIndex={30} className="animate-arcade-drift">
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2h2v4H2V2zm10 0h2v4h-2V2zm10 0h2v4h-2V2zm-18 4h2v2H6V6zm14 0h2v2h-2V6zm-16 2h20v8H4V8zm-2 8h22v2H2v-2z" fill="#EAB308" />
          <rect x="6" y="10" width="2" height="4" fill="#EF4444" />
          <rect x="18" y="10" width="2" height="4" fill="#3B82F6" />
          <rect x="12" y="8" width="2" height="6" fill="#10B981" />
        </svg>
      </ParallaxSprite>

      {/* ===== NEW WAVE OF FOREGROUND SPRITES ===== */}

      {/* 21. Pixel Sword (Golden) - Title area right */}
      <ParallaxSprite speed={-0.22} top="5%" right="15%" zIndex={31} className="animate-arcade-wiggle">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="0" width="2" height="18" fill="#EAB308" />
          <rect x="7" y="2" width="6" height="2" fill="#FACC15" />
          <rect x="4" y="18" width="12" height="2" fill="#78716C" />
          <rect x="8" y="20" width="4" height="6" fill="#A16207" />
          <rect x="7" y="26" width="6" height="2" fill="#78716C" />
          <rect x="10" y="0" width="1" height="18" fill="#FEF08A" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 22. Pixel Shield (Blue/Silver) - Title area left */}
      <ParallaxSprite speed={-0.09} top="8%" left="14%" zIndex={31} className="animate-arcade-bob">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h14v2H4V0zM2 2h18v8H2V2zm4 8h12v6H6v-6zm2 6h8v4H8v-4zm2 4h4v4h-4v-4z" fill="#3B82F6" />
          <path d="M4 2h14v6H4V2z" fill="#60A5FA" />
          <rect x="9" y="4" width="4" height="10" fill="#EAB308" />
          <rect x="7" y="7" width="8" height="2" fill="#EAB308" />
        </svg>
      </ParallaxSprite>

      {/* 23. Pac-Man eating dots - Title/Quote transition */}
      <ParallaxSprite speed={-0.16} top="16%" left="18%" zIndex={31} className="animate-arcade-drift">
        <svg width="60" height="18" viewBox="0 0 60 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4h4v2H2V4zm0 8h4v2H2v-2zm4-6h4v4H6V6zm10 0h4v2h-4V6z" fill="#FACC15" />
          <circle cx="9" cy="9" r="7" fill="#FACC15" />
          <polygon points="16,9 10,3 10,15" fill="var(--invitation-bg, #1a1a2e)" />
          <rect x="9" y="7" width="2" height="2" fill="#000" />
          <rect x="22" y="7" width="4" height="4" fill="#FDE68A" />
          <rect x="32" y="7" width="4" height="4" fill="#FDE68A" />
          <rect x="42" y="7" width="4" height="4" fill="#FDE68A" />
          <rect x="52" y="7" width="4" height="4" fill="#FDE68A" />
        </svg>
      </ParallaxSprite>

      {/* 24. Pixel Potion (Purple) - Quote section */}
      <ParallaxSprite speed={-0.28} top="22%" right="14%" zIndex={31} className="animate-arcade-bob">
        <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="0" width="6" height="4" fill="#A1A1AA" />
          <rect x="4" y="4" width="10" height="2" fill="#A1A1AA" />
          <rect x="2" y="6" width="14" height="14" fill="#7C3AED" />
          <rect x="4" y="8" width="10" height="10" fill="#8B5CF6" />
          <rect x="2" y="20" width="14" height="4" fill="#6D28D9" />
          <rect x="6" y="8" width="3" height="4" fill="#C4B5FD" opacity="0.6" />
        </svg>
      </ParallaxSprite>

      {/* 25. Power-Up Mushroom (Red/White) - Quote section left */}
      <ParallaxSprite speed={-0.14} top="26%" left="5%" zIndex={31} className="animate-arcade-drift-rev">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h14v2H4V4zm-2 2h18v6H2V6zm4 6h12v4H6v-4zm2 4h8v4H8v-4z" fill="#EF4444" />
          <rect x="4" y="6" width="4" height="4" fill="#fff" />
          <rect x="14" y="6" width="4" height="4" fill="#fff" />
          <rect x="8" y="12" width="6" height="4" fill="#FDE68A" />
          <rect x="8" y="16" width="2" height="4" fill="#FDE68A" />
          <rect x="12" y="16" width="2" height="4" fill="#FDE68A" />
        </svg>
      </ParallaxSprite>

      {/* 26. Pixel Diamond (Cyan) - Host/Quote transition */}
      <ParallaxSprite speed={-0.3} top="30%" right="5%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2h8v2H6V2zm-2 2h4v2H4V4zm8 0h4v2h-4V4zm-10 2h4v4H2V6zm12 0h4v4h-4V6zm-8 4h4v2H6v-2zm-2-2h2v2H4V8zm12 0h2v2h-2V8zm-6 4h2v2h-2v-2zm-4-2h2v2H6v-2zm6 0h2v2h-2v-2z" fill="#06B6D4" />
          <rect x="8" y="4" width="4" height="4" fill="#67E8F9" />
          <rect x="6" y="6" width="2" height="2" fill="#A5F3FC" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 27. Pixel Lightning Bolt (Yellow) - Event section left */}
      <ParallaxSprite speed={-0.11} top="35%" left="16%" zIndex={31} className="animate-arcade-blink">
        <svg width="16" height="26" viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0h4v2H8V0zm4 2h4v2h-4V2zm0 4h2v2h-2V6zm-2 2h2v2h-2V8zm-2 2h2v2H8v-2zm0 2h6v2H8v-2zm-2 2h2v2H6v-2zm-2 2h2v2H4v-2zm-2 2h2v2H2v-2zm-2 2h2v2H0v-2zm6 2h4v2H6v-2z" fill="#EAB308" />
          <path d="M10 2h2v4h-2V2zm-2 6h2v4h-2V8zm-4 8h2v4H4v-4z" fill="#FEF08A" opacity="0.6" />
        </svg>
      </ParallaxSprite>

      {/* 28. 8-Bit Bomb (Classic) - Event section right */}
      <ParallaxSprite speed={-0.24} top="42%" right="6%" zIndex={31} className="animate-arcade-wiggle">
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="0" width="2" height="4" fill="#F97316" />
          <rect x="8" y="2" width="2" height="2" fill="#F97316" />
          <rect x="12" y="1" width="2" height="2" fill="#FBBF24" />
          <circle cx="11" cy="16" r="8" fill="#1C1917" />
          <circle cx="11" cy="16" r="6" fill="#292524" />
          <rect x="8" y="12" width="3" height="3" fill="#57534E" opacity="0.4" />
        </svg>
      </ParallaxSprite>

      {/* 29. Pixel Arrow (pointing right, green) - Event area */}
      <ParallaxSprite speed={-0.13} top="46%" left="4%" zIndex={31} className="animate-arcade-drift">
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="5" width="18" height="4" fill="#10B981" />
          <path d="M18 0h2v2h-2V0zm2 2h2v2h-2V2zm2 2h2v2h-2V4zm2 2h2v2h-2V6zm-2 2h2v2h-2V8zm-2 2h2v2h-2v-2zm-2 2h2v2h-2v-2z" fill="#10B981" />
          <rect x="0" y="6" width="18" height="1" fill="#34D399" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 30. Pixel Star (Power-Up, Multicolor) - Story section */}
      <ParallaxSprite speed={-0.19} top="50%" right="16%" zIndex={31} className="animate-arcade-float-spin">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0h4v4h-4V0zm-6 8h4v4H4V8zm12 0h4v4h-4V8zm-6 12h4v4h-4v-4zM6 4h4v4H6V4zm8 0h4v4h-4V4zM6 16h4v4H6v-4zm8 0h4v4h-4v-4z" fill="#EAB308" />
          <rect x="10" y="4" width="4" height="4" fill="#FACC15" />
          <rect x="6" y="8" width="4" height="4" fill="#FACC15" />
          <rect x="14" y="8" width="4" height="4" fill="#FACC15" />
          <rect x="10" y="12" width="4" height="4" fill="#FACC15" />
          <rect x="10" y="8" width="4" height="4" fill="#FEF08A" />
          <rect x="11" y="9" width="2" height="2" fill="#fff" opacity="0.4" />
        </svg>
      </ParallaxSprite>

      {/* 31. Pixel Fire Flower (Orange/Red) - Story section left */}
      <ParallaxSprite speed={-0.17} top="56%" left="15%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="6" r="4" fill="#F97316" />
          <circle cx="6" cy="8" r="3" fill="#EF4444" />
          <circle cx="14" cy="8" r="3" fill="#EF4444" />
          <circle cx="10" cy="10" r="3" fill="#FBBF24" />
          <rect x="9" y="12" width="2" height="6" fill="#16A34A" />
          <rect x="5" y="14" width="4" height="2" fill="#16A34A" />
          <rect x="11" y="16" width="4" height="2" fill="#16A34A" />
          <circle cx="10" cy="7" r="1.5" fill="#FEF08A" />
        </svg>
      </ParallaxSprite>

      {/* 32. Retro Joystick - Gallery section right */}
      <ParallaxSprite speed={-0.08} top="62%" right="4%" zIndex={31} className="animate-arcade-drift-rev">
        <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="4" r="4" fill="#EF4444" />
          <circle cx="10" cy="3" r="1.5" fill="#FCA5A5" opacity="0.5" />
          <rect x="9" y="8" width="2" height="10" fill="#71717A" />
          <rect x="4" y="18" width="12" height="4" fill="#3F3F46" />
          <rect x="2" y="22" width="16" height="4" fill="#27272A" />
        </svg>
      </ParallaxSprite>

      {/* 33. Pac-Man Dots Trail (vertical) - Gallery section left */}
      <ParallaxSprite speed={-0.26} top="66%" left="3%" zIndex={31} className="animate-arcade-blink">
        <svg width="8" height="48" viewBox="0 0 8 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="4" height="4" fill="#FDE68A" />
          <rect x="2" y="12" width="4" height="4" fill="#FDE68A" />
          <rect x="2" y="22" width="4" height="4" fill="#FDE68A" />
          <rect x="2" y="32" width="4" height="4" fill="#FDE68A" />
          <rect x="2" y="42" width="4" height="4" fill="#FDE68A" />
        </svg>
      </ParallaxSprite>

      {/* 34. Pixel Trophy (Gold) - Gallery section */}
      <ParallaxSprite speed={-0.21} top="68%" right="18%" zIndex={31} className="animate-arcade-bob">
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="0" width="12" height="2" fill="#EAB308" />
          <rect x="2" y="2" width="16" height="10" fill="#EAB308" />
          <rect x="0" y="4" width="2" height="6" fill="#EAB308" />
          <rect x="18" y="4" width="2" height="6" fill="#EAB308" />
          <rect x="8" y="12" width="4" height="4" fill="#EAB308" />
          <rect x="4" y="16" width="12" height="2" fill="#EAB308" />
          <rect x="6" y="18" width="8" height="4" fill="#A16207" />
          <rect x="4" y="22" width="12" height="2" fill="#78350F" />
          <rect x="4" y="2" width="4" height="4" fill="#FEF08A" opacity="0.4" />
        </svg>
      </ParallaxSprite>

      {/* 35. Pixel Music Note (Pink) - Gift transition */}
      <ParallaxSprite speed={-0.13} top="72%" right="6%" zIndex={31} className="animate-arcade-drift">
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="0" width="4" height="2" fill="#EC4899" />
          <rect x="14" y="2" width="2" height="14" fill="#EC4899" />
          <circle cx="10" cy="18" r="4" fill="#EC4899" />
          <circle cx="10" cy="17" r="2" fill="#F9A8D4" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 36. Pixel Double Music Notes - Gift section left */}
      <ParallaxSprite speed={-0.19} top="76%" left="14%" zIndex={31} className="animate-arcade-wiggle">
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="0" width="18" height="2" fill="#A855F7" />
          <rect x="6" y="2" width="2" height="14" fill="#A855F7" />
          <rect x="22" y="2" width="2" height="12" fill="#A855F7" />
          <circle cx="4" cy="18" r="4" fill="#A855F7" />
          <circle cx="20" cy="16" r="4" fill="#A855F7" />
        </svg>
      </ParallaxSprite>

      {/* 37. Pixel Exclamation Block (? Block) - Wishes area */}
      <ParallaxSprite speed={-0.23} top="82%" left="16%" zIndex={31} className="animate-arcade-bob">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="22" height="22" fill="#EAB308" stroke="#A16207" strokeWidth="2" />
          <rect x="2" y="2" width="18" height="18" fill="#FACC15" />
          <rect x="8" y="4" width="6" height="2" fill="#78350F" />
          <rect x="12" y="6" width="2" height="4" fill="#78350F" />
          <rect x="9" y="8" width="4" height="2" fill="#78350F" />
          <rect x="9" y="12" width="4" height="4" fill="#78350F" />
          <rect x="2" y="2" width="4" height="2" fill="#FEF08A" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 38. Pixel Rocket (shooting up) - Wishes section right */}
      <ParallaxSprite speed={-0.27} top="85%" right="8%" zIndex={31} className="animate-arcade-drift-rev">
        <svg width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 0h4v2H5V0zm-2 2h8v4H3V2z" fill="#E5E7EB" />
          <rect x="2" y="6" width="10" height="12" fill="#3B82F6" />
          <rect x="4" y="8" width="2" height="2" fill="#93C5FD" />
          <rect x="0" y="14" width="4" height="6" fill="#EF4444" />
          <rect x="10" y="14" width="4" height="6" fill="#EF4444" />
          <rect x="4" y="18" width="6" height="4" fill="#EF4444" />
          <rect x="5" y="22" width="4" height="2" fill="#F97316" />
          <rect x="6" y="24" width="2" height="2" fill="#FBBF24" />
          <rect x="6" y="26" width="2" height="2" fill="#FDE68A" opacity="0.6" />
        </svg>
      </ParallaxSprite>

      {/* 39. Pixel Gem/Ruby (Red) - Gratitude left */}
      <ParallaxSprite speed={-0.1} top="88%" left="12%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h10v2H4V0zM2 2h4v4H2V2zm10 0h4v4h-4V2zm-8 4h4v4H4V6zm6 0h4v4h-4V6zm-4 4h4v4H6v-4zm-2 0h2v2H4v-2zm8 0h2v2h-2v-2zm-4 4h2v2H8v-2z" fill="#EF4444" />
          <rect x="4" y="2" width="4" height="4" fill="#FCA5A5" opacity="0.4" />
        </svg>
      </ParallaxSprite>

      {/* 40. Pixel Emerald (Green) - Gratitude right */}
      <ParallaxSprite speed={-0.16} top="90%" right="16%" zIndex={31} className="animate-arcade-twinkle" >
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h10v2H4V0zM2 2h4v4H2V2zm10 0h4v4h-4V2zm-8 4h4v4H4V6zm6 0h4v4h-4V6zm-4 4h4v4H6v-4zm-2 0h2v2H4v-2zm8 0h2v2h-2v-2zm-4 4h2v2H8v-2z" fill="#10B981" />
          <rect x="4" y="2" width="4" height="4" fill="#6EE7B7" opacity="0.4" />
        </svg>
      </ParallaxSprite>

      {/* 41. Pixel Warp Pipe (Green) - Footer area left */}
      <ParallaxSprite speed={-0.12} top="94%" left="4%" zIndex={31} className="animate-arcade-drift">
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="24" height="6" fill="#16A34A" />
          <rect x="2" y="6" width="20" height="14" fill="#15803D" />
          <rect x="0" y="0" width="24" height="2" fill="#22C55E" />
          <rect x="2" y="2" width="4" height="4" fill="#22C55E" opacity="0.3" />
        </svg>
      </ParallaxSprite>

      {/* 42. GAME OVER flashing text - Footer */}
      <ParallaxSprite speed={-0.14} top="98%" right="5%" zIndex={31} className="animate-arcade-blink border-2 border-black bg-black px-2 py-0.5 rounded shadow-[2px_2px_0_0_black]">
        <span className="font-mono text-[9px] font-black tracking-widest text-red-500">
          GAME OVER
        </span>
      </ParallaxSprite>

      {/* 43. Pixel Sapphire (Blue) - Between title and quote */}
      <ParallaxSprite speed={-0.25} top="20%" left="20%" zIndex={31} className="animate-arcade-float-spin">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h6v2H4V0zM2 2h2v4H2V2zm8 0h2v4h-2V2zM4 6h6v2H4V6zm-2 0h2v2H2V6zm8 0h2v2h-2V6zm-4 2h2v2H6V8zm-2 0h2v2H4V8zm4 0h2v2h-2V8zm-2 2h2v2H6v-2z" fill="#3B82F6" />
          <rect x="4" y="2" width="2" height="2" fill="#93C5FD" opacity="0.5" />
        </svg>
      </ParallaxSprite>

      {/* 44. Extra twinkling stars scattered - mid page */}
      <ParallaxSprite speed={-0.08} top="40%" left="20%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#EAB308" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 0h2v3H5V0zm0 9h2v3H5V9zM0 5h3v2H0V5zm9 0h3v2H9V5z" />
        </svg>
      </ParallaxSprite>

      {/* 45. Extra twinkling star - lower mid */}
      <ParallaxSprite speed={-0.22} top="63%" left="22%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="var(--invitation-accent-2)" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 0h2v3H5V0zm0 9h2v3H5V9zM0 5h3v2H0V5zm9 0h3v2H9V5z" />
        </svg>
      </ParallaxSprite>

      {/* 46. Extra pixel cross star right - upper mid */}
      <ParallaxSprite speed={-0.14} top="44%" right="18%" zIndex={31} className="animate-arcade-blink">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#EC4899" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 0h2v3H5V0zm0 9h2v3H5V9zM0 5h3v2H0V5zm9 0h3v2H9V5z" />
        </svg>
      </ParallaxSprite>

      {/* 47. Pixel HP Potion (Green) - mid section */}
      <ParallaxSprite speed={-0.2} top="48%" left="18%" zIndex={31} className="animate-arcade-bob">
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="0" width="6" height="3" fill="#A1A1AA" />
          <rect x="3" y="3" width="8" height="2" fill="#71717A" />
          <rect x="1" y="5" width="12" height="12" fill="#16A34A" />
          <rect x="3" y="7" width="8" height="8" fill="#22C55E" />
          <rect x="1" y="17" width="12" height="3" fill="#15803D" />
          <path d="M5 9h4v2H5V9zm1-2h2v6H6V7z" fill="#fff" opacity="0.6" />
        </svg>
      </ParallaxSprite>

      {/* 48. Second Pac-Man Ghost (Cyan/Inky) - lower right */}
      <ParallaxSprite speed={-0.16} top="84%" right="18%" zIndex={31} className="animate-arcade-drift">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2h12v2H6V2zm-4 4h20v14H2V6zm2 14h2v2H4v-2zm4 0h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-16-2h16v2H6v-2z" fill="#06B6D4" />
          <rect x="6" y="8" width="4" height="4" fill="#fff" />
          <rect x="14" y="8" width="4" height="4" fill="#fff" />
          <rect x="8" y="10" width="2" height="2" fill="#2563EB" />
          <rect x="16" y="10" width="2" height="2" fill="#2563EB" />
        </svg>
      </ParallaxSprite>

      {/* 49. Pixel XP Orb (Blue glow) - between sections */}
      <ParallaxSprite speed={-0.29} top="36%" left="3%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="5" fill="#3B82F6" />
          <circle cx="7" cy="7" r="3" fill="#60A5FA" />
          <circle cx="6" cy="5" r="1.5" fill="#BFDBFE" opacity="0.6" />
        </svg>
      </ParallaxSprite>

      {/* 50. Pixel XP Orb (Green glow) - lower */}
      <ParallaxSprite speed={-0.11} top="70%" left="6%" zIndex={31} className="animate-arcade-twinkle">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="5" fill="#10B981" />
          <circle cx="7" cy="7" r="3" fill="#34D399" />
          <circle cx="6" cy="5" r="1.5" fill="#A7F3D0" opacity="0.6" />
        </svg>
      </ParallaxSprite>
    </div>
  );
}
