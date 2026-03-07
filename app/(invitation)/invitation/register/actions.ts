"use server";

import { getInvitationAffiliate, isAffiliateId } from "@/lib/affiliate-config";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  toInvitationIso,
} from "@/lib/date-time";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import {
  createInvitationRegisterSessionCookieValue,
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import {
  EventDetail,
  Host,
  InvitationConfig,
  MetadataConfig,
} from "@/types/invitation";
import { cookies } from "next/headers";
import { FieldValue } from "firebase-admin/firestore";

export type RegisterInvitationState = {
  ok?: boolean;
  slug?: string;
  invitationUrl?: string;
  affiliateId?: string;
  affiliateName?: string;
  error?: string;
};

import { hashPassword } from "../affiliate/actions";
import { timingSafeEqual } from "crypto";

const AFFILIATE_COOKIE_NAME = "inv_affiliate";
const AFFILIATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getAffiliateCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AFFILIATE_COOKIE_MAX_AGE_SECONDS,
  };
}

function getAffiliateCookieClearOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

function getAffiliateSessionCookieClearOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export type VerifyRegisterPasswordState = {
  ok?: boolean;
  error?: string;
};

const SUPPORTED_TEMPLATE_IDS = new Set([
  "flow",
  "saturn",
  "mercury",
  "pluto",
  "amalthea",
  "venus",
  "jupiter",
  "neptune",
]);

const RESERVED_TEMPLATE_SLUGS = new Set([
  "flow",
  "saturn",
  "mercury",
  "pluto",
  "amalthea",
  "venus",
  "jupiter",
  "neptune",
]);

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value;
}

function getExpectedPassword(): string | null {
  return process.env.INVITATION_ADMIN_PASSWORD ?? null;
}

const SITE_ORIGIN = "https://invitation.activid.id";

function validateHttpUrl(rawValue: string): string | null {
  const raw = (rawValue ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "URL audio tidak valid. Gunakan URL lengkap yang diawali http:// atau https://.";
    }
  } catch {
    return "URL audio tidak valid. Gunakan URL lengkap yang diawali http:// atau https://.";
  }
  return null;
}

function generateMetadata({
  slug,
  purpose,
  config,
}: {
  slug: string;
  purpose: "marriage" | "birthday" | "event";
  config: InvitationConfig;
}): MetadataConfig {
  const hosts = config.sections.hosts.hosts;

  const primaryName =
    hosts[0]?.firstName || hosts[0]?.fullName || slug;
  const secondaryName =
    hosts[1]?.firstName || hosts[1]?.fullName || "";

  const namePart =
    purpose === "marriage" && secondaryName
      ? `${primaryName} & ${secondaryName}`
      : primaryName;

  let title = "Invitation";
  let description = "";
  if (purpose === "marriage") {
    title = `The Wedding of ${namePart}`;
    description = `You are invited to the wedding of ${namePart}.`;
  } else if (purpose === "birthday") {
    title = `Birthday Invitation - ${namePart}`;
    description = `You are invited to celebrate the birthday of ${namePart}.`;
  } else {
    title = `Event Invitation - ${namePart}`;
    description = "You are invited to our event.";
  }

  const canonicalUrl = `${SITE_ORIGIN}/${slug}`;

  const baseOg = config.metadata?.openGraph ?? {
    title,
    description,
    url: canonicalUrl,
    siteName: "Activid Web Invitation",
    images: [],
    locale: "id_ID",
    type: "website",
  };

  const coverImage =
    config.sections?.hero?.coverImage ||
    baseOg.images?.[0]?.url ||
    config.metadata?.twitter?.images?.[0] ||
    "";

  const openGraphImages = coverImage
    ? [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
    : baseOg.images ?? [];

  const openGraph = {
    ...baseOg,
    title,
    description,
    url: canonicalUrl,
    siteName: baseOg.siteName || "Activid Web Invitation",
    locale: baseOg.locale || "id_ID",
    type: baseOg.type || "website",
    images: openGraphImages,
  };

  const baseTwitter = config.metadata?.twitter ?? {
    card: "summary_large_image",
    title,
    description,
    images: [],
  };

  const twitterImages = coverImage ? [coverImage] : baseTwitter.images ?? [];

  const twitter = {
    ...baseTwitter,
    card: baseTwitter.card || "summary_large_image",
    title,
    description,
    images: twitterImages,
  };

  return {
    title,
    description,
    openGraph,
    twitter,
  };
}

function readPurpose(formData: FormData): "marriage" | "birthday" | "event" {
  const purpose = readString(formData, "purpose").trim();
  if (purpose === "birthday" || purpose === "event" || purpose === "marriage") return purpose;
  return "marriage";
}

function normalizeSlugSegment(value: string): string {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function deriveBaseSlug(purpose: "marriage" | "birthday" | "event", hosts: Host[]): string {
  const hostParts = (hosts ?? [])
    .map((h) => normalizeSlugSegment(h.firstName ?? ""))
    .filter(Boolean);

  const hostSegment = hostParts.length ? hostParts.join("-") : "untitled";
  return `${purpose}-${hostSegment}`;
}

function deriveImagekitFolderKey(purpose: "marriage" | "birthday" | "event", hosts: Host[]): string {
  const firstHostName = normalizeSlugSegment(hosts?.[0]?.firstName ?? "");
  const hostSegment = firstHostName || "untitled";
  const unixEpochSeconds = Math.floor(Date.now() / 1000);
  return `${purpose}-${hostSegment}-${unixEpochSeconds}`;
}

function isAlreadyExistsError(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  return code === 6 || code === "already-exists";
}

function normalizeEventList(raw: InvitationConfig["sections"]["event"]["events"]): EventDetail[] {
  return raw.filter((e) => Boolean(e));
}

function normalizePhotoList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw)).filter((v): v is string => typeof v === "string" && Boolean(v));
}

