import "server-only";

import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_ROOT = "/activid web/invitation-audio";
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024;

type DropboxAccessTokenCache = {
  token: string;
  expiresAtMs: number;
};

let cachedDropboxToken: DropboxAccessTokenCache | null = null;
let dropboxTokenInFlight: Promise<string> | null = null;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function getDropboxErrorMessageFromText(text: string): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      const errorSummary = typeof obj.error_summary === "string" ? obj.error_summary.trim() : "";
      if (errorSummary) return errorSummary;
      const errorDescription =
        typeof obj.error_description === "string" ? obj.error_description.trim() : "";
      if (errorDescription) return errorDescription;
      const error = typeof obj.error === "string" ? obj.error.trim() : "";
      if (error) return error;
    }
  } catch {
    // ignore
  }

  return trimmed;
}

function getFetchFailureCauseMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "";
  const anyErr = err as { cause?: unknown };
  const cause = anyErr.cause;
  if (!cause || typeof cause !== "object") return "";
  const anyCause = cause as { code?: unknown; message?: unknown };
  const code = typeof anyCause.code === "string" ? anyCause.code.trim() : "";
  const message = typeof anyCause.message === "string" ? anyCause.message.trim() : "";
  if (code && message) return `${code}: ${message}`;
  if (message) return message;
  return "";
}

function requireAuthorized(request: NextRequest): NextResponse | null {
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  if (isInvitationRegisterSessionValid(sessionCookie)) {
    return null;
  }

  const affiliateIdRaw = request.cookies.get("inv_affiliate")?.value;
  const affiliateId = (affiliateIdRaw ?? "").trim().toUpperCase();
  const isAffiliateId = /^[A-Z0-9]{12}$/.test(affiliateId);
  if (isAffiliateId) {
    const affiliateSessionCookieName = getInvitationAffiliateSessionCookieName();
    const affiliateSessionCookie = request.cookies.get(affiliateSessionCookieName)?.value;
    if (isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateId)) {
      return null;
    }
  }

  return jsonError("Unauthorized", 401);
}

function hasDropboxRefreshConfig(): boolean {
  return Boolean(
    process.env.DROPBOX_REFRESH_TOKEN
    && process.env.DROPBOX_APP_KEY
    && process.env.DROPBOX_APP_SECRET,
  );
}

function getLegacyDropboxAccessToken(): string | null {
  return process.env.DROPBOX_ACCESS_TOKEN ?? null;
}

async function fetchDropboxAccessTokenFromRefreshToken(): Promise<DropboxAccessTokenCache> {
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;

  if (!refreshToken || !appKey || !appSecret) {
    throw new Error("Server is missing DROPBOX_REFRESH_TOKEN / DROPBOX_APP_KEY / DROPBOX_APP_SECRET.");
  }

  const auth = Buffer.from(`${appKey}:${appSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  let res: Response;
  try {
    res = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch (err) {
    const causeMessage = getFetchFailureCauseMessage(err);
    throw new Error(
      err instanceof Error
        ? `Dropbox token refresh request failed: ${err.message}${causeMessage ? ` (${causeMessage})` : ""}`
        : "Dropbox token refresh request failed.",
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const message = getDropboxErrorMessageFromText(text) || "Failed to refresh Dropbox access token.";
    throw new Error(message);
  }

  const data = (await res.json()) as { access_token?: unknown; expires_in?: unknown };
  const token = typeof data.access_token === "string" ? data.access_token : "";
  const expiresInSeconds = typeof data.expires_in === "number" ? data.expires_in : 0;
  if (!token) {
    throw new Error("Dropbox token refresh response is missing access_token.");
  }

  const expiresAtMs = Date.now() + Math.max(0, expiresInSeconds) * 1000;
  return { token, expiresAtMs };
}

async function getDropboxToken(): Promise<string | null> {
  if (!hasDropboxRefreshConfig()) {
    return getLegacyDropboxAccessToken();
  }

  const now = Date.now();
  if (cachedDropboxToken && cachedDropboxToken.expiresAtMs - now > 60_000) {
    return cachedDropboxToken.token;
  }

  if (!dropboxTokenInFlight) {
    dropboxTokenInFlight = (async () => {
      const refreshed = await fetchDropboxAccessTokenFromRefreshToken();
      cachedDropboxToken = refreshed;
      return refreshed.token;
    })().finally(() => {
      dropboxTokenInFlight = null;
    });
  }

  return dropboxTokenInFlight;
}

function getRootPath(): string {
  const raw = (process.env.DROPBOX_INVITATION_AUDIO_ROOT ?? DEFAULT_ROOT).trim();
  if (!raw) return DEFAULT_ROOT;
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function sanitizeFolderSegment(value: string): string {
  return (value ?? "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\.+/g, "")
    .replace(/\//g, "")
    .slice(0, 80);
}

function sanitizeFilename(value: string): string {
  return (value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 120);
}

async function dropboxApiJson<T>(
  token: string,
  path: string,
  body: unknown,
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string; data?: unknown }> {
  let res: Response;
  try {
    res = await fetch(`https://api.dropboxapi.com/2/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const causeMessage = getFetchFailureCauseMessage(err);
    const message =
      err instanceof Error
        ? `Dropbox request failed: ${err.message}${causeMessage ? ` (${causeMessage})` : ""}`
        : "Dropbox request failed.";
    return { ok: false, status: 502, message };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      message: getDropboxErrorMessageFromText(text) || `Dropbox request failed: ${path}`,
    };
  }

  const data = (await res.json()) as T;
  return { ok: true, data };
}

