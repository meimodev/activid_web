"use client";

import { useState, useEffect } from "react";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { CheckIcon } from "./graphics/icons";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ConfirmationSectionProps {
  invitationId: string;
  rsvpDeadline: string;
}

export function ConfirmationSection({ invitationId, rsvpDeadline }: ConfirmationSectionProps) {
  const searchParams = useSearchParams();
  const inviteeName = searchParams.get("to");
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "already_submitted">("idle");
  const [formData, setFormData] = useState({
    guests: "1",
  });

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
    <section className="py-24 relative text-center text-wedding-on-dark bg-wedding-dark">
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
