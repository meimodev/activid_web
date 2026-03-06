import { getAdminDb } from "@/lib/firebase-admin";
import VerifyAffiliateClient from "./VerifyAffiliateClient";
import GalaxyBackground from "../GalaxyBackground";
import { Timestamp } from "firebase-admin/firestore";

// Opt out of caching so it always fetches the latest list
export const dynamic = "force-dynamic";

export default async function VerifyAffiliatePage() {
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
