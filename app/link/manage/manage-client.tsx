"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { RedirectLink } from "@/lib/redirect-link";
import {
  createLink,
  loginLinkAdmin,
  removeLink,
  saveLink,
  toggleLink,
  type ActionState,
} from "./actions";

/**
 * Scoped to `.lc` on purpose: every surface in this repo owns its own look, so
 * none of these tokens belong in globals.css.
 */
const css = `
.lc {
  --lc-paper: oklch(0.982 0.004 85);
  --lc-surface: oklch(0.997 0.002 85);
  --lc-raised: oklch(0.965 0.005 85);
  --lc-line: oklch(0.898 0.005 85);
  --lc-line-soft: oklch(0.943 0.004 85);
  --lc-ink: oklch(0.245 0.012 80);
  --lc-ink-2: oklch(0.515 0.009 80);
  --lc-ink-3: oklch(0.665 0.008 80);
  --lc-accent: oklch(0.515 0.108 152);
  --lc-accent-deep: oklch(0.425 0.098 152);
  --lc-accent-wash: oklch(0.955 0.028 152);
  --lc-danger: oklch(0.525 0.178 27);
  --lc-danger-wash: oklch(0.962 0.028 27);

  --lc-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --lc-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  font-family: var(--lc-sans);
  color: var(--lc-ink);
  background: var(--lc-paper);
  -webkit-font-smoothing: antialiased;
}
.lc :focus-visible {
  outline: 2px solid var(--lc-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
.lc-mono { font-family: var(--lc-mono); font-feature-settings: "zero" 1; }
.lc-num { font-variant-numeric: tabular-nums; }

.lc-drawer {
  margin: 0 0 0 auto;
  padding: 0;
  border: 0;
  max-width: none;
  max-height: none;
  width: min(30rem, 100%);
  height: 100dvh;
  background: var(--lc-surface);
  color: var(--lc-ink);
  font-family: var(--lc-sans);
  box-shadow: -1px 0 0 var(--lc-line), -24px 0 48px -32px oklch(0.245 0.012 80 / 0.4);
  translate: 100% 0;
  transition:
    translate 260ms cubic-bezier(0.22, 1, 0.36, 1),
    overlay 260ms allow-discrete,
    display 260ms allow-discrete;
}
.lc-drawer[open] { translate: 0 0; }
@starting-style { .lc-drawer[open] { translate: 100% 0; } }

.lc-drawer::backdrop {
  background: oklch(0.245 0.012 80 / 0.3);
  opacity: 0;
  transition: opacity 260ms ease-out, overlay 260ms allow-discrete, display 260ms allow-discrete;
}
.lc-drawer[open]::backdrop { opacity: 1; }
@starting-style { .lc-drawer[open]::backdrop { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .lc-drawer, .lc-drawer::backdrop { transition-duration: 1ms; }
}
`;

const field =
  "w-full rounded-lg border border-[var(--lc-line)] bg-[var(--lc-surface)] px-3 py-2 text-[0.875rem] text-[var(--lc-ink)] outline-none transition-colors placeholder:text-[var(--lc-ink-3)] focus:border-[var(--lc-accent)]";
const label = "grid gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-[var(--lc-ink-2)]";
const primary =
  "inline-flex items-center justify-center rounded-lg bg-[var(--lc-accent)] px-4 py-2 text-[0.8125rem] font-semibold text-[var(--lc-surface)] transition-colors hover:bg-[var(--lc-accent-deep)] disabled:opacity-45";
const ghost =
  "inline-flex items-center justify-center rounded-lg border border-[var(--lc-line)] bg-[var(--lc-surface)] px-3 py-2 text-[0.8125rem] font-medium text-[var(--lc-ink-2)] transition-colors hover:border-[var(--lc-ink-3)] hover:text-[var(--lc-ink)]";
const destructive =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-[0.8125rem] font-medium text-[var(--lc-danger)] transition-colors hover:bg-[var(--lc-danger-wash)]";

function FormError({ state }: { state: ActionState }) {
  if (!state.error) return null;
  return (
    <p className="rounded-lg bg-[var(--lc-danger-wash)] px-3 py-2 text-[0.75rem] text-[var(--lc-danger)]">
      {state.error}
    </p>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium">
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ background: active ? "var(--lc-accent)" : "var(--lc-ink-3)" }}
      />
      <span style={{ color: active ? "var(--lc-accent-deep)" : "var(--lc-ink-3)" }}>
        {active ? "Aktif" : "Nonaktif"}
      </span>
    </span>
  );
}

