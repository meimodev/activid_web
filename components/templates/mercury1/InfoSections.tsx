"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { FloralDivider, VerticalLine, SectionOrnament } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloatingParallax } from "@/components/invitation/ParallaxText";

// ============================================
// TYPE DEFINITIONS
// ============================================
interface CoupleInfo {
    groom: {
        firstName: string;
        fullName: string;
        shortName: string;
        role: string;
        parents: string;
        photo: string;
    };
    bride: {
        firstName: string;
        fullName: string;
        shortName: string;
        role: string;
        parents: string;
        photo: string;
    };
}

interface EventInfo {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    mapUrl: string;
}

interface EventsConfig {
    holyMatrimony: EventInfo;
    reception: EventInfo;
}

interface BankAccount {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

// ============================================
// TITLE SECTION
// ============================================
interface TitleSectionProps {
    couple: CoupleInfo;
    date: string;
    heading: string;
}

export function TitleSection({ couple, date, heading }: TitleSectionProps) {
    return (
        <section className="min-h-screen relative flex flex-col items-center justify-center bg-stone-50 text-stone-800 py-24 overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

            <div className="relative z-10 w-full flex flex-col items-center text-center px-4">

                <RevealOnScroll direction="down" delay={0.1}>
                    <div className="mb-12">
                        <span className="font-heading text-xs tracking-[0.3em] uppercase text-stone-500 block mb-4 border-b border-stone-300 pb-2">
                            {heading}
                        </span>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.3} duration={1.2}>
                    <div className="font-serif text-5xl md:text-7xl lg:text-8xl text-stone-800 mb-8 leading-tight">
                        <div className="flex flex-col gap-4 md:gap-8 items-center">
                            <span className="relative z-10">{couple.groom.firstName}</span>
                            <span className="text-3xl md:text-5xl font-light italic text-stone-400">&</span>
                            <span className="relative z-10">{couple.bride.firstName}</span>
                        </div>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.5}>
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="w-px h-16 bg-stone-300 mb-4" />
                        <p className="font-sans text-sm md:text-base tracking-[0.2em] text-stone-600 uppercase">
                            {date}
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            <div className="absolute bottom-10 w-full opacity-60">
                <SectionOrnament />
            </div>
        </section>
    );
}

// ============================================
// COUPLE SECTION
// ============================================
interface CoupleSectionProps {
    couple: CoupleInfo;
    disableGrayscale?: boolean;
}

export function CoupleSection({ couple, disableGrayscale = false }: CoupleSectionProps) {
    return (
        <section className="py-32 relative text-stone-800 bg-white">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-24">

                    {/* Groom Card */}
                    <div className="text-center w-full max-w-sm">
                        <RevealOnScroll direction="right" delay={0.2} width="100%">
                            <div className="relative w-72 h-96 mx-auto mb-10 overflow-hidden rounded-t-full rounded-b-2xl shadow-lg">
                                <img
                                    src={couple.groom.photo}
                                    alt="Groom"
                                    className={`w-full h-full object-cover transition-transform duration-1000 hover:scale-105 ${disableGrayscale ? "" : "grayscale hover:grayscale-0"}`}
                                />
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <div className="bg-stone-50 p-8 rounded-lg border border-stone-100 shadow-sm">
                                <h3 className="font-serif text-3xl mb-2">{couple.groom.firstName}</h3>
                                <p className="font-sans text-xs tracking-widest text-stone-500 mb-4 uppercase">{couple.groom.fullName}</p>
                                <div className="h-px w-12 bg-stone-300 mx-auto mb-4" />
                                <p className="font-body text-sm text-stone-600 italic mb-2">{couple.groom.role}</p>
                                <p className="font-sans text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">{couple.groom.parents}</p>
                            </div>
                        </RevealOnScroll>
                    </div>

                    <div className="hidden md:flex flex-col items-center opacity-40">
                        <VerticalLine />
                        <span className="font-serif italic text-2xl text-stone-300">&</span>
                        <VerticalLine />
                    </div>

                    {/* Bride Card */}
                    <div className="text-center w-full max-w-sm">
                        <RevealOnScroll direction="left" delay={0.2} width="100%">
                            <div className="relative w-72 h-96 mx-auto mb-10 overflow-hidden rounded-t-full rounded-b-2xl shadow-lg">
                                <img
                                    src={couple.bride.photo}
                                    alt="Bride"
                                    className={`w-full h-full object-cover transition-transform duration-1000 hover:scale-105 ${disableGrayscale ? "" : "grayscale hover:grayscale-0"}`}
                                />
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <div className="bg-stone-50 p-8 rounded-lg border border-stone-100 shadow-sm">
                                <h3 className="font-serif text-3xl mb-2">{couple.bride.firstName}</h3>
                                <p className="font-sans text-xs tracking-widest text-stone-500 mb-4 uppercase">{couple.bride.fullName}</p>
                                <div className="h-px w-12 bg-stone-300 mx-auto mb-4" />
                                <p className="font-body text-sm text-stone-600 italic mb-2">{couple.bride.role}</p>
                                <p className="font-sans text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">{couple.bride.parents}</p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            <div className="mt-20">
                <FloralDivider />
            </div>
        </section>
    );
}

