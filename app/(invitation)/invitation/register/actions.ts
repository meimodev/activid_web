"use server";

import { getAdminDb } from "@/lib/firebase-admin";
import {
  createInvitationRegisterSessionCookieValue,
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import {
  EventDetail,
  Host,
  InvitationDate,
  InvitationDateTime,
  InvitationConfig,
  MetadataConfig,
} from "@/types/invitation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type RegisterInvitationState = {
  error?: string;
};

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

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value;
}

function getExpectedPassword(): string | null {
  return process.env.INVITATION_REGISTER_PASSWORD ?? null;
}

const SITE_ORIGIN = "https://activid.web.id";

function generateMetadata({
  slug,
  purpose,
  config,
}: {
  slug: string;
  purpose: "marriage" | "birthday" | "event";
  config: InvitationConfig;
}): MetadataConfig {
  const hosts = config.hosts;

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

  const canonicalUrl = `${SITE_ORIGIN}/invitation/${slug}`;

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

function normalizeEventList(
  raw: InvitationConfig["sections"]["event"]["events"],
): EventDetail[] {
  if (Array.isArray(raw)) {
    return raw.filter((e) => Boolean(e));
  }

  if (!raw || typeof raw !== "object") return [];

  const orderedKeys = ["holyMatrimony", "reception"];
  const entries = Object.entries(raw as Record<string, EventDetail>);

  const prioritized = orderedKeys
    .map((key) => [key, (raw as Record<string, EventDetail>)[key]] as const)
    .filter(([, value]) => Boolean(value));

  const rest = entries.filter(([key]) => !orderedKeys.includes(key));
  return [...prioritized, ...rest].map(([, value]) => value).filter(Boolean);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isValidInvitationDate(date: InvitationDate): boolean {
  if (!date || typeof date !== "object") return false;
  if (!Number.isInteger(date.year) || date.year < 1900) return false;
  if (!Number.isInteger(date.month) || date.month < 1 || date.month > 12) return false;
  if (!Number.isInteger(date.day) || date.day < 1 || date.day > 31) return false;
  const dt = new Date(date.year, date.month - 1, date.day);
  return (
    dt.getFullYear() === date.year &&
    dt.getMonth() === date.month - 1 &&
    dt.getDate() === date.day
  );
}

function isValidInvitationDateTime(value: InvitationDateTime): boolean {
  if (!value || typeof value !== "object") return false;
  if (!isValidInvitationDate(value.date)) return false;
  const { hour, minute } = value.time ?? {};
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return false;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return false;
  return true;
}

function toIsoDate(date: InvitationDate): string {
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}

function deriveWeddingDateFromFirstEvent(firstEvent: EventDetail) {
  if (!isValidInvitationDateTime(firstEvent.date)) return null;

  const iso = toIsoDate(firstEvent.date.date);
  const dt = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return null;

  const display = dt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayShort = dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    display,
    displayShort,
    countdownTarget: `${iso}T00:00:00`,
    rsvpDeadline: display,
  };
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
    return { error: "Server is missing INVITATION_REGISTER_PASSWORD." };
  }

  const password = readString(formData, "password");
  if (password !== expectedPassword) {
    return { error: "Invalid password." };
  }

  const cookieName = getInvitationRegisterSessionCookieName();
  let cookieValue: string;
  try {
    cookieValue = createInvitationRegisterSessionCookieValue();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create session." };
  }

  const cookieStore = await cookies();
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
    return { error: "Server is missing INVITATION_REGISTER_PASSWORD." };
  }

  const cookieStore = await cookies();
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = cookieStore.get(cookieName)?.value;
  const hasValidSession = isInvitationRegisterSessionValid(sessionCookie);

  const password = readString(formData, "password");
  if (!hasValidSession && password !== expectedPassword) {
    return { error: "Invalid password." };
  }

  const slug = readString(formData, "slug").trim();
  if (!slug) {
    return { error: "Slug is required." };
  }

  if (slug.endsWith("-demo")) {
    return { error: "Slug must not end with -demo." };
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

  if (!Array.isArray(config.hosts) || config.hosts.length < 1) {
    return { error: "At least 1 host is required." };
  }

  if (!config.sections.hosts) {
    return { error: "Hosts section config is required." };
  }

  if (!config.sections.event || !config.sections.event.events) {
    return { error: "Event section is required." };
  }

  const events = normalizeEventList(config.sections.event.events);
  if (events.length < 1) {
    return { error: "At least 1 event is required." };
  }

  const derivedWeddingDate = deriveWeddingDateFromFirstEvent(events[0]!);
  if (!derivedWeddingDate) {
    return { error: "First event date is required." };
  }

  const purpose = readPurpose(formData);

  const derivedPhotos = normalizePhotoList(config.sections?.gallery?.photos);

  const toSave: InvitationConfig = {
    ...config,
    id: slug,
    templateId,
    purpose,
    metadata: generateMetadata({
      slug,
      purpose,
      config,
    }),
    weddingDate: derivedWeddingDate,
    backgroundPhotos: derivedPhotos,
    sections: {
      ...config.sections,
      countdown: {
        ...config.sections.countdown,
        photos: derivedPhotos,
      },
      event: {
        ...config.sections.event,
        events,
      },
    },
  };

  await getAdminDb().collection("invitations").doc(slug).set(toSave);

  redirect(`/invitation/${slug}`);
}
