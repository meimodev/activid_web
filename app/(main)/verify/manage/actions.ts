"use server";

import { getAdminPassword, matchesAdminPassword } from "@/lib/admin-password";
import { getSessionSecret } from "@/lib/session-secret";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearVerifyAdminSession, isVerifyAdmin, setVerifyAdminSession } from "@/lib/verify-admin-session";
import { saveVerifiedInvoice } from "@/lib/verified-invoice-store";
import { validateInvoice } from "@/lib/verified-invoice";

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
  let input;
  try {
    input = validateInvoice({
      invoiceNumber: formData.get("invoiceNumber"), billedTo: formData.get("billedTo"),
      payableTo: formData.get("payableTo"), bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"), status: formData.get("status"),
      items: descriptions.map((description, index) => ({
        description, dateSent: dates[index],
        quantity: typeof quantities[index] === "string" && String(quantities[index]).trim() ? Number(quantities[index]) : NaN,
        unitPrice: typeof prices[index] === "string" && String(prices[index]).trim() ? Number(prices[index]) : NaN,
      })),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Check the invoice fields." };
  }
  let code: string;
  try {
    code = await saveVerifiedInvoice(String(formData.get("code") ?? ""), input);
  } catch (error) {
    console.error("Could not save verified invoice", error);
    return { error: "The invoice could not be saved. Please try again." };
  }
  revalidatePath("/verify/manage");
  revalidatePath(`/verify/${code}`);
  return { code };
}
