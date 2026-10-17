"use server";

import { cookies } from "next/headers";
import { getAdminPassword, matchesAdminPassword } from "@/lib/admin-password";
import { createInvitationAdminSessionCookieValue, getInvitationAdminSessionCookieName, getAdminSessionCookieOptions } from "./lib/invitation-admin-session";

export type VerifyAdminPasswordState = {
  ok?: boolean;
  error?: string;
};

export async function verifyAdminPassword(
  _prevState: VerifyAdminPasswordState,
  formData: FormData,
): Promise<VerifyAdminPasswordState> {
  if (!getAdminPassword()) {
    return { error: "Server is missing ADMIN_PASSWORD." };
  }

  const password = formData.get("password");
  if (!matchesAdminPassword(password)) {
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
