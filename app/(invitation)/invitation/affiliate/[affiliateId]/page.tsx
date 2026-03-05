import { isAffiliateId } from "@/lib/affiliate-config";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import { cookies } from "next/headers";
import AffiliateDashboardClient from "./AffiliateDashboardClient";

interface PageProps {
  params: Promise<{
    affiliateId: string;
  }>;
}

type AffiliateDoc = {
  name?: unknown;
  whatsappNumber?: unknown;
  enabled?: unknown;
  generatedInvitationCount?: unknown;
  joinedAt?: unknown;
};

type GeneratedInvitationDoc = {
  createdAt?: unknown;
  templateId?: unknown;
};

export default async function AffiliateDashboardPage({ params }: PageProps) {
  const { affiliateId: rawAffiliateId } = await params;
  const affiliateId = (rawAffiliateId ?? "").trim().toUpperCase();

  if (!affiliateId || !isAffiliateId(affiliateId)) {
    return (
      <div className="min-h-[100dvh] bg-[#020205] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
            <div className="text-xl font-black">Invalid affiliate id</div>
          </div>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationAffiliateSessionCookieName())?.value;
  const unlocked = isInvitationAffiliateSessionValid(sessionCookie, affiliateId);

  const snap = await getAdminDb().collection("invitationAffiliates").doc(affiliateId).get();
  if (!snap.exists) {
    return (
      <div className="min-h-[100dvh] bg-[#020205] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-6">
            <div className="text-xl font-black">Affiliate not found</div>
          </div>
        </div>
      </div>
    );
  }

  const data = (snap.data() as AffiliateDoc) ?? {};
  const name = typeof data.name === "string" ? data.name : "";
  const whatsappNumber = typeof data.whatsappNumber === "string" ? data.whatsappNumber : "";
  const enabled = data.enabled !== false;
  const generatedInvitationCount =
    typeof data.generatedInvitationCount === "number" ? data.generatedInvitationCount : 0;

  let generatedInvitations: { slug: string; templateId: string; createdAtMs: number }[] = [];
  if (unlocked) {
    try {
      const slugSnap = await getAdminDb()
        .collection("invitationAffiliates")
        .doc(affiliateId)
        .collection("generatedInvitations")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get();

      generatedInvitations = slugSnap.docs.map((d) => {
        const docData = (d.data() as GeneratedInvitationDoc | undefined) ?? {};
        const templateId = typeof docData.templateId === "string" ? docData.templateId : "";
        const createdAtMs =
          typeof (docData.createdAt as { toMillis?: unknown } | null)?.toMillis === "function"
            ? (docData.createdAt as { toMillis: () => number }).toMillis()
            : 0;
        return {
          slug: d.id,
          templateId,
          createdAtMs,
        };
      });
    } catch {}
  }

  return (
    <div className="min-h-[100dvh] bg-[#020205] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <AffiliateDashboardClient
          affiliate={{
            id: affiliateId,
            name,
            whatsappNumber,
            enabled,
            generatedInvitationCount,
          }}
          unlocked={unlocked}
          generatedInvitations={generatedInvitations}
        />
      </div>
    </div>
  );
}
