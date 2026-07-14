// Inline 1em spinner for buttons in a pending/wait state. CSS-only ring,
// inherits button text color via currentColor. Styling: .kk-btn-spinner in
// kenangan.css. Distinct from the 32px .kk-spinner used on the dark camera bg.
export default function KkSpinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`kk-btn-spinner${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
