import "server-only";

import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import { createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return NextResponse.json(
      {
        error: "Server is missing ImageKit keys (IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY).",
      },
      { status: 500 },
    );
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60;
  const signature = createHmac("sha1", privateKey)
    .update(`${token}${expire}`)
    .digest("hex");

  return NextResponse.json({ token, expire, signature, publicKey });
}
