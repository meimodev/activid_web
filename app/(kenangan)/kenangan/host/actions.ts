"use server";

import { customAlphabet } from "nanoid";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import {
  KENANGAN_ADMIN_SUBJECT,
  createKenanganHostSessionCookieValue,
  getKenanganHostSession,
  getKenanganHostSessionCookieName,
  getKenanganHostSessionCookieOptions,
  type KenanganHostSession,
} from "@/lib/kenangan-host-session";
import { KENANGAN_DEFAULT_THEME_ID, isKenanganThemeId } from "@/data/kenangan-themes";
import { KENANGAN_TIERS, getKenanganTier } from "@/types/kenangan";

const SLUG_REGEX = /^[a-z0-9-]{3,40}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const accessCodeAlphabet = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 12);

function ensureEnabled(): void {
  if (!isKenanganEnabled()) notFound();
}

async function requireSession(eventId?: string): Promise<KenanganHostSession> {
  const session = await getKenanganHostSession();
  if (!session) redirect("/kenangan/host");
  if (eventId && !session.isAdmin && session.subject !== eventId) {
    redirect("/kenangan/host");
  }
  return session;
}

export async function kenanganHostLogin(formData: FormData): Promise<void> {
  ensureEnabled();
  const code = String(formData.get("accessCode") ?? "").trim();
  if (!code) redirect("/kenangan/host?error=1");

  let subject: string | null = null;
  const adminCode = process.env.KENANGAN_ADMIN_ACCESS_CODE;
  if (adminCode && code === adminCode) {
    subject = KENANGAN_ADMIN_SUBJECT;
  } else {
    const snap = await getAdminDb()
      .collection("kenanganEvents")
      .where("hostAccessCode", "==", code.toUpperCase())
      .limit(1)
      .get();
    if (!snap.empty) subject = snap.docs[0].id;
  }
  if (!subject) redirect("/kenangan/host?error=1");

  const store = await cookies();
  store.set(
    getKenanganHostSessionCookieName(),
    createKenanganHostSessionCookieValue(subject),
    getKenanganHostSessionCookieOptions(),
  );
  redirect(
    subject === KENANGAN_ADMIN_SUBJECT
      ? "/kenangan/host/events"
      : `/kenangan/host/events/${subject}`,
  );
}

export async function kenanganHostLogout(): Promise<void> {
  ensureEnabled();
  const store = await cookies();
  store.delete(getKenanganHostSessionCookieName());
  redirect("/kenangan/host");
}

export async function kenanganCreateEvent(formData: FormData): Promise<void> {
  ensureEnabled();
  const session = await requireSession();
  if (!session.isAdmin) redirect("/kenangan/host");

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const eventDate = String(formData.get("eventDate") ?? "").trim();

  if (!name || name.length > 120 || !SLUG_REGEX.test(slug) || !DATE_REGEX.test(eventDate)) {
    redirect("/kenangan/host/events?error=invalid");
  }

  const db = getAdminDb();
  const existing = await db
    .collection("kenanganEvents")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (!existing.empty) redirect("/kenangan/host/events?error=slug");

  const ref = await db.collection("kenanganEvents").add({
    slug,
    name,
    eventDate,
    coverUrl: "",
    tier: "standard",
    guestCap: getKenanganTier("standard").guestCap,
    themeId: KENANGAN_DEFAULT_THEME_ID,
    downloadMode: "after_publish",
    status: "draft",
    hostAccessCode: accessCodeAlphabet(),
    enhancementPurchased: false,
    createdAt: FieldValue.serverTimestamp(),
  });

  redirect(`/kenangan/host/events/${ref.id}`);
}

export async function kenanganUpdateEvent(formData: FormData): Promise<void> {
  ensureEnabled();
  const eventId = String(formData.get("eventId") ?? "");
  await requireSession(eventId);

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

  const db = getAdminDb();
  const ref = db.collection("kenanganEvents").doc(eventId);
  const snap = await ref.get();
  if (!snap.exists) redirect("/kenangan/host/events");

  await ref.update({
    name,
    eventDate,
    coverUrl,
    themeId,
    downloadMode,
    tier,
    guestCap: getKenanganTier(tier).guestCap,
  });
  await revalidateKenanganEvent(snap.data()?.slug as string);
  redirect(`${back}?saved=1`);
}

export async function kenanganSetEventStatus(formData: FormData): Promise<void> {
  ensureEnabled();
  const eventId = String(formData.get("eventId") ?? "");
  const status = String(formData.get("status") ?? "");
  await requireSession(eventId);

  // "published" goes through the publish flow, never this action.
  if (!["draft", "live", "closed"].includes(status)) {
    redirect(`/kenangan/host/events/${eventId}?error=invalid`);
  }

  const db = getAdminDb();
  const ref = db.collection("kenanganEvents").doc(eventId);
  const snap = await ref.get();
  if (!snap.exists) redirect("/kenangan/host/events");
  if (snap.data()?.status === "published") {
    redirect(`/kenangan/host/events/${eventId}?error=published`);
  }

  await ref.update({ status });
  await revalidateKenanganEvent(snap.data()?.slug as string);
  redirect(`/kenangan/host/events/${eventId}?saved=1`);
}

/** Host requests the paid AI-enhanced gallery: creates a pending order. */
export async function kenanganRequestEnhancement(formData: FormData): Promise<void> {
  ensureEnabled();
  const eventId = String(formData.get("eventId") ?? "");
  await requireSession(eventId);

  const db = getAdminDb();
  const eventSnap = await db.collection("kenanganEvents").doc(eventId).get();
  if (!eventSnap.exists) redirect("/kenangan/host/events");
  const event = eventSnap.data()!;
  if (event.enhancementPurchased) {
    redirect(`/kenangan/host/events/${eventId}?saved=1`);
  }

  // One order per event; no orderBy to avoid a composite index.
  const existing = await db
    .collection("kenanganOrders")
    .where("eventId", "==", eventId)
    .get();
  if (existing.docs.some((doc) => ["pending", "confirmed"].includes(doc.data().status))) {
    redirect(`/kenangan/host/events/${eventId}?saved=1`);
  }

  await db.collection("kenanganOrders").add({
    eventId,
    amountIdr: getKenanganTier(event.tier as string).priceIdr,
    status: "pending",
    confirmedAt: null,
    createdAt: FieldValue.serverTimestamp(),
  });
  redirect(`/kenangan/host/events/${eventId}?saved=1`);
}

/** Admin confirms a manual payment: order confirmed + enhancement unlocked. */
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
  await db
    .collection("kenanganEvents")
    .doc(order.eventId as string)
    .update({ enhancementPurchased: true });
  redirect(`/kenangan/host/events/${order.eventId}?saved=1`);
}
