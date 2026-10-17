"use server";

import { getAdminPassword, matchesAdminPassword } from "@/lib/admin-password";
import { getSessionSecret } from "@/lib/session-secret";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearVerifyAdminSession, isVerifyAdmin, setVerifyAdminSession } from "@/lib/verify-admin-session";
import { markVerifiedInvoicePaid, saveVerifiedInvoice } from "@/lib/verified-invoice-store";
import { InvoiceConflictError, validateInvoice } from "@/lib/verified-invoice";

export type ActionState = { error?: string; code?: string };

export async function loginVerifyAdmin(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!getAdminPassword()) return { error: "Server is missing ADMIN_PASSWORD." };
  if (!getSessionSecret()) return { error: "Configure SESSION_SECRET with at least 32 characters." };
  const password = formData.get("password");
  if (!matchesAdminPassword(password)) {
    return { error: "Incorrect password." };
  }
  await setVerifyAdminSession();
  redirect("/verify/manage");
}

export async function logoutVerifyAdmin(): Promise<void> {
  await clearVerifyAdminSession();
  redirect("/verify/manage");
}

export async function saveInvoice(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isVerifyAdmin())) return { error: "Your session expired. Reload this page and sign in again." };
  const descriptions = formData.getAll("description");
  const dates = formData.getAll("dateSent");
  const quantities = formData.getAll("quantity");
  const prices = formData.getAll("unitPrice");
  const paymentDescriptions = formData.getAll("paymentDescription");
  const paymentDates = formData.getAll("paymentDate");
  const paymentAmounts = formData.getAll("paymentAmount");
  let input;
  try {
    input = validateInvoice({
      billedTo: formData.get("billedTo"),
      payableTo: formData.get("payableTo"), bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"),
      items: descriptions.map((description, index) => ({
        description, dateSent: dates[index],
        quantity: typeof quantities[index] === "string" && String(quantities[index]).trim() ? Number(quantities[index]) : NaN,
        unitPrice: typeof prices[index] === "string" && String(prices[index]).trim() ? Number(prices[index]) : NaN,
      })),
      payments: paymentDescriptions.map((description, index) => ({
        description, dateReceived: paymentDates[index],
        amount: typeof paymentAmounts[index] === "string" && String(paymentAmounts[index]).trim() ? Number(paymentAmounts[index]) : NaN,
      })),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Check the invoice fields." };
  }
  let code: string;
  try {
    code = await saveVerifiedInvoice(String(formData.get("code") ?? ""), input, Number(formData.get("revision")));
  } catch (error) {
    if (error instanceof InvoiceConflictError) return { error: error.message };
    console.error("Could not save verified invoice", error);
    return { error: "The invoice could not be saved. Please try again." };
  }
  revalidatePath("/verify/manage");
  revalidatePath(`/verify/${code}`);
  return { code };
}

export async function markInvoicePaid(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await isVerifyAdmin())) return { error: "Your session expired. Reload this page and sign in again." };
  const code = String(formData.get("code") ?? "");
  try {
    await markVerifiedInvoicePaid(code);
  } catch (error) {
    console.error("Could not mark invoice paid", error);
    return { error: "The payment could not be recorded. Please try again." };
  }
  revalidatePath("/verify/manage");
  revalidatePath(`/verify/${code}`);
  return { code };
}
