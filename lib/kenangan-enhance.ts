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
