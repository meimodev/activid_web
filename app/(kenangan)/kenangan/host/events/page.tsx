import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import type { KenanganEvent } from "@/types/kenangan";
import { kenanganCreateEvent, kenanganHostLogout } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";

export const metadata: Metadata = { title: "Daftar Acara" };

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  live: "Berlangsung",
  closed: "Selesai",
  published: "Terpublikasi",
};

function createdAtMillis(event: KenanganEvent): number {
  const ts = event.createdAt as { toMillis?: () => number } | undefined;
  return ts?.toMillis?.() ?? 0;
}

export default async function KenanganHostEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [session, { error }] = await Promise.all([getKenanganHostSession(), searchParams]);
  if (!session) redirect("/kenangan/host");

  const col = getAdminDb().collection("kenanganEvents");
  // Admin sees every event (indexed orderBy). A host sees only their own; we
  // sort in code to avoid a composite (ownerUid + createdAt) index.
  const snap = session.isAdmin
    ? await col.orderBy("createdAt", "desc").limit(100).get()
    : await col.where("ownerUid", "==", session.uid).limit(100).get();
  const events = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as KenanganEvent) }));
  if (!session.isAdmin) {
    events.sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
  }

  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <div className="kk-feed-header">
        <h1 className="kk-feed-title">Daftar Acara</h1>
        <form action={kenanganHostLogout}>
          <button type="submit" className="kk-link-btn">Keluar</button>
        </form>
      </div>

      <section className="kk-card">
        <h2 className="kk-section-title">Buat Acara Baru</h2>
        <form action={kenanganCreateEvent} className="kk-form">
          <label className="kk-label" htmlFor="name">Nama Acara</label>
          <input id="name" name="name" className="kk-input" required maxLength={120} />
          <label className="kk-label" htmlFor="slug">Tautan acara</label>
          <input
            id="slug"
            name="slug"
            className="kk-input"
            required
            pattern="[a-z0-9\-]{3,40}"
            placeholder="mis. nikah-rani-bima"
          />
          <p className="kk-field-hint">
            Huruf kecil, angka, dan tanda hubung. Jadi bagian alamat galeri tamu.
          </p>
          <label className="kk-label" htmlFor="eventDate">Tanggal Acara</label>
          <input id="eventDate" name="eventDate" type="date" className="kk-input" required />
          {error === "invalid" ? (
            <p className="kk-form-error">Data tidak valid. Periksa kembali.</p>
          ) : null}
          {error === "slug" ? (
            <p className="kk-form-error">Slug sudah dipakai acara lain.</p>
          ) : null}
          <ConfirmSubmit pendingLabel="Membuat…">Buat Acara</ConfirmSubmit>
        </form>
      </section>

      <section style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        {events.length === 0 ? (
          <p className="kk-status-msg">Belum ada acara.</p>
        ) : (
          events.map((event) => (
            <Link key={event.id} href={`/kenangan/host/events/${event.id}`} className="kk-event-row">
              <span>
                <strong>{event.name}</strong>
                <br />
                <span className="kk-feed-count">
                  /{event.slug} · {event.eventDate}
                </span>
              </span>
              <span className="kk-badge" data-status={event.status}>
                {STATUS_LABELS[event.status] ?? event.status}
              </span>
            </Link>
          ))
        )}
      </section>
    </main>
  );
}
