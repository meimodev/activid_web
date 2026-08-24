import "server-only";

import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase-admin";

export type RedirectLink = {
  code: string;
  businessName: string;
  destinationUrl: string;
  /** Free text shown above the business name. Empty means "use the default copy". */
  thankYouNote: string;
  active: boolean;
  /** Epoch ms, so the record crosses the server/client boundary as-is. */
  createdAt: number;
};

const COLLECTION = "redirectLinks";
const REVALIDATE_SECONDS = 60 * 30;
const CODE_LENGTH = 8;

// A Redirect Link is an open redirector by design: the destination is whatever
// an authenticated staff member typed. The scheme allowlist is the boundary
// that actually matters — it keeps `javascript:` and friends out of the
// <a href> and the location.replace() on the redirect page.
const ALLOWED_SCHEMES = new Set(["https:", "http:", "mailto:", "tel:", "whatsapp:"]);

function tag(code: string): string {
  return `redirect-link:${code}`;
}

/** Opaque, unguessable, short enough to print under a QR. */
export function generateRedirectCode(): string {
  return randomUUID().replace(/-/g, "").slice(0, CODE_LENGTH);
}

export function isRedirectCode(value: string): boolean {
  return new RegExp(`^[0-9a-f]{${CODE_LENGTH}}$`).test(value);
}

/**
 * Trims, adds a default scheme for bare domains, and rejects anything outside
 * the allowlist. Returns null when the input can't be trusted as a destination.
 */
export function normalizeDestinationUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }

  if (!ALLOWED_SCHEMES.has(parsed.protocol)) return null;
  return parsed.toString();
}

function toRedirectLink(code: string, data: FirebaseFirestore.DocumentData): RedirectLink {
  return {
    code,
    businessName: String(data.businessName ?? ""),
    destinationUrl: String(data.destinationUrl ?? ""),
    thankYouNote: String(data.thankYouNote ?? ""),
    active: data.active !== false,
    createdAt: Number(data.createdAt ?? 0),
  };
}

/** Cached read for the public redirect page — every scan hits this. */
export async function getRedirectLink(code: string): Promise<RedirectLink | null> {
  if (!isRedirectCode(code)) return null;

  const cached = unstable_cache(
    async (): Promise<RedirectLink | null> => {
      const snap = await getAdminDb().collection(COLLECTION).doc(code).get();
      if (!snap.exists) return null;
      return toRedirectLink(code, snap.data() ?? {});
    },
    ["getRedirectLink", code],
    { revalidate: REVALIDATE_SECONDS, tags: [tag(code)] },
  );

  return cached();
}

/** Uncached — the Link Console must always show what was just saved. */
export async function listRedirectLinks(): Promise<RedirectLink[]> {
  const snap = await getAdminDb()
    .collection(COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((doc) => toRedirectLink(doc.id, doc.data()));
}

function bust(code: string): void {
  revalidateTag(tag(code), "max");
  revalidatePath(`/link/${code}`);
  revalidatePath("/link/manage");
}

export async function createRedirectLink(input: {
  businessName: string;
  destinationUrl: string;
  thankYouNote: string;
}): Promise<RedirectLink> {
  const db = getAdminDb();

  // ponytail: retry-on-collision instead of a reservation scheme. At 8 hex
  // chars a clash needs ~65k links before it's even worth thinking about.
  let code = generateRedirectCode();
  for (let i = 0; i < 5; i += 1) {
    const existing = await db.collection(COLLECTION).doc(code).get();
    if (!existing.exists) break;
    code = generateRedirectCode();
  }

  const link: RedirectLink = {
    code,
    businessName: input.businessName,
    destinationUrl: input.destinationUrl,
    thankYouNote: input.thankYouNote,
    active: true,
    createdAt: Date.now(),
  };

  await db.collection(COLLECTION).doc(code).set({
    businessName: link.businessName,
    destinationUrl: link.destinationUrl,
    thankYouNote: link.thankYouNote,
    active: link.active,
    createdAt: link.createdAt,
  });
  bust(code);
  return link;
}

export async function updateRedirectLink(
  code: string,
  patch: Partial<Omit<RedirectLink, "code" | "createdAt">>,
): Promise<void> {
  if (!isRedirectCode(code)) return;
  await getAdminDb().collection(COLLECTION).doc(code).update(patch);
  bust(code);
}

export async function deleteRedirectLink(code: string): Promise<void> {
  if (!isRedirectCode(code)) return;
  await getAdminDb().collection(COLLECTION).doc(code).delete();
  bust(code);
}
