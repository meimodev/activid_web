import { describe, expect, it } from "vitest";
import { formatIDRDigits, invoicePaymentSummary, invoiceTotal, isVerificationCode, readVerifiedInvoice, validateInvoice, type InvoiceInput } from "./verified-invoice";

const invoice: InvoiceInput = {
  billedTo: "Example client", payableTo: "ACTIVID",
  bankName: "Example bank", accountNumber: "0123456789", payments: [],
  items: [
    { description: "Photography", dateSent: "2026-10-17", quantity: 2, unitPrice: 150000 },
    { description: "Editing", dateSent: "2026-10-18", quantity: 1, unitPrice: 75000 },
  ],
};

describe("issued invoice validation and totals", () => {
  it("calculates totals from validated items and preserves account-number zeroes", () => {
    const result = validateInvoice({ ...invoice, total: 1, billedTo: " Example client " });
    expect(invoiceTotal(result.items)).toBe(375000);
    expect(result.accountNumber).toBe("0123456789");
    expect(result.billedTo).toBe("Example client");
    expect(result).not.toHaveProperty("total");
    expect(validateInvoice({ ...invoice, status: "paid", invoiceNumber: "CLIENT-SUPPLIED" })).not.toHaveProperty("invoiceNumber");
    expect(invoicePaymentSummary(result).status).toBe("unpaid");
  });

  it.each([
    { quantity: -1 }, { quantity: 0 }, { quantity: 1.5 }, { unitPrice: -1 },
    { unitPrice: NaN }, { unitPrice: Infinity }, { unitPrice: 0.5 },
    { quantity: 2, unitPrice: Number.MAX_SAFE_INTEGER },
    { description: " " }, { dateSent: "2026-02-30" }, { dateSent: "invalid" },
  ])("rejects invalid line items: %j", (patch) => {
    expect(() => validateInvoice({ ...invoice, items: [{ ...invoice.items[0], ...patch }] })).toThrow();
  });

  it("rejects incomplete records, malformed payments, empty items and unsafe aggregate totals", () => {
    for (const patch of [{ billedTo: "" }, { payments: "paid" }, { accountNumber: 123 }, { items: [] }]) {
      expect(() => validateInvoice({ ...invoice, ...patch })).toThrow();
    }
    const item = { ...invoice.items[0], quantity: 1, unitPrice: Number.MAX_SAFE_INTEGER };
    expect(() => validateInvoice({ ...invoice, items: [item, item] })).toThrow("total is too large");
  });

  it("tracks a down payment and multiple receipts before showing paid in full", () => {
    const payments = [{ description: "Down payment", dateReceived: "2026-10-17", amount: 100000 }];
    expect(invoicePaymentSummary(validateInvoice({ ...invoice, payments }))).toEqual({ total: 375000, received: 100000, due: 275000, status: "partial" });
    payments.push({ description: "Balance", dateReceived: "2026-10-18", amount: 275000 });
    expect(invoicePaymentSummary(validateInvoice({ ...invoice, payments }))).toEqual({ total: 375000, received: 375000, due: 0, status: "paid" });
  });

  it.each([0, -1, 1.5, NaN, Infinity, 375001])("rejects invalid or excessive received amounts: %s", (amount) => {
    expect(() => validateInvoice({ ...invoice, payments: [{ description: "Receipt", dateReceived: "2026-10-17", amount }] })).toThrow();
  });

  it("preserves old paid invoices without inventing receipt dates", () => {
    const legacy = { ...invoice, payments: undefined };
    const result = readVerifiedInvoice("a".repeat(32), { ...legacy, invoiceNumber: "INV/001", createdAt: 1, status: "paid" });
    expect(result.invoiceNumber).toBe("INV/001");
    expect(result.payments[0]).toMatchObject({ amount: 375000, dateReceived: "" });
    expect(invoicePaymentSummary(result).due).toBe(0);
  });

  it("formats IDR digits without losing precision or zeroes within an amount", () => {
    expect(formatIDRDigits("1500000")).toBe("1.500.000");
    expect(formatIDRDigits("0001500")).toBe("1.500");
    expect(formatIDRDigits("0")).toBe("0");
    expect(formatIDRDigits("")).toBe("");
  });

  it("accepts only exact opaque verification codes", () => {
    expect(isVerificationCode("a".repeat(32))).toBe(true);
    for (const value of ["manage", "../manage", "a".repeat(31), "A".repeat(32), "g".repeat(32)]) {
      expect(isVerificationCode(value)).toBe(false);
    }
  });
});
