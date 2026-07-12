import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import { kenanganHostLogin } from "./actions";

export const metadata: Metadata = { title: "Masuk Host" };

export default async function KenanganHostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [session, { error }] = await Promise.all([getKenanganHostSession(), searchParams]);
  if (session) {
    redirect(
      session.isAdmin ? "/kenangan/host/events" : `/kenangan/host/events/${session.subject}`,
    );
  }

  return (
    <main className="kk-page" style={{ justifyContent: "center" }}>
      <p className="kk-brand">Kita</p>
      <h1 className="kk-landing-title" style={{ textAlign: "center" }}>
        Masuk Host
      </h1>
      <p className="kk-landing-date" style={{ textAlign: "center" }}>
        Masukkan kode akses acaramu.
      </p>

      <form action={kenanganHostLogin} className="kk-form" style={{ marginTop: 28 }}>
        <label className="kk-label" htmlFor="accessCode">
          Kode Akses
        </label>
        <input
          id="accessCode"
          name="accessCode"
          className="kk-input"
          autoComplete="off"
          autoCapitalize="characters"
          required
        />
        {error ? (
          <p className="kk-form-error">Kode akses tidak ditemukan. Periksa kembali.</p>
        ) : null}
        <button type="submit" className="kk-btn kk-btn-primary">
          Masuk
        </button>
      </form>
    </main>
  );
}
