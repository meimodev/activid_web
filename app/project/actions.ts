"use server";

import { redirect } from "next/navigation";
import { getAdminPassword, matchesAdminPassword } from "@/lib/admin-password";
import { getSessionSecret } from "@/lib/session-secret";
import { clearProjectAdminSession, setProjectAdminSession } from "@/lib/project-admin-session";

export async function loginProjectAdmin(_previous: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  if (!getAdminPassword() || !getSessionSecret()) return { error: "Staff sign-in is not configured. Ask the site administrator to configure access." };
  const password = formData.get("password");
  if (typeof password !== "string" || password.length > 1000 || !matchesAdminPassword(password)) return { error: "Incorrect password." };
  await setProjectAdminSession();
  redirect("/project");
}

export async function logoutProjectAdmin(): Promise<void> {
  await clearProjectAdminSession();
  redirect("/project");
}
