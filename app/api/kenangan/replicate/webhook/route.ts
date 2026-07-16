import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import { settleKenanganEnhance } from "@/lib/kenangan-enhance";

export const maxDuration = 120;

const PHOTO_ID_REGEX = /^[0-9a-z]{16}$/;
const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

/**
 * Replicate signs webhooks with the svix scheme:
 * base64(HMAC-SHA256(base64decode(secret after "whsec_"), "{id}.{timestamp}.{body}"))
 * against the webhook-id / webhook-timestamp / webhook-signature headers.
 */
function verifyReplicateSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.REPLICATE_WEBHOOK_SECRET;
  if (!secret) return false;

  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signatures = request.headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;

  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > TIMESTAMP_TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);

  return signatures.split(" ").some((entry) => {
    const candidate = Buffer.from(entry.split(",")[1] ?? "");
    try {
      return candidate.length === expectedBuf.length && timingSafeEqual(candidate, expectedBuf);
    } catch {
      return false;
    }
  });
}

export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rawBody = await request.text();
  if (!verifyReplicateSignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const eventId = request.nextUrl.searchParams.get("eventId") ?? "";
  const photoId = request.nextUrl.searchParams.get("photoId") ?? "";
  if (!eventId || !PHOTO_ID_REGEX.test(photoId)) {
    return NextResponse.json({ error: "Bad params" }, { status: 400 });
  }

  let prediction: { id?: string; status?: string; output?: unknown; error?: unknown };
  try {
    prediction = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }

  const db = getAdminDb();
  const eventRef = db.collection("kenanganEvents").doc(eventId);

  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const changed = await settleKenanganEnhance(eventId, photoId, prediction);
    if (!changed) {
      return NextResponse.json({ ok: true, skipped: "already settled" });
    }
  } catch (err) {
    console.error(`kenangan webhook: photo ${photoId} grading failed`, err);
    await eventRef
      .collection("jobs")
      .doc(photoId)
      .set({ photoId, status: "error", error: String(err) }, { merge: true });
    // 500 -> Replicate retries the webhook
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  await revalidateKenanganEvent(eventSnap.data()!.slug as string);
  return NextResponse.json({ ok: true });
}
