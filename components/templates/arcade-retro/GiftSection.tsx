"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InvitationConfig } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

type Gift = InvitationConfig["sections"]["gift"];

interface GiftSectionProps {
  gift: Gift;
}

const revealEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.65, ease: revealEase } 
  },
};

export function GiftSection({ gift }: GiftSectionProps) {
  const assets = useOverlayAssets();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!gift || !gift.enabled) return null;

  const handleCopy = (num: string, id: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const displayHeading = gift.heading || "KADO SPESIAL";
  const displayDesc = gift.description || "Jika ingin mengirimkan kado tambahan, silakan transfer lewat rekening berikut:";

  return (
    <section className="relative overflow-hidden bg-transparent py-20 px-4">
      <div className="relative z-10 mx-auto w-full max-w-[500px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative bg-wedding-dark rounded-[24px] border-[5px] border-black p-6 shadow-[0_10px_0_0_black,0_15px_30px_rgba(0,0,0,0.35)] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--invitation-bg) 40%, var(--invitation-dark) 100%)`,
          }}
        >
          {/* Header decoration */}
          <motion.div variants={rowVariants} className="text-center mb-6">
            <h3 className="font-mono font-black text-[22px] text-white uppercase tracking-widest [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000,3px_3px_0_var(--invitation-accent)]">
              {displayHeading}
            </h3>
          </motion.div>

          {/* Description */}
          {displayDesc && (
            <motion.div variants={rowVariants} className="bg-black/40 border-[3px] border-black p-4 rounded-[12px] mb-6 text-center font-mono text-[10px] leading-relaxed text-white/80 uppercase tracking-wider">
              {displayDesc}
            </motion.div>
          )}

          {/* Bank Accounts as Loot slots */}
          <div className="space-y-6">
            {gift.bankAccounts?.map((account, idx) => {
              const uId = `${account.accountNumber}-${idx}`;
              const isCopied = copiedId === uId;

              return (
                <motion.div
                  key={uId}
                  variants={rowVariants}
                  className="relative bg-black/50 border-[3px] border-black p-5 rounded-[16px] shadow-[4px_4px_0_0_black] flex flex-col justify-between"
                >
                  {/* Rare Loot label */}
                  <div className="absolute -top-3.5 left-4 bg-wedding-accent border-[2px] border-black text-white px-2 py-0.5 rounded font-mono font-black text-[8px] uppercase tracking-widest shadow-[2px_2px_0_0_black]">
                    RARE LOOT SLOT {idx + 1}
                  </div>

                  <div className="mt-2 space-y-3 font-mono text-center">
                    {/* Bank Name */}
                    <div className="text-[14px] font-black text-wedding-accent-2 tracking-widest uppercase">
                      [{account.bankName}]
                    </div>

                    {/* Account Number */}
                    <div className="bg-black/60 border border-white/10 rounded-[8px] py-2 px-3 inline-block font-mono text-[16px] font-black tracking-widest text-white [text-shadow:1px_1px_0_#000]">
                      {account.accountNumber}
                    </div>

                    {/* Account Holder */}
                    <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
                      HOLDER: {account.accountHolder}
                    </div>
                  </div>

                  {/* Copy button */}
                  <div className="mt-4 flex justify-center">
                    <motion.button
                      onClick={() => handleCopy(account.accountNumber, uId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative inline-flex items-center justify-center border-[2px] border-black px-4 py-2 rounded-[6px] font-mono font-black text-[9px] uppercase tracking-wider shadow-[2px_2px_0_0_black] transition-colors ${
                        isCopied ? "bg-lime-500 text-black" : "bg-yellow-400 text-black hover:bg-yellow-300"
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isCopied ? (
                          <motion.span
                            key="copied"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-1.5"
                          >
                            ✔️ COPIED TO INVENTORY
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            📥 COPY LOOT VALUE
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
