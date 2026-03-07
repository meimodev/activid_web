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
import { motion, AnimatePresence } from "framer-motion";
import {
  SectionDivider,
  GoldLeafBorder,
  HeartDivider,
  DiamondAccent,
} from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

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

  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isDemo = useMemo(() => invitationId.endsWith("-demo"), [invitationId]);
  const effectiveInviteeName = inviteeName ?? (isDemo ? "Demo Guest" : null);

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
      {
        id: `demo_${invitationId}_4`,
        invitationId,
        name: "Alya",
        message:
          "Congrats! Semoga jadi pasangan yang saling melengkapi dan selalu kompak.",
        createdAt: Timestamp.fromMillis(now - 1000 * 60 * 60 * 26),
      },
      {
        id: `demo_${invitationId}_5`,
        invitationId,
        name: "Bima",
        message:
          "Doa terbaik untuk kalian berdua. Semoga acaranya lancar dan pernikahannya bahagia selalu.",
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

    const q = query(
      collection(db, "wishes"),
      where("invitationId", "==", invitationId),
      // orderBy("createdAt", "desc") // Temporarily removed to avoid index issues
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
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) => {
          if (prev >= wishes.length) return prev;
          return Math.min(wishes.length, prev + 10);
        });
      },
      {
        root: listContainerRef.current,
        rootMargin: "240px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(sentinel);
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
    <section className="section-curved py-24 bg-wedding-bg/30 backdrop-blur-sm relative border-b border-wedding-accent/30">
      <GoldLeafBorder position="top" />
      <div className="container mx-auto px-4 max-w-4xl">
        <RevealOnScroll direction="down" width="100%">
          <div className="flex flex-col items-center">
            <DiamondAccent />
            <h2 className="text-center font-script text-4xl text-gold-gradient mb-4 mt-4 py-5 ">
              {heading}
            </h2>
            <HeartDivider />
          </div>
        </RevealOnScroll>

        {/* Input Form */}
        <RevealOnScroll delay={0.2} width="100%">
          <div className="bg-wedding-bg p-8 rounded-sm shadow-xl border border-wedding-accent/20 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {!effectiveInviteeName ? (
              <div className="text-center font-garet-book text-wedding-text-light italic">
                To leave a wish, please access this invitation via the link
                provided solely for you.
              </div>
            ) : hasPosted && !isDemo ? (
              <div className="text-center py-8">
                <h3 className="font-brittany-signature text-5xl text-wedding-accent mb-4 leading-[1.05] py-1">
                  Thank you, {effectiveInviteeName}!
                </h3>
                <p className="font-garet-book text-wedding-text-light">
                  {thankYouMessage}
                </p>
                {existingWish?.message ? (
                  <p className="mt-4 font-poppins text-wedding-text leading-relaxed whitespace-pre-line">
                    {existingWish.message}
                  </p>
                ) : null}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="font-garet-book font-bold text-sm uppercase tracking-widest text-wedding-text-light mb-2">
                  From:{" "}
                  <span className="text-wedding-accent font-bold ml-2">
                    {effectiveInviteeName}
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-wedding-bg border border-wedding-accent/30 p-4 rounded-sm focus:outline-none focus:border-wedding-accent transition-colors font-poppins text-wedding-text min-h-[120px]"
                  placeholder={placeholder}
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="text-wedding-accent/80 text-xs text-center font-garet-book">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full bg-wedding-accent text-wedding-on-accent py-4 text-xs font-garet-book font-bold uppercase tracking-[0.3em] hover:bg-wedding-accent/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Wishes"}
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>

        {/* Wishes List */}
        <RevealOnScroll delay={0.4} width="100%">
          <div
            ref={listContainerRef}
            className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
          >
            <AnimatePresence>
              {visibleWishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-wedding-bg p-6 rounded-sm shadow-sm border-l-4 border-wedding-accent/40"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-garet-book font-bold text-wedding-dark text-sm uppercase tracking-wider">
                      {wish.name}
                    </h4>
                    <span className="text-[10px] text-wedding-text-light uppercase tracking-widest font-garet-book">
                      {wish.createdAt
                        ? formatRelativeToNow(wish.createdAt) || "Just now"
                        : "Just now"}
                    </span>
                  </div>
                  <p className="font-poppins text-wedding-text leading-relaxed">
                    {wish.message}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {wishes.length === 0 && (
              <div className="text-center font-garet-book text-wedding-text-light italic py-12">
                Be the first to wish them well.
              </div>
            )}
            <div ref={loadMoreRef} className="h-px" />
          </div>
        </RevealOnScroll>
      </div>
      <SectionDivider />
      <GoldLeafBorder position="bottom" />
    </section>
  );
}
