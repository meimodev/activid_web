"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ADMIN_INVITATION_AFFILIATE_ID,
  EventDetail,
  Host,
  InvitationConfig,
  InvitationDateTime,
  InvitationDateTimeValue,
} from "@/types/invitation";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "framer-motion";
import { INVITATION_ZONE, parseInvitationDateTime } from "@/lib/date-time";
import {
  getInvitationTemplateThemes,
  INVITATION_TEMPLATE_LISTINGS,
  type InvitationTemplateTheme,
} from "@/data/invitation-templates";
import { getInvitationPurposeSeed } from "@/data/invitations";
import {
  RegisterInvitationState,
  VerifyRegisterPasswordState,
} from "./actions";
import { useDeferredEffect } from "@/hooks/useDeferredEffect";

type TemplateOption = {
  id: string;
  label: string;
};

type AffiliateAttribution = {
  id: string;
  name?: string;
};

type RegisterInvitationFormProps = {
  initialConfig: InvitationConfig;
  mode?: "create" | "edit";
  existingSlug?: string;
  templateOptions: TemplateOption[];
  hasAffiliateCookie?: boolean;
  affiliateCookieId?: string;
  affiliateAttribution?: AffiliateAttribution | null;
  action: (
    prevState: RegisterInvitationState,
    formData: FormData,
  ) => Promise<RegisterInvitationState>;
  verifyPasswordAction: (
    prevState: VerifyRegisterPasswordState,
    formData: FormData,
  ) => Promise<VerifyRegisterPasswordState>;
  initialUnlocked?: boolean;
};

type FieldErrors = {
  musicTitle?: string;
  musicUrl?: string;
  coverImage?: string;
  hostPhotoByIndex?: Record<number, string>;
};

function updateAtPath<T extends object>(
  obj: T,
  path: string[],
  value: unknown,
): T {
  const next = structuredClone(obj) as unknown as Record<string, unknown>;
  let cursor: Record<string, unknown> = next;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!;

    const existing = cursor[key];
    if (!existing || typeof existing !== "object") {
      cursor[key] = {};
    }

    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[path[path.length - 1]!] = value;
  return next as unknown as T;
}

function asBoolean(value: boolean | undefined): boolean {
  return !!value;
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

function deriveBaseSlug(
  purpose: "marriage" | "birthday" | "event",
  hosts: Host[],
): string {
  const hostParts = (hosts ?? [])
    .map((h) => normalizeSlugSegment(h.firstName ?? ""))
    .filter(Boolean);

  const hostSegment = hostParts.length ? hostParts.join("-") : "untitled";
  return `${purpose}-${hostSegment}`;
}

function deriveImagekitFolderKey(
  purpose: "marriage" | "birthday" | "event",
  hosts: Host[],
  unixEpochSeconds: number,
): string {
  const firstHostName = normalizeSlugSegment(hosts?.[0]?.firstName ?? "");
  const hostSegment = firstHostName || "untitled";
  return `${purpose}-${hostSegment}-${unixEpochSeconds}`;
}

function getDefaultGratitudeMessage(
  purpose: "marriage" | "birthday" | "event",
): string {
  if (purpose === "marriage") {
    return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.";
  }
  if (purpose === "birthday") {
    return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk merayakan ulang tahun ini bersama kami.";
  }
  return "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk merayakan momen spesial ini bersama kami.";
}

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_AUDIO_SIZE_BYTES = 250 * 1024 * 1024;

const DROPBOX_AUDIO_LEGACY_UPLOAD_MAX_BYTES = 3 * 1024 * 1024;
const DROPBOX_AUDIO_SESSION_CHUNK_BYTES = 2 * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/avif",
  "image/webp",
  "image/jpeg",
  "image/png",
]);
const ALLOWED_IMAGE_EXTENSIONS = new Set([
  "avif",
  "webp",
  "jpg",
  "jpeg",
  "png",
  "apng",
]);
const IMAGE_INPUT_ACCEPT = "image/avif,image/webp,image/jpeg,image/png,.apng";
const TINYPNG_OPTIMIZABLE_MIME_TYPES = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
]);

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Upload gagal.";
}

function getFileExtension(name: string): string {
  const idx = (name ?? "").lastIndexOf(".");
  if (idx < 0) return "";
  return (name.slice(idx + 1) ?? "").trim().toLowerCase();
}

function validateImageFile(file: File): string | null {
  const type = (file.type ?? "").toLowerCase();
  const ext = getFileExtension(file.name);

  if (type) {
    if (!type.startsWith("image/")) {
      return "Hanya gambar AVIF, WebP, JPG, PNG, atau APNG yang diperbolehkan.";
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.has(type)) {
      return "Hanya gambar AVIF, WebP, JPG, PNG, atau APNG yang diperbolehkan.";
    }
  } else {
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return "Hanya gambar AVIF, WebP, JPG, PNG, atau APNG yang diperbolehkan.";
    }
  }

  if (file.size >= MAX_IMAGE_SIZE_BYTES) {
    return "Ukuran gambar maksimal 25MB.";
  }
  return null;
}

async function tryOptimizeWithTinyPng(file: File): Promise<File> {
  const type = (file.type ?? "").toLowerCase();
  const ext = getFileExtension(file.name);
  if (!type || !TINYPNG_OPTIMIZABLE_MIME_TYPES.has(type)) {
    return file;
  }
  if (ext === "apng") {
    return file;
  }

  try {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/tinypng/optimize", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      return file;
    }
    const blob = await res.blob();
    if (!blob || blob.size === 0) {
      return file;
    }
    const nextType = blob.type || file.type || "application/octet-stream";
    try {
      return new File([blob], file.name, {
        type: nextType,
        lastModified: file.lastModified,
      });
    } catch {
      return file;
    }
  } catch {
    return file;
  }
}

function validateAudioFile(file: File): string | null {
  if (!file.type || !file.type.startsWith("audio/")) {
    return "Hanya file audio yang diperbolehkan.";
  }
  if (file.size >= MAX_AUDIO_SIZE_BYTES) {
    return "Ukuran audio maksimal 250MB.";
  }
  return null;
}

function validateHttpUrl(value: string): string | null {
  const raw = (value ?? "").trim();
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

function sanitizeUploadFilename(value: string): string {
  return (value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(0, 120);
}

type UploadDraftV1 = {
  imagekitFolderKey?: string;
  music?: { url: string; dropboxPath: string };
  imagesByFieldKey?: Record<string, { url: string; fileId?: string }>;
  imageListsByFieldKey?: Record<
    string,
    Array<{ url: string; fileId?: string }>
  >;
  urlToFileId?: Record<string, string>;
};

function readUploadDraft(key: string): UploadDraftV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as UploadDraftV1;
  } catch {
    return null;
  }
}

function writeUploadDraft(key: string, draft: UploadDraftV1) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    return;
  }
}

function updateUploadDraft(
  key: string,
  updater: (prev: UploadDraftV1) => UploadDraftV1,
) {
  const prev = readUploadDraft(key) ?? {};
  writeUploadDraft(key, updater(prev));
}

function clearUploadDraft(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

function xhrPostFormData<T>(
  url: string,
  form: FormData,
  options?: { onProgress?: (percent: number) => void },
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "text";

    if (options?.onProgress) {
      let lastPercent = 0;
      xhr.upload.onloadstart = () => {
        options.onProgress?.(0);
      };
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable || !e.total) return;
        const raw = Math.floor((e.loaded / e.total) * 100);
        const percent = Math.max(0, Math.min(99, raw));
        lastPercent = Math.max(lastPercent, percent);
        options.onProgress?.(percent);
      };

      // Some environments/files produce sparse or non-computable progress events.
      // When the request body has fully sent, we move to 99% ("finalizing") until the server responds.
      xhr.upload.onload = () => {
        if (lastPercent < 99) {
          lastPercent = 99;
          options.onProgress?.(99);
        }
      };
      xhr.upload.onloadend = () => {
        if (lastPercent < 99) {
          lastPercent = 99;
          options.onProgress?.(99);
        }
      };
    }

    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.onload = () => {
      const text = xhr.responseText;
      if (xhr.status < 200 || xhr.status >= 300) {
        let message = text || "Upload failed.";
        if (text) {
          try {
            const parsed: unknown = JSON.parse(text);
            if (parsed && typeof parsed === "object") {
              const obj = parsed as Record<string, unknown>;
              const err = typeof obj.error === "string" ? obj.error.trim() : "";
              if (err) message = err;
            }
          } catch {
            // ignore
          }
        }
        reject(new Error(message));
        return;
      }

      try {
        options?.onProgress?.(100);
        resolve(JSON.parse(text) as T);
      } catch {
        reject(new Error(text || "Upload failed."));
      }
    };

    xhr.send(form);
  });
}

async function uploadToDropboxAudio({
  file,
  folderKey,
  onProgress,
}: {
  file: File;
  folderKey: string;
  onProgress?: (percent: number) => void;
}): Promise<{ url: string; dropboxPath: string }> {
  if (!folderKey) {
    throw new Error("Upload folder is required before uploading audio.");
  }

  if (file.size <= DROPBOX_AUDIO_LEGACY_UPLOAD_MAX_BYTES) {
    const form = new FormData();
    form.set("file", file);
    form.set("folderKey", folderKey);

    const data = await xhrPostFormData<{ url?: string; dropboxPath?: string }>(
      "/api/dropbox/audio",
      form,
      {
        onProgress,
      },
    );
    if (!data.url || !data.dropboxPath) {
      throw new Error("Upload failed: missing URL.");
    }

    return { url: data.url, dropboxPath: data.dropboxPath };
  }

  const fetchChunkJson = async <T,>(url: string, chunk: ArrayBuffer): Promise<T> => {
    let res: Response;
    try {
      res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: chunk,
        credentials: "include",
      });
    } catch (err) {
      throw new Error(getErrorMessage(err) || "Upload failed.");
    }

    const text = await res.text();
    if (!res.ok) {
      let message = text || "Upload failed.";
      if (text) {
        try {
          const parsed: unknown = JSON.parse(text);
          if (parsed && typeof parsed === "object") {
            const obj = parsed as Record<string, unknown>;
            const errMsg = typeof obj.error === "string" ? obj.error.trim() : "";
            if (errMsg) message = errMsg;
          }
        } catch {
          // ignore
        }
      }
      throw new Error(message);
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(text || "Upload failed.");
    }
  };

  const chunkSize = Math.max(1, Math.min(DROPBOX_AUDIO_SESSION_CHUNK_BYTES, file.size));

  const fileName = encodeURIComponent(file.name);
  const encodedFolderKey = encodeURIComponent(folderKey);

  const startChunk = await file.slice(0, chunkSize).arrayBuffer();
  const started = await fetchChunkJson<{
    sessionId: string;
    dropboxPath: string;
    nextOffset: number;
  }>(
    `/api/dropbox/audio?uploadSession=start&folderKey=${encodedFolderKey}&fileName=${fileName}`,
    startChunk,
  );

  let offset = started.nextOffset;
  onProgress?.(Math.max(0, Math.min(99, Math.floor((offset / file.size) * 100))));

  while (offset < file.size) {
    const nextEnd = Math.min(offset + chunkSize, file.size);
    const chunk = await file.slice(offset, nextEnd).arrayBuffer();

    if (nextEnd >= file.size) {
      const finished = await fetchChunkJson<{ url?: string; dropboxPath?: string }>(
        `/api/dropbox/audio?uploadSession=finish&sessionId=${encodeURIComponent(started.sessionId)}&dropboxPath=${encodeURIComponent(started.dropboxPath)}&offset=${String(offset)}`,
        chunk,
      );
      if (!finished.url || !finished.dropboxPath) {
        throw new Error("Upload failed: missing URL.");
      }
      onProgress?.(100);
      return { url: finished.url, dropboxPath: finished.dropboxPath };
    }

    const appended = await fetchChunkJson<{ ok?: boolean; nextOffset?: number }>(
      `/api/dropbox/audio?uploadSession=append&sessionId=${encodeURIComponent(started.sessionId)}&offset=${String(offset)}`,
      chunk,
    );

    const nextOffset = typeof appended.nextOffset === "number" ? appended.nextOffset : NaN;
    if (!Number.isFinite(nextOffset) || nextOffset <= offset) {
      throw new Error("Upload failed.");
    }
    offset = nextOffset;
    onProgress?.(Math.max(0, Math.min(99, Math.floor((offset / file.size) * 100))));
  }

  throw new Error("Upload failed.");
}

async function deleteDropboxAudio(dropboxPath: string): Promise<void> {
  const res = await fetch("/api/dropbox/audio", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dropboxPath }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete failed.");
  }
}

