"use client";

import { KENANGAN_IMAGEKIT_URL_BASE } from "@/types/kenangan";
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

/** Published memory gallery grid. Enhanced photos ship pre-graded (plain img);
 *  originals are LUT-graded client-side with the same WebGL grader as the live
 *  feed, so both surfaces match (ADR-0007). */
export default function GalleryGrid({ photos }: { photos: KenanganGalleryPhoto[] }) {
  return (
    <div className="kk-feed-grid">
      {photos.map((photo) => (
        <figure key={photo.id} className="kk-feed-item">
          {photo.enhanced ? (
            <img src={displayUrl(photo.path)} alt="Foto kenangan" loading="lazy" decoding="async" />
          ) : (
            <GradedThumb src={displayUrl(photo.path)} lutId={photo.lutId} alt="Foto kenangan" />
          )}
          <a className="kk-download-link" href={downloadUrl(photo.path)}>
            Unduh
          </a>
        </figure>
      ))}
    </div>
  );
}
