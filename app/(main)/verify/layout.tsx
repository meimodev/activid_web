import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document verification | ACTIVID",
  description: "Check the details and payment status of an invoice issued by ACTIVID.",
  robots: { index: false, follow: false },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#F8EFDE] px-4 pb-24 pt-32 text-[#1a1a3e] sm:px-8 sm:pt-40">
    <div className="mx-auto max-w-5xl">{children}</div>
  </main>;
}
