import Link from "next/link";
import { FOOTER } from "../data";
import { Wordmark } from "./ui";

export function Footer() {
  return (
    <footer
      id="kontak"
      className="border-t border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-900)] px-5 py-14 sm:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-3 text-sm text-[var(--loit-mist)]">{FOOTER.descriptor}</p>
          </div>
          <nav className="flex flex-col gap-2.5">
            {FOOTER.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--loit-mist)] transition-colors hover:text-[var(--loit-paper)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-[var(--loit-petrol-600)] pt-6 text-[13px] text-[var(--loit-mist)]">
          <p>{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
