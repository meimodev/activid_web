import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import { canAccessEvent, getKenanganHostSession } from "@/lib/kenangan-host-session";

/** Delete a host-uploaded cover from ImageKit. Guards:
 *  - host session must own the event
 *  - the file's ImageKit path must live under /kenangan/{eventId}/, so a
 *    forged fileId can't wipe the shared /kenangan/defaults/ covers or another
 *    event's photos. */
export async function POST(request: NextRequest) {
  if (!isKenanganEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await getKenanganHostSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const eventId = typeof body?.eventId === "string" ? body.eventId : "";
  const fileId = typeof body?.fileId === "string" ? body.fileId : "";
  if (!fileId) {
    return NextResponse.json({ error: "fileId is required" }, { status: 400 });
  }

  // The path prefix — not the client-supplied ids — is what actually protects
  // the defaults folder and other hosts' files. With an eventId: verify
  // ownership, guard /kenangan/{eventId}/. Without one (staging cover from the
  // create form): guard the host's own /kenangan/_staging/{uid}/ folder.
  let guardPrefix: string;
  if (eventId) {
    const snap = await getAdminDb().collection("kenanganEvents").doc(eventId).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!canAccessEvent(session, snap.data()?.ownerUid as string | undefined)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    guardPrefix = `/kenangan/${eventId}/`;
  } else {
    guardPrefix = `/kenangan/_staging/${session.uid}/`;
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "Server is missing ImageKit key (IMAGEKIT_PRIVATE_KEY)." },
      { status: 500 },
    );
  }
  const auth = Buffer.from(`${privateKey}:`).toString("base64");

  // Resolve the file's real path before deleting — the path guard, not the
  // client-supplied eventId, is what protects the defaults folder.
  const detailRes = await fetch(
    `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}/details`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  if (!detailRes.ok) {
    // Already gone (404) is a success from the caller's point of view.
    if (detailRes.status === 404) return NextResponse.json({ ok: true });
    const text = await detailRes.text();
    return NextResponse.json({ error: text || "Lookup failed." }, { status: 502 });
  }
  const detail = (await detailRes.json().catch(() => null)) as { filePath?: unknown } | null;
  const filePath = typeof detail?.filePath === "string" ? detail.filePath : "";
  if (!filePath.startsWith(guardPrefix)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const delRes = await fetch(
    `https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE", headers: { Authorization: `Basic ${auth}` } },
  );
  if (!delRes.ok && delRes.status !== 404) {
    const text = await delRes.text();
    return NextResponse.json({ error: text || "Delete failed." }, { status: delRes.status });
  }

  return NextResponse.json({ ok: true });
}
