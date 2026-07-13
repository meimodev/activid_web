"use client";

import { useState } from "react";
import Link from "next/link";
import { kenanganCreateEvent, kenanganHostLogout } from "../actions";
import ConfirmSubmit from "../ConfirmSubmit";

type Tab = "dashboard" | "create";

// Trimmed, serializable event shape for the client list (no Firestore Timestamp).
export type ConsoleEvent = {
  id: string;
  name: string;
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
    .slice(0, 34)
    .replace(/-+$/g, "");
  return base || "kenangan";
}

export default function HostConsole({
  events,
  initialTab,
  error,
}: {
  events: ConsoleEvent[];
  initialTab: Tab;
  error?: string;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  // Uniqueness marker fixed once on mount so the preview matches the saved link.
  const [suffix] = useState(() => Date.now().toString(36).slice(-5));
  const slug = `${slugifyName(name)}-${suffix}`;

  return (
    <div className="kk-console-root">
      <main className="kk-console">
        {/* key remounts on tab change so the enter animation replays; data-dir
            gives it direction (Create sits right of Dashboard). */}
        <div key={tab} className="kk-tab-view" data-dir={tab === "create" ? "right" : "left"}>
        {tab === "dashboard" ? (
          <section>
            <h1 className="kk-feed-title">Dasbor</h1>
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
                      <strong>{event.name}</strong>
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
              <label className="kk-label" htmlFor="name">Nama Acara</label>
              <input
                id="name"
                name="name"
                className="kk-input"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="kk-label" htmlFor="slug">Tautan acara</label>
              <input id="slug" className="kk-input" readOnly value={slug} tabIndex={-1} />
              <input type="hidden" name="slug" value={slug} />
              <p className="kk-field-hint">
                Dibuat otomatis dari nama acara. Jadi bagian alamat galeri tamu.
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

function NavIcon({ name }: { name: "dashboard" | "create" | "logout" }) {
  const paths: Record<string, string> = {
    dashboard: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    create: "M12 5v14M5 12h14",
    logout: "M15 3H5v18h10M10 12h11m0 0-4-4m4 4-4 4",
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
