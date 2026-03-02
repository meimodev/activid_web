import "server-only";

import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const DEFAULT_ROOT = "/activid web/invitation-audio";
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function requireAuthorized(request: NextRequest): NextResponse | null {
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  if (!isInvitationRegisterSessionValid(sessionCookie)) {
    return jsonError("Unauthorized", 401);
  }
  return null;
}

function getDropboxToken(): string | null {
  return process.env.DROPBOX_ACCESS_TOKEN ?? null;
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
  const res = await fetch(`https://api.dropboxapi.com/2/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      message: text || `Dropbox request failed: ${path}`,
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

  const token = getDropboxToken();
  if (!token) {
    return jsonError("Server is missing DROPBOX_ACCESS_TOKEN.", 500);
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

  const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
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

  if (!uploadRes.ok) {
    const text = await uploadRes.text().catch(() => "");
    return jsonError(text || "Failed to upload to Dropbox.", 500);
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

  const token = getDropboxToken();
  if (!token) {
    return jsonError("Server is missing DROPBOX_ACCESS_TOKEN.", 500);
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
