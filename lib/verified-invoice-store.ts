import "server-only";

import { randomUUID } from "node:crypto";
import { cache } from "react";
import { getAdminDb } from "@/lib/firebase-admin";
import { isVerificationCode, validateInvoice, type VerifiedInvoice } from "@/lib/verified-invoice";

const COLLECTION = "verifiedInvoices";

function readInvoice(code: string, data: FirebaseFirestore.DocumentData): VerifiedInvoice {
  return { ...validateInvoice(data), code, createdAt: Number(data.createdAt) };
}

// Request-only deduplication; payment status is never served from a stale cache.
export const getVerifiedInvoice = cache(async (code: string): Promise<VerifiedInvoice | null> => {
  if (!isVerificationCode(code)) return null;
  const doc = await getAdminDb().collection(COLLECTION).doc(code).get();
  return doc.exists ? readInvoice(code, doc.data() ?? {}) : null;
});

export async function listVerifiedInvoices(): Promise<VerifiedInvoice[]> {
  const snapshot = await getAdminDb().collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => readInvoice(doc.id, doc.data()));
}

export async function saveVerifiedInvoice(code: string, value: unknown): Promise<string> {
  const input = validateInvoice(value);
  const collection = getAdminDb().collection(COLLECTION);
  if (code) {
    if (!isVerificationCode(code)) throw new Error("Invalid verification code.");
    await collection.doc(code).update(input);
    return code;
  }
  const newCode = randomUUID().replaceAll("-", "");
  await collection.doc(newCode).create({ ...input, createdAt: Date.now() });
  return newCode;
}
