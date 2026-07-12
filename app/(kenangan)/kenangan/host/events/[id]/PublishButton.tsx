"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublishButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function publish() {
    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/kenangan/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(data?.error ?? "Gagal mempublikasikan galeri.");
        return;
      }
      router.refresh();
    } catch {
      setErrorMsg("Gagal mempublikasikan galeri. Periksa koneksi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <button type="button" className="kk-btn kk-btn-primary" onClick={publish} disabled={busy}>
        {busy ? "Mempublikasikan…" : "Publikasikan Galeri"}
      </button>
      {errorMsg ? <p className="kk-form-error" style={{ marginTop: 8 }}>{errorMsg}</p> : null}
    </div>
  );
}