function useCopy(code: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/link/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
}

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginLinkAdmin, {});
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <div className="lc flex min-h-dvh items-center justify-center px-6 py-16">
      <style>{css}</style>
      <form action={action} className="grid w-full max-w-[22rem] gap-5">
        <div className="grid gap-1">
          <h1 className="text-[1.375rem] font-semibold tracking-[-0.015em]">Link Console</h1>
          <p className="text-[0.875rem] text-[var(--lc-ink-2)]">
            Masukkan kata sandi untuk melanjutkan.
          </p>
        </div>
        <label className={label}>
          Kata sandi
          <input name="password" type="password" autoFocus className={field} />
        </label>
        <FormError state={state} />
        <button type="submit" disabled={pending} className={primary}>
          {pending ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}

function formatDate(ms: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export function LinkConsole({ links }: { links: RedirectLink[] }) {
  // "new" is the create sentinel; anything else is a code we look up fresh each
  // render, so the drawer follows the server data after a save or a delete.
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const selected = selectedCode === "new" ? null : links.find((l) => l.code === selectedCode);
  const open = selectedCode === "new" || Boolean(selected);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.businessName.toLowerCase().includes(q) ||
        l.destinationUrl.toLowerCase().includes(q) ||
        l.code.includes(q),
    );
  }, [links, query]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const activeCount = links.filter((l) => l.active).length;

  return (
    <div className="lc min-h-dvh">
      <style>{css}</style>

      <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1.5">
            <h1 className="text-[1.375rem] font-semibold tracking-[-0.015em]">Link Console</h1>
            <p className="lc-num text-[0.8125rem] text-[var(--lc-ink-2)]">
              {links.length} tautan alih · {activeCount} aktif
            </p>
          </div>
          <button type="button" onClick={() => setSelectedCode("new")} className={primary}>
            Tautan baru
          </button>
        </header>

        {links.length > 0 ? (
          <div className="mt-10">
            <label className="sr-only" htmlFor="lc-filter">
              Cari tautan
            </label>
            <input
              id="lc-filter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, kode, atau tujuan…"
              className={`${field} max-w-[20rem] bg-transparent`}
            />
          </div>
        ) : null}

        {links.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-[var(--lc-line)] px-6 py-14 text-center">
            <p className="text-[0.9375rem] font-medium">Belum ada tautan alih.</p>
            <p className="mx-auto mt-1.5 max-w-[38ch] text-[0.8125rem] leading-relaxed text-[var(--lc-ink-2)]">
              Satu tautan berisi nama bisnis dan URL tujuan. Kodenya pendek, jadi muat dicetak di
              bawah QR.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCode("new")}
              className={`${primary} mt-6`}
            >
              Buat tautan pertama
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-12 text-[0.8125rem] text-[var(--lc-ink-2)]">
            Tidak ada tautan yang cocok dengan “{query}”.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--lc-line)] bg-[var(--lc-surface)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--lc-line)]">
                  <Th className="pl-4 sm:pl-5">Bisnis</Th>
                  <Th className="hidden md:table-cell">Tujuan</Th>
                  <Th>Status</Th>
                  <Th className="hidden sm:table-cell">Dibuat</Th>
                  <Th className="pr-4 text-right sm:pr-5">
                    <span className="sr-only">Aksi</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((link) => (
                  <Row
                    key={link.code}
                    link={link}
                    selected={link.code === selectedCode}
                    onOpen={() => setSelectedCode(link.code)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="lc-drawer"
        onClose={() => setSelectedCode(null)}
        aria-label={selected ? `Detail ${selected.businessName}` : "Tautan baru"}
      >
        {open ? (
          <Drawer
            key={selectedCode}
            link={selected ?? null}
            onClose={() => setSelectedCode(null)}
          />
        ) : null}
      </dialog>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-3 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-[var(--lc-ink-3)] ${className}`}
    >
      {children}
    </th>
  );
}

function Row({
  link,
  selected,
  onOpen,
}: {
  link: RedirectLink;
  selected: boolean;
  onOpen: () => void;
}) {
  const { copied, copy } = useCopy(link.code);

  return (
    <tr
      role="button"
      tabIndex={0}
      aria-label={`Buka detail ${link.businessName}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer border-b border-[var(--lc-line-soft)] transition-colors last:border-b-0 hover:bg-[var(--lc-raised)]"
      style={selected ? { background: "var(--lc-accent-wash)" } : undefined}
    >
      <td className="px-3 py-3 pl-4 sm:pl-5">
        <div className="text-[0.875rem] font-medium leading-tight">{link.businessName}</div>
        <div className="lc-mono mt-1 text-[0.6875rem] text-[var(--lc-ink-3)]">/link/{link.code}</div>
      </td>
      <td className="hidden max-w-[22rem] truncate px-3 py-3 text-[0.8125rem] text-[var(--lc-ink-2)] md:table-cell">
        {link.destinationUrl}
      </td>
      <td className="px-3 py-3">
        <StatusDot active={link.active} />
      </td>
      <td className="lc-num hidden px-3 py-3 text-[0.8125rem] text-[var(--lc-ink-3)] sm:table-cell">
        {formatDate(link.createdAt)}
      </td>
      <td className="px-3 py-3 pr-4 text-right sm:pr-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void copy();
          }}
          className="rounded-md px-2 py-1 text-[0.75rem] font-medium text-[var(--lc-ink-3)] transition-colors hover:bg-[var(--lc-surface)] hover:text-[var(--lc-ink)]"
        >
          {copied ? "Tersalin" : "Salin"}
        </button>
      </td>
    </tr>
  );
}

