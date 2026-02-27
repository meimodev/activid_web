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
      <div
        style={{
          transform: "scale(var(--invitation-scale, 1))",
          transformOrigin: "bottom center",
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur px-2 py-2 shadow-xl">
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelect(it.id)}
                className={`h-11 w-11 rounded-full flex items-center justify-center transition border ${isActive ? "bg-[#2B2424] text-white border-[#2B2424]" : "bg-white/60 text-[#2B2424] border-black/10 hover:bg-white"}`}
                aria-label={it.label}
              >
                <span className="sr-only">{it.label}</span>
                {it.icon}
              </button>
            );
          })}

          {right ? <div className="mx-1 h-8 w-px bg-black/10" /> : null}
          {right}
        </div>
      </div>
    </div>
  );
}
