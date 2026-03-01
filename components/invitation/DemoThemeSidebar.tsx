"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { InvitationConfig } from "@/types/invitation";
import type { InvitationTemplateTheme } from "@/data/invitation-templates";
import { getInvitationThemeStyle } from "@/lib/invitation-theme";

type DemoThemeSidebarProps = {
  templateId: string;
  themes: InvitationTemplateTheme[];
  initialTheme?: InvitationConfig["theme"];
};

function normalizeHex(value: string) {
  return value.trim().toLowerCase();
}

export function DemoThemeSidebar({ templateId, themes, initialTheme }: DemoThemeSidebarProps) {
  const initialActive = (() => {
    if (!themes.length) return null;

    if (initialTheme?.mainColor && initialTheme.accentColor) {
      const main = normalizeHex(initialTheme.mainColor);
      const accent = normalizeHex(initialTheme.accentColor);
      const accent2 = initialTheme.accent2Color ? normalizeHex(initialTheme.accent2Color) : null;

      const match = themes.find(
        (theme) => {
          if (normalizeHex(theme.mainColor) !== main) return false;
          if (normalizeHex(theme.accentColor) !== accent) return false;
          if (!accent2) return true;
          return !!theme.accent2Color && normalizeHex(theme.accent2Color) === accent2;
        },
      );

      if (match) return match;
    }

    return themes[0];
  })();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<InvitationTemplateTheme | null>(initialActive);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setPortalRoot(document.body), 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setIsOpen(mediaQuery.matches);
    };

    const timer = window.setTimeout(apply, 0);
    mediaQuery.addEventListener("change", apply);

    return () => {
      window.clearTimeout(timer);
      mediaQuery.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (!activeTheme) return;

    const shell = document.querySelector<HTMLElement>(".invitation-mobile-shell");
    if (!shell) return;

    const styleMap = getInvitationThemeStyle(templateId, {
      mainColor: activeTheme.mainColor,
      accentColor: activeTheme.accentColor,
      accent2Color: activeTheme.accent2Color,
      darkColor: activeTheme.darkColor,
    });

    Object.entries(styleMap).forEach(([key, value]) => {
      shell.style.setProperty(key, value);
    });
  }, [activeTheme, templateId]);

  const title = "Color Combinations";

  if (!portalRoot) return null;

  const content = (
    <div
      className="fixed left-1/2 z-[2000] w-[calc(100vw-2rem)] max-w-[720px] -translate-x-1/2"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mx-auto flex items-center gap-2 rounded-full border border-wedding-accent/30 bg-wedding-bg/85 px-4 py-2 text-xs font-semibold tracking-wide text-wedding-text shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur"
        >
          <span
            aria-hidden
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: activeTheme?.accentColor ?? "var(--invitation-accent)" }}
          />
          <span className="sm:hidden">Colors</span>
          <span className="hidden sm:inline">{title}</span>
        </button>
      ) : (
        <div className="max-h-[calc(100vh-140px)] overflow-auto rounded-2xl border border-wedding-accent/30 bg-wedding-bg/88 p-3 text-wedding-text shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-wedding-text-light">
              {title}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full border border-wedding-accent/20 bg-wedding-bg-alt/60 text-wedding-text hover:bg-wedding-bg-alt"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            {themes.map((theme) => {
              const isActive =
                !!activeTheme &&
                normalizeHex(activeTheme.mainColor) === normalizeHex(theme.mainColor) &&
                normalizeHex(activeTheme.accentColor) === normalizeHex(theme.accentColor);

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setActiveTheme(theme)}
                  className={
                    "w-full rounded-xl border p-3 text-left transition " +
                    (isActive
                      ? "border-wedding-accent ring-2 ring-wedding-accent/40"
                      : "border-wedding-accent/20 hover:border-wedding-accent/50")
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{theme.title}</div>
                      <div className="mt-1 hidden sm:flex items-center gap-2 text-[11px] text-wedding-text-light">
                        <span className="truncate">{theme.mainColor}</span>
                        <span className="opacity-60">/</span>
                        <span className="truncate">{theme.accentColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <>
                          <span className="hidden sm:inline rounded-full bg-wedding-accent/15 px-2 py-1 text-[10px] font-semibold text-wedding-accent">
                            Active
                          </span>
                          <span className="sm:hidden flex h-7 w-7 items-center justify-center rounded-full bg-wedding-accent/15 text-[13px] font-semibold text-wedding-accent">
                            ✓
                          </span>
                        </>
                      ) : null}
                      <div className="flex flex-col overflow-hidden rounded-lg border border-wedding-accent/15">
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.mainColor }}
                        />
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] leading-relaxed text-wedding-text-light">
            Demo only: click a combination to preview.
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, portalRoot);
}
