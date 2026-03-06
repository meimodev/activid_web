import { getAdminDb } from "@/lib/firebase-admin";
import VerifyAffiliateClient from "./VerifyAffiliateClient";
import AdminAuthClient from "./AdminAuthClient";
import GalaxyBackground from "../affiliate/GalaxyBackground";
import { Timestamp } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import {
  getInvitationAdminSessionCookieName,
  isInvitationAdminSessionValid,
} from "./lib/invitation-admin-session";

// Opt out of caching so it always fetches the latest list
export const dynamic = "force-dynamic";

export default async function VerifyAffiliatePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationAdminSessionCookieName())?.value;
  const isUnlocked = await isInvitationAdminSessionValid(sessionCookie);

  if (!isUnlocked) {
    return (
      <div className="relative min-h-[100dvh] bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30 flex items-center justify-center">
        <GalaxyBackground />
        <div className="relative z-10 w-full px-4">
          <AdminAuthClient />
        </div>
      </div>
    );
  }

  const db = getAdminDb();
  
  const snapshot = await db
    .collection("invitationAffiliates")
    .where("enabled", "==", false)
    .where("verificationStatus", "==", "pending")
    .limit(50) // reasonable limit for a single page
    .get();

  const initialUnverified = snapshot.docs.map((doc) => {
    const data = doc.data();
    
    // Formatting timestamp to local string if available
    let joinedAt = "-";
    if (data.joinedAt instanceof Timestamp) {
      joinedAt = data.joinedAt.toDate().toLocaleString("id-ID");
    } else if (data.joinedAt && typeof data.joinedAt.toMillis === "function") {
      joinedAt = new Date(data.joinedAt.toMillis()).toLocaleString("id-ID");
    }

    return {
      id: doc.id,
      name: typeof data.name === "string" ? data.name : "Unknown",
      whatsappNumber: typeof data.whatsappNumber === "string" ? data.whatsappNumber : "-",
      joinedAt,
    };
  });

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
      <GalaxyBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <VerifyAffiliateClient initialUnverified={initialUnverified} />
      </div>
    </div>
  );
}
