"use server";

import { isAffiliateId, normalizeWhatsappNumberE164 } from "@/lib/affiliate-config";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  createInvitationAffiliateSessionCookieValue,
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { customAlphabet } from "nanoid";
import { cookies } from "next/headers";
import { promisify } from "util";

const generateAffiliateId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 12);
const scrypt = promisify(scryptCallback) as unknown as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value;
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const buf = await scrypt(password, salt, 64);
  return buf.toString("hex");
}

function normalizeAffiliateId(raw: string): string {
  return (raw ?? "").trim().toUpperCase();
}

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export type RegisterAffiliateState = {
  ok?: boolean;
  affiliateId?: string;
  error?: string;
};

export type LoginAffiliateState = {
  ok?: boolean;
  affiliateId?: string;
  error?: string;
};

export type UpdateAffiliateProfileState = {
  ok?: boolean;
  error?: string;
};

export type ChangeAffiliatePasswordState = {
  ok?: boolean;
  error?: string;
};

export async function registerAffiliate(
  _prevState: RegisterAffiliateState,
  formData: FormData,
): Promise<RegisterAffiliateState> {
  const name = readString(formData, "name").trim();
  const whatsappNumber = normalizeWhatsappNumberE164(readString(formData, "whatsappNumber"));
  const password = readString(formData, "password");
  const confirmPassword = readString(formData, "confirmPassword");

  if (!name) {
    return { error: "Name is required." };
  }

  if (!whatsappNumber) {
    return { error: "WhatsApp number is required (start with 8, no leading 0)." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const affiliateId = generateAffiliateId();
  const salt = randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(password, salt);

  try {
    await getAdminDb()
      .collection("invitationAffiliates")
      .doc(affiliateId)
      .create({
        name,
        whatsappNumber,
        enabled: true,
        joinedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        passwordSalt: salt,
        passwordHash,
        generatedInvitationCount: 0,
        lastGeneratedInvitationAt: null,
      });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to register." };
  }

  const cookieStore = await cookies();
  const cookieName = getInvitationAffiliateSessionCookieName();
  let cookieValue: string;
  try {
    cookieValue = createInvitationAffiliateSessionCookieValue(affiliateId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create session." };
  }

  cookieStore.set(cookieName, cookieValue, getSessionCookieOptions());
  return { ok: true, affiliateId };
}

export async function loginAffiliate(
  _prevState: LoginAffiliateState,
  formData: FormData,
): Promise<LoginAffiliateState> {
  const affiliateId = normalizeAffiliateId(readString(formData, "affiliateId"));
  const password = readString(formData, "password");

  if (!affiliateId || !isAffiliateId(affiliateId)) {
    return { error: "Invalid affiliate id." };
  }

  if (!password) {
    return { error: "Password is required." };
  }

  const snap = await getAdminDb().collection("invitationAffiliates").doc(affiliateId).get();
  if (!snap.exists) {
    return { error: "Affiliate not found." };
  }

  const data = snap.data() as {
    enabled?: unknown;
    passwordSalt?: unknown;
    passwordHash?: unknown;
  };

  if (!data || data.enabled === false) {
    return { error: "Affiliate disabled." };
  }

  const salt = typeof data.passwordSalt === "string" ? data.passwordSalt : "";
  const expectedHash = typeof data.passwordHash === "string" ? data.passwordHash : "";
  if (!salt || !expectedHash) {
    return { error: "Affiliate is missing password setup." };
  }

  const actualHash = await hashPassword(password, salt);
  try {
    const ok = timingSafeEqual(
      Buffer.from(actualHash, "hex"),
      Buffer.from(expectedHash, "hex"),
    );
    if (!ok) {
      return { error: "Invalid password." };
    }
  } catch {
    return { error: "Invalid password." };
  }

  const cookieStore = await cookies();
  const cookieName = getInvitationAffiliateSessionCookieName();
  let cookieValue: string;
  try {
    cookieValue = createInvitationAffiliateSessionCookieValue(affiliateId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create session." };
  }

  cookieStore.set(cookieName, cookieValue, getSessionCookieOptions());
  return { ok: true, affiliateId };
}

export async function logoutAffiliate(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(getInvitationAffiliateSessionCookieName(), "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function updateAffiliateProfile(
  _prevState: UpdateAffiliateProfileState,
  formData: FormData,
): Promise<UpdateAffiliateProfileState> {
  const affiliateId = normalizeAffiliateId(readString(formData, "affiliateId"));
  if (!affiliateId || !isAffiliateId(affiliateId)) {
    return { error: "Invalid affiliate id." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationAffiliateSessionCookieName())?.value;
  if (!isInvitationAffiliateSessionValid(sessionCookie, affiliateId)) {
    return { error: "Unauthorized." };
  }

  const name = readString(formData, "name").trim();
  const whatsappNumber = normalizeWhatsappNumberE164(readString(formData, "whatsappNumber"));

  if (!name) {
    return { error: "Name is required." };
  }

  if (!whatsappNumber) {
    return { error: "WhatsApp number is required (start with 8, no leading 0)." };
  }

  await getAdminDb()
    .collection("invitationAffiliates")
    .doc(affiliateId)
    .set(
      {
        name,
        whatsappNumber,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return { ok: true };
}

export async function changeAffiliatePassword(
  _prevState: ChangeAffiliatePasswordState,
  formData: FormData,
): Promise<ChangeAffiliatePasswordState> {
  const affiliateId = normalizeAffiliateId(readString(formData, "affiliateId"));
  if (!affiliateId || !isAffiliateId(affiliateId)) {
    return { error: "Invalid affiliate id." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationAffiliateSessionCookieName())?.value;
  if (!isInvitationAffiliateSessionValid(sessionCookie, affiliateId)) {
    return { error: "Unauthorized." };
  }

  const currentPassword = readString(formData, "currentPassword");
  const newPassword = readString(formData, "newPassword");
  const confirmPassword = readString(formData, "confirmPassword");

  if (!newPassword || newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const snap = await getAdminDb().collection("invitationAffiliates").doc(affiliateId).get();
  if (!snap.exists) {
    return { error: "Affiliate not found." };
  }

  const data = snap.data() as { passwordSalt?: unknown; passwordHash?: unknown };
  const salt = typeof data.passwordSalt === "string" ? data.passwordSalt : "";
  const expectedHash = typeof data.passwordHash === "string" ? data.passwordHash : "";
  if (!salt || !expectedHash) {
    return { error: "Affiliate is missing password setup." };
  }

  if (!currentPassword) {
    return { error: "Current password is required." };
  }

  const currentHash = await hashPassword(currentPassword, salt);
  try {
    const ok = timingSafeEqual(
      Buffer.from(currentHash, "hex"),
      Buffer.from(expectedHash, "hex"),
    );
    if (!ok) {
      return { error: "Invalid current password." };
    }
  } catch {
    return { error: "Invalid current password." };
  }

  const newSalt = randomBytes(16).toString("hex");
  const newHash = await hashPassword(newPassword, newSalt);

  await getAdminDb()
    .collection("invitationAffiliates")
    .doc(affiliateId)
    .set(
      {
        passwordSalt: newSalt,
        passwordHash: newHash,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return { ok: true };
}
