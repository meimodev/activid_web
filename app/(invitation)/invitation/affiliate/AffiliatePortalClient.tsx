"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginAffiliate, registerAffiliate } from "./actions";

const DEFAULT_VERIFICATION_WHATSAPP_NUMBER = "62881080088816";

type TabKey = "register" | "login";

type WizardStep = 1 | 2 | 3;

function normalizeDigits(value: string): string {
  return (value ?? "").replace(/[^0-9]/g, "");
}

function stripLeadingZeros(value: string): string {
  return (value ?? "").replace(/^0+/, "");
}

function formatLocalWhatsapp(value: string): string {
  const digits = stripLeadingZeros(normalizeDigits(value));
  if (!digits) return "";

  if (digits.length <= 8) return digits;

  const headLen = Math.max(2, Math.min(4, digits.length - 8));
  const head = digits.slice(0, headLen);
  const tail = digits.slice(headLen);
  const groups = tail.match(/.{1,4}/g) ?? [];
  return [head, ...groups].join(" ");
}

export default function AffiliatePortalClient() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("register");

  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [name, setName] = useState("");
  const [whatsappLocal, setWhatsappLocal] = useState("");

  const [registerState, registerAction, registerPending] = useActionState(registerAffiliate, {});
  const [loginState, loginAction, loginPending] = useActionState(loginAffiliate, {});

  const effectiveWizardStep: WizardStep =
    registerState.ok && registerState.affiliateId ? 3 : wizardStep;

  const isDuplicateUnverified = registerState.duplicateUnverified === true;

  const registeredAffiliateId = registerState.affiliateId ?? "";
  const registeredWhatsappE164 = `+62${stripLeadingZeros(normalizeDigits(whatsappLocal))}`;

  const duplicateExistingAffiliateId = registerState.existingAffiliateId ?? "";
  const duplicateExistingName = registerState.existingName ?? "";
  const duplicateExistingWhatsapp = registerState.existingWhatsappNumber ?? "";

  useEffect(() => {
    if (loginState.ok && loginState.affiliateId) {
      router.push(`/invitation/affiliate/${loginState.affiliateId}`);
    }
  }, [loginState.ok, loginState.affiliateId, router]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid gap-4"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-fuchsia-500/10 opacity-50 pointer-events-none" />
        <button
          type="button"
          className={`relative z-10 flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 ${
            tab === "register" 
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
              : "bg-transparent text-white/60 hover:text-white hover:bg-white/5"
          }`}
          onClick={() => {
            setTab("register");
          }}
        >
          Daftar
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 ${
            tab === "login" 
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
              : "bg-transparent text-white/60 hover:text-white hover:bg-white/5"
          }`}
          onClick={() => {
            setTab("login");
          }}
        >
          Masuk
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "register" && (
          <motion.div 
            key="register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {isDuplicateUnverified ? (
            <div className="mt-2 grid gap-5">
              <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-5 backdrop-blur-md">
                <div className="text-base font-black tracking-tight text-fuchsia-100">Akun Belum Diverifikasi</div>
                <div className="mt-2 text-sm leading-relaxed text-fuchsia-200/80">
                  Nomor WhatsApp ini sudah terdaftar, namun akun Affiliate Anda masih menunggu verifikasi admin.
                  <br />
                  Silakan kirim permintaan verifikasi melalui WhatsApp.
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                target="_blank"
                rel="noreferrer noopener"
                href={
                  `https://wa.me/${DEFAULT_VERIFICATION_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `[INV-AFFILIATE-VERIFY]\n\nAffiliate ID: ${duplicateExistingAffiliateId}\nName: ${duplicateExistingName}\nWhatsApp: ${duplicateExistingWhatsapp}`,
                  )}`
                }
              >
                Kirim Permintaan Verifikasi
              </motion.a>
            </div>
          ) : null}

          {!isDuplicateUnverified ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${effectiveWizardStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-xs font-black uppercase tracking-widest text-indigo-300">Langkah {effectiveWizardStep} / 3</div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-3 h-3 rounded-full border border-indigo-400 border-t-transparent"
                    />
                  </div>
                  <div className="mt-2 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Pendaftaran Affiliate</div>
                </div>

                {effectiveWizardStep === 1 ? (
                <div className="mt-8 grid gap-5">
                  <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
                    Nama Lengkap
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                      placeholder="Nama Anda"
                    />
                  </label>

                  <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
                    Nomor WhatsApp
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                      <div className="shrink-0 pr-3 text-sm font-mono text-indigo-300/70 border-r border-white/10 mr-3">+62</div>
                      <input
                        value={whatsappLocal}
                        inputMode="numeric"
                        onChange={(e) => {
                          const formatted = formatLocalWhatsapp(e.target.value);
                          setWhatsappLocal(formatted);
                        }}
                        onBlur={() => {
                          const formatted = formatLocalWhatsapp(whatsappLocal);
                          setWhatsappLocal(formatted);
                        }}
                        className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                        placeholder="812 1234 1234"
                      />
                    </div>
                  </label>

                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (!name.trim()) return;
                        if (stripLeadingZeros(normalizeDigits(whatsappLocal)).length <= 3) return;
                        setWizardStep(2);
                      }}
                    >
                      Lanjutkan
                    </motion.button>
                  </div>
                </div>
              ) : null}

              {effectiveWizardStep === 2 ? (
                <form action={registerAction} className="mt-8 grid gap-5">
                  <input type="hidden" name="name" value={name} />
                  <input
                    type="hidden"
                    name="whatsappNumber"
                    value={`+62${stripLeadingZeros(normalizeDigits(whatsappLocal))}`}
                  />

                  <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
                    Kata Sandi
                    <input
                      name="password"
                      type="password"
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                      placeholder="Min. 8 karakter"
                    />
                  </label>

                  <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
                    Konfirmasi Kata Sandi
                    <input
                      name="confirmPassword"
                      type="password"
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                    />
                  </label>

                  {registerState.error ? (
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200 backdrop-blur-md">
                      {registerState.error}
                    </div>
                  ) : null}

                  <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white/80 hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto"
                      onClick={() => setWizardStep(1)}
                      disabled={registerPending}
                    >
                      Kembali
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60 w-full sm:w-auto"
                      disabled={registerPending}
                    >
                      {registerPending ? "Membuat..." : "Buat Affiliate"}
                    </motion.button>
                  </div>
                </form>
              ) : null}

              {effectiveWizardStep === 3 ? (
                <div className="mt-8 grid gap-5">
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  >
                    <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs font-black uppercase tracking-widest text-emerald-300">Pendaftaran Berhasil</div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      />
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-emerald-100/80">
                      Pendaftaran Affiliate Anda telah diterima.
                      <br />
                      Akun Anda memerlukan verifikasi admin sebelum dapat mengakses dashboard.
                    </div>
                  </div>
                  </motion.div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                    target="_blank"
                    rel="noreferrer noopener"
                    href={
                      `https://wa.me/${DEFAULT_VERIFICATION_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `[INV-AFFILIATE-VERIFY]\n\nAffiliate ID: ${registeredAffiliateId}\nName: ${name.trim()}\nWhatsApp: ${registeredWhatsappE164}`,
                      )}`
                    }
                  >
                    Kirim Permintaan Verifikasi
                  </motion.a>
                </div>
              ) : null}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </motion.div>
        )}

        {tab === "login" && (
        <motion.div 
          key="login"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Masuk Affiliate</div>
          <form action={loginAction} className="mt-8 grid gap-5">
            <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
              Affiliate ID
              <input
                name="affiliateId"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm font-mono text-white uppercase placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
                placeholder="A1B2C3D4E5F6"
              />
            </label>

            <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
              Kata Sandi
              <input
                name="password"
                type="password"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
              />
            </label>

            {loginState.error ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200 backdrop-blur-md">
                {loginState.error}
              </div>
            ) : null}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60"
              disabled={loginPending}
            >
              {loginPending ? "Masuk..." : "Masuk"}
            </motion.button>
          </form>

          <div className="relative mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              className="text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200 transition-colors relative"
              onClick={() => router.push("/invitation/affiliate")}
            >
              Kembali ke Portal
              <motion.div 
                className="absolute -bottom-1 left-0 h-[2px] bg-indigo-400"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