async function uploadToImageKit({
  file,
  folderKey,
  fieldKey,
  onProgress,
  onPhase,
}: {
  file: File;
  folderKey: string;
  fieldKey: string;
  onProgress?: (percent: number) => void;
  onPhase?: (phase: "optimizing" | "uploading") => void;
}): Promise<{ url: string; fileId?: string }> {
  if (!folderKey) {
    throw new Error("Upload folder is required before uploading images.");
  }

  let uploadFile = file;
  const type = (file.type ?? "").toLowerCase();
  const ext = getFileExtension(file.name);
  if (type && TINYPNG_OPTIMIZABLE_MIME_TYPES.has(type) && ext !== "apng") {
    onPhase?.("optimizing");
    uploadFile = await tryOptimizeWithTinyPng(file);
  }
  onPhase?.("uploading");

  const authRes = await fetch("/api/imagekit/auth", { method: "GET" });
  if (!authRes.ok) {
    throw new Error("Unauthorized. Please unlock the register page again.");
  }
  const auth = (await authRes.json()) as {
    token: string;
    expire: number;
    signature: string;
    publicKey: string;
  };

  const form = new FormData();
  form.set("file", uploadFile);
  const safeName = sanitizeUploadFilename(uploadFile.name) || "image";
  form.set("fileName", `${fieldKey}-${Date.now()}-${safeName}`);
  form.set("publicKey", auth.publicKey);
  form.set("signature", auth.signature);
  form.set("token", auth.token);
  form.set("expire", String(auth.expire));
  form.set("folder", `/activid-web/invitation/${folderKey}`);
  form.set("useUniqueFileName", "true");

  const uploaded = await xhrPostFormData<{ url?: string; fileId?: string }>(
    "https://upload.imagekit.io/api/v1/files/upload",
    form,
    { onProgress },
  );
  if (!uploaded.url) {
    throw new Error("Upload failed: missing URL.");
  }
  return { url: uploaded.url, fileId: uploaded.fileId };
}

async function deleteImageKitFile(fileId: string): Promise<void> {
  const res = await fetch("/api/imagekit/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Delete failed.");
  }
}

