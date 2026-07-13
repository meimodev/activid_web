import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import GoogleSignIn from "./GoogleSignIn";

export const metadata: Metadata = { title: "Masuk Host" };

export default async function KenanganHostLoginPage() {
  const session = await getKenanganHostSession();
  if (session) redirect("/kenangan/host/events");

  return (
    <main className="kk-page" style={{ justifyContent: "center" }}>
      <p className="kk-brand">KenanganKita</p>
      <h1 className="kk-landing-title" style={{ textAlign: "center" }}>
        Masuk Host
      </h1>
      <p className="kk-landing-date" style={{ textAlign: "center" }}>
        Masuk dengan akun Google untuk mengelola acaramu.
      </p>

      <GoogleSignIn />
    </main>
  );
}
