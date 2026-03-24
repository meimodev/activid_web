type ActionLink = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

interface ActionLinksProps {
  links: ActionLink[];
}

export default function ActionLinks({ links }: ActionLinksProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const baseClassName =
          "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5";
        const variantClassName =
          link.variant === "primary"
            ? "bg-stone-100 text-stone-900"
            : "border border-stone-500 text-stone-100";

        return (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={`${baseClassName} ${variantClassName}`}
          >
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
