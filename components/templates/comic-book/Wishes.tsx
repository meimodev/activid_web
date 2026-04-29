"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useOverlayAssets } from "./overlays";

interface WishesProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
  isReady?: boolean;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
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
      message: `Selamat ulang tahun ${demoName}! Semoga jadi anak yang makin keren dan berprestasi!`,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      name: "Bella",
      message: `Happy birthday ya ${demoName}! Makin pintar, makin sayang keluarga. Have a blast!`,
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      name: "Citra",
      message: `${demoName}, selamat ulang tahun! Semoga semua cita-citanya tercapai. Amin!`,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
};

const rowVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: "spring", stiffness: 80, damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.15
    } 
  }
} as const;

const popVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
} as const;

function getRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Kemarin";
  return `${diffDay} hari lalu`;
}

const panelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 80,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
} as const;

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

  return (
    <section className="relative overflow-hidden bg-wedding-bg px-0 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
        <motion.div
          className="absolute right-4 top-10"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.heroGraphic} alt="" className="w-16 h-auto opacity-35" />
        </motion.div>
        <motion.div
          className="absolute left-4 bottom-16"
          animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <img src={assets.moonOrbiter} alt="" className="w-12 h-auto opacity-35" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-[110%] -ml-[5%] bg-black p-[5px] grid grid-cols-2 gap-[5px] z-10 rotate-1 shadow-[8px_8px_0_0_black]"
        >
          {/* Asymmetrical Top Border */}
          <svg className="absolute top-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,0 100,12 0,12" fill="black" />
          </svg>
          {/* Asymmetrical Bottom Border */}
          <svg className="absolute bottom-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
            <polygon points="0,12 100,0 100,12" fill="black" />
          </svg>

          {/* Header Panel */}
          <motion.div variants={panelVariants} className="col-span-2 bg-wedding-accent flex justify-center items-center py-10 relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px]">
            <motion.div variants={popVariants} className="relative z-20">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 pointer-events-none" style={{ clipPath: "polygon(2% 8%, 98% 2%, 95% 95%, 5% 98%)" }} />
              <div className="relative bg-white px-8 py-4 flex items-center justify-center border-4 border-black" style={{ clipPath: "polygon(2% 8%, 98% 2%, 95% 95%, 5% 98%)" }}>
                <h2 className="font-black text-[32px] leading-none tracking-tight text-black uppercase rotate-[-1deg]">
                  {heading}
                </h2>
              </div>
            </motion.div>
          </motion.div>

          {!nameKey && !isDemo ? (
            <motion.div variants={panelVariants} className="col-span-2 bg-white px-8 py-10 relative overflow-hidden flex flex-col items-center text-center">
               <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "120px" }} />
               <motion.div variants={popVariants} className="relative z-20 w-full">
                <div className="relative rounded-[24px] border-4 border-black bg-white px-8 py-8 shadow-[8px_8px_0_0_black] -rotate-1">
                  <p className="font-garet-book font-black text-[16px] leading-relaxed text-black">
                    Untuk menulis ucapan, buka undangan ini dari link pribadi yang sudah dikirimkan.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : submitted && !isDemo ? (
            <motion.div variants={panelVariants} className="col-span-2 bg-white px-8 py-12 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "120px" }} />
              <motion.div variants={popVariants} className="relative z-20 w-full">
                <motion.div
                  className="relative rounded-[24px] border-4 border-black bg-wedding-accent-2 px-8 py-8 text-center shadow-[8px_8px_0_0_black]"
                  animate={{ rotate: [1, -1, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <p className="font-black text-[36px] text-white uppercase tracking-widest [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,4px_4px_0_var(--invitation-accent)] rotate-[-2deg]">
                    Terima Kasih!
                  </p>
                  <div className="mt-4 border-4 border-black bg-white p-3 rounded-xl shadow-[4px_4px_0_0_black] rotate-1">
                    <p className="font-garet-book text-[16px] font-black text-black">
                      {thankYouMessage}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div variants={panelVariants} className="col-span-2 bg-white px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none z-10" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "150px" }} />
              
              <div className="relative z-20 w-full">
                <motion.div variants={popVariants} className="relative overflow-hidden rounded-[24px] border-4 border-black bg-white px-8 py-8 shadow-[8px_8px_0_0_black] -rotate-1">
                  {nameKey || demoName ? (
                    <p className="mb-4 font-garet-book text-[18px] font-black uppercase text-black drop-shadow-[2px_2px_0_var(--invitation-accent)]">
                      Hai, {nameKey ?? demoName}!
                    </p>
                  ) : null}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full rounded-[16px] border-[3px] border-black shadow-[inset_4px_4px_0_0_black] bg-white px-4 py-3 font-garet-book font-bold text-[16px] text-black placeholder-black/40 resize-none outline-none focus:bg-gray-50 transition-colors rotate-1"
                  />
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!message.trim() || submitting}
                    className="mt-6 w-full rounded-[16px] border-4 border-black bg-wedding-accent-2 px-6 py-4 font-garet-book font-black text-[16px] uppercase tracking-widest text-white shadow-[6px_6px_0_0_black] transition-all disabled:opacity-50 active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] -rotate-1"
                  >
                    {submitting ? "Mengirim..." : "Kirim Ucapan!"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Wishes List as separate grid panels */}
          {wishes.map((wish, i) => {
            const isEven = i % 2 === 0;
            const panelBg = ["bg-wedding-accent-2", "bg-wedding-accent", "bg-white"][i % 3];
            const textColor = panelBg === "bg-white" ? "text-black" : "text-white";
            
            return (
              <motion.div key={i} variants={panelVariants} className={`col-span-2 ${panelBg} px-8 py-10 relative overflow-hidden flex flex-col justify-center`}>
                {/* Halftone & Doodle pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "120px" }} />
                
                <div className="relative z-20 w-full">
                  <motion.div variants={popVariants} className="flex items-center gap-3 mb-6">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-black text-white font-garet-book text-[22px] font-black shadow-[4px_4px_0_0_black] ${isEven ? 'rotate-2 bg-wedding-dark' : '-rotate-2 bg-black'}`}
                    >
                      {wish.name[0]}
                    </div>
                    <div>
                      <p className={`font-garet-book text-[18px] font-black leading-tight ${textColor} ${textColor === 'text-white' ? '[text-shadow:1.5px_1.5px_0_black]' : ''}`}>
                        {wish.name}
                      </p>
                      <p className={`font-garet-book text-[11px] font-bold uppercase tracking-wider mt-1 ${textColor} opacity-90 ${textColor === 'text-white' ? '[text-shadow:1px_1px_0_black]' : ''}`}>
                        {getRelativeTime(wish.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={popVariants} className={`relative font-garet-book text-[15px] font-bold leading-relaxed text-black bg-white border-4 border-black px-8 py-6 rounded-[24px] shadow-[8px_8px_0_0_black] ${isEven ? '-rotate-1' : 'rotate-1'}`}>
                    {/* Speech bubble pointer */}
                    <div className="absolute top-[-12px] left-6 w-5 h-5 bg-white border-l-4 border-t-4 border-black rotate-45 pointer-events-none" />
                    {wish.message}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function Wishes(props: WishesProps) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-garet-book text-white/30 italic">
          Loading wishes...
        </div>
      }
    >
      <WishesContent {...props} />
    </Suspense>
  );
}
