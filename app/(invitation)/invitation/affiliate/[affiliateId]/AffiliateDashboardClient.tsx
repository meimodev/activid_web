"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CopyLinkButton from "../CopyLinkButton";
import {
  changeAffiliatePassword,
  loginAffiliate,
  logoutAffiliate,
  updateAffiliateProfile,
} from "../actions";
import { INVITATION_TEMPLATE_LISTINGS } from "@/data/invitation-templates";

const SITE_ORIGIN = "https://invitation.activid.id";
const COMMISSION_RATE = 0.4;
const COMMISSION_PERCENT = Math.round(COMMISSION_RATE * 100);
const DEFAULT_VERIFICATION_WHATSAPP_NUMBER = "62881080088816";

type AffiliateView = {
  id: string;
  name: string;
  whatsappNumber: string;
  enabled: boolean;
  generatedInvitationCount: number;
};

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

function parsePriceToRupiahInt(value: string): number {
  const digitsOnly = (value ?? "").replace(/[^0-9]/g, "");
  const num = Number.parseInt(digitsOnly || "0", 10);
  return Number.isFinite(num) ? num : 0;
}

function formatRupiah(value: number): string {
  try {
    return `Rp ${new Intl.NumberFormat("id-ID").format(Math.round(value))}`;
  } catch {
    return `Rp ${Math.round(value)}`;
  }
}

