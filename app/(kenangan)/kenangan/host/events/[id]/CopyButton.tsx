"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  }

  return (
    <button type="button" className="kk-btn kk-btn-ghost" onClick={copy}>
      {copied ? "Tersalin!" : "Salin Tautan"}
    </button>
  );
}
