import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Buffer } from "node:buffer";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { generateInvoicePDF } from "./invoice-pdf";
import { readVerifiedInvoice } from "./verified-invoice";

// PDFKit reads fonts with Node's fs; its typed-array checks need the same realm as Buffer.
beforeEach(() => vi.stubGlobal("Uint8Array", Object.getPrototypeOf(Buffer.prototype).constructor));
afterEach(() => vi.unstubAllGlobals());

it("generates downloadable PDFs with an embedded verification QR, including long multi-page invoices", async () => {
  const code = "a".repeat(32);
  const url = `https://www.activid.id/verify/${code}`;
  const invoice = readVerifiedInvoice(code, {
    invoiceNumber: "ACT-INV/2026/000001", createdAt: 1792195200000, billedTo: "EXAMPLE CLIENT - SAMPLE ONLY\nExample Studio\nManado, Sulawesi Utara",
    payableTo: "ACTIVID (sample)", bankName: "Example bank", accountNumber: "0123456789",
    items: [
      { description: "Event documentation and photography", dateSent: "2026-10-17", quantity: 2, unitPrice: 1500000 },
      { description: "Post-production editing", dateSent: "2026-10-17", quantity: 1, unitPrice: 750000 },
    ],
    payments: [{ description: "Down payment", dateReceived: "2026-10-17", amount: 1000000 }],
  });
  const short = await generateInvoicePDF(invoice, url);
  expect(short.subarray(0, 5).toString()).toBe("%PDF-");
  expect(short.toString("latin1")).toContain("/Subtype /Image");
  expect(short.toString("latin1")).toContain("https://www.activid.id/verify/");
  const long = await generateInvoicePDF({ ...invoice, items: Array.from({ length: 35 }, (_, index) => ({ ...invoice.items[index % 2], description: `Line ${index + 1}: ${"Production, editing and delivery with a detailed description. ".repeat(12)}` })) }, url);
  expect(long.length).toBeGreaterThan(short.length);
  if (process.env.INVOICE_PDF_PREVIEW_DIR) {
    await mkdir(process.env.INVOICE_PDF_PREVIEW_DIR, { recursive: true });
    await writeFile(path.join(process.env.INVOICE_PDF_PREVIEW_DIR, "sample-invoice.pdf"), short);
    await writeFile(path.join(process.env.INVOICE_PDF_PREVIEW_DIR, "multipage-invoice.pdf"), long);
  }
});
