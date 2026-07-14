"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import KkSpinner from "../KkSpinner";

export default function GoogleSignIn({
  redirectTo = "/kenangan/host/events",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function handleSignIn() {
    setBusy(true);
    setError(false);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/kenangan/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("session");
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={busy}
        className="kk-btn kk-btn-primary"
        style={{ marginTop: 28 }}
      >
        {busy ? (
          <>
            <KkSpinner />
            Memproses…
          </>
        ) : (
          "Masuk dengan Google"
        )}
      </button>
      {error ? (
        <p className="kk-form-error">Gagal masuk. Coba lagi.</p>
      ) : null}
    </>
  );
}
