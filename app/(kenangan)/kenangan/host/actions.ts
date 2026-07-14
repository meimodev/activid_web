"use server";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import {
  canAccessEvent,
  getKenanganHostSession,
  getKenanganHostSessionCookieName,
  type KenanganHostSession,
} from "@/lib/kenangan-host-session";
import { KENANGAN_DEFAULT_THEME_ID, isKenanganThemeId } from "@/data/kenangan-themes";
import { KENANGAN_TIERS, getKenanganTier, kenanganOrderKind, type KenanganOrder } from "@/types/kenangan";

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function ensureEnabled(): void {
  if (!isKenanganEnabled()) notFound();
}

async function requireSession(): Promise<KenanganHostSession> {
  const session = await getKenanganHostSession();
  if (!session) redirect("/kenangan/host");
  return session;
}

/** Fetch an event ref+data, authorize the session against its owner, or redirect. */
async function requireOwnedEvent(session: KenanganHostSession, eventId: string) {
  const ref = getAdminDb().collection("kenanganEvents").doc(eventId);
  const snap = await ref.get();
  if (!snap.exists) redirect("/kenangan/host/events");
  const data = snap.data()!;
  if (!canAccessEvent(session, data.ownerUid as string | undefined)) {
    redirect("/kenangan/host/events");
  }
  return { ref, data };
}

export async function kenanganHostLogout(): Promise<void> {
  ensureEnabled();
  // Session cookie is cleared here; sign-out of the Firebase client happens
  // in the browser (best-effort) but the server cookie is the source of truth.
  const store = await cookies();
  store.delete(getKenanganHostSessionCookieName());
  redirect("/kenangan/host");
}

export async function kenanganCreateEvent(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const tier = String(formData.get("tier") ?? "").trim();

  if (
    !name || name.length > 120 ||
    !SLUG_REGEX.test(slug) ||
    !DATE_REGEX.test(eventDate) ||
    !KENANGAN_TIERS.some((t) => t.id === tier)
  ) {
    redirect("/kenangan/host/events?tab=create&error=invalid");
  }

  const db = getAdminDb();
  const existing = await db
    .collection("kenanganEvents")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (!existing.empty) redirect("/kenangan/host/events?tab=create&error=slug");

  const ref = await db.collection("kenanganEvents").add({
    slug,
    name,
    ownerUid: session.uid,
    eventDate,
    coverUrl: "",
    tier,
    guestCap: getKenanganTier(tier).guestCap,
    themeId: KENANGAN_DEFAULT_THEME_ID,
    downloadMode: "after_publish",
    status: "draft",
    enhancementPurchased: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Upfront Paket charge: a pending order the Admin confirms before the event
  // may go Live. See ADR-0005.
  await db.collection("kenanganOrders").add({
    eventId: ref.id,
    kind: "paket",
    amountIdr: getKenanganTier(tier).priceIdr,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  redirect(`/kenangan/host/events/${ref.id}`);
}

export async function kenanganUpdateEvent(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();
  const eventId = String(formData.get("eventId") ?? "");

  const name = String(formData.get("name") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "");
  const downloadMode = String(formData.get("downloadMode") ?? "");
  const tier = String(formData.get("tier") ?? "");

  const back = `/kenangan/host/events/${eventId}`;
  if (
    !name || name.length > 120 ||
    !DATE_REGEX.test(eventDate) ||
    coverUrl.length > 500 ||
    (coverUrl && !coverUrl.startsWith("https://")) ||
    !isKenanganThemeId(themeId) ||
    !["after_publish", "instant_share"].includes(downloadMode) ||
    !KENANGAN_TIERS.some((t) => t.id === tier)
  ) {
    redirect(`${back}?error=invalid`);
  }

  const { ref, data } = await requireOwnedEvent(session, eventId);
  const db = getAdminDb();

  // Paket order for this event, if any (pending or confirmed).
  const paketSnap = await db
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .get();
  const paketOrder = paketSnap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as KenanganOrder) }))
    .find((o) => kenanganOrderKind(o) === "paket" && ["pending", "confirmed"].includes(o.status));

  // A confirmed Paket locks the tier (money already moved). Reject a changed
  // tier; the form disables the control, this guards the server. See ADR-0005.
  if (paketOrder?.status === "confirmed" && tier !== data.tier) {
    redirect(`${back}?error=paket-locked`);
  }

  await ref.update({
    name,
    eventDate,
    coverUrl,
    themeId,
    downloadMode,
    tier,
    guestCap: getKenanganTier(tier).guestCap,
  });

  // Re-selecting a Paket before payment rewrites the pending order's amount.
  if (paketOrder?.status === "pending" && tier !== data.tier) {
    await db
      .collection("kenanganOrders")
      .doc(paketOrder.id)
      .update({ amountIdr: getKenanganTier(tier).priceIdr });
  }

  await revalidateKenanganEvent(data.slug as string);
  redirect(`${back}?saved=1`);
}

