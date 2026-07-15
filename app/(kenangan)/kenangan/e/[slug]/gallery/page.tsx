import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";
import { getKenanganEventBySlug, getKenanganGalleryPhotos } from "@/lib/kenangan-event";
import { isKenanganPublished, kenanganEventTitle } from "@/types/kenangan";
import GalleryGrid from "./GalleryGrid";

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

  if (!isKenanganPublished(event.status)) {
    return (
      <main className="kk-page">
        <p className="kk-brand">Kita</p>
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p style={{ lineHeight: 1.6 }}>
            Galeri kenangan belum tersedia. Kembali lagi setelah acara ditutup
            oleh tuan rumah.
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
        <p className="kk-landing-date">{dateLabel} · {photos.length} foto kenangan</p>
      </div>

      <GalleryGrid photos={photos} />
    </main>
  );
}
