"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { normalizeInvitationGuestName } from "@/lib/utils";
import { formatRelativeToNow } from "@/lib/date-time";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Divider, Flourish } from "./graphics";
import { Reveal } from "./graphics/reveal";
import { Vine } from "@/components/assets/vine";

interface Wish {
  id: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: Timestamp;
  invitationId: string;
}

interface WishApiWish {
  id: string;
  invitationId: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: number | null;
}

interface WishesSectionProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
}

export function WishesSection({
  invitationId,
  heading,
  placeholder,
  thankYouMessage,
}: WishesSectionProps) {
  const searchParams = useSearchParams();
  const inviteeName = normalizeInvitationGuestName(searchParams.get("to"));

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [error, setError] = useState("");
  const [existingWish, setExistingWish] = useState<Wish | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const wishesListRef = useRef<HTMLDivElement | null>(null);

  const isDemo = useMemo(() => invitationId.endsWith("-demo"), [invitationId]);
  const effectiveInviteeName = inviteeName ?? (isDemo ? "Demo Guest" : null);

  const isWishesListInView = useInView(wishesListRef, {
    once: true,
    margin: "-10%",
    amount: 0.1,
  });

  const normalizeNameKey = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const toClientWish = (wish: WishApiWish): Wish => {
    const createdAt =
      typeof wish.createdAt === "number"
        ? Timestamp.fromMillis(wish.createdAt)
        : Timestamp.now();
    return {
      id: wish.id,
      invitationId: wish.invitationId,
      name: wish.name,
      nameKey: wish.nameKey,
      message: wish.message,
      createdAt,
    };
  };

  const inviteeNameKey = useMemo(() => {
    if (!inviteeName) return null;
    return normalizeNameKey(inviteeName);
  }, [inviteeName]);

  const demoSeedWishes = useMemo(() => {
    if (!isDemo) return [] as Wish[];
    const now = Date.now();
    return [
      {
        id: `demo_${invitationId}_1`,
        invitationId,
        name: "Raka Mahendra",
        message:
          "Selamat menempuh hidup baru untuk kedua mempelai! Semoga ikatan suci ini senantiasa dipenuhi cinta, kesabaran, serta kebahagiaan yang melimpah hingga akhir hayat.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 18),
      },
      {
        id: `demo_${invitationId}_2`,
        invitationId,
        name: "Nadya Aurelia",
        message:
          "Happy wedding! Sangat bahagia melihat perjalanan cinta kalian sampai ke titik ini. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
      },
      {
        id: `demo_${invitationId}_3`,
        invitationId,
        name: "Dimas Pratama",
        message:
          "Selamat berbahagia! Semoga dilancarkan rezekinya, dimudahkan segala urusannya dalam menempuh lembaran baru, dan selalu harmonis selamanya.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 9),
      },
      {
        id: `demo_${invitationId}_4`,
        invitationId,
        name: "Alya Safira",
        message:
          "Congrats guys! Semoga cinta kalian terus bertumbuh setiap harinya, saling melengkapi di kala suka maupun duka. Amin!",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 26),
      },
      {
        id: `demo_${invitationId}_5`,
        invitationId,
        name: "Bima Satria",
        message:
          "Selamat menempuh kehidupan pernikahan. Doa terbaik dari kami sekeluarga, semoga samawa dan cepat dititipkan buah hati yang soleh dan solehah.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 54),
      },
    ];
  }, [invitationId, isDemo]);

  useEffect(() => {
    if (!invitationId) return;

    if (isDemo) {
      setWishes(demoSeedWishes);
      return;
    }
    const controller = new AbortController();

    const fetchWishes = async () => {
      try {
        const res = await fetch(
          `/api/wishes?invitationId=${encodeURIComponent(invitationId)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("failed");
        const json = (await res.json()) as { wishes?: WishApiWish[] };
        const next = (json.wishes ?? []).map(toClientWish);

        const seen = new Set<string>();
        const deduped: Wish[] = [];
        for (const w of next) {
          const key = w.nameKey || normalizeNameKey(w.name || "");
          if (!key) {
            deduped.push(w);
            continue;
          }
          if (seen.has(key)) continue;
          seen.add(key);
          deduped.push(w);
        }

        setWishes(deduped);
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
      }
    };

    void fetchWishes();
    const interval = window.setInterval(fetchWishes, 8000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [demoSeedWishes, invitationId, isDemo]);

  useEffect(() => {
    const checkExisting = async () => {
      if (isDemo) return;
      if (!inviteeName || !invitationId) return;

      if (inviteeNameKey) {
        try {
          const res = await fetch(
            `/api/wishes?invitationId=${encodeURIComponent(invitationId)}&nameKey=${encodeURIComponent(inviteeNameKey)}`,
          );
          if (res.ok) {
            const json = (await res.json()) as { wish: WishApiWish | null };
            if (json.wish) {
              const wish = toClientWish(json.wish);
              setExistingWish(wish);
              setHasPosted(true);
              return;
            }
          }
        } catch {
          // ignore
        }
      }
    };
    checkExisting();
  }, [invitationId, inviteeName, inviteeNameKey, isDemo]);

  useEffect(() => {
    setVisibleCount(10);
  }, [invitationId]);

  const visibleWishes = useMemo(() => {
    return wishes.slice(0, visibleCount);
  }, [visibleCount, wishes]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= wishes.length) return prev;
          return Math.min(wishes.length, prev + 10);
        });
      },
      { root: null, rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [wishes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDemo) {
      setIsSubmitting(true);
      setError("");
      try {
        const next: Wish = {
          id: `demo_post_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          invitationId,
          name: effectiveInviteeName ?? "Demo Guest",
          message: message.trim(),
          createdAt: Timestamp.now(),
        };
        setWishes((prev) => [next, ...prev]);
        setMessage("");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!inviteeName || !inviteeNameKey) {
      setError(
        "This feature is only available for invited guests via their personal link.",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextData: Omit<Wish, "id"> = {
        invitationId,
        name: inviteeName,
        nameKey: inviteeNameKey,
        message: message.trim(),
        createdAt: Timestamp.now(),
      };

      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          invitationId,
          name: inviteeName,
          nameKey: inviteeNameKey,
          message: message.trim(),
        }),
      });

      if (res.status === 409) {
        const json = (await res.json()) as { wish?: WishApiWish | null };
        if (json.wish) setExistingWish(toClientWish(json.wish));
        setHasPosted(true);
        setError("You have already sent your wishes. Thank you!");
        return;
      }

      if (!res.ok) {
        throw new Error("failed");
      }

      const json = (await res.json()) as { wish?: WishApiWish | null };

      setMessage("");
      if (json.wish) {
        setExistingWish(toClientWish(json.wish));
      } else {
        setExistingWish({ id: `local_${Date.now()}`, ...nextData });
      }
      setHasPosted(true);
    } catch (err) {
      console.error("Error adding wish:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrap id="wishes">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-0 overflow-hidden">
          <Vine className="w-full h-full opacity-45" />
        </div>
        <SectionHead
          eyebrow="Blessed words"
          title="Warm"
          em="wishes"
          sub="Your prayers and beautiful wishes are the greatest gifts for our journey ahead."
        />
      </div>

      <Reveal delay={0.1}>
        <div
          className="rounded-2xl p-6.5 relative overflow-hidden mb-9.5"
          style={{
            background: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Corner highlights */}
          <span className="absolute -top-px -left-px w-3.5 h-3.5 border-l border-t border-[var(--invitation-accent)] opacity-60" />
          <span className="absolute -bottom-px -right-px w-3.5 h-3.5 border-r border-b border-[var(--invitation-accent)] opacity-60" />

          {!effectiveInviteeName ? (
            <div className="text-center font-[var(--font-royal-serif)] text-sm text-[var(--invitation-text-light)] py-4">
              To send your warm wishes, please access this invitation via the personalized link provided.
            </div>
          ) : hasPosted && !isDemo ? (
            <div className="text-center py-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--invitation-accent-light)] font-[var(--font-royal-sans)]">
                From {effectiveInviteeName}
              </p>
              <h3 className="mt-3.5 font-[var(--font-royal-serif)] font-light text-2xl text-[var(--invitation-text)]">
                Thank You
              </h3>
              <p className="mt-2.5 font-[var(--font-royal-serif)] italic text-sm text-[var(--invitation-text-light)]">
                {thankYouMessage || "Your message has been received with love."}
              </p>
              {existingWish?.message ? (
                <div
                  className="mt-5 p-4 rounded-lg text-sm text-[var(--invitation-text-light)] whitespace-pre-line text-left leading-relaxed font-[var(--font-royal-serif)]"
                  style={{ background: "rgba(0, 0, 0, 0.15)" }}
                >
                  "{existingWish.message}"
                </div>
              ) : null}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--invitation-accent)] font-[var(--font-royal-sans)]">
                  Sending as
                </p>
                <p className="mt-1 text-sm font-[var(--font-royal-serif)] text-[var(--invitation-text)] font-light">
                  {effectiveInviteeName}
                </p>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[110px] rounded-lg px-4 py-3 text-sm outline-none resize-none transition-colors duration-300 text-[var(--invitation-text)] placeholder:text-[var(--invitation-text-light)]/40 font-[var(--font-royal-serif)] leading-relaxed"
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
                }}
                placeholder={placeholder || "Write your warm wishes here..."}
                disabled={isSubmitting}
              />

              {error ? (
                <p className="text-red-400/90 text-xs text-center font-[var(--font-royal-sans)]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 border border-[var(--invitation-accent)] text-[var(--invitation-accent)] font-[var(--font-royal-sans)] text-[10px] tracking-[0.28em] uppercase cursor-pointer relative overflow-hidden transition-colors duration-300 hover:text-[var(--invitation-bg)] group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-[var(--invitation-accent)] translate-y-[101%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-[1]">
                  {isSubmitting ? "Sending..." : "Send Wishes"}
                </span>
              </button>
            </form>
          )}
        </div>
      </Reveal>

      {/* Wishes Feed list */}
      <div ref={wishesListRef} className="space-y-4">
        {wishes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isWishesListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl p-6.5 text-center relative"
            style={{
              background: "rgba(0,0,0,0.15)",
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 12%, transparent)",
            }}
          >
            <p className="text-sm text-[var(--invitation-text-light)] italic font-[var(--font-royal-serif)]">
              Be the first to share your beautiful words.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {visibleWishes.map((wish, idx) => {
              const delay = Math.min(0.08 + idx * 0.08, 1.2);
              return (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isWishesListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.65,
                    delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  layout
                  className="rounded-xl p-5 relative overflow-hidden"
                  style={{
                    background: "rgba(0, 0, 0, 0.22)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid color-mix(in srgb, var(--invitation-accent) 15%, transparent)",
                  }}
                >
                  <span className="absolute -top-px -left-px w-2.5 h-2.5 border-l border-t border-[var(--invitation-accent)] opacity-40" />
                  <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-r border-b border-[var(--invitation-accent)] opacity-40" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--invitation-accent)] font-[var(--font-royal-sans)]">
                        {wish.name}
                      </p>
                      <p className="mt-1 text-[8.5px] uppercase tracking-[0.16em] font-[var(--font-royal-sans)] text-[var(--invitation-text-light)]/45">
                        {wish.createdAt
                          ? formatRelativeToNow(wish.createdAt) || "Just now"
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3.5 text-sm text-[var(--invitation-text-light)] whitespace-pre-line font-[var(--font-royal-serif)] leading-relaxed text-left">
                    {wish.message}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        <div ref={loadMoreRef} className="h-px" />
      </div>

      <div className="flex justify-center mt-9.5">
        <Flourish width={220} />
      </div>
    </SectionWrap>
  );
}