export async function verifyInvitationRegisterPassword(
  _prevState: VerifyRegisterPasswordState,
  formData: FormData,
): Promise<VerifyRegisterPasswordState> {
  const expectedPassword = getExpectedPassword();
  if (!expectedPassword) {
    return { error: "Server is missing INVITATION_ADMIN_PASSWORD." };
  }

  const password = readString(formData, "password");
  const affiliateIdInput = readString(formData, "affiliateId").trim().toUpperCase();

  // If the admin password matches, grant global session right away
  if (password === expectedPassword) {
    return grantGlobalSession();
  }

  // If they provided an affiliate ID, verify it as an affiliate login
  if (affiliateIdInput && isAffiliateId(affiliateIdInput)) {
    const snap = await getAdminDb().collection("invitationAffiliates").doc(affiliateIdInput).get();
    if (!snap.exists) {
      return { error: "Invalid password or affiliate credentials." };
    }

    const data = snap.data() as {
      enabled?: unknown;
      passwordSalt?: unknown;
      passwordHash?: unknown;
    };

    if (!data || data.enabled === false) {
      return { error: "Affiliate account is pending verification." };
    }

    const salt = typeof data.passwordSalt === "string" ? data.passwordSalt : "";
    const expectedHash = typeof data.passwordHash === "string" ? data.passwordHash : "";
    if (!salt || !expectedHash) {
      return { error: "Invalid password or affiliate credentials." };
    }

    const actualHash = await hashPassword(password, salt);
    try {
      const ok = timingSafeEqual(
        Buffer.from(actualHash, "hex"),
        Buffer.from(expectedHash, "hex"),
      );
      if (ok) {
        // Affiliate authenticated. We set the affiliate session cookie
        // so that the register form recognizes them as logged in.
        const { createInvitationAffiliateSessionCookieValue, getInvitationAffiliateSessionCookieName, getSessionCookieOptions } = await import("@/lib/invitation-affiliate-session");
        
        const cookieName = getInvitationAffiliateSessionCookieName();
        let cookieValue: string;
        try {
          cookieValue = createInvitationAffiliateSessionCookieValue(affiliateIdInput);
        } catch (err) {
          return { error: err instanceof Error ? err.message : "Failed to create session." };
        }
        
        const cookieStore = await cookies();
        cookieStore.set(cookieName, cookieValue, getSessionCookieOptions());
        cookieStore.set(
          AFFILIATE_COOKIE_NAME,
          affiliateIdInput,
          getAffiliateCookieOptions(),
        );
        return { ok: true };
      }
    } catch {
      // ignore
    }
  }

  return { error: "Invalid password or affiliate credentials." };
}

