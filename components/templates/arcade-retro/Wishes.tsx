"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOverlayAssets } from "./overlays";

interface WishesProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
  isReady?: boolean;
}

type Wish = {
  name: string;
  message: string;
  timestamp: string;
};

const guessDemoName = (invitationId: string): string | null => {
  if (!invitationId.endsWith("-demo")) return null;
  const hash = invitationId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const names = ["Bintang", "Cahaya", "Pelangi", "Mentari", "Gemilang"];
  return names[hash % names.length] ?? null;
};

const generateDemoWishes = (invitationId: string): Wish[] => {
  const demoName = guessDemoName(invitationId);
  if (!demoName) return [];
  return [
    {
      name: "Andra",
      message: `HBD ya ${demoName}! Semoga naik level terus dan menang banyak piala! MANTAP!`,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      name: "Bella",
      message: `Happy birthday ${demoName}! Makin jago mainnya, makin pintar di sekolah. Have fun!`,
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      name: "Citra",
      message: `${demoName}, selamat ulang tahun! Semoga semua quest tercapai! Seru-seruan bareng!`,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
};

// Calculate a fun retro game score based on wish attributes
function getWishScore(name: string, message: string): string {
  const lengthScore = message.length * 750;
  const charHash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) * 1500;
  const total = (lengthScore + charHash) % 99990;
  // Make sure it looks like a retro game score
  const finalScore = Math.max(10000, Math.floor(total / 100) * 100);
  return finalScore.toLocaleString("en-US") + " PTS";
}

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
} as const;

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: revealEase } 
  },
} as const;

const popVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, type: "spring", bounce: 0.4 },
  },
} as const;

function getRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "BARU SAJA";
  if (diffMin < 60) return `${diffMin}M LALU`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}J LALU`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "KEMARIN";
  return `${diffDay}D LALU`;
}

function WishesContent({ invitationId, heading, placeholder, thankYouMessage, isReady }: WishesProps) {
  const [wishes, setWishes] = useState<Wish[]>(() => {
    if (invitationId.endsWith("-demo")) return generateDemoWishes(invitationId);
    return [];
  });

  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const nameKey = searchParams.get("to") ?? null;
  const demoName = guessDemoName(invitationId);
  const isDemo = invitationId.endsWith("-demo");
  const assets = useOverlayAssets();

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || submitting) return;
    setSubmitting(true);

    if (isDemo) {
      setWishes((prev) => [
        {
          name: demoName ?? "Guest",
          message: message.trim(),
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      setMessage("");
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, message: message.trim(), nameKey }),
      });
      setMessage("");
      setSubmitted(true);
    } catch {
    }
    setSubmitting(false);
  }, [message, submitting, invitationId, nameKey, isDemo, demoName]);

  if (!isReady) return null;

  const displayHeading = heading || "HIGH SCORE BOARD";

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      {/* Background vectors */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />
        <motion.div
          className="absolute left-6 top-16"
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet1} alt="" className="w-14 h-auto opacity-25" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[500px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-wedding-dark rounded-[24px] border-[5px] border-black p-6 shadow-[0_10px_0_0_black,0_15px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 40%, var(--invitation-dark) 100%)`,
          }}
        >
          {/* Header */}
          <motion.div variants={rowVariants} className="text-center mb-6">
            <h3 className="font-mono font-black text-[22px] text-white uppercase tracking-widest [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)] animate-pulse">
              {displayHeading}
            </h3>
          </motion.div>

          {/* Submission Panel */}
          {!nameKey && !isDemo ? (
            <motion.div variants={rowVariants} className="bg-black/50 border-[3px] border-black p-5 rounded-[16px] text-center font-mono text-[11px] leading-relaxed text-white/80 uppercase tracking-widest my-4">
              🚨 UNLOCK SUBMISSION Quest: BUKA LINK DARI PESAN YANG DIKIRIMKAN UNTUK MENULIS UCAPAN.
            </motion.div>
          ) : submitted && !isDemo ? (
            <motion.div
              variants={rowVariants}
              className="bg-black/50 border-[3px] border-black p-6 rounded-[16px] text-center my-4"
            >
              <motion.div variants={popVariants}>
                <h4 className="font-mono font-black text-[24px] text-lime-400 uppercase tracking-widest [text-shadow:1.5px_1.5px_0_#000] mb-2 animate-bounce">
                  QUEST COMPLETE!
                </h4>
                <p className="font-mono text-[10px] text-white/80 leading-relaxed uppercase tracking-wider bg-black/40 p-3 border border-white/10 rounded">
                  {thankYouMessage}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={rowVariants} className="bg-black/50 border-[3px] border-black p-5 rounded-[16px] my-4 space-y-4">
              <div className="font-mono text-[9px] text-wedding-accent-2/80 tracking-widest uppercase border-b border-white/10 pb-1 font-bold">
                CHARACTER SELECT & SUBMISSION
              </div>

              {(nameKey || demoName) && (
                <div className="font-mono text-[12px] font-black text-white uppercase tracking-widest bg-wedding-accent px-3 py-1 rounded-[4px] border border-black inline-block shadow-[2px_2px_0_0_black]">
                  👤 {nameKey ?? demoName}
                </div>
              )}

              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={placeholder || "Tuliskan ucapan ulang tahun terbaikmu..."}
                  rows={3}
                  className="w-full rounded-[8px] border-[3px] border-black bg-white/95 px-4 py-3 font-mono font-bold text-[12px] text-black placeholder-black/45 resize-none outline-none focus:bg-white shadow-[inset_2px_2px_0_0_black] transition-all"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  onClick={handleSubmit}
                  disabled={!message.trim() || submitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 border-[2px] border-black text-black px-4 py-2 rounded-[6px] font-mono font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0_0_black] hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "UPLOADING..." : "SUBMIT HIGHSCORE"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Wishes List (Leaderboard) */}
          <motion.div variants={rowVariants} className="mt-8 space-y-3 bg-black/60 border-[3px] border-black p-4 rounded-[16px]">
            <div className="grid grid-cols-12 gap-1 font-mono text-[9px] text-wedding-accent-2/80 tracking-widest uppercase font-black pb-2 border-b border-white/10">
              <div className="col-span-2">RANK</div>
              <div className="col-span-3">PLAYER</div>
              <div className="col-span-5">MESSAGE</div>
              <div className="col-span-2 text-right">SCORE</div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {wishes.map((wish, idx) => {
                const rankLabels = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH"];
                const displayRank = rankLabels[idx] || `${idx + 1}TH`;
                const rankColor = idx === 0 ? "text-yellow-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-500" : "text-white/60";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="grid grid-cols-12 gap-1 items-start font-mono text-[10px] text-white py-1.5 border-b border-white/5 last:border-none"
                  >
                    {/* Rank */}
                    <div className={`col-span-2 font-black tracking-tighter ${rankColor}`}>
                      {displayRank}
                    </div>

                    {/* Player */}
                    <div className="col-span-3 font-bold truncate text-wedding-accent-2 pr-1 uppercase">
                      {wish.name}
                    </div>

                    {/* Message */}
                    <div className="col-span-5 text-white/80 pr-1 break-words">
                      &quot;{wish.message}&quot;
                    </div>

                    {/* Score */}
                    <div className="col-span-2 text-right font-bold text-lime-400 tracking-tighter">
                      {getWishScore(wish.name, wish.message)}
                    </div>
                  </motion.div>
                );
              })}

              {wishes.length === 0 && (
                <div className="text-center font-mono text-[10px] text-white/40 py-6 uppercase tracking-wider">
                  no scores submitted yet
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function Wishes(props: WishesProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-mono text-white/30 italic uppercase tracking-wider animate-pulse">
          loading leaderboard...
        </div>
      }
    >
      <WishesContent {...props} />
    </Suspense>
  );
}
