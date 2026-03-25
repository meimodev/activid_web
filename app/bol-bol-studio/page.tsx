import { Timestamp } from "firebase-admin/firestore";
import BolBolStudioClient from "./_components/BolBolStudioClient";
import { BB_DEFAULTS, BB_FIRESTORE, normalizeStudioInfo, type Account, type AddOn, type Booking, type StudioInfo, type StudioPackage } from "./config";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

function toMillis(value: unknown): number {
  if (typeof value === "number") return value;
  if (value instanceof Timestamp) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
}

export default async function BolBolStudioPage() {
  let bookingsData: Booking[] = [];
  let packagesData: StudioPackage[] = [];
  let accountsData: Account[] = [];
  let addsOnData: AddOn[] = [];
  let studioInfo: StudioInfo = {
    ...normalizeStudioInfo(undefined),
    timeStepMinutes: BB_DEFAULTS.TIME_STEP_MINUTES,
    packages: [],
    addsOn: [],
  };

  try {
    const db = getAdminDb();

    const bookingsSnapshot = await db.collection(BB_FIRESTORE.BOOKINGS_COLLECTION).get();
    bookingsData = bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: String(data.name ?? ""),
        phone: String(data.phone ?? ""),
        note: data.note ? String(data.note) : "",
        package: data.package ? String(data.package) : "",
        start: toMillis(data.start),
        end: toMillis(data.end),
        booking_timestamp: toMillis(data.booking_timestamp),
      };
    });

    const packagesSnapshot = await db.collection(BB_FIRESTORE.PACKAGES_COLLECTION).get();
    packagesData = packagesSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<StudioPackage, "id">) }));

    const accountsSnapshot = await db.collection(BB_FIRESTORE.ACCOUNTS_COLLECTION).get();
    accountsData = accountsSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Account, "id">) }));

    const addsDoc = await db.collection(BB_FIRESTORE.ADDS_COLLECTION).doc(BB_FIRESTORE.ADDS_DOC_ID).get();
    if (addsDoc.exists) {
      const data = addsDoc.data() ?? {};
      const titles = Array.isArray(data.titles) ? data.titles : [];
      const prices = Array.isArray(data.prices) ? data.prices : [];
      addsOnData = titles.map((title, index) => ({ title: String(title), price: Number(prices[index] ?? 0) }));
    }

    const publicDoc = await db.collection(BB_FIRESTORE.PUBLIC_COLLECTION).doc(BB_FIRESTORE.PUBLIC_DOC_ID).get();
    const publicData = publicDoc.exists ? (publicDoc.data() as Partial<StudioInfo>) : undefined;
    studioInfo = {
      ...normalizeStudioInfo(publicData),
      timeStepMinutes: BB_DEFAULTS.TIME_STEP_MINUTES,
      packages: packagesData,
      addsOn: addsOnData,
    };
  } catch {
    studioInfo = {
      ...normalizeStudioInfo(undefined),
      timeStepMinutes: BB_DEFAULTS.TIME_STEP_MINUTES,
      packages: packagesData,
      addsOn: addsOnData,
    };
  }

  return <BolBolStudioClient bookingsData={bookingsData} accountsData={accountsData} studioInfo={studioInfo} />;
}
