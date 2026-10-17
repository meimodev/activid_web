import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function InvoiceNotFound() {
  return <div className="mx-auto max-w-lg py-12 text-center">
    <FileQuestion aria-hidden className="mx-auto mb-6 size-12 text-[#6b2737]" />
    <h1 className="text-4xl font-bold">Document not found</h1>
    <p className="mt-5 leading-relaxed text-[#1a1a3e]/70">We couldn’t find an issued invoice for this verification code. Check the link or contact ACTIVID to confirm your document.</p>
    <Link href="/verify" className="mt-8 inline-block rounded-xl bg-[#1a1a3e] px-6 py-3 text-[#F8EFDE]">Check another document</Link>
  </div>;
}
