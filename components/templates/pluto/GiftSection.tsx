"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import { OverlayReveal } from "./graphics";
import { PLUTO_OVERLAY_ASSETS } from "./graphics/overlays";
import type { GiftSectionProps } from "./InfoSections.types";

export function GiftSection({
  bankAccounts,
  heading,
  description,
  templateName,
  eventDate,
}: GiftSectionProps) {
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
    <section className="relative overflow-hidden bg-[#4F5B4B] py-24 text-white ">
      

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto w-full max-w-4xl">
          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.08}
            width="100%"
          >
            <div className="flex items-center justify-center">
              <h2 className="font-brittany-signature text-[62px] leading-none text-white ">
                {heading}
              </h2>
            </div>
          </RevealOnScroll>

          {description ? (
            <RevealOnScroll
              direction="up"
              distance={18}
              delay={0.18}
              width="100%"
            >
              <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-7 shadow-[0_18px_50px_rgba(0,0,0,0.20)]">
                <p className="text-center text-sm text-white/80 whitespace-pre-line font-poppins">
                  {description}
                </p>
              </div>
            </RevealOnScroll>
          ) : null}

          <RevealOnScroll
            direction="up"
            distance={18}
            delay={0.22}
            width="100%"
          >
            <button
              type="button"
              onClick={() => setIsGiftDialogOpen(true)}
              className="mt-8 w-full inline-flex items-center justify-center rounded-full px-6 py-3 border border-white/25 bg-white/10 text-white hover:bg-white/15 transition"
            >
              <span className="text-xs uppercase tracking-[0.25em] font-poppins">
                KIRIM HADIAH
              </span>
            </button>
          </RevealOnScroll>

          <div className="relative mt-4">
            <OverlayReveal
              delay={0.12}
              idle="none"
              className="pointer-events-none translate-y-1 h-[65px] z-10"
            >
              <motion.div
                className="pointer-events-none translate-y-1 h-[65px] z-10 h-full w-full bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${PLUTO_OVERLAY_ASSETS.bottomFloral})`,
                }}
                animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </OverlayReveal>

            <div className="relative z-20 grid grid-cols-1 gap-4 ">
              {bankAccounts.map((account, index) => {
                const k = `${account.bankName}-${index}`;
                const isExpanded = !!expandedKeys[k];

                return (
                  <RevealOnScroll
                    key={k}
                    direction="up"
                    distance={18}
                    delay={0.24 + index * 0.08}
                    width="100%"
                  >
                    <div className="relative overflow-hidden rounded-3xl border border-[#2d3418]/20 shadow-[0_18px_50px_rgba(0,0,0,0.20)] bg-[#2d3418]">
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-white/6 backdrop-blur"
                      />

                      <div className="relative p-7">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs tracking-[0.35em] uppercase text-white/75 font-poppins">
                              {account.bankName}
                            </p>
                            <p className="mt-3 text-sm text-white/90 font-poppins truncate">
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
                            className="shrink-0 inline-flex items-center justify-center rounded-full h-9 w-9 border border-white/20 bg-white/8 hover:bg-white/12 transition"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? "Collapse" : "Expand"}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className={`h-4 w-4 text-white transition-transform duration-200 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
                            >
                              <path
                                d="M8 5l8 7-8 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              key="expanded"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: "easeOut" }}
                              className="mt-5 overflow-hidden"
                            >
                              <p className="font-mono text-2xl tracking-wide text-white">
                                {account.accountNumber}
                              </p>

                              <button
                                type="button"
                                onClick={() => copy(account.accountNumber, k)}
                                className="mt-5 inline-flex w-full items-center justify-center rounded-full px-6 py-3 border border-white/20 bg-white/10 hover:bg-white/15 transition"
                              >
                                <span className="text-xs uppercase tracking-[0.25em] font-poppins text-white">
                                  {copiedKey === k ? "Copied" : "Copy"}
                                </span>
                              </button>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>

          {typeof document !== "undefined"
            ? createPortal(
                <AnimatePresence>
                  {isGiftDialogOpen ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsGiftDialogOpen(false)}
                      className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
                      role="dialog"
                      aria-modal="true"
                      aria-label="Kirim hadiah"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg rounded-3xl border border-[#8b7a57]/20 bg-[#EFE7D6] p-7 shadow-2xl"
                      >
                        <p className="text-xs tracking-[0.35em] uppercase text-[#6B5B5B] font-poppins">
                          Info
                        </p>
                        <h4 className="mt-3 font-brittany-signature text-5xl leading-none text-[#2B2424]">
                          Exclusive Discount
                        </h4>
                        <p className="mt-4 text-sm text-[#3A2F2F]/80 font-poppins">
                          Anda akan mendapatkan exclusive discount hingga{" "}
                          <span className="font-poppins-bold text-[#2B2424]">
                            25%
                          </span>{" "}
                          untuk pemesanan hadiah dari link ini. &quot;Chat
                          WhatsApp&quot; untuk informasi lebih lanjut.
                        </p>

                        <div className="mt-7 grid grid-cols-1 gap-3">
                          <button
                            type="button"
                            onClick={() => setIsGiftDialogOpen(false)}
                            className="rounded-full px-6 py-3 border border-[#8b7a57]/25 bg-white/70 hover:bg-white transition"
                          >
                            <span className="text-xs uppercase tracking-[0.25em] font-poppins">
                              Tutup
                            </span>
                          </button>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full px-6 py-3 bg-[#4F5B4B] text-white hover:bg-[#445142] transition text-center"
                          >
                            <span className="text-xs uppercase tracking-[0.25em] font-poppins">
                              Chat WhatsApp
                            </span>
                          </a>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>,
                document.body,
              )
            : null}
        </div>
      </div>
    </section>
  );
}
