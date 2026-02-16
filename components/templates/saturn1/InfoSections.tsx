"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import {
    BankBuildingIcon,
    CheckIcon,
    CosmicDivider,
    NavigateArrowIcon,
    SectionOrnament,
    SatrunIcon,
    StarDivider,
    VerticalCosmicLine,
} from "./graphics";
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
        <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#0B0D17] text-white py-24">

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center text-center px-4">

                {/* INCOMING TRANSMISSION Indicator */}
                <RevealOnScroll direction="down" delay={0.1}>
                    <div className="flex flex-col items-center gap-2 mb-12">
                        <div className="flex items-center gap-3 bg-cyan-950/30 border border-cyan-500/20 px-4 py-1.5 rounded-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="font-mono text-[10px] md:text-xs text-cyan-400 tracking-[0.2em] uppercase">
                                Incoming Transmission
                            </span>
                        </div>
                        <div className="h-8 w-px bg-gradient-to-b from-cyan-500/50 to-transparent" />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll direction="down" delay={0.2} distance={30}>
                    <div className="inline-flex items-center gap-6 mb-8 opacity-80">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500" />
                        <h2 className="font-heading text-sm md:text-base uppercase tracking-[0.5em] text-cyan-100 text-center font-semibold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            {heading}
                        </h2>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500" />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.4} scale={0.9} duration={1.2}>
                    <div className="relative">
                        {/* Decorative Brackets */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 border-t border-l border-cyan-500/30 rounded-tl-xl hidden md:block" />
                        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b border-r border-cyan-500/30 rounded-br-xl hidden md:block" />

                        <div className="font-heading text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 mb-8 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)] tracking-wide">
                            <div className="flex flex-col gap-4 md:gap-6 items-center">
                                <span className="relative z-10">{couple.groom.firstName}</span>
                                <div className="text-xl md:text-2xl font-mono text-cyan-500/60 tracking-[0.5em] my-2">&</div>
                                <span className="relative z-10">{couple.bride.firstName}</span>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.6} distance={40}>
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <div className="bg-[#0B0D17]/80 backdrop-blur-md px-8 py-3 border-y border-cyan-500/20 w-full max-w-md mx-auto relative overflow-hidden group">
                            {/* Scanline */}
                            <div className="absolute top-0 left-0 h-full w-[2px] bg-cyan-400/50 blur-[2px] animate-scan-fast opacity-0 group-hover:opacity-100 transition-opacity" />

                            <p className="font-mono text-sm md:text-base tracking-[0.3em] text-cyan-200">
                                <span className="text-cyan-600 mr-4">T-MINUS:</span>
                                {date}
                            </p>
                        </div>
                        <p className="font-mono text-[10px] text-cyan-500/40 tracking-widest uppercase">
                            Secure Channel Established
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            <div className="absolute bottom-10 w-full opacity-30">
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
        <section className="py-32 relative text-white">
            <div className="absolute inset-0 bg-radial-gradient from-[#1e1b4b]/20 to-transparent opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">

                    {/* Groom Card */}
                    <div className="text-center group w-full max-w-sm">
                        <RevealOnScroll direction="right" delay={0.2} width="100%">
                            <div className="relative w-64 h-64 mx-auto mb-10">
                                {/* Orbit Rings */}
                                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 scale-110 group-hover:scale-125 transition-transform duration-1000" />
                                <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/20 scale-125 group-hover:rotate-180 transition-transform duration-[20s] ease-linear" />

                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative z-10">
                                    <img
                                        src={couple.groom.photo}
                                        alt="Groom"
                                        className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-500">
                                <h3 className="font-script text-5xl text-[#D4AF37] mb-2">{couple.groom.firstName}</h3>
                                <p className="font-heading text-lg mb-4 text-white/90 tracking-widest">{couple.groom.fullName}</p>
                                <div className="h-px w-16 bg-[#D4AF37]/50 mx-auto mb-4" />
                                <p className="font-body text-sm text-white/60 italic mb-2">{couple.groom.role}</p>
                                <p className="font-heading text-xs text-white/40 uppercase tracking-wider leading-relaxed">{couple.groom.parents}</p>
                            </div>
                        </RevealOnScroll>
                    </div>

                    <div className="hidden md:flex flex-col items-center opacity-60">
                        <VerticalCosmicLine />
                        <SatrunIcon />
                        <VerticalCosmicLine />
                    </div>

                    {/* Bride Card */}
                    <div className="text-center group w-full max-w-sm">
                        <RevealOnScroll direction="left" delay={0.2} width="100%">
                            <div className="relative w-64 h-64 mx-auto mb-10">
                                {/* Orbit Rings */}
                                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 scale-110 group-hover:scale-125 transition-transform duration-1000" />
                                <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/20 scale-125 group-hover:-rotate-180 transition-transform duration-[20s] ease-linear" />

                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.15)] relative z-10">
                                    <img
                                        src={couple.bride.photo}
                                        alt="Bride"
                                        className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={0.4} width="100%">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-500">
                                <h3 className="font-script text-5xl text-[#D4AF37] mb-2">{couple.bride.firstName}</h3>
                                <p className="font-heading text-lg mb-4 text-white/90 tracking-widest">{couple.bride.fullName}</p>
                                <div className="h-px w-16 bg-[#D4AF37]/50 mx-auto mb-4" />
                                <p className="font-body text-sm text-white/60 italic mb-2">{couple.bride.role}</p>
                                <p className="font-heading text-xs text-white/40 uppercase tracking-wider leading-relaxed">{couple.bride.parents}</p>
                            </div>
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
        <section className="py-24 relative overflow-hidden">

            <div className="absolute inset-0 bg-[#0B0D17]/80 backdrop-blur-sm z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-16">
                        <SatrunIcon />
                        <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-[0.3em] text-[#D4AF37] mb-2 text-center text-glow">{heading}</h2>
                        <div className="w-24 h-1 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
                    </div>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {/* Holy Matrimony */}
                    <RevealOnScroll direction="right" delay={0.2} width="100%">
                        <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-10 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/20 transition-all duration-700" />

                            <h3 className="font-script text-5xl mb-8 text-[#D4AF37] relative z-10">{events.holyMatrimony.title}</h3>

                            <div className="space-y-6 text-white relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-1 h-full bg-[#D4AF37]/30 rounded-full" />
                                    <div className="text-left">
                                        <p className="text-2xl font-heading tracking-widest mb-1">{events.holyMatrimony.date}</p>
                                        <p className="text-white/60 font-body">{events.holyMatrimony.time}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <p className="font-bold text-lg mb-2">{events.holyMatrimony.venue}</p>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6">{events.holyMatrimony.address}</p>

                                    <a href={events.holyMatrimony.mapUrl} target="_blank" className="inline-flex items-center gap-2 px-6 py-2 border border-[#D4AF37]/50 text-[#D4AF37] text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#0B0D17] transition-colors duration-300">
                                        <span>Navigate</span>
                                        <NavigateArrowIcon />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Reception */}
                    <RevealOnScroll direction="left" delay={0.4} width="100%">
                        <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-10 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#fff]/10 transition-all duration-700" />

                            <h3 className="font-script text-5xl mb-8 text-white relative z-10">{events.reception.title}</h3>

                            <div className="space-y-6 text-white relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="w-1 h-full bg-white/30 rounded-full" />
                                    <div className="text-left">
                                        <p className="text-2xl font-heading tracking-widest mb-1">{events.reception.date}</p>
                                        <p className="text-white/60 font-body">{events.reception.time}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <p className="font-bold text-lg mb-2">{events.reception.venue}</p>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6">{events.reception.address}</p>

                                    <a href={events.reception.mapUrl} target="_blank" className="inline-flex items-center gap-2 px-6 py-2 border border-white/50 text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-[#0B0D17] transition-colors duration-300">
                                        <span>Navigate</span>
                                        <NavigateArrowIcon />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            <div className="absolute bottom-0 w-full">
                <CosmicDivider />
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
        <section className="py-24 relative text-center text-white">
            <div className="absolute inset-0 bg-[#0B0D17]/50 backdrop-blur-sm z-0" />

            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <h2 className="font-heading text-3xl uppercase tracking-[0.3em] text-[#D4AF37] mb-12 drop-shadow-md">RSVP</h2>
                </RevealOnScroll>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                    {status === "success" || status === "already_submitted" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10"
                        >
                            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckIcon />
                            </div>
                            <h3 className="font-script text-5xl text-white mb-4">
                                {status === "already_submitted" ? "Welcome Back" : "Thank You"}
                            </h3>
                            <p className="font-body text-white/70 mb-8 max-w-md mx-auto">
                                {status === "already_submitted"
                                    ? "We have already received your signal. Your presence is confirmed."
                                    : "Transmission received. Your seat among the stars is reserved."}
                            </p>
                        </motion.div>
                    ) : (
                        <RevealOnScroll direction="up" delay={0.2} width="100%">
                            <div>
                                <p className="font-body mb-8 text-white/70 italic leading-relaxed">
                                    {!inviteeName ? (
                                        "Please access the invitation via your unique star-link."
                                    ) : (
                                        <>A seat has been reserved for you.<br />Please confirm your attendance by {rsvpDeadline}</>
                                    )}
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-white/50">Details</label>
                                        <div className="w-full bg-white/5 border border-white/10 p-4 font-body text-white/90 rounded-sm">
                                            {inviteeName || "Unknown Guest"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-white/50">Number of Guests</label>
                                        <select
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                            className="w-full bg-[#0B0D17]/50 border border-white/10 p-4 focus:outline-none focus:border-[#D4AF37]/50 transition-colors font-body text-white rounded-sm appearance-none"
                                            disabled={status === "submitting" || !inviteeName}
                                        >
                                            <option value="1">1 Person</option>
                                            <option value="2">2 People</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting" || !inviteeName}
                                        className="w-full bg-[#D4AF37] text-[#0B0D17] py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                    >
                                        {status === "submitting" ? "Transmitting..." : "Confirm Attendance"}
                                    </button>
                                    {status === "error" && <p className="text-red-400 text-xs text-center mt-4">Signal lost. Please retry transmission.</p>}
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
        <section className="py-32 relative text-white">
            <div className="absolute inset-0 bg-linear-to-b from-[#0B0D17] via-[#0B0D17]/90 to-[#0B0D17] z-0" />

            <div className="max-w-2xl mx-auto px-4 relative z-10">
                <RevealOnScroll direction="down" width="100%">
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-16 h-16 mb-6 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                            <span className="text-2xl">🎁</span>
                        </div>
                        <h2 className="font-script text-6xl text-[#D4AF37] mb-6">{heading}</h2>
                        <StarDivider />
                    </div>
                </RevealOnScroll>

                <RevealOnScroll delay={0.2} width="100%">
                    <p className="font-body text-white/70 mb-12 italic leading-relaxed text-center whitespace-pre-line">{description}</p>
                </RevealOnScroll>

                <div className="grid md:grid-cols-2 gap-6 font-heading">
                    {bankAccounts.map((account, index) => (
                        <RevealOnScroll key={index} direction="up" delay={0.3 + (index * 0.1)} width="100%">
                            <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-xl relative group hover:border-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <BankBuildingIcon />
                                </div>
                                <div className="font-bold text-xl mb-3 text-white group-hover:text-[#D4AF37] transition-colors">{account.bankName}</div>
                                <p className="font-mono text-lg mb-2 tracking-wider text-white/90">{account.accountNumber}</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest">a.n {account.accountHolder}</p>

                                {/* Scanline effect */}
                                <motion.div
                                    animate={{ top: ["-10%", "110%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                                    className="absolute left-0 w-full h-1 bg-white/20 blur-sm pointer-events-none"
                                />
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full opacity-50">
                <CosmicDivider />
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
        <footer className="py-24 bg-[#0B0D17] text-center text-white/80 relative overflow-hidden">
            {/* Simple stars background just for footer */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>

            <div className="relative z-10">
                <RevealOnScroll direction="up" delay={0.1} width="100%">
                    <FloatingParallax speed={0.4}>
                        <div className="mb-12">
                            <h2 className="font-script text-5xl md:text-7xl text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{couple.groom.firstName} & {couple.bride.firstName}</h2>
                        </div>
                        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-white/40 max-w-md mx-auto leading-loose">{message}</p>
                    </FloatingParallax>
                </RevealOnScroll>
            </div>
        </footer>
    );
}
