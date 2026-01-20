"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { SectionDivider, VerticalLine, HeartDivider, RingsDivider, GoldLeafBorder, DiamondAccent } from "./Decorations";
import { RevealOnScroll } from "./RevealOnScroll";
import { FloatingParallax } from "./ParallaxText";

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
        <section className="min-h-screen relative flex flex-col items-center justify-end overflow-hidden">
            <GoldLeafBorder position="top" />


            {/* Smooth Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-[80vh] bg-linear-to-t from-wedding-bg via-wedding-bg/70 to-transparent pointer-events-none z-0" />

            <div className="relative z-10 w-full flex flex-col items-center text-center pb-24 md:pb-32 px-4">
                <RevealOnScroll direction="down" delay={0.2} distance={50} duration={1.5}>
                    <FloatingParallax speed={-0.2}>
                        <h2 className="font-heading text-sm md:text-base uppercase tracking-[0.4em] mb-6 text-wedding-text-light text-center font-semibold drop-shadow-sm">
                            {heading}
                        </h2>
                    </FloatingParallax>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4} scale={0.8} duration={1.8}>
                    <FloatingParallax speed={0.4}>
                        <div className="font-script text-7xl md:text-[8rem] lg:text-[10rem] text-gold-gradient mb-8 leading-none text-center drop-shadow-lg">
                            <div className="flex flex-col gap-4">
                                <span>{couple.groom.firstName}</span>
                                <span className="text-2xl font-heading text-wedding-accent-light opacity-80">&</span>
                                <span>{couple.bride.firstName}</span>
                            </div>
                        </div>
                    </FloatingParallax>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.8} distance={60} duration={1.5}>
                    <FloatingParallax speed={-0.1}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-wedding-bg/30 backdrop-blur-sm -z-10 blur-xl rounded-full"></div>
                            <p className="font-heading text-xl md:text-2xl tracking-[0.3em] text-wedding-dark border-t border-b border-wedding-accent/40 py-6 inline-block px-16">
                                {date}
                            </p>
                        </div>
                    </FloatingParallax>
                </RevealOnScroll>
            </div>

            <div className="absolute bottom-4 w-full pb-4">
                <SectionDivider />
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
        <section className="section-curved py-24 bg-wedding-bg-alt/90 backdrop-blur-md relative border-b border-wedding-accent/30">
            <GoldLeafBorder position="top" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">
                    {/* Groom */}
                    <div className="text-center group">
                        <RevealOnScroll direction="right" delay={0.2} width="100%">
                            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden mb-8 border border-wedding-accent p-2 shadow-xl bg-white rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                <img
                                    src={couple.groom.photo}
                                    alt="Groom"
                                    className={`w-full h-full object-cover rounded-full transition-all duration-700 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                                />
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <FloatingParallax speed={0.3}>
                                <h3 className="font-script text-6xl text-wedding-accent mb-2">{couple.groom.firstName}</h3>
                                <p className="font-heading text-xl mb-4 text-wedding-dark">{couple.groom.fullName}</p>
                                <div className="w-12 h-px bg-wedding-accent mx-auto mb-4"></div>
                            </FloatingParallax>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.5} width="100%">
                            <p className="font-body text-sm text-wedding-text-light italic">{couple.groom.role}</p>
                            <p className="font-body text-xs text-wedding-text-light mt-2 uppercase tracking-wider">{couple.groom.parents}</p>
                        </RevealOnScroll>
                    </div>

                    <div className="hidden md:flex flex-col items-center">
                        <RevealOnScroll direction="down" delay={0.4}><VerticalLine /></RevealOnScroll>
                        <RevealOnScroll delay={0.6}><HeartDivider /></RevealOnScroll>
                        <RevealOnScroll direction="up" delay={0.4}><VerticalLine /></RevealOnScroll>
                    </div>

                    {/* Bride */}
                    <div className="text-center group">
                        <RevealOnScroll direction="left" delay={0.2} width="100%">
                            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden mb-8 border border-wedding-accent p-2 shadow-xl bg-white -rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                <img
                                    src={couple.bride.photo}
                                    alt="Bride"
                                    className={`w-full h-full object-cover rounded-full transition-all duration-700 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                                />
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <FloatingParallax speed={0.3}>
                                <h3 className="font-script text-6xl text-wedding-accent mb-2">{couple.bride.firstName}</h3>
                                <p className="font-heading text-xl mb-4 text-wedding-dark">{couple.bride.fullName}</p>
                                <div className="w-12 h-px bg-wedding-accent mx-auto mb-4"></div>
                            </FloatingParallax>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.5} width="100%">
                            <p className="font-body text-sm text-wedding-text-light italic">{couple.bride.role}</p>
                            <p className="font-body text-xs text-wedding-text-light mt-2 uppercase tracking-wider">{couple.bride.parents}</p>
                        </RevealOnScroll>
                    </div>
                </div>
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
        <section className="section-curved py-24 bg-wedding-bg/90 backdrop-blur-md text-center relative border-b border-wedding-accent/30">
            <GoldLeafBorder position="top" />


            <RevealOnScroll direction="down" width="100%">
                <div className="flex flex-col items-center">
                    <DiamondAccent />
                    <FloatingParallax speed={-0.2}>
                        <h2 className="font-heading text-3xl uppercase tracking-[0.2em] text-wedding-accent mb-4 mt-4">{heading}</h2>
                    </FloatingParallax>
                    <RingsDivider />
                </div>
            </RevealOnScroll>

            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 max-w-5xl mt-12">
                {/* Holy Matrimony */}
                <RevealOnScroll direction="right" delay={0.2} width="100%">
                    <div className="bg-white p-12 rounded-sm shadow-xl border border-wedding-accent/20 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-wedding-accent to-transparent opacity-50"></div>
                        <h3 className="font-script text-5xl mb-6 text-gold-gradient">{events.holyMatrimony.title}</h3>
                        <div className="space-y-4 font-body text-wedding-text">
                            <FloatingParallax speed={0.2}>
                                <p className="text-xl font-bold font-heading">{events.holyMatrimony.date}</p>
                                <p className="text-wedding-text-light">{events.holyMatrimony.time}</p>
                                <div className="w-16 h-px bg-wedding-accent/30 mx-auto my-4"></div>
                                <p className="font-bold text-lg">{events.holyMatrimony.venue}</p>
                                <p className="text-wedding-text-light text-sm italic">{events.holyMatrimony.address}</p>
                            </FloatingParallax>
                            <a href={events.holyMatrimony.mapUrl} target="_blank" className="inline-block mt-8 px-8 py-3 border border-wedding-accent text-wedding-text hover:bg-wedding-accent hover:text-white transition-all duration-300 rounded-sm text-xs uppercase tracking-[0.2em]">
                                View Map
                            </a>
                        </div>
                    </div>
                </RevealOnScroll>

                {/* Reception */}
                <RevealOnScroll direction="left" delay={0.4} width="100%">
                    <div className="bg-white p-12 rounded-sm shadow-xl border border-wedding-accent/20 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-wedding-accent to-transparent opacity-50"></div>
                        <h3 className="font-script text-5xl mb-6 text-gold-gradient">{events.reception.title}</h3>
                        <div className="space-y-4 font-body text-wedding-text">
                            <FloatingParallax speed={0.2}>
                                <p className="text-xl font-bold font-heading">{events.reception.date}</p>
                                <p className="text-wedding-text-light">{events.reception.time}</p>
                                <div className="w-16 h-px bg-wedding-accent/30 mx-auto my-4"></div>
                                <p className="font-bold text-lg">{events.reception.venue}</p>
                                <p className="text-wedding-text-light text-sm italic">{events.reception.address}</p>
                            </FloatingParallax>
                            <a href={events.reception.mapUrl} target="_blank" className="inline-block mt-8 px-8 py-3 border border-wedding-accent text-wedding-text hover:bg-wedding-accent hover:text-white transition-all duration-300 rounded-sm text-xs uppercase tracking-[0.2em]">
                                View Map
                            </a>
                        </div>
                    </div>
                </RevealOnScroll>
            </div>
            <SectionDivider />
            <GoldLeafBorder position="bottom" />
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

    // Check for existing RSVP
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
        <section className="section-curved py-24 bg-wedding-bg-alt/90 backdrop-blur-md text-center relative border-b border-wedding-accent/30">
            <GoldLeafBorder position="top" />

            <div className="max-w-xl mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <FloatingParallax speed={-0.2}>
                        <h2 className="font-heading text-3xl uppercase tracking-[0.2em] text-wedding-accent mb-8">RSVP</h2>
                    </FloatingParallax>
                </RevealOnScroll>

                {status === "success" || status === "already_submitted" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 shadow-2xl border border-wedding-accent/20 rounded-sm"
                    >
                        <h3 className="font-script text-5xl text-wedding-accent mb-4">
                            {status === "already_submitted" ? "Welcome Back!" : "Thank You!"}
                        </h3>
                        <p className="font-body text-wedding-text-light mb-6">
                            {status === "already_submitted"
                                ? "We have already received your confirmation."
                                : "We have received your confirmation."}
                        </p>
                        <div className="font-heading text-xs uppercase tracking-[0.2em] text-wedding-dark border-t border-wedding-accent/20 pt-6">
                            See you at the event
                        </div>
                    </motion.div>
                ) : (
                    <RevealOnScroll direction="up" delay={0.2} width="100%">
                        <div>
                            <p className="font-body mb-8 text-wedding-text-light italic">
                                {!inviteeName ? (
                                    "Please access the invitation via your unique link to confirm attendance."
                                ) : (
                                    <>We would be honored to have you celebrate with us. <br />Please confirm your attendance by {rsvpDeadline}</>
                                )}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6 text-left bg-white p-8 shadow-2xl border border-wedding-accent/10">
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-wedding-text-light">Name</label>
                                    <div className="w-full bg-wedding-bg-alt border-b border-wedding-accent/30 p-3 font-body text-wedding-text opacity-70 cursor-not-allowed">
                                        {inviteeName || "Guest Name Not Found"}
                                    </div>
                                    {!inviteeName && <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">Access Denied: Name missing from link</p>}
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-wedding-text-light">Number of Guests</label>
                                    <select
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        className="w-full bg-wedding-bg border-b border-wedding-accent/30 p-3 focus:outline-none focus:border-wedding-accent transition-colors font-body"
                                        disabled={status === "submitting" || !inviteeName}
                                    >
                                        <option value="1">1 Person</option>
                                        <option value="2">2 People</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "submitting" || !inviteeName}
                                    className="w-full bg-wedding-accent text-white py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-wedding-accent/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === "submitting" ? "Checking List..." : "Confirm Attendance"}
                                </button>
                                {status === "error" && <p className="text-red-400 text-xs text-center mt-2">Failed to send RSVP. Please try again.</p>}
                            </form>
                        </div>
                    </RevealOnScroll>
                )}
            </div>
            <GoldLeafBorder position="bottom" />
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
        <section className="section-curved py-24 bg-white/90 backdrop-blur-md text-center relative">
            <GoldLeafBorder position="top" />

            <div className="max-w-2xl mx-auto px-4">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center">
                        <DiamondAccent />
                        <FloatingParallax speed={-0.3}>
                            <h2 className="font-script text-6xl text-gold-gradient mb-4 mt-4">{heading}</h2>
                        </FloatingParallax>
                        <HeartDivider />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2} width="100%">
                    <p className="font-body text-wedding-text-light mb-16 italic leading-relaxed whitespace-pre-line">{description}</p>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-8 font-heading">
                    {bankAccounts.map((account, index) => (
                        <RevealOnScroll key={index} direction="up" delay={0.3 + (index * 0.1)} width="100%">
                            <div className="p-10 border border-wedding-accent/30 rounded-sm relative group hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="absolute top-2 right-2 opacity-10">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-2H2v2zm2-3h2v-5H4v5zm5 0h2v-5H9v5zm5 0h2v-5h-2v5zm5 0h2v-5h-2v5zM2 7l10-5 10 5v4h-2V9l-8-4-8 4v2H2V7z" /></svg>
                                </div>
                                <div className="font-bold text-2xl mb-4 text-wedding-dark">{account.bankName}</div>
                                <p className="font-mono text-xl mb-4 tracking-wider text-wedding-accent">{account.accountNumber}</p>
                                <p className="text-xs text-wedding-text-light uppercase tracking-widest">a.n {account.accountHolder}</p>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
            <GoldLeafBorder position="bottom" />
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
        <footer className="py-16 bg-wedding-dark/95 text-center text-white/80">
            <RevealOnScroll direction="up" delay={0.1} width="100%">
                <FloatingParallax speed={0.4}>
                    <h2 className="font-script text-5xl text-wedding-accent mb-6">{couple.groom.firstName} & {couple.bride.firstName}</h2>
                    <p className="font-heading text--[10px] uppercase tracking-[0.4em] opacity-60">{message}</p>
                </FloatingParallax>
            </RevealOnScroll>
        </footer>
    );
}
