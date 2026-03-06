"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { verifyAdminPassword } from "./actions";

export default function AdminAuthClient() {
  const [state, action, pending] = useActionState(verifyAdminPassword, {});
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-xs font-black uppercase tracking-widest text-indigo-300">Akses Terbatas</div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent"
        />
      </div>
      <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
        Admin Portal
      </div>
      <div className="mt-2 text-sm text-indigo-100/70">
        Silakan masukkan kata sandi admin untuk mengakses halaman ini.
      </div>

      <form action={action} className="mt-8 grid gap-5">
        <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
          Kata Sandi Admin
          <input
            name="password"
            type="password"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
            placeholder="Masukkan kata sandi..."
          />
        </label>

        {state.error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200 backdrop-blur-md">
            {state.error}
          </div>
        ) : null}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={pending}
          className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60"
        >
          {pending ? "Memverifikasi..." : "Akses Portal"}
        </motion.button>
      </form>
    </motion.div>
  );
}