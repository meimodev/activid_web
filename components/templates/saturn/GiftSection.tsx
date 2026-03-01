"use client";

import { BankAccount } from "@/types/invitation";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { StarDivider, CosmicDivider } from "./graphics/ornaments";
import { BankBuildingIcon } from "./graphics/icons";
import { motion } from "framer-motion";

interface GiftSectionProps {
  bankAccounts: BankAccount[];
  heading: string;
  description: string;
}

export function GiftSection({ bankAccounts, heading, description }: GiftSectionProps) {
  return (
    <section className="py-32 relative text-wedding-on-dark bg-wedding-dark">
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
