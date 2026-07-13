import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import type { KenanganEvent } from "@/types/kenangan";
import HostConsole, { type ConsoleEvent } from "./HostConsole";

export const metadata: Metadata = { title: "Konsol Host" };

function createdAtMillis(event: KenanganEvent): number {
  const ts = event.createdAt as { toMillis?: () => number } | undefined;
  return ts?.toMillis?.() ?? 0;
}

export default async function KenanganHostEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>;
}) {
  const [session, { tab, error }] = await Promise.all([
    getKenanganHostSession(),
    searchParams,
  ]);
  if (!session) redirect("/kenangan/host");

  const col = getAdminDb().collection("kenanganEvents");
  // Admin sees every event (indexed orderBy). A host sees only their own; we
  // sort in code to avoid a composite (ownerUid + createdAt) index.
  const snap = session.isAdmin
    ? await col.orderBy("createdAt", "desc").limit(100).get()
    : await col.where("ownerUid", "==", session.uid).limit(100).get();
  const raw = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as KenanganEvent) }));
  if (!session.isAdmin) {
    raw.sort((a, b) => createdAtMillis(b) - createdAtMillis(a));
  }

  // Trim to a serializable shape (drop Firestore Timestamp) for the client shell.
  const events: ConsoleEvent[] = raw.map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    eventDate: e.eventDate,
    status: e.status,
  }));

  return (
    <HostConsole
      events={events}
      initialTab={tab === "create" ? "create" : "dashboard"}
      error={error}
    />
  );
}
