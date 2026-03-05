"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CopyLinkButton from "../CopyLinkButton";
import {
  changeAffiliatePassword,
  loginAffiliate,
  logoutAffiliate,
  updateAffiliateProfile,
} from "../actions";
import { INVITATION_TEMPLATE_LISTINGS } from "@/data/invitation-templates";

const SITE_ORIGIN = "https://invitation.activid.id";

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
      const commission = discountedPrice * 0.35;
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
      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="text-xl font-black tracking-tight">Affiliate disabled</div>
        <div className="mt-2 text-sm text-white/70">{affiliate.id}</div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="text-2xl font-black tracking-tight">Affiliate dashboard</div>
        <div className="mt-2 text-sm text-white/70">Login to access: <span className="font-mono text-white">{affiliate.id}</span></div>

        <form action={loginAction} className="mt-6 grid gap-4">
          <input type="hidden" name="affiliateId" value={affiliate.id} />

          <label className="grid gap-1 text-sm text-white/80">
            Password
            <input
              name="password"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
          </label>

          {loginState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {loginState.error}
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500 disabled:opacity-60"
            disabled={loginPending}
          >
            {loginPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="mt-4 text-xs font-black uppercase tracking-wider text-indigo-200 hover:underline underline-offset-4"
          onClick={() => router.push("/invitation/affiliate")}
        >
          Back to portal
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight">Dashboard</div>
            <div className="mt-1 text-sm text-white/70">
              Affiliate id: <span className="font-mono text-white">{affiliate.id}</span>
            </div>
          </div>

          <form
            action={async () => {
              await logoutAffiliate();
              router.push("/invitation/affiliate");
            }}
          >
            <button
              type="submit"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-white/10"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-black uppercase tracking-wider text-white/60">Share link</div>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="font-mono text-xs text-white/80 break-all">{shareLink}</div>
              <CopyLinkButton link={shareLink} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-white/60">Generated invitations</div>
              <div className="mt-2 text-3xl font-black text-white">{affiliate.generatedInvitationCount}</div>
              <div className="mt-1 text-xs text-white/60">Count of invitation slugs created under your affiliate id.</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-black uppercase tracking-wider text-white/60">Commission</div>
              <div className="mt-2 text-sm text-white/70">You earn 35% commission from the discounted price.</div>
              {exampleDiscountedPrice ? (
                <div className="mt-3 grid gap-1">
                  <div className="text-xs text-white/60">Example (current promo)</div>
                  <div className="text-sm text-white/80">
                    Discounted price: <span className="font-bold text-white">{formatRupiah(exampleDiscountedPrice)}</span>
                  </div>
                  <div className="text-sm text-emerald-200">
                    Your commission: {formatRupiah(exampleDiscountedPrice * 0.35)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-black tracking-tight">Generated pages</div>
            <div className="mt-1 text-sm text-white/60">
              List of slugs generated under your affiliate id, including commission and generated date.
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-xs font-black uppercase tracking-wider text-white/60">Total commission</div>
            <div className="mt-1 text-lg font-black text-emerald-200">{formatRupiah(totalCommission)}</div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-12 gap-3 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-white/60">
            <div className="col-span-5">Slug</div>
            <div className="col-span-3">Generated</div>
            <div className="col-span-2">Template</div>
            <div className="col-span-2">Commission</div>
          </div>

          {generatedRows.length ? (
            <div className="divide-y divide-white/10">
              {generatedRows.map((r) => (
                <div key={r.slug} className="grid grid-cols-12 gap-3 px-4 py-3">
                  <div className="col-span-5">
                    <div className="font-mono text-xs text-white/80 break-all">{r.slug}</div>
                  </div>
                  <div className="col-span-3 text-xs text-white/70">
                    {r.createdAtMs ? new Date(r.createdAtMs).toLocaleString("id-ID") : "-"}
                  </div>
                  <div className="col-span-2 text-xs font-mono text-white/60">{r.templateId || "-"}</div>
                  <div className="col-span-2 text-xs text-emerald-200">{formatRupiah(r.commission)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-sm text-white/60">No generated pages yet.</div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="text-lg font-black tracking-tight">Profile</div>

        <form action={profileAction} className="mt-4 grid gap-4">
          <input type="hidden" name="affiliateId" value={affiliate.id} />
          <input
            type="hidden"
            name="whatsappNumber"
            value={`+62${stripLeadingZeros(normalizeDigits(profileWhatsappLocal))}`}
          />

          <label className="grid gap-1 text-sm text-white/80">
            Name
            <input
              name="name"
              defaultValue={affiliate.name}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
          </label>

          <label className="grid gap-1 text-sm text-white/80">
            WhatsApp number
            <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="shrink-0 pr-2 text-sm font-mono text-white/70">+62</div>
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
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                placeholder="812 1234 1234"
              />
            </div>
          </label>

          {profileState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {profileState.error}
            </div>
          ) : null}

          {profileState.ok ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Saved.
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500 disabled:opacity-60"
            disabled={profilePending}
          >
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
        <div className="text-lg font-black tracking-tight">Change password</div>

        <form action={passwordAction} className="mt-4 grid gap-4">
          <input type="hidden" name="affiliateId" value={affiliate.id} />

          <label className="grid gap-1 text-sm text-white/80">
            Current password
            <input
              name="currentPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
          </label>

          <label className="grid gap-1 text-sm text-white/80">
            New password
            <input
              name="newPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
          </label>

          <label className="grid gap-1 text-sm text-white/80">
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
            />
          </label>

          {passwordState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {passwordState.error}
            </div>
          ) : null}

          {passwordState.ok ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Password updated.
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500 disabled:opacity-60"
            disabled={passwordPending}
          >
            {passwordPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
