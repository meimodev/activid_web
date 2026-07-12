// KenanganKita LUT presets. Shared by the client WebGL preview and the
// server-side full-res re-apply so both paths grade identically.
//
// ponytail: presets are parametric grades (not .cube files) — the same pure
// function generates the WebGL LUT texture and the server-side per-pixel
// apply, which guarantees colour parity by construction. Swap cubeUrl-based
// LUTs in when a colourist authors real ones.

export type KenanganLutId = "natural" | "senja" | "lembut" | "mono";

export interface KenanganLutPreset {
  id: KenanganLutId;
  /** Guest-facing label (Bahasa Indonesia) */
  name: string;
  exposure: number;
  lift: number;
  warmth: number;
  contrast: number;
  saturation: number;
}

export const KENANGAN_LUT_PRESETS: KenanganLutPreset[] = [
  { id: "natural", name: "Natural", exposure: 1, lift: 0, warmth: 0, contrast: 1, saturation: 1 },
  { id: "senja", name: "Senja", exposure: 1.02, lift: 0.04, warmth: 0.045, contrast: 1.06, saturation: 0.92 },
  { id: "lembut", name: "Lembut", exposure: 1.04, lift: 0.06, warmth: 0.015, contrast: 0.94, saturation: 0.88 },
  { id: "mono", name: "Mono", exposure: 1.01, lift: 0.03, warmth: 0, contrast: 1.12, saturation: 0 },
];

export function isKenanganLutId(value: unknown): value is KenanganLutId {
  return KENANGAN_LUT_PRESETS.some((p) => p.id === value);
}

export function getKenanganLutPreset(id: string): KenanganLutPreset {
  return KENANGAN_LUT_PRESETS.find((p) => p.id === id) ?? KENANGAN_LUT_PRESETS[0];
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Apply a preset to one sRGB pixel (components in 0..1). Pure + deterministic. */
export function applyKenanganLut(
  preset: KenanganLutPreset,
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  r *= preset.exposure;
  g *= preset.exposure;
  b *= preset.exposure;

  r = preset.lift + r * (1 - preset.lift);
  g = preset.lift + g * (1 - preset.lift);
  b = preset.lift + b * (1 - preset.lift);

  r += preset.warmth;
  b -= preset.warmth;

  r = (r - 0.5) * preset.contrast + 0.5;
  g = (g - 0.5) * preset.contrast + 0.5;
  b = (b - 0.5) * preset.contrast + 0.5;

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  r = luma + (r - luma) * preset.saturation;
  g = luma + (g - luma) * preset.saturation;
  b = luma + (b - luma) * preset.saturation;

  return [clamp01(r), clamp01(g), clamp01(b)];
}

/**
 * Apply a preset in place to an interleaved raw pixel buffer (RGB or RGBA,
 * 8-bit). This is the server-side full-res path — same math as the WebGL
 * preview, so colour parity holds by construction.
 */
export function applyKenanganLutToRaw(
  data: Uint8Array | Uint8ClampedArray,
  channels: number,
  preset: KenanganLutPreset,
): void {
  for (let i = 0; i + 2 < data.length; i += channels) {
    const [r, g, b] = applyKenanganLut(preset, data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
    data[i] = Math.round(r * 255);
    data[i + 1] = Math.round(g * 255);
    data[i + 2] = Math.round(b * 255);
  }
}

/** 3D LUT grid size. 33 is the industry-standard .cube resolution. */
export const KENANGAN_LUT_SIZE = 33;

/**
 * Bake a preset into RGBA texture data laid out as a 2D atlas of blue slices:
 * width = N*N (x = blueIndex * N + redIndex), height = N (y = greenIndex).
 * Matches the sampling in the WebGL preview shader.
 */
export function buildKenanganLutTextureData(preset: KenanganLutPreset): Uint8Array {
  const n = KENANGAN_LUT_SIZE;
  const data = new Uint8Array(n * n * n * 4);
  for (let bi = 0; bi < n; bi++) {
    for (let gi = 0; gi < n; gi++) {
      for (let ri = 0; ri < n; ri++) {
        const [r, g, b] = applyKenanganLut(preset, ri / (n - 1), gi / (n - 1), bi / (n - 1));
        const offset = (gi * n * n + bi * n + ri) * 4;
        data[offset] = Math.round(r * 255);
        data[offset + 1] = Math.round(g * 255);
        data[offset + 2] = Math.round(b * 255);
        data[offset + 3] = 255;
      }
    }
  }
  return data;
}
