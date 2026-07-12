import type { KenanganLutId } from "./kenangan-luts";

export interface KenanganTheme {
  id: string;
  /** Host-facing label (Bahasa Indonesia) */
  name: string;
  /** LUT presets offered to guests on the capture screen, in order */
  lutIds: KenanganLutId[];
}

// ponytail: static theme list, move to kenanganThemes collection when LUT
// sets stop being fixed.
export const KENANGAN_THEMES: KenanganTheme[] = [
  { id: "hangat", name: "Hangat", lutIds: ["natural", "senja", "lembut", "mono"] },
  { id: "klasik", name: "Klasik", lutIds: ["natural", "mono"] },
  { id: "ceria", name: "Ceria", lutIds: ["natural", "lembut", "senja"] },
];

export const KENANGAN_DEFAULT_THEME_ID = "hangat";

export function isKenanganThemeId(value: unknown): value is string {
  return KENANGAN_THEMES.some((t) => t.id === value);
}

export function getKenanganTheme(id: string | undefined): KenanganTheme {
  return KENANGAN_THEMES.find((t) => t.id === id) ?? KENANGAN_THEMES[0];
}
