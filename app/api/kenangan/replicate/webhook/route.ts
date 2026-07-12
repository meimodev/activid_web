import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import {
  gradeAndStoreKenanganPhoto,
  kenanganOriginalUrl,
} from "@/lib/kenangan-enhance";
import { isKenanganLutId, type KenanganLutId } from "@/data/kenangan-luts";

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

function pickOutputUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    const last = output[output.length - 1];
    if (typeof last === "string") return last;
  }
  return null;
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
  const photoRef = eventRef.collection("photos").doc(photoId);
  const jobRef = eventRef.collection("jobs").doc(photoId);

  const [eventSnap, photoSnap] = await Promise.all([eventRef.get(), photoRef.get()]);
  if (!eventSnap.exists || !photoSnap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const photo = photoSnap.data()!;
  if (photo.enhancedPath) {
    return NextResponse.json({ ok: true, skipped: "already enhanced" });
  }

  const lutId: KenanganLutId = isKenanganLutId(photo.lutId) ? photo.lutId : "natural";
  const outputUrl = prediction.status === "succeeded" ? pickOutputUrl(prediction.output) : null;

  try {
    if (outputUrl) {
      // AI owns pixels, the LUT owns colour: re-apply the stored LUT to the
      // enhanced output at full res so the gallery matches the guest preview.
      const enhancedPath = await gradeAndStoreKenanganPhoto(eventId, photoId, outputUrl, lutId);
      await photoRef.update({ enhancedPath, status: "enhanced" });
      await jobRef.set(
        { photoId, replicateId: prediction.id ?? null, status: "succeeded", error: null },
        { merge: true },
      );
    } else {
      // Failure path: never a mangled face — publish the LUT-graded original.
      const enhancedPath = await gradeAndStoreKenanganPhoto(
        eventId,
        photoId,
        kenanganOriginalUrl(photo.originalPath as string),
        lutId,
      );
      await photoRef.update({ enhancedPath, status: "failed" });
      await jobRef.set(
        {
          photoId,
          replicateId: prediction.id ?? null,
          status: prediction.status ?? "failed",
          error: typeof prediction.error === "string" ? prediction.error : null,
        },
        { merge: true },
      );
    }
  } catch (err) {
    console.error(`kenangan webhook: photo ${photoId} grading failed`, err);
    await jobRef.set(
      { photoId, status: "error", error: String(err) },
      { merge: true },
    );
    // 500 -> Replicate retries the webhook
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  await revalidateKenanganEvent(eventSnap.data()!.slug as string);
  return NextResponse.json({ ok: true });
}
