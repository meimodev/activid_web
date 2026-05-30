"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { RevealOnScroll } from "@/components/invitation/RevealOnScroll";
import type { GiftSectionProps } from "./InfoSections.types";
import { EDEN_OVERLAY_ASSETS } from "./graphics/overlays";
import { CornerLineTopLeft, CornerLineBottomRight, TwinLineDivider, DottedDivider } from "./graphics/ornaments";
import { GrowingSwayingFloral } from "./graphics/GrowingSwayingFloral";

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
    <section className="relative overflow-hidden bg-wedding-bg py-24 text-wedding-accent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto w-full max-w-2xl">
          <RevealOnScroll direction="up" distance={20} delay={0.1}>
            <div className="text-center flex flex-col items-center">
              <GrowingSwayingFloral
                src={EDEN_OVERLAY_ASSETS.dividerFlower}
                initialRotate={0}
                className="w-24 h-12 mb-4 opacity-70 mix-blend-multiply"
                growDelay={0.15}
                swayDuration={6.5}
                originX="50%"
                originY="100%"
              />
              <h2 className="font-display italic text-[48px] leading-none text-wedding-accent">
                {heading}
              </h2>
              <TwinLineDivider />
            </div>
          </RevealOnScroll>

          {description && (
            <RevealOnScroll direction="up" distance={20} delay={0.2}>
              <div className="mt-8 text-center max-w-md mx-auto">
                <p className="text-[16px] text-wedding-accent/80 whitespace-pre-line font-body italic leading-relaxed">
                  {description}
                </p>
                <DottedDivider />
              </div>
            </RevealOnScroll>
          )}

          <RevealOnScroll direction="up" distance={20} delay={0.3}>
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setIsGiftDialogOpen(true)}
                className="inline-flex items-center justify-center border border-wedding-accent px-10 py-[0.8rem] text-wedding-accent hover:bg-wedding-accent hover:text-wedding-on-accent transition-colors"
              >
                <span className="text-[12px] uppercase tracking-[0.25em] font-body font-bold">
                  Kirim Hadiah
                </span>
              </button>
            </div>
          </RevealOnScroll>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
            {bankAccounts.map((account, index) => {
              const k = `${account.bankName}-${index}`;
              const isExpanded = !!expandedKeys[k];

              return (
                <RevealOnScroll
                  key={k}
                  direction="up"
                  distance={20}
                  delay={0.2 + index * 0.1}
                >
                  <div className="relative p-2 h-full">
                    <div className="absolute inset-0 rounded-[24px] border-[1px] border-wedding-accent/40 pointer-events-none" />
                    <div className="absolute inset-1.5 rounded-[18px] border-[1px] border-wedding-accent/20 pointer-events-none" />
                    <div className="absolute -top-1.5 -left-1.5 z-10 pointer-events-none opacity-40">
                      <CornerLineTopLeft />
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 z-10 pointer-events-none opacity-40">
                      <CornerLineBottomRight />
                    </div>
                    <div className="relative overflow-hidden bg-wedding-bg rounded-[14px] h-full flex flex-col">
                      <GrowingSwayingFloral
                        src={EDEN_OVERLAY_ASSETS.cardFlower}
                        initialRotate={0}
                        className="absolute -bottom-10 -right-10 w-40 h-40 pointer-events-none opacity-50 mix-blend-multiply"
                        growDelay={0.2}
                        swayDuration={7.2 + index * 0.9}
                        originX="90%"
                        originY="90%"
                      />
                      
                      <div className="relative p-8 text-center flex-1 z-10">
                        <p className="text-[14px] tracking-[0.3em] uppercase text-wedding-accent/80 font-body font-bold">
                          {account.bankName}
                        </p>
                        <p className="mt-4 text-[18px] text-wedding-accent font-display font-medium">
                          {account.accountHolder}
                        </p>

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedKeys((prev) => ({
                              ...prev,
                              [k]: !prev[k],
                            }))
                          }
                          className="inline-flex items-center justify-center h-10 w-10 border border-wedding-accent/30 rounded-full text-wedding-accent hover:bg-wedding-accent hover:text-wedding-on-accent transition-colors"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
                          >
                            <path
                              d="M8 5l8 7-8 7"
                              stroke="currentColor"
                              strokeWidth="1.5"
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
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="mt-6 overflow-hidden border-t border-wedding-accent/10 pt-6"
                          >
                            <p className="font-display text-2xl tracking-widest text-wedding-accent">
                              {account.accountNumber}
                            </p>

                            <button
                              type="button"
                              onClick={() => copy(account.accountNumber, k)}
                              className="mt-6 inline-flex items-center justify-center px-8 py-2 border border-wedding-accent/50 rounded-full hover:bg-wedding-accent hover:text-wedding-on-accent transition-colors"
                            >
                              <span className="text-[11px] uppercase tracking-[0.25em] font-body font-bold text-wedding-accent inherit-text-on-hover">
                                {copiedKey === k ? "Disalin!" : "Salin"}
                              </span>
                            </button>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                </RevealOnScroll>
              );
            })}
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
                      className="fixed inset-0 z-[130] bg-wedding-bg/90 backdrop-blur-sm flex items-center justify-center p-6"
                      role="dialog"
                      aria-modal="true"
                      aria-label="Kirim hadiah"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md border border-wedding-accent/20 bg-wedding-bg p-10 text-center shadow-2xl rounded-[24px]"
                      >
                        <p className="text-[12px] tracking-[0.3em] uppercase text-wedding-accent/60 font-body font-bold">
                          Info
                        </p>
                        <h4 className="mt-4 font-display italic text-4xl leading-none text-wedding-accent">
                          Exclusive Discount
                        </h4>
                        <p className="mt-6 text-[16px] text-wedding-accent/80 font-body leading-relaxed">
                          Dapatkan discount exclusive hingga{" "}
                          <span className="font-bold text-wedding-accent">
                            25%
                          </span>{" "}
                          untuk pemesanan hadiah melalui partner kami.
                        </p>

                        <div className="mt-10 flex flex-col gap-4">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full inline-flex items-center justify-center border border-wedding-accent bg-wedding-accent px-6 py-3 font-body font-bold text-[12px] uppercase tracking-[0.2em] text-wedding-on-accent transition-colors hover:bg-transparent hover:text-wedding-accent"
                          >
                            Hubungi via WhatsApp
                          </a>
                          
                          <button
                            type="button"
                            onClick={() => setIsGiftDialogOpen(false)}
                            className="w-full inline-flex items-center justify-center border border-transparent px-6 py-3 font-body font-bold text-[12px] uppercase tracking-[0.2em] text-wedding-accent/70 transition-colors hover:text-wedding-accent"
                          >
                            Tutup
                          </button>
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