export default function AffiliateDashboardClient({
  affiliate,
  unlocked,
  generatedInvitations,
}: {
  affiliate: AffiliateView;
  unlocked: boolean;
  generatedInvitations: { slug: string; templateId: string; createdAtMs: number }[];
}) {
  const router = useRouter();
  const [loginState, loginAction, loginPending] = useActionState(loginAffiliate, {});
  const [profileState, profileAction, profilePending] = useActionState(updateAffiliateProfile, {});
  const [passwordState, passwordAction, passwordPending] = useActionState(changeAffiliatePassword, {});

  const [profileWhatsappLocal, setProfileWhatsappLocal] = useState<string>(() => {
    const digits = normalizeDigits(affiliate.whatsappNumber);
    const local = digits.startsWith("62") ? digits.slice(2) : digits;
    return formatLocalWhatsapp(local);
  });

  const shareLink = useMemo(() => `${SITE_ORIGIN}/${affiliate.id}`, [affiliate.id]);

  const generatedRows = useMemo(() => {
    const discountedPriceByTemplateId = new Map(
      INVITATION_TEMPLATE_LISTINGS.map((t) => [t.templateId, parsePriceToRupiahInt(t.priceDiscount)]),
    );

    return (generatedInvitations ?? []).map((i) => {
      const discountedPrice = discountedPriceByTemplateId.get(i.templateId) ?? 0;
      const commission = discountedPrice * COMMISSION_RATE;
      return {
        ...i,
        discountedPrice,
        commission,
      };
    });
  }, [generatedInvitations]);

  const totalCommission = useMemo(() => {
    return generatedRows.reduce((acc, r) => acc + (Number.isFinite(r.commission) ? r.commission : 0), 0);
  }, [generatedRows]);

  const exampleDiscountedPrice = useMemo(() => {
    const prices = Array.from(
      new Set(INVITATION_TEMPLATE_LISTINGS.map((t) => parsePriceToRupiahInt(t.priceDiscount)).filter(Boolean)),
    );
    if (prices.length === 1) return prices[0] ?? 0;
    return 0;
  }, []);

  useEffect(() => {
    if (loginState.ok && loginState.affiliateId) {
      router.refresh();
    }
  }, [loginState.ok, loginState.affiliateId, router]);

    if (!affiliate.enabled) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Menunggu Verifikasi</div>
          <div className="mt-3 text-sm leading-relaxed text-indigo-100/70">
            Akun Affiliate Anda belum diverifikasi oleh admin.
            <br />
            Silakan kirim permintaan verifikasi melalui WhatsApp.
          </div>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
            target="_blank"
            rel="noreferrer noopener"
            href={
              `https://wa.me/${DEFAULT_VERIFICATION_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `[INV-AFFILIATE-VERIFY]\n\nAffiliate ID: ${affiliate.id}\nName: ${affiliate.name}\nWhatsApp: ${affiliate.whatsappNumber}`,
              )}`
            }
          >
            Kirim Permintaan Verifikasi
          </motion.a>
        </motion.div>
      );
    }

  if (!unlocked) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Affiliate Dashboard</div>
        <div className="mt-2 text-sm text-indigo-100/70">Masuk untuk mengakses: <span className="font-mono text-indigo-200 font-bold">{affiliate.id}</span></div>

        <form action={loginAction} className="mt-8 grid gap-5">
          <input type="hidden" name="affiliateId" value={affiliate.id} />

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
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60"
            disabled={loginPending}
          >
            {loginPending ? "Masuk..." : "Masuk"}
          </motion.button>
        </form>

        <button
          type="button"
          className="mt-6 text-xs font-bold uppercase tracking-widest text-indigo-300 hover:text-indigo-200 hover:underline underline-offset-4 transition-colors"
          onClick={() => router.push("/invitation/affiliate")}
        >
          Kembali ke Portal
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Dashboard</div>
            <div className="mt-1 text-sm text-indigo-100/70">
              Affiliate ID: <span className="font-mono text-indigo-200 font-bold">{affiliate.id}</span>
            </div>
          </div>

          <form
            action={async () => {
              await logoutAffiliate();
              router.push("/invitation/affiliate");
            }}
            className="self-start"
          >
            <button
              type="submit"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-indigo-100 hover:bg-white/10 hover:text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            >
              Keluar
            </button>
          </form>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm shadow-inner">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-300">Link tautan anda</div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]">
              <div className="font-mono text-xs sm:text-sm text-indigo-100 break-all">{shareLink}</div>
              <div className="shrink-0">
                <CopyLinkButton link={shareLink} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-widest text-indigo-300">Undangan Dibuat</div>
                <div className="mt-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                  {affiliate.generatedInvitationCount}
                </div>
                <div className="mt-2 text-xs leading-relaxed text-indigo-100/60">Jumlah undangan yang berhasil dibuat melalui tautan Anda.</div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-300">Komisi</div>
                <div className="mt-2 text-sm leading-relaxed text-indigo-100/70">Anda mendapatkan komisi <span className="font-bold text-emerald-200">{COMMISSION_PERCENT}%</span> dari harga diskon.</div>
                {exampleDiscountedPrice ? (
                  <div className="mt-4 grid gap-1.5 rounded-xl bg-black/30 p-3 border border-white/5">
                    <div className="text-xs font-medium text-indigo-200/50">Contoh (Promo Saat Ini)</div>
                    <div className="text-sm text-indigo-100/90">
                      Harga diskon: <span className="font-bold text-white">{formatRupiah(exampleDiscountedPrice)}</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                      Komisi Anda: {formatRupiah(exampleDiscountedPrice * COMMISSION_RATE)}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Halaman Dibuat</div>
            <div className="mt-1 text-sm text-indigo-100/60 max-w-md">
              Daftar undangan yang dibuat melalui Affiliate ID Anda, beserta komisi dan tanggal pembuatan.
            </div>
          </div>
          <div className="shrink-0 text-left sm:text-right rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 backdrop-blur-md relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-emerald-400/10 blur-[20px]"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 text-xs font-black uppercase tracking-widest text-emerald-300/80">Total Komisi</div>
            <div className="relative z-10 mt-1 text-2xl font-black text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">{formatRupiah(totalCommission)}</div>
          </div>
        </div>

        <div className="mt-8">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-black uppercase tracking-widest text-indigo-300/70 border-b border-white/10">
            <div className="col-span-5 md:col-span-4">Slug</div>
            <div className="col-span-3 md:col-span-4">Tanggal</div>
            <div className="col-span-2">Template</div>
            <div className="col-span-2 text-right">Komisi</div>
          </div>

          {generatedRows.length ? (
            <div className="grid gap-3 mt-4">
              {generatedRows.map((r, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  key={r.slug} 
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-5 py-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="sm:col-span-5 md:col-span-4 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Slug</span>
                    <div className="font-mono text-sm sm:text-sm text-indigo-100 break-all group-hover:text-white transition-colors">{r.slug}</div>
                  </div>
                  <div className="sm:col-span-3 md:col-span-4 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Tanggal</span>
                    <div className="text-sm text-indigo-200/70">
                      {r.createdAtMs ? new Date(r.createdAtMs).toLocaleString("id-ID") : "-"}
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-indigo-300/50 mb-1">Template</span>
                    <div className="text-sm font-mono text-indigo-200/70 bg-black/40 inline-flex px-2 py-1 rounded-lg w-fit">
                      {r.templateId || "-"}
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex flex-col justify-center sm:text-right">
                    <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-emerald-300/50 mb-1">Komisi</span>
                    <div className="text-base sm:text-sm font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                      {formatRupiah(r.commission)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/10 px-6 py-12 text-center">
              <div className="text-indigo-200/50 text-sm">Belum ada halaman yang dibuat.</div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Profile</div>

        <form action={profileAction} className="mt-8 grid gap-5">
          <input type="hidden" name="affiliateId" value={affiliate.id} />
          <input
            type="hidden"
            name="whatsappNumber"
            value={`+62${stripLeadingZeros(normalizeDigits(profileWhatsappLocal))}`}
          />

          <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
            Nama Lengkap
            <input
              name="name"
              defaultValue={affiliate.name}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
            Nomor WhatsApp
            <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
              <div className="shrink-0 pr-3 text-sm font-mono text-indigo-300/70 border-r border-white/10 mr-3">+62</div>
              <input
                value={profileWhatsappLocal}
                inputMode="numeric"
                onChange={(e) => {
                  const formatted = formatLocalWhatsapp(e.target.value);
                  setProfileWhatsappLocal(formatted);
                }}
                onBlur={() => {
                  const formatted = formatLocalWhatsapp(profileWhatsappLocal);
                  setProfileWhatsappLocal(formatted);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                placeholder="812 1234 1234"
              />
            </div>
          </label>

          {profileState.error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200 backdrop-blur-md">
              {profileState.error}
            </div>
          ) : null}

          {profileState.ok ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-200 backdrop-blur-md"
            >
              Profil berhasil disimpan.
            </motion.div>
          ) : null}

          <div className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60"
              disabled={profilePending}
            >
              {profilePending ? "Menyimpan..." : "Simpan Profil"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Ubah Kata Sandi</div>

        <form action={passwordAction} className="mt-8 grid gap-5">
          <input type="hidden" name="affiliateId" value={affiliate.id} />

          <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
            Kata Sandi Saat Ini
            <input
              name="currentPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
            Kata Sandi Baru
            <input
              name="newPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-indigo-100/80">
            Konfirmasi Kata Sandi Baru
            <input
              name="confirmPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all"
            />
          </label>

          {passwordState.error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200 backdrop-blur-md">
              {passwordState.error}
            </div>
          ) : null}

          {passwordState.ok ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-200 backdrop-blur-md"
            >
              Kata sandi berhasil diubah.
            </motion.div>
          ) : null}

          <div className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all disabled:opacity-60"
              disabled={passwordPending}
            >
              {passwordPending ? "Menyimpan..." : "Ubah Kata Sandi"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
