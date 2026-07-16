export const KENANGAN_IMAGEKIT_URL_BASE = "https://ik.imagekit.io/geb6bfhmhx";

// `closed` is the terminal, published state — closing an event publishes its
// gallery (ADR-0007). `published` is a legacy value: never written anymore, but
// still read as "closed" so pre-ADR-0007 events keep working.
export type KenanganEventStatus = "draft" | "live" | "closed" | "published";

/** True for the terminal published state — `closed`, or legacy `published`. */
export function isKenanganPublished(status: string): boolean {
  return status === "closed" || status === "published";
}

export const KENANGAN_TIERS = [
  { id: "intimate", name: "Intimate", guestCap: 100, priceIdr: 300_000 },
  { id: "standard", name: "Standard", guestCap: 300, priceIdr: 600_000 },
  { id: "grand", name: "Grand", guestCap: 600, priceIdr: 1_200_000 },
  { id: "premium", name: "Premium", guestCap: 1200, priceIdr: 1_800_000 },
  { id: "ultimate", name: "Ultimate", guestCap: 2000, priceIdr: 2_400_000 },
] as const;

export type KenanganTierId = (typeof KENANGAN_TIERS)[number]["id"];

export function getKenanganTier(id: string | undefined) {
  return KENANGAN_TIERS.find((t) => t.id === id) ?? KENANGAN_TIERS[1];
}

/** Event category chosen once at creation. `id` (kebab) doubles as the leading
 *  slug token; `label` leads the display title. "acara" is the generic default.
 *  Set-once and baked into the frozen slug — see ADR-0006. */
export const KENANGAN_EVENT_TYPES = [
  { id: "pernikahan", label: "Pernikahan" },
  { id: "ulang-tahun", label: "Ulang Tahun" },
  { id: "syukuran", label: "Syukuran" },
  { id: "acara", label: "Acara" },
] as const;

export type KenanganEventTypeId = (typeof KENANGAN_EVENT_TYPES)[number]["id"];

export const KENANGAN_DEFAULT_EVENT_TYPE: KenanganEventTypeId = "acara";

export function isKenanganEventType(id: string): id is KenanganEventTypeId {
  return KENANGAN_EVENT_TYPES.some((t) => t.id === id);
}

/** Display title = "{type label} {name}". Legacy events without an eventType
 *  (or an unknown one) show the raw name unprefixed — see ADR-0006. */
export function kenanganEventTitle(event: { eventType?: string; name: string }): string {
  const type = KENANGAN_EVENT_TYPES.find((t) => t.id === event.eventType);
  return type ? `${type.label} ${event.name}` : event.name;
}

/** Admin WhatsApp for manual payment confirmation. E.164, no leading '+'. */
export const KENANGAN_ADMIN_WHATSAPP = "62881080088816";

/** Flat per-photo AI-enhancement price, host and guest identical (ADR-0008). */
export const KENANGAN_ENHANCE_PRICE_IDR = 3000;

/** wa.me link to the admin with a prefilled message. */
export function kenanganAdminWaLink(text: string): string {
  return `https://wa.me/${KENANGAN_ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export type KenanganOrderStatus = "pending" | "confirmed";

/** "paket" = upfront capacity charge that gates going Live; "enhancement" =
 *  post-event AI gallery purchase. Orders written before this split have no
 *  `kind` and are treated as "enhancement". */
export type KenanganOrderKind = "paket" | "enhancement";

export interface KenanganOrder {
  eventId: string;
  kind?: KenanganOrderKind;
  amountIdr: number;
  /** For `enhancement` orders: the photos this order pays to enhance (ADR-0008). */
  photoIds?: string[];
  /** Who funded an `enhancement` order. Guest orders auto-enqueue the enhance on
   *  confirm (the guest has no trigger UI); host orders are host-paced. */
  paidBy?: "host" | "guest";
  status: KenanganOrderStatus;
  confirmedAt?: unknown;
  createdAt?: unknown;
}

/** Missing kind (legacy order) reads as an enhancement order. */
export function kenanganOrderKind(order: { kind?: string }): KenanganOrderKind {
  return order.kind === "paket" ? "paket" : "enhancement";
}
export interface KenanganEvent {
  slug: string;
  name: string;
  /** Event category, set once at creation. Absent on legacy events. See ADR-0006. */
  eventType?: KenanganEventTypeId;
  /** Firebase Auth uid of the host account that owns this event. */
  ownerUid: string;
  /** ISO date string, e.g. "2026-08-01" */
  eventDate: string;
  coverUrl?: string;
  tier?: string;
  guestCap?: number;
  themeId?: string;
  status: KenanganEventStatus;
  /** @deprecated Flat enhancement unlock — replaced by the per-photo `paid`
   *  flag (ADR-0008). Retained only to grandfather legacy events. */
  enhancementPurchased: boolean;
  publishedAt?: unknown;
  createdAt?: unknown;
}

/** A host account (Google identity), keyed by Firebase Auth uid. */
export interface KenanganHost {
  email: string | null;
  name?: string | null;
  photoUrl?: string | null;
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

// Visibility only — one axis (ADR-0007). Enhancement is orthogonal, tracked by
// `enhancedPath` + `enhanceState`. Legacy photos may carry `keeper`/`enhanced`/
// `failed`; those read as visible (only `hidden` drops a photo from guests).
export type KenanganPhotoStatus = "live" | "hidden";

/** In-flight / failed AI enhancement of a single photo. Absent = never enhanced
 *  (or already done — success sets `enhancedPath` and clears this). ADR-0007. */
export type KenanganEnhanceState = "pending" | "failed";

export interface KenanganPhoto {
  guestSessionId: string;
  lutId: string;
  /** ImageKit path, e.g. /kenangan/{eventId}/{photoId}.jpg */
  originalPath: string;
  enhancedPath?: string;
  enhanceState?: KenanganEnhanceState;
  status: KenanganPhotoStatus;
  /** Per-photo enhancement purchase (ADR-0008); absent = unpaid. Gates the
   *  enhance route; `paidBy` distinguishes host- from guest-funded. */
  paid?: boolean;
  paidBy?: "host" | "guest";
  paidAt?: unknown;
  paidOrderId?: string;
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
