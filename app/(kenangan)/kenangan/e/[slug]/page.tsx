import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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

  // The landing is a router, not a destination: a scanning Guest is sent
  // straight to the gallery for the Event's current state. Only the dead-end
  // states (closed, bad token) render here. See CONTEXT.md "Guest Landing".
  if (authorized && event.status === "live") {
    redirect(`/kenangan/e/${slug}/feed${tokenQuery}`);
  }
  if (event.status === "published") {
    redirect(`/kenangan/e/${slug}/gallery`);
  }

  return (
    <main className="kk-page">
      <p className="kk-brand">KenanganKita</p>

      <div style={{ marginTop: 24 }}>
        {event.coverUrl ? (
          <img src={event.coverUrl} alt={event.name} className="kk-landing-cover" />
        ) : null}
        <h1 className="kk-landing-title">{event.name}</h1>
        <p className="kk-landing-date">{formatEventDate(event.eventDate)}</p>
      </div>

      {authorized && event.status === "closed" ? (
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p className="kk-section-title" style={{ marginBottom: 8 }}>
            Terima kasih sudah hadir.
          </p>
          <p style={{ lineHeight: 1.6 }}>
            Acara telah selesai. Galeri kenangan sedang dikurasi oleh tuan rumah —
            nantikan hasilnya di sini.
          </p>
        </div>
      ) : null}

      {!authorized ? (
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