// ============================================
// EVENT SECTION
// ============================================
interface EventSectionProps {
    events: EventsConfig;
    heading: string;
}

export function EventSection({ events, heading }: EventSectionProps) {
    return (
        <section className="py-24 relative bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.3em] text-stone-800 mb-4 text-center">{heading}</h2>
                        <SectionOrnament />
                    </div>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {/* Holy Matrimony */}
                    <RevealOnScroll direction="right" delay={0.2} width="100%">
                        <div className="h-full bg-white border border-stone-200 shadow-sm p-10 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                            <h3 className="font-serif text-3xl mb-6 text-stone-800 relative z-10 border-b border-stone-100 pb-4">{events.holyMatrimony.title}</h3>

                            <div className="space-y-6 text-stone-600 relative z-10">
                                <div className="text-left">
                                    <p className="text-xl font-heading tracking-widest mb-1 text-stone-900">{events.holyMatrimony.date}</p>
                                    <p className="text-stone-500 font-body italic">{events.holyMatrimony.time}</p>
                                </div>

                                <div className="pt-2">
                                    <p className="font-bold text-lg mb-2 text-stone-800">{events.holyMatrimony.venue}</p>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-6">{events.holyMatrimony.address}</p>

                                    <a href={events.holyMatrimony.mapUrl} target="_blank" className="inline-block px-6 py-3 bg-stone-800 text-white text-xs uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors duration-300">
                                        View Map
                                    </a>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Reception */}
                    <RevealOnScroll direction="left" delay={0.4} width="100%">
                        <div className="h-full bg-white border border-stone-200 shadow-sm p-10 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                            <h3 className="font-serif text-3xl mb-6 text-stone-800 relative z-10 border-b border-stone-100 pb-4">{events.reception.title}</h3>

                            <div className="space-y-6 text-stone-600 relative z-10">
                                <div className="text-left">
                                    <p className="text-xl font-heading tracking-widest mb-1 text-stone-900">{events.reception.date}</p>
                                    <p className="text-stone-500 font-body italic">{events.reception.time}</p>
                                </div>

                                <div className="pt-2">
                                    <p className="font-bold text-lg mb-2 text-stone-800">{events.reception.venue}</p>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-6">{events.reception.address}</p>

                                    <a href={events.reception.mapUrl} target="_blank" className="inline-block px-6 py-3 bg-stone-800 text-white text-xs uppercase tracking-[0.2em] hover:bg-stone-700 transition-colors duration-300">
                                        View Map
                                    </a>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
}

// ============================================
// CONFIRMATION SECTION (RSVP)
// ============================================
interface ConfirmationSectionProps {
    invitationId: string;
    rsvpDeadline: string;
}

