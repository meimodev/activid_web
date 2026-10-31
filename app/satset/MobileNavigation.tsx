"use client";

import { useRef } from "react";
import { Menu, X } from "lucide-react";
import type { COPY, Lang } from "./copy";

export default function MobileNavigation({ lang, labels }: { lang: Lang; labels: (typeof COPY)[Lang]["nav"] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const t = labels;
  const close = () => { if (menu.current) menu.current.open = false; };

  return (
    <details
      className="satset-mobile-menu"
      ref={menu}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          menu.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary aria-label={t.menu}>
        <Menu className="satset-menu-open-icon" size={20} aria-hidden="true" />
        <X className="satset-menu-close-icon" size={20} aria-hidden="true" />
      </summary>
      <nav aria-label={t.menu} onClick={close}>
        <a href="#how">{t.how}</a>
        <a href="#features">{t.features}</a>
        <a href="#pricing">{t.pricing}</a>
        <a href="#demo">{t.demo}</a>
        <a className="satset-menu-language" href={lang === "id" ? "/satset?lang=en" : "/satset"}>
          <span>{t.language}</span>
          <span>{lang === "id" ? "English" : "Bahasa Indonesia"}</span>
        </a>
      </nav>
    </details>
  );
}
