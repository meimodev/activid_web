import { KENANGAN_IMAGEKIT_URL_BASE } from "@/types/kenangan";

export interface KenanganDefaultCover {
  /** Stable id; also the imagekit filename stem. */
  id: string;
  /** Host-facing label (Bahasa Indonesia). Named after a LUT theme mood, but
   *  selectable independently of the event's themeId. See CONTEXT.md. */
  label: string;
  url: string;
}

// Generated once via replicate imagen-4 (4:3, no faces), tinypng-optimized,
// stored in imagekit /kenangan/defaults/. Shared across all events — never
// deleted by a host's cover change (the cover-delete route guards this path).
export const KENANGAN_DEFAULT_COVERS: KenanganDefaultCover[] = [
  {
    id: "hangat",
    label: "Hangat",
    url: `${KENANGAN_IMAGEKIT_URL_BASE}/kenangan/defaults/kk-cover-hangat.jpg`,
  },
  {
    id: "klasik",
    label: "Klasik",
    url: `${KENANGAN_IMAGEKIT_URL_BASE}/kenangan/defaults/kk-cover-klasik.jpg`,
  },
  {
    id: "ceria",
    label: "Ceria",
    url: `${KENANGAN_IMAGEKIT_URL_BASE}/kenangan/defaults/kk-cover-ceria.jpg`,
  },
];

/** Default cover url for a theme. Cover ids mirror theme ids 1:1; unknown
 *  themes fall back to the first cover. Used to seed coverUrl at event creation. */
export function kenanganCoverForTheme(themeId: string | undefined): string {
  return (KENANGAN_DEFAULT_COVERS.find((c) => c.id === themeId) ?? KENANGAN_DEFAULT_COVERS[0]).url;
}
