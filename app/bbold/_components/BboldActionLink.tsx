type BboldActionLinkProps = {
  href: string;
  label: string;
  tone?: "default" | "highlight";
};

export default function BboldActionLink({ href, label, tone = "default" }: BboldActionLinkProps) {
  const className =
    tone === "highlight"
      ? "border-2 border-neutral-200 bg-neutral-900 text-neutral-50"
      : "bg-neutral-900 text-neutral-50";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`my-1 block w-full rounded-xl p-3 transition-transform duration-200 hover:scale-[0.99] ${className}`}
    >
      <div className="flex items-center justify-between gap-4 px-2">
        <span className="text-sm uppercase tracking-[0.3em] text-neutral-400" style={{ fontFamily: "var(--font-bbold-body)" }}>
          Visit
        </span>
        <span className="text-lg" style={{ fontFamily: "var(--font-bbold-display)" }}>
          {label}
        </span>
      </div>
    </a>
  );
}
