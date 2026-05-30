"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { normalizeInvitationGuestName } from "@/lib/utils";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  where,
  Timestamp,
} from "firebase/firestore";
import { formatRelativeToNow } from "@/lib/date-time";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, TwinLineDivider, ThinFrameRule } from "./graphics/ornaments";
import { GrowingSwayingFloral } from "./graphics/GrowingSwayingFloral";

interface Wish {
  id: string;
  name: string;
  nameKey?: string;
  message: string;
  createdAt: Timestamp;
  invitationId: string;
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
    amount: 0.12,
  });

  const normalizeNameKey = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const inviteeNameKey = useMemo(() => {
    if (!inviteeName) return null;
    return normalizeNameKey(inviteeName);
  }, [inviteeName]);

  const inviteeWishRef = useMemo(() => {
    if (!inviteeNameKey) return null;
    return doc(db, "wishes", `${invitationId}_${inviteeNameKey}`);
  }, [invitationId, inviteeNameKey]);

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
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 18),
      },
      {
        id: `demo_${invitationId}_2`,
        invitationId,
        name: "Nadya",
        message:
          "Happy wedding! Semoga langgeng sampai tua dan saling menguatkan dalam setiap keadaan.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 2),
      },
      {
        id: `demo_${invitationId}_3`,
        invitationId,
        name: "Dimas",
        message:
          "Semoga pernikahannya penuh cinta, rezeki lancar, dan rumah tangga sakinah mawaddah warahmah.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 9),
      },
    ];
  }, [invitationId, isDemo]);

  useEffect(() => {
    if (!invitationId) return;

    if (isDemo) {
      setWishes(demoSeedWishes);
      return;
    }

    const q = query(
      collection(db, "wishes"),
      where("invitationId", "==", invitationId),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Wish, "id">),
      })) as Wish[];

      next.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

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
    });

    return () => unsubscribe();
  }, [demoSeedWishes, invitationId, isDemo]);

  useEffect(() => {
    const checkExisting = async () => {
      if (isDemo) return;
      if (!inviteeName || !invitationId) return;

      if (inviteeWishRef) {
        const snap = await getDoc(inviteeWishRef);
        if (snap.exists()) {
          const wish = {
            id: snap.id,
            ...(snap.data() as Omit<Wish, "id">),
          } as Wish;
          setExistingWish(wish);
          setHasPosted(true);
          return;
        }
      }

      const q = query(
        collection(db, "wishes"),
        where("invitationId", "==", invitationId),
        where("name", "==", inviteeName),
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const docs = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Wish, "id">) }))
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
        );

      const top = docs[0] as Wish | undefined;
      if (!top) return;
      setExistingWish(top);
      setHasPosted(true);
    };
    checkExisting();
  }, [invitationId, inviteeName, inviteeWishRef, isDemo]);

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

    if (!inviteeName || !inviteeNameKey || !inviteeWishRef) {
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

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(inviteeWishRef);
        if (snap.exists()) {
          throw new Error("already-posted");
        }
        tx.set(inviteeWishRef, nextData);
      });

      setMessage("");
      setExistingWish({ id: inviteeWishRef.id, ...nextData });
      setHasPosted(true);
    } catch (err) {
      if (err instanceof Error && err.message === "already-posted") {
        const snap = await getDoc(inviteeWishRef);
        if (snap.exists()) {
          const wish = {
            id: snap.id,
            ...(snap.data() as Omit<Wish, "id">),
          } as Wish;
          setExistingWish(wish);
        }
        setHasPosted(true);
        setError("You have already sent your wishes. Thank you!");
      } else {
        console.error("Error adding wish:", err);
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 max-w-2xl relative z-10 w-full">
        <RevealOnScroll direction="up" distance={20} delay={0.1}>
          <div className="flex flex-col items-center justify-center gap-6 w-full text-center">
            <h2 className="font-display italic text-[48px] leading-none text-wedding-accent">
              {heading}
            </h2>
            <TwinLineDivider />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="mt-12 relative p-2 max-w-xl mx-auto">
            {/* Outer ornate border */}
            <div className="absolute inset-0 rounded-t-[80px] rounded-b-[30px] border-[1px] border-wedding-accent/40 pointer-events-none" />
            <div className="absolute inset-2 rounded-t-[70px] rounded-b-[20px] border-[1px] border-wedding-accent/20 pointer-events-none" />

            {/* Line graphic corners */}
            <div className="absolute -top-3 -left-3 z-10 pointer-events-none opacity-50">
              <CornerLineTopLeft />
            </div>
            <div className="absolute -bottom-3 -right-3 z-10 pointer-events-none opacity-50">
              <CornerLineBottomRight />
            </div>

            {/* Rich floral corners */}
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.cornerFlower}
              initialRotate={90}
              className="absolute -top-12 -right-12 w-48 h-48 z-20 pointer-events-none opacity-90 mix-blend-multiply"
              growDelay={0.3}
              swayDuration={6.5}
              originX="90%"
              originY="10%"
            />
            <GrowingSwayingFloral
              src={EDEN_OVERLAY_ASSETS.cornerFlower}
              initialRotate={-90}
              className="absolute -bottom-12 -left-12 w-48 h-48 z-20 pointer-events-none opacity-90 mix-blend-multiply"
              growDelay={0.4}
              swayDuration={7.0}
              originX="10%"
              originY="90%"
            />

            <div className="relative border-none bg-wedding-bg rounded-t-[60px] rounded-b-[12px] p-8 overflow-hidden z-10">
              <ThinFrameRule />
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.04] mix-blend-multiply">
                <img src={EDEN_OVERLAY_ASSETS.leafSide} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                {!effectiveInviteeName ? (
              <div className="text-center font-body text-wedding-accent/80 italic leading-relaxed">
                Untuk memberikan ucapan, silahkan akses undangan ini melalui
                link yang disediakan.
              </div>
            ) : hasPosted && !isDemo ? (
              <div className="text-center py-4">
                <p className="text-[13px] tracking-[0.3em] uppercase text-wedding-accent/80 font-body font-bold">
                  {effectiveInviteeName}
                </p>
                <h3 className="mt-6 font-display italic text-[40px] leading-none text-wedding-accent">
                  Terima Kasih
                </h3>
                <p className="mt-4 font-body text-[16px] text-wedding-accent/80 italic">
                  {thankYouMessage}
                </p>
                {existingWish?.message ? (
                  <div className="mt-8 pt-8 border-t border-wedding-accent/10">
                    <p className="text-[15px] text-wedding-accent/80 whitespace-pre-line font-body leading-relaxed italic">
                      &quot;{existingWish.message}&quot;
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <p className="text-[12px] tracking-[0.3em] uppercase text-wedding-accent/60 font-body font-bold">
                    Ucapan dari
                  </p>
                  <p className="mt-2 text-[18px] font-display font-medium text-wedding-accent">
                    {effectiveInviteeName}
                  </p>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[140px] rounded-[12px] border border-wedding-accent/30 bg-wedding-bg px-5 py-4 text-[16px] outline-none focus:ring-1 focus:ring-wedding-accent/50 text-wedding-accent placeholder:text-wedding-accent/40 font-body leading-relaxed transition-all resize-none"
                  placeholder={placeholder}
                  disabled={isSubmitting}
                />

                {error && (
                  <p className="text-wedding-accent/80 text-[14px] text-center font-body italic">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full inline-flex items-center justify-center border border-wedding-accent bg-wedding-accent px-6 py-3.5 text-wedding-on-accent transition-colors hover:bg-transparent hover:text-wedding-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-[12px] uppercase tracking-[0.2em] font-body font-bold">
                    {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                  </span>
                </button>
              </form>
            )}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div ref={wishesListRef} className="mt-16 space-y-4">
          {wishes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isWishesListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border border-wedding-accent/10 bg-transparent rounded-[16px] p-8 text-center"
            >
              <p className="text-[16px] text-wedding-accent/70 font-body italic">
                Be the first to wish them well.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleWishes.map((wish, idx) => {
                const delay = Math.min(0.1 + idx * 0.1, 1.0);
                const hidden = { opacity: 0, y: 20 };
                const visible = { opacity: 1, y: 0 };

                return (
                  <motion.div
                    key={wish.id}
                    initial={hidden}
                    animate={isWishesListInView ? visible : hidden}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, delay }}
                    layout
                    className="border border-wedding-accent/15 bg-transparent rounded-[16px] p-8"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <p className="text-[14px] tracking-[0.2em] uppercase text-wedding-accent font-body font-bold">
                        {wish.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.15em] font-body text-wedding-accent/50">
                        {wish.createdAt
                          ? formatRelativeToNow(wish.createdAt) || "Just now"
                          : "Just now"}
                      </p>
                    </div>
                    <p className="text-[16px] text-wedding-accent/80 whitespace-pre-line font-body leading-relaxed italic">
                      &quot;{wish.message}&quot;
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          <div ref={loadMoreRef} className="h-px" />
        </div>
      </div>
    </section>
  );
}
