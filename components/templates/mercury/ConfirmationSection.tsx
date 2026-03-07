"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { FloralDivider } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { normalizeInvitationGuestName } from "@/lib/utils";

interface ConfirmationSectionProps {
  invitationId: string;
  rsvpDeadline: string;
}

export function ConfirmationSection({
  invitationId,
  rsvpDeadline,
}: ConfirmationSectionProps) {
  const searchParams = useSearchParams();
  const inviteeName = normalizeInvitationGuestName(searchParams.get("to")) || "";

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
    <section className="py-24 relative text-center bg-stone-100 text-stone-800">
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <RevealOnScroll direction="down" width="100%">
          <h2 className="font-serif text-4xl text-stone-800 mb-8">R.S.V.P</h2>
          <FloralDivider />
        </RevealOnScroll>

        <div className="bg-white p-10 rounded-sm shadow-md border border-stone-200 mt-8">
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
                    <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">
                      Name
                    </label>
                    <div className="w-full bg-stone-50 border border-stone-200 p-4 font-serif text-stone-800">
                      {inviteeName || "Guest"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] mb-2 font-heading text-stone-400">
                      Guests
                    </label>
                    <select
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
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
                  {status === "error" && (
                    <p className="text-red-400 text-xs text-center mt-4">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
