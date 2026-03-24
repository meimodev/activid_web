import "server-only";

import { cache } from "react";

import { getAdminDb } from "@/lib/firebase-admin";

import {
  BB_DEFAULTS,
  BB_FIRESTORE,
  StudioAddOn,
  StudioBooking,
  StudioPackage,
  StudioPageData,
  normalizeStudioInfo,
} from "./shared";

function toMillis(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return ((value as { toDate: () => Date }).toDate()).getTime();
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const parsed = new Date(String(value)).getTime();
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function toStudioPackage(id: string, raw: Record<string, unknown>): StudioPackage {
  return {
    id,
    name: typeof raw.name === "string" ? raw.name : "Paket",
    price: typeof raw.price === "number" ? raw.price : 0,
    duration: typeof raw.duration === "number" ? raw.duration : 0,
    capacity: typeof raw.capacity === "number" ? raw.capacity : 0,
    notes: Array.isArray(raw.notes)
      ? raw.notes.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      : [],
  };
}

function toStudioBooking(id: string, raw: Record<string, unknown>): StudioBooking {
  return {
    id,
    startMs: toMillis(raw.start),
    endMs: toMillis(raw.end),
    bookingTimestampMs: toMillis(raw.booking_timestamp ?? raw.start),
    name: typeof raw.name === "string" ? raw.name : "Tanpa nama",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    note: typeof raw.note === "string" ? raw.note : "",
    package: typeof raw.package === "string" ? raw.package : "",
    instagram: typeof raw.instagram === "string" ? raw.instagram : undefined,
  };
}

function toAddsOn(raw: Record<string, unknown>): StudioAddOn[] {
  const titles = Array.isArray(raw.titles) ? raw.titles : [];
  const prices = Array.isArray(raw.prices) ? raw.prices : [];

  return titles
    .map((title, index) => ({
      title: typeof title === "string" ? title : "",
      price: typeof prices[index] === "number" ? prices[index] : 0,
    }))
    .filter((item) => item.title.trim().length > 0);
}

export const getBolBolStudioPageData = cache(async (): Promise<StudioPageData> => {
  try {
    const db = getAdminDb();

    const [bookingsSnapshot, packagesSnapshot, addsSnapshot, publicSnapshot] = await Promise.all([
      db.collection(BB_FIRESTORE.BOOKINGS_COLLECTION).get(),
      db.collection(BB_FIRESTORE.PACKAGES_COLLECTION).get(),
      db.collection(BB_FIRESTORE.ADDS_COLLECTION).doc(BB_FIRESTORE.ADDS_DOC_ID).get(),
      db.collection(BB_FIRESTORE.PUBLIC_COLLECTION).doc(BB_FIRESTORE.PUBLIC_DOC_ID).get(),
    ]);

    const bookings = bookingsSnapshot.docs.map((doc) =>
      toStudioBooking(doc.id, doc.data() as Record<string, unknown>),
    );
    const packages = packagesSnapshot.docs.map((doc) =>
      toStudioPackage(doc.id, doc.data() as Record<string, unknown>),
    );
    const addsOn = addsSnapshot.exists ? toAddsOn((addsSnapshot.data() ?? {}) as Record<string, unknown>) : [];

    const studioInfo = {
      ...normalizeStudioInfo(publicSnapshot.exists ? publicSnapshot.data() : undefined),
      timeStepMinutes: BB_DEFAULTS.TIME_STEP_MINUTES,
      packages,
      addsOn,
    };

    return {
      bookings,
      studioInfo,
      warning: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Bol Bol Studio data.";

    return {
      bookings: [],
      studioInfo: {
        ...normalizeStudioInfo(undefined),
        timeStepMinutes: BB_DEFAULTS.TIME_STEP_MINUTES,
        packages: [],
        addsOn: [],
      },
      warning: message,
    };
  }
});

export async function verifyBolBolAdmin(phone: string, pin: string) {
  if (!phone.trim() || !pin.trim()) return false;

  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection(BB_FIRESTORE.ACCOUNTS_COLLECTION)
      .where("phone", "==", phone.trim())
      .limit(5)
      .get();

    return snapshot.docs.some((doc) => {
      const data = doc.data() as Record<string, unknown>;
      return data.pin === pin && data.admin === true;
    });
  } catch {
    return false;
  }
}
