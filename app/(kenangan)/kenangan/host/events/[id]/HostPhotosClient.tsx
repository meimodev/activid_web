"use client";

import { useEffect, useState } from "react";
import { kenanganThumbUrl, KENANGAN_ENHANCE_PRICE_IDR } from "@/types/kenangan";
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
  paid?: boolean;
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
  tag: ["M20.6 13.4 11 3.8a2 2 0 0 0-1.4-.6H4a1 1 0 0 0-1 1v5.6a2 2 0 0 0 .6 1.4l9.6 9.6a2 2 0 0 0 2.8 0l4.6-4.6a2 2 0 0 0 0-2.8Z", "M7.5 7.5h.01"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
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
  isPublished,
  legacyUnlocked,
  initialPhotos,
  initialHasMore,
}: {
  eventId: string;
  // Post-close phase: the per-photo pay + enhance UI is offered.
  isPublished: boolean;
  // Legacy events with the retired flat unlock — treat every photo as paid.
  legacyUnlocked: boolean;
  initialPhotos: HostPhoto[];
  initialHasMore: boolean;
}) {
  const [photos, setPhotos] = useState<HostPhoto[]>(initialPhotos);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  // Photos whose payment the host just requested (optimistic "awaiting confirm").
  const [payingIds, setPayingIds] = useState<Set<string>>(new Set());
  // Batch pay: select several unpaid photos and order them in one go.
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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

  // The enhanced file arrives async via the Replicate webhook, so while any
  // photo is "pending" poll the first page and merge fresh copies in — this is
  // what flips "Meningkatkan…" to "Ditingkatkan" (or "Gagal") without a manual
  // reload. Existing photos are replaced in place; nothing is added or removed,
  // so pagination state stays intact.
  // ponytail: only the newest page refreshes — enhance on a "load more" page
  // still needs Muat Ulang; add an ids= filter to GET if that ever matters.
  const hasPending = photos.some((p) => p.enhanceState === "pending");
  useEffect(() => {
    if (!hasPending) return;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/kenangan/photos?${new URLSearchParams({ eventId })}`);
        if (!res.ok) return;
        const data = await res.json();
        const fresh = new Map((data.photos as HostPhoto[]).map((p) => [p.id, p]));
        setPhotos((prev) => prev.map((p) => fresh.get(p.id) ?? p));
      } catch {
        // transient poll failure — next tick retries
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [hasPending, eventId]);

  // Fire-and-track: the enhanced file arrives async via the Replicate webhook.
  // We flip the photo to "pending" optimistically; the poll above picks up
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

  // Per-photo pay (ADR-0008): creates a pending order. Admin confirms → the
  // photo's `paid` flag flips (host reloads to pick it up). Rp 3.000/foto.
  async function pay(photo: HostPhoto) {
    if (photo.paid || payingIds.has(photo.id)) return;
    setPayingIds((prev) => new Set(prev).add(photo.id));
    try {
      const res = await fetch("/api/kenangan/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, photoId: photo.id }),
      });
      if (!res.ok) throw new Error("pay");
    } catch {
      setPayingIds((prev) => {
        const next = new Set(prev);
        next.delete(photo.id);
        return next;
      });
      setErrorMsg("Gagal membuat pesanan. Coba lagi.");
    }
  }

  const isPaid = (photo: HostPhoto) => Boolean(photo.paid) || legacyUnlocked;
  const canSelectPhoto = (photo: HostPhoto) =>
    isPublished && !isPaid(photo) && !photo.enhancedPath && !payingIds.has(photo.id);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelect() {
    setSelectMode(false);
    setSelected(new Set());
  }

  // One order for every selected photo. Optimistically flip them to "awaiting
  // confirm"; admin confirmation sets `paid` (host reloads to pick it up).
  async function payBatch() {
    const ids = [...selected];
    if (ids.length === 0) return;
    setPayingIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
    exitSelect();
    try {
      const res = await fetch("/api/kenangan/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, photoIds: ids }),
      });
      if (!res.ok) throw new Error("pay");
    } catch {
      setPayingIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) next.delete(id);
        return next;
      });
      setErrorMsg("Gagal membuat pesanan. Coba lagi.");
    }
  }

  const selectTotal = selected.size * KENANGAN_ENHANCE_PRICE_IDR;
  const hasSelectable = photos.some(canSelectPhoto);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span className="kk-feed-count">{photos.length} foto dimuat</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isPublished && hasSelectable ? (
            <button type="button" className="kk-link-btn" onClick={selectMode ? exitSelect : () => setSelectMode(true)}>
              {selectMode ? "Batal" : "Pilih untuk dibayar"}
            </button>
          ) : null}
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
            const inSelect = selectMode && isPublished;
            const selectable = canSelectPhoto(photo);
            const chosen = selected.has(photo.id);
            return (
              <figure
                key={photo.id}
                className="kk-feed-item"
                data-dim={isHidden}
                data-selected={inSelect && chosen ? "" : undefined}
              >
                <button
                  type="button"
                  className="kk-feed-open"
                  onClick={() => {
                    if (inSelect) {
                      if (selectable) toggleSelect(photo.id);
                    } else {
                      setOpenId(photo.id);
                    }
                  }}
                  aria-label={inSelect ? (chosen ? "Batalkan pilihan" : "Pilih foto") : "Buka foto"}
                  aria-pressed={inSelect && selectable ? chosen : undefined}
                >
                  {badge ? (
                    <span
                      className="kk-photo-status"
                      data-status={photo.enhancedPath ? "enhanced" : photo.enhanceState}
                    >
                      {badge}
                    </span>
                  ) : null}
                  {inSelect && selectable ? (
                    <>
                      <span className="kk-gallery-price">{`Rp ${KENANGAN_ENHANCE_PRICE_IDR.toLocaleString("id-ID")}`}</span>
                      <span className="kk-gallery-check" aria-hidden="true">{chosen ? "✓" : ""}</span>
                    </>
                  ) : null}
                  <img src={kenanganThumbUrl(photo.originalPath)} alt="Foto tamu" loading="lazy" decoding="async" />
                </button>
                {inSelect ? null : (
                <figcaption className="kk-host-photo-bar">
                  {isPublished && !photo.enhancedPath ? (
                    isPaid(photo) ? (
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
                    ) : payingIds.has(photo.id) ? (
                      <button
                        type="button"
                        className="kk-photo-btn"
                        disabled
                        aria-label="Menunggu konfirmasi pembayaran"
                      >
                        <HostPhotoIcon name="clock" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="kk-photo-btn"
                        onClick={() => pay(photo)}
                        aria-label="Bayar Rp 3.000 untuk tingkatkan"
                      >
                        <HostPhotoIcon name="tag" />
                      </button>
                    )
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
                )}
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

      {selectMode && selected.size > 0 ? (
        <div className="kk-gallery-paybar">
          <div>
            <div className="kk-gallery-paybar-count">{selected.size} foto dipilih</div>
            <div className="kk-gallery-paybar-total">Rp {selectTotal.toLocaleString("id-ID")}</div>
          </div>
          <button type="button" className="kk-btn" onClick={payBatch}>
            Bayar Rp {selectTotal.toLocaleString("id-ID")}
          </button>
        </div>
      ) : null}

      <HostPhotoLightbox
        photos={photos}
        openId={openId}
        onOpenId={setOpenId}
        onClose={() => setOpenId(null)}
        isPublished={isPublished}
        isPaid={isPaid}
        payingIds={payingIds}
        onSetStatus={setStatus}
        onEnhance={enhance}
        onPay={pay}
      />
    </div>
  );
}
