export type InvoiceItem = {
  description: string;
  dateSent: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceInput = {
  billedTo: string;
  payableTo: string;
  bankName: string;
  accountNumber: string;
  items: InvoiceItem[];
  payments: InvoicePayment[];
};

export type InvoicePayment = {
  description: string;
  dateReceived: string;
  amount: number;
};

export type VerifiedInvoice = InvoiceInput & {
  invoiceNumber: string;
  code: string;
  createdAt: number;
  revision: number;
  status: "unpaid" | "partial" | "paid";
};

export class InvoiceConflictError extends Error {
  constructor() { super("This invoice changed while you were editing. Reload it before saving to preserve the latest payments."); }
}

export const INVOICE_ISSUER = {
  legalName: "CV Tonindo Eracons",
  address: "Kompleks Pasar Bawah, Wawalintouan, Tondano & Jln Toar, Mahakeret, Manado",
  phone: "0881080088816",
  website: "www.activid.id",
};

export const INVOICE_LEGAL_NOTE = "Dokumen elektronik dapat menjadi alat bukti hukum yang sah sesuai Pasal 5 UU ITE (terakhir diubah dengan UU No. 1 Tahun 2024), sepanjang memenuhi persyaratan peraturan perundang-undangan yang berlaku. Pindai kode QR untuk memverifikasi kecocokan data invoice dengan catatan ACTIVID. Kode QR ini bukan tanda tangan elektronik tersertifikasi dan tidak dengan sendirinya menjamin keabsahan hukum dokumen.";

export function currentInvoiceDate(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

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
  if (!text(input.billedTo, 1000)
    || !text(input.payableTo, 300) || !text(input.bankName, 100)
    || !text(input.accountNumber, 100)) {
    throw new Error("Enter the recipient, payee, bank, and account number.");
  }
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
  const rawPayments = input.payments ?? [];
  if (!Array.isArray(rawPayments) || rawPayments.length > 100) throw new Error("Use at most 100 received payments.");
  const payments = rawPayments.map((value: unknown): InvoicePayment => {
    if (!value || typeof value !== "object") throw new Error("Invalid payment.");
    const payment = value as Record<string, unknown>;
    if (!text(payment.description, 300) || typeof payment.dateReceived !== "string"
      || (payment.dateReceived !== "" && !isDate(payment.dateReceived))) {
      throw new Error("Each payment needs a description and a valid date received, if known.");
    }
    if (typeof payment.amount !== "number" || !Number.isSafeInteger(payment.amount) || payment.amount <= 0) {
      throw new Error("Received payments must be positive whole IDR amounts.");
    }
    return { description: payment.description.trim(), dateReceived: payment.dateReceived, amount: payment.amount };
  });
  const received = payments.reduce((sum, payment) => sum + payment.amount, 0);
  if (!Number.isSafeInteger(received) || received > invoiceTotal(items)) throw new Error("Received payments cannot exceed the invoice total.");
  return {
    billedTo: input.billedTo.trim(),
    payableTo: input.payableTo.trim(), bankName: input.bankName.trim(),
    accountNumber: input.accountNumber.trim(), items, payments,
  };
}

export function invoicePaymentSummary(invoice: { items: Pick<InvoiceItem, "quantity" | "unitPrice">[]; payments: Pick<InvoicePayment, "amount">[] }) {
  const total = invoiceTotal(invoice.items);
  const received = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const due = total - received;
  const status: VerifiedInvoice["status"] = due === 0 ? "paid" : received > 0 ? "partial" : "unpaid";
  return { total, received, due, status };
}

export function readVerifiedInvoice(code: string, value: unknown): VerifiedInvoice {
  if (!value || typeof value !== "object") throw new Error("Invalid stored invoice.");
  const data = value as Record<string, unknown>;
  if (!isVerificationCode(code) || !text(data.invoiceNumber, 100) || typeof data.createdAt !== "number" || !Number.isSafeInteger(data.createdAt)) {
    throw new Error("Invalid stored invoice identity.");
  }
  const base = validateInvoice({ ...data, payments: [] });
  // Old paid records have no receipt history. Preserve the amount without inventing a payment date.
  const payments = data.payments ?? (data.status === "paid" && invoiceTotal(base.items) > 0
    ? [{ description: "Previously recorded payment (date unavailable)", dateReceived: "", amount: invoiceTotal(base.items) }] : []);
  const input = validateInvoice({ ...data, payments });
  const revision = data.revision ?? 0;
  if (typeof revision !== "number" || !Number.isSafeInteger(revision) || revision < 0) throw new Error("Invalid invoice revision.");
  return { ...input, invoiceNumber: data.invoiceNumber, code, createdAt: data.createdAt, revision, status: invoicePaymentSummary(input).status };
}

export function formatIDRDigits(digits: string): string {
  return digits.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function invoiceTotal(items: Pick<InvoiceItem, "quantity" | "unitPrice">[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function formatInvoiceDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
