"use client";

import { useEffect, useState } from "react";
import { kenanganThumbUrl } from "@/types/kenangan";
import KkProgress from "@/app/(kenangan)/kenangan/KkProgress";
import KkSpinner from "@/app/(kenangan)/kenangan/KkSpinner";
import HostPhotoLightbox from "./HostPhotoLightbox";

export type HostMode = "live" | "curate";

export interface HostPhoto {
  id: string;
  status: "live" | "hidden" | "keeper" | "enhanced" | "failed";
  originalPath: string;
  createdAtMs: number;
}

export const STATUS_LABELS: Record<string, string> = {
  live: "Tampil",
  hidden: "Disembunyikan",
  keeper: "Terpilih",
  enhanced: "Ditingkatkan",
  failed: "Gagal",
};

// Inline SVGs (feather-style), shared by the grid bar and the lightbox so the
// hide/keeper affordances read identically in both. star-filled paints; the
// rest are stroked outlines.
const ICON_PATHS: Record<string, string[]> = {
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"],
  "eye-off": [
    "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22",
    "M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.39-1.61",
  ],
  star: ["M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z"],
  "star-filled": ["M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2Z"],
};

export function HostPhotoIcon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg
      className="kk-photo-icon"
      viewBox="0 0 24 24"
      fill={name === "star-filled" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default function HostPhotosClient({
  eventId,
  mode,
}: {
  eventId: string;
  mode: HostMode;
}) {
  const [photos, setPhotos] = useState<HostPhoto[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  // Distinguishes a "load more" fetch from a reset/reload so only the pressed
  // button spins (both share `loading`).
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load(reset: boolean) {
    setLoading(true);
    if (!reset) setLoadingMore(true);
    setErrorMsg("");
    try {
      const cursor = !reset && photos.length > 0 ? photos[photos.length - 1].createdAtMs : null;
      const params = new URLSearchParams({ eventId });
      if (cursor) params.set("after", String(cursor));
      const res = await fetch(`/api/kenangan/photos?${params}`);
      if (!res.ok) throw new Error("load");
      const data = await res.json();
      setHasMore(Boolean(data.hasMore));
      setPhotos((prev) => {
        const base = reset ? [] : prev;
        const byId = new Map(base.map((p) => [p.id, p]));
        for (const photo of data.photos as HostPhoto[]) byId.set(photo.id, photo);
        return [...byId.values()].sort((a, b) => b.createdAtMs - a.createdAtMs);
      });
    } catch {
      setErrorMsg("Gagal memuat foto. Coba lagi.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function setStatus(photo: HostPhoto, status: "live" | "hidden" | "keeper") {
    const previous = photo.status;
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status } : p)));
    try {
      const res = await fetch("/api/kenangan/photos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, photoId: photo.id, status }),
      });
      if (!res.ok) throw new Error("patch");
    } catch {
      setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: previous } : p)));
      setErrorMsg("Perubahan gagal disimpan. Coba lagi.");
    }
  }

  const keeperCount = photos.filter((p) => p.status === "keeper").length;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span className="kk-feed-count">
          {photos.length} foto dimuat
          {mode === "curate" ? ` · ${keeperCount} terpilih` : ""}
        </span>
        <button type="button" className="kk-link-btn" onClick={() => load(true)} disabled={loading}>
          {loading && !loadingMore ? (
            <>
              <KkSpinner />
              Memuat…
            </>
          ) : (
            "Muat Ulang"
          )}
        </button>
      </div>
      {errorMsg ? <p className="kk-form-error">{errorMsg}</p> : null}

      {photos.length === 0 && loading ? (
        <KkProgress className="kk-load-progress" />
      ) : null}

      {photos.length === 0 && !loading ? (
        <p className="kk-status-msg">Belum ada foto.</p>
      ) : (
        <div className="kk-feed-grid" style={{ marginTop: 10 }}>
          {photos.map((photo) => {
            const isHidden = photo.status === "hidden";
            const canKeeper = mode === "curate" && !isHidden;
            const isKeeper = photo.status === "keeper";
            return (
              <figure key={photo.id} className="kk-feed-item" data-dim={isHidden}>
                <button
                  type="button"
                  className="kk-feed-open"
                  onClick={() => setOpenId(photo.id)}
                  aria-label="Buka foto"
                >
                  {/* Status pill on the photo — curation only, and only when it
                      isn't the resting "Tampil" state (would be noise on every tile). */}
                  {mode === "curate" && photo.status !== "live" ? (
                    <span className="kk-photo-status" data-status={photo.status}>
                      {STATUS_LABELS[photo.status] ?? photo.status}
                    </span>
                  ) : null}
                  <img src={kenanganThumbUrl(photo.originalPath)} alt="Foto tamu" loading="lazy" decoding="async" />
                </button>
                <figcaption className="kk-host-photo-bar">
                  {canKeeper ? (
                    <button
                      type="button"
                      className="kk-photo-btn"
                      data-on={isKeeper}
                      onClick={() => setStatus(photo, isKeeper ? "live" : "keeper")}
                      aria-label={isKeeper ? "Batal pilih" : "Pilih"}
                    >
                      <HostPhotoIcon name={isKeeper ? "star-filled" : "star"} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="kk-photo-btn"
                    onClick={() => setStatus(photo, isHidden ? "live" : "hidden")}
                    aria-label={isHidden ? "Tampilkan" : "Sembunyikan"}
                  >
                    <HostPhotoIcon name={isHidden ? "eye" : "eye-off"} />
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {hasMore ? (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button type="button" className="kk-btn kk-btn-ghost" onClick={() => load(false)} disabled={loading}>
            {loadingMore ? (
              <>
                <KkSpinner />
                Memuat…
              </>
            ) : (
              "Muat Lebih Banyak"
            )}
          </button>
        </div>
      ) : null}

      <HostPhotoLightbox
        photos={photos}
        openId={openId}
        onOpenId={setOpenId}
        onClose={() => setOpenId(null)}
        mode={mode}
        onSetStatus={setStatus}
      />
    </div>
  );
}
