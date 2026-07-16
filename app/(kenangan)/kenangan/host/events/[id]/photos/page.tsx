import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getKenanganEventById, listKenanganHostPhotos } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { isKenanganPublished } from "@/types/kenangan";
import HostPhotosClient from "../HostPhotosClient";

export const metadata: Metadata = { title: "Moderasi Foto" };

type Props = { params: Promise<{ id: string }> };

// Photo moderation/curation lives on its own route so opening the event's
// Kelola tab no longer mounts HostPhotosClient (and re-fetches every switch).
// The fetch happens only when the host actually enters this page.
export default async function KenanganHostPhotosPage({ params }: Props) {
  const [session, { id }] = await Promise.all([getKenanganHostSession(), params]);
  if (!session) redirect("/kenangan/host");

  const event = await getKenanganEventById(id);
  if (!event) notFound();
  if (!canAccessEvent(session, event.ownerUid)) redirect("/kenangan/host/events");

  // SSR the first page so photos ship in the initial HTML — no client fetch
  // waterfall, no redundant session-verify/event-read. Only meaningful when the
  // curation UI actually mounts (live or closed/published).
  const isPublished = isKenanganPublished(event.status);
  const showModeration = event.status === "live" || isPublished;
  const initial = showModeration
    ? await listKenanganHostPhotos(event.id)
    : { photos: [], hasMore: false };
  // Per-photo AI enhancement is offered after close; paying is per-photo
  // (ADR-0008). Legacy events with the retired flat unlock stay grandfathered.
  const legacyUnlocked = Boolean(event.enhancementPurchased);

  const backLink = (
    <Link href={`/kenangan/host/events/${event.id}`} className="kk-feed-count">
      ← Kembali ke acara
    </Link>
  );

  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <header className="kk-event-head">
        {backLink}
        <h1 className="kk-feed-title">{event.name}</h1>
        <p className="kk-feed-count">/{event.slug}</p>
      </header>

      {event.status === "live" ? (
        <section className="kk-card">
          <h2 className="kk-section-title">Moderasi Foto</h2>
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Sembunyikan foto yang tidak pantas — foto langsung hilang dari galeri tamu.
          </p>
          <HostPhotosClient
            eventId={event.id}
            isPublished={false}
            legacyUnlocked={false}
            initialPhotos={initial.photos}
            initialHasMore={initial.hasMore}
          />
        </section>
      ) : isPublished ? (
        <section className="kk-card kk-card-primary">
          <h2 className="kk-section-title">Kurasi Galeri Kenangan</h2>
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Sembunyikan foto yang tak ingin ditampilkan — perubahan langsung tampak
            di galeri kenangan. Buka sebuah foto lalu bayar Rp 3.000 untuk
            meningkatkan kualitasnya dengan AI.
          </p>
          <HostPhotosClient
            eventId={event.id}
            isPublished={true}
            legacyUnlocked={legacyUnlocked}
            initialPhotos={initial.photos}
            initialHasMore={initial.hasMore}
          />
        </section>
      ) : (
        <section className="kk-card">
          <p className="kk-status-msg">
            Kurasi foto tersedia saat acara berlangsung atau sudah ditutup.
          </p>
        </section>
      )}
    </main>
  );
}