function ImageUrlPicker({
  label,
  value,
  onChange,
  note,
  folderKey,
  fieldKey,
  draftKey,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  note?: string;
  folderKey: string;
  fieldKey: string;
  draftKey: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [value]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const previewSrc = localPreview ?? value;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleDelete = async () => {
    const url = value;
    if (!url || deleting || uploading) {
      onChange("");
      return;
    }

    setError(null);
    setDeleting(true);
    try {
      const draft = readUploadDraft(draftKey);
      const fileId =
        draft?.urlToFileId?.[url] ??
        draft?.imagesByFieldKey?.[fieldKey]?.fileId;
      if (fileId) {
        await deleteImageKitFile(fileId);
      }

      updateUploadDraft(draftKey, (prev) => {
        const nextImagesByFieldKey = { ...(prev.imagesByFieldKey ?? {}) };
        const existingUrl = nextImagesByFieldKey[fieldKey]?.url;
        delete nextImagesByFieldKey[fieldKey];

        const nextUrlToFileId = { ...(prev.urlToFileId ?? {}) };
        delete nextUrlToFileId[url];
        if (existingUrl && existingUrl !== url) {
          delete nextUrlToFileId[existingUrl];
        }

        return {
          ...prev,
          imagesByFieldKey: nextImagesByFieldKey,
          urlToFileId: nextUrlToFileId,
        };
      });

      onChange("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-2">
      <TextInput label={label} value={value} onChange={onChange} />
      <div className="text-[11px] text-white/50">
        {note ?? "Allowed: AVIF, WebP, JPG, PNG, APNG (max 25MB)"}
      </div>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label className="shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-indigo-500/60">
              {uploading
                ? optimizing
                  ? "Optimizing..."
                  : `Uploading${uploadProgress !== null ? ` ${uploadProgress}%` : "..."}`
                : "Choose Image"}
              <input
                type="file"
                accept={IMAGE_INPUT_ACCEPT}
                className="hidden"
                disabled={uploading || deleting}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;

                  const validationError = validateImageFile(file);
                  if (validationError) {
                    setError(validationError);
                    return;
                  }

                  setError(null);
                  setUploading(true);
                  setOptimizing(true);
                  setUploadProgress(null);

                  const objectUrl = URL.createObjectURL(file);
                  setLocalPreview(objectUrl);

                  try {
                    const uploaded = await uploadToImageKit({
                      file,
                      folderKey,
                      fieldKey,
                      onPhase: (phase) => {
                        if (phase === "optimizing") {
                          setOptimizing(true);
                          setUploadProgress(null);
                        } else {
                          setOptimizing(false);
                          setUploadProgress(0);
                        }
                      },
                      onProgress: (p) => setUploadProgress(p),
                    });

                    updateUploadDraft(draftKey, (prev) => {
                      const nextImagesByFieldKey = {
                        ...(prev.imagesByFieldKey ?? {}),
                      };
                      const previousUrl = nextImagesByFieldKey[fieldKey]?.url;
                      nextImagesByFieldKey[fieldKey] = {
                        url: uploaded.url,
                        fileId: uploaded.fileId,
                      };

                      const nextUrlToFileId = { ...(prev.urlToFileId ?? {}) };
                      if (previousUrl && previousUrl !== uploaded.url) {
                        delete nextUrlToFileId[previousUrl];
                      }
                      if (uploaded.fileId) {
                        nextUrlToFileId[uploaded.url] = uploaded.fileId;
                      }

                      return {
                        ...prev,
                        imagesByFieldKey: nextImagesByFieldKey,
                        urlToFileId: nextUrlToFileId,
                      };
                    });

                    onChange(uploaded.url);
                    setLocalPreview(null);
                  } catch (err) {
                    setError(getErrorMessage(err));
                  } finally {
                    setUploading(false);
                    setOptimizing(false);
                    setUploadProgress(null);
                  }
                }}
              />
            </label>

            {value ? (
              <>
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-emerald-400/60 disabled:opacity-60"
                  disabled={uploading || deleting}
                  onClick={() => void handleCopy(value)}
                >
                  {copied ? "Copied" : "Copy Link"}
                </button>
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-red-500/60 disabled:opacity-60"
                  disabled={uploading || deleting}
                  onClick={() => void handleDelete()}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="shrink-0">
          {previewSrc && !imgError ? (
            <img
              src={previewSrc}
              alt=""
              className="h-16 w-16 rounded-xl border border-white/10 bg-white/5 object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="h-16 w-16 rounded-xl border border-white/10 bg-white/5" />
          )}
        </div>
      </div>

      {uploading && !optimizing && uploadProgress !== null ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
          <div
            className="h-full bg-indigo-400/70"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}

type PendingUpload = {
  id: string;
  previewUrl: string;
  name: string;
  status: "uploading" | "error";
  phase?: "optimizing" | "uploading";
  progress?: number;
  error?: string;
};

function ImageUrlListPicker({
  label,
  items,
  onChange,
  folderKey,
  fieldKey,
  draftKey,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  folderKey: string;
  fieldKey: string;
  draftKey: string;
}) {
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const pendingRef = useRef<PendingUpload[]>([]);
  const itemsRef = useRef<string[]>(items ?? []);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    itemsRef.current = items ?? [];
  }, [items]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  return (
    <div className="grid gap-3">
      <div className="text-sm text-white/70">{label}</div>
      <div className="text-[11px] text-white/50">
        Allowed: AVIF, WebP, JPG, PNG, APNG (max 25MB)
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-2">
        {(items ?? []).map((item, idx) => (
          <div
            key={`${item}-${idx}`}
            className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={item}
                alt=""
                className="h-16 w-16 rounded-xl border border-white/10 bg-black/20 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="min-w-0 flex-1 grid gap-2">
                <input
                  className="w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500/60"
                  value={item}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = e.target.value;
                    itemsRef.current = next;
                    onChange(next);
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-red-500/60"
                    disabled={Boolean(deletingUrl)}
                    onClick={() => {
                      void (async () => {
                        const url = item;
                        setDeletingUrl(url);
                        try {
                          const draft = readUploadDraft(draftKey);
                          const fileId = draft?.urlToFileId?.[url];
                          if (fileId) {
                            await deleteImageKitFile(fileId);
                          }

                          const nextItems = items.filter((_, i) => i !== idx);
                          itemsRef.current = nextItems;
                          onChange(nextItems);

                          updateUploadDraft(draftKey, (prev) => {
                            const nextLists = {
                              ...(prev.imageListsByFieldKey ?? {}),
                            };
                            const current = nextLists[fieldKey] ?? [];
                            nextLists[fieldKey] = current.filter(
                              (x) => x.url !== url,
                            );

                            const nextUrlToFileId = {
                              ...(prev.urlToFileId ?? {}),
                            };
                            delete nextUrlToFileId[url];

                            return {
                              ...prev,
                              imageListsByFieldKey: nextLists,
                              urlToFileId: nextUrlToFileId,
                            };
                          });
                        } catch (err) {
                          setError(getErrorMessage(err));
                        } finally {
                          setDeletingUrl(null);
                        }
                      })();
                    }}
                  >
                    {deletingUrl === item ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-emerald-400/60 disabled:opacity-60"
                    disabled={Boolean(deletingUrl)}
                    onClick={() => {
                      void (async () => {
                        try {
                          await navigator.clipboard.writeText(item);
                          setCopiedUrl(item);
                          window.setTimeout(
                            () =>
                              setCopiedUrl((prev) =>
                                prev === item ? null : prev,
                              ),
                            1200,
                          );
                        } catch {
                          setCopiedUrl(null);
                        }
                      })();
                    }}
                  >
                    {copiedUrl === item ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pending.length ? (
        <div className="grid gap-2">
          {pending.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
            >
              <img
                src={p.previewUrl}
                alt=""
                className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 object-cover"
              />
              <div className="min-w-0 flex-1 truncate text-xs text-white/70">
                {p.name}
              </div>
              <div className="text-xs text-white/70">
                {p.status === "uploading"
                  ? p.phase === "optimizing"
                    ? "Optimizing..."
                    : `Uploading${typeof p.progress === "number" ? ` ${p.progress}%` : "..."}`
                  : (p.error ?? "Failed")}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2">
        <label className="cursor-pointer rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2">
          + Add Images
          <input
            type="file"
            accept={IMAGE_INPUT_ACCEPT}
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (files.length === 0) return;

              setError(null);

              for (const file of files) {
                const validationError = validateImageFile(file);
                if (validationError) {
                  setError(validationError);
                  continue;
                }

                const id = globalThis.crypto?.randomUUID
                  ? globalThis.crypto.randomUUID()
                  : `${Date.now()}-${Math.random()}`;
                const previewUrl = URL.createObjectURL(file);

                setPending((prev) => [
                  ...prev,
                  {
                    id,
                    previewUrl,
                    name: file.name,
                    status: "uploading",
                    phase: "optimizing",
                  },
                ]);

                try {
                  const uploaded = await uploadToImageKit({
                    file,
                    folderKey,
                    fieldKey,
                    onPhase: (phase) => {
                      setPending((prev) =>
                        prev.map((x) =>
                          x.id === id
                            ? {
                                ...x,
                                phase,
                                progress: phase === "uploading" ? 0 : undefined,
                              }
                            : x,
                        ),
                      );
                    },
                    onProgress: (p) =>
                      setPending((prev) =>
                        prev.map((x) =>
                          x.id === id ? { ...x, progress: p } : x,
                        ),
                      ),
                  });

                  updateUploadDraft(draftKey, (prev) => {
                    const nextLists = { ...(prev.imageListsByFieldKey ?? {}) };
                    const current = nextLists[fieldKey] ?? [];
                    nextLists[fieldKey] = [
                      ...current,
                      { url: uploaded.url, fileId: uploaded.fileId },
                    ];

                    const nextUrlToFileId = { ...(prev.urlToFileId ?? {}) };
                    if (uploaded.fileId) {
                      nextUrlToFileId[uploaded.url] = uploaded.fileId;
                    }

                    return {
                      ...prev,
                      imageListsByFieldKey: nextLists,
                      urlToFileId: nextUrlToFileId,
                    };
                  });

                  const mergedItems = [
                    ...(itemsRef.current ?? []),
                    uploaded.url,
                  ];
                  itemsRef.current = mergedItems;
                  onChange(mergedItems);
                  URL.revokeObjectURL(previewUrl);
                  setPending((prev) => prev.filter((p) => p.id !== id));
                } catch (err) {
                  setPending((prev) =>
                    prev.map((p) =>
                      p.id === id
                        ? { ...p, status: "error", error: getErrorMessage(err) }
                        : p,
                    ),
                  );
                }
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}

const HOST_FIELDS: Array<[keyof Host, string]> = [
  ["firstName", "First Name"],
  ["fullName", "Full Name"],
  ["shortName", "Short Name"],
  ["role", "Role"],
  ["parents", "Parents"],
  ["photo", "Photo URL"],
];

const RSVP_FIELDS: Array<
  [
    (
      | "heading"
      | "description"
      | "successMessage"
      | "alreadySubmittedMessage"
      | "seeYouMessage"
    ),
    string,
  ]
> = [
  ["heading", "Heading"],
  ["description", "Description"],
  ["successMessage", "Success Message"],
  ["alreadySubmittedMessage", "Already Submitted Message"],
  ["seeYouMessage", "See You Message"],
];

const EVENT_FIELDS: Array<["title" | "venue" | "address" | "mapUrl", string]> =
  [
    ["title", "Title"],
    ["venue", "Venue"],
    ["address", "Address"],
    ["mapUrl", "Map URL"],
  ];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function createTodayDateTime(): InvitationDateTime {
  const now = DateTime.now().setZone(INVITATION_ZONE);
  return {
    date: { year: now.year, month: now.month, day: now.day },
    time: { hour: 0, minute: 0 },
  };
}

function isInvitationDateTime(value: unknown): value is InvitationDateTime {
  if (!value || typeof value !== "object") return false;

  const v = value as {
    date?: { year?: unknown; month?: unknown; day?: unknown };
    time?: { hour?: unknown; minute?: unknown };
  };

  return (
    !!v.date &&
    Number.isInteger(v.date.year) &&
    Number.isInteger(v.date.month) &&
    Number.isInteger(v.date.day) &&
    !!v.time &&
    Number.isInteger(v.time.hour) &&
    Number.isInteger(v.time.minute)
  );
}

function tryParseDateStringToDateTime(
  input: string,
): InvitationDateTime | null {
  const raw = (input || "").trim();
  if (!raw) return null;

  const normalized = raw.replace(/,/g, " ").replace(/\s+/g, " ").trim();

  const iso = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (year && month && day) {
      return { date: { year, month, day }, time: { hour: 0, minute: 0 } };
    }
  }

  const monthMap: Record<string, number> = {
    january: 1,
    jan: 1,
    januari: 1,
    february: 2,
    feb: 2,
    februari: 2,
    march: 3,
    mar: 3,
    maret: 3,
    april: 4,
    apr: 4,
    may: 5,
    mei: 5,
    june: 6,
    jun: 6,
    juni: 6,
    july: 7,
    jul: 7,
    juli: 7,
    august: 8,
    aug: 8,
    agustus: 8,
    agu: 8,
    ags: 8,
    september: 9,
    sep: 9,
    october: 10,
    oct: 10,
    oktober: 10,
    okt: 10,
    november: 11,
    nov: 11,
    december: 12,
    dec: 12,
    desember: 12,
    des: 12,
  };

  const lower = normalized.toLowerCase();

  const dmy = lower.match(/^(?:[a-z]+\s+)?(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = monthMap[dmy[2]] ?? 0;
    const year = Number(dmy[3]);
    if (year && month && day) {
      return { date: { year, month, day }, time: { hour: 0, minute: 0 } };
    }
  }

  const my = lower.match(/^([a-z]+)\s+(\d{4})$/);
  if (my) {
    const month = monthMap[my[1]] ?? 0;
    const year = Number(my[2]);
    if (year && month) {
      return { date: { year, month, day: 1 }, time: { hour: 0, minute: 0 } };
    }
  }

  const tahun = lower.match(/^tahun\s+(\d{4})$/);
  if (tahun) {
    const year = Number(tahun[1]);
    if (year) {
      return { date: { year, month: 1, day: 1 }, time: { hour: 0, minute: 0 } };
    }
  }

  return null;
}

function coerceInvitationDateTime(value: unknown): InvitationDateTime {
  if (isInvitationDateTime(value)) return value;

  if (value && typeof value === "object") {
    const v = value as { year?: unknown; month?: unknown; day?: unknown };
    if (
      Number.isInteger(v.year) &&
      Number.isInteger(v.month) &&
      Number.isInteger(v.day)
    ) {
      return {
        date: {
          year: v.year as number,
          month: v.month as number,
          day: v.day as number,
        },
        time: { hour: 0, minute: 0 },
      };
    }
  }

  if (typeof value === "string") {
    const dt = parseInvitationDateTime(value);
    if (dt) {
      const zoned = dt.setZone(INVITATION_ZONE);
      return {
        date: { year: zoned.year, month: zoned.month, day: zoned.day },
        time: { hour: zoned.hour, minute: zoned.minute },
      };
    }

    const parsed = tryParseDateStringToDateTime(value);
    if (parsed) return parsed;
  }

  return createTodayDateTime();
}

function toDateInputValue(value: InvitationDateTime) {
  if (!value?.date) return "";
  return `${value.date.year}-${pad2(value.date.month)}-${pad2(value.date.day)}`;
}

function toTimeInputValue(value: InvitationDateTime) {
  if (!value?.time) return "00:00";
  return `${pad2(value.time.hour)}:${pad2(value.time.minute)}`;
}

function withDateFromInput(
  value: InvitationDateTime,
  input: string,
): InvitationDateTime {
  const parts = (input || "").split("-");
  if (parts.length !== 3) return value;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!Number.isInteger(year) || year < 1900) return value;
  if (!Number.isInteger(month) || month < 1 || month > 12) return value;
  if (!Number.isInteger(day) || day < 1 || day > 31) return value;
  const dt = DateTime.fromObject(
    { year, month, day },
    { zone: INVITATION_ZONE },
  );
  if (!dt.isValid) return value;
  return { ...value, date: { year, month, day } };
}

function withTimeFromInput(
  value: InvitationDateTime,
  input: string,
): InvitationDateTime {
  const parts = (input || "").split(":");
  if (parts.length !== 2) return value;
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return value;
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return value;
  return { ...value, time: { hour, minute } };
}

function ensureEventList(
  raw: InvitationConfig["sections"]["event"]["events"],
): [EventDetail, ...EventDetail[]] {
  const emptyEvent: EventDetail = {
    title: "",
    date: createTodayDateTime(),
    venue: "",
    address: "",
    mapUrl: "",
  };

  const list = (raw.length ? raw : [emptyEvent]).map((e) => ({
    ...emptyEvent,
    ...(e as unknown as Partial<EventDetail>),
    date: coerceInvitationDateTime((e as { date?: unknown })?.date),
  }));

  return list as [EventDetail, ...EventDetail[]];
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  error,
  note,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: string;
  note?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className={`rounded-xl border bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60 ${
          readOnly ? "cursor-default" : ""
        } ${error ? "border-red-500/50" : "border-white/10"}`}
        value={value}
        type={type}
        readOnly={readOnly}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
      />
      {note ? <span className="text-[11px] text-white/50">{note}</span> : null}
      {error ? (
        <span className="text-[11px] text-red-200">{error}</span>
      ) : null}
    </label>
  );
}

function ImportantFieldWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: [
          "0 0 0 0 rgba(34,211,238,0.00)",
          "0 0 28px -12px rgba(34,211,238,0.35)",
          "0 0 0 0 rgba(34,211,238,0.00)",
        ],
      }}
      transition={{
        opacity: { duration: 0.45, ease: "easeOut" },
        y: { duration: 0.45, ease: "easeOut" },
        boxShadow: {
          duration: 4.6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: InvitationDateTimeValue;
  onChange: (value: InvitationDateTime) => void;
}) {
  const normalized = coerceInvitationDateTime(value);
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toDateInputValue(normalized)}
        type="date"
        onChange={(e) =>
          onChange(withDateFromInput(normalized, e.target.value))
        }
      />
    </label>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: InvitationDateTimeValue;
  onChange: (value: InvitationDateTime) => void;
}) {
  const normalized = coerceInvitationDateTime(value);
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={toTimeInputValue(normalized)}
        type="time"
        onChange={(e) =>
          onChange(withTimeFromInput(normalized, e.target.value))
        }
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-white/70">{label}</span>
      <textarea
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-500/60"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SectionCard({
  title,
  enabled,
  onEnabledChange,
  children,
}: {
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const effectiveOpen = enabled && open;

  return (
    <details
      open={effectiveOpen}
      className="group rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_30px_-10px_rgba(34,211,238,0.05)] transition-all overflow-hidden relative"
      onToggle={(e) => {
        if (!enabled) return;
        setOpen((e.currentTarget as HTMLDetailsElement).open);
      }}
    >
      <summary
        className={`cursor-pointer text-lg font-black tracking-tight text-white flex items-center justify-between gap-3 list-none ${
          enabled ? "cursor-pointer" : "cursor-not-allowed opacity-70"
        }`}
        onClick={(e) => {
          if (!enabled) e.preventDefault();
        }}
      >
        <span>{title}</span>
        <span className="flex items-center gap-3">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
              enabled
                ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-100 hover:bg-indigo-500/20"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const nextEnabled = !enabled;
              if (!nextEnabled) {
                setOpen(false);
              }
              onEnabledChange(nextEnabled);
            }}
            role="switch"
            aria-checked={enabled}
          >
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${enabled ? "bg-emerald-400" : "bg-white/25"}`}
            />
            Enabled
          </button>
          <span className="text-white/40 group-open:rotate-180 transition-transform duration-300">
            ▼
          </span>
        </span>
      </summary>

      <div className="mt-6 grid gap-6 relative z-10">{children}</div>
    </details>
  );
}

export function RegisterInvitationForm({
  initialConfig,
  mode = "create",
  existingSlug,
  templateOptions,
  hasAffiliateCookie,
  affiliateCookieId,
  affiliateAttribution,
  action,
  verifyPasswordAction,
  initialUnlocked,
}: RegisterInvitationFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, {});
  const [verifyState, verifyAction, verifying] = useActionState(
    verifyPasswordAction,
    {},
  );

  const isUnlocked = Boolean(initialUnlocked || verifyState.ok);
  const isEditMode = mode === "edit";
  const existingAffiliateId =
    isEditMode &&
    typeof initialConfig.affiliateId === "string" &&
    initialConfig.affiliateId.trim() &&
    initialConfig.affiliateId.trim().toUpperCase() !== ADMIN_INVITATION_AFFILIATE_ID
      ? initialConfig.affiliateId.trim()
      : undefined;
  const visibleStateAffiliateId =
    state.affiliateId?.trim().toUpperCase() === ADMIN_INVITATION_AFFILIATE_ID
      ? undefined
      : state.affiliateId;

  const requiresAffiliateAcknowledgement =
    !isEditMode && !isUnlocked && hasAffiliateCookie === false;
  const [affiliateAcknowledged, setAffiliateAcknowledged] = useState(
    () => !requiresAffiliateAcknowledgement,
  );
  const [affiliateAcknowledgedChecked, setAffiliateAcknowledgedChecked] =
    useState(false);
  const [affiliateAckModalOpen, setAffiliateAckModalOpen] = useState(
    () => requiresAffiliateAcknowledgement,
  );

  useEffect(() => {
    if (!requiresAffiliateAcknowledgement) {
      setAffiliateAcknowledged(true);
      setAffiliateAckModalOpen(false);
      return;
    }
    setAffiliateAcknowledged(false);
    setAffiliateAcknowledgedChecked(false);
    setAffiliateAckModalOpen(true);
  }, [requiresAffiliateAcknowledgement]);

  useEffect(() => {
    if (!verifyState.ok) return;
    router.refresh();
  }, [router, verifyState.ok]);

  const uploadDraftKey = useMemo(() => {
    const base = "activid_invitation_register_upload_draft_v1";
    if (!isEditMode) return base;
    const suffix = existingSlug || initialConfig.id;
    return suffix ? `${base}:${suffix}` : base;
  }, [existingSlug, initialConfig.id, isEditMode]);

  const initialTemplateId =
    initialConfig.templateId || templateOptions[0]?.id || "flow";
  const initialTemplateThemes = getInvitationTemplateThemes(initialTemplateId);
  const initialThemeFromTemplate = initialTemplateThemes[0];
  const initialThemeMatch = initialConfig.theme
    ? initialTemplateThemes.find(
        (t) =>
          t.mainColor === initialConfig.theme.mainColor &&
          t.accentColor === initialConfig.theme.accentColor &&
          t.accent2Color === initialConfig.theme.accent2Color &&
          t.darkColor === initialConfig.theme.darkColor,
      )
    : undefined;
  const initialThemeIdValue =
    initialThemeMatch?.id ?? initialThemeFromTemplate?.id ?? "";

  const [slug, setSlug] = useState("");
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const initialTheme = useMemo(
    () => getInvitationTemplateThemes(templateId)[0],
    [templateId],
  );
  const [themeId, setThemeId] = useState(() => initialThemeIdValue);
  const [affiliateId, setAffiliateId] = useState("");
  const [password, setPassword] = useState("");
  const [musicUploading, setMusicUploading] = useState(false);
  const [musicUploadProgress, setMusicUploadProgress] = useState<number | null>(
    null,
  );
  const [musicDeleting, setMusicDeleting] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [musicCopied, setMusicCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const initialPurpose =
    initialTemplateId === "kids-birthday" ? "birthday" : initialConfig.purpose;
  const imagekitEpochSecondsRef = useRef<number>(0);
  const [purpose, setPurpose] = useState<"marriage" | "birthday" | "event">(
    initialPurpose,
  );
  const [config, setConfig] = useState<InvitationConfig>(() => ({
    ...initialConfig,
    id: isEditMode ? (existingSlug ?? initialConfig.id) : initialConfig.id,
    imagekitFolderKey:
      initialConfig.imagekitFolderKey ??
      deriveImagekitFolderKey(
        initialPurpose,
        initialConfig.sections.hosts.hosts,
        Math.floor(Date.now() / 1000),
      ),
    templateId: isEditMode ? initialTemplateId : templateId,
    theme: isEditMode
      ? initialConfig.theme
      : initialTheme
        ? {
            mainColor: initialTheme.mainColor,
            accentColor: initialTheme.accentColor,
            accent2Color: initialTheme.accent2Color,
            darkColor: initialTheme.darkColor,
          }
        : initialConfig.theme,
    purpose: initialPurpose,
    sections: {
      ...initialConfig.sections,
      story: {
        ...initialConfig.sections.story,
        stories: (initialConfig.sections.story.stories ?? []).map((s) => ({
          ...s,
          date: coerceInvitationDateTime((s as { date?: unknown }).date),
        })),
      },
      event: {
        ...initialConfig.sections.event,
        events: ensureEventList(initialConfig.sections.event.events),
      },
      gratitude: {
        ...initialConfig.sections.gratitude,
        enabled: isEditMode ? initialConfig.sections.gratitude.enabled : true,
        message: isEditMode
          ? initialConfig.sections.gratitude.message
          : initialConfig.sections.gratitude.message?.trim()
            ? initialConfig.sections.gratitude.message
            : getDefaultGratitudeMessage(initialPurpose),
      },
    },
  }));

  useDeferredEffect(() => {
    const initialSlug = isEditMode ? (existingSlug ?? config.id) : config.id;
    setSlug((prev) => (prev === initialSlug ? prev : initialSlug));
    setConfig((prev) =>
      prev.id === initialSlug ? prev : { ...prev, id: initialSlug },
    );
  }, [existingSlug, isEditMode]);

  useEffect(() => {
    if (!isUnlocked) return;
    const draft = readUploadDraft(uploadDraftKey);
    if (!draft) return;

    setConfig((prev) => {
      let next = prev;

      if (
        draft.imagekitFolderKey &&
        prev.imagekitFolderKey !== draft.imagekitFolderKey
      ) {
        next = { ...next, imagekitFolderKey: draft.imagekitFolderKey };
      }

      if (
        draft.music?.url &&
        draft.music.dropboxPath &&
        !prev.music.url &&
        !prev.music.dropboxPath
      ) {
        next = updateAtPath(next, ["music", "url"], draft.music.url);
        next = updateAtPath(
          next,
          ["music", "dropboxPath"],
          draft.music.dropboxPath,
        );
      }

      const heroUrl = draft.imagesByFieldKey?.["hero-cover"]?.url;
      if (heroUrl && !prev.sections.hero.coverImage) {
        next = updateAtPath(next, ["sections", "hero", "coverImage"], heroUrl);
      }

      const nextHosts = [...(next.sections.hosts.hosts ?? [])];
      let changedHosts = false;
      nextHosts.forEach((host, idx) => {
        const key = `host-${idx}-photo`;
        const photoUrl = draft.imagesByFieldKey?.[key]?.url;
        if (photoUrl && !host?.photo) {
          nextHosts[idx] = { ...host, photo: photoUrl };
          changedHosts = true;
        }
      });
      if (changedHosts) {
        next = updateAtPath(next, ["sections", "hosts", "hosts"], nextHosts);
      }

      const galleryDraft = draft.imageListsByFieldKey?.["gallery-photo"] ?? [];
      if (galleryDraft.length && !(prev.sections.gallery.photos ?? []).length) {
        next = updateAtPath(
          next,
          ["sections", "gallery", "photos"],
          galleryDraft.map((x) => x.url),
        );
      }

      return next;
    });
  }, [isUnlocked, uploadDraftKey]);

  useEffect(() => {
    if (!isUnlocked) return;
    if (!config.imagekitFolderKey) return;
    updateUploadDraft(uploadDraftKey, (prev) => ({
      ...prev,
      imagekitFolderKey: prev.imagekitFolderKey ?? config.imagekitFolderKey,
    }));
  }, [config.imagekitFolderKey, isUnlocked, uploadDraftKey]);

  useEffect(() => {
    if (!isUnlocked) return;
    if (!state.ok) return;
    clearUploadDraft(uploadDraftKey);
  }, [isUnlocked, state.ok, uploadDraftKey]);

  function setHosts(nextHosts: Host[]) {
    setFieldErrors((prev) => ({ ...prev, hostPhotoByIndex: undefined }));
    setConfig((prev) =>
      updateAtPath(prev, ["sections", "hosts", "hosts"], nextHosts),
    );
  }

  useDeferredEffect(() => {
    if (isEditMode) return;
    const nextSlug = deriveBaseSlug(purpose, config.sections.hosts.hosts);
    setSlug((prev) => (prev === nextSlug ? prev : nextSlug));
    setConfig((prev) =>
      prev.id === nextSlug ? prev : { ...prev, id: nextSlug },
    );
  }, [config.sections.hosts.hosts, purpose, isEditMode]);
  const hasImageUploads =
    Boolean(config.sections?.hero?.coverImage) ||
    Boolean(config.sections.hosts.hosts.some((h) => Boolean(h.photo))) ||
    Boolean((config.sections?.gallery?.photos ?? []).length);

  useDeferredEffect(() => {
    if (isEditMode) return;
    if (hasImageUploads) return;

    const draft = readUploadDraft(uploadDraftKey);
    if (draft?.imagekitFolderKey) {
      setConfig((prev) =>
        prev.imagekitFolderKey === draft.imagekitFolderKey
          ? prev
          : { ...prev, imagekitFolderKey: draft.imagekitFolderKey },
      );
      return;
    }

    if (!imagekitEpochSecondsRef.current) {
      imagekitEpochSecondsRef.current = Math.floor(Date.now() / 1000);
    }

    const nextFolderKey = deriveImagekitFolderKey(
      purpose,
      config.sections.hosts.hosts,
      imagekitEpochSecondsRef.current,
    );

    setConfig((prev) =>
      prev.imagekitFolderKey === nextFolderKey
        ? prev
        : { ...prev, imagekitFolderKey: nextFolderKey },
    );
  }, [
    config.sections.hosts.hosts,
    hasImageUploads,
    isEditMode,
    purpose,
    uploadDraftKey,
  ]);

  const handleTemplateChange = (nextTemplateId: string) => {
    const nextTheme = getInvitationTemplateThemes(nextTemplateId)[0];
    setTemplateId(nextTemplateId);
    setThemeId(nextTheme?.id ?? "");
    setConfig((prev) => ({
      ...prev,
      templateId: nextTemplateId,
      theme: nextTheme
        ? {
            mainColor: nextTheme.mainColor,
            accentColor: nextTheme.accentColor,
            accent2Color: nextTheme.accent2Color,
            darkColor: nextTheme.darkColor,
          }
        : prev.theme,
    }));

    if (nextTemplateId === "kids-birthday" && purpose !== "birthday") {
      handlePurposeChange("birthday");
    }
  };

  const templateThemes = useMemo(
    () => getInvitationTemplateThemes(templateId),
    [templateId],
  );

  const handleThemeChange = (nextTheme: InvitationTemplateTheme) => {
    setThemeId(nextTheme.id);
    setConfig((prev) => ({
      ...prev,
      theme: {
        mainColor: nextTheme.mainColor,
        accentColor: nextTheme.accentColor,
        accent2Color: nextTheme.accent2Color,
        darkColor: nextTheme.darkColor,
      },
    }));
  };

  const handlePurposeChange = (
    nextPurpose: "marriage" | "birthday" | "event",
  ) => {
    setPurpose(nextPurpose);

    if (isEditMode) {
      setConfig((prev) => ({
        ...prev,
        purpose: nextPurpose,
      }));
      return;
    }

    const seed = getInvitationPurposeSeed(nextPurpose);
    const seedGratitudeMessage = seed.sections.gratitude.message?.trim()
      ? seed.sections.gratitude.message
      : getDefaultGratitudeMessage(nextPurpose);
    setConfig((prev) => ({
      ...prev,
      purpose: nextPurpose,
      music: prev.music,
      sections: {
        ...prev.sections,
        hero: {
          ...prev.sections.hero,
          subtitle: seed.sections.hero.subtitle,
        },
        title: {
          ...prev.sections.title,
          heading: seed.sections.title.heading,
        },
        countdown: {
          ...prev.sections.countdown,
          heading: seed.sections.countdown.heading,
        },
        quote: {
          ...prev.sections.quote,
          text: seed.sections.quote.text,
          author: seed.sections.quote.author,
        },
        story: {
          ...prev.sections.story,
          heading: seed.sections.story.heading,
        },
        event: {
          ...prev.sections.event,
          heading: seed.sections.event.heading,
        },
        gallery: {
          ...prev.sections.gallery,
          heading: seed.sections.gallery.heading,
        },
        rsvp: {
          ...prev.sections.rsvp,
          heading: seed.sections.rsvp.heading,
          description: seed.sections.rsvp.description,
          successMessage: seed.sections.rsvp.successMessage,
          alreadySubmittedMessage: seed.sections.rsvp.alreadySubmittedMessage,
          seeYouMessage: seed.sections.rsvp.seeYouMessage,
        },
        gift: {
          ...prev.sections.gift,
          heading: seed.sections.gift.heading,
          description: seed.sections.gift.description,
        },
        wishes: {
          ...prev.sections.wishes,
          heading: seed.sections.wishes.heading,
          placeholder: seed.sections.wishes.placeholder,
          thankYouMessage: seed.sections.wishes.thankYouMessage,
        },
        gratitude: {
          ...prev.sections.gratitude,
          message: seedGratitudeMessage,
        },
        footer: {
          ...prev.sections.footer,
          message: seed.sections.footer.message,
        },
      },
    }));
  };

  const templateListingByTemplateId = useMemo(() => {
    return new Map(
      INVITATION_TEMPLATE_LISTINGS.map((t) => [t.templateId, t] as const),
    );
  }, []);

  const templateCards = useMemo(() => {
    return templateOptions.map((opt) => {
      const listing = templateListingByTemplateId.get(opt.id);

      return {
        id: opt.id,
        label: opt.label,
        video: listing?.video ?? "",
        priceDiscount: listing?.priceDiscount ?? "",
      };
    });
  }, [templateListingByTemplateId, templateOptions]);

  const templateScrollerRef = useRef<HTMLDivElement | null>(null);
  const templateCounterRafRef = useRef<number | null>(null);
  const templateDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startClientX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startClientX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const templateIgnoreClickRef = useRef(false);
  const [templateDragging, setTemplateDragging] = useState(false);
  const [templateDisplayedIndex, setTemplateDisplayedIndex] = useState(1);

  const themeScrollerRef = useRef<HTMLDivElement | null>(null);
  const themeCounterRafRef = useRef<number | null>(null);
  const themeDragRef = useRef<{
    active: boolean;
    pointerId: number | null;
    startClientX: number;
    startScrollLeft: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: null,
    startClientX: 0,
    startScrollLeft: 0,
    moved: false,
  });
  const themeIgnoreClickRef = useRef(false);
  const [themeDragging, setThemeDragging] = useState(false);
  const [themeDisplayedIndex, setThemeDisplayedIndex] = useState(1);

  const getDisplayedIndexFromScroller = useCallback(
    (el: HTMLDivElement): number => {
      const children = Array.from(el.children) as HTMLElement[];
      if (!children.length) return 1;

      const center = el.scrollLeft + el.clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < children.length; i++) {
        const child = children[i]!;
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      return bestIdx + 1;
    },
    [],
  );

  const updateTemplateDisplayedIndex = useCallback(() => {
    const el = templateScrollerRef.current;
    if (!el) return;
    setTemplateDisplayedIndex(getDisplayedIndexFromScroller(el));
  }, [getDisplayedIndexFromScroller]);

  const updateThemeDisplayedIndex = useCallback(() => {
    const el = themeScrollerRef.current;
    if (!el) return;
    setThemeDisplayedIndex(getDisplayedIndexFromScroller(el));
  }, [getDisplayedIndexFromScroller]);

  const handleTemplateScrollerScroll = () => {
    if (templateCounterRafRef.current != null) return;
    templateCounterRafRef.current = window.requestAnimationFrame(() => {
      templateCounterRafRef.current = null;
      updateTemplateDisplayedIndex();
    });
  };

  const handleThemeScrollerScroll = () => {
    if (themeCounterRafRef.current != null) return;
    themeCounterRafRef.current = window.requestAnimationFrame(() => {
      themeCounterRafRef.current = null;
      updateThemeDisplayedIndex();
    });
  };

  useEffect(() => {
    updateTemplateDisplayedIndex();
    return () => {
      if (templateCounterRafRef.current != null) {
        window.cancelAnimationFrame(templateCounterRafRef.current);
        templateCounterRafRef.current = null;
      }
    };
  }, [templateCards.length, updateTemplateDisplayedIndex]);

  useDeferredEffect(() => {
    setThemeDisplayedIndex(1);
    const el = themeScrollerRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
    updateThemeDisplayedIndex();

    return () => {
      if (themeCounterRafRef.current != null) {
        window.cancelAnimationFrame(themeCounterRafRef.current);
        themeCounterRafRef.current = null;
      }
    };
  }, [templateThemes.length]);

  const templatePosition = {
    current: Math.min(
      Math.max(templateDisplayedIndex, 1),
      templateCards.length || 1,
    ),
    total: templateCards.length,
  };

  const themePosition = {
    current: Math.min(
      Math.max(themeDisplayedIndex, 1),
      templateThemes.length || 1,
    ),
    total: templateThemes.length,
  };

  const handleThemeScrollerPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (e.button !== 0) return;
    const el = themeScrollerRef.current;
    if (!el) return;

    themeDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setThemeDragging(false);
  };

  const handleThemeScrollerPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const el = themeScrollerRef.current;
    const drag = themeDragRef.current;
    if (!el || !drag.active) return;

    const deltaX = e.clientX - drag.startClientX;
    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
      setThemeDragging(true);
      el.setPointerCapture(drag.pointerId ?? e.pointerId);
    }
    el.scrollLeft = drag.startScrollLeft - deltaX;
    if (drag.moved) {
      e.preventDefault();
    }
  };

  const handleThemeScrollerPointerEnd = () => {
    const el = themeScrollerRef.current;
    const drag = themeDragRef.current;
    if (!el || !drag.active) return;

    themeIgnoreClickRef.current = drag.moved;
    if (drag.moved) {
      window.setTimeout(() => {
        themeIgnoreClickRef.current = false;
      }, 0);
    }
    if (drag.pointerId !== null && el.hasPointerCapture(drag.pointerId)) {
      el.releasePointerCapture(drag.pointerId);
    }
    themeDragRef.current.active = false;
    themeDragRef.current.pointerId = null;
    setThemeDragging(false);
  };

  const handleTemplateScrollerPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (e.button !== 0) return;
    const el = templateScrollerRef.current;
    if (!el) return;

    templateDragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    setTemplateDragging(false);
  };

  const handleTemplateScrollerPointerMove = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const el = templateScrollerRef.current;
    const drag = templateDragRef.current;
    if (!el || !drag.active) return;

    const deltaX = e.clientX - drag.startClientX;
    if (!drag.moved && Math.abs(deltaX) > 4) {
      drag.moved = true;
      setTemplateDragging(true);
      el.setPointerCapture(drag.pointerId ?? e.pointerId);
    }
    el.scrollLeft = drag.startScrollLeft - deltaX;
    if (drag.moved) {
      e.preventDefault();
    }
  };

  const handleTemplateScrollerPointerEnd = () => {
    const el = templateScrollerRef.current;
    const drag = templateDragRef.current;
    if (!el || !drag.active) return;

    templateIgnoreClickRef.current = drag.moved;
    if (drag.moved) {
      window.setTimeout(() => {
        templateIgnoreClickRef.current = false;
      }, 0);
    }
    if (drag.pointerId !== null && el.hasPointerCapture(drag.pointerId)) {
      el.releasePointerCapture(drag.pointerId);
    }
    templateDragRef.current.active = false;
    templateDragRef.current.pointerId = null;
    setTemplateDragging(false);
  };

  const configJson = useMemo(() => JSON.stringify(config), [config]);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [confirmedSubmit, setConfirmedSubmit] = useState(false);
  const confirmedSubmitRef = useRef(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useDeferredEffect(() => {
    if (!pending) {
      setConfirmedSubmit(false);
      confirmedSubmitRef.current = false;
    }
  }, [pending]);

  const templateLabel = useMemo(() => {
    const found = templateCards.find((c) => c.id === templateId);
    return found?.label ?? templateId;
  }, [templateCards, templateId]);

  const themeLabel = useMemo(() => {
    const found = templateThemes.find((t) => t.id === themeId);
    return found?.title ?? themeId;
  }, [templateThemes, themeId]);

  const hostLabel = useMemo(() => {
    const hosts = config.sections.hosts.hosts;
    const primary = hosts[0]?.firstName || hosts[0]?.fullName || "";
    const secondary = hosts[1]?.firstName || hosts[1]?.fullName || "";
    if (primary && secondary) return `${primary} & ${secondary}`;
    return primary || secondary || "";
  }, [config.sections.hosts.hosts]);

  const firstEvent = config.sections.event.events[0];

  const firstEventSummary = useMemo(() => {
    const first = firstEvent;
    if (!first) return null;

    const dt = coerceInvitationDateTime((first as { date?: unknown }).date);
    const dateText = dt?.date
      ? `${dt.date.year}-${pad2(dt.date.month)}-${pad2(dt.date.day)}`
      : "";
    const timeText = dt?.time
      ? `${pad2(dt.time.hour)}:${pad2(dt.time.minute)}`
      : "";
    const title = (first as { title?: string } | null)?.title ?? "";
    const venue = (first as { venue?: string } | null)?.venue ?? "";

    return {
      title,
      venue,
      dateText,
      timeText,
    };
  }, [firstEvent]);

  const validateBeforeReview = (): string | null => {
    const nextFieldErrors: FieldErrors = {};
    let globalError: string | null = null;

    if (!templateId) globalError = "Ship Template is required.";
    const hosts = config.sections.hosts.hosts;
    const hasHostName = Boolean(
      (hosts[0]?.firstName || hosts[0]?.fullName || "").trim() ||
      (hosts[1]?.firstName || hosts[1]?.fullName || "").trim(),
    );

    if (asBoolean(config.sections.hosts.enabled)) {
      if (!hosts.length || !hasHostName) {
        globalError = "At least 1 host name is required.";
      }

      hosts.forEach((h, idx) => {
        const photo = (h?.photo ?? "").trim();
        if (!photo) {
          nextFieldErrors.hostPhotoByIndex = nextFieldErrors.hostPhotoByIndex ?? {};
          nextFieldErrors.hostPhotoByIndex[idx] = "Foto host wajib diisi.";
        }
      });
    }

    const musicTitle = (config.music.title ?? "").trim();
    if (!musicTitle) {
      nextFieldErrors.musicTitle = "Judul musik wajib diisi.";
    }

    const musicUrl = (config.music.url ?? "").trim();
    if (!musicUrl) {
      nextFieldErrors.musicUrl = "URL audio wajib diisi.";
    } else {
      const urlError = validateHttpUrl(musicUrl);
      if (urlError) nextFieldErrors.musicUrl = urlError;
    }

    if (asBoolean(config.sections.hero.enabled)) {
      const coverImage = (config.sections.hero.coverImage ?? "").trim();
      if (!coverImage) {
        nextFieldErrors.coverImage = "Gambar cover wajib diisi.";
      }
    }

    if (asBoolean(config.sections.event.enabled)) {
      const first = config.sections.event.events[0] as { date?: unknown };
      const dt = coerceInvitationDateTime(first?.date);
      if (!dt?.date?.year) globalError = "First event date is required.";
    }

    setFieldErrors(nextFieldErrors);

    const hasFieldError = Boolean(
      nextFieldErrors.musicTitle ||
        nextFieldErrors.musicUrl ||
        nextFieldErrors.coverImage ||
        (nextFieldErrors.hostPhotoByIndex &&
          Object.keys(nextFieldErrors.hostPhotoByIndex).length > 0),
    );
    if (hasFieldError && !globalError) {
      globalError = "Mohon lengkapi semua field yang wajib.";
    }

    return globalError;
  };

  const invitationUrl =
    state.invitationUrl ??
    (state.slug ? `https://invitation.activid.id/${state.slug}` : "");

  const affiliateSummaryText = useMemo(() => {
    if (affiliateAttribution) {
      const name = (affiliateAttribution.name ?? "").trim();
      if (name) {
        return `${name} (${affiliateAttribution.id})`;
      }
      return `(${affiliateAttribution.id})`;
    }

    if (isEditMode && existingAffiliateId) {
      return `(${existingAffiliateId})`;
    }

    if (!isEditMode && affiliateCookieId) {
      return `Kode afiliasi ${affiliateCookieId} terdeteksi, tetapi affiliator tidak ditemukan / tidak aktif (tidak ada komisi).`;
    }

    return "Tidak terhubung ke affiliator manapun.";
  }, [affiliateAttribution, affiliateCookieId, existingAffiliateId, isEditMode]);
  const whatsappMessages = useMemo(() => {
    if (!state.ok || !invitationUrl) return [];
    const who = hostLabel || "kami";
    return [
      {
        key: "formal",
        title: "Formal",
        text: `Assalamu'alaikum / Salam sejahtera.\n\nDengan hormat, kami ${who} mengundang Anda untuk hadir dan menyaksikan momen spesial kami.\n\nSilakan akses undangan digital melalui tautan berikut:\n${invitationUrl}\n\nTerima kasih.`,
      },
      {
        key: "warm",
        title: "Hangat",
        text: `Halo!\n\nKami ${who} punya kabar bahagia. Kami ingin mengundang kamu untuk ikut merayakan bersama.\n\nDetail lengkap ada di link ini ya:\n${invitationUrl}\n\nSampai ketemu!`,
      },
      {
        key: "short",
        title: "Singkat",
        text: `Undangan dari ${who}:\n${invitationUrl}`,
      },
    ];
  }, [hostLabel, invitationUrl, state.ok]);

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1200);
    } catch {
      setCopiedKey(null);
    }
  };

  if (!isUnlocked) {
    return (
      <form action={verifyAction} className="grid gap-6">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="text-xl font-black tracking-tight bg-linear-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent relative z-10">
            Command Station Access
          </div>

          {verifyState.error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 relative z-10">
              {verifyState.error}
            </div>
          ) : null}

          <div className="relative z-10 grid gap-4">
            <TextInput
              label="Affiliate ID"
              value={affiliateId}
              type="text"
              onChange={setAffiliateId}
            />
            <TextInput
              label="Password"
              value={password}
              type="password"
              onChange={setPassword}
            />
          </div>
          <input type="hidden" name="affiliateId" value={affiliateId} />
          <input type="hidden" name="password" value={password} />

          <button
            type="submit"
            disabled={verifying}
            className="mt-2 relative z-10 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-400/40 px-6 py-3 text-sm font-black uppercase tracking-wider text-indigo-100 hover:bg-indigo-500/30 hover:border-indigo-300/70 transition-all disabled:opacity-60 disabled:hover:bg-indigo-500/20 disabled:hover:border-indigo-400/40"
          >
            {verifying ? "Verifying..." : "Unlock Access"}
          </button>
        </div>
      </form>
    );
  }

  if (state.ok && state.slug && invitationUrl) {
    return (
      <div className="grid gap-6 relative">
        {/* Galaxy Background Elements */}
        <div className="absolute -inset-10 overflow-hidden pointer-events-none rounded-[3rem] z-0">
          <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute bottom-0 right-1/4 w-[25rem] h-[25rem] bg-fuchsia-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen" />
          {/* Floating Stars */}
          <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-indigo-200 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[20%] left-[30%] w-2 h-2 bg-fuchsia-200 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="absolute bottom-[40%] right-[25%] w-1 h-1 bg-cyan-200 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
        </div>

        <div className="grid gap-5 rounded-3xl border border-indigo-500/30 bg-[#05050a]/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)] relative z-10 overflow-hidden">
          <div className="flex flex-col items-center text-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <span className="text-3xl text-white">✨</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight bg-linear-to-r from-indigo-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              {isEditMode ? "Undangan Berhasil Diperbarui" : "Undangan Berhasil Dibuat"}
            </div>
            <div className="text-sm text-indigo-200/70 max-w-md">
              Misi selesai. Undangan Anda sekarang mengorbit di galaksi dan siap dibagikan.
            </div>
          </div>

          <div className="grid gap-4 mt-4">
            <div className="rounded-2xl border border-indigo-500/20 bg-black/40 p-4 hover:border-indigo-400/40 transition-colors">
              <div className="text-[11px] font-mono text-indigo-300/50 uppercase tracking-wider mb-1">
                Slug ID
              </div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span className="text-indigo-400">#</span>{state.slug}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-black/40 p-4 hover:border-indigo-400/40 transition-colors">
              <div className="text-[11px] font-mono text-indigo-300/50 uppercase tracking-wider mb-1">
                Afiliasi
              </div>
              {visibleStateAffiliateId ? (
                <div className="text-sm text-indigo-100/90">
                  <span className="font-black text-white">
                    {state.affiliateName?.trim() || "(Tanpa nama)"}
                  </span>{" "}
                  <span className="font-mono text-indigo-300/70">({visibleStateAffiliateId})</span>
                </div>
              ) : (
                <div className="text-sm text-amber-200/80 bg-amber-500/10 inline-block px-3 py-1 rounded-lg border border-amber-500/20">
                  Tidak terhubung ke affiliator manapun (tidak ada komisi).
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-indigo-500/20 bg-black/40 p-5 hover:border-indigo-400/40 transition-colors">
              <div className="text-[11px] font-mono text-indigo-300/50 uppercase tracking-wider mb-2">
                Link Undangan
              </div>
              <div className="break-all text-sm font-mono text-white/90 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20">
                {invitationUrl}?to=NAMA_UNDANGAN
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-xs font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/60 transition-all"
                  onClick={() => void copyText("link", (invitationUrl+"?to=NAMA_UNDANGAN"))}
                >
                  {copiedKey === "link" ? "Copied" : "Copy Link"}
                </button>
                <a
                  href={invitationUrl+"?to=NAMA_UNDANGAN"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-[2] inline-flex items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 px-4 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.7)] transition-all"
                >
                  Buka Undangan 🚀
                </a>
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  onClick={() => window.location.reload()}
                >
                  {isEditMode ? "Reload" : "Buat Baru"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 relative z-10">
          <div className="text-sm font-black tracking-tight text-indigo-200 px-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" /> WhatsApp Messages
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatsappMessages.map((m) => {
              return (
                <div
                  key={m.key}
                  className="flex min-w-0 flex-col gap-3 rounded-3xl border border-indigo-500/20 bg-black/40 backdrop-blur-md p-5 hover:border-indigo-400/40 transition-colors shadow-[0_0_30px_-12px_rgba(99,102,241,0.15)] group"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="min-w-0 flex-1 truncate text-xs font-black uppercase tracking-wider text-indigo-300">
                      {m.title}
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-200 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/60 transition-all"
                      onClick={() => void copyText(m.key, m.text)}
                    >
                      {copiedKey === m.key ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-xl border border-white/5 bg-black/50 p-4 text-[12px] leading-relaxed text-indigo-100/70 font-mono">
                    {m.text}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-6"
      onSubmit={(e) => {
        if (confirmedSubmitRef.current || confirmedSubmit) return;

        if (requiresAffiliateAcknowledgement && !affiliateAcknowledged) {
          e.preventDefault();
          setClientError(
            "Cookie afiliasi tidak terdeteksi. Undangan ini tidak akan mendapatkan komisi kecuali Anda mengakui dan melanjutkan.",
          );
          setAffiliateAckModalOpen(true);
          return;
        }

        e.preventDefault();
        const err = validateBeforeReview();
        setClientError(err);
        if (!err) setReviewOpen(true);
      }}
    >
      {isEditMode ? (
        <input type="hidden" name="existingSlug" value={slug} />
      ) : null}
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="templateId" value={templateId} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="configJson" value={configJson} />
      {requiresAffiliateAcknowledgement ? (
        <input
          type="hidden"
          name="affiliateAcknowledged"
          value={affiliateAcknowledged ? "1" : ""}
        />
      ) : null}

      {pending && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05050a]/90 backdrop-blur-md p-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-sm text-center rounded-3xl border border-indigo-500/20 bg-black/50 backdrop-blur-xl p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.4)]">
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-transparent border-t-indigo-400 border-l-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-transparent border-r-fuchsia-400 border-b-fuchsia-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2.5s' }} />
              <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-400 border-r-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
              <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_#fff]" />
            </div>
            <div className="grid gap-2">
              <div className="text-xl font-black bg-linear-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-transparent tracking-tight">
                {isEditMode ? "Memperbarui Undangan..." : "Membuat Undangan..."}
              </div>
              <div className="text-sm text-indigo-200/60 font-medium">
                Mohon tunggu sebentar. Mengirim transmisi ke ruang angkasa... 🚀
              </div>
            </div>
          </div>
        </div>
      )}

      {affiliateAckModalOpen &&
      requiresAffiliateAcknowledgement &&
      !affiliateAcknowledged ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:items-center">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative w-full max-w-xl rounded-3xl border border-amber-500/25 bg-black/40 backdrop-blur-md p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-6 shadow-[0_0_70px_-15px_rgba(245,158,11,0.35)]">
            <div className="grid gap-4">
              <div className="text-xs font-mono uppercase tracking-[0.22em] text-amber-200/70">
                Atribusi afiliasi
              </div>
              <div className="text-lg font-black tracking-tight text-white">
                Link Afiliasi Tidak Terdeteksi
              </div>
              <div className="text-sm text-white/75 leading-relaxed">
                Pendaftaran dari{" "}
                <span className="font-mono text-white/90">
                  /invitation/register
                </span>{" "}
                tanpa link afiliasi tidak akan mendapat komisi.
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={affiliateAcknowledgedChecked}
                  onChange={(e) =>
                    setAffiliateAcknowledgedChecked(e.target.checked)
                  }
                />
                <span>
                  Saya mengerti dan ingin melanjutkan.
                </span>
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:border-white/25"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
                <Link
                  href="/invitation"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:border-white/25"
                >
                  Kembali ke halaman utama
                </Link>
                <button
                  type="button"
                  disabled={!affiliateAcknowledgedChecked}
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-amber-500/40 via-orange-500/35 to-yellow-500/35 border border-amber-300/40 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-50 hover:border-amber-200/70 disabled:opacity-50"
                  onClick={() => {
                    setAffiliateAcknowledged(true);
                    setAffiliateAckModalOpen(false);
                  }}
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-6 shadow-[0_0_40px_-10px_rgba(79,70,229,0.15)] relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />

        <div className="text-xl font-black tracking-tight bg-linear-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent relative z-10 flex items-center gap-3">
          <span className="text-xl">🚀</span>{" "}
          {isEditMode ? "Edit Undangan" : "Buat Undangan Baru"}
        </div>

        {affiliateAttribution ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 relative z-10">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-emerald-200/70">
              Afiliasi terdeteksi
            </div>
            <div className="mt-1 leading-relaxed">
              Undangan ini akan diakreditasikan ke affiliator berikut:
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="text-xs font-black text-white">
                  {affiliateAttribution.name?.trim() || "(Tanpa nama)"}
                </div>
                <div className="text-[11px] font-mono text-white/70">
                  {affiliateAttribution.id}
                </div>
              </div>
            </div>
          </div>
        ) : !isEditMode && affiliateCookieId ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 relative z-10">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-200/70">
              Kode afiliasi tidak aktif
            </div>
            <div className="mt-1 leading-relaxed">
              Kode afiliasi <span className="font-mono font-bold">{affiliateCookieId}</span> terdeteksi, tetapi
              affiliator tidak ditemukan / tidak aktif. Undangan ini tidak akan mendapatkan komisi.
            </div>
          </div>
        ) : null}

        {requiresAffiliateAcknowledgement ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 relative z-10">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-amber-200/70">
              Tanpa afiliasi
            </div>
            <div className="mt-1 leading-relaxed">
              ! Pembuatan undangan ini tidak menggunakan affiliate link. Hasil
              undangan ini tidak akan diberikan komisi. Untuk mendapatkan komisi
              silahkan kunjungi link utama undangan activid dengan kode unik
              affiliate anda,{" "}
              <span className="font-bold">
                invitation.activid.id/KODE_AFILIASI
              </span>
            </div>
          </div>
        ) : null}

        {state.error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 relative z-10">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-red-200/70">
              Gagal menyimpan undangan
            </div>
            <div className="mt-1 leading-relaxed">{state.error}</div>
          </div>
        ) : null}

        {clientError ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 relative z-10 fixed bottom-0 left-0 right-0 p-4">
            {clientError}
          </div>
        ) : null}

        <div className="grid gap-4 relative z-10 sm:grid-cols-2">

         
           <div className="rounded-2xl border border-emerald-600/10 bg-emerald-500/20 p-4">
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                slug id
              </div>
              <div className="mt-1 text-lg font-black tracking-tight text-white">
                {slug}
              </div>
            </div>

          <div className="grid gap-2 text-sm sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-indigo-200/70 font-medium tracking-wide">
                Template undangan
              </span>
              <span className="text-[11px] font-mono text-white/40">
                {templatePosition.current}/{templatePosition.total}
              </span>
            </div>
            <div
              ref={templateScrollerRef}
              className={`-mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-3 overflow-x-auto pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                templateDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "pan-y" }}
              onScroll={handleTemplateScrollerScroll}
              onPointerDown={handleTemplateScrollerPointerDown}
              onPointerMove={handleTemplateScrollerPointerMove}
              onPointerUp={handleTemplateScrollerPointerEnd}
              onPointerCancel={handleTemplateScrollerPointerEnd}
              onPointerLeave={handleTemplateScrollerPointerEnd}
            >
              {templateCards.map((card) => {
                const selected = card.id === templateId;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`shrink-0 w-36 rounded-2xl border bg-[#0b0b16]/70 overflow-hidden text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                      selected
                        ? "border-indigo-400/70 shadow-[0_0_20px_-8px_rgba(99,102,241,0.5)]"
                        : "border-white/10 hover:border-indigo-500/50"
                    }`}
                    onClick={() => {
                      if (templateIgnoreClickRef.current) {
                        templateIgnoreClickRef.current = false;
                        return;
                      }
                      handleTemplateChange(card.id);
                    }}
                    aria-pressed={selected}
                  >
                    <div className="relative aspect-[4/5] bg-black/20">
                      {card.video ? (
                        <video
                          src={card.video}
                          aria-label={card.label}
                          className="h-full w-full object-cover grayscale-[0.6]"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/5" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-[#020205]/70 via-black/10 to-transparent" />
                      {selected ? (
                        <div className="absolute top-2 right-2 rounded-full border border-indigo-400/40 bg-indigo-500/15 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-100">
                          Selected
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-1 p-2">
                      <div className="text-sm font-black tracking-tight text-white">
                        {card.label}
                      </div>
                      <div className="text-sm font-black tracking-tight text-white/90">
                        {card.priceDiscount || "-"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-indigo-200/70 font-medium tracking-wide">
                Kombinasi Warna
              </span>
              <span className="text-[11px] font-mono text-white/40">
                {themePosition.current}/{themePosition.total}
              </span>
            </div>
            <div
              ref={themeScrollerRef}
              className={`-mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-3 overflow-x-auto pb-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                themeDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ touchAction: "pan-y" }}
              onScroll={handleThemeScrollerScroll}
              onPointerDown={handleThemeScrollerPointerDown}
              onPointerMove={handleThemeScrollerPointerMove}
              onPointerUp={handleThemeScrollerPointerEnd}
              onPointerCancel={handleThemeScrollerPointerEnd}
              onPointerLeave={handleThemeScrollerPointerEnd}
            >
              {templateThemes.map((theme) => {
                const selected = theme.id === themeId;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`shrink-0 min-w-[11rem] rounded-2xl border bg-[#0b0b16]/70 px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                      selected
                        ? "border-indigo-400/70 shadow-[0_0_20px_-8px_rgba(99,102,241,0.5)]"
                        : "border-white/10 hover:border-indigo-500/50"
                    }`}
                    onClick={() => {
                      if (themeIgnoreClickRef.current) {
                        themeIgnoreClickRef.current = false;
                        return;
                      }
                      handleThemeChange(theme);
                    }}
                    aria-pressed={selected}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex shrink-0 items-center overflow-hidden rounded-full border border-white/15">
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.mainColor }}
                        />
                        <span
                          aria-hidden
                          className="h-6 w-6"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-black tracking-tight text-white">
                          {theme.title}
                        </span>
                      </span>

                      {selected ? (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[13px] font-black text-indigo-200">
                          ✓
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="text-indigo-200/70 font-medium tracking-wide">
              Tipe Undangan
            </span>
            <select
              name="purpose"
              className="rounded-xl border border-white/10 bg-[#0b0b16]/80 px-3 py-2 text-white outline-none focus:border-indigo-500/60 transition-colors"
              value={purpose}
              disabled={templateId === "kids-birthday"}
              onChange={(e) =>
                handlePurposeChange(
                  e.target.value as "marriage" | "birthday" | "event",
                )
              }
            >
              <option value="marriage">Marriage</option>
              <option value="birthday">Birthday</option>
              <option value="event">Other Event</option>
            </select>
          </label>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              "0 0 0 0 rgba(16,185,129,0.00)",
              "0 0 34px -14px rgba(16,185,129,0.40)",
              "0 0 0 0 rgba(16,185,129,0.00)",
            ],
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeOut" },
            y: { duration: 0.5, ease: "easeOut" },
            boxShadow: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="grid gap-4 rounded-2xl border border-emerald-400/15 bg-[#0b0b16]/60 p-4 sm:p-5 shadow-inner relative z-10"
        >
          <div className="text-sm font-black text-indigo-100 uppercase tracking-wide">
            Music
          </div>
          <div className="grid gap-4">
            <TextInput
              label="Judul Musik"
              value={config.music.title ?? ""}
              error={fieldErrors.musicTitle}
              onChange={(v) => {
                setFieldErrors((prev) => ({ ...prev, musicTitle: undefined }));
                setConfig((prev) => updateAtPath(prev, ["music", "title"], v));
              }}
            />
            <TextInput
              label="URL Audio"
              value={config.music.url}
              readOnly={Boolean(config.music.dropboxPath)}
              error={fieldErrors.musicUrl}
              note="Gunakan URL lengkap (http:// atau https://)."
              onChange={(v) => {
                setFieldErrors((prev) => ({ ...prev, musicUrl: undefined }));
                setConfig((prev) => updateAtPath(prev, ["music", "url"], v));
              }}
            />

            <div className="flex flex-wrap items-center gap-3">
              {!config.music.dropboxPath ? (
                <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-indigo-500/60">
                  {musicUploading
                    ? musicUploadProgress !== null
                      ? musicUploadProgress >= 99
                        ? "Finalizing..."
                        : `Uploading ${musicUploadProgress}%`
                      : "Uploading..."
                    : "Choose Audio"}
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    disabled={musicUploading || musicDeleting}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;

                      const validationError = validateAudioFile(file);
                      if (validationError) {
                        setMusicError(validationError);
                        return;
                      }

                      setMusicError(null);
                      setMusicUploading(true);
                      setMusicUploadProgress(0);

                      try {
                        const uploaded = await uploadToDropboxAudio({
                          file,
                          folderKey: config.imagekitFolderKey ?? "",
                          onProgress: (p) => setMusicUploadProgress(p),
                        });

                        setConfig((prev) => {
                          let next = updateAtPath(
                            prev,
                            ["music", "url"],
                            uploaded.url,
                          );
                          next = updateAtPath(
                            next,
                            ["music", "dropboxPath"],
                            uploaded.dropboxPath,
                          );
                          return next;
                        });

                        setFieldErrors((prev) => ({
                          ...prev,
                          musicUrl: undefined,
                        }));

                        updateUploadDraft(uploadDraftKey, (prev) => ({
                          ...prev,
                          music: {
                            url: uploaded.url,
                            dropboxPath: uploaded.dropboxPath,
                          },
                        }));
                      } catch (err) {
                        setMusicError(getErrorMessage(err));
                      } finally {
                        setMusicUploading(false);
                        setMusicUploadProgress(null);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="text-xs text-white/60">
                  Audio URL is locked (Dropbox-managed).
                </div>
              )}

              {config.music.url ? (
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-emerald-400/60 disabled:opacity-60"
                  disabled={musicUploading || musicDeleting}
                  onClick={() => {
                    void (async () => {
                      try {
                        await navigator.clipboard.writeText(config.music.url);
                        setMusicCopied(true);
                        window.setTimeout(() => setMusicCopied(false), 1200);
                      } catch {
                        setMusicCopied(false);
                      }
                    })();
                  }}
                >
                  {musicCopied ? "Copied" : "Copy Link"}
                </button>
              ) : null}

              {config.music.dropboxPath ? (
                <button
                  type="button"
                  className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:border-red-500/60 disabled:opacity-60"
                  disabled={musicUploading || musicDeleting}
                  onClick={async () => {
                    const path = config.music.dropboxPath;
                    if (!path) return;
                    setMusicError(null);
                    setMusicDeleting(true);
                    try {
                      await deleteDropboxAudio(path);
                      setConfig((prev) => {
                        let next = updateAtPath(
                          prev,
                          ["music", "dropboxPath"],
                          undefined,
                        );
                        next = updateAtPath(next, ["music", "url"], "");
                        return next;
                      });

                      updateUploadDraft(uploadDraftKey, (prev) => ({
                        ...prev,
                        music: undefined,
                      }));
                    } catch (err) {
                      setMusicError(getErrorMessage(err));
                    } finally {
                      setMusicDeleting(false);
                    }
                  }}
                >
                  {musicDeleting ? "Deleting..." : "Delete"}
                </button>
              ) : null}
            </div>

            {musicUploading && typeof musicUploadProgress === "number" ? (
              <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
                <div
                  className="h-full bg-indigo-500/60"
                  style={{
                    width: `${Math.max(0, Math.min(100, musicUploadProgress))}%`,
                  }}
                />
              </div>
            ) : null}

            {musicError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                {musicError}
              </div>
            ) : null}
          </div>
        </motion.div>

        <div className="grid gap-5 relative z-10">
          <SectionCard
            title="👋 Cover Pembuka / hero"
            enabled={asBoolean(config.sections.hero.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "hero", "enabled"],
                  v,
                );
                if (!v) {
                  setFieldErrors((prevErrors) => ({
                    ...prevErrors,
                    coverImage: undefined,
                  }));
                  next = updateAtPath(
                    next,
                    ["sections", "hero", "subtitle"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "hero", "coverImage"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextArea
                label="Subtitle (Greeting)"
                value={config.sections.hero.subtitle}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "hero", "subtitle"], v),
                  )
                }
              />
              <ImportantFieldWrap className="rounded-3xl border border-cyan-400/15 bg-cyan-500/5 p-3">
                <ImageUrlPicker
                  label="Cover Image"
                  value={config.sections.hero.coverImage}
                  note="Format: AVIF, WebP, JPG, PNG, APNG (maks 25MB)"
                  folderKey={config.imagekitFolderKey ?? ""}
                  fieldKey="hero-cover"
                  draftKey={uploadDraftKey}
                  onChange={(v) => {
                    setFieldErrors((prev) => ({ ...prev, coverImage: undefined }));
                    setConfig((prev) =>
                      updateAtPath(
                        prev,
                        ["sections", "hero", "coverImage"],
                        v,
                      ),
                    );
                  }}
                />
                {fieldErrors.coverImage ? (
                  <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                    {fieldErrors.coverImage}
                  </div>
                ) : null}
              </ImportantFieldWrap>
            </div>
          </SectionCard>

          <SectionCard
            title="🏷️ Judul Utama"
            enabled={asBoolean(config.sections.title.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "title", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "title", "heading"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.title.heading}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(prev, ["sections", "title", "heading"], v),
                )
              }
            />
          </SectionCard>

          <SectionCard
            title="⏳ Hitung Mundur"
            enabled={asBoolean(config.sections.countdown.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "countdown", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "countdown", "heading"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.countdown.heading}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(prev, ["sections", "countdown", "heading"], v),
                )
              }
            />
          </SectionCard>

          <SectionCard
            title="💬 Quote"
            enabled={asBoolean(config.sections.quote.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "quote", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(next, ["sections", "quote", "text"], "");
                  next = updateAtPath(
                    next,
                    ["sections", "quote", "author"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <TextArea
              label="Quote Text"
              value={config.sections.quote.text}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(prev, ["sections", "quote", "text"], v),
                )
              }
              rows={3}
            />
            <TextInput
              label="Author / Source"
              value={config.sections.quote.author}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(prev, ["sections", "quote", "author"], v),
                )
              }
            />
          </SectionCard>

          <SectionCard
            title="🧑‍🤝‍🧑 Hosts"
            enabled={asBoolean(config.sections.hosts.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) =>
                updateAtPath(prev, ["sections", "hosts", "enabled"], v),
              )
            }
          >
            {config.sections.hosts.hosts.map((host, idx) => (
              <div
                key={idx}
                className="grid gap-5 rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-4 sm:p-5 shadow-inner relative"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40 rounded-l-2xl" />
                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">
                    {`Host ${idx + 1}`}
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    disabled={config.sections.hosts.hosts.length <= 1}
                    onClick={() => {
                      const next = config.sections.hosts.hosts.filter(
                        (_, i) => i !== idx,
                      );
                      setHosts(next.length ? next : [host]);
                    }}
                  >
                    Hapus
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {HOST_FIELDS.map(([key, label]) =>
                    key === "photo" ? (
                      <div key={key} className="sm:col-span-2">
                        <ImportantFieldWrap className="rounded-3xl border border-cyan-400/10 bg-cyan-500/5 p-3">
                          <ImageUrlPicker
                            label={label}
                            value={host.photo}
                            note="Format: AVIF, WebP, JPG, PNG, APNG (maks 25MB)"
                            folderKey={config.imagekitFolderKey ?? ""}
                            fieldKey={`host-${idx}-photo`}
                            draftKey={uploadDraftKey}
                            onChange={(v) => {
                              setFieldErrors((prev) => {
                                if (!prev.hostPhotoByIndex?.[idx]) return prev;
                                const nextMap = {
                                  ...(prev.hostPhotoByIndex ?? {}),
                                };
                                delete nextMap[idx];
                                return { ...prev, hostPhotoByIndex: nextMap };
                              });
                              const next = [...config.sections.hosts.hosts];
                              next[idx] = { ...next[idx]!, photo: v };
                              setHosts(next);
                            }}
                          />
                          {fieldErrors.hostPhotoByIndex?.[idx] ? (
                            <div className="mt-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                              {fieldErrors.hostPhotoByIndex[idx]}
                            </div>
                          ) : null}
                        </ImportantFieldWrap>
                      </div>
                    ) : (
                      <TextInput
                        key={key}
                        label={label}
                        value={host[key]}
                        onChange={(v) => {
                          const next = [...config.sections.hosts.hosts];
                          next[idx] = { ...next[idx]!, [key]: v };
                          setHosts(next);
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                const emptyHost: Host = {
                  firstName: "",
                  fullName: "",
                  shortName: "",
                  role: "",
                  parents: "",
                  photo: "",
                };
                setHosts([...config.sections.hosts.hosts, emptyHost]);
              }}
            >
              + Add Host
            </button>
          </SectionCard>

          <SectionCard
            title="📖 Story"
            enabled={asBoolean(config.sections.story.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "story", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "story", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "story", "stories"],
                    [],
                  );
                }
                return next;
              })
            }
          >
            <TextInput
              label="Title"
              value={config.sections.story.heading}
              onChange={(v) =>
                setConfig((prev) =>
                  updateAtPath(prev, ["sections", "story", "heading"], v),
                )
              }
            />

            <div className="grid gap-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-indigo-100">
                  Story List
                </div>
              </div>

              <div className="grid gap-4 mt-2">
                {config.sections.story.stories.map((story, idx) => (
                  <div
                    key={idx}
                    className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-4 sm:p-5 shadow-inner"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">
                        Story {idx + 1}
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors"
                        onClick={() => {
                          const nextStories =
                            config.sections.story.stories.filter(
                              (_, i) => i !== idx,
                            );
                          setConfig((prev) =>
                            updateAtPath(
                              prev,
                              ["sections", "story", "stories"],
                              nextStories,
                            ),
                          );
                        }}
                      >
                        Remove
                      </button>
                    </div>
                    <DateInput
                      label="Date"
                      value={story.date}
                      onChange={(v) => {
                        const nextStories = [...config.sections.story.stories];
                        nextStories[idx] = {
                          ...nextStories[idx],
                          date: { ...v, time: { hour: 0, minute: 0 } },
                        };
                        setConfig((prev) =>
                          updateAtPath(
                            prev,
                            ["sections", "story", "stories"],
                            nextStories,
                          ),
                        );
                      }}
                    />
                    <TextArea
                      label="Description"
                      value={story.description}
                      onChange={(v) => {
                        const nextStories = [...config.sections.story.stories];
                        nextStories[idx] = {
                          ...nextStories[idx],
                          description: v,
                        };
                        setConfig((prev) =>
                          updateAtPath(
                            prev,
                            ["sections", "story", "stories"],
                            nextStories,
                          ),
                        );
                      }}
                      rows={3}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput
                        label="Story Title (optional)"
                        value={story.title ?? ""}
                        onChange={(v) => {
                          const nextStories = [
                            ...config.sections.story.stories,
                          ];
                          nextStories[idx] = { ...nextStories[idx], title: v };
                          setConfig((prev) =>
                            updateAtPath(
                              prev,
                              ["sections", "story", "stories"],
                              nextStories,
                            ),
                          );
                        }}
                      />
                      <TextInput
                        label="Image URL (optional)"
                        value={story.imageUrl ?? ""}
                        onChange={(v) => {
                          const nextStories = [
                            ...config.sections.story.stories,
                          ];
                          nextStories[idx] = {
                            ...nextStories[idx],
                            imageUrl: v,
                          };
                          setConfig((prev) =>
                            updateAtPath(
                              prev,
                              ["sections", "story", "stories"],
                              nextStories,
                            ),
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2 w-full"
                  onClick={() =>
                    setConfig((prev) =>
                      updateAtPath(
                        prev,
                        ["sections", "story", "stories"],
                        [
                          ...prev.sections.story.stories,
                          { date: createTodayDateTime(), description: "" },
                        ],
                      ),
                    )
                  }
                >
                  + Add Story
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="📅 Acara / Kegiatan"
            enabled={asBoolean(config.sections.event.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "event", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "event", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "event", "events"],
                    ensureEventList(prev.sections.event.events),
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-6 mt-2">
              <TextInput
                label="Title"
                value={config.sections.event.heading}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "event", "heading"], v),
                  )
                }
              />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-indigo-100">
                    Event List
                  </div>
                </div>

                <div className="grid gap-4">
                  {config.sections.event.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-4 sm:p-5 shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">
                          Event {idx + 1}
                        </div>
                        <button
                          type="button"
                          disabled={config.sections.event.events.length <= 1}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          onClick={() => {
                            const nextEvents =
                              config.sections.event.events.filter(
                                (_, i) => i !== idx,
                              );
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "event", "events"],
                                nextEvents as [EventDetail, ...EventDetail[]],
                              ),
                            );
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {EVENT_FIELDS.map(([field, fieldLabel]) => (
                          <div
                            key={field}
                            className={
                              field === "address" || field === "mapUrl"
                                ? "sm:col-span-2"
                                : ""
                            }
                          >
                            <TextInput
                              label={fieldLabel}
                              value={event[field]}
                              onChange={(v) => {
                                const nextEvents = [
                                  ...config.sections.event.events,
                                ];
                                nextEvents[idx] = {
                                  ...nextEvents[idx]!,
                                  [field]: v,
                                };
                                setConfig((prev) =>
                                  updateAtPath(
                                    prev,
                                    ["sections", "event", "events"],
                                    nextEvents as [
                                      EventDetail,
                                      ...EventDetail[],
                                    ],
                                  ),
                                );
                              }}
                            />
                          </div>
                        ))}

                        <DateInput
                          label="Date"
                          value={event.date}
                          onChange={(v) => {
                            const nextEvents = [
                              ...config.sections.event.events,
                            ];
                            nextEvents[idx] = { ...nextEvents[idx]!, date: v };
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "event", "events"],
                                nextEvents as [EventDetail, ...EventDetail[]],
                              ),
                            );
                          }}
                        />
                        <TimeInput
                          label="Time"
                          value={event.date}
                          onChange={(v) => {
                            const nextEvents = [
                              ...config.sections.event.events,
                            ];
                            nextEvents[idx] = { ...nextEvents[idx]!, date: v };
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "event", "events"],
                                nextEvents as [EventDetail, ...EventDetail[]],
                              ),
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2 w-full"
                    onClick={() => {
                      const nextEvents = [
                        ...config.sections.event.events,
                        {
                          title: "",
                          date: createTodayDateTime(),
                          venue: "",
                          address: "",
                          mapUrl: "",
                        },
                      ] as [EventDetail, ...EventDetail[]];
                      setConfig((prev) =>
                        updateAtPath(
                          prev,
                          ["sections", "event", "events"],
                          nextEvents,
                        ),
                      );
                    }}
                  >
                    + Add Event
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="🖼️ Gallery"
            enabled={asBoolean(config.sections.gallery.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "gallery", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "gallery", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "gallery", "photos"],
                    [],
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextInput
                label="Title"
                value={config.sections.gallery.heading}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "gallery", "heading"], v),
                  )
                }
              />
              <ImageUrlListPicker
                label="Gallery Photos"
                items={config.sections.gallery.photos}
                folderKey={config.imagekitFolderKey ?? ""}
                fieldKey="gallery-photo"
                draftKey={uploadDraftKey}
                onChange={(items) =>
                  setConfig((prev) =>
                    updateAtPath(
                      prev,
                      ["sections", "gallery", "photos"],
                      items,
                    ),
                  )
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="✅ RSVP / Konfirmasi"
            enabled={asBoolean(config.sections.rsvp.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "rsvp", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "rsvp", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "rsvp", "description"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "rsvp", "successMessage"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "rsvp", "alreadySubmittedMessage"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "rsvp", "seeYouMessage"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              {RSVP_FIELDS.map(([field, label]) => (
                <TextArea
                  key={field}
                  label={label}
                  value={config.sections.rsvp[field]}
                  onChange={(v) =>
                    setConfig((prev) =>
                      updateAtPath(prev, ["sections", "rsvp", field], v),
                    )
                  }
                  rows={2}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="🎁 Gift"
            enabled={asBoolean(config.sections.gift.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "gift", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "gift", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "gift", "description"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "gift", "bankAccounts"],
                    [],
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-6 mt-2">
              <TextInput
                label="Title"
                value={config.sections.gift.heading}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "gift", "heading"], v),
                  )
                }
              />
              <TextArea
                label="Description"
                value={config.sections.gift.description}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "gift", "description"], v),
                  )
                }
                rows={2}
              />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-indigo-100">
                    Bank Accounts / E-Wallet
                  </div>
                </div>
                <div className="grid gap-4">
                  {config.sections.gift.bankAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="grid gap-4 rounded-xl border border-white/10 bg-[#0b0b16]/60 p-4 sm:p-5 shadow-inner"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="text-sm font-black text-indigo-200 uppercase tracking-wider">
                          Account {idx + 1}
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold tracking-wide text-red-200 hover:bg-red-500/20 transition-colors"
                          onClick={() => {
                            const nextAccounts =
                              config.sections.gift.bankAccounts.filter(
                                (_, i) => i !== idx,
                              );
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "gift", "bankAccounts"],
                                nextAccounts,
                              ),
                            );
                          }}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput
                          label="Bank / Platform Name"
                          value={acc.bankName}
                          onChange={(v) => {
                            const nextAccounts = [
                              ...config.sections.gift.bankAccounts,
                            ];
                            nextAccounts[idx] = {
                              ...nextAccounts[idx],
                              bankName: v,
                            };
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "gift", "bankAccounts"],
                                nextAccounts,
                              ),
                            );
                          }}
                        />
                        <TextInput
                          label="Account Number"
                          value={acc.accountNumber}
                          onChange={(v) => {
                            const nextAccounts = [
                              ...config.sections.gift.bankAccounts,
                            ];
                            nextAccounts[idx] = {
                              ...nextAccounts[idx],
                              accountNumber: v,
                            };
                            setConfig((prev) =>
                              updateAtPath(
                                prev,
                                ["sections", "gift", "bankAccounts"],
                                nextAccounts,
                              ),
                            );
                          }}
                        />
                        <div className="sm:col-span-2">
                          <TextInput
                            label="Account Holder Name"
                            value={acc.accountHolder}
                            onChange={(v) => {
                              const nextAccounts = [
                                ...config.sections.gift.bankAccounts,
                              ];
                              nextAccounts[idx] = {
                                ...nextAccounts[idx],
                                accountHolder: v,
                              };
                              setConfig((prev) =>
                                updateAtPath(
                                  prev,
                                  ["sections", "gift", "bankAccounts"],
                                  nextAccounts,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-colors flex items-center justify-center gap-2 w-full"
                    onClick={() => {
                      const nextAccounts = [
                        ...config.sections.gift.bankAccounts,
                        { bankName: "", accountNumber: "", accountHolder: "" },
                      ];
                      setConfig((prev) =>
                        updateAtPath(
                          prev,
                          ["sections", "gift", "bankAccounts"],
                          nextAccounts,
                        ),
                      );
                    }}
                  >
                    + Add Account
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="📝 Ucapan"
            enabled={asBoolean(config.sections.wishes.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "wishes", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "wishes", "heading"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "wishes", "placeholder"],
                    "",
                  );
                  next = updateAtPath(
                    next,
                    ["sections", "wishes", "thankYouMessage"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <div className="grid gap-4 mt-2">
              <TextInput
                label="Title"
                value={config.sections.wishes.heading ?? ""}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "wishes", "heading"], v),
                  )
                }
              />
              <TextInput
                label="Placeholder Text"
                value={config.sections.wishes.placeholder ?? ""}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(
                      prev,
                      ["sections", "wishes", "placeholder"],
                      v,
                    ),
                  )
                }
              />
              <TextArea
                label="Thank You Message"
                value={config.sections.wishes.thankYouMessage ?? ""}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(
                      prev,
                      ["sections", "wishes", "thankYouMessage"],
                      v,
                    ),
                  )
                }
                rows={2}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="🙏 Ucapan Terimakasih"
            enabled={asBoolean(config.sections.gratitude.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "gratitude", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "gratitude", "message"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <div className="mt-2">
              <TextArea
                label="Message"
                value={config.sections.gratitude.message}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "gratitude", "message"], v),
                  )
                }
                rows={3}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="🔻 Footer"
            enabled={asBoolean(config.sections.footer.enabled)}
            onEnabledChange={(v) =>
              setConfig((prev) => {
                let next = updateAtPath(
                  prev,
                  ["sections", "footer", "enabled"],
                  v,
                );
                if (!v) {
                  next = updateAtPath(
                    next,
                    ["sections", "footer", "message"],
                    "",
                  );
                }
                return next;
              })
            }
          >
            <div className="mt-2">
              <TextArea
                label="Footer Message"
                value={config.sections.footer.message}
                onChange={(v) =>
                  setConfig((prev) =>
                    updateAtPath(prev, ["sections", "footer", "message"], v),
                  )
                }
                rows={3}
              />
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="sticky bottom-4 z-[70] grid gap-2 mt-4">
        <AnimatePresence>
          {clientError && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              className="rounded-2xl border border-amber-500/50 bg-amber-500/20 backdrop-blur-xl px-5 py-3.5 text-sm font-medium text-amber-100 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.4)] mx-auto w-full flex items-start gap-3"
            >
              <span className="text-xl leading-none">⚠️</span>
              <div className="pt-0.5">{clientError}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          disabled={
            pending ||
            (requiresAffiliateAcknowledgement && !affiliateAcknowledged)
          }
          className="rounded-2xl bg-linear-to-r from-green-500 via-emerald-500 to-cyan-500 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.7)] transition-all disabled:opacity-60 disabled:hover:shadow-none w-full"
          onClick={() => {
            if (requiresAffiliateAcknowledgement && !affiliateAcknowledged) {
              setClientError(
                "Cookie afiliasi tidak terdeteksi. Undangan ini tidak akan mendapatkan komisi kecuali Anda mengakui dan melanjutkan.",
              );
              setAffiliateAckModalOpen(true);
              return;
            }
            const err = validateBeforeReview();
            setClientError(err);
            if (!err) setReviewOpen(true);
          }}
        >
          {pending
            ? "Loading..."
            : isEditMode
              ? "Tinjau Update"
              : "Tinjau Undangan"}
        </button>
      </div>

      <AnimatePresence>
        {reviewOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/70"
              onClick={() => setReviewOpen(false)}
              aria-label="Close review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            <motion.div
              className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6 shadow-[0_0_60px_-15px_rgba(79,70,229,0.35)] overflow-hidden overflow-y-auto overscroll-contain"
              initial={{ opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.985 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="absolute -top-32 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-[70px] pointer-events-none" />
              <div className="relative z-10 grid gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Review Summary
                  </div>
                  <div className="mt-1 text-lg font-black tracking-tight text-white">
                    {isEditMode
                      ? "Review update undangan"
                      : "Review pembuatan undangan"}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:border-white/25"
                  onClick={() => setReviewOpen(false)}
                >
                  Kembali
                </button>
              </div>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0b0b16]/60 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Slug ID
                    </div>
                    <div className="mt-1 font-mono text-sm text-white/80 break-all">
                      {slug}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Purpose
                    </div>
                    <div className="mt-1 text-sm font-black text-white/90">
                      {purpose}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Template
                    </div>
                    <div className="mt-1 text-sm font-black text-white/90">
                      {templateLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Color Combination
                    </div>
                    <div className="mt-1 text-sm font-black text-white/90">
                      {themeLabel}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Hosts
                    </div>
                    <div className="mt-1 text-sm font-black text-white/90">
                      {hostLabel || "-"}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                      Afiliasi
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      {affiliateSummaryText}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="grid gap-2">
                  <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                    First Event
                  </div>
                  {firstEventSummary ? (
                    <div className="grid gap-1 text-sm text-white/85">
                      <div className="font-black text-white">
                        {firstEventSummary.title || "Event"}
                      </div>
                      <div className="text-white/80">
                        {firstEventSummary.dateText}
                        {firstEventSummary.timeText
                          ? ` • ${firstEventSummary.timeText}`
                          : ""}
                      </div>
                      <div className="text-white/70">
                        {firstEventSummary.venue || ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/60">-</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.55)] hover:shadow-[0_0_55px_-10px_rgba(217,70,239,0.7)] disabled:opacity-60"
                  disabled={pending}
                  onClick={() => {
                    setClientError(null);
                    setReviewOpen(false);
                    confirmedSubmitRef.current = true;
                    setConfirmedSubmit(true);
                    window.setTimeout(() => {
                      formRef.current?.requestSubmit();
                    }, 0);
                  }}
                >
                  {pending
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                      ? "Update Undangan"
                      : "Buat Undangan"}
                </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
