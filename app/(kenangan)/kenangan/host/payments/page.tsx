import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import { kenanganOrderKind, type KenanganEvent, type KenanganHost, type KenanganOrder } from "@/types/kenangan";
import { kenanganConfirmOrder } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";

export const metadata: Metadata = { title: "Pembayaran" };

// Confirmed orders older than this fall off the tail and live only on their
// event. Pending orders never expire from the queue. See CONTEXT.md → Payment.
const CONFIRMED_TAIL_DAYS = 14;

const KIND_LABELS: Record<string, string> = { paket: "Paket", enhancement: "Peningkatan AI" };

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

function toMillis(ts: unknown): number {
  return (ts as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
}

function formatDate(ms: number): string {
  if (!ms) return "—";
  return DateTime.fromMillis(ms).setLocale("id").toFormat("d MMM yyyy, HH:mm");
}

type Row = {
  id: string;
  eventId: string;
  kind: string;
  amountIdr: number;
  createdMs: number;
  confirmedMs: number;
  eventName: string | null;
  eventSlug: string | null;
  hostEmail: string | null;
};

export default async function KenanganPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [session, { saved }] = await Promise.all([getKenanganHostSession(), searchParams]);
  if (!session) redirect("/kenangan/host");
  if (!session.isAdmin) redirect("/kenangan/host/events");

  const db = getAdminDb();
  const orders = db.collection("kenanganOrders");

  // Two single-field queries, no composite index. Pending orders store
  // confirmedAt: null, so the range query only ever matches confirmed ones.
  const cutoff = Timestamp.fromMillis(DateTime.now().minus({ days: CONFIRMED_TAIL_DAYS }).toMillis());
  const [pendingSnap, confirmedSnap] = await Promise.all([
    orders.where("status", "==", "pending").get(),
    orders.where("confirmedAt", ">=", cutoff).get(),
  ]);

  const docs = [...pendingSnap.docs, ...confirmedSnap.docs].map((d) => ({
    id: d.id,
    ...(d.data() as KenanganOrder),
  }));

  // Join events, then hosts, in two batched getAll reads (dedup ids first).
  const eventIds = [...new Set(docs.map((o) => o.eventId).filter(Boolean))];
  const eventSnaps = eventIds.length
    ? await db.getAll(...eventIds.map((id) => db.collection("kenanganEvents").doc(id)))
    : [];
  const events = new Map(
    eventSnaps.filter((s) => s.exists).map((s) => [s.id, s.data() as KenanganEvent]),
  );

  const ownerUids = [...new Set([...events.values()].map((e) => e.ownerUid).filter(Boolean))];
  const hostSnaps = ownerUids.length
    ? await db.getAll(...ownerUids.map((uid) => db.collection("kenanganHosts").doc(uid)))
    : [];
  const hosts = new Map(
    hostSnaps.filter((s) => s.exists).map((s) => [s.id, s.data() as KenanganHost]),
  );

  const rows: Row[] = docs.map((o) => {
    const event = events.get(o.eventId);
    return {
      id: o.id,
      eventId: o.eventId,
      kind: kenanganOrderKind(o),
      amountIdr: o.amountIdr,
      createdMs: toMillis(o.createdAt),
      confirmedMs: toMillis(o.confirmedAt),
      eventName: event?.name ?? null,
      eventSlug: event?.slug ?? null,
      hostEmail: event ? hosts.get(event.ownerUid)?.email ?? null : null,
    };
  });

  // Pending oldest-first (FIFO); confirmed newest-first (recall).
  const pending = rows
    .filter((r) => r.confirmedMs === 0)
    .sort((a, b) => a.createdMs - b.createdMs);
  const confirmed = rows
    .filter((r) => r.confirmedMs > 0)
    .sort((a, b) => b.confirmedMs - a.confirmedMs);

  const pendingTotal = pending.reduce((sum, r) => sum + r.amountIdr, 0);

  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <header className="kk-event-head">
        <Link href="/kenangan/host/events" className="kk-feed-count">
          ← Konsol
        </Link>
        <h1 className="kk-feed-title">Pembayaran</h1>
        <p className="kk-feed-count">
          {pending.length} menunggu · {rupiah(pendingTotal)}
        </p>
      </header>

      {saved ? <p className="kk-form-ok">Pembayaran dikonfirmasi.</p> : null}

      <section className="kk-card">
        <h2 className="kk-section-title">Menunggu</h2>
        {pending.length === 0 ? (
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Tidak ada pembayaran yang menunggu.
          </p>
        ) : (
          <div className="kk-event-list">
            {pending.map((r) => (
              <PaymentRow key={r.id} row={r} confirmable />
            ))}
          </div>
        )}
      </section>

      <section className="kk-card">
        <h2 className="kk-section-title">Terkonfirmasi ({CONFIRMED_TAIL_DAYS} hari terakhir)</h2>
        {confirmed.length === 0 ? (
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Belum ada konfirmasi dalam {CONFIRMED_TAIL_DAYS} hari terakhir.
          </p>
        ) : (
          <div className="kk-event-list">
            {confirmed.map((r) => (
              <PaymentRow key={r.id} row={r} confirmable={false} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function PaymentRow({ row, confirmable }: { row: Row; confirmable: boolean }) {
  const kindLabel = KIND_LABELS[row.kind] ?? row.kind;
  const title = row.eventName ?? "Acara terhapus";
  const sub = row.eventSlug ? `/${row.eventSlug}` : row.eventId;

  return (
    <div className="kk-event-row" style={{ cursor: "default", flexWrap: "wrap", gap: 8 }}>
      <span className="kk-event-row-main">
        <strong>{title}</strong>
        <span className="kk-feed-count">
          {kindLabel} · {rupiah(row.amountIdr)}
        </span>
        <span className="kk-feed-count">
          {sub}
          {row.hostEmail ? ` · ${row.hostEmail}` : ""}
        </span>
        <span className="kk-feed-count">
          {confirmable
            ? `Dibuat ${formatDate(row.createdMs)}`
            : `Dikonfirmasi ${formatDate(row.confirmedMs)}`}
        </span>
      </span>
      {confirmable ? (
        <span className="kk-event-head-actions" style={{ marginTop: 0 }}>
          {row.hostEmail ? (
            <a className="kk-btn kk-btn-ghost" href={`mailto:${row.hostEmail}`}>
              Email host
            </a>
          ) : null}
          <form action={kenanganConfirmOrder}>
            <input type="hidden" name="orderId" value={row.id} />
            <input type="hidden" name="returnTo" value="/kenangan/host/payments" />
            <ConfirmSubmit
              confirm={`Konfirmasi pembayaran ${kindLabel} ${rupiah(row.amountIdr)} untuk "${title}"?`}
              pendingLabel="Mengkonfirmasi…"
            >
              Konfirmasi
            </ConfirmSubmit>
          </form>
        </span>
      ) : (
        <span className="kk-badge" data-status="published">
          Lunas
        </span>
      )}
    </div>
  );
}
