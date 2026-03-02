"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
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
import { CosmicDivider, StarDivider, SatrunIcon } from "./graphics";
import { StaggerRevealOnScroll } from "@/components/invitation/StaggerRevealOnScroll";

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

export function Wishes({ invitationId, heading, placeholder, thankYouMessage }: WishesProps) {
  const searchParams = useSearchParams();
  const inviteeName = searchParams.get("to");

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

  // Fetch wishes in real-time
  useEffect(() => {
  if (!invitationId) return;

  if (isDemo) {
    setWishes(demoSeedWishes);
    return;
  }

  const q = query(
  collection(db, "wishes"),
  where("invitationId", "==", invitationId)
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

  // Check if current invitee has already posted
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
  where("name", "==", inviteeName)
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
  }, [wishes, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount < wishes.length) {
          setVisibleCount((prev) => prev + 10);
        }
      },
      { root: listContainerRef.current, threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [visibleCount, wishes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!message.trim()) return;
  if (!effectiveInviteeName) {
  setError("This feature is only available for invited guests via their personal link.");
  return;
  }

  setIsSubmitting(true);
  setError("");

  try {
  if (isDemo) {
    const newWish: Wish = {
      id: `demo_${Date.now()}`,
      invitationId,
      name: effectiveInviteeName,
      nameKey: inviteeNameKey || undefined,
      message: message.trim(),
      createdAt: Timestamp.now(),
    };
    setWishes((prev) => [newWish, ...prev]);
    setExistingWish(newWish);
  } else {
    if (!inviteeWishRef) throw new Error("Invalid guest name");

    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(inviteeWishRef);
      if (docSnap.exists()) {
        throw new Error("ALREADY_EXISTS");
      }
      transaction.set(inviteeWishRef, {
        invitationId,
        name: effectiveInviteeName,
        nameKey: inviteeNameKey,
        message: message.trim(),
        createdAt: Timestamp.now(),
      });
    });
  }

  setMessage("");
  setHasPosted(true);
  } catch (err) {
  console.error("Error adding wish:", err);
  if (err instanceof Error && err.message === "ALREADY_EXISTS") {
    setHasPosted(true);
    setError("You have already sent your wishes. Thank you!");
  } else {
    setError("Something went wrong. Please try again.");
  }
  } finally {
  setIsSubmitting(false);
  }
  };

  return (
  <section className="py-24 relative border-b border-wedding-accent/10 text-wedding-on-dark">
  <div className="absolute inset-0 bg-wedding-dark/30 backdrop-blur-sm z-0" />

  <div className="container mx-auto px-4 max-w-4xl">
  <StaggerRevealOnScroll direction="up" width="100%" staggerDelay={0.18} className="w-full">
    <div className="flex flex-col items-center">
      <SatrunIcon />
      <h2 className="text-center font-heading text-3xl text-wedding-accent mb-4 mt-4 capitalize tracking-[0.2em] text-glow">
        {heading}
      </h2>
      <StarDivider />
    </div>

    {/* Input Form */}
    <div className="bg-wedding-dark/80 p-8 rounded-sm shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_15%,transparent)] border border-wedding-accent/20 mb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-wedding-accent/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-wedding-accent/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {!effectiveInviteeName ? (
        <div className="text-center font-body text-wedding-on-dark/60 italic">
          To leave a wish, please access this invitation via the link provided solely for you.
        </div>
      ) : hasPosted ? (
        <div className="text-center py-8">
          <h3 className="font-heading text-2xl capitalize tracking-widest text-wedding-accent mb-4">Thank you, {effectiveInviteeName}!</h3>
          {existingWish && (
            <div className="bg-wedding-on-dark/5 p-6 rounded-sm mt-6 border border-wedding-on-dark/10">
              <p className="font-body text-wedding-on-dark/90 leading-relaxed italic mb-4">
                &quot;{existingWish.message}&quot;
              </p>
              <span className="text-[10px] text-wedding-on-dark/40 uppercase tracking-widest font-heading block text-right">
                {existingWish.createdAt ? formatRelativeToNow(existingWish.createdAt) : "Just now"}
              </span>
            </div>
          )}
          <p className="font-body text-wedding-on-dark/80 mt-6">{thankYouMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="font-body text-sm uppercase tracking-widest text-wedding-accent/80 mb-2">
            From: <span className="text-wedding-accent font-bold ml-2">{effectiveInviteeName}</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-wedding-dark border border-wedding-accent/30 p-4 rounded-sm focus:outline-none focus:border-wedding-accent transition-colors font-body text-wedding-on-dark min-h-[120px]"
            placeholder={placeholder}
            disabled={isSubmitting}
          />
          {error && <p className="text-wedding-accent/80 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="w-full bg-wedding-accent text-wedding-on-accent py-4 text-xs font-body uppercase tracking-[0.3em] hover:bg-wedding-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-accent)_40%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)]"
          >
            {isSubmitting ? "Sending..." : "Send Wishes"}
          </button>
        </form>
      )}
    </div>

    {/* Wishes List */}
    <div ref={listContainerRef} className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence>
        {visibleWishes.map((wish, idx) => {
          const isAccent2 = idx % 2 === 0;
          const glowColor = isAccent2 
            ? "shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)] border-wedding-accent/60"
            : "shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent)] border-wedding-accent-2/60";
          const textColor = isAccent2 ? "text-wedding-accent" : "text-wedding-accent-2";
          
          return (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-wedding-dark/50 p-6 rounded-sm border-l-4 transition-shadow duration-500 hover:shadow-[0_0_25px_color-mix(in_srgb,var(--invitation-accent)_40%,transparent)] ${glowColor}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className={`font-heading text-lg capitalize tracking-wider drop-shadow-sm ${textColor}`}>
                {wish.name}
              </h4>
              <span className="text-[10px] text-wedding-on-dark/40 uppercase tracking-widest font-body">
                {wish.createdAt ? formatRelativeToNow(wish.createdAt) || "Just now" : "Just now"}
              </span>
            </div>
            <p className="font-body text-wedding-on-dark/90 leading-relaxed">
              {wish.message}
            </p>
          </motion.div>
        )})}
      </AnimatePresence>
      {wishes.length === 0 && (
        <div className="text-center font-body text-wedding-on-dark/40 italic py-12">
          Be the first to wish them well.
        </div>
      )}
      {visibleCount < wishes.length && (
        <div ref={loadMoreRef} className="py-4 text-center">
          <div className="inline-block w-6 h-6 border-2 border-wedding-accent/20 border-t-wedding-accent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  </StaggerRevealOnScroll>
  </div>
  <CosmicDivider />
  </section >
  );
}
