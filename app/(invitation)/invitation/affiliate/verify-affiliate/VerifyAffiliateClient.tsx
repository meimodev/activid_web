"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyAffiliateAction } from "../actions";

type UnverifiedAffiliate = {
  id: string;
  name: string;
  whatsappNumber: string;
  joinedAt: string;
};

export default function VerifyAffiliateClient({
  initialUnverified,
}: {
  initialUnverified: UnverifiedAffiliate[];
}) {
  const [unverified, setUnverified] = useState(initialUnverified);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    const result = await verifyAffiliateAction(id);
    if (result.ok) {
      setUnverified((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert(result.error ?? "Failed to verify affiliate.");
    }
    setVerifyingId(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid gap-6"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xs font-black uppercase tracking-widest text-indigo-300">Admin Portal</div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent"
              />
            </div>
            <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
              Verifikasi Affiliate
            </div>
            <div className="mt-2 text-sm text-indigo-100/70 max-w-md">
              Daftar akun affiliate baru yang menunggu persetujuan admin.
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-5 py-3 backdrop-blur-md relative overflow-hidden group">
             <motion.div 
              className="absolute inset-0 bg-fuchsia-400/10 blur-[20px]"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 text-xs font-black uppercase tracking-widest text-fuchsia-300/80">Menunggu</div>
            <div className="relative z-10 mt-1 text-2xl font-black text-fuchsia-300 drop-shadow-[0_0_12px_rgba(217,70,239,0.4)]">
              {unverified.length}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-black uppercase tracking-widest text-indigo-300/70 border-b border-white/10">
            <div className="col-span-3">Nama</div>
            <div className="col-span-3">WhatsApp</div>
            <div className="col-span-2">Affiliate ID</div>
            <div className="col-span-2">Tanggal Daftar</div>
            <div className="col-span-2 text-right">Aksi</div>
          </div>

          <AnimatePresence>
            {unverified.length > 0 ? (
              <div className="grid gap-3 mt-4">
                {unverified.map((affiliate) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    key={affiliate.id} 
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="sm:col-span-3 flex flex-col justify-center">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Nama</span>
                      <div className="font-bold text-sm text-white">{affiliate.name}</div>
                    </div>
                    <div className="sm:col-span-3 flex flex-col justify-center">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">WhatsApp</span>
                      <div className="font-mono text-sm text-indigo-200/70">
                        {affiliate.whatsappNumber}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex flex-col justify-center">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Affiliate ID</span>
                      <div className="text-sm font-mono text-indigo-200/70 bg-black/40 inline-flex px-2 py-1 rounded-lg w-fit group-hover:text-white transition-colors">
                        {affiliate.id}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex flex-col justify-center">
                      <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Tanggal Daftar</span>
                      <div className="text-xs text-indigo-200/50">
                        {affiliate.joinedAt}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex flex-col justify-center sm:items-end mt-2 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify(affiliate.id)}
                        disabled={verifyingId === affiliate.id}
                        className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50"
                      >
                        {verifyingId === affiliate.id ? "Memproses..." : "Verifikasi"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border border-emerald-500/30 border-dashed"
                  />
                </div>
                <div className="relative z-10 text-emerald-200/70 text-sm">
                  Tidak ada affiliate yang menunggu verifikasi.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
