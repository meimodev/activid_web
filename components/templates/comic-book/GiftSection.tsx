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

const rowVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: "spring", stiffness: 80, damping: 20,
      when: "beforeChildren",
      staggerChildren: 0.15
    } 
  }
} as const;

const popVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
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
      variants={popVariants}
      className="w-full"
    >
      <motion.div
        className="relative overflow-hidden rounded-[24px] border-4 border-black bg-white shadow-[6px_6px_0_0_black]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-5 py-4 text-left active:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-wedding-accent text-white border-2 border-black font-garet-book text-[16px] font-black shadow-[2px_2px_0_0_black] -rotate-2"
            >
              {account.bankName.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <p className="font-garet-book text-[16px] font-black text-black">
                {account.bankName}
              </p>
              <p className="font-garet-book text-[14px] text-black/70 font-bold">
                {account.accountHolder}
              </p>
            </div>
          </div>
          <motion.span
            className="text-black text-xl"
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
          <div className="border-t-4 border-black px-5 py-5 bg-wedding-accent-2/10">
            <p className="font-garet-book text-[12px] uppercase font-black tracking-[0.2em] text-black mb-2">
              Nomor Rekening
            </p>
            <p className="font-mono text-[20px] font-bold tracking-[0.08em] text-black bg-white border-2 border-black p-2 text-center rounded-lg shadow-[2px_2px_0_0_black] rotate-1">
              {account.accountNumber}
            </p>
            <motion.button
              type="button"
              onClick={handleCopy}
              className="mt-4 w-full inline-flex items-center justify-center rounded-xl border-4 border-black bg-wedding-accent px-5 py-3 font-garet-book font-black text-[14px] uppercase tracking-widest text-white shadow-[4px_4px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] -rotate-1"
            >
              {copied ? "Tersalin!" : "Salin Rekening"}
            </motion.button>
          </div>
        </motion.div>
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
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--invitation-bg),color-mix(in_srgb,var(--invitation-accent-2)_8%,var(--invitation-bg)))] px-0 py-20 text-wedding-dark">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
          <motion.div
            className="absolute left-6 top-14"
            animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={assets.floatingPlanet2} alt="" className="w-14 h-auto opacity-35" />
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-[520px]">
          <motion.div
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative w-[110%] -ml-[5%] bg-black p-[5px] grid grid-cols-2 gap-[5px] z-10 -rotate-1 shadow-[8px_8px_0_0_black] mb-20"
          >
            {/* Asymmetrical Top Border */}
            <svg className="absolute top-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
              <polygon points="0,12 100,0 100,12" fill="black" />
            </svg>
            {/* Asymmetrical Bottom Border */}
            <svg className="absolute bottom-[-10px] left-0 w-full h-[12px] z-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 12">
              <polygon points="0,0 100,12 0,12" fill="black" />
            </svg>

            {/* Header Panel */}
            <div className="col-span-2 bg-wedding-accent flex justify-center items-center py-12 relative overflow-hidden bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px]">
              <motion.div variants={popVariants} className="relative z-20">
                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 pointer-events-none" style={{ clipPath: "polygon(5% 0%, 100% 5%, 95% 100%, 0% 90%)" }} />
                <div className="relative bg-white px-8 py-5 flex items-center justify-center border-4 border-black" style={{ clipPath: "polygon(5% 0%, 100% 5%, 95% 100%, 0% 90%)" }}>
                  <h2 className="font-black text-[32px] leading-none tracking-tight text-black uppercase rotate-[2deg]">
                    {heading}
                  </h2>
                </div>
              </motion.div>
            </div>

            {/* Description & Action Panel */}
            <div className="col-span-2 bg-white px-6 py-10 flex flex-col items-center text-center relative overflow-hidden">
              {/* Doodle texture overlay */}
              <div className="absolute inset-0 opacity-10 mix-blend-multiply pointer-events-none z-10" style={{ backgroundImage: "url('/images/comic-book/school-doodles.png')", backgroundSize: "180px" }} />

              <motion.div variants={popVariants} className="relative z-20 w-full">
                <div className="relative rounded-[24px] border-4 border-black bg-white px-6 py-8 shadow-[8px_8px_0_0_black] -rotate-1">
                  {/* Speech bubble pointy tail */}
                  <div className="absolute top-[-10px] left-10 w-5 h-5 bg-white border-l-4 border-t-4 border-black rotate-45" />
                  <p className="font-garet-book font-bold text-[16px] leading-relaxed text-black">
                    {description}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={popVariants} className="relative z-20 w-full mt-10">
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="w-full rounded-[16px] border-4 border-black bg-wedding-accent-2 px-8 py-4 font-garet-book font-black text-[18px] uppercase tracking-widest text-white shadow-[6px_6px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] rotate-1"
                >
                  Cari Kado Spesial!
                </button>
              </motion.div>
            </div>

            {/* Bank Accounts Panel */}
            {bankAccounts.length > 0 && (
              <div className="col-span-2 bg-wedding-accent-2 bg-[linear-gradient(rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] bg-[size:16px_16px] p-6 flex flex-col gap-6 relative">
                 <div className="absolute top-0 left-0 w-full h-[6px] bg-black" />
                 {bankAccounts.map((account, i) => (
                    <BankAccountCard key={i} account={account} index={i} />
                 ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {dialogOpen ? createPortal(
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-wedding-accent/90 backdrop-blur-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDialogOpen(false)}
        >
          {/* Halftone texture behind modal */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <motion.div
            className="relative z-10 w-full max-w-sm rounded-[32px] border-[6px] border-black bg-white p-8 shadow-[16px_16px_0_0_black] rotate-1"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 1 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                className="text-[64px] mb-2 drop-shadow-[4px_4px_0_black]"
                animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                &#127873;
              </motion.div>
              <h3 className="font-black text-[32px] text-white uppercase tracking-wider [text-shadow:-2px_-2px_0_black,2px_-2px_0_black,-2px_2px_0_black,2px_2px_0_black,4px_4px_0_var(--invitation-accent)] rotate-[-2deg]">
                Diskon Spesial!
              </h3>
              <div className="mt-4 border-4 border-black bg-wedding-bg p-4 rounded-xl shadow-[4px_4px_0_0_black] rotate-1">
                <p className="font-garet-book font-bold text-[16px] leading-snug text-black">
                  Dapatkan diskon 25% untuk kado spesial melalui link kami!
                </p>
              </div>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya tertarik dengan kado spesial untuk ${templateName} di ${eventDate}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl border-4 border-black bg-wedding-accent-2 px-6 py-4 font-garet-book font-black text-[16px] uppercase tracking-widest text-white shadow-[6px_6px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] -rotate-2"
              >
                Chat via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="mt-6 inline-block rounded-full border-2 border-black bg-white px-6 py-2 font-garet-book font-black text-[14px] uppercase tracking-widest text-black shadow-[4px_4px_0_0_black] transition-all active:scale-95 active:translate-y-1 active:shadow-[2px_2px_0_0_black] rotate-1 hover:bg-gray-100"
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
