"use client";

import { useEffect, useRef } from "react";

const PETAL_COLORS = [
  "var(--invitation-accent)",
  "var(--invitation-accent-light)",
  "#8a4f7d", // Plum
  "#5c2b50", // Dark Plum
  "#9d6b91", // Soft Lilac/Plum
  "var(--invitation-accent-2)",
];

const GOLD_COLORS = [
  "var(--invitation-accent)",
  "var(--invitation-accent-light)",
  "#f3d99e", // Bright warm gold
  "#e3c276", // Deep gold
  "#ebd293", // Soft pale gold
];

const SPARKLE_COLORS = [
  "#ffffff", // High white shine
  "var(--invitation-accent-light)",
  "#f2e3d5", // Off-white cream
];

function usePetals(intensity: number) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || intensity <= 0) return;

    let running = true;
    let timer: ReturnType<typeof setTimeout>;

    function spawn() {
      if (!running || !layer) return;

      const rand = Math.random();
      let type: "petal" | "gold" | "sparkle" = "petal";
      if (rand < 0.4) {
        type = "petal";
      } else if (rand < 0.8) {
        type = "gold";
      } else {
        type = "sparkle";
      }

      const startX = Math.random() * window.innerWidth;
      const drift = (Math.random() - 0.5) * 200;
      const dur = 8 + Math.random() * 10;
      const rot = Math.random() * 720 - 360;
      const delay = Math.random() * 0.4;

      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        will-change: transform, opacity;
        opacity: 0;
        pointer-events: none;
      `;

      let size = 8;
      let html = "";
      let color = "";

      if (type === "petal") {
        size = 8 + Math.random() * 12;
        color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        html = `
          <svg viewBox="0 0 20 20" width="${size}" height="${size}" style="display:block">
            <path d="M10 1 C 4 4, 2 12, 10 19 C 18 12, 16 4, 10 1 Z"
                  fill="${color}" opacity="0.8"/>
            <path d="M10 4 Q10 12 10 17" stroke="rgba(0,0,0,0.15)" stroke-width="0.5" fill="none"/>
          </svg>`;
      } else if (type === "gold") {
        size = 6 + Math.random() * 10;
        color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        const shapeIdx = Math.floor(Math.random() * 3);
        const paths = [
          "M3 2 Q 8 0 13 3 Q 16 7 14 12 Q 9 15 4 13 Q 0 9 3 2 Z",
          "M2 5 Q 7 1 12 2 Q 15 6 13 11 Q 9 14 3 10 Q 0 7 2 5 Z",
          "M4 1 Q 8 2 12 1 Q 14 6 13 11 Q 7 14 2 12 Q 1 7 4 1 Z"
        ];
        html = `
          <svg viewBox="0 0 16 16" width="${size}" height="${size}" style="display:block">
            <path d="${paths[shapeIdx]}" fill="${color}" opacity="0.85"/>
          </svg>`;
      } else {
        size = 5 + Math.random() * 6;
        color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        html = `
          <svg viewBox="0 0 16 16" width="${size * 1.5}" height="${size * 1.5}" style="display:block">
            <path d="M8 0 Q 8 6 14 8 Q 8 10 8 16 Q 8 10 2 8 Q 8 6 8 0 Z" fill="${color}" opacity="0.95"/>
          </svg>`;
      }

      el.innerHTML = html;

      el.style.left = `${startX}px`;
      el.style.top = "-30px";
      el.style.transform = "translate3d(0,0,0) rotate(0deg)";
      el.style.transition = `transform ${dur}s linear ${delay}s, opacity 1.4s ease-in ${delay}s`;
      layer.appendChild(el);

      requestAnimationFrame(() => {
        el.style.opacity = String(0.35 + Math.random() * 0.55);
        el.style.transform = `translate3d(${drift}px, ${window.innerHeight + 60}px, 0) rotate(${rot}deg)`;
      });

      setTimeout(() => {
        el.style.opacity = "0";
      }, (dur - 1.4) * 1000);

      setTimeout(() => el.remove(), (dur + 1.5) * 1000);

      scheduleNext();
    }

    function scheduleNext() {
      if (!running) return;
      const base = Math.max(200, 2400 - intensity * 200);
      timer = setTimeout(spawn, base + Math.random() * 600);
    }

    scheduleNext();

    return () => {
      running = false;
      clearTimeout(timer);
    };
  }, [intensity]);

  return layerRef;
}

interface PetalsProps {
  intensity?: number;
}

export function Petals({ intensity = 10 }: PetalsProps) {
  const ref = usePetals(intensity);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[50] overflow-hidden"
    />
  );
}
