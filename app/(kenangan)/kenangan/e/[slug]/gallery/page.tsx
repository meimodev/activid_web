import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";
import { getKenanganEventBySlug, getKenanganGalleryPhotos } from "@/lib/kenangan-event";
import { KENANGAN_IMAGEKIT_URL_BASE, kenanganEventTitle } from "@/types/kenangan";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  return { title: event ? `Galeri Kenangan ${kenanganEventTitle(event)}` : "Galeri Kenangan" };
}

export default async function KenanganGalleryPage({ params }: Props) {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  if (!event) notFound();

  if (event.status !== "published") {
    return (
      <main className="kk-page">
        <p className="kk-brand">Kita</p>
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p style={{ lineHeight: 1.6 }}>
            Galeri kenangan belum dipublikasikan. Kembali lagi setelah tuan rumah
            selesai mengkurasi foto terbaik.
          </p>
        </div>
      </main>
    );
  }

  const photos = await getKenanganGalleryPhotos(slug);
  const dateLabel = DateTime.fromISO(event.eventDate).setLocale("id").toFormat("d MMMM yyyy");

  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <p className="kk-brand">Kita</p>
      <div style={{ textAlign: "center", margin: "20px 0 24px" }}>
        <h1 className="kk-landing-title" style={{ margin: 0 }}>{kenanganEventTitle(event)}</h1>
        <p className="kk-landing-date">{dateLabel} · {photos.length} foto pilihan</p>
      </div>

      <div className="kk-feed-grid">
        {photos.map((photo) => (
          <figure key={photo.id} className="kk-feed-item">
            <img
              src={`${KENANGAN_IMAGEKIT_URL_BASE}${photo.path}?tr=w-800,q-80`}
              alt="Foto kenangan"
              loading="lazy"
              decoding="async"
            />
            <a
              className="kk-download-link"
              href={`${KENANGAN_IMAGEKIT_URL_BASE}${photo.path}?ik-attachment=true`}
            >
              Unduh
            </a>
          </figure>
        ))}
      </div>
    </main>
  );
}
