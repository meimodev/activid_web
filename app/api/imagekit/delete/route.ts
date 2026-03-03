import "server-only";

import { isInvitationRegisterSessionValid, getInvitationRegisterSessionCookieName } from "@/lib/invitation-register-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  if (!isInvitationRegisterSessionValid(sessionCookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "Server is missing ImageKit key (IMAGEKIT_PRIVATE_KEY)." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const fileId = (body as { fileId?: unknown } | null)?.fileId;
  if (!fileId || typeof fileId !== "string") {
    return NextResponse.json({ error: "fileId is required" }, { status: 400 });
  }

  const auth = Buffer.from(`${privateKey}:`).toString("base64");

  const res = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text || "Delete failed." }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
