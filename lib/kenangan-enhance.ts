import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  applyKenanganLutToRaw,
  getKenanganLutPreset,
  type KenanganLutId,
} from "@/data/kenangan-luts";
import { KENANGAN_IMAGEKIT_URL_BASE } from "@/types/kenangan";

// openai/gpt-image-2 — generative edit (ADR-0008). Conservative,
// identity-preserving prompt; `medium` quality keeps ~75% margin at the flat
// Rp 3,000/photo price. Runs via the official-model prediction endpoint.
const KENANGAN_ENHANCE_MODEL = "openai/gpt-image-2";
const KENANGAN_ENHANCE_PROMPT =
  "Restore and enhance this event photograph. Improve sharpness, reduce motion " +
  "blur and noise, correct exposure and white balance for natural skin tones, " +
  "and recover detail in shadows and highlights. Preserve the exact composition, " +
  "framing, people, faces, expressions, clothing, and background — do not add, " +
  "remove, reposition, or alter any person or object, and do not change anyone's " +
  "identity or facial features. Keep it fully photorealistic; no stylization, no " +
  "beautification.";

async function createReplicatePrediction(
  imageUrl: string,
  eventId: string,
  photoId: string,
  webhookOrigin: string,
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN!;
  const model = process.env.KENANGAN_REPLICATE_MODEL || KENANGAN_ENHANCE_MODEL;
  const webhook = `${webhookOrigin}/api/kenangan/replicate/webhook?eventId=${eventId}&photoId=${photoId}`;

  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt: KENANGAN_ENHANCE_PROMPT,
        input_images: [imageUrl],
        quality: "medium",
        aspect_ratio: "auto",
        background: "opaque",
        output_format: "jpeg",
        output_compression: 90,
        moderation: "low",
        number_of_images: 1,
      },
      webhook,
      webhook_events_filter: ["completed"],
    }),
  });
  if (!res.ok) {
    throw new Error(`Replicate prediction failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { id: string };
  return data.id;
}

/**
 * Public HTTPS origin Replicate posts the webhook back to. Prefers an explicit
 * `KENANGAN_WEBHOOK_ORIGIN`, else derives it from Vercel's injected production
 * URL (zero-config on Vercel), else the caller's fallback (e.g. request origin).
 */
export function kenanganWebhookOrigin(fallback?: string): string | undefined {
  return (
    process.env.KENANGAN_WEBHOOK_ORIGIN ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    fallback
  );
}

/**
 * Enqueue one gpt-image-2 enhancement for a photo: creates the async prediction
 * (webhook stores the result), flips the photo to `pending`, and records the job.
 * Shared by the host-triggered enhance route and the guest-order auto-enqueue on
 * admin confirmation (ADR-0008).
 */
export async function enqueueKenanganEnhance(
  eventId: string,
  photoId: string,
  originalPath: string,
  webhookOrigin: string,
): Promise<void> {
  const replicateId = await createReplicatePrediction(
    kenanganOriginalUrl(originalPath),
    eventId,
    photoId,
    webhookOrigin,
  );
  const eventRef = getAdminDb().collection("kenanganEvents").doc(eventId);
  await eventRef.collection("photos").doc(photoId).update({ enhanceState: "pending" });
  await eventRef.collection("jobs").doc(photoId).set({
    photoId,
    replicateId,
    status: "pending",
    error: null,
    createdAt: FieldValue.serverTimestamp(),
  });
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

/** Deterministic server-side re-grade: decode → apply LUT per pixel → JPEG. */
export async function applyKenanganLutToJpeg(
  input: Buffer,
  lutId: KenanganLutId,
): Promise<Buffer> {
  // ponytail: lazy import so merely importing this module doesn't dlopen
  // sharp's native libvips — only the enhance path pays that cost.
  const sharp = (await import("sharp")).default;
  const preset = getKenanganLutPreset(lutId);
  const { data, info } = await sharp(input)
    .rotate() // bake EXIF orientation before grading
    .raw()
    .toBuffer({ resolveWithObject: true });
  applyKenanganLutToRaw(data, info.channels, preset);
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Server-side ImageKit upload (private-key auth) for generated files. */
export async function uploadKenanganImage(
  buffer: Buffer,
  fileName: string,
  folder: string,
): Promise<string> {
  const privateKey = requiredEnv("IMAGEKIT_PRIVATE_KEY");
  const form = new FormData();
  form.append("file", buffer.toString("base64"));
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "false");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
    },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`ImageKit upload failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { filePath: string };
  return data.filePath;
}

/**
 * Grade `sourceUrl` (an original, or a Replicate enhancement output) with the
 * photo's stored LUT and store it under /kenangan/{eventId}/enhanced/.
 * Returns the stored ImageKit path.
 */
export async function gradeAndStoreKenanganPhoto(
  eventId: string,
  photoId: string,
  sourceUrl: string,
  lutId: KenanganLutId,
): Promise<string> {
  const source = await fetchImageBuffer(sourceUrl);
  const graded = await applyKenanganLutToJpeg(source, lutId);
  return uploadKenanganImage(graded, `${photoId}.jpg`, `/kenangan/${eventId}/enhanced`);
}

/**
 * Store a gpt-image-2 enhancement output (ADR-0008). The generative model owns
 * colour now — no LUT re-apply. It emits fixed aspect buckets, so crop/resize
 * back to the original dimensions to preserve framing, then store under
 * /kenangan/{eventId}/enhanced/. Returns the stored ImageKit path.
 */
export async function storeEnhancedKenanganPhoto(
  eventId: string,
  photoId: string,
  outputUrl: string,
  width?: number,
  height?: number,
): Promise<string> {
  const sharp = (await import("sharp")).default;
  const source = await fetchImageBuffer(outputUrl);
  let pipeline = sharp(source).rotate();
  if (width && height) {
    pipeline = pipeline.resize(width, height, { fit: "cover", position: "centre" });
  }
  const jpeg = await pipeline.jpeg({ quality: 90 }).toBuffer();
  return uploadKenanganImage(jpeg, `${photoId}.jpg`, `/kenangan/${eventId}/enhanced`);
}

export function kenanganOriginalUrl(originalPath: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${originalPath}`;
}

/** Prediction fields the settle path reads (webhook body or GET /predictions). */
export interface KenanganPredictionResult {
  id?: string;
  status?: string;
  output?: unknown;
  error?: unknown;
}

function pickOutputUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) {
    const last = output[output.length - 1];
    if (typeof last === "string") return last;
  }
  return null;
}

/**
 * Apply a terminal Replicate prediction to a photo: store the output under
 * /enhanced/ and set `enhancedPath`, or mark the photo `failed` so the host
 * can retry (ADR-0007). Shared by the webhook and the poll-side reconciler.
 * Returns true when the photo changed (caller busts the gallery cache).
 * Throws when storing the output fails, so the webhook can 500 → Replicate
 * retries.
 */
export async function settleKenanganEnhance(
  eventId: string,
  photoId: string,
  prediction: KenanganPredictionResult,
): Promise<boolean> {
  const eventRef = getAdminDb().collection("kenanganEvents").doc(eventId);
  const photoRef = eventRef.collection("photos").doc(photoId);
  const jobRef = eventRef.collection("jobs").doc(photoId);

  const photoSnap = await photoRef.get();
  if (!photoSnap.exists) return false;
  const photo = photoSnap.data()!;
  if (photo.enhancedPath) return false;

  const outputUrl = prediction.status === "succeeded" ? pickOutputUrl(prediction.output) : null;
  if (outputUrl) {
    // gpt-image-2 owns colour now — no LUT re-apply (ADR-0008). Crop the
    // output back to the original dimensions so framing is preserved.
    const enhancedPath = await storeEnhancedKenanganPhoto(
      eventId,
      photoId,
      outputUrl,
      photo.width as number | undefined,
      photo.height as number | undefined,
    );
    // Success: store the enhanced path and clear the in-flight flag (ADR-0007).
    await photoRef.update({ enhancedPath, enhanceState: FieldValue.delete() });
    await jobRef.set(
      { photoId, replicateId: prediction.id ?? null, status: "succeeded", error: null },
      { merge: true },
    );
  } else {
    // Failure: no fallback file — leave the photo showing its graded original
    // and mark the state so the host can retry (ADR-0007).
    await photoRef.update({ enhanceState: "failed" });
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
  return true;
}

function toMillis(value: unknown): number {
  const candidate = value as { toMillis?: () => number } | undefined;
  return typeof candidate?.toMillis === "function" ? candidate.toMillis() : 0;
}

// Webhooks get a minute's head start; each job is then re-checked at most once
// a minute (the host page polls every 8s while anything is pending).
const RECONCILE_MIN_AGE_MS = 60_000;
const RECONCILE_THROTTLE_MS = 60_000;

/**
 * Webhook-loss fallback: for photos still `pending`, ask Replicate directly
 * and settle any terminal prediction. Fired from the host photos poll (after
 * the response), so a lost or rejected webhook heals the next time the host
 * looks at the page. Returns true when any photo changed.
 */
export async function reconcileKenanganEnhances(
  eventId: string,
  photoIds: string[],
): Promise<boolean> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) return false;
  const eventRef = getAdminDb().collection("kenanganEvents").doc(eventId);
  let changed = false;
  for (const photoId of photoIds) {
    try {
      const jobRef = eventRef.collection("jobs").doc(photoId);
      const jobSnap = await jobRef.get();
      const job = jobSnap.data();
      const replicateId = job?.replicateId as string | undefined;
      if (!replicateId) continue;
      const now = Date.now();
      if (
        now - toMillis(job?.createdAt) < RECONCILE_MIN_AGE_MS ||
        now - toMillis(job?.lastReconcileAt) < RECONCILE_THROTTLE_MS
      ) {
        continue;
      }
      await jobRef.set({ lastReconcileAt: FieldValue.serverTimestamp() }, { merge: true });

      const res = await fetch(`https://api.replicate.com/v1/predictions/${replicateId}`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (!res.ok) continue;
      const prediction = (await res.json()) as KenanganPredictionResult & {
        data_removed?: boolean;
      };
      if (!["succeeded", "failed", "canceled"].includes(prediction.status ?? "")) continue;

      // Replicate expires output files — if the webhook was lost for too long
      // there is nothing left to store; mark failed so the host can retry.
      const effective: KenanganPredictionResult =
        prediction.status === "succeeded" && prediction.data_removed
          ? {
              id: prediction.id,
              status: "failed",
              error: "Replicate output expired before it could be stored",
            }
          : prediction;
      if (await settleKenanganEnhance(eventId, photoId, effective)) changed = true;
    } catch (err) {
      // Per-photo: a transient store failure retries on the next reconcile tick.
      console.error(`kenangan reconcile: photo ${photoId} failed`, err);
    }
  }
  return changed;
}
