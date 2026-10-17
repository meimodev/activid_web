import { isVerifyAdmin } from "@/lib/verify-admin-session";
import { listVerifiedInvoices } from "@/lib/verified-invoice-store";
import { InvoiceManager, VerifyLogin } from "./manage-client";

export const metadata = { title: "Manage issued invoices | ACTIVID" };

export default async function VerifyManagePage() {
  if (!(await isVerifyAdmin())) return <VerifyLogin />;
  return <InvoiceManager invoices={await listVerifiedInvoices()} />;
}
