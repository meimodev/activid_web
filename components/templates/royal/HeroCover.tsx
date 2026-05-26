"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Host } from "@/types/invitation";
import { Corner, Divider as OrnDivider } from "./graphics";

interface HeroCoverProps {
  onOpen: () => void;
  hosts: Host[];
  date: string;
  guestName?: string;
}

export function HeroCover({ onOpen, hosts, date }: HeroCoverProps) {
  const [state, setState] = useState<"idle" | "opening" | "done">("idle");
  const sealRef = useRef<HTMLDivElement>(null);

  const brideName = hosts?.[0]?.firstName ?? "Jhon";
  const groomName = hosts?.[1]?.firstName ?? "Jiny";

  function handleOpen() {
    if (state !== "idle") return;
    setState("opening");
    setTimeout(() => {
      setState("done");
      onOpen();
    }, 1900);
  }

  return (
    <AnimatePresence>
      {state !== "done" && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{
            background:
              "radial-gradient(140% 80% at 50% 30%, var(--invitation-bg-alt) 0%, var(--invitation-bg) 70%, var(--invitation-dark, #0a050c) 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          onClick={handleOpen}
        >
          {/* Glow */}
          <div
            className="absolute -inset-10 pointer-events-none rounded-full animate-[glow-pulse_4s_ease-in-out_infinite]"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--invitation-accent) 25%, transparent), transparent 70%)",
            }}
          />

          {/* Envelope frame */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "min(360px, 88vw)",
              aspectRatio: "5/7",
              perspective: "1400px",
              transform: state === "opening" ? "scale(1.02)" : "scale(1)",
              transition: "transform 1.6s cubic-bezier(0.2,0.7,0.2,1)",
            }}
          >
            {/* Envelope body */}
            <motion.div
              className="relative w-full h-full flex flex-col items-center justify-end px-7 pb-11 pt-9"
              style={{
                background:
                  "linear-gradient(155deg, var(--invitation-accent-2, #f2e3d5) 0%, color-mix(in srgb, var(--invitation-accent-2, #f2e3d5) 85%, black) 100%)",
                color: "var(--invitation-dark, #1a0e1c)",
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,97,0.4) inset",
                transformStyle: "preserve-3d",
              }}
              animate={
                state === "opening"
                  ? {
                      y: "-130%",
                      rotateZ: -2,
                      opacity: 0,
                      transition: {
                        duration: 1.2,
                        delay: 0.7,
                        ease: [0.6, 0.1, 0.2, 1],
                      },
                    }
                  : { y: 0, rotateZ: 0, opacity: 1 }
              }
            >
              {/* Corner ornaments */}
              <div className="absolute top-3.5 left-3.5 opacity-65">
                <Corner size={56} />
              </div>
              <div className="absolute bottom-3.5 right-3.5 opacity-65 rotate-180">
                <Corner size={56} />
              </div>

              {/* Content */}
              <motion.div
                className="font-[var(--font-royal-sans)] text-[9px] tracking-[0.4em] uppercase"
                style={{ color: "var(--invitation-accent)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                &mdash; You are cordially invited &mdash;
              </motion.div>

              <motion.div
                className="my-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 1 }}
              >
                <OrnDivider width={180} />
              </motion.div>

              <motion.div
                className="font-[var(--font-royal-script)] text-[56px] leading-[1.15] text-center pt-[0.05em]"
                style={{ color: "var(--invitation-dark, #1a0e1c)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {brideName}
                <br />
                <span
                  className="inline-block my-2 text-[28px] opacity-70 font-[var(--font-royal-serif)] italic"
                >
                  &amp;
                </span>
                <br />
                {groomName}
              </motion.div>

              <motion.div
                className="my-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <OrnDivider width={140} />
              </motion.div>

              <motion.div
                className="font-[var(--font-royal-serif)] text-[11px] tracking-[0.4em] uppercase"
                style={{ color: "var(--invitation-dark, #1a0e1c)" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                {date}
              </motion.div>

              <motion.div
                className="mt-8 font-[var(--font-royal-script)] text-lg animate-[float-soft_3s_ease-in-out_infinite]"
                style={{ color: "var(--invitation-accent)", opacity: 0.7 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1, duration: 1 }}
              >
                tap to open
              </motion.div>
            </motion.div>

            {/* Envelope flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 z-[5]"
              style={{
                height: "55%",
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--invitation-accent-2, #efe0cf) 110%, transparent) 0%, color-mix(in srgb, var(--invitation-accent-2, #d8c4ad) 80%, black) 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
                boxShadow: "0 2px 0 rgba(0,0,0,0.04) inset",
              }}
              animate={
                state === "opening"
                  ? {
                      rotateX: -180,
                      transition: { duration: 1.6, ease: [0.6, 0.1, 0.2, 1] },
                    }
                  : { rotateX: 0 }
              }
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 0%, color-mix(in srgb, var(--invitation-accent) 18%, transparent), transparent 60%)",
                }}
              />
            </motion.div>

            {/* Wax seal */}
            <motion.div
              ref={sealRef}
              className="absolute z-[6] flex items-center justify-center rounded-full font-[var(--font-royal-script)] text-2xl"
              style={{
                top: "22%",
                left: "50%",
                width: 60,
                height: 60,
                color: "var(--invitation-accent)",
                background:
                  "radial-gradient(circle at 30% 30%, var(--invitation-accent), var(--invitation-dark, #3a2240) 60%, rgb(58,19,49) 100%)",
                boxShadow:
                  "0 6px 18px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(201,169,97,0.4), inset 0 -8px 18px rgba(0,0,0,0.4), inset 0 6px 12px rgba(255,255,255,0.08)",
                transform: "translate(-50%, -50%)",
              }}
              animate={
                state === "opening"
                  ? {
                      opacity: 0,
                      scale: 0.6,
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }
                  : { opacity: 1, scale: 1 }
              }
            >
              <span className="relative z-[2]">
                {hosts?.[0]?.firstName?.[0] ?? "J"}&amp;{hosts?.[1]?.firstName?.[0] ?? "J"}
              </span>
              <div
                className="absolute inset-1.5 rounded-full border border-dashed"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--invitation-accent) 40%, transparent)",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
