"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { BankAccount } from "@/types/invitation";
import { useOverlayAssets } from "./overlays";

export interface GiftSectionProps {
  bankAccounts: BankAccount[];
  heading: string;
  description: string;
  templateName: string;
  eventDate: string;
  isMarsMission?: boolean;
  isStarPrincess?: boolean;
  isUnicornDreams?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.85, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
} as const;

function BankAccountCard({ account, index }: { account: BankAccount; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(account.accountNumber);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = account.accountNumber;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [account.accountNumber]);

  return (
    <motion.div
      className="rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden"
      variants={itemVariants}
      animate={{ rotate: [-0.5, 0.5, -0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
      style={{
        boxShadow: "0 8px 24px rgba(0,0,0,0.2), 0 0 15px var(--invitation-accent-2)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] font-garet-book text-[14px] font-bold text-white/80"
            style={{ boxShadow: "0 0 10px var(--invitation-accent)" }}
          >
            {account.bankName.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="font-garet-book text-[13px] font-bold text-white/80">
              {account.bankName}
            </p>
            <p className="font-garet-book text-[11px] text-white/45">
              {account.accountHolder}
            </p>
          </div>
        </div>
        <motion.span
          className="text-white/40 text-lg"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          &#9660;
        </motion.span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="border-t border-white/[0.06] px-5 py-4">
          <p className="font-garet-book text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
            Nomor Rekening
          </p>
          <p className="font-mono text-[16px] tracking-[0.08em] text-white/80">
            {account.accountNumber}
          </p>
          <motion.button
            type="button"
            onClick={handleCopy}
            whileTap={{ scale: 0.95 }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5 font-garet-book text-[11px] font-bold uppercase tracking-[0.12em] text-white/60 backdrop-blur transition-colors hover:bg-white/[0.14]"
          >
            {copied ? "&#10003; Tersalin" : "Salin Rekening"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function GiftSection({
  bankAccounts,
  heading,
  description,
  templateName,
  eventDate,
}: GiftSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const assets = useOverlayAssets();

  return (
    <>
      <motion.section
        className="relative overflow-hidden px-5 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${assets.stars})`,
            backgroundSize: "cover",
          }}
        />

        <motion.div
          className="absolute left-6 top-14"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={assets.floatingPlanet2} alt="" className="w-14 h-auto opacity-35" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-sm">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1 font-garet-book text-[11px] uppercase tracking-[0.2em] text-white/55 backdrop-blur"
            variants={itemVariants}
          >
            &#127873; {heading}
          </motion.div>

          <motion.p
            className="mb-6 font-garet-book text-[13px] leading-relaxed text-white/50 whitespace-pre-line"
            variants={itemVariants}
          >
            {description}
          </motion.p>

          <motion.button
            type="button"
            onClick={() => setDialogOpen(true)}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mb-8 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 font-garet-book text-[13px] font-bold uppercase tracking-[0.15em] text-white"
            style={{
              background: `linear-gradient(135deg, var(--invitation-accent), var(--invitation-accent-2))`,
              boxShadow: "0 6px 24px var(--invitation-accent-2)",
            }}
          >
            &#127775; Cari Kado Spesial
          </motion.button>

          {bankAccounts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {bankAccounts.map((account, i) => (
                <BankAccountCard key={i} account={account} index={i} />
              ))}
            </div>
          ) : null}
        </div>
      </motion.section>

      {dialogOpen ? createPortal(
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDialogOpen(false)}
        >
          <motion.div
            className="w-full max-w-sm rounded-[32px] border border-white/15 bg-white/[0.08] backdrop-blur-2xl p-8"
            style={{
              boxShadow: "0 0 60px var(--invitation-accent-2), 0 20px 50px rgba(0,0,0,0.4)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                className="text-[48px] mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                &#127775;
              </motion.div>
              <h3 className="font-great-vibes text-[32px] text-white"
                style={{ textShadow: "0 0 40px var(--invitation-accent-2)" }}>
                Diskon Spesial!
              </h3>
              <p className="mt-3 font-garet-book text-[14px] leading-relaxed text-white/70">
                Dapatkan diskon 25% untuk kado spesial melalui link kami!
              </p>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik dengan kado spesial untuk ${templateName} di ${eventDate}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-garet-book text-[13px] font-bold uppercase tracking-[0.15em] text-white"
                style={{
                  background: `linear-gradient(135deg, var(--invitation-accent), var(--invitation-accent-2))`,
                  boxShadow: "0 4px 20px var(--invitation-accent-2)",
                }}
              >
                Chat via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="mt-4 font-garet-book text-[12px] text-white/40 hover:text-white/70 transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>,
        document.body,
      ) : null}
    </>
  );
}
