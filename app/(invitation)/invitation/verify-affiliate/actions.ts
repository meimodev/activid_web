"use server";

import { cookies } from "next/headers";
import { createInvitationAdminSessionCookieValue, getInvitationAdminSessionCookieName, getAdminSessionCookieOptions } from "./lib/invitation-admin-session";

export type VerifyAdminPasswordState = {
  ok?: boolean;
  error?: string;
};

export async function verifyAdminPassword(
  _prevState: VerifyAdminPasswordState,
  formData: FormData,
): Promise<VerifyAdminPasswordState> {
  const expectedPassword = process.env.INVITATION_ADMIN_PASSWORD;
  if (!expectedPassword) {
    return { error: "Server is missing INVITATION_ADMIN_PASSWORD." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || password !== expectedPassword) {
    return { error: "Invalid password." };
  }

  const cookieName = getInvitationAdminSessionCookieName();
  let cookieValue: string;
  try {
    cookieValue = await createInvitationAdminSessionCookieValue();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create session." };
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieName, cookieValue, getAdminSessionCookieOptions());

  return { ok: true };
}