async function grantGlobalSession(): Promise<VerifyRegisterPasswordState> {
  const cookieName = getInvitationRegisterSessionCookieName();
  let cookieValue: string;
  try {
    cookieValue = createInvitationRegisterSessionCookieValue();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create session." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AFFILIATE_COOKIE_NAME, "", getAffiliateCookieClearOptions());
  cookieStore.set(
    getInvitationAffiliateSessionCookieName(),
    "",
    getAffiliateSessionCookieClearOptions(),
  );
  cookieStore.set(cookieName, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return { ok: true };
}

export async function registerInvitation(
  _prevState: RegisterInvitationState,
  formData: FormData,
): Promise<RegisterInvitationState> {
  const expectedPassword = getExpectedPassword();
  if (!expectedPassword) {
    return { error: "Server is missing INVITATION_ADMIN_PASSWORD." };
  }

  const cookieStore = await cookies();
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = cookieStore.get(cookieName)?.value;
  const hasValidSession = isInvitationRegisterSessionValid(sessionCookie);

  const password = readString(formData, "password");
  const isAdminPassword = password === expectedPassword;
  const isAdminAuth = hasValidSession || isAdminPassword;

  if (isAdminPassword) {
    cookieStore.set(AFFILIATE_COOKIE_NAME, "", getAffiliateCookieClearOptions());
    cookieStore.set(
      getInvitationAffiliateSessionCookieName(),
      "",
      getAffiliateSessionCookieClearOptions(),
    );
  }

  const affiliateSessionCookieName = getInvitationAffiliateSessionCookieName();
  const affiliateSessionCookie = cookieStore.get(affiliateSessionCookieName)?.value;

  const affiliateCookieRaw = isAdminAuth
    ? ""
    : (cookieStore.get(AFFILIATE_COOKIE_NAME)?.value ?? "");
  const affiliateCookie = affiliateCookieRaw.trim().toUpperCase();
  const affiliateCookieId = affiliateCookie && isAffiliateId(affiliateCookie) ? affiliateCookie : "";
  const hasAffiliateCookie = Boolean(affiliateCookieId);
  const hasValidAffiliateSession = affiliateCookieId
    ? isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateCookieId)
    : false;
  const hasValidAuth = hasValidSession || hasValidAffiliateSession;
  const affiliateAcknowledged = readString(formData, "affiliateAcknowledged").trim();
  if (!isAdminAuth && !hasAffiliateCookie && affiliateAcknowledged !== "1") {
    return {
      error:
        "Cookie afiliasi tidak terdeteksi. Silakan akui dan lanjutkan pada halaman register sebelum membuat undangan ini.",
    };
  }

  let affiliateId: string | null = null;
  let affiliateName: string | undefined;
  if (!isAdminAuth && affiliateCookieId) {
    try {
      const affiliate = await getInvitationAffiliate(affiliateCookieId);
      if (affiliate && affiliate.enabled !== false) {
        affiliateId = affiliateCookieId;
        affiliateName = typeof affiliate.name === "string" ? affiliate.name.trim() : undefined;
      }
    } catch {}
  }

  if (!hasValidAuth && password !== expectedPassword) {
    return { error: "Invalid password." };
  }

  const templateId = readString(formData, "templateId").trim();
  if (!templateId) {
    return { error: "Template is required." };
  }

  if (!SUPPORTED_TEMPLATE_IDS.has(templateId)) {
    return { error: "Unsupported template." };
  }

  const configJson = readString(formData, "configJson");
  if (!configJson) {
    return { error: "Missing config payload." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(configJson);
  } catch {
    return { error: "Config payload is not valid JSON." };
  }

  if (!parsed || typeof parsed !== "object") {
    return { error: "Config payload must be an object." };
  }

  const config = parsed as InvitationConfig;

  if (!config.music || !config.sections) {
    return { error: "Config payload is missing required fields." };
  }

  const musicTitle = (config.music.title ?? "").trim();
  if (!musicTitle) {
    return { error: "Judul musik wajib diisi." };
  }

  const musicUrl = (config.music.url ?? "").trim();
  if (!musicUrl) {
    return { error: "URL audio wajib diisi." };
  }

  const musicUrlError = validateHttpUrl(musicUrl);
  if (musicUrlError) {
    return { error: musicUrlError };
  }

  const heroEnabled = Boolean(config.sections?.hero?.enabled);
  const coverImage = (config.sections?.hero?.coverImage ?? "").trim();
  if (heroEnabled && !coverImage) {
    return { error: "Gambar cover wajib diisi." };
  }

  if (
    !config.sections.gratitude ||
    typeof config.sections.gratitude.enabled !== "boolean" ||
    typeof config.sections.gratitude.message !== "string"
  ) {
    return { error: "Gratitude section config is required." };
  }

  if (!config.sections.hosts) {
    return { error: "Hosts section config is required." };
  }

  if (!Array.isArray(config.sections.hosts.hosts) || config.sections.hosts.hosts.length < 1) {
    return { error: "At least 1 host is required." };
  }

  for (let i = 0; i < config.sections.hosts.hosts.length; i++) {
    const photo = (config.sections.hosts.hosts[i]?.photo ?? "").trim();
    if (!photo) {
      return { error: `Foto host ${i + 1} wajib diisi.` };
    }
  }

  if (!config.sections.event || !config.sections.event.events) {
    return { error: "Event section is required." };
  }

  const events = normalizeEventList(config.sections.event.events);
  if (events.length < 1) {
    return { error: "At least 1 event is required." };
  }

  const normalizedEvents = events.map((event) => {
    const iso = toInvitationIso(event.date);
    if (!iso) return null;
    return { ...event, date: iso };
  });

  if (normalizedEvents.some((e) => !e)) {
    return { error: "All event dates are required." };
  }

  const normalizedStories = (config.sections?.story?.stories ?? []).map((story) => {
    const iso = toInvitationIso(story?.date);
    return { ...story, date: iso ?? story?.date };
  });

  const purpose = readPurpose(formData);

  const baseSlug = deriveBaseSlug(purpose, config.sections.hosts.hosts);
  if (!baseSlug) {
    return { error: "Failed to derive slug." };
  }

  const imagekitFolderKey = config.imagekitFolderKey || deriveImagekitFolderKey(purpose, config.sections.hosts.hosts);

  const derivedPhotos = normalizePhotoList(config.sections?.gallery?.photos);

  const db = getAdminDb();
  const collection = db.collection("invitations");

  const startIndex = baseSlug.endsWith("-demo") ? 1 : 0;

  let finalSlug = "";
  for (let i = startIndex; i < 300; i++) {
    const candidateSlug = i === 0 ? baseSlug : `${baseSlug}-${i}`;
    if (candidateSlug.endsWith("-demo")) continue;

    const toSave: InvitationConfig = {
      id: candidateSlug,
      imagekitFolderKey,
      affiliateId: affiliateId ?? undefined,
      templateId,
      purpose,
      theme: config.theme,
      metadata: generateMetadata({
        slug: candidateSlug,
        purpose,
        config,
      }),
      music: {
        title: config.music.title,
        url: config.music.url,
        dropboxPath: config.music.dropboxPath,
      },
      sections: {
        ...config.sections,
        countdown: {
          ...config.sections.countdown,
          photos: derivedPhotos,
        },
        hosts: {
          ...config.sections.hosts,
          hosts: config.sections.hosts.hosts,
        },
        event: {
          ...config.sections.event,
          events: normalizedEvents as [EventDetail, ...EventDetail[]],
        },
        story: {
          ...config.sections.story,
          stories: normalizedStories,
        },
      },
    };

    try {
      await collection.doc(candidateSlug).create(toSave);
      finalSlug = candidateSlug;
      break;
    } catch (err) {
      if (isAlreadyExistsError(err)) continue;
      return { error: err instanceof Error ? err.message : "Failed to create invitation." };
    }
  }

  if (!finalSlug) {
    return { error: "Failed to allocate a unique mission code. Please try again." };
  }

  if (affiliateId) {
    try {
      await db
        .collection("invitationAffiliates")
        .doc(affiliateId)
        .set(
          {
            generatedInvitationCount: FieldValue.increment(1),
            lastGeneratedInvitationAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

      await db
        .collection("invitationAffiliates")
        .doc(affiliateId)
        .collection("generatedInvitations")
        .doc(finalSlug)
        .set({
          createdAt: FieldValue.serverTimestamp(),
          templateId,
          invitationId: finalSlug,
        });
    } catch {}
  }

  const invitationUrl = `${SITE_ORIGIN}/${finalSlug}`;
  return {
    ok: true,
    slug: finalSlug,
    invitationUrl,
    affiliateId: affiliateId ?? undefined,
    affiliateName,
  };
}

export async function updateInvitation(
  _prevState: RegisterInvitationState,
  formData: FormData,
): Promise<RegisterInvitationState> {
  const expectedPassword = getExpectedPassword();
  if (!expectedPassword) {
    return { error: "Server is missing INVITATION_ADMIN_PASSWORD." };
  }

  const cookieStore = await cookies();
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = cookieStore.get(cookieName)?.value;
  const hasValidSession = isInvitationRegisterSessionValid(sessionCookie);

  const affiliateSessionCookieName = getInvitationAffiliateSessionCookieName();
  const affiliateSessionCookie = cookieStore.get(affiliateSessionCookieName)?.value;

  const affiliateCookieRaw = cookieStore.get(AFFILIATE_COOKIE_NAME)?.value ?? "";
  const affiliateCookie = affiliateCookieRaw.trim().toUpperCase();
  const affiliateCookieId = affiliateCookie && isAffiliateId(affiliateCookie) ? affiliateCookie : "";
  const hasValidAffiliateSession = affiliateCookieId
    ? isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateCookieId)
    : false;
  const password = readString(formData, "password");
  const isAdminPassword = password === expectedPassword;
  const isAdminAuth = hasValidSession || isAdminPassword;
  const hasValidAuth = isAdminAuth || hasValidAffiliateSession;
  const isAffiliateAuth = !isAdminAuth && hasValidAffiliateSession;

  if (!hasValidAuth && password !== expectedPassword) {
    return { error: "Invalid password." };
  }

  const existingSlug = readString(formData, "existingSlug").trim() || readString(formData, "slug").trim();
  if (!existingSlug) {
    return { error: "Mission code is required." };
  }

  if (existingSlug.endsWith("-demo")) {
    return { error: "Demo slugs cannot be edited." };
  }

  if (RESERVED_TEMPLATE_SLUGS.has(existingSlug)) {
    return { error: "This mission code is reserved." };
  }

  const templateId = readString(formData, "templateId").trim();
  if (!templateId) {
    return { error: "Template is required." };
  }

  if (!SUPPORTED_TEMPLATE_IDS.has(templateId)) {
    return { error: "Unsupported template." };
  }

  const configJson = readString(formData, "configJson");
  if (!configJson) {
    return { error: "Missing config payload." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(configJson);
  } catch {
    return { error: "Config payload is not valid JSON." };
  }

  if (!parsed || typeof parsed !== "object") {
    return { error: "Config payload must be an object." };
  }

  const config = parsed as InvitationConfig;

  if (!config.music || !config.sections) {
    return { error: "Config payload is missing required fields." };
  }

  const musicTitle = (config.music.title ?? "").trim();
  if (!musicTitle) {
    return { error: "Judul musik wajib diisi." };
  }

  const musicUrl = (config.music.url ?? "").trim();
  if (!musicUrl) {
    return { error: "URL audio wajib diisi." };
  }

  const musicUrlError = validateHttpUrl(musicUrl);
  if (musicUrlError) {
    return { error: musicUrlError };
  }

  const heroEnabled = Boolean(config.sections?.hero?.enabled);
  const coverImage = (config.sections?.hero?.coverImage ?? "").trim();
  if (heroEnabled && !coverImage) {
    return { error: "Gambar cover wajib diisi." };
  }

  if (
    !config.sections.gratitude ||
    typeof config.sections.gratitude.enabled !== "boolean" ||
    typeof config.sections.gratitude.message !== "string"
  ) {
    return { error: "Gratitude section config is required." };
  }

  if (!config.sections.hosts) {
    return { error: "Hosts section config is required." };
  }

  if (!Array.isArray(config.sections.hosts.hosts) || config.sections.hosts.hosts.length < 1) {
    return { error: "At least 1 host is required." };
  }

  for (let i = 0; i < config.sections.hosts.hosts.length; i++) {
    const photo = (config.sections.hosts.hosts[i]?.photo ?? "").trim();
    if (!photo) {
      return { error: `Foto host ${i + 1} wajib diisi.` };
    }
  }

  if (!config.sections.event || !config.sections.event.events) {
    return { error: "Event section is required." };
  }

  const events = normalizeEventList(config.sections.event.events);
  if (events.length < 1) {
    return { error: "At least 1 event is required." };
  }

  const normalizedEvents = events.map((event) => {
    const iso = toInvitationIso(event.date);
    if (!iso) return null;
    return { ...event, date: iso };
  });

  if (normalizedEvents.some((e) => !e)) {
    return { error: "All event dates are required." };
  }

  const normalizedStories = (config.sections?.story?.stories ?? []).map((story) => {
    const iso = toInvitationIso(story?.date);
    return { ...story, date: iso ?? story?.date };
  });

  const purpose = readPurpose(formData);
  const derivedPhotos = normalizePhotoList(config.sections?.gallery?.photos);

  const db = getAdminDb();
  const docRef = db.collection("invitations").doc(existingSlug);

  let returnAffiliateId: string | undefined;

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      if (!snap.exists) {
        throw new Error("Mission not found.");
      }

      const existingData = snap.data() as Partial<InvitationConfig> | undefined;
      const existingAffiliateId =
        typeof existingData?.affiliateId === "string" && existingData.affiliateId.trim()
          ? existingData.affiliateId
          : undefined;

      if (isAffiliateAuth) {
        if (!existingAffiliateId) {
          throw new Error("Unauthorized.");
        }
        if (existingAffiliateId.trim().toUpperCase() !== affiliateCookieId) {
          throw new Error("Unauthorized.");
        }
      }

      returnAffiliateId = existingAffiliateId;
      const existingFolderKey =
        typeof existingData?.imagekitFolderKey === "string" && existingData.imagekitFolderKey.trim()
          ? existingData.imagekitFolderKey
          : "";

      const imagekitFolderKey =
        config.imagekitFolderKey || existingFolderKey || deriveImagekitFolderKey(purpose, config.sections.hosts.hosts);

      const toSave: InvitationConfig = {
        id: existingSlug,
        imagekitFolderKey,
        affiliateId: existingAffiliateId,
        templateId,
        purpose,
        theme: config.theme,
        metadata: generateMetadata({
          slug: existingSlug,
          purpose,
          config,
        }),
        music: {
          title: config.music.title,
          url: config.music.url,
          dropboxPath: config.music.dropboxPath,
        },
        sections: {
          ...config.sections,
          countdown: {
            ...config.sections.countdown,
            photos: derivedPhotos,
          },
          hosts: {
            ...config.sections.hosts,
            hosts: config.sections.hosts.hosts,
          },
          event: {
            ...config.sections.event,
            events: normalizedEvents as [EventDetail, ...EventDetail[]],
          },
          story: {
            ...config.sections.story,
            stories: normalizedStories,
          },
        },
      };

      tx.set(docRef, toSave);
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update invitation." };
  }

  let affiliateName: string | undefined;
  if (returnAffiliateId && isAffiliateId(returnAffiliateId)) {
    try {
      const affiliate = await getInvitationAffiliate(returnAffiliateId);
      affiliateName = typeof affiliate?.name === "string" ? affiliate.name.trim() : undefined;
    } catch {}
  }

  const invitationUrl = `${SITE_ORIGIN}/${existingSlug}`;
  return {
    ok: true,
    slug: existingSlug,
    invitationUrl,
    affiliateId: returnAffiliateId,
    affiliateName,
  };
}
