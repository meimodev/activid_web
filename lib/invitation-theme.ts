import { getInvitationTemplateThemes } from "@/data/invitation-templates";

type InvitationThemeColors = {
  mainColor: string;
  accentColor: string;
};

type DerivedInvitationTheme = InvitationThemeColors & {
  bgAlt: string;
  text: string;
  textLight: string;
  accentLight: string;
  dark: string;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, "");
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }

  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return { r, g, b };
  }

  return null;
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(rgb.r))}${toHex(Math.round(rgb.g))}${toHex(Math.round(rgb.b))}`;
}

function mix(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  const tt = clamp01(t);
  return {
    r: a.r + (b.r - a.r) * tt,
    g: a.g + (b.g - a.g) * tt,
    b: a.b + (b.b - a.b) * tt,
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function deriveThemeColors(theme: InvitationThemeColors): DerivedInvitationTheme {
  const mainRgb = hexToRgb(theme.mainColor) ?? { r: 249, g: 247, b: 242 };
  const accentRgb = hexToRgb(theme.accentColor) ?? { r: 128, g: 0, b: 32 };

  const lum = relativeLuminance(mainRgb);
  const isDark = lum < 0.36;

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const bgAlt = rgbToHex(mix(mainRgb, isDark ? white : black, isDark ? 0.1 : 0.08));
  const text = isDark ? "#EAF7FF" : "#4A4A4A";
  const textLight = isDark ? "#A6C3D7" : "#8E9196";
  const accentLight = rgbToHex(mix(accentRgb, isDark ? white : mainRgb, isDark ? 0.35 : 0.45));
  const dark = isDark ? "#020205" : "#2A1B1B";

  return {
    ...theme,
    bgAlt,
    text,
    textLight,
    accentLight,
    dark,
  };
}

export function resolveInvitationTheme(templateId: string, theme?: InvitationThemeColors): DerivedInvitationTheme {
  if (theme?.mainColor && theme?.accentColor) {
    return deriveThemeColors(theme);
  }

  const fallback = getInvitationTemplateThemes(templateId)[0];
  return deriveThemeColors(
    fallback
      ? { mainColor: fallback.mainColor, accentColor: fallback.accentColor }
      : { mainColor: "#F9F7F2", accentColor: "#800020" },
  );
}

export function getInvitationThemeStyle(templateId: string, theme?: InvitationThemeColors) {
  const resolved = resolveInvitationTheme(templateId, theme);

  return {
    "--invitation-bg": resolved.mainColor,
    "--invitation-bg-alt": resolved.bgAlt,
    "--invitation-text": resolved.text,
    "--invitation-text-light": resolved.textLight,
    "--invitation-accent": resolved.accentColor,
    "--invitation-accent-light": resolved.accentLight,
    "--invitation-dark": resolved.dark,
  } as Record<string, string>;
}
