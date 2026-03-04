"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CopyLinkButton from "./CopyLinkButton";
import { loginAffiliate, registerAffiliate } from "./actions";

const SITE_ORIGIN = "https://invitation.activid.id";

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

  const registeredAffiliateId = registerState.affiliateId ?? "";
  const registeredLink = useMemo(() => {
    if (!registeredAffiliateId) return "";
    return `${SITE_ORIGIN}/${registeredAffiliateId}`;
  }, [registeredAffiliateId]);

  useEffect(() => {
    if (loginState.ok && loginState.affiliateId) {
      router.push(`/invitation/affiliate/${loginState.affiliateId}`);
    }
  }, [loginState.ok, loginState.affiliateId, router]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-2">
        <button
          type="button"
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            tab === "register" ? "bg-indigo-600 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          onClick={() => {
            setTab("register");
          }}
        >
          Register
        </button>
        <button
          type="button"
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
            tab === "login" ? "bg-indigo-600 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
          onClick={() => {
            setTab("login");
          }}
        >
          Login
        </button>
      </div>

      {tab === "register" ? (
        <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-6">
          <div className="text-sm font-black uppercase tracking-wider text-white/70">Step {effectiveWizardStep} / 3</div>
          <div className="mt-2 text-xl font-black tracking-tight text-white">Affiliate registration</div>

          {effectiveWizardStep === 1 ? (
            <div className="mt-6 grid gap-4">
              <label className="grid gap-1 text-sm text-white/80">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-1 text-sm text-white/80">
                WhatsApp number
                <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <div className="shrink-0 pr-2 text-sm font-mono text-white/70">+62</div>
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
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                    placeholder="812 1234 1234"
                  />
                </div>
              </label>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500"
                  onClick={() => {
                    if (!name.trim()) return;
                    if (stripLeadingZeros(normalizeDigits(whatsappLocal)).length <= 3) return;
                    setWizardStep(2);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}

          {effectiveWizardStep === 2 ? (
            <form action={registerAction} className="mt-6 grid gap-4">
              <input type="hidden" name="name" value={name} />
              <input
                type="hidden"
                name="whatsappNumber"
                value={`+62${stripLeadingZeros(normalizeDigits(whatsappLocal))}`}
              />

              <label className="grid gap-1 text-sm text-white/80">
                Password
                <input
                  name="password"
                  type="password"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                  placeholder="Min 8 characters"
                />
              </label>

              <label className="grid gap-1 text-sm text-white/80">
                Confirm password
                <input
                  name="confirmPassword"
                  type="password"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                />
              </label>

              {registerState.error ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {registerState.error}
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
                  onClick={() => setWizardStep(1)}
                  disabled={registerPending}
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500 disabled:opacity-60"
                  disabled={registerPending}
                >
                  {registerPending ? "Creating..." : "Create affiliate"}
                </button>
              </div>
            </form>
          ) : null}

          {effectiveWizardStep === 3 ? (
            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-black uppercase tracking-wider text-white/60">Your affiliate id</div>
                <div className="mt-1 font-mono text-lg text-white">{registeredAffiliateId}</div>

                <div className="mt-4 text-xs font-black uppercase tracking-wider text-white/60">Share link</div>
                <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <div className="font-mono text-xs text-white/80 break-all">{registeredLink}</div>
                  <CopyLinkButton link={registeredLink} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white hover:bg-white/10"
                  onClick={() => {
                    setWizardStep(1);
                    setName("");
                    setWhatsappLocal("");
                    window.location.assign("/invitation/affiliate");
                  }}
                >
                  Register another
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-500"
                  onClick={() => {
                    if (!registeredAffiliateId) return;
                    router.push(`/invitation/affiliate/${registeredAffiliateId}`);
                  }}
                >
                  Open dashboard
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "login" ? (
        <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-6">
          <div className="text-xl font-black tracking-tight text-white">Affiliate login</div>
          <form action={loginAction} className="mt-6 grid gap-4">
            <label className="grid gap-1 text-sm text-white/80">
              Affiliate id
              <input
                name="affiliateId"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-mono text-white uppercase"
                placeholder="A1B2C3D4E5F6"
              />
            </label>

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
        </div>
      ) : null}
    </div>
  );
}
