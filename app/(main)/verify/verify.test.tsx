import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { InvoiceInput, VerifiedInvoice } from "@/lib/verified-invoice";

const mocks = vi.hoisted(() => ({ get: vi.fn(), list: vi.fn(), save: vi.fn(), paid: vi.fn(), authed: vi.fn(), session: vi.fn(), clear: vi.fn(), refresh: vi.fn(), qr: vi.fn() }));
vi.mock("@/lib/verified-invoice-store", () => ({ getVerifiedInvoice: mocks.get, listVerifiedInvoices: mocks.list, saveVerifiedInvoice: mocks.save, markVerifiedInvoicePaid: mocks.paid }));
vi.mock("@/lib/verify-admin-session", () => ({ isVerifyAdmin: mocks.authed, setVerifyAdminSession: mocks.session, clearVerifyAdminSession: mocks.clear }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }), notFound: () => { throw new Error("NOT_FOUND"); }, redirect: (url: string) => { throw new Error(`REDIRECT:${url}`); } }));
vi.mock("qrcode", () => ({ toDataURL: mocks.qr }));

import VerifiedInvoicePage from "./[code]/page";
import VerifyManagePage from "./manage/page";
import VerifyPage from "./page";
import { loginVerifyAdmin, markInvoicePaid, saveInvoice } from "./manage/actions";
import { InvoiceManager } from "./manage/manage-client";

const record: VerifiedInvoice = {
  code: "a".repeat(32), createdAt: 1, revision: 0, invoiceNumber: "INV/001", billedTo: "Example client",
  payableTo: "ACTIVID", bankName: "Example bank", accountNumber: "0123456789", status: "unpaid",
  items: [{ description: "Photography", dateSent: "2026-10-17", quantity: 2, unitPrice: 150000 }],
  payments: [],
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
    for (const value of ["Example client", "INV/001", "ACTIVID", "0123456789", "Photography", "17 Oct 2026", "Quantity", "Unit price", "300.000", "Awaiting payment", "CV Tonindo Eracons", "0881080088816", "www.activid.id", "Wawalintouan", "Mahakeret"]) expect(html).toContain(value);
    expect(html).toContain("<table");
    expect(html).toContain("ACTIVID logo");
  });

  it("shows a paid-in-full notice with zero due for a paid invoice", async () => {
    mocks.get.mockResolvedValue({ ...record, status: "paid", payments: [{ description: "Payment", dateReceived: "2026-10-17", amount: 300000 }] });
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
    expect(await markInvoicePaid({}, invoiceForm())).toHaveProperty("error");
    expect(mocks.paid).not.toHaveBeenCalled();
  });

  it("validates receipts and ignores submitted status, totals and invoice numbers", async () => {
    mocks.authed.mockResolvedValue(true);
    mocks.save.mockResolvedValue(record.code);
    const data = invoiceForm();
    data.set("code", record.code);
    data.set("status", "paid");
    data.set("total", "1");
    data.set("invoiceNumber", "FORGED");
    data.append("paymentDescription", "Down payment");
    data.append("paymentDate", "2026-10-17");
    data.append("paymentAmount", "100000");
    expect(await saveInvoice({}, data)).toEqual({ code: record.code });
    const saved: InvoiceInput = mocks.save.mock.calls[0][1];
    expect(saved.payments[0].amount).toBe(100000);
    expect(saved).not.toHaveProperty("status");
    expect(saved).not.toHaveProperty("invoiceNumber");
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
    const price = screen.getByRole("textbox", { name: /Unit price \(IDR\)/ });
    fireEvent.change(price, { target: { value: "1500000" } });
    expect(price).toHaveValue("1.500.000");
    fireEvent.click(screen.getByRole("button", { name: "Add received payment" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Payment description" }), { target: { value: "Down payment" } });
    const paymentAmount = screen.getByRole("textbox", { name: /Amount received \(IDR\)/ });
    fireEvent.change(paymentAmount, { target: { value: "100000" } });
    expect(paymentAmount).toHaveValue("100.000");
    const form = screen.getByRole("button", { name: "Save changes" }).closest("form");
    if (!form) throw new Error("Invoice form missing");
    fireEvent.submit(form);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Invoice saved"));
    expect(mocks.save).toHaveBeenCalledWith(record.code, expect.objectContaining({ items: [expect.objectContaining({ unitPrice: 1500000 })] }), record.revision);
    expect(mocks.save).toHaveBeenCalledWith(record.code, expect.objectContaining({ payments: [expect.objectContaining({ description: "Down payment", amount: 100000 })] }), record.revision);
    expect(screen.getByRole("link", { name: "Download invoice PDF" })).toHaveAttribute("href", `/verify/${record.code}/pdf`);
    expect(mocks.refresh).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Download QR code" }));
    await waitFor(() => expect(click).toHaveBeenCalledOnce());
    expect(mocks.qr).toHaveBeenCalledWith(`${window.location.origin}/verify/${record.code}`, expect.any(Object));
  });

  it("offers a protected quick action to record the remaining balance as paid", async () => {
    mocks.authed.mockResolvedValue(true);
    render(<InvoiceManager invoices={[record]} />);
    const form = screen.getByRole("button", { name: "Mark paid" }).closest("form");
    if (!form) throw new Error("Quick payment form missing");
    fireEvent.submit(form);
    await waitFor(() => expect(mocks.paid).toHaveBeenCalledWith(record.code));
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it("updates the received amount and balance while editing payments, quantities and prices", () => {
    render(<InvoiceManager invoices={[record]} />);
    fireEvent.click(screen.getByRole("button", { name: /INV\/001/ }));
    fireEvent.click(screen.getByRole("button", { name: "Add received payment" }));
    fireEvent.change(screen.getByRole("textbox", { name: /Amount received \(IDR\)/ }), { target: { value: "100000" } });
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent(/Received:?\s*Rp\s*100\.000/);
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent(/Remaining\s*Rp\s*200\.000/);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), { target: { value: "1" } });
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent(/Remaining\s*Rp\s*50\.000/);
    fireEvent.change(screen.getByRole("textbox", { name: /Unit price \(IDR\)/ }), { target: { value: "100000" } });
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent("Paid in full");
    fireEvent.click(screen.getByRole("button", { name: "Add received payment" }));
    fireEvent.change(screen.getAllByRole("textbox", { name: /Amount received \(IDR\)/ })[1], { target: { value: "25000" } });
    expect(screen.getByRole("alert")).toHaveTextContent("exceed");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Remove payment 1" }));
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent(/Received\s*Rp\s*25\.000/);
    expect(screen.getByLabelText("Payment summary")).toHaveTextContent(/Remaining\s*Rp\s*75\.000/);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });
});
