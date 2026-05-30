"use client";

import { useState } from "react";
import { BankAccount } from "@/types/invitation";
import { SectionWrap } from "./SectionWrap";
import { SectionHead } from "./Hero";
import { Reveal } from "./graphics/reveal";

interface GiftSectionProps {
  description?: string;
  bankAccounts: BankAccount[];
  templateName: string;
  eventDate: string;
}

export function GiftSection({
  description,
  bankAccounts,
}: GiftSectionProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  async function copy(num: string) {
    try {
      await navigator.clipboard.writeText(num.replace(/\s|‧/g, ""));
    } catch {
      // clipboard not available
    }
    setCopied(num);
    setTimeout(() => setCopied(""), 1800);
  }

  return (
    <SectionWrap id="gift">
      <Reveal>
        <SectionHead
          eyebrow="Your blessings are enough"
          title="A token of"
          em="love"
          sub={
            description ||
            "If you wish to send a gift to brighten our new beginning, here is the way."
          }
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="text-center">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-[26px] py-3.5 border border-[var(--invitation-accent)] text-[var(--invitation-accent)] font-[var(--font-royal-sans)] text-[11px] tracking-[0.32em] uppercase cursor-pointer relative overflow-hidden transition-colors duration-300 hover:text-[var(--invitation-bg)] group"
            >
              <span className="absolute inset-0 bg-[var(--invitation-accent)] translate-y-[101%] transition-transform duration-500 ease-out group-hover:translate-y-0" />
              <span className="relative z-[1]">Reveal Gift Details</span>
            </button>
          )}
        </div>

        <div
          className="grid gap-3.5 transition-all duration-700 ease-out overflow-hidden"
          style={{
            maxHeight: open ? "600px" : "0px",
            opacity: open ? 1 : 0,
            marginTop: open ? "24px" : "0px",
          }}
        >
        {bankAccounts.map((a, i) => (
          <div
            key={i}
            className="p-4.5 relative"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18))",
              border: "1px solid color-mix(in srgb, var(--invitation-accent) 18%, transparent)",
            }}
          >
            <span className="absolute -top-px -left-px w-3.5 h-3.5 border-l border-t border-[var(--invitation-accent)] opacity-70" />
            <span className="absolute -bottom-px -right-px w-3.5 h-3.5 border-r border-b border-[var(--invitation-accent)] opacity-70" />
            <div className="font-[var(--font-royal-sans)] text-xs tracking-[0.18em] uppercase text-[var(--invitation-accent-light)]">
              {a.bankName}
            </div>
            <div className="font-[var(--font-royal-serif)] font-light text-lg text-[var(--invitation-text)] mt-1.5">
              {a.accountHolder}
            </div>
            <div className="flex items-center justify-between mt-2.5 gap-3">
              <div className="font-mono text-sm tracking-[0.05em] text-[var(--invitation-accent)]">
                {a.accountNumber}
              </div>
              <button
                onClick={() => copy(a.accountNumber)}
                className="bg-transparent border px-3 py-2 font-[var(--font-royal-sans)] text-[10px] tracking-[0.2em] uppercase cursor-pointer transition-all duration-300"
                style={{
                  borderColor: "color-mix(in srgb, var(--invitation-accent) 35%, transparent)",
                  color:
                    copied === a.accountNumber
                      ? "var(--invitation-accent)"
                      : "var(--invitation-text)",
                }}
              >
                {copied === a.accountNumber ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
      </Reveal>
    </SectionWrap>
  );
}
