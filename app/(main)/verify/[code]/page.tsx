import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, ShieldCheck, Clock3 } from "lucide-react";
import { getVerifiedInvoice } from "@/lib/verified-invoice-store";
import { formatIDR, formatInvoiceDate, INVOICE_ISSUER, INVOICE_LEGAL_NOTE, invoicePaymentSummary } from "@/lib/verified-invoice";

export const dynamic = "force-dynamic";

export default async function VerifiedInvoicePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const invoice = await getVerifiedInvoice(code);
  if (!invoice) notFound();
  const { total, received, due, status } = invoicePaymentSummary(invoice);
  const paid = status === "paid";

  return <>
    <Link href="/verify" className="mb-8 inline-flex items-center gap-2 text-sm text-[#1a1a3e]/70 hover:underline"><ArrowLeft aria-hidden className="size-4" /> Document verification</Link>
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ShieldCheck aria-hidden className="size-5" /> Verified ACTIVID invoice</div>
      <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${paid ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"}`}>
        {paid ? <CircleCheck aria-hidden className="size-4" /> : <Clock3 aria-hidden className="size-4" />}{paid ? "Paid in full" : status === "partial" ? "Partially paid" : "Awaiting payment"}
      </span>
    </div>
    <a href={`/verify/${code}/pdf`} className="mb-6 inline-block rounded-xl bg-[#1a1a3e] px-5 py-3 text-sm font-semibold text-[#F8EFDE]">Download invoice PDF</a>
    <article className="overflow-hidden rounded-3xl border border-[#1a1a3e]/10 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[#1a1a3e]/10 p-6 sm:p-10">
        <div className="min-w-0 max-w-sm">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-black p-2"><Image src="/images/activid-logo.jpg" alt="ACTIVID logo" width={36} height={36} /></span><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b2737]">Issued by ACTIVID</p></div>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Invoice</h1>
          <p className="mt-4 text-sm font-bold">{INVOICE_ISSUER.legalName}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#1a1a3e]/70">{INVOICE_ISSUER.address}</p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs"><a href={`tel:${INVOICE_ISSUER.phone}`} className="underline underline-offset-2">{INVOICE_ISSUER.phone}</a><a href={`https://${INVOICE_ISSUER.website}`} className="underline underline-offset-2">{INVOICE_ISSUER.website}</a></p>
        </div>
        <div className="min-w-0"><p className="text-xs uppercase tracking-wider text-[#1a1a3e]/60">Invoice number</p><p className="mt-2 break-all font-mono text-lg font-semibold">{invoice.invoiceNumber}</p></div>
      </header>
      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-10">
        <section aria-labelledby="bill-to"><h2 id="bill-to" className="text-xs font-bold uppercase tracking-wider text-[#1a1a3e]/60">Billed to</h2><p className="mt-3 whitespace-pre-line break-words text-lg font-semibold">{invoice.billedTo}</p></section>
        <section aria-labelledby="pay-to"><h2 id="pay-to" className="text-xs font-bold uppercase tracking-wider text-[#1a1a3e]/60">Payable to</h2><p className="mt-3 break-words text-lg font-semibold">{invoice.payableTo}</p><p className="mt-1 break-words text-sm text-[#1a1a3e]/70">{invoice.bankName}</p><p className="mt-1 break-all font-mono">{invoice.accountNumber}</p></section>
      </div>
      <div className="overflow-x-auto px-6 sm:px-10" role="region" aria-label="Invoice items, scroll horizontally on small screens" tabIndex={0}>
        <table className="w-full min-w-[650px] border-collapse text-sm">
          <caption className="sr-only">Itemized charges for invoice {invoice.invoiceNumber}. All amounts in IDR.</caption>
          <thead><tr className="border-y border-[#1a1a3e]/15 bg-[#F8EFDE]/50 text-left text-xs uppercase tracking-wider text-[#1a1a3e]/65">
            <th scope="col" className="py-4 pr-5">Description</th><th scope="col" className="px-3 py-4">Date sent</th><th scope="col" className="px-3 py-4 text-right">Quantity</th><th scope="col" className="px-3 py-4 text-right">Unit price</th><th scope="col" className="py-4 pl-3 text-right">Amount</th>
          </tr></thead>
          <tbody>{invoice.items.map((item, index) => <tr key={index} className="border-b border-[#1a1a3e]/10 align-top">
            <th scope="row" className="max-w-xs whitespace-pre-line break-words py-5 pr-5 text-left font-medium">{item.description}</th>
            <td className="whitespace-nowrap px-3 py-5"><time dateTime={item.dateSent}>{formatInvoiceDate(item.dateSent)}</time></td>
            <td className="px-3 py-5 text-right tabular-nums">{item.quantity}</td><td className="whitespace-nowrap px-3 py-5 text-right tabular-nums">{formatIDR(item.unitPrice)}</td><td className="whitespace-nowrap py-5 pl-3 text-right tabular-nums">{formatIDR(item.quantity * item.unitPrice)}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {invoice.payments.length > 0 && <section className="px-6 pt-7 sm:px-10" aria-labelledby="payments-heading">
        <h2 id="payments-heading" className="mb-4 text-lg font-bold">Payments received</h2>
        <div className="overflow-x-auto" role="region" aria-label="Received payments" tabIndex={0}>
          <table className="w-full min-w-[400px] text-sm">
            <thead><tr className="border-b border-[#1a1a3e]/15 text-left text-xs uppercase tracking-wider text-[#1a1a3e]/65"><th scope="col" className="py-3 pr-3">Payment</th><th scope="col" className="px-3 py-3">Date received</th><th scope="col" className="py-3 pl-3 text-right">Amount</th></tr></thead>
            <tbody>{invoice.payments.map((payment, index) => <tr key={index} className="border-b border-[#1a1a3e]/10"><th scope="row" className="max-w-xs break-words py-4 pr-3 text-left font-medium">{payment.description}</th><td className="whitespace-nowrap px-3 py-4">{payment.dateReceived ? formatInvoiceDate(payment.dateReceived) : "Not recorded"}</td><td className="whitespace-nowrap py-4 pl-3 text-right tabular-nums">{formatIDR(payment.amount)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>}
      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
        <p className="self-end text-sm leading-relaxed text-[#1a1a3e]/65">{paid ? "This invoice has been paid in full. No further payment is required." : "Please use the payment account above and include your invoice number as the payment reference."}</p>
        <dl className="rounded-2xl bg-[#F8EFDE]/60 p-5">
          <div className="flex flex-wrap justify-between gap-3"><dt className="text-sm">Total payment amount</dt><dd className="text-xl font-bold tabular-nums">{formatIDR(total)}</dd></div>
          <div className="mt-4 flex flex-wrap justify-between gap-3"><dt className="text-sm">Payments received</dt><dd className="font-bold tabular-nums">{formatIDR(received)}</dd></div>
          <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[#1a1a3e]/15 pt-4"><dt className="text-sm">Amount due</dt><dd className={`text-xl font-bold tabular-nums ${paid ? "text-emerald-800" : ""}`}>{formatIDR(due)}</dd></div>
        </dl>
      </div>
    </article>
    <p className="mt-6 text-xs leading-relaxed text-[#1a1a3e]/65">{INVOICE_LEGAL_NOTE}</p>
    <p className="mt-6 text-center text-xs leading-relaxed text-[#1a1a3e]/60">This record reflects the current details held by ACTIVID. <Link href="/contact" className="underline underline-offset-2">Contact us</Link> if they differ from your document.</p>
  </>;
}
