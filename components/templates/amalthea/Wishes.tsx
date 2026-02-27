"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloralDivider, OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";

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

interface WishesProps {
  invitationId: string;
  heading: string;
  placeholder: string;
  thankYouMessage: string;
}

export function Wishes({
  invitationId,
  heading,
  placeholder,
  thankYouMessage,
}: WishesProps) {
  const searchParams = useSearchParams();
  const inviteeName = searchParams.get("to");

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
    amount: 0.12,
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
        name: "Raka",
        message:
          "Selamat menempuh hidup baru. Semoga selalu diberi kebahagiaan dan keberkahan.",
        createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 18)),
      },
      {
        id: `demo_${invitationId}_2`,
        invitationId,
        name: "Nadya",
        message:
          "Happy wedding! Semoga langgeng sampai tua dan saling menguatkan dalam setiap keadaan.",
        createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 2)),
      },
      {
        id: `demo_${invitationId}_3`,
        invitationId,
        name: "Dimas",
        message:
          "Semoga pernikahannya penuh cinta, rezeki lancar, dan rumah tangga sakinah mawaddah warahmah.",
        createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 9)),
      },
      {
        id: `demo_${invitationId}_4`,
        invitationId,
        name: "Alya",
        message:
          "Congrats! Semoga jadi pasangan yang saling melengkapi dan selalu kompak.",
        createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 26)),
      },
      {
        id: `demo_${invitationId}_5`,
        invitationId,
        name: "Bima",
        message:
          "Doa terbaik untuk kalian berdua. Semoga acaranya lancar dan pernikahannya bahagia selalu.",
        createdAt: Timestamp.fromDate(new Date(now - 1000 * 60 * 60 * 54)),
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
    <section className="relative overflow-hidden bg-[#F6FBFF] py-24 text-[#0B1B2A]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <OverlayReveal
          delay={0.08}
          className="absolute -right-4 top-50 h-[220px] w-full rotate-[-20deg] bg-contain bg-right bg-no-repeat z-10"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
        />
        <OverlayReveal
          delay={0.14}
          className="absolute -right-4 top-50 h-[140px] w-full rotate-[5deg] bg-contain bg-right bg-no-repeat z-10"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})` }}
        />
        <OverlayReveal
          delay={0.21}
          className="absolute left-2 top-15 h-[220px] w-30 scale-x-[-1]  bg-contain bg-no-repeat translate-y-15 z-10"
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide})` }}
        />
        <OverlayReveal
          delay={0.30}
          className="absolute -left-10 top-36 h-[140px] w-40 scale-x-[-1]  bg-contain bg-no-repeat translate-y-5 z-10 "
          style={{ backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.leafSide2})` }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10 w-full">
        <RevealOnScroll direction="up" distance={18} delay={0.08} width="100%">
          <div className="flex items-center justify-center gap-4 w-full ">
            <div className="h-2 w-2 rounded-full bg-[#38BDF8]/0" />
            <h2 className="font-poppins-bold text-[34px] leading-none text-[#0B1B2A] text-center tracking-tight">
              {heading}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.18} width="100%">
          <div className="mt-12 rounded-3xl border border-[#38BDF8]/25 bg-white/85 backdrop-blur p-7 shadow-[0_18px_50px_rgba(0,0,0,0.10)] relative overflow-hidden">
            {!effectiveInviteeName ? (
              <div className="text-center font-poppins text-[#0B1B2A]/75">
                Untuk memberikan ucapan, silahkan akses undangan ini melalui
                link yang disediakan.
              </div>
            ) : hasPosted && !isDemo ? (
              <div className="text-center py-6">
                <p className="text-xs tracking-[0.35em] uppercase text-[#0284C7] font-poppins">
                  {effectiveInviteeName}
                </p>
                <h3 className="mt-4 font-poppins-bold text-[32px] leading-none text-[#0B1B2A]">
                  Terimakasih
                </h3>
                <p className="mt-4 font-poppins text-sm text-[#0B1B2A]/75">
                  {thankYouMessage}
                </p>
                {existingWish?.message ? (
                  <p className="mt-4 text-sm text-[#0B1B2A]/75 whitespace-pre-line font-poppins">
                    {existingWish.message}
                  </p>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center">
                  <p className="text-xs tracking-[0.35em] uppercase text-[#0284C7] font-poppins">
                    Dari
                  </p>
                  <p className="mt-2 text-sm font-poppins text-[#0B1B2A]">
                    {effectiveInviteeName}
                  </p>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[128px] rounded-2xl border border-[#38BDF8]/25 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38BDF8]/25 text-[#0B1B2A] placeholder:text-[#0B1B2A]/35 font-poppins"
                  placeholder={placeholder}
                  disabled={isSubmitting}
                />

                {error ? (
                  <p className="text-red-700/80 text-xs text-center font-poppins">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full rounded-full px-6 py-3 bg-[#38BDF8] text-white hover:bg-[#0EA5E9] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_14px_35px_rgba(56,189,248,0.22)]"
                >
                  <span className="text-xs uppercase tracking-[0.25em] font-poppins">
                    {isSubmitting ? "Mengirim ..." : "Kirim"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>

        <div ref={wishesListRef} className="mt-12 space-y-3">
          {wishes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={
                isWishesListInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 18 }
              }
              transition={{
                duration: 0.55,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.12,
              }}
              className="rounded-3xl border border-[#38BDF8]/30 bg-white/70 backdrop-blur p-7 text-center"
            >
              <p className="text-sm text-[#0B1B2A]/75 font-poppins">
                Be the first to wish them well.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleWishes.map((wish, idx) => {
                const delay = Math.min(0.12 + idx * 0.14, 1.6);
                const hidden = { opacity: 0, y: 18 };
                const visible = { opacity: 1, y: 0 };

                return (
                  <motion.div
                    key={wish.id}
                    initial={hidden}
                    animate={isWishesListInView ? visible : hidden}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.6,
                      delay,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                    layout
                    className="rounded-3xl border border-[#38BDF8]/20 bg-white/70 backdrop-blur p-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.35em] uppercase text-[#0284C7] font-poppins">
                          {wish.name}
                        </p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.25em] font-poppins text-[#0B1B2A]/55">
                          {wish.createdAt?.toDate
                            ? formatDistanceToNow(wish.createdAt.toDate(), {
                                addSuffix: true,
                              })
                            : "Just now"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#0B1B2A]/75 whitespace-pre-line font-poppins">
                      {wish.message}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          <div ref={loadMoreRef} className="h-px" />
        </div>
      </div>

      <div className="mt-14">
        <FloralDivider />
      </div>
    </section>
  );
}
