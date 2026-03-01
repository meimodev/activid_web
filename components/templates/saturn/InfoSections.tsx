"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import type { Host, InvitationConfig } from "@/types/invitation";
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
import { formatInvitationDateLong, formatInvitationTime } from "@/lib/date-utils";

// ============================================
// TYPE DEFINITIONS
// ============================================
type EventsConfig = InvitationConfig["sections"]["event"]["events"];

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

// ============================================
// TITLE SECTION
// ============================================
interface TitleSectionProps {
  hosts: Host[];
  date: string;
  heading: string;
}

export function TitleSection({ hosts, date, heading }: TitleSectionProps) {
  const primaryName = hosts[0]?.firstName ?? "";
  const secondaryName = hosts[1]?.firstName;

  return (
  <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-wedding-bg text-wedding-on-dark py-24">

  {/* Grid Background */}
  <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--invitation-accent-2)_5%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--invitation-accent-2)_5%,transparent)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none" />

  <div className="relative z-10 w-full flex flex-col items-center text-center px-4">

  {/* INCOMING TRANSMISSION Indicator */}
  <RevealOnScroll direction="down" delay={0.1}>
  <div className="flex flex-col items-center gap-2 mb-12">
  <div className="flex items-center gap-3 bg-wedding-accent-2/10 border border-wedding-accent-2/20 px-4 py-1.5 rounded-sm">
  <span className="relative flex h-2 w-2">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wedding-accent-2 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-wedding-accent-2"></span>
  </span>
  <span className="font-mono text-[10px] text-wedding-accent-2 tracking-[0.2em] uppercase">
  Incoming Transmission
  </span>
  </div>
  <div className="h-8 w-px bg-gradient-to-b from-wedding-accent-2/50 to-transparent" />
  </div>
  </RevealOnScroll>

  <RevealOnScroll direction="down" delay={0.2} distance={30}>
  <div className="inline-flex items-center gap-6 mb-8 opacity-80">
  <div className="h-px w-12 bg-gradient-to-r from-transparent to-wedding-accent-2" />
  <h2 className="font-heading text-sm uppercase tracking-[0.5em] text-wedding-accent-2-light text-center font-semibold drop-shadow-[0_0_10px_color-mix(in_srgb,var(--invitation-accent-2)_55%,transparent)]">
  {heading}
  </h2>
  <div className="h-px w-12 bg-gradient-to-l from-transparent to-wedding-accent-2" />
  </div>
  </RevealOnScroll>

  <RevealOnScroll delay={0.4} scale={0.9} duration={1.2}>
  <div className="relative">
  {/* Decorative Brackets */}
  <div className="absolute -top-6 -left-6 w-12 h-12 border-t border-l border-wedding-accent-2/30 rounded-tl-xl hidden " />
  <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b border-r border-wedding-accent-2/30 rounded-br-xl hidden " />

  <div className="font-heading text-5xl  text-transparent bg-clip-text bg-gradient-to-b from-wedding-on-dark via-wedding-accent-2-light to-wedding-accent-2/30 mb-8 drop-shadow-[0_0_35px_color-mix(in_srgb,var(--invitation-accent-2)_40%,transparent)] tracking-wide">
  <div className="flex flex-col gap-4 items-center">
  <span className="relative z-10">{primaryName}</span>
  {secondaryName ? (
  <>
  <div className="text-xl font-mono text-wedding-accent-2/60 tracking-[0.5em] my-2">&</div>
  <span className="relative z-10">{secondaryName}</span>
  </>
  ) : null}
  </div>
  </div>
  </div>
  </RevealOnScroll>

  <RevealOnScroll direction="up" delay={0.6} distance={40}>
  <div className="flex flex-col items-center gap-4 mt-8">
  <div className="bg-wedding-dark/80 backdrop-blur-md px-8 py-3 border-y border-wedding-accent-2/20 w-full max-w-md mx-auto relative overflow-hidden group">
  {/* Scanline */}
  <div className="absolute top-0 left-0 h-full w-[2px] bg-wedding-accent-2/50 blur-[2px] animate-scan-fast opacity-0 group-hover:opacity-100 transition-opacity" />

  <p className="font-mono text-sm tracking-[0.3em] text-wedding-accent-2-light">
  <span className="text-wedding-accent-2/60 mr-4">T-MINUS:</span>
  {date}
  </p>
  </div>
  <p className="font-mono text-[10px] text-wedding-accent-2/40 tracking-widest uppercase">
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
  hosts: Host[];
  disableGrayscale?: boolean;
}

