"use client";

import { useState } from "react";
import { kenanganThumbUrl } from "@/types/kenangan";
import type { KenanganEnhanceState } from "@/types/kenangan";
import KkProgress from "@/app/(kenangan)/kenangan/KkProgress";
import KkSpinner from "@/app/(kenangan)/kenangan/KkSpinner";
import HostPhotoLightbox from "./HostPhotoLightbox";

export interface HostPhoto {
  id: string;
  status: "live" | "hidden";
  originalPath: string;
  enhancedPath?: string;
  enhanceState?: KenanganEnhanceState;
  createdAtMs: number;
}

// Inline SVGs (feather-style), shared by the grid bar and the lightbox so the
// hide/enhance affordances read identically in both.
const ICON_PATHS: Record<string, string[]> = {
  eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"],
  "eye-off": [
    "M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24",
    "M1 1l22 22",
    "M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.39-1.61",
  ],
  sparkles: ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"],
};

export function HostPhotoIcon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg
      className="kk-photo-icon"
      viewBox="0 0 24 24"
      fill="none"
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

/** Enhancement badge text for a photo, or null when there's nothing to show. */
export function enhanceBadge(photo: HostPhoto): string | null {
  if (photo.enhancedPath) return "Ditingkatkan";
  if (photo.enhanceState === "pending") return "Meningkatkan…";
  if (photo.enhanceState === "failed") return "Gagal";
  return null;
}

export default function HostPhotosClient({
  eventId,
  canEnhance,
  initialPhotos,
  initialHasMore,
}: {
  eventId: string;
  // True in the closed (published) phase for events that bought AI enhancement.
  canEnhance: boolean;
  initialPhotos: HostPhoto[];
  initialHasMore: boolean;
}) {
  const [photos, setPhotos] = useState<HostPhoto[]>(initialPhotos);
  const [hasMore, setHasMore] = useState(initialHasMore);
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

  async function setStatus(photo: HostPhoto, status: "live" | "hidden") {
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

  // Fire-and-track: the enhanced file arrives async via the Replicate webhook.
  // We flip the photo to "pending" optimistically; the host reloads to pick up
  // `enhancedPath` once it lands (host list isn't realtime — ADR-0007).
  async function enhance(photo: HostPhoto) {
    if (photo.enhancedPath || photo.enhanceState === "pending") return;
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, enhanceState: "pending" } : p)),
    );
    try {
      const res = await fetch("/api/kenangan/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, photoId: photo.id }),
      });
      if (!res.ok) throw new Error("enhance");
    } catch {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, enhanceState: "failed" } : p)),
      );
      setErrorMsg("Gagal memulai peningkatan. Coba lagi.");
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span className="kk-feed-count">{photos.length} foto dimuat</span>
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
            const badge = enhanceBadge(photo);
            return (
              <figure key={photo.id} className="kk-feed-item" data-dim={isHidden}>
                <button
                  type="button"
                  className="kk-feed-open"
                  onClick={() => setOpenId(photo.id)}
                  aria-label="Buka foto"
                >
                  {badge ? (
                    <span
                      className="kk-photo-status"
                      data-status={photo.enhancedPath ? "enhanced" : photo.enhanceState}
                    >
                      {badge}
                    </span>
                  ) : null}
                  <img src={kenanganThumbUrl(photo.originalPath)} alt="Foto tamu" loading="lazy" decoding="async" />
                </button>
                <figcaption className="kk-host-photo-bar">
                  {canEnhance && !photo.enhancedPath ? (
                    <button
                      type="button"
                      className="kk-photo-btn"
                      data-on={photo.enhanceState === "pending"}
                      disabled={photo.enhanceState === "pending"}
                      onClick={() => enhance(photo)}
                      aria-label="Tingkatkan dengan AI"
                    >
                      <HostPhotoIcon name="sparkles" />
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
        canEnhance={canEnhance}
        onSetStatus={setStatus}
        onEnhance={enhance}
      />
    </div>
  );
}
