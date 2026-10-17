export type InvoiceItem = {
  description: string;
  dateSent: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceInput = {
  invoiceNumber: string;
  billedTo: string;
  payableTo: string;
  bankName: string;
  accountNumber: string;
  status: "unpaid" | "paid";
  items: InvoiceItem[];
};

export type VerifiedInvoice = InvoiceInput & { code: string; createdAt: number };

export function isVerificationCode(code: string): boolean {
  return /^[a-f0-9]{32}$/.test(code);
}

function text(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number(value.slice(0, 4)) >= 2000
    && !Number.isNaN(Date.parse(value))
    && new Date(value).toISOString().slice(0, 10) === value;
}

/** Shared by the write boundary and stored-record reads. Amounts are whole rupiah. */
export function validateInvoice(value: unknown): InvoiceInput {
  if (!value || typeof value !== "object") throw new Error("Invoice is required.");
  const input = value as Record<string, unknown>;
  if (!text(input.invoiceNumber, 100) || !text(input.billedTo, 1000)
    || !text(input.payableTo, 300) || !text(input.bankName, 100)
    || !text(input.accountNumber, 100)) {
    throw new Error("Enter the invoice number, recipient, payee, bank, and account number.");
  }
  if (input.status !== "unpaid" && input.status !== "paid") throw new Error("Invalid payment status.");
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 100) {
    throw new Error("Add between 1 and 100 invoice items.");
  }
  const items = input.items.map((value: unknown): InvoiceItem => {
    if (!value || typeof value !== "object") throw new Error("Invalid invoice item.");
    const item = value as Record<string, unknown>;
    if (!text(item.description, 1000) || !isDate(item.dateSent)) {
      throw new Error("Every item needs a description and a valid date sent.");
    }
    if (typeof item.quantity !== "number" || !Number.isSafeInteger(item.quantity) || item.quantity <= 0
      || typeof item.unitPrice !== "number" || !Number.isSafeInteger(item.unitPrice) || item.unitPrice < 0
      || !Number.isSafeInteger(item.quantity * item.unitPrice)) {
      throw new Error("Use positive whole quantities and non-negative whole IDR prices.");
    }
    return { description: item.description.trim(), dateSent: item.dateSent, quantity: item.quantity, unitPrice: item.unitPrice };
  });
  if (!Number.isSafeInteger(invoiceTotal(items))) throw new Error("Invoice total is too large.");
  return {
    invoiceNumber: input.invoiceNumber.trim(), billedTo: input.billedTo.trim(),
    payableTo: input.payableTo.trim(), bankName: input.bankName.trim(),
    accountNumber: input.accountNumber.trim(), status: input.status, items,
  };
}

export function invoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function formatInvoiceDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
