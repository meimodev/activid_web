"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Receipt, Users } from "./icons";

export type Beat = 1 | 2 | 3 | 4;

const ROOM_NAME = "Komisi Pemuda";

const LEDGER = [
  { merchant: "Transfer Kas", amount: "+ Rp 500.000", category: "Pemasukan", positive: true },
  { merchant: "Indomaret", amount: "− Rp 85.000", category: "Konsumsi", positive: false },
  { merchant: "Gramedia", amount: "− Rp 142.000", category: "Perlengkapan", positive: false },
] as const;

const MEMBERS = ["YA", "RP", "DM", "SK", "+3"] as const;
const BALANCE = "Rp 273.000";

/**
 * Styled mockup of a shared LOIT budget room. `beat` controls how much has
 * been revealed (1 blank → 2 scanning receipt → 3 members + balance →
 * 4 full ledger). Pure presentation, driven by the parent (scroll or static).
 */
export function BudgetRoom({ beat }: { beat: Beat }) {
  const reduce = useReducedMotion();
  const rows = LEDGER.slice(0, beat <= 2 ? (beat === 2 ? 1 : 0) : beat === 3 ? 2 : 3);

  return (
    <div className="w-full max-w-[340px] rounded-[28px] border border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-700)] p-5 shadow-2xl">
      {/* Room header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--loit-mist)]">
            Ruang kas
          </p>
          <p className="loit-display text-lg font-bold text-[var(--loit-paper)]">{ROOM_NAME}</p>
        </div>
        <span className="rounded-full bg-[var(--loit-petrol-800)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--loit-mint-400)]">
          Aktif
        </span>
      </div>

      {/* Balance */}
      <div className="mt-4 rounded-2xl bg-[var(--loit-petrol-800)] p-4">
        <p className="text-[11px] text-[var(--loit-mist)]">Saldo ruang</p>
        <p className="loit-num mt-1 text-2xl font-bold text-[var(--loit-mint-500)]">
          {beat >= 3 ? BALANCE : "Rp 0"}
        </p>
        {/* Member avatars appear from beat 3 */}
        <AnimatePresence>
          {beat >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center gap-1.5"
            >
              {MEMBERS.map((m, i) => (
                <motion.span
                  key={m}
                  initial={{ scale: reduce ? 1 : 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: reduce ? 0 : i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-700)] text-[10px] font-semibold text-[var(--loit-paper)]"
                >
                  {m}
                </motion.span>
              ))}
              <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] text-[var(--loit-mist)]">
                <Users className="h-3 w-3" /> semua bisa lihat
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scanning receipt (beat 2 magic moment) */}
      <AnimatePresence>
        {beat === 2 && (
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 40, rotate: reduce ? 0 : 4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative mt-3 overflow-hidden rounded-2xl border border-dashed border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-800)] p-4"
          >
            <div className="flex items-center gap-2 text-[var(--loit-mist)]">
              <Receipt className="h-4 w-4" />
              <span className="text-xs">Struk · Indomaret</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-[var(--loit-petrol-600)]" />
              <div className="h-1.5 w-1/2 rounded-full bg-[var(--loit-petrol-600)]" />
              <div className="h-1.5 w-2/3 rounded-full bg-[var(--loit-petrol-600)]" />
            </div>
            {/* Mint scan-line sweep */}
            {!reduce && (
              <motion.div
                aria-hidden
                initial={{ y: "-10%" }}
                animate={{ y: "120%" }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[var(--loit-mint-500)]/40 to-transparent"
              />
            )}
            <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-medium text-[var(--loit-mint-400)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--loit-mint-500)]" />
              AI membaca struk…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ledger rows */}
      <div className="mt-3 space-y-2">
        <AnimatePresence initial={false}>
          {rows.map((row) => (
            <motion.div
              key={row.merchant}
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between rounded-xl bg-[var(--loit-petrol-800)] px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--loit-petrol-700)] text-[var(--loit-mint-400)]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--loit-paper)]">{row.merchant}</p>
                  <p className="text-[10px] text-[var(--loit-mist)]">{row.category}</p>
                </div>
              </div>
              <span
                className={`loit-num text-xs font-semibold ${
                  row.positive ? "text-[var(--loit-mint-500)]" : "text-[var(--loit-paper)]"
                }`}
              >
                {row.amount}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {beat === 1 && (
          <p className="rounded-xl border border-dashed border-[var(--loit-petrol-600)] px-3 py-6 text-center text-xs text-[var(--loit-mist)]">
            Ruang masih kosong. Foto struk pertama kamu.
          </p>
        )}
        {beat === 4 && (
          <p className="pt-1 text-center text-[11px] text-[var(--loit-mist)]">
            semua anggota bisa lihat
          </p>
        )}
      </div>
    </div>
  );
}
