"use client";

// Shared progress bar for kenangan waits.
//   value 0-100  -> determinate (byte-driven upload %)
//   value omitted -> indeterminate (moving stripe, no number)
// One component, two modes; styling lives in kenangan.css (.kk-progress*).
export default function KkProgress({
  value,
  className = "",
}: {
  value?: number;
  className?: string;
}) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div
      className={`kk-progress${indeterminate ? " kk-progress-indeterminate" : ""}${className ? ` ${className}` : ""}`}
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
    >
      <div
        className="kk-progress-fill"
        style={indeterminate ? undefined : { width: `${pct}%` }}
      />
    </div>
  );
}
