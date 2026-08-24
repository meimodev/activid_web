/**
 * A redirect screen is on someone's phone for two seconds, so the variety has
 * to land instantly: the palette and the ambient motif are rolled server-side
 * on every request. The route is dynamic, so the choice ships inside the HTML
 * and there is nothing to hydrate or flash.
 */

export type Palette = {
  id: string;
  /** Custom properties spread onto the page root. */
  vars: Record<string, string>;
};

/**
 * `ember` is the locked original. Its values are byte-for-byte what shipped
 * before variants existed; the others are tuned to sit beside it, not to
 * replace it.
 */
export const PALETTES: Palette[] = [
  {
    id: "ember",
    vars: {
      "--rl-ground": "oklch(0.198 0.026 44)",
      "--rl-ink": "oklch(0.968 0.008 85)",
      "--rl-ink-2": "oklch(0.712 0.021 62)",
      "--rl-ink-3": "oklch(0.508 0.019 55)",
      "--rl-accent": "oklch(0.822 0.152 82)",
      "--rl-accent-deep": "oklch(0.742 0.148 78)",
      "--rl-on-accent": "oklch(0.158 0.022 44)",
      "--rl-deco": "oklch(0.822 0.152 82 / 0.16)",
      "--rl-hair": "oklch(0.968 0.008 85 / 0.14)",
    },
  },
  {
    id: "orchid",
    vars: {
      "--rl-ground": "oklch(0.213 0.062 328)",
      "--rl-ink": "oklch(0.972 0.012 320)",
      "--rl-ink-2": "oklch(0.735 0.038 322)",
      "--rl-ink-3": "oklch(0.522 0.042 324)",
      "--rl-accent": "oklch(0.868 0.158 118)",
      "--rl-accent-deep": "oklch(0.788 0.152 116)",
      "--rl-on-accent": "oklch(0.182 0.052 328)",
      "--rl-deco": "oklch(0.868 0.158 118 / 0.14)",
      "--rl-hair": "oklch(0.972 0.012 320 / 0.16)",
    },
  },
  {
    id: "tide",
    vars: {
      "--rl-ground": "oklch(0.232 0.048 196)",
      "--rl-ink": "oklch(0.965 0.012 190)",
      "--rl-ink-2": "oklch(0.728 0.032 192)",
      "--rl-ink-3": "oklch(0.518 0.032 194)",
      "--rl-accent": "oklch(0.878 0.092 78)",
      "--rl-accent-deep": "oklch(0.808 0.098 74)",
      "--rl-on-accent": "oklch(0.198 0.042 196)",
      "--rl-deco": "oklch(0.878 0.092 78 / 0.15)",
      "--rl-hair": "oklch(0.965 0.012 190 / 0.15)",
    },
  },
  {
    // The one light palette, so the deck does not read as "dark mode with hue
    // knobs". Ink on cream, one vermillion.
    id: "paper",
    vars: {
      "--rl-ground": "oklch(0.952 0.018 92)",
      "--rl-ink": "oklch(0.228 0.022 58)",
      "--rl-ink-2": "oklch(0.472 0.022 56)",
      "--rl-ink-3": "oklch(0.652 0.024 62)",
      "--rl-accent": "oklch(0.572 0.192 32)",
      "--rl-accent-deep": "oklch(0.502 0.182 30)",
      "--rl-on-accent": "oklch(0.975 0.012 82)",
      "--rl-deco": "oklch(0.572 0.192 32 / 0.16)",
      "--rl-hair": "oklch(0.228 0.022 58 / 0.16)",
    },
  },
];

/**
 * Layout topologies. Each rearranges the same four elements into a different
 * silhouette; `stack` is the locked original. Rolled independently of the
 * palette, so the deck varies in shape and not only in hue.
 */
export const LAYOUTS = ["stack", "split", "rail", "crest"] as const;
export type Layout = (typeof LAYOUTS)[number];

/** Ambient background motifs. Rolled independently of the palette. */
export const MOTIFS = ["rings", "grid", "sparks"] as const;
export type Motif = (typeof MOTIFS)[number];

/** Fixed so the scatter reads as composed rather than accidental. */
export const SPARKS = [
  { x: "12%", y: "18%", size: "0.75rem", delay: 120, round: false },
  { x: "78%", y: "12%", size: "1.25rem", delay: 260, round: true },
  { x: "88%", y: "44%", size: "0.5rem", delay: 380, round: false },
  { x: "22%", y: "62%", size: "1rem", delay: 200, round: true },
  { x: "62%", y: "74%", size: "0.625rem", delay: 460, round: false },
  { x: "8%", y: "86%", size: "1.125rem", delay: 340, round: true },
  { x: "46%", y: "30%", size: "0.5rem", delay: 540, round: false },
] as const;

export function pickDesign(): { palette: Palette; layout: Layout; motif: Motif } {
  return {
    palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
    layout: LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)],
    motif: MOTIFS[Math.floor(Math.random() * MOTIFS.length)],
  };
}
