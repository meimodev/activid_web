"use client";

import type { NavSectionId } from "./types";

export function FloatingNav({
  items,
  active,
  onSelect,
  right,
}: {
  items: Array<{ id: NavSectionId; label: string; icon: React.ReactNode }>;
  active: NavSectionId;
  onSelect: (id: NavSectionId) => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110]">
      <div className="flex items-center gap-2 rounded-full border border-wedding-text/10 bg-wedding-bg/70 backdrop-blur px-2 py-2 shadow-xl">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onSelect(it.id)}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition border ${isActive ? "bg-wedding-accent text-wedding-on-accent border-wedding-accent" : "bg-wedding-bg/60 text-wedding-text border-wedding-text/10 hover:bg-wedding-bg"}`}
              aria-label={it.label}
            >
              <span className="sr-only">{it.label}</span>
              {it.icon}
            </button>
          );
        })}

        {right ? <div className="mx-1 h-8 w-px bg-wedding-text/10" /> : null}
        {right}
      </div>
    </div>
  );
}
