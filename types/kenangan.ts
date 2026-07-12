export const KENANGAN_IMAGEKIT_URL_BASE = "https://ik.imagekit.io/geb6bfhmhx";

export type KenanganEventStatus = "draft" | "live" | "closed" | "published";

export const KENANGAN_TIERS = [
  { id: "intimate", name: "Intimate", guestCap: 100, priceIdr: 300_000 },
  { id: "standard", name: "Standard", guestCap: 300, priceIdr: 600_000 },
  { id: "grand", name: "Grand", guestCap: 600, priceIdr: 1_200_000 },
] as const;

export type KenanganTierId = (typeof KENANGAN_TIERS)[number]["id"];

export function getKenanganTier(id: string | undefined) {
  return KENANGAN_TIERS.find((t) => t.id === id) ?? KENANGAN_TIERS[1];
}

export type KenanganOrderStatus = "pending" | "confirmed";

export interface KenanganOrder {
  eventId: string;
  amountIdr: number;
  status: KenanganOrderStatus;
  confirmedAt?: unknown;
  createdAt?: unknown;
}
export type KenanganDownloadMode = "after_publish" | "instant_share";

export interface KenanganEvent {
  slug: string;
  name: string;
  /** ISO date string, e.g. "2026-08-01" */
  eventDate: string;
  coverUrl?: string;
  tier?: string;
  guestCap?: number;
  themeId?: string;
  downloadMode: KenanganDownloadMode;
  status: KenanganEventStatus;
  hostAccessCode: string;
  enhancementPurchased: boolean;
  publishedAt?: unknown;
  createdAt?: unknown;
}

export type KenanganPhotoStatus = "live" | "hidden" | "keeper" | "enhanced" | "failed";

export interface KenanganPhoto {
  guestSessionId: string;
  lutId: string;
  /** ImageKit path, e.g. /kenangan/{eventId}/{photoId}.jpg */
  originalPath: string;
  enhancedPath?: string;
  status: KenanganPhotoStatus;
  width: number;
  height: number;
  createdAt?: unknown;
}

export function kenanganThumbUrl(originalPath: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${originalPath}?tr=w-400,q-70`;
}

export function kenanganFullUrl(path: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${path}`;
}
