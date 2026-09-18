"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { getRedirectLink } from "@/lib/redirect-link";

export async function recordLinkOpen(code: string): Promise<void> {
  if (typeof code !== "string") return;
  const link = await getRedirectLink(code);
  if (!link?.active) return;

  // Atomic increment preserves simultaneous opens and initializes older links.
  await getAdminDb().collection("redirectLinks").doc(code).update({
    openCount: FieldValue.increment(1),
  });
}
