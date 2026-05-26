"use client";

import { useState } from "react";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Crest } from "./graphics";

interface RsvpSectionProps {
  description: string;
  successMessage: string;
}

export function RsvpSection({ description, successMessage }: RsvpSectionProps) {
  const [step, setStep] = useState<"form" | "submitted">("form");
  const [name, setName] = useState("");
  const [attend, setAttend] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || attend === null) return;
    setStep("submitted");
  }

  if (step === "submitted") {
    return (
      <SectionWrap id="rsvp">
        <div className="text-center">
          <div className="flex justify-center">
            <Crest size={120} initials="✓" idle />
          </div>
          <div className="font-[var(--font-royal-serif)] font-light text-[32px] mt-4">
            Thank you,{" "}
            <span className="font-[var(--font-royal-script)] text-[40px] shimmer-text">
              {name.split(" ")[0]}
            </span>
          </div>
          <div className="mt-3 font-[var(--font-royal-serif)] text-[15px] text-[var(--invitation-text-light)]">
            {attend ? successMessage : "We'll miss you — your love still travels with us."}
          </div>
          <button
            onClick={() => setStep("form")}
            className="inline-flex items-center justify-center gap-2.5 px-[26px] py-3.5 mt-6 border text-[var(--invitation-text)] font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase"
            style={{
              borderColor: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)",
            }}
          >
            <span>Edit Response</span>
          </button>
        </div>
      </SectionWrap>
    );
  }

  return (
    <SectionWrap id="rsvp">
      <SectionHead
        eyebrow="Kindly respond"
        title="Will you"
        em="join us?"
        sub={description || "Please share your reply so we may prepare for your arrival."}
      />
      <form onSubmit={submit} className="grid gap-4.5">
        <label className="grid gap-2">
          <span className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent)]">
            Your full name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="As written on the invitation"
            className="w-full px-3.5 py-3 text-[15px] outline-none transition-colors duration-300"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
              color: "var(--invitation-text)",
              fontFamily: "var(--font-royal-serif)",
            }}
          />
        </label>

        <label className="grid gap-2">
          <span className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent)]">
            Will you attend?
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <Choice active={attend === true} onClick={() => setAttend(true)}>
              Joyfully accept
            </Choice>
            <Choice active={attend === false} onClick={() => setAttend(false)}>
              Regretfully decline
            </Choice>
          </div>
        </label>

        {attend && (
          <label className="grid gap-2">
            <span className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent)]">
              Number of guests (including you)
            </span>
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-9 h-9 border text-[var(--invitation-accent)] text-lg cursor-pointer"
                style={{ borderColor: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)" }}
              >
                −
              </button>
              <div className="font-[var(--font-royal-serif)] font-light text-[32px] text-[var(--invitation-accent)] min-w-[32px] text-center">
                {guests}
              </div>
              <button
                type="button"
                onClick={() => setGuests(Math.min(6, guests + 1))}
                className="w-9 h-9 border text-[var(--invitation-accent)] text-lg cursor-pointer"
                style={{ borderColor: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)" }}
              >
                +
              </button>
            </div>
          </label>
        )}

        <label className="grid gap-2">
          <span className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.18em] uppercase text-[var(--invitation-accent)]">
            A message for the couple (optional)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Wishes, prayers, anything…"
            className="w-full px-3.5 py-3 text-[15px] outline-none resize-none transition-colors duration-300"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
              color: "var(--invitation-text)",
              fontFamily: "var(--font-royal-serif)",
            }}
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2.5 px-[26px] py-3.5 mt-1.5 border border-[var(--invitation-accent)] text-[var(--invitation-accent)] font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase cursor-pointer relative overflow-hidden transition-colors duration-300 hover:text-[var(--invitation-bg)] group"
        >
          <span className="absolute inset-0 bg-[var(--invitation-accent)] translate-y-[101%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <span className="relative z-[1]">Send My Reply</span>
        </button>
      </form>
    </SectionWrap>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative py-3.5 px-2.5 text-sm cursor-pointer transition-all duration-300"
      style={{
        background: active
          ? "color-mix(in srgb, var(--invitation-accent) 12%, transparent)"
          : "transparent",
        border: `1px solid ${active ? "var(--invitation-accent)" : "color-mix(in srgb, var(--invitation-accent) 18%, transparent)"}`,
        color: active ? "var(--invitation-accent)" : "var(--invitation-text)",
        fontFamily: "var(--font-royal-serif)",
      }}
    >
      {active && (
        <span className="absolute top-1 right-1.5 text-[var(--invitation-accent)] text-[10px]">
          ✓
        </span>
      )}
      {children}
    </button>
  );
}
