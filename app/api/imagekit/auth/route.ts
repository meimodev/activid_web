import "server-only";

import { isInvitationRegisterSessionValid, getInvitationRegisterSessionCookieName } from "@/lib/invitation-register-session";
import { createHmac, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const cookieName = getInvitationRegisterSessionCookieName();
  const sessionCookie = request.cookies.get(cookieName)?.value;
  if (!isInvitationRegisterSessionValid(sessionCookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
