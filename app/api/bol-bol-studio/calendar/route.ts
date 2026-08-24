import "server-only";

import { createHash } from "node:crypto";
import { JWT } from "google-auth-library";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { BB_DEFAULTS, BB_FIRESTORE, type StudioInfo } from "@/app/bol-bol-studio/config";
import {
  buildCalendarEvent,
  resolveDurationMinutes,
  validateSlot,
} from "@/app/bol-bol-studio/calendar-event";

const MAX_REQUESTS_PER_IP_PER_DAY = 10;
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

let cachedJwt: JWT | null = null;

function getJwtClient(clientEmail: string, privateKey: string): JWT {
  if (cachedJwt) return cachedJwt;
  cachedJwt = new JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: [CALENDAR_SCOPE],
  });
  return cachedJwt;
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

/** Hashed so the quota doc does not become a log of visitor IPs. */
function quotaKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  return `${day}_${createHash("sha1").update(ip).digest("hex").slice(0, 16)}`;
}

/**
 * Insert with a client-supplied id; a repeat of the same slot+phone collides
 * (409) and is patched instead, so re-confirming never stacks duplicates.
 */
async function upsertEvent(
  client: JWT,
  calendarId: string,
  event: ReturnType<typeof buildCalendarEvent>,
): Promise<Response> {
  const { token } = await client.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  const body = JSON.stringify(event);

  const inserted = await fetch(base, { method: "POST", headers, body });
  if (inserted.status !== 409) return inserted;

  return fetch(`${base}/${event.id}`, { method: "PUT", headers, body });
}

export async function POST(request: NextRequest) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!calendarId || !clientEmail || !privateKey) {
    return NextResponse.json({ error: "Kalender belum dikonfigurasi." }, { status: 503 });
  }

  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;

  const startMs = Number(body.startMs);
  const name = readString(body, "name");
  const phone = readString(body, "phone");
  const packageName = readString(body, "packageName");
  if (!Number.isFinite(startMs) || !name || !phone || !packageName) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const db = getAdminDb();

  // Admin credentials arrive from the same untrusted client as everything else,
  // so they are verified here rather than taken on the caller's word.
  const adminPhone = readString(body, "adminPhone");
  const adminPin = readString(body, "adminPin");
  let isAdmin = false;
  if (adminPhone && adminPin) {
    const accounts = await db
      .collection(BB_FIRESTORE.ACCOUNTS_COLLECTION)
      .where("phone", "==", adminPhone)
      .get();
    isAdmin = accounts.docs.some((doc) => {
      const data = doc.data();
      return data.pin === adminPin && data.admin !== false;
    });
  }

  // The client may not pick its own session length: duration is re-derived from
  // the priced package. An admin booking carries an explicit end instead.
  let durationMinutes: number;
  if (isAdmin && Number.isFinite(Number(body.endMs))) {
    durationMinutes = (Number(body.endMs) - startMs) / 60000;
  } else {
    const packages = await db
      .collection(BB_FIRESTORE.PACKAGES_COLLECTION)
      .where("name", "==", packageName)
      .get();
    if (packages.empty && !isAdmin) {
      return NextResponse.json({ error: "Paket tidak dikenal." }, { status: 400 });
    }
    durationMinutes = resolveDurationMinutes(packages.docs[0]?.data()?.duration);
  }

  if (!isAdmin) {
    const publicDoc = await db
      .collection(BB_FIRESTORE.PUBLIC_COLLECTION)
      .doc(BB_FIRESTORE.PUBLIC_DOC_ID)
      .get();
    const hours = (publicDoc.data() as Partial<StudioInfo> | undefined)?.openingHours;
    const rejection = validateSlot({
      startMs,
      durationMinutes,
      openMinutes: hours?.openMinutes ?? BB_DEFAULTS.OPENING_HOURS.openMinutes,
      closeMinutes: hours?.closeMinutes ?? BB_DEFAULTS.OPENING_HOURS.closeMinutes,
      nowMs: Date.now(),
    });
    if (rejection) {
      return NextResponse.json({ error: `Jadwal ditolak: ${rejection}.` }, { status: 400 });
    }

    const quotaRef = db.collection(BB_FIRESTORE.CALENDAR_QUOTA_COLLECTION).doc(quotaKey(request));
    try {
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(quotaRef);
        const count = (snap.data()?.count as number | undefined) ?? 0;
        if (count >= MAX_REQUESTS_PER_IP_PER_DAY) throw new Error("RATE_LIMITED");
        tx.set(
          quotaRef,
          {
            count: count + 1,
            ...(snap.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
          },
          { merge: true },
        );
      });
    } catch (err) {
      if (err instanceof Error && err.message === "RATE_LIMITED") {
        return NextResponse.json({ error: "Terlalu banyak permintaan hari ini." }, { status: 429 });
      }
      throw err;
    }
  }

  const event = buildCalendarEvent({
    startMs,
    durationMinutes,
    name,
    phone,
    instagram: readString(body, "instagram"),
    packageName,
    packageCapacity: Number.isFinite(Number(body.packageCapacity))
      ? Number(body.packageCapacity)
      : undefined,
    backgroundName: readString(body, "backgroundName"),
    note: readString(body, "note"),
    confirmed: isAdmin,
  });

  const response = await upsertEvent(getJwtClient(clientEmail, privateKey), calendarId, event);
  if (!response.ok) {
    console.error("[bol-bol-studio] calendar upsert failed", response.status, await response.text());
    return NextResponse.json({ error: "Gagal menulis ke kalender." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, eventId: event.id });
}
