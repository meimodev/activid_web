import "server-only";

import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganPublished, kenanganOrderKind, type KenanganEnhanceState, type KenanganEvent, type KenanganOrder, type KenanganOrderStatus, type KenanganPhotoStatus } from "@/types/kenangan";
import { isKenanganLutId, type KenanganLutId } from "@/data/kenangan-luts";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

const KENANGAN_EVENT_REVALIDATE_SECONDS = 60 * 5;

/** Host moderation page size — shared by the SSR initial load and the API's
 *  "load more" so the cursor pagination stays consistent across both. */
export const KENANGAN_HOST_PAGE_SIZE = 60;

export interface KenanganHostPhoto {
  id: string;
  status: KenanganPhotoStatus;
  originalPath: string;
  enhancedPath?: string;
  enhanceState?: KenanganEnhanceState;
  createdAtMs: number;
}

/** Host-only photo list (all statuses), createdAt-desc, cursor-paged. Used by
 *  both the moderation page's SSR initial render and the /photos API. */
export async function listKenanganHostPhotos(
  eventId: string,
  afterMs?: number,
): Promise<{ photos: KenanganHostPhoto[]; hasMore: boolean }> {
  let query = getAdminDb()
    .collection("kenanganEvents")
    .doc(eventId)
    .collection("photos")
    .orderBy("createdAt", "desc")
    .limit(KENANGAN_HOST_PAGE_SIZE);
  if (afterMs !== undefined && Number.isFinite(afterMs)) {
    query = query.startAfter(Timestamp.fromMillis(afterMs));
  }
  const snap = await query.get();
  const photos = snap.docs.map((doc) => {
    const data = doc.data();
    // Legacy `keeper`/`enhanced`/`failed` collapse to visible; only `hidden`
    // hides (ADR-0007).
    return {
      id: doc.id,
      status: (data.status === "hidden" ? "hidden" : "live") as KenanganPhotoStatus,
      originalPath: data.originalPath as string,
      enhancedPath: data.enhancedPath as string | undefined,
      enhanceState: data.enhanceState as KenanganEnhanceState | undefined,
      createdAtMs: (data.createdAt as Timestamp | undefined)?.toMillis() ?? 0,
    };
  });
  return { photos, hasMore: snap.docs.length === KENANGAN_HOST_PAGE_SIZE };
}

export type KenanganEventWithId = KenanganEvent & { id: string };

export function isKenanganEnabled(): boolean {
  return process.env.KENANGAN_ENABLED === "true";
}

export function getKenanganEventTag(slug: string): string {
  return `kenangan-event:${slug}`;
}

async function fetchKenanganEventBySlug(slug: string): Promise<KenanganEventWithId | null> {
  const snap = await getAdminDb()
    .collection("kenanganEvents")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as KenanganEvent) };
}

const getKenanganEventBySlugMemoized = cache(async (
  slug: string,
): Promise<KenanganEventWithId | null> => {
  const cached = unstable_cache(
    () => fetchKenanganEventBySlug(slug),
    ["getKenanganEventBySlug", slug],
    {
      revalidate: KENANGAN_EVENT_REVALIDATE_SECONDS,
      tags: [getKenanganEventTag(slug)],
    },
  );
  return cached();
});

export async function getKenanganEventBySlug(
  slug: string,
): Promise<KenanganEventWithId | null> {
  return getKenanganEventBySlugMemoized(slug);
}

/** Uncached read for API routes that must see fresh status. */
export async function getKenanganEventById(
  eventId: string,
): Promise<KenanganEventWithId | null> {
  const snap = await getAdminDb().collection("kenanganEvents").doc(eventId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as KenanganEvent) };
}

export interface KenanganGalleryPhoto {
  id: string;
  /** ImageKit path to show. When `enhanced`, it's server-graded (render as-is);
   *  otherwise it's the ungraded original — grade it client-side with `lutId`. */
  path: string;
  enhanced: boolean;
  lutId: KenanganLutId;
  width: number;
  height: number;
}

/**
 * Published-gallery photo list (ADR-0007): every non-hidden photo, ordered
 * oldest-first. Enhanced photos carry their pre-graded `enhancedPath`; the rest
 * ship the ungraded original for client-side grading (parity with the feed).
 * Cached under the kenangan-event:{slug} tag so a curation write busts it.
 */
export async function getKenanganGalleryPhotos(slug: string): Promise<KenanganGalleryPhoto[]> {
  const cached = unstable_cache(
    async (): Promise<KenanganGalleryPhoto[]> => {
      const event = await fetchKenanganEventBySlug(slug);
      if (!event || !isKenanganPublished(event.status)) return [];
      // No composite index needed: order only, filter status in code.
      const snap = await getAdminDb()
        .collection("kenanganEvents")
        .doc(event.id)
        .collection("photos")
        .orderBy("createdAt", "asc")
        .get();
      return snap.docs
        .filter((doc) => doc.data().status !== "hidden")
        .map((doc) => {
          const data = doc.data();
          const enhancedPath = data.enhancedPath as string | undefined;
          return {
            id: doc.id,
            path: enhancedPath ?? (data.originalPath as string),
            enhanced: Boolean(enhancedPath),
            lutId: (isKenanganLutId(data.lutId) ? data.lutId : "natural") as KenanganLutId,
            width: (data.width as number) ?? 0,
            height: (data.height as number) ?? 0,
          };
        });
    },
    ["getKenanganGalleryPhotos", slug],
    { revalidate: 60 * 60, tags: [getKenanganEventTag(slug)] },
  );
  return cached();
}

/** Paket order status for an event, for gating/messaging. "pending" = created,
 *  awaiting admin confirmation; "confirmed" = paid; null = no paket order (legacy).
 *  Uncached direct read — the draft/pending state is transient. */
export async function getKenanganPaketStatus(
  eventId: string,
): Promise<KenanganOrderStatus | null> {
  const snap = await getAdminDb()
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .get();
  const paket = snap.docs
    .map((doc) => doc.data() as KenanganOrder)
    .find((o) => kenanganOrderKind(o) === "paket");
  return paket ? paket.status : null;
}

export async function revalidateKenanganEvent(slug: string): Promise<void> {
  await Promise.all([
    revalidateTag(getKenanganEventTag(slug), "max"),
    revalidatePath(`/kenangan/e/${slug}`),
    revalidatePath(`/kenangan/e/${slug}/gallery`),
  ]);
}
