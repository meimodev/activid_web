import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DateTime } from "luxon";
import { getKenanganEventBySlug, getKenanganPaketStatus } from "@/lib/kenangan-event";
import { verifyKenanganGuestToken } from "@/lib/kenangan-guest-token";
import { isKenanganPublished, KENANGAN_EVENT_TYPES, kenanganEventTitle } from "@/types/kenangan";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  if (!event) return { title: "KenanganKita" };
  const title = kenanganEventTitle(event);
  return {
    title,
    description: `Galeri foto langsung untuk ${title}.`,
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
  // states (draft, bad token) render here. See CONTEXT.md "Guest Landing".
  if (authorized && event.status === "live") {
    redirect(`/kenangan/e/${slug}/feed${tokenQuery}`);
  }
  // Closed IS published (ADR-0007) — the memory gallery is live.
  if (isKenanganPublished(event.status)) {
    redirect(`/kenangan/e/${slug}/gallery`);
  }

  // Draft = not yet live. Distinguish "awaiting admin payment confirmation"
  // (pending paket) from "host hasn't started it yet" so a scanning Guest knows
  // which. Only queried for the draft state. See CONTEXT.md "Guest Landing".
  const paketPending =
    authorized && event.status === "draft"
      ? (await getKenanganPaketStatus(event.id)) === "pending"
      : false;

  // Type as a kicker above the name (the name never carries the type). Legacy
  // events without an eventType show just the name — no kicker. See ADR-0006.
  const eventTypeLabel = KENANGAN_EVENT_TYPES.find((t) => t.id === event.eventType)?.label;

  return (
    <main className="kk-page">
      <p className="kk-brand">KenanganKita</p>

      <header className="kk-hero">
        {event.coverUrl ? (
          <img src={event.coverUrl} alt={kenanganEventTitle(event)} className="kk-landing-cover" />
        ) : null}
        <div className="kk-hero-text">
          {eventTypeLabel ? <p className="kk-hero-kicker">{eventTypeLabel}</p> : null}
          <h1 className="kk-landing-title">{event.name}</h1>
          <p className="kk-landing-date">{formatEventDate(event.eventDate)}</p>
        </div>
      </header>

      {authorized && event.status === "draft" ? (
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p className="kk-section-title" style={{ marginBottom: 8 }}>
            {paketPending ? "Acara sedang menunggu konfirmasi." : "Acara belum dimulai."}
          </p>
          <p style={{ lineHeight: 1.6 }}>
            {paketPending
              ? "Tuan rumah sedang menyelesaikan proses konfirmasi. Silakan pindai ulang kode QR beberapa saat lagi."
              : "Acara belum dibuka oleh tuan rumah. Silakan pindai ulang kode QR saat acara sudah berlangsung."}
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
