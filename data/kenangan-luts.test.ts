import { describe, expect, it } from "vitest";
import {
  KENANGAN_LUT_PRESETS,
  KENANGAN_LUT_SIZE,
  applyKenanganLut,
  applyKenanganLutToRaw,
  buildKenanganLutTextureData,
  getKenanganLutPreset,
  type KenanganLutPreset,
} from "./kenangan-luts";

describe("kenangan LUT presets", () => {
  it("natural preset is the identity", () => {
    const natural = getKenanganLutPreset("natural");
    for (const v of [0, 0.25, 0.5, 0.75, 1]) {
      const [r, g, b] = applyKenanganLut(natural, v, v * 0.5, 1 - v);
      expect(r).toBeCloseTo(v, 10);
      expect(g).toBeCloseTo(v * 0.5, 10);
      expect(b).toBeCloseTo(1 - v, 10);
    }
  });

  it("mono preset fully desaturates", () => {
    const mono = getKenanganLutPreset("mono");
    const [r, g, b] = applyKenanganLut(mono, 0.8, 0.3, 0.5);
    expect(r).toBeCloseTo(g, 10);
    expect(g).toBeCloseTo(b, 10);
  });

  it("always clamps output to 0..1", () => {
    for (const preset of KENANGAN_LUT_PRESETS) {
      for (const v of [0, 1]) {
        for (const c of applyKenanganLut(preset, v, v, v)) {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("raw-buffer apply (server path) matches the per-pixel function", () => {
    const preset = getKenanganLutPreset("senja");
    const raw = new Uint8Array([12, 200, 90, 255, 0, 128, 255, 255]);
    const expected: number[] = [];
    for (let i = 0; i < raw.length; i += 4) {
      const [r, g, b] = applyKenanganLut(preset, raw[i] / 255, raw[i + 1] / 255, raw[i + 2] / 255);
      expected.push(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), raw[i + 3]);
    }
    applyKenanganLutToRaw(raw, 4, preset);
    expect([...raw]).toEqual(expected);
  });

  it("texture atlas layout matches applyKenanganLut (x = b*N + r, y = g)", () => {
    const n = KENANGAN_LUT_SIZE;
    const preset = getKenanganLutPreset("senja");
    const data = buildKenanganLutTextureData(preset);
    expect(data.length).toBe(n * n * n * 4);

    for (const [ri, gi, bi] of [
      [0, 0, 0],
      [n - 1, n - 1, n - 1],
      [5, 20, 11],
    ]) {
      const [r, g, b] = applyKenanganLut(preset, ri / (n - 1), gi / (n - 1), bi / (n - 1));
      const offset = (gi * n * n + bi * n + ri) * 4;
      expect(data[offset]).toBe(Math.round(r * 255));
      expect(data[offset + 1]).toBe(Math.round(g * 255));
      expect(data[offset + 2]).toBe(Math.round(b * 255));
      expect(data[offset + 3]).toBe(255);
    }
  });
});

// ---------------------------------------------------------------------------
// §12 parity: the WebGL preview samples a quantized 33³ LUT texture with
// trilinear interpolation; the server applies the grade function directly at
// full res. Emulate the shader's exact sampling in JS and assert the colour
// difference stays visually negligible (ΔE-equivalent: < ~1/255 per channel
// away from clamp kinks; small tolerance covers 8-bit quantization +
// interpolation error at the kinks).

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Mirror of the fragment shader: bilinear within a blue slice + slice mix. */
function sampleLutTextureLikeShader(
  texture: Uint8Array,
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const n = KENANGAN_LUT_SIZE;
  const texel = (ri: number, gi: number, bi: number): [number, number, number] => {
    const off = (gi * n * n + bi * n + ri) * 4;
    return [texture[off] / 255, texture[off + 1] / 255, texture[off + 2] / 255];
  };
  const lerp = (a: [number, number, number], c: [number, number, number], t: number) =>
    [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t] as [
      number,
      number,
      number,
    ];

  const rf = clamp01(r) * (n - 1);
  const gf = clamp01(g) * (n - 1);
  const bf = clamp01(b) * (n - 1);
  const r0 = Math.floor(rf);
  const r1 = Math.min(r0 + 1, n - 1);
  const g0 = Math.floor(gf);
  const g1 = Math.min(g0 + 1, n - 1);
  const b0 = Math.floor(bf);
  const b1 = Math.min(b0 + 1, n - 1);

  const slice = (bi: number): [number, number, number] => {
    const top = lerp(texel(r0, g0, bi), texel(r1, g0, bi), rf - r0);
    const bottom = lerp(texel(r0, g1, bi), texel(r1, g1, bi), rf - r0);
    return lerp(top, bottom, gf - g0);
  };
  return lerp(slice(b0), slice(b1), bf - b0);
}

describe("WebGL preview vs server LUT parity (§12)", () => {
  const TOLERANCE = 0.015; // ≈ 3.8/255 per channel, worst case at clamp kinks

  function maxChannelError(preset: KenanganLutPreset): number {
    const texture = buildKenanganLutTextureData(preset);
    let worst = 0;
    // deterministic pseudo-random sweep of the colour cube
    let seed = 42;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 2000; i++) {
      const r = rand();
      const g = rand();
      const b = rand();
      const gpu = sampleLutTextureLikeShader(texture, r, g, b);
      const server = applyKenanganLut(preset, r, g, b);
      for (let c = 0; c < 3; c++) {
        worst = Math.max(worst, Math.abs(gpu[c] - server[c]));
      }
    }
    return worst;
  }

  for (const preset of KENANGAN_LUT_PRESETS) {
    it(`preset "${preset.id}" grades identically in both paths`, () => {
      expect(maxChannelError(preset)).toBeLessThanOrEqual(TOLERANCE);
    });
  }
});
