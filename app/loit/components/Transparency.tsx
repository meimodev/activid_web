"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { TRANSPARENCY } from "../data";
import { Eyebrow, Heading } from "./ui";
import { Users } from "./icons";

const MEMBERS = [
  { initials: "YA", name: "Yani" },
  { initials: "RP", name: "Reza" },
  { initials: "DM", name: "Dina" },
];
const FINAL_BALANCE = 273000;

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

/** Counts up to the final balance once scrolled into view. */
function CountUp({ to }: { to: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className="loit-num">
      {formatRp(value)}
    </span>
  );
}

export function Transparency() {
  return (
    <section className="bg-[var(--loit-petrol-900)] px-5 py-[88px] sm:px-8 lg:py-[140px]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow>{TRANSPARENCY.eyebrow}</Eyebrow>
          <Heading
            text={TRANSPARENCY.h2}
            highlight={TRANSPARENCY.highlight}
            className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight text-[var(--loit-paper)]"
          />
          <p className="mt-6 max-w-lg text-[17px] leading-[1.6] text-[var(--loit-mist)]">
            {TRANSPARENCY.body}
          </p>
        </div>

        {/* Shared-ledger visual: every member sees the same balance. */}
        <div className="space-y-3">
          {MEMBERS.map((m, i) => (
            <motion.div
              key={m.initials}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="flex items-center justify-between rounded-2xl border border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-700)] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--loit-petrol-800)] text-sm font-semibold text-[var(--loit-paper)]">
                  {m.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--loit-paper)]">{m.name}</p>
                  <p className="text-[11px] text-[var(--loit-mist)]">Anggota ruang</p>
                </div>
              </div>
              <span className="text-base font-semibold text-[var(--loit-mint-500)]">
                <CountUp to={FINAL_BALANCE} />
              </span>
            </motion.div>
          ))}
          <p className="flex items-center justify-center gap-2 pt-1 text-xs text-[var(--loit-mist)]">
            <Users className="h-3.5 w-3.5" /> Saldo yang sama, buat semua orang.
          </p>
        </div>
      </div>
    </section>
  );
}
