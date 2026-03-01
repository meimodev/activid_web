import { getInvitationTemplateThemes } from "@/data/invitation-templates";

type InvitationThemeColors = {
  mainColor: string;
  accentColor: string;
  accent2Color?: string;
  darkColor?: string;
};

type DerivedInvitationTheme = InvitationThemeColors & {
  bgAlt: string;
  text: string;
  textLight: string;
  accentLight: string;
  accent2Light: string;
  dark: string;
  onAccent: string;
  onAccent2: string;
  onDark: string;
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
  const accent2Rgb = hexToRgb(theme.accent2Color ?? theme.accentColor) ?? accentRgb;

  const lum = relativeLuminance(mainRgb);
  const isDark = lum < 0.36;

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const bgAlt = rgbToHex(mix(mainRgb, isDark ? white : black, isDark ? 0.1 : 0.08));
  const text = isDark ? "#EAF7FF" : "#4A4A4A";
  const textLight = isDark ? "#A6C3D7" : "#8E9196";
  const accentLight = rgbToHex(mix(accentRgb, isDark ? white : mainRgb, isDark ? 0.35 : 0.45));
  const accent2Light = rgbToHex(mix(accent2Rgb, isDark ? white : mainRgb, isDark ? 0.35 : 0.45));
  const dark = theme.darkColor
    ? rgbToHex(hexToRgb(theme.darkColor) ?? (isDark ? { r: 2, g: 6, b: 5 } : mix(accentRgb, black, 0.55)))
    : isDark
      ? "#020205"
      : rgbToHex(mix(accentRgb, black, 0.55));

  const darkRgb = hexToRgb(dark) ?? { r: 2, g: 6, b: 5 };

  const accentLum = relativeLuminance(accentRgb);
  const accent2Lum = relativeLuminance(accent2Rgb);
  const darkLum = relativeLuminance(darkRgb);
  const onAccent = accentLum > 0.55 ? "#1F1B16" : "#FFFFFF";
  const onAccent2 = accent2Lum > 0.55 ? "#1F1B16" : "#FFFFFF";
  const onDark = darkLum > 0.55 ? "#1F1B16" : "#FFFFFF";

  return {
    ...theme,
    bgAlt,
    text,
    textLight,
    accentLight,
    accent2Light,
    dark,
    onAccent,
    onAccent2,
    onDark,
  };
}

export function resolveInvitationTheme(templateId: string, theme?: InvitationThemeColors): DerivedInvitationTheme {
  const fallback = getInvitationTemplateThemes(templateId)[0];

  if (theme?.mainColor && theme?.accentColor) {
    return deriveThemeColors({
      ...theme,
      accent2Color: theme.accent2Color ?? fallback?.accent2Color,
      darkColor: theme.darkColor ?? fallback?.darkColor,
    });
  }

  return deriveThemeColors(
    fallback
      ? {
          mainColor: fallback.mainColor,
          accentColor: fallback.accentColor,
          accent2Color: fallback.accent2Color,
          darkColor: fallback.darkColor,
        }
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
    "--invitation-accent-2": resolved.accent2Color ?? resolved.accentColor,
    "--invitation-accent-2-light": resolved.accent2Light,
    "--invitation-dark": resolved.dark,
    "--invitation-on-accent": resolved.onAccent,
    "--invitation-on-accent-2": resolved.onAccent2,
    "--invitation-on-dark": resolved.onDark,
  } as Record<string, string>;
}
