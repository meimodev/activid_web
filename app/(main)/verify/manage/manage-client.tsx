"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { currentInvoiceDate, formatIDR, formatIDRDigits, invoicePaymentSummary, invoiceTotal, type VerifiedInvoice } from "@/lib/verified-invoice";
import { loginVerifyAdmin, logoutVerifyAdmin, markInvoicePaid, saveInvoice, type ActionState } from "./actions";

const field = "w-full min-w-0 rounded-lg border border-[#1a1a3e]/25 bg-white px-3 py-2.5 text-sm text-[#1a1a3e] focus:outline-2 focus:outline-[#6b2737]";
const label = "grid min-w-0 gap-2 text-sm font-semibold";
const button = "rounded-lg bg-[#1a1a3e] px-4 py-2.5 text-sm font-semibold text-[#F8EFDE] hover:bg-[#3d2645] disabled:opacity-50";
const secondary = "rounded-lg border border-[#1a1a3e]/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/60 disabled:opacity-50";

function CurrencyInput({ name, defaultValue }: { name: string; defaultValue?: number }) {
  const [digits, setDigits] = useState(defaultValue === undefined ? "" : String(defaultValue));
  return <span className="relative block">
    <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 text-sm font-normal text-[#1a1a3e]/60">Rp</span>
    <input type="text" inputMode="numeric" autoComplete="off" value={formatIDRDigits(digits)} required maxLength={21}
      onChange={(event) => {
        const value = event.target.value.replace(/^Rp\s*/i, "");
        if (!/^[\d.]*$/.test(value)) {
          event.target.setCustomValidity("Use whole IDR amounts without decimals or negative signs.");
          event.target.reportValidity();
          return;
        }
        event.target.setCustomValidity("");
        setDigits(value.replaceAll(".", "").replace(/^0+(?=\d)/, ""));
      }} className={`${field} pl-10 font-normal tabular-nums`} />
    <input type="hidden" name={name} value={digits} />
  </span>;
}

function MarkPaidButton({ code, onSaved }: { code: string; onSaved: (code: string) => void }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(async (previous, formData) => {
    const result = await markInvoicePaid(previous, formData);
    if (result.code) onSaved(result.code);
    return result;
  }, {});
  return <form action={action} className="mt-2 grid gap-2">
    <input type="hidden" name="code" value={code} />
    <button disabled={pending} className={`${secondary} w-full text-emerald-800`}>{pending ? "Recording payment…" : "Mark paid"}</button>
    {state.error && <p role="alert" className="text-xs text-red-800">{state.error}</p>}
  </form>;
}

export function VerifyLogin() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginVerifyAdmin, {});
  return <div className="mx-auto max-w-md py-8">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#6b2737]">ACTIVID · Staff access</p>
    <h1 className="text-4xl font-bold">Document console</h1>
    <p className="mt-4 text-sm text-[#1a1a3e]/70">Sign in to issue invoices and update payment status.</p>
    <form action={action} className="mt-8 grid gap-5">
      <label className={label}>Admin password<input type="password" name="password" autoComplete="current-password" required maxLength={1000} className={field} /></label>
      {state.error && <p role="alert" className="text-sm text-red-800">{state.error}</p>}
      <button disabled={pending} className={button}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
    <Link href="/verify" className="mt-6 inline-block text-sm underline underline-offset-4">Back to verification</Link>
  </div>;
}

