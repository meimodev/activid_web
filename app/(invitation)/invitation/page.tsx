import InvitationLandingClient from "./InvitationLandingClient";

import { cookies } from "next/headers";
import {
  getInvitationAffiliate,
  isAffiliateId,
  normalizeWhatsappNumber,
} from "@/lib/affiliate-config";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getSingleSearchParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
): string | undefined {
  const value = searchParams[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default async function InvitationLandingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();

  const queryAffiliateId =
    getSingleSearchParam(resolvedSearchParams, "affiliateId") ??
    getSingleSearchParam(resolvedSearchParams, "affiliate_id") ??
    "";
  const cookieAffiliateId = cookieStore.get("inv_affiliate")?.value ?? "";

  const rawAffiliateId = (queryAffiliateId || cookieAffiliateId || "")
    .trim()
    .toUpperCase();

  let affiliateWhatsappNumber: string | undefined;
  if (rawAffiliateId && isAffiliateId(rawAffiliateId)) {
    try {
      const affiliate = await getInvitationAffiliate(rawAffiliateId);
      if (affiliate && affiliate.enabled !== false) {
        const digits = normalizeWhatsappNumber(affiliate.whatsappNumber);
        if (digits) affiliateWhatsappNumber = digits;
      }
    } catch {}
  }

  return <InvitationLandingClient affiliateWhatsappNumber={affiliateWhatsappNumber} />;
}
