"use client";

import { useState } from "react";
import {
  KENANGAN_IMAGEKIT_URL_BASE,
  KENANGAN_ENHANCE_PRICE_IDR,
  kenanganAdminWaLink,
} from "@/types/kenangan";
import type { KenanganGalleryPhoto } from "@/lib/kenangan-event";
import GradedThumb from "../feed/GradedThumb";
import KkCompareSlider from "@/app/(kenangan)/kenangan/KkCompareSlider";

// ponytail: same 800px display transform whether the file is enhanced (already
// server-graded) or an original (graded client-side). Only the grading path
// differs, not the size.
function displayUrl(path: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${path}?tr=w-800,q-80`;
}
function downloadUrl(path: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${path}?ik-attachment=true`;
}

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

/** Published memory gallery grid. Enhanced photos ship pre-graded (plain img);
 *  originals are LUT-graded client-side with the same WebGL grader as the live
 *  feed, so both surfaces match (ADR-0007).
 *
 *  Guest self-pay (ADR-0008): any visitor may select unpaid photos and enhance
 *  them at Rp 3.000 each — no identity. Checkout itself is the Phase-2 gateway,
 *  so "Lanjut" hands off to the admin via WhatsApp for now. */
export default function GalleryGrid({
  photos,
  slug,
  eventName,
}: {
  photos: KenanganGalleryPhoto[];
  slug: string;
  eventName: string;
}) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderError, setOrderError] = useState("");
  // Enhanced photo opened in the before/after compare overlay.
  const [compare, setCompare] = useState<KenanganGalleryPhoto | null>(null);

  const selectable = (p: KenanganGalleryPhoto) => !p.enhanced && !p.paid;
  const anySelectable = photos.some(selectable);
  const count = selected.size;
  const total = count * KENANGAN_ENHANCE_PRICE_IDR;

  function toggle(id: string) {
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
    setSheetOpen(false);
    setOrdered(false);
    setOrderError("");
  }

  // Manual-confirm (ADR-0008): create a pending guest order, then hand off to the
  // admin via WhatsApp to arrange the transfer. Admin confirms at the desk →
  // photos flip to paid and the enhance auto-enqueues.
  async function submitOrder() {
    if (submitting || count === 0) return;
    setSubmitting(true);
    setOrderError("");
    try {
      const res = await fetch("/api/kenangan/guest-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, photoIds: [...selected] }),
      });
      if (!res.ok) throw new Error("order");
      setOrdered(true);
    } catch {
      setOrderError("Gagal membuat pesanan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const waText =
    `Halo admin, saya sudah memesan peningkatan AI untuk ${count} foto di galeri ` +
    `"${eventName}" (total ${rupiah(total)}). Bagaimana cara pembayarannya?`;

  return (
    <div>
      {anySelectable ? (
        <div className="kk-gallery-enhance-cta">
          {selectMode ? (
            <button type="button" className="kk-link-btn" onClick={exitSelect}>
              Batal
            </button>
          ) : (
            <button
              type="button"
              className="kk-btn kk-btn-ghost"
              onClick={() => setSelectMode(true)}
            >
              ✨ Tingkatkan foto favoritmu — {rupiah(KENANGAN_ENHANCE_PRICE_IDR)}/foto
            </button>
          )}
          {selectMode ? (
            <p className="kk-landing-note" style={{ marginTop: 8 }}>
              Ketuk foto yang ingin ditingkatkan dengan AI.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="kk-feed-grid" style={{ marginTop: 12 }}>
        {photos.map((photo) => {
          const canSelect = selectMode && selectable(photo);
          const isSelected = selected.has(photo.id);
          const thumb = photo.enhanced ? (
            <img src={displayUrl(photo.path)} alt="Foto kenangan" loading="lazy" decoding="async" />
          ) : (
            <GradedThumb src={displayUrl(photo.path)} lutId={photo.lutId} alt="Foto kenangan" />
          );

          return (
            <figure
              key={photo.id}
              className="kk-feed-item"
              data-selected={canSelect && isSelected ? "" : undefined}
            >
              {canSelect ? (
                <button
                  type="button"
                  className="kk-gallery-select"
                  data-on={isSelected}
                  onClick={() => toggle(photo.id)}
                  aria-pressed={isSelected}
                  aria-label={isSelected ? "Batalkan pilihan" : "Pilih foto"}
                >
                  {thumb}
                  <span className="kk-gallery-price">{rupiah(KENANGAN_ENHANCE_PRICE_IDR)}</span>
                  <span className="kk-gallery-check" aria-hidden="true">
                    {isSelected ? "✓" : ""}
                  </span>
                </button>
              ) : (
                <>
                  {photo.enhanced && photo.originalPath && !selectMode ? (
                    // Enhanced photos open the before/after compare on tap.
                    // Stale cache entries without originalPath fall through to
                    // the plain thumb until the gallery cache revalidates.
                    <button
                      type="button"
                      className="kk-feed-open"
                      onClick={() => setCompare(photo)}
                      aria-label="Bandingkan dengan foto asli"
                    >
                      {thumb}
                    </button>
                  ) : (
                    thumb
                  )}
                  {selectMode && photo.enhanced ? (
                    <span className="kk-photo-status" data-status="enhanced">Ditingkatkan</span>
                  ) : selectMode && photo.paid ? (
                    <span className="kk-photo-status">Sudah dibeli</span>
                  ) : null}
                  {!selectMode ? (
                    <a className="kk-download-link" href={downloadUrl(photo.path)}>
                      Unduh
                    </a>
                  ) : null}
                </>
              )}
            </figure>
          );
        })}
      </div>

      {selectMode && count > 0 ? (
        <div className="kk-gallery-paybar">
          <div>
            <div className="kk-gallery-paybar-count">{count} foto dipilih</div>
            <div className="kk-gallery-paybar-total">{rupiah(total)}</div>
          </div>
          <button type="button" className="kk-btn" onClick={() => setSheetOpen(true)}>
            Lanjut ke pembayaran
          </button>
        </div>
      ) : null}

      {sheetOpen ? (
        <div className="kk-sheet-scrim" onClick={() => (ordered ? exitSelect() : setSheetOpen(false))}>
          <div className="kk-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="kk-sheet-grab" />
            {ordered ? (
              <>
                <h3 className="kk-section-title" style={{ textAlign: "center" }}>Pesanan dibuat ✓</h3>
                <p className="kk-landing-note" style={{ textAlign: "center", marginTop: 2 }}>
                  Hubungi admin untuk menyelesaikan pembayaran. Foto ditingkatkan
                  otomatis setelah pembayaran dikonfirmasi.
                </p>
                <div className="kk-sheet-summary">
                  <span>{count} foto × {rupiah(KENANGAN_ENHANCE_PRICE_IDR)}</span>
                  <span>{rupiah(total)}</span>
                </div>
                <a className="kk-btn" href={kenanganAdminWaLink(waText)} target="_blank" rel="noopener noreferrer">
                  Hubungi admin (WhatsApp)
                </a>
                <button type="button" className="kk-link-btn" style={{ marginTop: 10 }} onClick={exitSelect}>
                  Selesai
                </button>
              </>
            ) : (
              <>
                <h3 className="kk-section-title" style={{ textAlign: "center" }}>Konfirmasi pesanan</h3>
                <p className="kk-landing-note" style={{ textAlign: "center", marginTop: 2 }}>
                  {count} foto akan ditingkatkan otomatis setelah pembayaran dikonfirmasi admin.
                </p>
                <div className="kk-sheet-summary">
                  <span>{count} foto × {rupiah(KENANGAN_ENHANCE_PRICE_IDR)}</span>
                  <span>{rupiah(total)}</span>
                </div>
                <p className="kk-landing-note" style={{ textAlign: "center" }}>
                  Pembayaran manual: buat pesanan, lalu hubungi admin untuk transfer.
                </p>
                {orderError ? <p className="kk-form-error">{orderError}</p> : null}
                <button type="button" className="kk-btn" disabled={submitting} onClick={submitOrder}>
                  {submitting ? "Memproses…" : `Buat pesanan (${rupiah(total)})`}
                </button>
                <button type="button" className="kk-link-btn" style={{ marginTop: 10 }} onClick={() => setSheetOpen(false)}>
                  Batal
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {compare?.originalPath ? (
        <div
          className="kk-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Perbandingan foto"
          onClick={() => setCompare(null)}
        >
          <div className="kk-lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span className="kk-lightbox-count">Asli vs Hasil AI</span>
            <div className="kk-lightbox-actions">
              <a
                href={downloadUrl(compare.path)}
                className="kk-lightbox-action"
                aria-label="Unduh foto"
              >
                Unduh
              </a>
              <button
                type="button"
                className="kk-lightbox-action"
                autoFocus
                onClick={() => setCompare(null)}
                aria-label="Tutup"
              >
                Tutup
              </button>
            </div>
          </div>
          <div className="kk-lightbox-stage" onClick={() => setCompare(null)}>
            <KkCompareSlider
              originalSrc={displayUrl(compare.originalPath)}
              enhancedSrc={displayUrl(compare.path)}
              alt="Foto kenangan"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
