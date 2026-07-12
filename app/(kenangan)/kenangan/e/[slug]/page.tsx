import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";
import { getKenanganEventBySlug } from "@/lib/kenangan-event";
import { verifyKenanganGuestToken } from "@/lib/kenangan-guest-token";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  if (!event) return { title: "KenanganKita" };
  return {
    title: event.name,
    description: `Galeri foto langsung untuk ${event.name}.`,
  };
}

function formatEventDate(iso: string): string {
  const dt = DateTime.fromISO(iso).setLocale("id");
  return dt.isValid ? dt.toFormat("cccc, d MMMM yyyy") : "";
}

export default async function KenanganGuestLandingPage({ params, searchParams }: Props) {
  const [{ slug }, { t }] = await Promise.all([params, searchParams]);
  const event = await getKenanganEventBySlug(slug);
  if (!event) notFound();

  const claims = t ? await verifyKenanganGuestToken(t) : null;
  const authorized = claims?.eventId === event.id;
  const tokenQuery = t ? `?t=${encodeURIComponent(t)}` : "";

  return (
    <main className="kk-page">
      <p className="kk-brand">Kita</p>

      <div style={{ marginTop: 24 }}>
        {event.coverUrl ? (
          <img src={event.coverUrl} alt={event.name} className="kk-landing-cover" />
        ) : null}
        <h1 className="kk-landing-title">{event.name}</h1>
        <p className="kk-landing-date">{formatEventDate(event.eventDate)}</p>
      </div>

      {authorized && event.status === "live" ? (
        <>
          <div className="kk-landing-actions">
            <Link href={`/kenangan/e/${slug}/capture${tokenQuery}`} className="kk-btn kk-btn-primary">
              Ambil Foto
            </Link>
            <Link href={`/kenangan/e/${slug}/feed${tokenQuery}`} className="kk-btn kk-btn-ghost">
              Lihat Galeri Langsung
            </Link>
          </div>
          <p className="kk-landing-note">
            Foto yang kamu ambil langsung tampil di galeri bersama. Setelah acara
            selesai, tuan rumah akan mengkurasi galeri kenangan terbaik.
          </p>
        </>
      ) : null}

      {authorized && event.status === "closed" ? (
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p style={{ lineHeight: 1.6 }}>
            Acara telah selesai. Galeri kenangan sedang dikurasi oleh tuan rumah —
            nantikan hasilnya di sini.
          </p>
        </div>
      ) : null}

      {event.status === "published" ? (
        <div className="kk-landing-actions">
          <Link href={`/kenangan/e/${slug}/gallery`} className="kk-btn kk-btn-primary">
            Lihat Galeri Kenangan
          </Link>
        </div>
      ) : null}

      {!authorized && event.status !== "published" ? (
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p style={{ lineHeight: 1.6 }}>
            Tautan ini tidak valid atau sudah kedaluwarsa. Silakan pindai ulang kode
            QR yang tersedia di lokasi acara.
          </p>
        </div>
      ) : null}
    </main>
  );
}
