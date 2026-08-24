import { describe, expect, it } from "vitest";
import { LAYOUTS, MOTIFS, PALETTES, pickDesign } from "./design";

const TOKENS = Object.keys(PALETTES[0].vars);

describe("redirect design deck", () => {
  it("gives every palette the identical token set", () => {
    for (const palette of PALETTES) {
      expect(Object.keys(palette.vars).sort(), palette.id).toEqual([...TOKENS].sort());
    }
  });

  it("keeps ember byte-identical to the locked original", () => {
    const ember = PALETTES.find((p) => p.id === "ember");
    expect(ember?.vars["--rl-ground"]).toBe("oklch(0.198 0.026 44)");
    expect(ember?.vars["--rl-accent"]).toBe("oklch(0.822 0.152 82)");
  });

  it("only ever rolls a known palette, layout and motif", () => {
    const ids = new Set<string>();
    const layouts = new Set<string>();
    const motifs = new Set<string>();
    for (let i = 0; i < 600; i += 1) {
      const { palette, layout, motif } = pickDesign();
      expect(PALETTES).toContain(palette);
      expect(LAYOUTS).toContain(layout);
      expect(MOTIFS).toContain(motif);
      ids.add(palette.id);
      layouts.add(layout);
      motifs.add(motif);
    }
    // 600 rolls without covering an axis means the picker is stuck.
    expect(ids.size).toBe(PALETTES.length);
    expect(layouts.size).toBe(LAYOUTS.length);
    expect(motifs.size).toBe(MOTIFS.length);
  });

  it("rolls the three axes independently", () => {
    const combos = new Set<string>();
    for (let i = 0; i < 4000; i += 1) {
      const { palette, layout, motif } = pickDesign();
      combos.add(`${palette.id}/${layout}/${motif}`);
    }
    // Any axis silently coupled to another collapses the deck.
    expect(combos.size).toBe(PALETTES.length * LAYOUTS.length * MOTIFS.length);
  });
});
