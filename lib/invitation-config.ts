import "server-only";

import { getAdminDb } from "@/lib/firebase-admin";
import { InvitationConfig } from "@/types/invitation";
import { unstable_noStore as noStore } from "next/cache";

export async function getInvitationConfig(
  slug: string,
): Promise<InvitationConfig | null> {
  noStore();

  const snap = await getAdminDb().collection("invitations").doc(slug).get();
  if (!snap.exists) return null;
  return snap.data() as InvitationConfig;
}
