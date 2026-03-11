import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import { InvitationConfig, MetadataConfig } from "@/types/invitation";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

export class InvitationConfigQuotaExceededError extends Error {
  readonly name = "InvitationConfigQuotaExceededError";
}

type LastGoodEntry = {
  value: InvitationConfig;
  storedAtMs: number;
};

const lastGoodBySlug = new Map<string, LastGoodEntry>();
const LAST_GOOD_TTL_MS = 60 * 60 * 1000;
const INVITATION_CONFIG_REVALIDATE_SECONDS = 60 * 30;
const INVITATION_SITE_ORIGIN = "https://activid.web.id";
const INVITATION_METADATA_DESCRIPTION = "design premium - pernikahan - HUT - acara - syukuran.";

function getInvitationConfigTag(slug: string): string {
  return `invitation-config:${slug}`;
}

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
    {
      revalidate: INVITATION_CONFIG_REVALIDATE_SECONDS,
      tags: [getInvitationConfigTag(slug)],
    },
  );

  return cached();
}

const getInvitationConfigMemoized = cache(async (
  slug: string,
): Promise<InvitationConfig | null> => {
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
});

export async function getInvitationConfig(
  slug: string,
): Promise<InvitationConfig | null> {
  return getInvitationConfigMemoized(slug);
}

function getPurposeLabel(purpose: InvitationConfig["purpose"]): string {
  switch (purpose) {
    case "marriage":
      return "pernikahan";
    case "birthday":
      return "HUT";
    case "event":
      return "acara";
    default:
      return purpose;
  }
}

function getHostFirstNames(config: InvitationConfig): string[] {
  const hosts = Array.isArray(config.sections?.hosts?.hosts) ? config.sections.hosts.hosts : [];

  return Array.from(
    new Set(
      hosts
        .map((host) => {
          const firstName = typeof host?.firstName === "string" ? host.firstName.trim() : "";
          if (firstName) return firstName;
          return typeof host?.fullName === "string" ? host.fullName.trim() : "";
        })
        .filter(Boolean),
    ),
  );
}

export function getInvitationMetadataImage(config: InvitationConfig): string {
  const coverImage = typeof config.sections?.hero?.coverImage === "string"
    ? config.sections.hero.coverImage.trim()
    : "";

  if (coverImage) return coverImage;

  const openGraphImage = config.metadata?.openGraph?.images?.[0]?.url;
  if (typeof openGraphImage === "string" && openGraphImage.trim()) {
    return openGraphImage.trim();
  }

  const twitterImage = config.metadata?.twitter?.images?.[0];
  if (typeof twitterImage === "string" && twitterImage.trim()) {
    return twitterImage.trim();
  }

  return "";
}

export function getInvitationMetadataText(config: InvitationConfig, slug: string): {
  title: string;
  description: string;
} {
  const purposeLabel = getPurposeLabel(config.purpose);
  const hostNames = getHostFirstNames(config);
  const hostSegment = hostNames.join(" & ");
  const title = hostSegment
    ? `${purposeLabel}-${hostSegment} | undangan digital activid`
    : `${purposeLabel}-${slug} | undangan digital activid`;

  return {
    title,
    description: INVITATION_METADATA_DESCRIPTION,
  };
}

export function buildInvitationStoredMetadata(
  slug: string,
  config: InvitationConfig,
): MetadataConfig {
  const canonicalUrl = `${INVITATION_SITE_ORIGIN}/invitation/${slug}`;
  const { title, description } = getInvitationMetadataText(config, slug);
  const coverImage = getInvitationMetadataImage(config);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Activid Web Invitation",
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export async function revalidateInvitationConfig(slug: string): Promise<void> {
  await Promise.all([
    revalidateTag(getInvitationConfigTag(slug)),
    revalidatePath(`/invitation/${slug}`),
  ]);
}
