import { describe, expect, it } from "vitest";
import { invoiceTotal, isVerificationCode, validateInvoice, type InvoiceInput } from "./verified-invoice";

const invoice: InvoiceInput = {
  invoiceNumber: "INV/2026/001", billedTo: "Example client", payableTo: "ACTIVID",
  bankName: "Example bank", accountNumber: "0123456789", status: "unpaid",
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
    expect(validateInvoice({ ...invoice, status: "paid" }).status).toBe("paid");
  });

  it.each([
    { quantity: -1 }, { quantity: 0 }, { quantity: 1.5 }, { unitPrice: -1 },
    { unitPrice: NaN }, { unitPrice: Infinity }, { unitPrice: 0.5 },
    { quantity: 2, unitPrice: Number.MAX_SAFE_INTEGER },
    { description: " " }, { dateSent: "2026-02-30" }, { dateSent: "invalid" },
  ])("rejects invalid line items: %j", (patch) => {
    expect(() => validateInvoice({ ...invoice, items: [{ ...invoice.items[0], ...patch }] })).toThrow();
  });

  it("rejects incomplete records, invalid status, empty items and unsafe aggregate totals", () => {
    for (const patch of [{ billedTo: "" }, { status: "pending" }, { accountNumber: 123 }, { items: [] }]) {
      expect(() => validateInvoice({ ...invoice, ...patch })).toThrow();
    }
    const item = { ...invoice.items[0], quantity: 1, unitPrice: Number.MAX_SAFE_INTEGER };
    expect(() => validateInvoice({ ...invoice, items: [item, item] })).toThrow("total is too large");
  });

  it("accepts only exact opaque verification codes", () => {
    expect(isVerificationCode("a".repeat(32))).toBe(true);
    for (const value of ["manage", "../manage", "a".repeat(31), "A".repeat(32), "g".repeat(32)]) {
      expect(isVerificationCode(value)).toBe(false);
    }
  });
});
