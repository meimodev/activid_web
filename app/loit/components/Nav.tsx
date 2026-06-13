"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "../data";
import { DownloadCta, Wordmark } from "./ui";

/** Sticky minimal nav; gains a blurred petrol backdrop after ~80px scroll. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[var(--loit-petrol-600)] bg-[var(--loit-petrol-800)]/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8">
        <Link href="#top" aria-label="LOIT — ke atas">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-[var(--loit-mist)] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--loit-mint-400)] after:transition-transform after:duration-300 hover:text-[var(--loit-paper)] hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
          <DownloadCta label="Download" size="md" />
        </div>

        <div className="md:hidden">
          <DownloadCta label="Download" size="md" />
        </div>
      </nav>
    </header>
  );
}
