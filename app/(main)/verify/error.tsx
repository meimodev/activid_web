"use client";

export default function VerifyError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-lg py-12 text-center">
    <h1 className="text-3xl font-bold">Verification temporarily unavailable</h1>
    <p className="mt-4 text-[#1a1a3e]/70">We couldn’t load the document records. Please try again or contact ACTIVID before making a payment.</p>
    <button onClick={reset} className="mt-6 rounded-xl bg-[#1a1a3e] px-6 py-3 text-[#F8EFDE]">Try again</button>
  </div>;
}
