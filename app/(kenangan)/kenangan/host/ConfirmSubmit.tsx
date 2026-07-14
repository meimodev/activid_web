"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import KkSpinner from "../KkSpinner";

// Submit button for the host's server-action forms. Two jobs:
//   1. window.confirm gate for irreversible / paid actions (native, no deps).
//   2. useFormStatus pending state so slow networks can't double-submit.
export default function ConfirmSubmit({
  children,
  className = "kk-btn kk-btn-primary",
  confirm,
  pendingLabel,
}: {
  children: ReactNode;
  className?: string;
  confirm?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? (
        <>
          <KkSpinner />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
