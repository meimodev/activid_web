"use client";

import React from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
        copied
          ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          : "border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-500/50 hover:bg-indigo-500/20 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)]"
      }`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(link);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          // ignore
        }
      }}
    >
      {copied ? "Tersalin!" : "Salin"}
    </button>
  );
}
