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
      message: `Selamat ulang tahun ${demoName}! Semoga jadi anak yang makin keren dan berprestasi! &#127775;`,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      name: "Bella",
      message: `Happy birthday ya ${demoName}! Makin pintar, makin sayang keluarga. Have a blast! &#127881;`,
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      name: "Citra",
      message: `${demoName}, selamat ulang tahun! Semoga semua cita-citanya tercapai. Amin! &#10024;`,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.9, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
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

function WishesContent({ invitationId, heading, placeholder, thankYouMessage }: WishesProps) {
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

  return (
    <motion.section
      className="relative overflow-hidden px-5 py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `url(${assets.stars})`,
          backgroundSize: "cover",
        }}
      />

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

      <div className="relative z-10 mx-auto max-w-sm">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
          variants={itemVariants}
        >
          &#128172; {heading}
        </motion.div>

        {!nameKey && !isDemo ? (
          <motion.p
            className="font-garet-book text-[13px] leading-relaxed text-white/40 text-center"
            variants={itemVariants}
          >
            Untuk menulis ucapan, buka undangan ini dari link pribadi yang sudah dikirimkan.
          </motion.p>
        ) : submitted && !isDemo ? (
          <motion.div
            className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 text-center"
            variants={itemVariants}
            style={{ boxShadow: "0 0 20px var(--invitation-accent-2)" }}
          >
            <p className="font-great-vibes text-[28px] text-white">Terima Kasih!</p>
            <p className="mt-2 font-garet-book text-[13px] text-white/60">{thankYouMessage}</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6"
              variants={itemVariants}
              style={{ boxShadow: "0 0 20px var(--invitation-accent-2)" }}
            >
              {nameKey || demoName ? (
                <p className="mb-4 font-garet-book text-[14px] font-bold text-white/70">
                  Hai, {nameKey ?? demoName}!
                </p>
              ) : null}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-garet-book text-[13px] text-white/80 placeholder-white/25 resize-none outline-none focus:border-white/25"
              />
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={!message.trim() || submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 w-full rounded-full py-3 font-garet-book text-[13px] font-bold uppercase tracking-[0.15em] text-white disabled:opacity-40"
                style={{
                  background: `linear-gradient(135deg, var(--invitation-accent), var(--invitation-accent-2))`,
                  boxShadow: "0 4px 16px var(--invitation-accent-2)",
                }}
              >
                {submitting ? "Mengirim..." : "Kirim Ucapan"}
              </motion.button>
            </motion.div>

            {wishes.length > 0 ? (
              <div className="mt-8 flex flex-col gap-4">
                {wishes.map((wish, i) => (
                  <motion.div
                    key={i}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5"
                    variants={itemVariants}
                    animate={{ rotate: [i % 2 === 0 ? -0.3 : 0.3, i % 2 === 0 ? 0.3 : -0.3, i % 2 === 0 ? -0.3 : 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    style={{ boxShadow: "0 0 10px var(--invitation-accent-2)" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full font-garet-book text-[11px] font-bold text-white"
                        style={{ background: "var(--invitation-accent)" }}
                      >
                        {wish.name[0]}
                      </div>
                      <div>
                        <p className="font-garet-book text-[13px] font-bold text-white/80">
                          {wish.name}
                        </p>
                        <p className="font-garet-book text-[10px] text-white/30">
                          {getRelativeTime(wish.timestamp)}
                        </p>
                      </div>
                    </div>
                    <p className="font-garet-book text-[13px] leading-relaxed text-white/60">
                      {wish.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </motion.section>
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
