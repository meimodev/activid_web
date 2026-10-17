import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileCheck2, QrCode } from "lucide-react";
import { isVerificationCode } from "@/lib/verified-invoice";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ code?: string | string[] }> }) {
  const { code } = await searchParams;
  if (typeof code === "string" && isVerificationCode(code.trim())) redirect(`/verify/${code.trim()}`);

  return <>
    <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#6b2737]">ACTIVID · Document verification</p>
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <FileCheck2 aria-hidden className="mb-6 size-12" strokeWidth={1.3} />
        <h1 className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-7xl">A document.<br />A trusted source.</h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#1a1a3e]/70">Verify an invoice issued by ACTIVID. Check who it’s for, payment details, itemized charges, and its current payment status.</p>
        <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4">Need help with a document? <ArrowRight aria-hidden className="size-4" /></Link>
      </div>
      <section className="self-center rounded-3xl border border-[#1a1a3e]/10 bg-white/70 p-6 sm:p-9" aria-labelledby="lookup-heading">
        <QrCode aria-hidden className="mb-5 size-9 text-[#6b2737]" />
        <h2 id="lookup-heading" className="text-2xl font-bold">Check your document</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#1a1a3e]/70">Scan the QR code on your invoice to open its record directly, or enter the verification code from its link below.</p>
        <form action="/verify" method="get" className="mt-6 grid gap-3">
          <label htmlFor="verification-code" className="text-sm font-semibold">Verification code</label>
          <input id="verification-code" name="code" required maxLength={32} pattern="[a-f0-9]{32}" autoCapitalize="none" spellCheck={false} placeholder="32-character code" className="min-w-0 rounded-xl border border-[#1a1a3e]/25 bg-white px-4 py-3 font-mono text-sm focus:outline-2 focus:outline-[#6b2737]" />
          {code !== undefined && <p role="alert" className="text-sm text-red-800">Enter the full 32-character verification code from your invoice link.</p>}
          <button className="mt-1 flex items-center justify-between rounded-xl bg-[#1a1a3e] px-5 py-3.5 font-semibold text-[#F8EFDE] hover:bg-[#3d2645]">Verify document <ArrowRight aria-hidden className="size-4" /></button>
        </form>
        <p className="mt-5 text-xs text-[#1a1a3e]/60">Currently available for ACTIVID invoices.</p>
      </section>
    </div>
  </>;
}
