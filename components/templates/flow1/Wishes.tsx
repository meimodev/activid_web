"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { SectionDivider, GoldLeafBorder, HeartDivider, DiamondAccent } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";

interface Wish {
  id: string;
  name: string;
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

  // Fetch wishes in real-time
  useEffect(() => {
  if (!invitationId) return;
  const q = query(
  collection(db, "wishes"),
  where("invitationId", "==", invitationId)
  // orderBy("createdAt", "desc") // Temporarily removed to avoid index issues
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
  const newWishes = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
  })) as Wish[];
  setWishes(newWishes);
  });

  return () => unsubscribe();
  }, [invitationId]);

  // Check if current invitee has already posted
  useEffect(() => {
  const checkExisting = async () => {
  if (!inviteeName || !invitationId) return;
  const q = query(
  collection(db, "wishes"),
  where("invitationId", "==", invitationId),
  where("name", "==", inviteeName)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
  setHasPosted(true);
  }
  };
  checkExisting();
  }, [inviteeName, invitationId]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!message.trim()) return;
  if (!inviteeName) {
  setError("This feature is only available for invited guests via their personal link.");
  return;
  }

  setIsSubmitting(true);
  setError("");

  try {
  // Double check before submit
  const q = query(
  collection(db, "wishes"),
  where("invitationId", "==", invitationId),
  where("name", "==", inviteeName)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
  setHasPosted(true);
  setError("You have already sent your wishes. Thank you!");
  setIsSubmitting(false);
  return;
  }

  await addDoc(collection(db, "wishes"), {
  invitationId,
  name: inviteeName,
  message: message.trim(),
  createdAt: Timestamp.now(),
  });

  setMessage("");
  setHasPosted(true);
  } catch (err) {
  console.error("Error adding wish:", err);
  setError("Something went wrong. Please try again.");
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
  <FloatingParallax speed={-0.2}>
  <h2 className="text-center font-heading text-3xl text-gold-gradient mb-4 mt-4 uppercase tracking-[0.2em]">
  {heading}
  </h2>
  </FloatingParallax>
  <HeartDivider />
  </div>
  </RevealOnScroll>

  {/* Input Form */}
  <RevealOnScroll delay={0.2} width="100%">
  <div className="bg-white p-8 rounded-sm shadow-xl border border-wedding-accent/20 mb-16 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

  {!inviteeName ? (
  <div className="text-center font-body text-wedding-text-light italic">
  To leave a wish, please access this invitation via the link provided solely for you.
  </div>
  ) : hasPosted ? (
  <div className="text-center py-8">
  <h3 className="font-script text-4xl text-wedding-accent mb-2">Thank you, {inviteeName}!</h3>
  <p className="font-body text-wedding-text-light">{thankYouMessage}</p>
  </div>
  ) : (
  <form onSubmit={handleSubmit} className="space-y-6">
  <div className="font-heading text-sm uppercase tracking-widest text-wedding-text-light mb-2">
  From: <span className="text-wedding-accent font-bold ml-2">{inviteeName}</span>
  </div>
  <textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  className="w-full bg-wedding-bg border border-wedding-accent/30 p-4 rounded-sm focus:outline-none focus:border-wedding-accent transition-colors font-body text-wedding-text min-h-[120px]"
  placeholder={placeholder}
  disabled={isSubmitting}
  />
  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
  <button
  type="submit"
  disabled={isSubmitting || !message.trim()}
  className="w-full bg-wedding-accent text-white py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-wedding-accent/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
  {isSubmitting ? "Sending..." : "Send Wishes"}
  </button>
  </form>
  )}
  </div>
  </RevealOnScroll>

  {/* Wishes List */}
  <RevealOnScroll delay={0.4} width="100%">
  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
  <AnimatePresence>
  {wishes.map((wish) => (
  <motion.div
  key={wish.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95 }}
  className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-wedding-accent/40"
  >
  <div className="flex justify-between items-start mb-3">
  <h4 className="font-heading text-wedding-dark font-bold text-sm uppercase tracking-wider">
  {wish.name}
  </h4>
  <span className="text-[10px] text-wedding-text-light uppercase tracking-widest font-heading">
  {wish.createdAt?.toDate ? formatDistanceToNow(wish.createdAt.toDate(), { addSuffix: true }) : "Just now"}
  </span>
  </div>
  <p className="font-body text-wedding-text leading-relaxed">
  {wish.message}
  </p>
  </motion.div>
  ))}
  </AnimatePresence>
  {wishes.length === 0 && (
  <div className="text-center font-body text-wedding-text-light italic py-12">
  Be the first to wish them well.
  </div>
  )}
  </div>
  </RevealOnScroll>
  </div>
  <SectionDivider />
  <GoldLeafBorder position="bottom" />
  </section>
  );
}