function InvoiceQR({ code }: { code: string }) {
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function download() {
    setPending(true);
    setError("");
    try {
      const QRCode = await import("qrcode");
      const data = await QRCode.toDataURL(`${window.location.origin}/verify/${code}`, { width: 1000, margin: 4, errorCorrectionLevel: "M" });
      setQr(data);
      const anchor = document.createElement("a");
      anchor.href = data;
      anchor.download = `activid-invoice-${code}.png`;
      anchor.click();
    } catch {
      setError("Could not generate the QR code. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return <div className="grid justify-items-start gap-3">
    <button type="button" onClick={download} disabled={pending} className={secondary}>{pending ? "Generating…" : "Download QR code"}</button>
    {qr && <Image unoptimized src={qr} width={160} height={160} alt="QR code linking to this invoice’s verification page" className="rounded-lg" />}
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
  </div>;
}

export function InvoiceManager({ invoices }: { invoices: VerifiedInvoice[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const invoice = invoices.find((entry) => entry.code === selected);
  function saved(code: string) {
    setSelected(code);
    setMessage("Invoice saved. Its PDF, verification link, and QR code are ready below.");
    router.refresh();
  }
  return <>
    <header className="mb-9 flex flex-wrap items-end justify-between gap-5">
      <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#6b2737]">ACTIVID · Staff access</p><h1 className="text-4xl font-bold sm:text-5xl">Issued invoices</h1><p className="mt-3 text-sm text-[#1a1a3e]/70">Create a record, add its QR to your invoice, and keep payment status up to date.</p></div>
      <form action={logoutVerifyAdmin}><button className={secondary}>Sign out</button></form>
    </header>
    {message && <p role="status" className="mb-6 rounded-xl bg-emerald-100 p-4 text-sm text-emerald-900">{message}</p>}
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.7fr]">
      <aside aria-label="Issued invoices" className="min-w-0">
        <button className={`${button} mb-5 w-full`} onClick={() => { setSelected(null); setDraft(draft + 1); setMessage(""); }}>New invoice</button>
        {invoices.length === 0 && <p className="rounded-xl border border-dashed border-[#1a1a3e]/25 p-5 text-sm text-[#1a1a3e]/65">No invoices issued yet. Create your first invoice using this form.</p>}
        <ul className="grid gap-3">{invoices.map((entry) => <li key={entry.code} className="min-w-0">
          <button onClick={() => { setSelected(entry.code); setMessage(""); }} aria-pressed={selected === entry.code} className={`w-full rounded-xl border p-4 text-left ${selected === entry.code ? "border-[#1a1a3e] bg-white" : "border-[#1a1a3e]/15 bg-white/40 hover:bg-white/70"}`}>
            <span className="block break-all font-mono text-sm font-bold">{entry.invoiceNumber}</span><span className="mt-1 block truncate text-sm text-[#1a1a3e]/70">{entry.billedTo}</span>
            <span className="mt-3 flex flex-wrap justify-between gap-2 text-xs"><span className={entry.status === "paid" ? "font-bold text-emerald-800" : "font-bold text-amber-900"}>{entry.status === "paid" ? "Paid" : entry.status === "partial" ? "Partially paid" : "Unpaid"}</span><span>{formatIDR(invoiceTotal(entry.items))}</span></span>
          </button>
          {entry.status !== "paid" && <MarkPaidButton code={entry.code} onSaved={saved} />}
        </li>)}</ul>
      </aside>
      <section className="min-w-0 rounded-2xl border border-[#1a1a3e]/10 bg-white/75 p-5 sm:p-7">
        <InvoiceEditor key={invoice ? JSON.stringify(invoice) : `new-${draft}`} invoice={invoice} onSaved={saved} />
      </section>
    </div>
  </>;
}

function InvoiceEditor({ invoice, onSaved }: { invoice?: VerifiedInvoice; onSaved: (code: string) => void }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(async (previous, formData) => {
    const result = await saveInvoice(previous, formData);
    if (result.code) onSaved(result.code);
    return result;
  }, {});
  const [rows, setRows] = useState(() => invoice ? invoice.items.map((_, index) => index) : [0]);
  const nextRow = useRef(invoice?.items.length ?? 1);
  const [paymentRows, setPaymentRows] = useState(() => invoice?.payments.map((_, index) => index) ?? []);
  const nextPayment = useRef(invoice?.payments.length ?? 0);
  const savedCode = state.code || invoice?.code;
  return <>
    <h2 className="mb-5 text-2xl font-bold">{invoice ? "Edit invoice" : "New invoice"}</h2>
    <form action={action}>
      <input type="hidden" name="code" value={savedCode ?? ""} />
      <input type="hidden" name="revision" value={invoice?.revision ?? 0} />
      <fieldset disabled={pending} className="grid min-w-0 gap-5">
        <div className={label}>Invoice number<p className={`${field} bg-[#F8EFDE]/50 font-mono font-normal`}>{invoice?.invoiceNumber ?? "Assigned automatically when issued"}</p><p className="text-xs font-normal text-[#1a1a3e]/65">The system reserves a unique number when you issue this invoice. Existing numbers stay unchanged.</p></div>
        <label className={label}>Billed to<textarea name="billedTo" defaultValue={invoice?.billedTo} required maxLength={1000} rows={3} className={field} placeholder="Client name, company, and address" /></label>
        <label className={label}>Payable to<input name="payableTo" defaultValue={invoice?.payableTo} required maxLength={300} className={field} placeholder="Account holder name" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label}>Bank<input name="bankName" defaultValue={invoice?.bankName} required maxLength={100} className={field} /></label>
          <label className={label}>Account number<input name="accountNumber" defaultValue={invoice?.accountNumber} required maxLength={100} className={`${field} font-mono`} /></label>
        </div>
        <div className="border-t border-[#1a1a3e]/15 pt-5">
          <h3 className="font-bold">Invoice items</h3><p className="mt-1 text-xs text-[#1a1a3e]/65">Whole quantities and whole IDR prices. Totals are calculated when saved.</p>
          <div className="mt-4 grid gap-4">{rows.map((row, index) => <fieldset key={row} className="grid min-w-0 gap-3 rounded-xl border border-[#1a1a3e]/15 p-4">
            <legend className="px-1 text-xs font-semibold">Item {index + 1}</legend>
            <label className={label}>Description<textarea name="description" defaultValue={invoice?.items[row]?.description} required maxLength={1000} rows={2} className={field} /></label>
            <label className={label}>Date sent<input type="date" name="dateSent" defaultValue={invoice?.items[row]?.dateSent} min="2000-01-01" max="9999-12-31" required className={field} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>Quantity<input type="number" name="quantity" min={1} step={1} defaultValue={invoice?.items[row]?.quantity ?? 1} required className={field} /></label>
              <label className={label}>Unit price (IDR)<CurrencyInput name="unitPrice" defaultValue={invoice?.items[row]?.unitPrice} /></label>
            </div>
            <button type="button" onClick={() => setRows(rows.filter((id) => id !== row))} disabled={rows.length === 1} className="justify-self-start text-xs text-red-800 underline underline-offset-4 disabled:opacity-40">Remove item {index + 1}</button>
          </fieldset>)}</div>
          <button type="button" className={`${secondary} mt-4`} disabled={rows.length >= 100} onClick={() => setRows([...rows, nextRow.current++])}>Add item</button>
        </div>
        <div className="border-t border-[#1a1a3e]/15 pt-5">
          <h3 className="font-bold">Payments received</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#1a1a3e]/65">Record actual money received, including down payments. The remaining balance and status are calculated automatically.</p>
          {invoice && <p className="mt-3 text-sm">Received: {formatIDR(invoicePaymentSummary(invoice).received)} · Remaining: {formatIDR(invoicePaymentSummary(invoice).due)}</p>}
          <div className="mt-4 grid gap-4">{paymentRows.map((row, index) => <fieldset key={row} className="grid min-w-0 gap-3 rounded-xl border border-emerald-800/20 p-4">
            <legend className="px-1 text-xs font-semibold">Payment {index + 1}</legend>
            <label className={label}>Payment description<input name="paymentDescription" defaultValue={invoice?.payments[row]?.description} placeholder="Down payment / Balance payment" maxLength={300} required className={field} /></label>
            <label className={label}>Date received (if known)<input type="date" name="paymentDate" defaultValue={invoice?.payments[row]?.dateReceived ?? currentInvoiceDate()} min="2000-01-01" max="9999-12-31" className={field} /></label>
            <label className={label}>Amount received (IDR)<CurrencyInput name="paymentAmount" defaultValue={invoice?.payments[row]?.amount} /></label>
            <button type="button" onClick={() => setPaymentRows(paymentRows.filter((id) => id !== row))} className="justify-self-start text-xs text-red-800 underline underline-offset-4">Remove payment {index + 1}</button>
          </fieldset>)}</div>
          <button type="button" className={`${secondary} mt-4`} disabled={paymentRows.length >= 100} onClick={() => setPaymentRows([...paymentRows, nextPayment.current++])}>Add received payment</button>
        </div>
        {state.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}
        <p className="text-xs leading-relaxed text-[#1a1a3e]/65">Anyone with the verification link can see these invoice details. Include only information intended for the recipient.</p>
        <button className={button}>{pending ? "Saving…" : invoice ? "Save changes" : "Issue invoice"}</button>
      </fieldset>
    </form>
    {savedCode && <div className="mt-7 grid gap-4 border-t border-[#1a1a3e]/15 pt-6">
      <h3 className="font-bold">Invoice PDF & verification</h3>
      <a href={`/verify/${savedCode}/pdf`} className={`${button} justify-self-start`}>Download invoice PDF</a>
      <Link href={`/verify/${savedCode}`} target="_blank" rel="noopener noreferrer" className="break-all font-mono text-xs underline underline-offset-4">/verify/{savedCode}</Link>
      <p className="text-xs text-[#1a1a3e]/65">The PDF includes a scannable verification QR code. Its link stays the same when you record more payments.</p>
      <InvoiceQR code={savedCode} />
    </div>}
  </>;
}
