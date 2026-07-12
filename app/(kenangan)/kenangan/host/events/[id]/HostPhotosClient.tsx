"use client";

import { useEffect, useState } from "react";
import { kenanganThumbUrl } from "@/types/kenangan";

type HostMode = "live" | "curate";

interface HostPhoto {
  id: string;
  status: "live" | "hidden" | "keeper" | "enhanced" | "failed";
  originalPath: string;
  createdAtMs: number;
}

const STATUS_LABELS: Record<string, string> = {
  live: "Tampil",
  hidden: "Disembunyikan",
  keeper: "Terpilih",
  enhanced: "Ditingkatkan",
  failed: "Gagal",
};

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
  const [errorMsg, setErrorMsg] = useState("");

  async function load(reset: boolean) {
    setLoading(true);
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
          {loading ? "Memuat…" : "Muat Ulang"}
        </button>
      </div>
      {errorMsg ? <p className="kk-form-error">{errorMsg}</p> : null}

      {photos.length === 0 && !loading ? (
        <p className="kk-status-msg">Belum ada foto.</p>
      ) : (
        <div className="kk-feed-grid" style={{ marginTop: 10 }}>
          {photos.map((photo) => (
            <figure key={photo.id} className="kk-feed-item" data-dim={photo.status === "hidden"}>
              <img src={kenanganThumbUrl(photo.originalPath)} alt="Foto tamu" loading="lazy" decoding="async" />
              <figcaption className="kk-host-photo-bar">
                <span className="kk-badge" data-status={photo.status === "keeper" ? "live" : undefined}>
                  {STATUS_LABELS[photo.status] ?? photo.status}
                </span>
                <span style={{ display: "flex", gap: 6 }}>
                  {mode === "curate" && photo.status !== "hidden" ? (
                    <button
                      type="button"
                      className="kk-link-btn"
                      onClick={() => setStatus(photo, photo.status === "keeper" ? "live" : "keeper")}
                    >
                      {photo.status === "keeper" ? "Batal" : "Pilih"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="kk-link-btn"
                    onClick={() => setStatus(photo, photo.status === "hidden" ? "live" : "hidden")}
                  >
                    {photo.status === "hidden" ? "Tampilkan" : "Sembunyikan"}
                  </button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {hasMore ? (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button type="button" className="kk-btn kk-btn-ghost" onClick={() => load(false)} disabled={loading}>
            Muat Lebih Banyak
          </button>
        </div>
      ) : null}
    </div>
  );
}
