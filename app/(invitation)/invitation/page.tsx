import { getInvitationAffiliate, isAffiliateId, normalizeWhatsappNumber } from "@/lib/affiliate-config";
import { cookies } from "next/headers";
import InvitationLandingClient from "./InvitationLandingClient";

const DEFAULT_WHATSAPP_NUMBER = "62881080088816";

export default async function InvitationLandingPage() {
  const cookieStore = await cookies();
  const affiliateIdRaw = cookieStore.get("inv_affiliate")?.value ?? "";

  let whatsappNumber = DEFAULT_WHATSAPP_NUMBER;

  if (affiliateIdRaw && isAffiliateId(affiliateIdRaw)) {
    const affiliate = await getInvitationAffiliate(affiliateIdRaw).catch(() => null);
    if (affiliate?.enabled) {
      const normalized = normalizeWhatsappNumber(affiliate.whatsappNumber);
      if (normalized) {
        whatsappNumber = normalized;
      }
    }
  }

  return <InvitationLandingClient whatsappNumber={whatsappNumber} />;
}
