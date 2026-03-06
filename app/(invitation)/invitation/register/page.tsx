import { getInvitationPurposeSeed } from "@/data/invitations";
import { INVITATION_TEMPLATE_LISTINGS } from "@/data/invitation-templates";
import { getInvitationAffiliate, isAffiliateId } from "@/lib/affiliate-config";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import { cookies } from "next/headers";
import { RegisterInvitationForm } from "./RegisterInvitationForm";
import { registerInvitation, verifyInvitationRegisterPassword } from "./actions";

export default async function InvitationRegisterPage() {
  const baseSeed = getInvitationPurposeSeed("marriage");
  const baseConfig = {
    ...baseSeed,
    music: {
      ...baseSeed.music,
      url: "",
    },
    metadata: {
      ...baseSeed.metadata,
      openGraph: {
        ...baseSeed.metadata.openGraph,
        images: [],
      },
      twitter: {
        ...baseSeed.metadata.twitter,
        images: [],
      },
    },
    sections: {
      ...baseSeed.sections,
      hero: {
        ...baseSeed.sections.hero,
        coverImage: "",
      },
      countdown: {
        ...baseSeed.sections.countdown,
        photos: [],
      },
      hosts: {
        ...baseSeed.sections.hosts,
        hosts: (baseSeed.sections.hosts.hosts ?? []).map((h) => ({
          ...h,
          photo: "",
        })),
      },
      gallery: {
        ...baseSeed.sections.gallery,
        photos: [],
      },
    },
  };

  if (!baseConfig) {
    throw new Error("Missing base invitation config in getInvitationPurposeSeed().");
  }

  const templateOptions = INVITATION_TEMPLATE_LISTINGS.map((t) => ({
    id: t.templateId,
    label: t.title,
  }));

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationRegisterSessionCookieName())?.value;
  const hasAdminSession = isInvitationRegisterSessionValid(sessionCookie);

  const affiliateCookieRaw = cookieStore.get("inv_affiliate")?.value ?? "";
  const affiliateCookie = affiliateCookieRaw.trim().toUpperCase();

  const affiliateCookieId = affiliateCookie && isAffiliateId(affiliateCookie) ? affiliateCookie : undefined;
  const hasAffiliateCookie = Boolean(affiliateCookieId);

  const affiliateSessionCookie = cookieStore.get(getInvitationAffiliateSessionCookieName())?.value;
  const hasAffiliateSession = affiliateCookieId
    ? isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateCookieId)
    : false;

  const initialUnlocked = hasAdminSession || hasAffiliateSession;

  let affiliateAttribution: { id: string; name?: string } | null = null;
  if (affiliateCookieId) {
    try {
      const affiliate = await getInvitationAffiliate(affiliateCookieId);
      if (affiliate && affiliate.enabled !== false) {
        affiliateAttribution = {
          id: affiliateCookieId,
          name: typeof affiliate.name === "string" ? affiliate.name.trim() : undefined,
        };
      }
    } catch {}
  }

  return (
    <div className="min-h-[100dvh] bg-[#020205] text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <RegisterInvitationForm
          initialConfig={baseConfig}
          templateOptions={templateOptions}
          action={registerInvitation}
          verifyPasswordAction={verifyInvitationRegisterPassword}
          initialUnlocked={initialUnlocked}
          hasAffiliateCookie={hasAffiliateCookie}
          affiliateCookieId={affiliateCookieId}
          affiliateAttribution={affiliateAttribution}
        />
      </div>
    </div>
  );
}
