import { NextRequest } from "next/server";
import { beforeEach, expect, it, vi } from "vitest";
import { readVerifiedInvoice } from "@/lib/verified-invoice";

const mocks = vi.hoisted(() => ({ get: vi.fn(), pdf: vi.fn() }));
vi.mock("@/lib/verified-invoice-store", () => ({ getVerifiedInvoice: mocks.get }));
vi.mock("@/lib/invoice-pdf", () => ({ generateInvoicePDF: mocks.pdf }));
import { GET } from "./route";

beforeEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });

it("downloads the stored invoice as an uncached PDF with a safe filename and canonical QR URL", async () => {
  const code = "a".repeat(32);
  const invoice = readVerifiedInvoice(code, { invoiceNumber: "ACT-INV/2026/000001", createdAt: 1, billedTo: "Client", payableTo: "ACTIVID", bankName: "Bank", accountNumber: "0123", items: [{ description: "Work", dateSent: "2026-10-17", quantity: 1, unitPrice: 100000 }], payments: [] });
  mocks.get.mockResolvedValue(invoice);
  mocks.pdf.mockResolvedValue(Buffer.from("%PDF-test"));
  vi.stubEnv("NODE_ENV", "production");
  const response = await GET(new NextRequest(`https://preview.example/verify/${code}/pdf`), { params: Promise.resolve({ code }) });
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("application/pdf");
  expect(response.headers.get("Content-Disposition")).toBe('attachment; filename="ACT-INV-2026-000001.pdf"');
  expect(response.headers.get("Cache-Control")).toContain("no-store");
  expect(mocks.pdf).toHaveBeenCalledWith(invoice, `https://www.activid.id/verify/${code}`);
  expect(await response.text()).toBe("%PDF-test");
});

it("returns 404 for an unknown invoice without generating a PDF", async () => {
  mocks.get.mockResolvedValue(null);
  expect((await GET(new NextRequest("http://localhost/verify/invalid/pdf"), { params: Promise.resolve({ code: "invalid" }) })).status).toBe(404);
  expect(mocks.pdf).not.toHaveBeenCalled();
});