export async function kenanganSetEventStatus(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();
  const eventId = String(formData.get("eventId") ?? "");
  const status = String(formData.get("status") ?? "");

  // "published" goes through the publish flow, never this action.
  if (!["draft", "live", "closed"].includes(status)) {
    redirect(`/kenangan/host/events/${eventId}?error=invalid`);
  }

  const { ref, data } = await requireOwnedEvent(session, eventId);
  if (data.status === "published") {
    redirect(`/kenangan/host/events/${eventId}?error=published`);
  }

  // Going Live requires a confirmed Paket payment. See ADR-0005.
  if (status === "live") {
    const paketSnap = await getAdminDb()
      .collection("kenanganOrders")
      .where("eventId", "==", eventId)
      .get();
    const paketPaid = paketSnap.docs
      .map((doc) => doc.data())
      .some((o) => kenanganOrderKind(o) === "paket" && o.status === "confirmed");
    if (!paketPaid) {
      redirect(`/kenangan/host/events/${eventId}?error=paket-unpaid`);
    }
  }

  await ref.update({ status });
  await revalidateKenanganEvent(data.slug as string);
  redirect(`/kenangan/host/events/${eventId}?saved=1`);
}

/** Host requests the paid AI-enhanced gallery: creates a pending order. */
export async function kenanganRequestEnhancement(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();
  const eventId = String(formData.get("eventId") ?? "");

  const db = getAdminDb();
  const { data: event } = await requireOwnedEvent(session, eventId);
  if (event.enhancementPurchased) {
    redirect(`/kenangan/host/events/${eventId}?saved=1`);
  }

  // At most one enhancement order per event; no orderBy to avoid a composite
  // index. Ignore Paket orders here — they share the collection.
  const existing = await db
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .get();
  if (
    existing.docs.some(
      (doc) =>
        kenanganOrderKind(doc.data()) === "enhancement" &&
        ["pending", "confirmed"].includes(doc.data().status),
    )
  ) {
    redirect(`/kenangan/host/events/${eventId}?saved=1`);
  }

  await db.collection("kenanganOrders").add({
    eventId,
    kind: "enhancement",
    amountIdr: getKenanganTier(event.tier as string).priceIdr,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });
  redirect(`/kenangan/host/events/${eventId}?saved=1`);
}

/** Admin confirms a manual payment. Paket confirm just ungates going Live;
 *  enhancement confirm also unlocks the AI gallery. See ADR-0005. */
export async function kenanganConfirmOrder(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();
  if (!session.isAdmin) redirect("/kenangan/host");

  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId) redirect("/kenangan/host/events");

  const db = getAdminDb();
  const orderRef = db.collection("kenanganOrders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) redirect("/kenangan/host/events");
  const order = orderSnap.data()!;

  await orderRef.update({ status: "confirmed", confirmedAt: FieldValue.serverTimestamp() });
  if (kenanganOrderKind(order) === "enhancement") {
    await db
      .collection("kenanganEvents")
      .doc(order.eventId as string)
      .update({ enhancementPurchased: true });
  }
  redirect(`/kenangan/host/events/${order.eventId}?saved=1`);
}