export function CoupleSection({ hosts, disableGrayscale = false }: CoupleSectionProps) {
  const primary = hosts[0];
  const secondary = hosts[1];

  return (
  <section className="py-32 relative text-wedding-on-dark">
  <div className="absolute inset-0 bg-radial-gradient from-wedding-accent-2/20 to-transparent opacity-50 pointer-events-none" />

  <div className="container mx-auto px-4 relative z-10">
  <div className="flex flex-col items-center justify-center gap-16 ">
  <div className="text-center group w-full max-w-sm">
  <RevealOnScroll direction="right" delay={0.2} width="100%">
  <div className="relative w-64 h-64 mx-auto mb-10">
  <div className="absolute inset-0 rounded-full border border-wedding-accent/30 scale-110 group-hover:scale-125 transition-transform duration-1000" />
  <div className="absolute inset-0 rounded-full border border-dashed border-wedding-accent/20 scale-125 group-hover:rotate-180 transition-transform duration-[20s] ease-linear" />
  <div className="w-full h-full rounded-full overflow-hidden border-2 border-wedding-accent/50 shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_15%,transparent)] relative z-10">
  <img
  src={primary?.photo ?? ""}
  alt="Host"
  className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
  />
  </div>
  </div>
  </RevealOnScroll>

  <RevealOnScroll delay={0.4} width="100%">
  <div className="bg-wedding-on-dark/5 backdrop-blur-md border border-wedding-on-dark/10 p-8 rounded-2xl hover:bg-wedding-on-dark/10 transition-colors duration-500">
  <h3 className="font-script text-5xl text-wedding-accent mb-2">{primary?.firstName ?? ""}</h3>
  <p className="font-heading text-lg mb-4 text-wedding-on-dark/90 tracking-widest">{primary?.fullName ?? ""}</p>
  <div className="h-px w-16 bg-wedding-accent/50 mx-auto mb-4" />
  <p className="font-body text-sm text-wedding-on-dark/60 italic mb-2">{primary?.role ?? ""}</p>
  <p className="font-heading text-xs text-wedding-on-dark/40 uppercase tracking-wider leading-relaxed">{primary?.parents ?? ""}</p>
  </div>
  </RevealOnScroll>
  </div>

  <div className="hidden flex-col items-center opacity-60">
  <VerticalCosmicLine />
  <SatrunIcon />
  <VerticalCosmicLine />
  </div>

  {secondary ? (
  <div className="text-center group w-full max-w-sm">
  <RevealOnScroll direction="left" delay={0.2} width="100%">
  <div className="relative w-64 h-64 mx-auto mb-10">
  <div className="absolute inset-0 rounded-full border border-wedding-accent/30 scale-110 group-hover:scale-125 transition-transform duration-1000" />
  <div className="absolute inset-0 rounded-full border border-dashed border-wedding-accent/20 scale-125 group-hover:-rotate-180 transition-transform duration-[20s] ease-linear" />
  <div className="w-full h-full rounded-full overflow-hidden border-2 border-wedding-accent/50 shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_15%,transparent)] relative z-10">
  <img
  src={secondary.photo}
  alt="Host"
  className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${disableGrayscale ? "" : "grayscale group-hover:grayscale-0"}`}
  />
  </div>
  </div>
  </RevealOnScroll>

  <RevealOnScroll delay={0.4} width="100%">
  <div className="bg-wedding-on-dark/5 backdrop-blur-md border border-wedding-on-dark/10 p-8 rounded-2xl hover:bg-wedding-on-dark/10 transition-colors duration-500">
  <h3 className="font-script text-5xl text-wedding-accent mb-2">{secondary.firstName}</h3>
  <p className="font-heading text-lg mb-4 text-wedding-on-dark/90 tracking-widest">{secondary.fullName}</p>
  <div className="h-px w-16 bg-wedding-accent/50 mx-auto mb-4" />
  <p className="font-body text-sm text-wedding-on-dark/60 italic mb-2">{secondary.role}</p>
  <p className="font-heading text-xs text-wedding-on-dark/40 uppercase tracking-wider leading-relaxed">{secondary.parents}</p>
  </div>
  </RevealOnScroll>
  </div>
  ) : null}
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
  const cards = Array.isArray(events)
    ? events
    : [
        events.holyMatrimony,
        events.reception,
        ...Object.entries(events)
          .filter(([key]) => key !== "holyMatrimony" && key !== "reception")
          .map(([, v]) => v),
      ].filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-wedding-dark/80 backdrop-blur-sm z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <div className="flex flex-col items-center mb-16">
            <SatrunIcon />
            <h2 className="font-heading text-2xl uppercase tracking-[0.3em] text-wedding-accent mb-2 text-center text-glow">
              {heading}
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-transparent via-wedding-accent to-transparent" />
          </div>
        </RevealOnScroll>

        <div className="grid gap-8 max-w-5xl mx-auto">
          {cards.map((e, idx) => (
            <RevealOnScroll
              key={`${e.title}-${idx}`}
              direction={idx % 2 === 0 ? "right" : "left"}
              delay={0.2 + idx * 0.2}
              width="100%"
            >
              <div className="h-full bg-wedding-on-dark/5 backdrop-blur-xl border border-wedding-on-dark/10 rounded-lg p-10 relative overflow-hidden group hover:border-wedding-accent/30 transition-all duration-500 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-accent)_10%,transparent)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-wedding-accent/20 transition-all duration-700" />

                <h3 className="font-heading text-xl uppercase tracking-[0.3em] text-wedding-accent mb-6">
                  {e.title}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-wedding-accent rounded-full" />
                    <p className="font-mono text-sm text-wedding-on-dark/80">{formatInvitationDateLong(e.date)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-wedding-accent rounded-full" />
                    <p className="font-mono text-sm text-wedding-on-dark/60">{formatInvitationTime(e.date)}</p>
                  </div>

                  <div className="pt-4 border-t border-wedding-on-dark/10">
                    <p className="font-heading text-lg text-wedding-on-dark">{e.venue}</p>
                    <p className="font-body text-sm text-wedding-on-dark/50 mt-2">{e.address}</p>
                  </div>

                  <a
                    href={e.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-wedding-accent/10 border border-wedding-accent/20 rounded-full text-wedding-accent hover:bg-wedding-accent/20 transition-all duration-300"
                  >
                    <NavigateArrowIcon />
                    <span className="text-xs uppercase tracking-[0.2em] font-mono">View Map</span>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
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
  <section className="py-24 relative text-center text-wedding-on-dark">
  <div className="absolute inset-0 bg-wedding-dark/50 backdrop-blur-sm z-0" />

  <div className="max-w-2xl mx-auto px-4 relative z-10">
  <RevealOnScroll direction="down" width="100%">
  <h2 className="font-heading text-3xl uppercase tracking-[0.3em] text-wedding-accent mb-12 drop-shadow-md">RSVP</h2>
  </RevealOnScroll>

  <div className="bg-wedding-on-dark/5 backdrop-blur-xl border border-wedding-on-dark/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
  {/* Decorative glow */}
  <div className="absolute -top-10 -left-10 w-40 h-40 bg-wedding-accent/20 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-wedding-accent-2/20 rounded-full blur-3xl pointer-events-none" />

  {status === "success" || status === "already_submitted" ? (
  <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  className="py-10"
  >
  <div className="w-20 h-20 bg-wedding-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
  <CheckIcon />
  </div>
  <h3 className="font-script text-5xl text-wedding-on-dark mb-4">
  {status === "already_submitted" ? "Welcome Back" : "Thank You"}
  </h3>
  <p className="font-body text-wedding-on-dark/70 mb-8 max-w-md mx-auto">
  {status === "already_submitted"
  ? "We have already received your signal. Your presence is confirmed."
  : "Transmission received. Your seat among the stars is reserved."}
  </p>
  </motion.div>
  ) : (
  <RevealOnScroll direction="up" delay={0.2} width="100%">
  <div>
  <p className="font-body mb-8 text-wedding-on-dark/70 italic leading-relaxed">
  {!inviteeName ? (
  "Please access the invitation via your unique star-link."
  ) : (
  <>A seat has been reserved for you.<br />Please confirm your attendance by {rsvpDeadline}</>
  )}
  </p>

  <form onSubmit={handleSubmit} className="space-y-6 text-left">
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-wedding-on-dark/50">Details</label>
  <div className="w-full bg-wedding-on-dark/5 border border-wedding-on-dark/10 p-4 font-body text-wedding-on-dark/90 rounded-sm">
  {inviteeName || "Unknown Guest"}
  </div>
  </div>
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-wedding-on-dark/50">Number of Guests</label>
  <select
  value={formData.guests}
  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
  className="w-full bg-wedding-dark/50 border border-wedding-on-dark/10 p-4 focus:outline-none focus:border-wedding-accent/50 transition-colors font-body text-wedding-on-dark rounded-sm appearance-none"
  disabled={status === "submitting" || !inviteeName}
  >
  <option value="1">1 Person</option>
  <option value="2">2 People</option>
  </select>
  </div>

  <button
  type="submit"
  disabled={status === "submitting" || !inviteeName}
  className="w-full bg-wedding-accent text-wedding-on-accent py-4 text-xs font-heading uppercase tracking-[0.3em] hover:bg-wedding-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_20px_color-mix(in_srgb,var(--invitation-accent)_30%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--invitation-on-dark)_40%,transparent)]"
  >
  {status === "submitting" ? "Transmitting..." : "Confirm Attendance"}
  </button>
  {status === "error" && <p className="text-wedding-accent/80 text-xs text-center mt-4">Signal lost. Please retry transmission.</p>}
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
  <section className="py-32 relative text-wedding-on-dark">
  <div className="absolute inset-0 bg-linear-to-b from-wedding-dark via-wedding-dark/90 to-wedding-dark z-0" />

  <div className="max-w-2xl mx-auto px-4 relative z-10">
  <RevealOnScroll direction="down" width="100%">
  <div className="flex flex-col items-center mb-12">
  <div className="w-16 h-16 mb-6 rounded-full border border-wedding-accent/30 flex items-center justify-center">
  <span className="text-2xl">🎁</span>
  </div>
  <h2 className="font-script text-6xl text-wedding-accent mb-6">{heading}</h2>
  <StarDivider />
  </div>
  </RevealOnScroll>

  <RevealOnScroll delay={0.2} width="100%">
  <p className="font-body text-wedding-on-dark/70 mb-12 italic leading-relaxed text-center whitespace-pre-line">{description}</p>
  </RevealOnScroll>

  <div className="grid gap-6 font-heading">
  {bankAccounts.map((account, index) => (
  <RevealOnScroll key={index} direction="up" delay={0.3 + (index * 0.1)} width="100%">
  <div className="p-8 border border-wedding-on-dark/10 bg-wedding-on-dark/5 backdrop-blur-md rounded-xl relative group hover:border-wedding-accent/40 hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
  <BankBuildingIcon />
  </div>
  <div className="font-bold text-xl mb-3 text-wedding-on-dark group-hover:text-wedding-accent transition-colors">{account.bankName}</div>
  <p className="font-mono text-lg mb-2 tracking-wider text-wedding-on-dark/90">{account.accountNumber}</p>
  <p className="text-[10px] text-wedding-on-dark/50 uppercase tracking-widest">a.n {account.accountHolder}</p>

  {/* Scanline effect */}
  <motion.div
  animate={{ top: ["-10%", "110%"] }}
  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
  className="absolute left-0 w-full h-1 bg-wedding-on-dark/20 blur-sm pointer-events-none"
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
  hosts: Host[];
  message: string;
}

export function FooterSection({ hosts, message }: FooterSectionProps) {
  const names = `${hosts[0]?.firstName ?? ""}${hosts[1]?.firstName ? ` & ${hosts[1]?.firstName}` : ""}`;

  return (
  <footer className="py-24 bg-wedding-dark text-center text-wedding-on-dark/80 relative overflow-hidden">
  {/* Simple stars background just for footer */}
  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--invitation-on-dark) 85%, transparent) 1px, transparent 1px)", backgroundSize: "50px 50px" }}></div>

  <div className="relative z-10">
  <RevealOnScroll direction="up" delay={0.1} width="100%">
  <FloatingParallax speed={0.4}>
  <div className="mb-12">
  <h2 className="font-script text-5xl text-wedding-on-dark mb-4 drop-shadow-[0_0_15px_color-mix(in_srgb,var(--invitation-on-dark)_30%,transparent)]">{names}</h2>
  </div>
  <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-wedding-on-dark/40 max-w-md mx-auto leading-loose">{message}</p>
  </FloatingParallax>
  </RevealOnScroll>
  </div>
  </footer>
  );
}
