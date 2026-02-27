"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
 collection,
 addDoc,
 Timestamp,
 query,
 where,
 getDocs,
} from "firebase/firestore";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { FloralDivider } from "./graphics";
import type { ConfirmationSectionProps } from "./InfoSections.types";

export function ConfirmationSection({
 invitationId,
 rsvpDeadline,
}: ConfirmationSectionProps) {
 const searchParams = useSearchParams();
 const inviteeName = searchParams.get("to") || "";

 const [formData, setFormData] = useState({ guests: "1" });
 const [status, setStatus] = useState<
  "idle" | "submitting" | "success" | "error" | "already_submitted"
 >("idle");

 useEffect(() => {
  const checkRSVP = async () => {
  if (!inviteeName || !invitationId) return;
  try {
  const q = query(
  collection(db, "rsvps"),
  where("invitationId", "==", invitationId),
  where("name", "==", inviteeName),
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
  <section className="py-24 relative text-center bg-[#F6FBFF] text-[#0B1B2A]">
  <div className="max-w-2xl mx-auto px-4 relative z-10">
  <RevealOnScroll direction="up" width="100%">
  <h2 className="font-poppins-bold text-3xl text-[#0B1B2A] tracking-tight">
  R.S.V.P
  </h2>
  <FloralDivider />
  </RevealOnScroll>

  <div className="bg-white/80 p-10 rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.10)] border border-[#38BDF8]/25 mt-8">
  {status === "success" || status === "already_submitted" ? (
  <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  className="py-10"
  >
  <h3 className="font-poppins-bold text-3xl mb-4 text-[#0B1B2A]">
  {status === "already_submitted" ? "Welcome Back" : "Thank You"}
  </h3>
  <p className="font-poppins text-[#0B1B2A]/70 mb-8">
  {status === "already_submitted"
  ? "We have already received your confirmation."
  : "We look forward to celebrating with you."}
  </p>
  </motion.div>
  ) : (
  <RevealOnScroll direction="up" delay={0.2} width="100%">
  <div>
  <p className="font-poppins mb-8 text-[#0B1B2A]/70 italic leading-relaxed">
  {!inviteeName ? (
  "Please access the invitation via your unique link."
  ) : (
  <>Kindly confirm your attendance before {rsvpDeadline}</>
  )}
  </p>

  <form onSubmit={handleSubmit} className="space-y-6 text-left">
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-poppins text-[#0284C7]">
  Name
  </label>
  <div className="w-full bg-white/70 border border-[#38BDF8]/25 rounded-2xl p-4 font-poppins text-[#0B1B2A]">
  {inviteeName || "Guest"}
  </div>
  </div>
  <div>
  <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-poppins text-[#0284C7]">
  Guests
  </label>
  <select
  value={formData.guests}
  onChange={(e) =>
  setFormData({ ...formData, guests: e.target.value })
  }
  className="w-full bg-white border border-[#38BDF8]/25 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/25 font-poppins text-[#0B1B2A]"
  disabled={status === "submitting" || !inviteeName}
  >
  <option value="1">1 Person</option>
  <option value="2">2 People</option>
  </select>
  </div>

  <button
  type="submit"
  disabled={status === "submitting" || !inviteeName}
  className="w-full rounded-full bg-[#38BDF8] text-white py-4 text-xs font-poppins uppercase tracking-[0.3em] hover:bg-[#0EA5E9] transition-all duration-300 disabled:opacity-50 mt-4 shadow-[0_14px_35px_rgba(56,189,248,0.22)]"
  >
  {status === "submitting" ? "Sending..." : "Confirm"}
  </button>
  {status === "error" ? (
  <p className="text-red-700/80 text-xs text-center mt-4 font-poppins">
  Something went wrong. Please try again.
  </p>
  ) : null}
  </form>
  </div>
  </RevealOnScroll>
  )}
  </div>
  </div>
  </section>
 );
}
