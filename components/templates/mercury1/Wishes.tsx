"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { FloralDivider, SectionOrnament } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

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
        <section className="py-24 relative bg-stone-50 text-stone-800">

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-12">
                        <SectionOrnament />
                        <h2 className="text-center font-serif text-3xl md:text-5xl text-stone-800 mb-4 mt-6">
                            {heading}
                        </h2>
                        <p className="text-stone-500 font-sans tracking-widest text-xs uppercase">Send your regards</p>
                    </div>
                </RevealOnScroll>

                {/* Input Form */}
                <RevealOnScroll delay={0.2} width="100%">
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-200 mb-16 relative overflow-hidden">

                        {!inviteeName ? (
                            <div className="text-center font-body text-stone-500 italic">
                                To leave a wish, please access this invitation via the link provided solely for you.
                            </div>
                        ) : hasPosted ? (
                            <div className="text-center py-8">
                                <h3 className="font-serif text-3xl text-stone-800 mb-2">Thank you, {inviteeName}!</h3>
                                <p className="font-body text-stone-600">{thankYouMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-2">
                                    From: <span className="text-stone-800 font-bold ml-2">{inviteeName}</span>
                                </div>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 p-4 rounded-sm focus:outline-none focus:border-stone-400 transition-colors font-body text-stone-800 min-h-[120px]"
                                    placeholder={placeholder}
                                    disabled={isSubmitting}
                                />
                                {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !message.trim()}
                                    className="w-full bg-stone-800 text-white py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-stone-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
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
                                    className="bg-white p-6 rounded-lg shadow-sm border border-stone-100"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-serif text-stone-800 font-bold text-lg">
                                            {wish.name}
                                        </h4>
                                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-sans">
                                            {wish.createdAt?.toDate ? formatDistanceToNow(wish.createdAt.toDate(), { addSuffix: true }) : "Just now"}
                                        </span>
                                    </div>
                                    <p className="font-body text-stone-600 leading-relaxed italic">
                                        "{wish.message}"
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {wishes.length === 0 && (
                            <div className="text-center font-body text-stone-400 italic py-12">
                                Be the first to wish them well.
                            </div>
                        )}
                    </div>
                </RevealOnScroll>
            </div>

            <div className="mt-12">
                <FloralDivider />
            </div>
        </section >
    );
}
