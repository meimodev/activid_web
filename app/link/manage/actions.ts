"use server";

import { cookies } from "next/headers";
import {
  createLinkAdminCookieValue,
  getLinkAdminCookieName,
  getLinkAdminCookieOptions,
  isLinkAdminSessionValid,
} from "@/lib/link-admin-session";
import {
  createRedirectLink,
  deleteRedirectLink,
  normalizeDestinationUrl,
  updateRedirectLink,
} from "@/lib/redirect-link";

export type ActionState = { ok?: boolean; error?: string };

/** Server actions are public endpoints — every one re-checks the session. */
async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return isLinkAdminSessionValid(store.get(getLinkAdminCookieName())?.value);
}

export async function loginLinkAdmin(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const expected = process.env.LINK_ADMIN_PASSWORD;
  if (!expected) return { error: "Server belum diberi LINK_ADMIN_PASSWORD." };

  const password = formData.get("password");
  if (typeof password !== "string" || password !== expected) {
    return { error: "Kata sandi salah." };
  }

  let value: string;
  try {
    value = await createLinkAdminCookieValue();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal membuat sesi." };
  }

  const store = await cookies();
  store.set(getLinkAdminCookieName(), value, getLinkAdminCookieOptions());
  return { ok: true };
}

function readForm(formData: FormData) {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const thankYouNote = String(formData.get("thankYouNote") ?? "").trim();
  const destinationUrl = normalizeDestinationUrl(String(formData.get("destinationUrl") ?? ""));
  return { businessName, thankYouNote, destinationUrl };
}

export async function createLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Sesi berakhir. Muat ulang halaman." };

  const { businessName, thankYouNote, destinationUrl } = readForm(formData);
  if (!businessName) return { error: "Nama bisnis wajib diisi." };
  if (!destinationUrl) return { error: "URL tujuan tidak valid." };

  await createRedirectLink({ businessName, destinationUrl, thankYouNote });
  return { ok: true };
}

export async function saveLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await isAuthed())) return { error: "Sesi berakhir. Muat ulang halaman." };

  const code = String(formData.get("code") ?? "");
  const { businessName, thankYouNote, destinationUrl } = readForm(formData);
  if (!businessName) return { error: "Nama bisnis wajib diisi." };
  if (!destinationUrl) return { error: "URL tujuan tidak valid." };

  await updateRedirectLink(code, { businessName, destinationUrl, thankYouNote });
  return { ok: true };
}

export async function toggleLink(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;
  const code = String(formData.get("code") ?? "");
  await updateRedirectLink(code, { active: formData.get("active") === "true" });
}

export async function removeLink(formData: FormData): Promise<void> {
  if (!(await isAuthed())) return;
  await deleteRedirectLink(String(formData.get("code") ?? ""));
}
