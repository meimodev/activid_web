import "server-only";

import sharp from "sharp";
import {
  applyKenanganLutToRaw,
  getKenanganLutPreset,
  type KenanganLutId,
} from "@/data/kenangan-luts";
import { KENANGAN_IMAGEKIT_URL_BASE } from "@/types/kenangan";

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

export function kenanganOriginalUrl(originalPath: string): string {
  return `${KENANGAN_IMAGEKIT_URL_BASE}${originalPath}`;
}
