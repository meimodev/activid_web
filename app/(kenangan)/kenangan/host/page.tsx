import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import GoogleSignIn from "./GoogleSignIn";

export const metadata: Metadata = { title: "Masuk Host" };

export default async function KenanganHostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; tier?: string }>;
}) {
  const [session, { tab, tier }] = await Promise.all([
    getKenanganHostSession(),
    searchParams,
  ]);
  // Carry the landing's tier/tab intent through login into the console.
  const params = new URLSearchParams();
  if (tab) params.set("tab", tab);
  if (tier) params.set("tier", tier);
  const qs = params.toString();
  const dest = `/kenangan/host/events${qs ? `?${qs}` : ""}`;
  if (session) redirect(dest);

  return (
    <main className="kk-page" style={{ justifyContent: "center" }}>
      <p className="kk-brand">KenanganKita</p>
      <h1 className="kk-landing-title" style={{ textAlign: "center" }}>
        Masuk Host
      </h1>
      <p className="kk-landing-date" style={{ textAlign: "center" }}>
        Masuk dengan akun Google untuk mengelola acaramu.
      </p>

      <GoogleSignIn redirectTo={dest} />
    </main>
  );
}
