"use client";

import { Vine, VineWavy, VineVertical, VineOrnamental, VineCascade } from "@/components/assets";

const assets = [
  {
    name: "Vine",
    description: "Horizontal meandering vine with leaves & 6-petal flowers",
    component: Vine,
    container: "h-36",
  },
  {
    name: "VineWavy",
    description: "Full sine-wave with spiral tendrils & teardrop buds",
    component: VineWavy,
    container: "h-36",
  },
  {
    name: "VineVertical",
    description: "Climbing spine with alternating leaves & bell flowers",
    component: VineVertical,
    container: "h-80",
  },
  {
    name: "VineOrnamental",
    description: "Arched flourishes with diamond motifs & parallel lines",
    component: VineOrnamental,
    container: "h-40",
  },
  {
    name: "VineCascade",
    description: "Hanging/drooping vines with roses at tips",
    component: VineCascade,
    container: "h-44",
  },
];

export default function AssetsPage() {
  return (
    <div
      className="min-h-[100dvh] px-6 py-12"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #1a1228 0%, #0d0a14 38%, #05030a 100%)",
        color: "#e3d7c5",
        fontFamily: "Georgia, serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        :root {
          --invitation-accent: #c9a961;
          --invitation-accent-light: #d4be82;
          --invitation-accent-2: #3a2f1f;
          --invitation-text: #e3d7c5;
          --invitation-text-light: #8a7f6e;
          --invitation-bg: #0d0a14;
          --invitation-bg-alt: #1a1228;
          --invitation-dark: #05030a;
        }
      `}</style>

      <h1 className="text-3xl text-center mb-2" style={{ color: "var(--invitation-accent)" }}>
        Vine Assets
      </h1>
      <p className="text-center text-sm mb-12" style={{ color: "var(--invitation-text-light)" }}>
        Animated SVG vine variations — scroll-triggered, theme-aware
      </p>

      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        {assets.map(({ name, description, component: VineComponent, container }) => (
          <div key={name}>
            <h2 className="text-sm tracking-[0.2em] uppercase mb-1" style={{ color: "var(--invitation-accent)" }}>
              {name}
            </h2>
            <p className="text-xs mb-4" style={{ color: "var(--invitation-text-light)" }}>
              {description}
            </p>
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: "color-mix(in srgb, var(--invitation-accent) 15%, transparent)",
                background: "color-mix(in srgb, var(--invitation-bg) 60%, transparent)",
              }}
            >
              <div className={container}>
                <VineComponent className="w-full h-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
