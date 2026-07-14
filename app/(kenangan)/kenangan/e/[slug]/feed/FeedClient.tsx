"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { kenanganFullUrl, kenanganThumbUrl, type KenanganDownloadMode } from "@/types/kenangan";
import { isKenanganLutId, type KenanganLutId } from "@/data/kenangan-luts";
import GradedThumb from "./GradedThumb";
import Lightbox from "./Lightbox";

// No `where("status" == ...)` clause: equality + orderBy would demand a
// composite Firestore index. Order by createdAt only, filter status in code.
const LIVE_WINDOW = 50;
const PAGE_SIZE = 30;

interface FeedPhoto {
  id: string;
  src: string;
  // Full-res, inline-renderable (no attachment header) — graded in the lightbox.
  displaySrc: string;
  // Full-res download (ik-attachment forces save of the clean original).
  fullSrc: string;
  lutId: KenanganLutId;
  createdAtMs: number;
}

function toFeedPhoto(id: string, data: DocumentData): FeedPhoto | null {
  if (data.status !== "live") return null;
  const originalPath = typeof data.originalPath === "string" ? data.originalPath : "";
  if (!originalPath) return null;
  const createdAt = data.createdAt as Timestamp | null | undefined;
  return {
    id,
    src: kenanganThumbUrl(originalPath),
    displaySrc: kenanganFullUrl(originalPath),
    fullSrc: `${kenanganFullUrl(originalPath)}?ik-attachment=true`,
    lutId: isKenanganLutId(data.lutId) ? data.lutId : "natural",
    createdAtMs: createdAt ? createdAt.toMillis() : Date.now(),
  };
}

export default function FeedClient({
  eventId,
  eventName,
  slug,
  token,
  downloadMode,
}: {
  eventId: string;
  eventName: string;
  slug: string;
  token: string | null;
  downloadMode: KenanganDownloadMode;
}) {
  const [photos, setPhotos] = useState<FeedPhoto[]>([]);
  const [ready, setReady] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  // Stable so the lightbox's history-entry effect doesn't re-push on re-render.
  const closeLightbox = useCallback(() => setOpenId(null), []);

  const pendingRef = useRef<Map<string, FeedPhoto | null>>(new Map());
  const rafRef = useRef(0);
  const oldestDocRef = useRef<QueryDocumentSnapshot | null>(null);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Live window: onSnapshot buffered + flushed on rAF so a burst of uploads
  // (speeches, dance floor) re-renders once per frame, not once per photo.
  useEffect(() => {
    const photosRef = collection(db, "kenanganEvents", eventId, "photos");
    const liveQuery = query(photosRef, orderBy("createdAt", "desc"), limit(LIVE_WINDOW));

    const flush = () => {
      rafRef.current = 0;
      const pending = pendingRef.current;
      if (pending.size === 0) return;
      pendingRef.current = new Map();
      setPhotos((prev) => {
        const byId = new Map(prev.map((p) => [p.id, p]));
        for (const [id, photo] of pending) {
          if (photo === null) byId.delete(id);
          else byId.set(id, photo);
        }
        return [...byId.values()].sort((a, b) => b.createdAtMs - a.createdAtMs);
      });
    };

    const unsubscribe = onSnapshot(liveQuery, {
      error: (err) => {
        console.error("kenangan feed listener failed", err);
        setFailed(true);
      },
      next: (snapshot) => {
        for (const change of snapshot.docChanges()) {
          // "removed" here = evicted from the query window by newer docs; keep it.
          if (change.type === "removed") continue;
          const photo = toFeedPhoto(change.doc.id, change.doc.data());
          // null = not "live" (hidden by moderation) -> drop from the feed.
          pendingRef.current.set(change.doc.id, photo);
        }
        const last = snapshot.docs[snapshot.docs.length - 1];
        if (last && !oldestDocRef.current) oldestDocRef.current = last;
        setReady(true);
        if (!rafRef.current) rafRef.current = requestAnimationFrame(flush);
      },
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [eventId]);

  // Scroll-back pagination: append older photos past the live window.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || exhausted) return;

    const loadMore = async () => {
      const cursor = oldestDocRef.current;
      if (loadingMoreRef.current || !cursor) return;
      loadingMoreRef.current = true;
      try {
        const photosRef = collection(db, "kenanganEvents", eventId, "photos");
        const snap = await getDocs(
          query(photosRef, orderBy("createdAt", "desc"), startAfter(cursor), limit(PAGE_SIZE)),
        );
        if (snap.docs.length < PAGE_SIZE) setExhausted(true);
        const last = snap.docs[snap.docs.length - 1];
        if (last) oldestDocRef.current = last;
        const older: FeedPhoto[] = [];
        for (const doc of snap.docs) {
          const photo = toFeedPhoto(doc.id, doc.data());
          if (photo) older.push(photo);
        }
        if (older.length > 0) {
          setPhotos((prev) => {
            const byId = new Map(prev.map((p) => [p.id, p]));
            for (const photo of older) if (!byId.has(photo.id)) byId.set(photo.id, photo);
            return [...byId.values()].sort((a, b) => b.createdAtMs - a.createdAtMs);
          });
        }
      } finally {
        loadingMoreRef.current = false;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) void loadMore();
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [eventId, exhausted]);

  const tokenQuery = token ? `?t=${encodeURIComponent(token)}` : "";
  const canDownload = downloadMode === "instant_share";

  return (
    <main className="kk-page" style={{ paddingBottom: 110 }}>
      <p className="kk-brand">KenanganKita</p>
      <header className="kk-feed-header" style={{ marginTop: 20 }}>
        <h1 className="kk-feed-title">{eventName}</h1>
        <span className="kk-feed-count">{photos.length} foto</span>
      </header>

      {failed ? (
        <div className="kk-feed-empty">
          <p>Galeri tidak dapat dimuat.</p>
          <button
            type="button"
            className="kk-btn kk-btn-ghost"
            style={{ marginTop: 16 }}
            onClick={() => location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      ) : !ready ? (
        <div className="kk-feed-grid" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kk-feed-item kk-skeleton" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="kk-feed-empty">
          <p>Belum ada foto.</p>
          <p>Jadilah yang pertama mengabadikan momennya!</p>
        </div>
      ) : (
        <div className="kk-feed-grid">
          {photos.map((photo) => (
            <figure key={photo.id} className="kk-feed-item">
              {/* Tap opens the lightbox in both modes; download lives inside it. */}
              <button
                type="button"
                className="kk-feed-open"
                onClick={() => setOpenId(photo.id)}
                aria-label="Perbesar foto"
              >
                <GradedThumb src={photo.src} lutId={photo.lutId} alt="Foto tamu" />
              </button>
            </figure>
          ))}
        </div>
      )}

      {!exhausted ? <div ref={sentinelRef} style={{ height: 1 }} /> : null}

      <Lightbox
        photos={photos}
        openId={openId}
        onOpenId={setOpenId}
        onClose={closeLightbox}
        canDownload={canDownload}
      />

      {token ? (
        <Link href={`/kenangan/e/${slug}/capture${tokenQuery}`} className="kk-btn kk-btn-primary kk-feed-fab">
          Ambil Foto
        </Link>
      ) : null}
    </main>
  );
}