async function ensureSharedLink(token: string, dropboxPath: string): Promise<string> {
  type CreateSharedLinkResponse = { url?: string };

  const created = await dropboxApiJson<CreateSharedLinkResponse>(
    token,
    "sharing/create_shared_link_with_settings",
    {
      path: dropboxPath,
      settings: { requested_visibility: "public" },
    },
  );

  if (created.ok) {
    if (!created.data.url) throw new Error("Dropbox shared link missing URL.");
    return created.data.url;
  }

  if (created.status !== 409) {
    throw new Error(created.message);
  }

  type ListSharedLinksResponse = { links?: Array<{ url?: string }> };
  const listed = await dropboxApiJson<ListSharedLinksResponse>(
    token,
    "sharing/list_shared_links",
    {
      path: dropboxPath,
      direct_only: true,
    },
  );

  if (!listed.ok) throw new Error(listed.message);
  const url = listed.data.links?.[0]?.url;
  if (!url) throw new Error("Dropbox shared link not found.");
  return url;
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAuthorized(request);
  if (unauthorized) return unauthorized;

  let token: string | null = null;
  try {
    token = await getDropboxToken();
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to authenticate with Dropbox.",
      500,
    );
  }
  if (!token) {
    return jsonError(
      "Server is missing Dropbox credentials. Configure DROPBOX_REFRESH_TOKEN + DROPBOX_APP_KEY + DROPBOX_APP_SECRET (recommended) or DROPBOX_ACCESS_TOKEN (legacy).",
      500,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Invalid form data.", 400);
  }

  const file = form.get("file");
  const folderKeyRaw = form.get("folderKey");

  if (!(file instanceof File)) {
    return jsonError("Missing audio file.", 400);
  }

  if (!file.type || !file.type.startsWith("audio/")) {
    return jsonError("Only audio files are allowed.", 400);
  }

  if (file.size >= MAX_AUDIO_SIZE_BYTES) {
    return jsonError("Audio must be smaller than 10MB.", 400);
  }

  const folderKey = typeof folderKeyRaw === "string" ? sanitizeFolderSegment(folderKeyRaw) : "";
  if (!folderKey) {
    return jsonError("Missing folderKey.", 400);
  }

  const root = getRootPath();
  const safeName = sanitizeFilename(file.name) || "audio";
  const dropboxPath = `${root}/${folderKey}/music-${Date.now()}-${safeName}`;

  const fileBuf = Buffer.from(await file.arrayBuffer());

  let uploadRes: Response;
  try {
    uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": JSON.stringify({
          path: dropboxPath,
          mode: "add",
          autorename: true,
          mute: false,
          strict_conflict: false,
        }),
      },
      body: fileBuf,
    });
  } catch (err) {
    const causeMessage = getFetchFailureCauseMessage(err);
    return jsonError(
      err instanceof Error
        ? `Dropbox upload request failed: ${err.message}${causeMessage ? ` (${causeMessage})` : ""}`
        : "Dropbox upload request failed.",
      502,
    );
  }

  if (!uploadRes.ok) {
    const text = await uploadRes.text().catch(() => "");
    const message = getDropboxErrorMessageFromText(text) || "Failed to upload to Dropbox.";
    return jsonError(message, 500);
  }

  type UploadResponse = { path_lower?: string };
  const uploaded = (await uploadRes.json()) as UploadResponse;
  const storedPath = uploaded.path_lower || dropboxPath;

  try {
    const url = await ensureSharedLink(token, storedPath);
    return NextResponse.json({ url, dropboxPath: storedPath });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : "Failed to generate shared link.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = requireAuthorized(request);
  if (unauthorized) return unauthorized;

  let token: string | null = null;
  try {
    token = await getDropboxToken();
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to authenticate with Dropbox.",
      500,
    );
  }
  if (!token) {
    return jsonError(
      "Server is missing Dropbox credentials. Configure DROPBOX_REFRESH_TOKEN + DROPBOX_APP_KEY + DROPBOX_APP_SECRET (recommended) or DROPBOX_ACCESS_TOKEN (legacy).",
      500,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid JSON.", 400);
  }

  const body: Record<string, unknown> =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {};

  const dropboxPath = typeof body.dropboxPath === "string" ? body.dropboxPath.trim() : "";
  if (!dropboxPath) {
    return jsonError("Missing dropboxPath.", 400);
  }

  const res = await dropboxApiJson<{ metadata?: unknown }>(token, "files/delete_v2", {
    path: dropboxPath,
  });

  if (!res.ok) {
    return jsonError(res.message, res.status >= 400 && res.status < 600 ? res.status : 500);
  }

  return NextResponse.json({ ok: true });
}
