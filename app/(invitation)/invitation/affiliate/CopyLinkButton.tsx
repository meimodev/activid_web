"use client";

import React from "react";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10"
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
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