function Drawer({ link, onClose }: { link: RedirectLink | null; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionState, FormData>(
    link ? saveLink : createLink,
    {},
  );
  const { copied, copy } = useCopy(link?.code ?? "");

  useEffect(() => {
    if (!state.ok) return;
    router.refresh();
    if (!link) onClose();
  }, [state.ok, link, router, onClose]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--lc-line)] px-6 py-5">
        <div className="grid gap-1.5">
          <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">
            {link ? link.businessName : "Tautan baru"}
          </h2>
          {link ? (
            <div className="flex flex-wrap items-center gap-3">
              <code className="lc-mono rounded-md bg-[var(--lc-raised)] px-2 py-1 text-[0.75rem]">
                /link/{link.code}
              </code>
              <StatusDot active={link.active} />
            </div>
          ) : (
            <p className="text-[0.8125rem] text-[var(--lc-ink-2)]">
              Kode dibuat otomatis setelah disimpan.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="-mr-2 -mt-1 rounded-lg px-2.5 py-1.5 text-[1.125rem] leading-none text-[var(--lc-ink-3)] transition-colors hover:bg-[var(--lc-raised)] hover:text-[var(--lc-ink)]"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form id="lc-form" action={action} className="grid gap-5">
          {link ? <input type="hidden" name="code" value={link.code} /> : null}
          <label className={label}>
            Nama bisnis
            <input
              name="businessName"
              defaultValue={link?.businessName}
              autoFocus={!link}
              placeholder="Kopi Senja"
              className={field}
            />
          </label>
          <label className={label}>
            URL tujuan
            <input
              name="destinationUrl"
              defaultValue={link?.destinationUrl}
              placeholder="g.page/r/..."
              className={field}
            />
          </label>
          <label className={label}>
            Catatan terima kasih
            <textarea
              name="thankYouNote"
              rows={3}
              defaultValue={link?.thankYouNote}
              placeholder="Kosongkan untuk memakai teks bawaan."
              className={field}
            />
          </label>
          <FormError state={state} />
        </form>

        {link ? (
          <div className="mt-10 grid gap-3 border-t border-[var(--lc-line-soft)] pt-6">
            <p className={label}>Aksi</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void copy()} className={ghost}>
                {copied ? "URL tersalin" : "Salin URL"}
              </button>
              <form action={toggleLink}>
                <input type="hidden" name="code" value={link.code} />
                <input type="hidden" name="active" value={link.active ? "false" : "true"} />
                <button type="submit" className={ghost}>
                  {link.active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </form>
              <form
                action={removeLink}
                onSubmit={(e) => {
                  if (!confirm(`Hapus /link/${link.code}? Tautan cetak akan mati permanen.`)) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="code" value={link.code} />
                <button type="submit" className={destructive}>
                  Hapus
                </button>
              </form>
            </div>
            <p className="max-w-[46ch] text-[0.75rem] leading-relaxed text-[var(--lc-ink-3)]">
              Menonaktifkan menahan pengunjung di halaman transisi. Menghapus mematikan kode
              cetak selamanya.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--lc-line)] px-6 py-4">
        <button type="submit" form="lc-form" disabled={pending} className={primary}>
          {pending ? "Menyimpan…" : link ? "Simpan perubahan" : "Buat tautan"}
        </button>
        {link && state.ok ? (
          <span className="text-[0.75rem] text-[var(--lc-accent-deep)]">Tersimpan</span>
        ) : null}
      </div>
    </div>
  );
}
