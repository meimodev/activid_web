import os from "node:os";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { DateTime } from "luxon";
import QRCode from "qrcode";
import { getKenanganEventById } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";
import { createKenanganGuestToken } from "@/lib/kenangan-guest-token";
import { KENANGAN_THEMES } from "@/data/kenangan-themes";
import { getAdminDb } from "@/lib/firebase-admin";
import { KENANGAN_TIERS, getKenanganTier, type KenanganOrder } from "@/types/kenangan";
import {
  kenanganConfirmOrder,
  kenanganHostLogout,
  kenanganRequestEnhancement,
  kenanganSetEventStatus,
  kenanganUpdateEvent,
} from "../../actions";
import ConfirmSubmit from "../../ConfirmSubmit";
import CopyButton from "./CopyButton";
import HostPhotosClient from "./HostPhotosClient";
import PublishButton from "./PublishButton";

export const metadata: Metadata = { title: "Kelola Acara" };

// Build the guest-facing URL for the QR.
// - KENANGAN_GUEST_ORIGIN env (e.g. https://kenangan.activid.id) → subdomain
//   form "{origin}/{slug}", which middleware rewrites to /kenangan/e/{slug}.
// - Otherwise derive from the request host: a "kenangan." host keeps the
//   subdomain form; anything else (localhost, Vercel preview, bare domain)
//   uses the same-origin path form so the link is reachable without DNS.
// ponytail: dev-only. Pick a LAN IPv4 a phone on the same WiFi can route to.
// Prefer 192.168.* → 10.* → 172.16-31.* so Docker bridges rank last.
function pickLanIp(): string | undefined {
  const rank = (ip: string) =>
    ip.startsWith("192.168.") ? 0
    : ip.startsWith("10.") ? 1
    : /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ? 2
    : 3;
  return Object.values(os.networkInterfaces())
    .flatMap((iface) => iface ?? [])
    .filter((net) => net.family === "IPv4" && !net.internal)
    .map((net) => net.address)
    .filter((ip) => rank(ip) < 3)
    .sort((a, b) => rank(a) - rank(b))[0];
}

