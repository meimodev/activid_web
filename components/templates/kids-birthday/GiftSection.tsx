"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useOverlayAssets } from "./overlays";
import type { BankAccount } from "@/types/invitation";

export interface GiftSectionProps {
  bankAccounts: BankAccount[];
  heading: string;
  description: string;
  templateName: string;
  eventDate: string;
}

const popVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.3 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      damping: 10,
      stiffness: 150,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { 
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
} as const;

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const;

export function GiftSection({
  bankAccounts,
  heading,
  description,
  templateName,
  eventDate,
}: GiftSectionProps) {
  const overlayAssets = useOverlayAssets();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);

  const waText = `ACTIVID INVITATION-${templateName}-${eventDate}`;
  const waUrl = `https://wa.me/6285756681077?text=${encodeURIComponent(waText)}`;

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
    <section className="relative overflow-hidden bg-wedding-bg px-4 py-20 text-wedding-dark">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60">
        <motion.div
          className="absolute inset-x-0 top-0 h-[100px] bg-top bg-cover bg-no-repeat opacity-100 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.zigzag})` }}
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--invitation-accent-2)_10%,var(--invitation-bg)),var(--invitation-bg))]" />
        <motion.div
          className="absolute -right-10 top-40 h-[280px] w-[280px] bg-contain bg-no-repeat opacity-60 mix-blend-multiply"
          style={{ backgroundImage: `url(${overlayAssets.stars})` }}
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -left-10 bottom-10 h-[200px] w-[200px] bg-contain bg-no-repeat opacity-70"
          style={{ backgroundImage: `url(${overlayAssets.giftBox})` }}
          animate={{ y: [0, -15, 0], rotate: [-10, 5, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[520px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center pt-8">
            <motion.div variants={popVariants}>
              <p className="font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white bg-wedding-accent/80 inline-block px-5 py-1.5 rounded-full border-2 border-white/40 shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_20%,transparent)] rotate-2">Kado Spesial</p>
            </motion.div>
            <motion.div variants={popVariants}>
              <h2 className="mt-5 font-black text-[46px] leading-none tracking-tight text-wedding-dark [text-shadow:2px_2px_0_white,4px_4px_0_var(--invitation-accent-2)]">
                {heading?.trim() || "Kirim Hadiah"}
              </h2>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative w-full mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div 
            variants={itemVariants}
            className="rounded-[48px] border-4 border-white bg-white/80 p-6 shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_20%,transparent),0_30px_70px_rgba(63,19,91,0.14)] backdrop-blur-xl"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            {description ? (
              <div className="mb-8 text-center bg-black/5 p-5 rounded-3xl border border-black/5">
                <p className="font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 whitespace-pre-line">
                  {description}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setIsGiftDialogOpen(true)}
              className="w-full rounded-full bg-wedding-accent-2 px-6 py-4 font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_60%,transparent)] transition-all hover:bg-wedding-accent-2/90 hover:scale-[1.02] active:scale-[0.98] active:translate-y-[4px] active:shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_60%,transparent)] mb-8"
            >
              Cari Kado Spesial
            </button>

            <div className="space-y-4">
              {bankAccounts.map((account, index) => {
                const k = `${account.bankName}-${index}`;
                const isExpanded = !!expandedKeys[k];

                return (
                  <motion.div
                    key={k}
                    className="relative overflow-hidden rounded-[32px] border-4 border-white bg-[linear-gradient(135deg,var(--invitation-bg),white)] shadow-[0_8px_0_0_color-mix(in_srgb,var(--invitation-dark)_10%,transparent)]"
                  >
                    <div className="relative p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-poppins-bold text-[12px] uppercase tracking-widest text-wedding-accent-2">
                            {account.bankName}
                          </p>
                          <p className="mt-1 font-black text-[18px] text-wedding-dark truncate">
                            {account.accountHolder}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedKeys((prev) => ({
                              ...prev,
                              [k]: !prev[k],
                            }))
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wedding-dark/5 text-wedding-dark transition-colors hover:bg-wedding-dark/10"
                          aria-expanded={isExpanded}
                        >
                          <motion.svg
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                          >
                            <path
                              d="M19 9l-7 7-7-7"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div
                            key="expanded"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t-2 border-wedding-dark/5">
                              <p className="font-mono text-2xl font-bold tracking-wider text-wedding-dark text-center">
                                {account.accountNumber}
                              </p>

                              <button
                                type="button"
                                onClick={() => copy(account.accountNumber, k)}
                                className="mt-4 w-full rounded-2xl bg-wedding-accent px-6 py-3 font-poppins-bold text-[13px] uppercase tracking-widest text-white shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)] transition-all active:translate-y-1 active:shadow-none"
                              >
                                {copiedKey === k ? "Berhasil Disalin!" : "Salin Rekening"}
                              </button>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {typeof document !== "undefined"
          ? createPortal(
              <AnimatePresence>
                {isGiftDialogOpen ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsGiftDialogOpen(false)}
                    className="fixed inset-0 z-[130] bg-wedding-dark/60 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20, rotate: 2 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-full max-w-[400px] overflow-hidden rounded-[40px] border-4 border-white bg-wedding-bg p-6 text-center shadow-[0_20px_0_0_color-mix(in_srgb,var(--invitation-dark)_15%,transparent),0_30px_70px_rgba(63,19,91,0.2)]"
                    >
                      <div className="absolute -top-10 -right-10 h-[150px] w-[150px] bg-contain bg-no-repeat opacity-60" style={{ backgroundImage: `url(${overlayAssets.partyHat})` }} />
                      <div className="absolute -bottom-10 -left-10 h-[150px] w-[150px] bg-contain bg-no-repeat opacity-50 mix-blend-multiply" style={{ backgroundImage: `url(${overlayAssets.stars})` }} />
                      
                      <div className="relative z-10">
                        <p className="font-poppins-bold text-[12px] uppercase tracking-widest text-white bg-wedding-accent-2 inline-block px-4 py-1.5 rounded-full border-2 border-white shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-accent-2)_40%,transparent)] rotate-2">
                          Promo Khusus
                        </p>
                        
                        <h4 className="mt-5 font-black text-[32px] leading-tight text-wedding-dark [text-shadow:2px_2px_0_white,3px_3px_0_var(--invitation-accent)]">
                          Diskon Spesial!
                        </h4>
                        
                        <p className="mt-4 font-poppins font-medium text-[15px] leading-relaxed text-wedding-dark/80 bg-white/80 p-4 rounded-3xl border-2 border-white">
                          Beli kado lewat link ini dan dapatkan diskon eksklusif hingga{" "}
                          <span className="font-black text-[18px] text-wedding-accent-2">25%</span>!
                          <br/><br/>Chat via WhatsApp untuk info lebih lanjut ya.
                        </p>

                        <div className="mt-6 flex flex-col gap-3">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full rounded-full bg-wedding-accent px-6 py-4 font-poppins-bold text-[14px] uppercase tracking-[0.2em] text-white shadow-[0_6px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)] transition-all hover:bg-wedding-accent/90 active:translate-y-[3px] active:shadow-[0_3px_0_0_color-mix(in_srgb,var(--invitation-accent)_60%,transparent)]"
                          >
                            Chat WhatsApp
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => setIsGiftDialogOpen(false)}
                            className="w-full rounded-full border-4 border-white bg-white/50 px-6 py-3 font-poppins-bold text-[14px] uppercase tracking-widest text-wedding-dark shadow-[0_4px_0_0_color-mix(in_srgb,var(--invitation-dark)_15%,transparent)] transition-all hover:bg-white/80 active:translate-y-[2px] active:shadow-none"
                          >
                            Tutup
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>,
              document.body,
            )
          : null}
      </div>
    </section>
  );
}