export function ConfirmationSection({ invitationId, rsvpDeadline }: ConfirmationSectionProps) {
    const searchParams = useSearchParams();
    const inviteeName = searchParams.get("to") || "";

    const [formData, setFormData] = useState({ guests: "1" });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "already_submitted">("idle");

    useEffect(() => {
        const checkRSVP = async () => {
            if (!inviteeName || !invitationId) return;
            try {
                const q = query(
                    collection(db, "rsvps"),
                    where("invitationId", "==", invitationId),
                    where("name", "==", inviteeName)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setStatus("already_submitted");
                }
            } catch (e) {
                console.error("Error checking RSVP:", e);
            }
        };
        checkRSVP();
    }, [inviteeName, invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteeName) return;

        setStatus("submitting");
        try {
            await addDoc(collection(db, "rsvps"), {
                invitationId,
                name: inviteeName,
                ...formData,
                createdAt: Timestamp.now(),
            });

            setStatus("success");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <section className="py-24 relative text-center bg-stone-100 text-stone-800">

            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <h2 className="font-serif text-4xl text-stone-800 mb-8">R.S.V.P</h2>
                    <FloralDivider />
                </RevealOnScroll>

                <div className="bg-white p-10 md:p-14 rounded-sm shadow-md border border-stone-200 mt-8">
                    {status === "success" || status === "already_submitted" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10"
                        >
                            <h3 className="font-serif text-3xl mb-4">
                                {status === "already_submitted" ? "Welcome Back" : "Thank You"}
                            </h3>
                            <p className="font-body text-stone-600 mb-8">
                                {status === "already_submitted"
                                    ? "We have already received your confirmation."
                                    : "We look forward to celebrating with you."}
                            </p>
                        </motion.div>
                    ) : (
                        <RevealOnScroll direction="up" delay={0.2} width="100%">
                            <div>
                                <p className="font-body mb-8 text-stone-600 italic leading-relaxed">
                                    {!inviteeName ? (
                                        "Please access the invitation via your unique link."
                                    ) : (
                                        <>Kindly confirm your attendance before {rsvpDeadline}</>
                                    )}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">Name</label>
                                        <div className="w-full bg-stone-50 border border-stone-200 p-4 font-serif text-stone-800">
                                            {inviteeName || "Guest"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">Guests</label>
                                        <select
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                            className="w-full bg-white border border-stone-200 p-4 focus:outline-none focus:border-stone-400 font-body text-stone-800"
                                            disabled={status === "submitting" || !inviteeName}
                                        >
                                            <option value="1">1 Person</option>
                                            <option value="2">2 People</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting" || !inviteeName}
                                        className="w-full bg-stone-800 text-white py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-stone-700 transition-all duration-300 disabled:opacity-50 mt-4"
                                    >
                                        {status === "submitting" ? "Sending..." : "Confirm"}
                                    </button>
                                    {status === "error" && <p className="text-red-400 text-xs text-center mt-4">Something went wrong. Please try again.</p>}
                                </form>
                            </div>
                        </RevealOnScroll>
                    )}
                </div>
            </div>
        </section>
    );
}

// ============================================
// GIFT SECTION
// ============================================
interface GiftSectionProps {
    bankAccounts: BankAccount[];
    heading: string;
    description: string;
}

export function GiftSection({ bankAccounts, heading, description }: GiftSectionProps) {
    return (
        <section className="py-32 relative bg-white text-stone-800">
            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="font-serif text-4xl mb-6">{heading}</h2>
                        <SectionOrnament />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2} width="100%">
                    <p className="font-body text-stone-600 mb-12 italic leading-relaxed text-center whitespace-pre-line">{description}</p>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-6 font-heading">
                    {bankAccounts.map((account, index) => (
                        <RevealOnScroll key={index} direction="up" delay={0.3 + (index * 0.1)} width="100%">
                            <div className="p-8 border border-stone-200 bg-stone-50 rounded-lg text-center hover:shadow-md transition-shadow">
                                <div className="font-bold text-xl mb-3 text-stone-800">{account.bankName}</div>
                                <p className="font-mono text-lg mb-2 tracking-wider text-stone-600">{account.accountNumber}</p>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest">a.n {account.accountHolder}</p>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// FOOTER SECTION
// ============================================
interface FooterSectionProps {
    couple: CoupleInfo;
    message: string;
}

export function FooterSection({ couple, message }: FooterSectionProps) {
    return (
        <footer className="py-24 bg-stone-900 text-center text-white/60 relative overflow-hidden">
            <div className="relative z-10">
                <RevealOnScroll direction="up" delay={0.1} width="100%">
                    <FloatingParallax speed={0.4}>
                        <div className="mb-12">
                            <h2 className="font-serif text-5xl md:text-6xl text-white/80 mb-4">{couple.groom.firstName} & {couple.bride.firstName}</h2>
                        </div>
                        <p className="font-sans text-[10px] uppercase tracking-[0.4em] max-w-md mx-auto leading-loose opacity-50">{message}</p>
                    </FloatingParallax>
                </RevealOnScroll>
            </div>
        </footer>
    );
}
