import "server-only";

import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  const isAdmin = isInvitationRegisterSessionValid(sessionCookie);
  if (!isAdmin) {
    const affiliateIdRaw = request.cookies.get("inv_affiliate")?.value;
    const affiliateId = (affiliateIdRaw ?? "").trim().toUpperCase();
    const isAffiliateId = /^[A-Z0-9]{12}$/.test(affiliateId);
    const affiliateSessionCookie = isAffiliateId
      ? request.cookies.get(getInvitationAffiliateSessionCookieName())?.value
      : undefined;
    const isAffiliate =
      isAffiliateId && isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateId);
    if (!isAffiliate) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.TINYPNG_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing TinyPNG key (TINYPNG_API_KEY)." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!file.type || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const auth = Buffer.from(`api:${apiKey}`).toString("base64");

  let shrinkRes: Response;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    shrinkRes = await fetch("https://api.tinify.com/shrink", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": file.type,
      },
      body: bytes,
    });
  } catch {
    return NextResponse.json({ error: "TinyPNG request failed." }, { status: 502 });
  }

  if (!shrinkRes.ok) {
    const text = await shrinkRes.text();
    return NextResponse.json({ error: text || "TinyPNG optimization failed." }, { status: 502 });
  }

  let shrinkJson: unknown;
  try {
    shrinkJson = await shrinkRes.json();
  } catch {
    shrinkJson = null;
  }

  const outputUrl = (shrinkJson as { output?: { url?: unknown } } | null)?.output?.url;
  if (!outputUrl || typeof outputUrl !== "string") {
    return NextResponse.json({ error: "TinyPNG optimization failed." }, { status: 502 });
  }

  let outputRes: Response;
  try {
    outputRes = await fetch(outputUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "TinyPNG output download failed." }, { status: 502 });
  }

  if (!outputRes.ok) {
    const text = await outputRes.text();
    return NextResponse.json({ error: text || "TinyPNG output download failed." }, { status: 502 });
  }

  const contentType = outputRes.headers.get("content-type") || file.type || "application/octet-stream";
  const outputBytes = Buffer.from(await outputRes.arrayBuffer());

  return new NextResponse(outputBytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "X-Optimized": "1",
    },
  });
}
