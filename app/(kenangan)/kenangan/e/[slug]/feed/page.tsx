import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKenanganEventBySlug } from "@/lib/kenangan-event";
import FeedClient from "./FeedClient";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  return { title: event ? `Galeri ${event.name}` : "Galeri" };
}

export default async function KenanganFeedPage({ params, searchParams }: Props) {
  const [{ slug }, { t }] = await Promise.all([params, searchParams]);
  const event = await getKenanganEventBySlug(slug);
  if (!event) notFound();

  if (event.status !== "live") {
    return (
      <main className="kk-page">
        <p className="kk-brand">Kita</p>
        <div className="kk-card" style={{ marginTop: 28 }}>
          <p style={{ lineHeight: 1.6 }}>
            {event.status === "published"
              ? "Acara telah selesai. Galeri kenangan sudah tersedia."
              : "Galeri langsung belum aktif untuk acara ini."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <FeedClient
      eventId={event.id}
      eventName={event.name}
      slug={slug}
      token={t ?? null}
      downloadMode={event.downloadMode}
    />
  );
}