async function buildGuestUrl(slug: string, token: string): Promise<string> {
  const query = `?t=${encodeURIComponent(token)}`;
  const envOrigin = process.env.KENANGAN_GUEST_ORIGIN;
  if (envOrigin) return `${envOrigin.replace(/\/$/, "")}/${slug}${query}`;

  const hdrs = await headers();
  let host = hdrs.get("host") ?? "kenangan.activid.id";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const proto = hdrs.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");

  // Dev convenience: dashboard loaded on localhost → swap host for the LAN IP
  // so a scanning phone can reach the same-origin guest page. Prod untouched.
  if (process.env.NODE_ENV !== "production" && isLocal) {
    const lanIp = pickLanIp();
    if (lanIp) {
      const port = host.split(":")[1];
      host = port ? `${lanIp}:${port}` : lanIp;
    }
  }

  if (host.startsWith("kenangan.")) return `${proto}://${host}/${slug}${query}`;
  return `${proto}://${host}/kenangan/e/${slug}${query}`;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  live: "Berlangsung",
  closed: "Selesai",
  published: "Terpublikasi",
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function KenanganHostEventPage({ params, searchParams }: Props) {
  const [session, { id }, { saved, error }] = await Promise.all([
    getKenanganHostSession(),
    params,
    searchParams,
  ]);
  if (!session) redirect("/kenangan/host");

  const event = await getKenanganEventById(id);
  if (!event) notFound();
  if (!canAccessEvent(session, event.ownerUid)) redirect("/kenangan/host/events");

  // Latest enhancement order for this event (no orderBy: avoids an index).
  const ordersSnap = await getAdminDb()
    .collection("kenanganOrders")
    .where("eventId", "==", id)
    .get();
  const order = ordersSnap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as KenanganOrder) }))
    .filter((o) => ["pending", "confirmed"].includes(o.status))
    .at(0);
  const tier = getKenanganTier(event.tier);

  // Guest QR: signed token, expiry = event date + 48h (Asia/Jakarta).
  const tokenExpiry = DateTime.fromISO(event.eventDate, { zone: "Asia/Jakarta" })
    .endOf("day")
    .plus({ hours: 48 });
  const tokenValid = tokenExpiry.isValid && tokenExpiry > DateTime.now();
  let guestUrl = "";
  let qrDataUrl = "";
  if (tokenValid) {
    const token = await createKenanganGuestToken(event.id, tokenExpiry.toJSDate());
    guestUrl = await buildGuestUrl(event.slug, token);
    qrDataUrl = await QRCode.toDataURL(guestUrl, {
      margin: 1,
      width: 480,
      color: { dark: "#2c2822", light: "#f7f2ea" },
    });
  }

  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <div className="kk-feed-header">
        <div>
          {session.isAdmin ? (
            <Link href="/kenangan/host/events" className="kk-feed-count">
              ← Semua acara
            </Link>
          ) : null}
          <h1 className="kk-feed-title">{event.name}</h1>
          <p className="kk-feed-count">/{event.slug}</p>
        </div>
        <form action={kenanganHostLogout}>
          <button type="submit" className="kk-link-btn">Keluar</button>
        </form>
      </div>

      {saved ? <p className="kk-form-ok">Perubahan tersimpan.</p> : null}
      {error === "invalid" ? (
        <p className="kk-form-error">Data tidak valid. Periksa kembali.</p>
      ) : null}
      {error === "published" ? (
        <p className="kk-form-error">Acara sudah terpublikasi dan tidak bisa diubah statusnya.</p>
      ) : null}

      <section className="kk-card">
        <h2 className="kk-section-title">
          Status: <span className="kk-badge" data-status={event.status}>{STATUS_LABELS[event.status]}</span>
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          {event.status === "draft" || event.status === "closed" ? (
            <form action={kenanganSetEventStatus}>
              <input type="hidden" name="eventId" value={event.id} />
              <input type="hidden" name="status" value="live" />
              <ConfirmSubmit pendingLabel="Menyimpan…">
                {event.status === "draft" ? "Mulai Terima Foto" : "Buka Kembali"}
              </ConfirmSubmit>
            </form>
          ) : null}
          {event.status === "live" ? (
            <form action={kenanganSetEventStatus}>
              <input type="hidden" name="eventId" value={event.id} />
              <input type="hidden" name="status" value="closed" />
              <ConfirmSubmit
                className="kk-btn kk-btn-ghost"
                confirm="Tutup acara? Tamu tidak bisa lagi menambah foto ke galeri langsung."
                pendingLabel="Menutup…"
              >
                Tutup Acara
              </ConfirmSubmit>
            </form>
          ) : null}
          {event.status === "live" ? (
            <Link href={`/kenangan/e/${event.slug}/feed`} className="kk-btn kk-btn-ghost">
              Lihat Galeri Langsung
            </Link>
          ) : null}
        </div>
      </section>

      <section
        className={`kk-card${event.status === "live" ? " kk-card-primary" : ""}`}
        style={{ marginTop: 16 }}
      >
        <h2 className="kk-section-title">Kode QR Tamu</h2>
        {tokenValid ? (
          <div style={{ textAlign: "center" }}>
            <img src={qrDataUrl} alt="Kode QR tamu" style={{ width: 240, borderRadius: 12 }} />
            <input className="kk-input" readOnly value={guestUrl} style={{ marginTop: 12 }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
              <CopyButton value={guestUrl} />
              <a href={qrDataUrl} download={`qr-${event.slug}.png`} className="kk-btn kk-btn-ghost">
                Unduh QR
              </a>
            </div>
            <p className="kk-landing-note">
              Tautan berlaku sampai {tokenExpiry.setLocale("id").toFormat("d MMMM yyyy HH:mm")}.
              Cetak QR ini dan sebarkan di lokasi acara.
            </p>
          </div>
        ) : (
          <p className="kk-landing-note">
            Tanggal acara sudah lewat lebih dari 48 jam — tautan tamu tidak dapat dibuat.
            Perbarui tanggal acara bila perlu.
          </p>
        )}
      </section>

      {event.status === "live" ? (
        <section className="kk-card" style={{ marginTop: 16 }}>
          <h2 className="kk-section-title">Moderasi Foto</h2>
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Sembunyikan foto yang tidak pantas — foto langsung hilang dari galeri tamu.
          </p>
          <HostPhotosClient eventId={event.id} mode="live" />
        </section>
      ) : null}

      {event.status === "closed" ? (
        <section className="kk-card kk-card-primary" style={{ marginTop: 16 }}>
          <h2 className="kk-section-title">Kurasi Foto Terbaik</h2>
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Pilih foto-foto terbaik untuk galeri kenangan. Hanya foto terpilih yang
            dipublikasikan{event.enhancementPurchased ? " dan ditingkatkan kualitasnya" : ""}.
          </p>
          <HostPhotosClient eventId={event.id} mode="curate" />
          <PublishButton eventId={event.id} />
        </section>
      ) : null}

      {event.status !== "published" ? (
        <section className="kk-card" style={{ marginTop: 16 }}>
          <h2 className="kk-section-title">Galeri Kenangan AI</h2>
          {event.enhancementPurchased ? (
            <p className="kk-landing-note" style={{ marginTop: 4 }}>
              Peningkatan kualitas AI sudah aktif. Foto terpilih akan ditingkatkan
              saat galeri dipublikasikan.
            </p>
          ) : order?.status === "pending" ? (
            <>
              <p className="kk-landing-note" style={{ marginTop: 4 }}>
                Pesanan senilai Rp {order.amountIdr.toLocaleString("id-ID")} menunggu
                konfirmasi pembayaran dari admin. Selesaikan pembayaran via transfer
                lalu konfirmasi melalui WhatsApp.
              </p>
              {session.isAdmin ? (
                <form action={kenanganConfirmOrder} style={{ marginTop: 12 }}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <ConfirmSubmit
                    confirm={`Konfirmasi pembayaran Rp ${order.amountIdr.toLocaleString("id-ID")}? Peningkatan AI akan aktif untuk acara ini.`}
                    pendingLabel="Mengkonfirmasi…"
                  >
                    Konfirmasi Pembayaran (Admin)
                  </ConfirmSubmit>
                </form>
              ) : null}
            </>
          ) : (
            <>
              <p className="kk-landing-note" style={{ marginTop: 4 }}>
                Tingkatkan foto terpilih dengan AI (ketajaman, pencahayaan, wajah)
                sebelum galeri dipublikasikan. Paket {tier.name} (≤{tier.guestCap} tamu):
                Rp {tier.priceIdr.toLocaleString("id-ID")} per acara. Pembayaran manual
                via transfer — admin akan mengkonfirmasi.
              </p>
              <form action={kenanganRequestEnhancement} style={{ marginTop: 12 }}>
                <input type="hidden" name="eventId" value={event.id} />
                <ConfirmSubmit
                  confirm={`Ajukan peningkatan AI paket ${tier.name} seharga Rp ${tier.priceIdr.toLocaleString("id-ID")}? Pesanan dibuat sekarang, tapi kamu baru ditagih setelah admin konfirmasi pembayaran.`}
                  pendingLabel="Mengajukan…"
                >
                  Ajukan Peningkatan AI
                </ConfirmSubmit>
              </form>
            </>
          )}
        </section>
      ) : null}

      {event.status === "published" ? (
        <section className="kk-card" style={{ marginTop: 16 }}>
          <h2 className="kk-section-title">Galeri Terpublikasi</h2>
          <p className="kk-landing-note" style={{ marginTop: 4 }}>
            Galeri kenangan sudah tayang dan dapat dibagikan ke para tamu.
          </p>
          <Link href={`/kenangan/e/${event.slug}/gallery`} className="kk-btn kk-btn-primary" style={{ marginTop: 12 }}>
            Buka Galeri Kenangan
          </Link>
        </section>
      ) : null}

      <section className="kk-card" style={{ marginTop: 16 }}>
        <h2 className="kk-section-title">Pengaturan Acara</h2>
        <form action={kenanganUpdateEvent} className="kk-form">
          <input type="hidden" name="eventId" value={event.id} />
          <label className="kk-label" htmlFor="name">Nama Acara</label>
          <input id="name" name="name" className="kk-input" defaultValue={event.name} required maxLength={120} />
          <label className="kk-label" htmlFor="eventDate">Tanggal Acara</label>
          <input id="eventDate" name="eventDate" type="date" className="kk-input" defaultValue={event.eventDate} required />
          <label className="kk-label" htmlFor="coverUrl">URL Foto Sampul (opsional)</label>
          <input id="coverUrl" name="coverUrl" className="kk-input" defaultValue={event.coverUrl ?? ""} placeholder="https://…" />
          <label className="kk-label" htmlFor="themeId">Tema / Pilihan Filter</label>
          <select id="themeId" name="themeId" className="kk-input" defaultValue={event.themeId}>
            {KENANGAN_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          <label className="kk-label" htmlFor="tier">Paket (berdasarkan jumlah tamu)</label>
          <select id="tier" name="tier" className="kk-input" defaultValue={event.tier ?? "standard"}>
            {KENANGAN_TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — ≤{t.guestCap} tamu — Rp {t.priceIdr.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
          <label className="kk-label" htmlFor="downloadMode">Unduhan Foto untuk Tamu</label>
          <select id="downloadMode" name="downloadMode" className="kk-input" defaultValue={event.downloadMode}>
            <option value="after_publish">Setelah galeri dipublikasikan</option>
            <option value="instant_share">Langsung saat acara</option>
          </select>
          <ConfirmSubmit pendingLabel="Menyimpan…">Simpan</ConfirmSubmit>
        </form>
      </section>
    </main>
  );
}
