import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import { InvitationConfig } from "@/types/invitation";
import { unstable_cache } from "next/cache";

export class InvitationConfigQuotaExceededError extends Error {
  readonly name = "InvitationConfigQuotaExceededError";
}

type LastGoodEntry = {
  value: InvitationConfig;
  storedAtMs: number;
};

const lastGoodBySlug = new Map<string, LastGoodEntry>();
const LAST_GOOD_TTL_MS = 60 * 60 * 1000;

function isQuotaExceededError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;

  const anyErr = err as { code?: unknown; message?: unknown };
  const code = anyErr.code;
  const msg = typeof anyErr.message === "string" ? anyErr.message : "";

  return code === 8 || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("Quota exceeded");
}

async function getInvitationConfigCached(slug: string): Promise<InvitationConfig | null> {
  const cached = unstable_cache(
    async (): Promise<InvitationConfig | null> => {
      const snap = await getAdminDb().collection("invitations").doc(slug).get();
      if (!snap.exists) return null;
      return snap.data() as InvitationConfig;
    },
    ["getInvitationConfig", slug],
    { revalidate: 60 },
  );

  return cached();
}

export async function getInvitationConfig(
  slug: string,
): Promise<InvitationConfig | null> {
  try {
    const config = await getInvitationConfigCached(slug);
    if (config) {
      lastGoodBySlug.set(slug, { value: config, storedAtMs: Date.now() });
    }
    return config;
  } catch (err) {
    if (isQuotaExceededError(err)) {
      const entry = lastGoodBySlug.get(slug);
      if (entry && Date.now() - entry.storedAtMs <= LAST_GOOD_TTL_MS) {
        return entry.value;
      }
      throw new InvitationConfigQuotaExceededError(
        "Firestore quota exceeded while fetching invitation config.",
      );
    }

    throw err;
  }
}
