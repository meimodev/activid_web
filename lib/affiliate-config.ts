import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";

export type InvitationAffiliateConfig = {
  id: string;
  whatsappNumber: string;
  enabled: boolean;
  name?: string;
  joinedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export class InvitationAffiliateQuotaExceededError extends Error {
  readonly name = "InvitationAffiliateQuotaExceededError";
}

type LastGoodEntry = {
  value: InvitationAffiliateConfig;
  storedAtMs: number;
};

const lastGoodById = new Map<string, LastGoodEntry>();
const LAST_GOOD_TTL_MS = 60 * 60 * 1000;

function isQuotaExceededError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;

  const anyErr = err as { code?: unknown; message?: unknown };
  const code = anyErr.code;
  const msg = typeof anyErr.message === "string" ? anyErr.message : "";

  return code === 8 || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("Quota exceeded");
}

async function getInvitationAffiliateCached(
  id: string,
): Promise<InvitationAffiliateConfig | null> {
  const cached = unstable_cache(
    async (): Promise<InvitationAffiliateConfig | null> => {
      const snap = await getAdminDb().collection("invitationAffiliates").doc(id).get();
      if (!snap.exists) return null;
      return { id: snap.id, ...(snap.data() as Omit<InvitationAffiliateConfig, "id">) };
    },
    ["getInvitationAffiliate", id],
    { revalidate: 300 },
  );

  return cached();
}

export async function getInvitationAffiliate(
  id: string,
): Promise<InvitationAffiliateConfig | null> {
  try {
    const config = await getInvitationAffiliateCached(id);
    if (config) {
      lastGoodById.set(id, { value: config, storedAtMs: Date.now() });
    }
    return config;
  } catch (err) {
    if (isQuotaExceededError(err)) {
      const entry = lastGoodById.get(id);
      if (entry && Date.now() - entry.storedAtMs <= LAST_GOOD_TTL_MS) {
        return entry.value;
      }
      throw new InvitationAffiliateQuotaExceededError(
        "Firestore quota exceeded while fetching invitation affiliate.",
      );
    }

    throw err;
  }
}

export function isAffiliateId(value: string): boolean {
  return /^[A-Z0-9]{12}$/.test(value);
}

export function normalizeWhatsappNumber(value: string): string {
  const raw = (value ?? "").trim();
  const noPlus = raw.startsWith("+") ? raw.slice(1) : raw;
  return noPlus.replace(/\D/g, "");
}

export function normalizeWhatsappNumberE164(value: string): string {
  let digits = normalizeWhatsappNumber(value);
  if (!digits) return "";

  if (digits.startsWith("0")) {
    return "";
  }

  if (digits.startsWith("62")) {
    const local = digits.slice(2);
    if (!local || local.startsWith("0")) return "";
  } else if (digits.startsWith("8")) {
    digits = `62${digits}`;
  }

  return `+${digits}`;
}
