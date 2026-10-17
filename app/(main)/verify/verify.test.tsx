import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { InvoiceInput, VerifiedInvoice } from "@/lib/verified-invoice";

const mocks = vi.hoisted(() => ({ get: vi.fn(), list: vi.fn(), save: vi.fn(), authed: vi.fn(), session: vi.fn(), clear: vi.fn(), refresh: vi.fn(), qr: vi.fn() }));
vi.mock("@/lib/verified-invoice-store", () => ({ getVerifiedInvoice: mocks.get, listVerifiedInvoices: mocks.list, saveVerifiedInvoice: mocks.save }));
vi.mock("@/lib/verify-admin-session", () => ({ isVerifyAdmin: mocks.authed, setVerifyAdminSession: mocks.session, clearVerifyAdminSession: mocks.clear }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }), notFound: () => { throw new Error("NOT_FOUND"); }, redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("qrcode", () => ({ toDataURL: mocks.qr }));

import VerifiedInvoicePage from "./[code]/page";
import VerifyManagePage from "./manage/page";
import VerifyPage from "./page";
import { loginVerifyAdmin, saveInvoice } from "./manage/actions";
import { InvoiceManager } from "./manage/manage-client";

const record: VerifiedInvoice = {
  code: "a".repeat(32), createdAt: 1, invoiceNumber: "INV/001", billedTo: "Example client",
  payableTo: "ACTIVID", bankName: "Example bank", accountNumber: "0123456789", status: "unpaid",
  items: [{ description: "Photography", dateSent: "2026-10-17", quantity: 2, unitPrice: 150000 }],
};

function invoiceForm() {
  const data = new FormData();
  for (const key of ["invoiceNumber", "billedTo", "payableTo", "bankName", "accountNumber", "status"] as const) data.set(key, record[key]);
  for (const [key, value] of Object.entries(record.items[0])) data.append(key, String(value));
  return data;
}

beforeEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("invoice verification flow", () => {
  it("renders the invoice recipient, payment account and item table", async () => {
    mocks.get.mockResolvedValue(record);
    const html = renderToStaticMarkup(await VerifiedInvoicePage({ params: Promise.resolve({ code: record.code }) }));
    for (const value of ["Example client", "INV/001", "ACTIVID", "0123456789", "Photography", "17 Oct 2026", "Quantity", "Unit price", "300.000", "Awaiting payment"]) expect(html).toContain(value);
    expect(html).toContain("<table");
  });

  it("shows a paid-in-full notice with zero due for a paid invoice", async () => {
    mocks.get.mockResolvedValue({ ...record, status: "paid" });
    const html = renderToStaticMarkup(await VerifiedInvoicePage({ params: Promise.resolve({ code: record.code }) }));
    expect(html).toContain("Paid in full");
    expect(html).toContain("No further payment is required");
    expect(html).toMatch(/Amount due<\/dt><dd[^>]*>Rp\s*0<\/dd>/);
    expect(html).not.toContain("Awaiting payment");
  });

  it("returns a not-found state for a missing record", async () => {
    mocks.get.mockResolvedValue(null);
    await expect(VerifiedInvoicePage({ params: Promise.resolve({ code: record.code }) })).rejects.toThrow("NOT_FOUND");
  });

  it("routes lookup codes to the QR destination", async () => {
    await expect(VerifyPage({ searchParams: Promise.resolve({ code: record.code }) })).rejects.toThrow(`REDIRECT:/verify/${record.code}`);
  });

  it("does not read or mutate invoices without a staff session", async () => {
    mocks.authed.mockResolvedValue(false);
    await VerifyManagePage();
    expect(mocks.list).not.toHaveBeenCalled();
    expect(await saveInvoice({}, invoiceForm())).toHaveProperty("error");
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("validates writes and persists paid status on the same QR code", async () => {
    mocks.authed.mockResolvedValue(true);
    mocks.save.mockResolvedValue(record.code);
    const data = invoiceForm();
    data.set("code", record.code);
    data.set("status", "paid");
    data.set("total", "1");
    expect(await saveInvoice({}, data)).toEqual({ code: record.code });
    const saved: InvoiceInput = mocks.save.mock.calls[0][1];
    expect(saved.status).toBe("paid");
    expect(saved.items[0].unitPrice).toBe(150000);
    expect(saved).not.toHaveProperty("total");
    expect(mocks.save.mock.calls[0][0]).toBe(record.code);
    mocks.save.mockClear();
    data.set("quantity", "-2");
    expect(await saveInvoice({}, data)).toHaveProperty("error");
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it("never creates a session for incorrect or missing admin credentials", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "correct-password");
    vi.stubEnv("SESSION_SECRET", "s".repeat(32));
    const data = new FormData();
    data.set("password", "incorrect-password");
    expect(await loginVerifyAdmin({}, data)).toHaveProperty("error", "Incorrect password.");
    expect(mocks.session).not.toHaveBeenCalled();
    data.set("password", "correct-password");
    await expect(loginVerifyAdmin({}, data)).rejects.toThrow("REDIRECT:/verify/manage");
    expect(mocks.session).toHaveBeenCalledOnce();
    mocks.session.mockClear();
    vi.stubEnv("SESSION_SECRET", "");
    expect(await loginVerifyAdmin({}, data)).toHaveProperty("error");
    expect(mocks.session).not.toHaveBeenCalled();
  });

  it("lets staff edit a record and download a QR pointing to its unchanged verification link", async () => {
    mocks.authed.mockResolvedValue(true);
    mocks.save.mockResolvedValue(record.code);
    mocks.qr.mockResolvedValue("data:image/png;base64,aGVsbG8=");
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    render(<InvoiceManager invoices={[record]} />);
    fireEvent.click(screen.getByRole("button", { name: /INV\/001/ }));
    fireEvent.change(screen.getByLabelText("Payment status"), { target: { value: "paid" } });
    const form = screen.getByRole("button", { name: "Save changes" }).closest("form");
    if (!form) throw new Error("Invoice form missing");
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Invoice saved"));
    expect(mocks.save).toHaveBeenCalledWith(record.code, expect.objectContaining({ status: "paid" }));
    expect(mocks.refresh).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Download QR code" }));
    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(mocks.qr).toHaveBeenCalledWith(`${window.location.origin}/verify/${record.code}`, expect.any(Object));
  });
});
