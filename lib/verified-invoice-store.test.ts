import { beforeEach, describe, expect, it, vi } from "vitest";
import { invoicePaymentSummary, type InvoiceInput } from "./verified-invoice";

const memory = vi.hoisted(() => {
  const records = new Map<string, Record<string, unknown>>();
  let queue: Promise<unknown> = Promise.resolve();
  function doc(collection: string, id: string) {
    const key = `${collection}/${id}`;
    return { key, async get() { return snapshot(key); }, async update(value: object) { records.set(key, { ...records.get(key), ...value }); } };
  }
  function snapshot(key: string) {
    return { exists: records.has(key), data: () => records.get(key) };
  }
  const transaction = {
    async get(target: { key?: string; collection?: string; invoiceNumber?: string }) {
      if (target.key) return snapshot(target.key);
      return { empty: ![...records.entries()].some(([key, value]) => key.startsWith(`${target.collection}/`) && value.invoiceNumber === target.invoiceNumber) };
    },
    set(ref: { key: string }, value: Record<string, unknown>) { records.set(ref.key, value); },
    create(ref: { key: string }, value: Record<string, unknown>) {
      if (records.has(ref.key)) throw new Error("Duplicate record");
      records.set(ref.key, value);
    },
    update(ref: { key: string }, value: Record<string, unknown>) { records.set(ref.key, { ...records.get(ref.key), ...value }); },
  };
  return {
    records,
    db: {
      collection(name: string) {
        return {
          doc: (id: string) => doc(name, id),
          where(_field: string, _operator: string, invoiceNumber: string) {
            return { limit: () => ({ collection: name, invoiceNumber }) };
          },
        };
      },
      runTransaction: vi.fn((callback: (value: typeof transaction) => Promise<void>) => {
        const result = queue.then(() => callback(transaction));
        queue = result.catch(() => {});
        return result;
      }),
    },
  };
});
vi.mock("@/lib/firebase-admin", () => ({ getAdminDb: () => memory.db }));

import { getVerifiedInvoice, markVerifiedInvoicePaid, saveVerifiedInvoice } from "./verified-invoice-store";

const input: InvoiceInput = {
  billedTo: "Client", payableTo: "ACTIVID", bankName: "Bank", accountNumber: "0123",
  items: [{ description: "Production", dateSent: "2026-10-17", quantity: 2, unitPrice: 150000 }], payments: [],
};

beforeEach(() => { memory.records.clear(); vi.clearAllMocks(); });

describe("issued invoice persistence", () => {
  it("allocates unique sequential numbers atomically and skips existing manual collisions", async () => {
    const year = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric" }).format(new Date());
    memory.records.set("verifiedInvoices/legacy", { invoiceNumber: `ACT-INV/${year}/000001` });
    const [first, second] = await Promise.all([saveVerifiedInvoice("", { ...input, invoiceNumber: "FORGED" }), saveVerifiedInvoice("", input)]);
    expect(first).not.toBe(second);
    const numbers = [memory.records.get(`verifiedInvoices/${first}`)?.invoiceNumber, memory.records.get(`verifiedInvoices/${second}`)?.invoiceNumber];
    expect(numbers).toEqual([`ACT-INV/${year}/000002`, `ACT-INV/${year}/000003`]);
    expect(memory.db.runTransaction).toHaveBeenCalledTimes(2);
  });

  it("preserves the issued number and QR identity when a down payment is recorded", async () => {
    const code = await saveVerifiedInvoice("", input);
    const original = await getVerifiedInvoice(code);
    await saveVerifiedInvoice(code, { ...input, invoiceNumber: "FORGED", payments: [{ description: "Down payment", dateReceived: "2026-10-17", amount: 100000 }] }, original?.revision);
    const updated = await getVerifiedInvoice(code);
    expect(updated?.invoiceNumber).toBe(original?.invoiceNumber);
    expect(updated?.status).toBe("partial");
    expect(updated && invoicePaymentSummary(updated).due).toBe(200000);
  });

  it("marks only the remaining balance paid and is safe to repeat", async () => {
    const code = await saveVerifiedInvoice("", { ...input, payments: [{ description: "Down payment", dateReceived: "2026-10-17", amount: 100000 }] });
    await Promise.all([markVerifiedInvoicePaid(code), markVerifiedInvoicePaid(code)]);
    const paid = await getVerifiedInvoice(code);
    expect(paid?.status).toBe("paid");
    expect(paid?.payments).toHaveLength(2);
    expect(paid?.payments[1]).toMatchObject({ description: "Balance payment", amount: 200000 });
    expect(paid && invoicePaymentSummary(paid).due).toBe(0);
  });

  it("rejects an invalid code before starting a write transaction", async () => {
    await expect(markVerifiedInvoicePaid("../manage")).rejects.toThrow("Invalid verification code");
    expect(memory.db.runTransaction).not.toHaveBeenCalled();
  });

  it("prevents a stale editor from overwriting a newly received balance payment", async () => {
    const code = await saveVerifiedInvoice("", input);
    const before = await getVerifiedInvoice(code);
    await markVerifiedInvoicePaid(code);
    await expect(saveVerifiedInvoice(code, input, before?.revision)).rejects.toThrow("changed while you were editing");
    expect((await getVerifiedInvoice(code))?.status).toBe("paid");
  });
});
