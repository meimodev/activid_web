"use server";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import { enqueueKenanganEnhance } from "@/lib/kenangan-enhance";
import {
  canAccessEvent,
  getKenanganHostSession,
  getKenanganHostSessionCookieName,
  type KenanganHostSession,
} from "@/lib/kenangan-host-session";
import { isKenanganThemeId } from "@/data/kenangan-themes";
import { kenanganCoverForTheme } from "@/data/kenangan-covers";
import { KENANGAN_TIERS, getKenanganTier, isKenanganEventType, isKenanganPublished, kenanganOrderKind, type KenanganOrder } from "@/types/kenangan";

const SLUG_REGEX = /^[a-z0-9-]{3,200}$/;
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
  const eventType = String(formData.get("eventType") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "").trim();
  // From the cover picker's hidden input: a staging upload or a default cover.
  // Empty → fall back to the theme's default cover below.
  const coverUrl = String(formData.get("coverUrl") ?? "").trim();

  if (
    !name || name.length > 120 ||
    !SLUG_REGEX.test(slug) ||
    !DATE_REGEX.test(eventDate) ||
    !KENANGAN_TIERS.some((t) => t.id === tier) ||
    !isKenanganEventType(eventType) ||
    !isKenanganThemeId(themeId) ||
    coverUrl.length > 500 ||
    (coverUrl && !coverUrl.startsWith("https://"))
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
    eventType,
    ownerUid: session.uid,
    eventDate,
    coverUrl: coverUrl || kenanganCoverForTheme(themeId),
    tier,
    guestCap: getKenanganTier(tier).guestCap,
    themeId,
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
  const tier = String(formData.get("tier") ?? "");

  const back = `/kenangan/host/events/${eventId}`;
  if (
    !name || name.length > 120 ||
    !DATE_REGEX.test(eventDate) ||
    coverUrl.length > 500 ||
    (coverUrl && !coverUrl.startsWith("https://")) ||
    !isKenanganThemeId(themeId) ||
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

  // Only two transitions exist: draft→live (open) and live→closed (publish).
  if (!["live", "closed"].includes(status)) {
    redirect(`/kenangan/host/events/${eventId}?error=invalid`);
  }

  const { ref, data } = await requireOwnedEvent(session, eventId);
  // Closed is terminal and IS published (ADR-0007) — no reopen, ever.
  if (isKenanganPublished(data.status as string)) {
    redirect(`/kenangan/host/events/${eventId}?error=closed`);
  }

  if (status === "live") {
    if (data.status !== "draft") {
      redirect(`/kenangan/host/events/${eventId}?error=invalid`);
    }
    // Going Live requires a confirmed Paket payment. See ADR-0005.
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
    await ref.update({ status: "live" });
  } else {
    // status === "closed": publish. Only from live.
    if (data.status !== "live") {
      redirect(`/kenangan/host/events/${eventId}?error=invalid`);
    }
    await ref.update({ status: "closed", publishedAt: FieldValue.serverTimestamp() });
  }

  await revalidateKenanganEvent(data.slug as string);
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

  // Where to land after confirming. The Payment desk passes "/kenangan/host/payments"
  // to stay put; the event page passes nothing and falls back to itself. Only
  // internal /kenangan paths allowed (no open redirect).
  const returnToRaw = String(formData.get("returnTo") ?? "");
  const returnTo = returnToRaw.startsWith("/kenangan/") ? returnToRaw : "";

  const db = getAdminDb();
  const orderRef = db.collection("kenanganOrders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) redirect("/kenangan/host/events");
  const order = orderSnap.data()!;

  await orderRef.update({ status: "confirmed", confirmedAt: FieldValue.serverTimestamp() });
  if (kenanganOrderKind(order) === "enhancement") {
    const eventId = order.eventId as string;
    const photoIds = Array.isArray(order.photoIds) ? (order.photoIds as string[]) : [];
    const paidBy = order.paidBy === "guest" ? "guest" : "host";
    if (photoIds.length > 0) {
      // Per-photo model (ADR-0008): mark exactly the paid photos.
      const eventRef = db.collection("kenanganEvents").doc(eventId);
      const batch = db.batch();
      for (const photoId of photoIds) {
        batch.update(eventRef.collection("photos").doc(photoId), {
          paid: true,
          paidBy,
          paidOrderId: orderId,
          paidAt: FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();

      // Guest orders auto-enqueue the enhance on confirm — the guest has no
      // trigger UI (ADR-0008). Host orders stay host-paced. Needs a public
      // webhook origin; if unset, photos stay paid and the host can enhance.
      if (paidBy === "guest") {
        const origin = process.env.KENANGAN_WEBHOOK_ORIGIN;
        if (origin) {
          const snaps = await db.getAll(
            ...photoIds.map((id) => eventRef.collection("photos").doc(id)),
          );
          for (const snap of snaps) {
            const data = snap.data();
            if (snap.exists && data && !data.enhancedPath && data.enhanceState !== "pending") {
              try {
                await enqueueKenanganEnhance(eventId, snap.id, data.originalPath as string, origin);
              } catch (err) {
                console.error(`kenangan confirm: auto-enhance ${snap.id} failed`, err);
              }
            }
          }
        } else {
          console.warn(
            "kenangan confirm: KENANGAN_WEBHOOK_ORIGIN unset — guest photos paid but not auto-enqueued",
          );
        }
      }
    } else {
      // Legacy flat-unlock order (no photoIds): grandfather the whole event.
      await db.collection("kenanganEvents").doc(eventId).update({ enhancementPurchased: true });
    }
  }
  redirect(returnTo ? `${returnTo}?saved=1` : `/kenangan/host/events/${order.eventId}?saved=1`);
}
