"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "var(--invitation-accent)",
  "var(--invitation-accent-light)",
  "var(--invitation-text)",
  "var(--invitation-bg-alt)",
  "var(--invitation-accent-2)",
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

      const isPetal = Math.random() < 0.7;
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        will-change: transform, opacity;
        opacity: 0;
        pointer-events: none;
      `;

      const size = 6 + Math.random() * (isPetal ? 14 : 4);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const startX = Math.random() * window.innerWidth;
      const drift = (Math.random() - 0.5) * 200;
      const dur = 8 + Math.random() * 10;
      const rot = Math.random() * 720 - 360;
      const delay = Math.random() * 0.4;

      if (isPetal) {
        el.innerHTML = `
          <svg viewBox="0 0 20 20" width="${size}" height="${size}" style="display:block">
            <path d="M10 1 C 4 4, 2 12, 10 19 C 18 12, 16 4, 10 1 Z"
                  fill="${color}" opacity="0.85"/>
            <path d="M10 4 Q10 12 10 17" stroke="rgba(0,0,0,0.18)" stroke-width="0.5" fill="none"/>
          </svg>`;
      } else {
        el.innerHTML = `
          <svg viewBox="0 0 12 12" width="${size * 1.6}" height="${size * 1.6}" style="display:block">
            <path d="M6 0 L6.6 5.4 L12 6 L6.6 6.6 L6 12 L5.4 6.6 L0 6 L5.4 5.4 Z"
                  fill="${color}" opacity="0.9"/>
          </svg>`;
      }

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
