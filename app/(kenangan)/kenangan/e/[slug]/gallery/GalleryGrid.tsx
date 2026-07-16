"use client";

import { useState } from "react";
import {
  KENANGAN_IMAGEKIT_URL_BASE,
  KENANGAN_ENHANCE_PRICE_IDR,
  kenanganAdminWaLink,
} from "@/types/kenangan";
import type { KenanganGalleryPhoto } from "@/lib/kenangan-event";
import GradedThumb from "../feed/GradedThumb";

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
  eventName,
}: {
  photos: KenanganGalleryPhoto[];
  eventName: string;
}) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

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
  }

  const waText =
    `Halo admin, saya ingin meningkatkan ${count} foto dengan AI di galeri ` +
    `"${eventName}". Total ${rupiah(total)}. Bagaimana cara pembayarannya?`;

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
                  {thumb}
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
        <div className="kk-sheet-scrim" onClick={() => setSheetOpen(false)}>
          <div className="kk-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="kk-sheet-grab" />
            <h3 className="kk-section-title" style={{ textAlign: "center" }}>Pembayaran</h3>
            <p className="kk-landing-note" style={{ textAlign: "center", marginTop: 2 }}>
              {count} foto akan ditingkatkan otomatis setelah pembayaran.
            </p>
            <div className="kk-sheet-summary">
              <span>{count} foto × {rupiah(KENANGAN_ENHANCE_PRICE_IDR)}</span>
              <span>{rupiah(total)}</span>
            </div>
            <p className="kk-landing-note" style={{ textAlign: "center" }}>
              Pembayaran mandiri (QRIS) segera hadir. Sementara ini, konfirmasi
              pilihanmu ke admin via WhatsApp.
            </p>
            <a className="kk-btn" href={kenanganAdminWaLink(waText)} target="_blank" rel="noopener noreferrer">
              Hubungi admin (WhatsApp)
            </a>
            <button type="button" className="kk-link-btn" style={{ marginTop: 10 }} onClick={() => setSheetOpen(false)}>
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
