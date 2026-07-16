"use client";

import { useState } from "react";
import Link from "next/link";
import { kenanganCreateEvent, kenanganHostLogout } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";
import {
  KENANGAN_TIERS,
  KENANGAN_EVENT_TYPES,
  KENANGAN_DEFAULT_EVENT_TYPE,
  kenanganEventTitle,
} from "@/types/kenangan";
import { KENANGAN_THEMES, KENANGAN_DEFAULT_THEME_ID } from "@/data/kenangan-themes";
import KenanganCoverPicker from "./[id]/KenanganCoverPicker";
import KenanganTierCards from "./KenanganTierCards";

type Tab = "dashboard" | "create";

// Trimmed, serializable event shape for the client list (no Firestore Timestamp).
export type ConsoleEvent = {
  id: string;
  name: string;
  eventType?: string;
  slug: string;
  eventDate: string;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draf",
  live: "Berlangsung",
  closed: "Selesai",
  published: "Terpublikasi",
};

/** URL-safe base from the event name; empty (emoji/symbol-only) falls back. */
function slugifyName(name: string): string {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
  return base || "kenangan";
}

export default function HostConsole({
  events,
  initialTab,
  initialTier,
  error,
  isAdmin = false,
  email = null,
  name = null,
  photoUrl = null,
}: {
  events: ConsoleEvent[];
  initialTab: Tab;
  initialTier?: string;
  error?: string;
  isAdmin?: boolean;
  email?: string | null;
  name?: string | null;
  photoUrl?: string | null;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  // Preselect the tier the guest picked on the landing page; ignore junk params.
  const tierDefault = KENANGAN_TIERS.some((t) => t.id === initialTier)
    ? initialTier
    : "standard";
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<string>(KENANGAN_DEFAULT_EVENT_TYPE);
  // Uniqueness marker fixed once on mount so the preview matches the saved link.
  const [suffix] = useState(() => Date.now().toString(36).slice(-5));
  const slug = `${eventType}-${slugifyName(eventName)}-${suffix}`;

  return (
    <div className="kk-console-root">
      <main className="kk-console">
        {/* key remounts on tab change so the enter animation replays; data-dir
            gives it direction (Create sits right of Dashboard). */}
        <div key={tab} className="kk-tab-view" data-dir={tab === "create" ? "right" : "left"}>
        {tab === "dashboard" ? (
          <section>
            <h1 className="kk-feed-title">Dasbor</h1>
            {email || name || photoUrl ? (
              <div className="kk-console-user">
                <span className="kk-console-avatar" aria-hidden="true">
                  {photoUrl ? (
                    <img src={photoUrl} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    (name ?? email ?? "?").charAt(0).toUpperCase()
                  )}
                </span>
                <span className="kk-console-user-text">
                  <strong>{name ?? email}</strong>
                  {name && email ? <span>{email}</span> : null}
                </span>
                {isAdmin ? <span className="kk-badge kk-badge-admin">Admin</span> : null}
              </div>
            ) : null}
            {events.length === 0 ? (
              <div className="kk-empty">
                <p className="kk-status-msg">Belum ada acara.</p>
                <button
                  type="button"
                  className="kk-btn kk-btn-primary"
                  onClick={() => setTab("create")}
                >
                  Buat Acara Pertama
                </button>
              </div>
            ) : (
              <div className="kk-event-list">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/kenangan/host/events/${event.id}`}
                    className="kk-event-row"
                  >
                    <span className="kk-event-row-main">
                      <strong>{kenanganEventTitle(event)}</strong>
                      <span className="kk-feed-count">
                        /{event.slug} · {event.eventDate}
                      </span>
                    </span>
                    <span className="kk-badge" data-status={event.status}>
                      {STATUS_LABELS[event.status] ?? event.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            <h1 className="kk-feed-title">Buat Acara</h1>
            <form action={kenanganCreateEvent} className="kk-form">
              <label className="kk-label" htmlFor="eventType">Jenis Acara</label>
              <select
                id="eventType"
                name="eventType"
                className="kk-input"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                {KENANGAN_EVENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <label className="kk-label" htmlFor="name">Nama Acara</label>
              <input
                id="name"
                name="name"
                className="kk-input"
                required
                maxLength={120}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <label className="kk-label" htmlFor="slug">Tautan acara</label>
              <input id="slug" className="kk-input" readOnly value={slug} tabIndex={-1} />
              <input type="hidden" name="slug" value={slug} />
              <p className="kk-field-hint">
                Dibuat otomatis dari nama acara. Jadi bagian alamat galeri tamu.
              </p>
              <label className="kk-label" htmlFor="eventDate">Tanggal Acara</label>
              <input id="eventDate" name="eventDate" type="date" className="kk-input" required />
              <label className="kk-label" htmlFor="themeId">Tema</label>
              <select
                id="themeId"
                name="themeId"
                className="kk-input"
                defaultValue={KENANGAN_DEFAULT_THEME_ID}
              >
                {KENANGAN_THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="kk-field-hint">
                Menentukan gaya foto tamu dan sampul bawaan acara.
              </p>
              <label className="kk-label">Foto Sampul (opsional)</label>
              <KenanganCoverPicker initialUrl="" />
              <p className="kk-field-hint">
                Kosongkan untuk memakai sampul bawaan sesuai tema.
              </p>
              <span className="kk-label">Paket (berdasarkan jumlah tamu)</span>
              <KenanganTierCards value={tierDefault} />
              <p className="kk-field-hint">
                Dibayar di muka. Acara baru bisa dimulai setelah admin mengkonfirmasi
                pembayaran paket.
              </p>
              {error === "invalid" ? (
                <p className="kk-form-error">Data tidak valid. Periksa kembali.</p>
              ) : null}
              {error === "slug" ? (
                <p className="kk-form-error">Slug sudah dipakai acara lain.</p>
              ) : null}
              <ConfirmSubmit pendingLabel="Membuat…">Buat Acara</ConfirmSubmit>
            </form>
          </section>
        )}
        </div>
      </main>

      <nav className="kk-navbar" aria-label="Menu host">
        <button
          type="button"
          className="kk-nav-item"
          data-active={tab === "dashboard"}
          onClick={() => setTab("dashboard")}
        >
          <NavIcon name="dashboard" />
          Dasbor
        </button>
        <button
          type="button"
          className="kk-nav-item"
          data-active={tab === "create"}
          onClick={() => setTab("create")}
        >
          <NavIcon name="create" />
          Buat
        </button>
        {isAdmin ? (
          <Link href="/kenangan/host/payments" className="kk-nav-item">
            <NavIcon name="payments" />
            Bayar
          </Link>
        ) : null}
        <form action={kenanganHostLogout} className="kk-nav-form">
          <ConfirmSubmit className="kk-nav-item" confirm="Keluar dari akun?">
            <NavIcon name="logout" />
            Keluar
          </ConfirmSubmit>
        </form>
      </nav>
    </div>
  );
}

function NavIcon({ name }: { name: "dashboard" | "create" | "logout" | "payments" }) {
  const paths: Record<string, string> = {
    dashboard: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    create: "M12 5v14M5 12h14",
    logout: "M15 3H5v18h10M10 12h11m0 0-4-4m4 4-4 4",
    payments: "M3 10h18M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
  };
  return (
    <svg
      className="kk-nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
