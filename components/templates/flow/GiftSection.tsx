"use client";

import { useState } from "react";
import { DiamondAccent, HeartDivider, BankBuildingIcon, GoldLeafBorder } from "./graphics";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface GiftSectionProps {
  bankAccounts: BankAccount[];
  heading: string;
  description: string;
}

export function GiftSection({ bankAccounts, heading, description }: GiftSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1400);
  };

  return (
    <section className="section-curved py-24 bg-wedding-bg/90 backdrop-blur-md text-center relative">
      <GoldLeafBorder position="top" />

      <div className="max-w-2xl mx-auto px-4">
        <RevealOnScroll direction="down" width="100%">
          <div className="flex flex-col items-center">
            <DiamondAccent />
            <h2 className="font-script text-4xl text-gold-gradient mb-4 mt-4  py-5">
              {heading}
            </h2>
            <HeartDivider />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} width="100%">
          <p className="font-garet-book text-wedding-text-light mb-16 italic leading-relaxed whitespace-pre-line">{description}</p>
        </RevealOnScroll>

        <div className="grid gap-8 font-garet-book">
          {bankAccounts.map((account, index) => (
            <RevealOnScroll key={index} direction="up" delay={0.3 + (index * 0.1)} width="100%">
              <div className="p-10 border border-wedding-accent/30 rounded-sm relative group hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="absolute top-2 right-2 opacity-10">
                  <BankBuildingIcon />
                </div>
                <div className="font-poppins-bold text-2xl mb-4 text-wedding-dark">{account.bankName}</div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <p className="font-poppins text-xl tracking-wider text-wedding-accent">
                    {account.accountNumber}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      copy(account.accountNumber, `${account.bankName}-${index}`)
                    }
                    className="inline-flex items-center justify-center h-9 w-9 rounded-sm border border-wedding-accent/30 bg-wedding-bg/60 hover:bg-wedding-bg transition"
                    aria-label={
                      copiedKey === `${account.bankName}-${index}`
                        ? "Copied"
                        : "Copy account number"
                    }
                    title={
                      copiedKey === `${account.bankName}-${index}`
                        ? "Copied"
                        : "Copy"
                    }
                  >
                    {copiedKey === `${account.bankName}-${index}` ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-wedding-accent"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4 text-wedding-text-light"
                      >
                        <path
                          d="M8 4h10a2 2 0 0 1 2 2v10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 20H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-wedding-text-light uppercase tracking-widest font-garet-book font-bold">a.n {account.accountHolder}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
      <GoldLeafBorder position="bottom" />
    </section>
  );
}
