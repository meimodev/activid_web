import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import type { KenanganEvent } from "@/types/kenangan";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

const KENANGAN_EVENT_REVALIDATE_SECONDS = 60 * 5;

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
  /** ImageKit path to show: enhanced when available, else original */
  path: string;
  width: number;
  height: number;
}

/**
 * Published-gallery photo list, cached under the same kenangan-event:{slug}
 * tag so publish/moderation revalidation busts both event and photos.
 */
export async function getKenanganGalleryPhotos(slug: string): Promise<KenanganGalleryPhoto[]> {
  const cached = unstable_cache(
    async (): Promise<KenanganGalleryPhoto[]> => {
      const event = await fetchKenanganEventBySlug(slug);
      if (!event || event.status !== "published") return [];
      // No composite index needed: order only, filter status in code.
      const snap = await getAdminDb()
        .collection("kenanganEvents")
        .doc(event.id)
        .collection("photos")
        .orderBy("createdAt", "asc")
        .get();
      // Originals are stored ungraded; only photos whose LUT-graded (and
      // possibly AI-enhanced) file exists are shown. "failed" = enhancement
      // failed, enhancedPath holds the LUT-graded original (fail-safe path).
      return snap.docs
        .filter(
          (doc) =>
            ["keeper", "enhanced", "failed"].includes(doc.data().status) &&
            Boolean(doc.data().enhancedPath),
        )
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            path: data.enhancedPath as string,
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

export async function revalidateKenanganEvent(slug: string): Promise<void> {
  await Promise.all([
    revalidateTag(getKenanganEventTag(slug), "max"),
    revalidatePath(`/kenangan/e/${slug}`),
    revalidatePath(`/kenangan/e/${slug}/gallery`),
  ]);
}
