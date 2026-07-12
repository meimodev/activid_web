import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled, revalidateKenanganEvent } from "@/lib/kenangan-event";
import { getKenanganHostSession } from "@/lib/kenangan-host-session";
import {
  gradeAndStoreKenanganPhoto,
  kenanganOriginalUrl,
} from "@/lib/kenangan-enhance";
import { isKenanganLutId } from "@/data/kenangan-luts";

// Grading/enqueueing a full keeper batch can take minutes.
export const maxDuration = 300;

// nightmareai/real-esrgan — Real-ESRGAN with GFPGAN face restore built in
// (face_enhance: true). Restorative only, 2x cap per spec §6.
const DEFAULT_REPLICATE_VERSION =
  "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

interface KeeperPhoto {
  id: string;
  originalPath: string;
  lutId: string;
  enhancedPath?: string;
}

async function createReplicatePrediction(
  keeper: KeeperPhoto,
  eventId: string,
  webhookOrigin: string,
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN!;
  const version = process.env.KENANGAN_REPLICATE_VERSION || DEFAULT_REPLICATE_VERSION;
  const webhook = `${webhookOrigin}/api/kenangan/replicate/webhook?eventId=${eventId}&photoId=${keeper.id}`;

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input: {
        image: kenanganOriginalUrl(keeper.originalPath),
        scale: 2,
        face_enhance: true,
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

export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";
  if (!eventId) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const session = await getKenanganHostSession();
  if (!session || (!session.isAdmin && session.subject !== eventId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  const eventRef = db.collection("kenanganEvents").doc(eventId);
  const eventSnap = await eventRef.get();
  if (!eventSnap.exists) {
    return NextResponse.json({ error: "Acara tidak ditemukan." }, { status: 404 });
  }
  const event = eventSnap.data()!;
  if (event.status !== "closed") {
    return NextResponse.json(
      { error: "Tutup acara terlebih dahulu sebelum mempublikasikan galeri." },
      { status: 409 },
    );
  }

  const keepersSnap = await eventRef
    .collection("photos")
    .where("status", "==", "keeper")
    .get();
  if (keepersSnap.empty) {
    return NextResponse.json(
      { error: "Belum ada foto terpilih. Pilih foto terbaik terlebih dahulu." },
      { status: 400 },
    );
  }

  const keepers: KeeperPhoto[] = keepersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      originalPath: data.originalPath as string,
      lutId: isKenanganLutId(data.lutId) ? data.lutId : "natural",
      enhancedPath: data.enhancedPath as string | undefined,
    };
  });

  const useReplicate = Boolean(
    event.enhancementPurchased && process.env.REPLICATE_API_TOKEN,
  );
  const webhookOrigin =
    process.env.KENANGAN_WEBHOOK_ORIGIN || request.nextUrl.origin;

  let enqueued = 0;
  let graded = 0;
  let failed = 0;

  // ponytail: sequential-ish loop inside one 300s invocation; move to a queue
  // (QStash) only if real batches start hitting the timeout (~>150 keepers).
  for (const keeper of keepers) {
    if (keeper.enhancedPath) continue; // idempotent re-run after a timeout
    const photoRef = eventRef.collection("photos").doc(keeper.id);
    try {
      if (useReplicate) {
        const replicateId = await createReplicatePrediction(keeper, eventId, webhookOrigin);
        await eventRef.collection("jobs").doc(keeper.id).set({
          photoId: keeper.id,
          replicateId,
          status: "pending",
          error: null,
          createdAt: FieldValue.serverTimestamp(),
        });
        enqueued++;
      } else {
        // No enhancement: publish the LUT-graded original at full res.
        const enhancedPath = await gradeAndStoreKenanganPhoto(
          eventId,
          keeper.id,
          kenanganOriginalUrl(keeper.originalPath),
          isKenanganLutId(keeper.lutId) ? keeper.lutId : "natural",
        );
        await photoRef.update({ enhancedPath });
        graded++;
      }
    } catch (err) {
      failed++;
      console.error(`kenangan publish: photo ${keeper.id} failed`, err);
    }
  }

  await eventRef.update({
    status: "published",
    publishedAt: FieldValue.serverTimestamp(),
  });
  await revalidateKenanganEvent(event.slug as string);

  return NextResponse.json({
    ok: true,
    keepers: keepers.length,
    enqueued,
    graded,
    failed,
  });
}
