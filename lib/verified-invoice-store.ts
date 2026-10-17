import "server-only";

import { randomUUID } from "node:crypto";
import { cache } from "react";
import { getAdminDb } from "@/lib/firebase-admin";
import { currentInvoiceDate, InvoiceConflictError, invoicePaymentSummary, isVerificationCode, readVerifiedInvoice, validateInvoice, type VerifiedInvoice } from "@/lib/verified-invoice";

const COLLECTION = "verifiedInvoices";

// Request-only deduplication; payment status is never served from a stale cache.
export const getVerifiedInvoice = cache(async (code: string): Promise<VerifiedInvoice | null> => {
  if (!isVerificationCode(code)) return null;
  const doc = await getAdminDb().collection(COLLECTION).doc(code).get();
  return doc.exists ? readVerifiedInvoice(code, doc.data()) : null;
});

export async function listVerifiedInvoices(): Promise<VerifiedInvoice[]> {
  const snapshot = await getAdminDb().collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => readVerifiedInvoice(doc.id, doc.data()));
}

export async function saveVerifiedInvoice(code: string, value: unknown, expectedRevision?: number): Promise<string> {
  const input = validateInvoice(value);
  const db = getAdminDb();
  const collection = db.collection(COLLECTION);
  if (code) {
    if (!isVerificationCode(code)) throw new Error("Invalid verification code.");
    const ref = collection.doc(code);
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      if (!doc.exists) throw new Error("Invoice not found.");
      const current = readVerifiedInvoice(code, doc.data());
      if (current.revision !== expectedRevision) throw new InvoiceConflictError();
      transaction.update(ref, { ...input, status: invoicePaymentSummary(input).status, revision: current.revision + 1 });
    });
    return code;
  }
  const newCode = randomUUID().replaceAll("-", "");
  const year = currentInvoiceDate().slice(0, 4);
  const counterRef = db.collection("verificationCounters").doc(`invoices-${year}`);
  await db.runTransaction(async (transaction) => {
    const counter = await transaction.get(counterRef);
    let sequence = Number(counter.data()?.sequence ?? 0);
    if (!Number.isSafeInteger(sequence) || sequence < 0) throw new Error("Invalid invoice counter.");
    let invoiceNumber: string;
    // The transaction serializes allocation; the lookup also skips legacy/manual number collisions.
    do {
      sequence += 1;
      if (!Number.isSafeInteger(sequence)) throw new Error("Invoice counter exhausted.");
      invoiceNumber = `ACT-INV/${year}/${String(sequence).padStart(6, "0")}`;
    } while (!(await transaction.get(collection.where("invoiceNumber", "==", invoiceNumber).limit(1))).empty);
    transaction.set(counterRef, { sequence });
    transaction.create(collection.doc(newCode), {
      ...input, invoiceNumber, status: invoicePaymentSummary(input).status, createdAt: Date.now(), revision: 1,
    });
  });
  return newCode;
}

export async function markVerifiedInvoicePaid(code: string): Promise<void> {
  if (!isVerificationCode(code)) throw new Error("Invalid verification code.");
  const db = getAdminDb();
  const ref = db.collection(COLLECTION).doc(code);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    if (!doc.exists) throw new Error("Invoice not found.");
    const invoice = readVerifiedInvoice(code, doc.data());
    const { due } = invoicePaymentSummary(invoice);
    if (due === 0) return;
    const input = validateInvoice({ ...invoice, payments: [...invoice.payments, {
      description: "Balance payment", dateReceived: currentInvoiceDate(), amount: due,
    }] });
    transaction.update(ref, { payments: input.payments, status: "paid", revision: invoice.revision + 1 });
  });
}
