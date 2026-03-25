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
      className={`my-1 text-center block w-full rounded-xl p-3 transition-transform duration-200 hover:scale-[0.99] ${className}`}
    >
        
        <span className="text-lg text-center" style={{ fontFamily: "var(--font-bbold-display)" }}>
          {label}
        </span>
    </a>
  );
}
