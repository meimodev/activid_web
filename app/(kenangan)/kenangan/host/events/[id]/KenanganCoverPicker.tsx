"use client";

import { useEffect, useState } from "react";
import { KENANGAN_DEFAULT_COVERS } from "@/data/kenangan-covers";
import KkProgress from "@/app/(kenangan)/kenangan/KkProgress";
import KkSpinner from "@/app/(kenangan)/kenangan/KkSpinner";

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/webp", "image/jpeg", "image/png"]);
const INPUT_ACCEPT = "image/webp,image/jpeg,image/png";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Gagal mengunggah.";
}

async function optimizeWithTinyPng(file: File): Promise<File> {
  try {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/tinypng/optimize", { method: "POST", body: form });
    if (!res.ok) return file;
    const blob = await res.blob();
    if (!blob || blob.size === 0) return file;
    return new File([blob], file.name, { type: blob.type || file.type });
  } catch {
    return file;
  }
}

async function deleteUploaded(eventId: string | undefined, fileId: string): Promise<void> {
  try {
    await fetch("/api/kenangan/cover-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, fileId }),
    });
  } catch {
    // best-effort: an orphaned file is harmless, don't block the swap
  }
}

export default function KenanganCoverPicker({
  eventId,
  initialUrl,
}: {
  /** Absent on the create form (no event yet) → uploads land in the host's
   *  staging folder and the URL is saved when the event is created. */
  eventId?: string;
  initialUrl: string;
}) {
  // fileId is set only for a cover uploaded in THIS session; it drives
  // delete-on-replace. A default cover or a reload-persisted url has no fileId.
  const [value, setValue] = useState(initialUrl);
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => setImgError(false), [value, preview]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const busy = uploading;

  async function pickDefault(url: string) {
    if (busy) return;
    if (fileId) void deleteUploaded(eventId, fileId);
    setFileId(null);
    setError(null);
    setValue(url);
  }

  async function clear() {
    if (busy) return;
    if (fileId) void deleteUploaded(eventId, fileId);
    setFileId(null);
    setError(null);
    setValue("");
  }

  async function onFile(file: File) {
    const type = (file.type ?? "").toLowerCase();
    if (!ALLOWED_MIME.has(type)) {
      setError("Hanya gambar WebP, JPG, atau PNG yang diperbolehkan.");
      return;
    }
    if (file.size >= MAX_IMAGE_SIZE_BYTES) {
      setError("Ukuran gambar maksimal 25MB.");
      return;
    }

    const priorFileId = fileId;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError(null);
    setUploading(true);
    setOptimizing(true);
    setProgress(null);

    try {
      const optimized = await optimizeWithTinyPng(file);
      setOptimizing(false);
      setProgress(0);

      const authRes = await fetch("/api/kenangan/cover-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (!authRes.ok) throw new Error("Sesi berakhir. Muat ulang halaman lalu coba lagi.");
      const auth = await authRes.json();

      const form = new FormData();
      form.append("file", optimized, auth.fileName);
      form.append("fileName", auth.fileName);
      form.append("folder", auth.folder);
      form.append("useUniqueFileName", "true");
      form.append("token", auth.token);
      form.append("expire", String(auth.expire));
      form.append("signature", auth.signature);
      form.append("publicKey", auth.publicKey);

      const uploaded = await new Promise<{ url?: string; fileId?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");
        xhr.timeout = 45000;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              reject(new Error("Gagal mengunggah."));
            }
          } else {
            reject(new Error("Gagal mengunggah."));
          }
        };
        xhr.onerror = () => reject(new Error("Gagal mengunggah."));
        xhr.ontimeout = () => reject(new Error("Unggahan terlalu lama. Coba lagi."));
        xhr.send(form);
      });

      if (!uploaded.url) throw new Error("Gagal mengunggah.");

      // Upload succeeded → the previous session-uploaded file is now orphaned.
      if (priorFileId) void deleteUploaded(eventId, priorFileId);

      setValue(uploaded.url);
      setFileId(uploaded.fileId ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      setOptimizing(false);
      setProgress(null);
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
    }
  }

  const previewSrc = preview ?? value;

  return (
    <div className="kk-cover-picker">
      <input type="hidden" name="coverUrl" value={value} />

      <div className="kk-cover-preview">
        {previewSrc && !imgError ? (
          <img
            src={previewSrc}
            alt="Foto sampul"
            className="kk-landing-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="kk-cover-empty">Belum ada foto sampul</div>
        )}
        {uploading ? (
          <KkProgress value={progress ?? undefined} className="kk-cover-progress" />
        ) : null}
      </div>

      <div className="kk-cover-actions">
        <label className={`kk-btn kk-btn-ghost${busy ? " kk-btn-disabled" : ""}`}>
          {uploading ? (
            <>
              <KkSpinner />
              {optimizing ? "Mengoptimalkan…" : "Mengunggah…"}
            </>
          ) : value ? (
            "Ganti Foto"
          ) : (
            "Unggah Foto"
          )}
          <input
            type="file"
            accept={INPUT_ACCEPT}
            hidden
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void onFile(file);
            }}
          />
        </label>
        {value && !busy ? (
          <button type="button" className="kk-btn kk-btn-ghost" onClick={() => void clear()}>
            Hapus
          </button>
        ) : null}
      </div>

      <p className="kk-field-hint">Atau pilih sampul bawaan:</p>
      <div className="kk-cover-defaults">
        {KENANGAN_DEFAULT_COVERS.map((cover) => (
          <button
            key={cover.id}
            type="button"
            className="kk-cover-default"
            data-active={value === cover.url}
            disabled={busy}
            onClick={() => void pickDefault(cover.url)}
            aria-label={`Sampul ${cover.label}`}
          >
            <img src={cover.url} alt="" loading="lazy" />
            <span>{cover.label}</span>
          </button>
        ))}
      </div>

      {error ? <p className="kk-form-error" style={{ marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
