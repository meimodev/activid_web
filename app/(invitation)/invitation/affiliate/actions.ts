"use server";

import {
  isAffiliateId,
  normalizeWhatsappNumber,
  normalizeWhatsappNumberE164,
} from "@/lib/affiliate-config";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  createInvitationAffiliateSessionCookieValue,
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
  getSessionCookieOptions,
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

export async function hashPassword(password: string, salt: string): Promise<string> {
  const buf = await scrypt(password, salt, 64);
  return buf.toString("hex");
}

function normalizeAffiliateId(raw: string): string {
  return (raw ?? "").trim().toUpperCase();
}

function isAlreadyExistsError(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  return code === 6 || code === "already-exists";
}


function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value;
}

export type RegisterAffiliateState = {
  ok?: boolean;
  affiliateId?: string;
  duplicateUnverified?: boolean;
  existingAffiliateId?: string;
  existingName?: string;
  existingWhatsappNumber?: string;
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

  const whatsappDigits = normalizeWhatsappNumber(whatsappNumber);
  if (!whatsappDigits) {
    return { error: "WhatsApp number is required (start with 8, no leading 0)." };
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const db = getAdminDb();

  function stateFromExistingAffiliateDoc(
    affiliateId: string,
    data: { [key: string]: unknown } | undefined,
  ): RegisterAffiliateState {
    const enabled = data?.enabled !== false;
    if (enabled) {
      return { error: "WhatsApp number already registered." };
    }

    const existingName = typeof data?.name === "string" ? data.name : "";
    const existingWhatsappNumber = typeof data?.whatsappNumber === "string" ? data.whatsappNumber : "";
    return {
      duplicateUnverified: true,
      existingAffiliateId: affiliateId,
      existingName,
      existingWhatsappNumber,
    };
  }

  try {
    const existing = await db
      .collection("invitationAffiliates")
      .where("whatsappNumber", "==", whatsappNumber)
      .limit(1)
      .get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      return stateFromExistingAffiliateDoc(doc.id, doc.data() as { [key: string]: unknown });
    }
  } catch {}

  const salt = randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(password, salt);

  const whatsappIndexRef = db.collection("invitationAffiliateWhatsappIndex").doc(whatsappDigits);

  try {
    const indexSnap = await whatsappIndexRef.get();
    if (indexSnap.exists) {
      const indexData = (indexSnap.data() ?? {}) as { affiliateId?: unknown };
      const existingAffiliateId =
        typeof indexData.affiliateId === "string" ? normalizeAffiliateId(indexData.affiliateId) : "";
      if (!existingAffiliateId || !isAffiliateId(existingAffiliateId)) {
        return { error: "WhatsApp number already registered." };
      }

      try {
        const existingAffiliateSnap = await db
          .collection("invitationAffiliates")
          .doc(existingAffiliateId)
          .get();
        if (!existingAffiliateSnap.exists) {
          return { error: "WhatsApp number already registered." };
        }

        return stateFromExistingAffiliateDoc(
          existingAffiliateId,
          existingAffiliateSnap.data() as { [key: string]: unknown },
        );
      } catch {
        return { error: "WhatsApp number already registered." };
      }
    }
  } catch {}

  let affiliateId = "";
  let registered = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    affiliateId = generateAffiliateId();
    const affiliateRef = db.collection("invitationAffiliates").doc(affiliateId);
    try {
      await db.runTransaction(async (tx) => {
        tx.create(whatsappIndexRef, {
          affiliateId,
          whatsappDigits,
          whatsappNumber,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        tx.create(affiliateRef, {
          name,
          whatsappNumber,
          enabled: false,
          verificationStatus: "pending",
          verificationRequestedAt: null,
          joinedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          passwordSalt: salt,
          passwordHash,
          generatedInvitationCount: 0,
          lastGeneratedInvitationAt: null,
        });
      });
      registered = true;
      break;
    } catch (err) {
      if (isAlreadyExistsError(err)) {
        try {
          const indexSnap = await whatsappIndexRef.get();
          if (indexSnap.exists) {
            const indexData = (indexSnap.data() ?? {}) as { affiliateId?: unknown };
            const existingAffiliateId =
              typeof indexData.affiliateId === "string"
                ? normalizeAffiliateId(indexData.affiliateId)
                : "";
            if (!existingAffiliateId || !isAffiliateId(existingAffiliateId)) {
              return { error: "WhatsApp number already registered." };
            }

            try {
              const existingAffiliateSnap = await db
                .collection("invitationAffiliates")
                .doc(existingAffiliateId)
                .get();
              if (!existingAffiliateSnap.exists) {
                return { error: "WhatsApp number already registered." };
              }

              return stateFromExistingAffiliateDoc(
                existingAffiliateId,
                existingAffiliateSnap.data() as { [key: string]: unknown },
              );
            } catch {
              return { error: "WhatsApp number already registered." };
            }
          }
        } catch {}

        continue;
      }
      return { error: err instanceof Error ? err.message : "Failed to register." };
    }
  }

  if (!registered) {
    return { error: "Failed to register." };
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
    return { error: "Affiliate pending verification." };
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

  const whatsappDigits = normalizeWhatsappNumber(whatsappNumber);
  if (!whatsappDigits) {
    return { error: "WhatsApp number is required (start with 8, no leading 0)." };
  }

  const db = getAdminDb();

  try {
    const existing = await db
      .collection("invitationAffiliates")
      .where("whatsappNumber", "==", whatsappNumber)
      .limit(2)
      .get();
    const dupDoc = existing.docs.find((d) => d.id !== affiliateId);
    if (dupDoc) {
      return { error: "WhatsApp number already registered." };
    }
  } catch {}

  const affiliateRef = db.collection("invitationAffiliates").doc(affiliateId);
  const newIndexRef = db.collection("invitationAffiliateWhatsappIndex").doc(whatsappDigits);

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(affiliateRef);
      if (!snap.exists) {
        throw new Error("Affiliate not found.");
      }

      const existingData = (snap.data() ?? {}) as { whatsappNumber?: unknown };
      const currentWhatsapp =
        typeof existingData.whatsappNumber === "string" ? existingData.whatsappNumber : "";
      const currentDigits = currentWhatsapp ? normalizeWhatsappNumber(currentWhatsapp) : "";

      const indexSnap = await tx.get(newIndexRef);
      const owner = (indexSnap.data() as { affiliateId?: unknown } | undefined)?.affiliateId;

      if (indexSnap.exists && owner && owner !== affiliateId) {
        throw new Error("WhatsApp number already registered.");
      }

      if (!indexSnap.exists) {
        tx.create(newIndexRef, {
          affiliateId,
          whatsappDigits,
          whatsappNumber,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        tx.set(
          newIndexRef,
          {
            affiliateId,
            whatsappDigits,
            whatsappNumber,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      }

      tx.set(
        affiliateRef,
        {
          name,
          whatsappNumber,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      if (currentDigits && currentDigits !== whatsappDigits) {
        const oldIndexRef = db.collection("invitationAffiliateWhatsappIndex").doc(currentDigits);
        const oldIndexSnap = await tx.get(oldIndexRef);
        const oldOwner = (oldIndexSnap.data() as { affiliateId?: unknown } | undefined)?.affiliateId;
        if (oldIndexSnap.exists && oldOwner === affiliateId) {
          tx.delete(oldIndexRef);
        }
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save profile." };
  }

  return { ok: true };
}

export async function verifyAffiliateAction(
  affiliateId: string,
): Promise<{ ok?: boolean; error?: string }> {
  try {
    const db = getAdminDb();
    await db.collection("invitationAffiliates").doc(affiliateId).update({
      enabled: true,
      verificationStatus: "verified",
      updatedAt: FieldValue.serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to verify affiliate." };
  }
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
