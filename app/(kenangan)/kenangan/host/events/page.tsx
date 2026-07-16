import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { getAdminDb } from "@/lib/firebase-admin";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import type { KenanganEvent, KenanganHost } from "@/types/kenangan";
import HostConsole, { type ConsoleEvent } from "./HostConsole";

export const metadata: Metadata = { title: "Konsol Host" };

function createdAtMillis(event: KenanganEvent): number {
  const ts = event.createdAt as { toMillis?: () => number } | undefined;
  return ts?.toMillis?.() ?? 0;
}

function formatDate(iso: string): string {
  const dt = DateTime.fromISO(iso).setLocale("id");
  return dt.isValid ? dt.toFormat("d MMM yyyy") : iso;
}

export default async function KenanganHostEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; tier?: string; error?: string }>;
}) {
  const [session, { tab, tier, error }] = await Promise.all([
    getKenanganHostSession(),
    searchParams,
  ]);
  if (!session) redirect("/kenangan/host");

  const db = getAdminDb();
  const col = db.collection("kenanganEvents");
  // Admin sees every event (indexed orderBy). A host sees only their own; we
  // sort in code to avoid a composite (ownerUid + createdAt) index.
  const [snap, hostSnap] = await Promise.all([
    session.isAdmin
      ? col.orderBy("createdAt", "desc").limit(100).get()
      : col.where("ownerUid", "==", session.uid).limit(100).get(),
    db.collection("kenanganHosts").doc(session.uid).get(),
  ]);
  const host = hostSnap.data() as KenanganHost | undefined;
  const raw = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as KenanganEvent) }));
  if (!session.isAdmin) {
    raw.sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
  }

  // Trim to a serializable shape (drop Firestore Timestamp) for the client shell.
  const events: ConsoleEvent[] = raw.map((e) => ({
    id: e.id,
    name: e.name,
    eventType: e.eventType,
    slug: e.slug,
    eventDate: formatDate(e.eventDate),
    status: e.status,
  }));

  return (
    <HostConsole
      events={events}
      initialTab={tab === "create" ? "create" : "dashboard"}
      initialTier={tier}
      error={error}
      isAdmin={session.isAdmin}
      email={session.email}
      name={host?.name ?? null}
      photoUrl={host?.photoUrl ?? null}
    />
  );
}
