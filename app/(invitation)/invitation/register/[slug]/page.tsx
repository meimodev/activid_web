import { INVITATION_TEMPLATE_LISTINGS } from "@/data/invitation-templates";
import {
  getInvitationAffiliateSessionCookieName,
  isInvitationAffiliateSessionValid,
} from "@/lib/invitation-affiliate-session";
import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import { getInvitationAffiliate, isAffiliateId } from "@/lib/affiliate-config";
import { getAdminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import Link from "next/link";
import { RegisterInvitationForm } from "../RegisterInvitationForm";
import { updateInvitation, verifyInvitationRegisterPassword } from "../actions";
import {
  ADMIN_INVITATION_AFFILIATE_ID,
  type InvitationConfig,
} from "@/types/invitation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InvitationRegisterEditPage({ params }: PageProps) {
  const { slug } = await params;

  const templateOptions = INVITATION_TEMPLATE_LISTINGS.map((t) => ({
    id: t.templateId,
    label: t.title,
  }));

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationRegisterSessionCookieName())?.value;
  const hasAdminSession = isInvitationRegisterSessionValid(sessionCookie);

  const affiliateCookieRaw = cookieStore.get("inv_affiliate")?.value ?? "";
  const affiliateCookie = affiliateCookieRaw.trim().toUpperCase();
  const affiliateCookieId = affiliateCookie && isAffiliateId(affiliateCookie) ? affiliateCookie : "";
  const affiliateSessionCookie = cookieStore.get(getInvitationAffiliateSessionCookieName())?.value;
  const hasAffiliateSession = affiliateCookieId
    ? isInvitationAffiliateSessionValid(affiliateSessionCookie, affiliateCookieId)
    : false;

  const initialUnlocked = hasAdminSession || hasAffiliateSession;

  const snap = await getAdminDb().collection("invitations").doc(slug).get();
  const config = (snap.exists ? (snap.data() as InvitationConfig) : null) as InvitationConfig | null;

  if (!config) {
    return (
      <div className="min-h-[100dvh] bg-[#020205] text-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-4 sm:p-6">
            <div className="text-xl font-black tracking-tight text-white">Mission not found</div>
            <div className="text-sm text-white/70 break-all">
              No invitation config exists at <span className="font-mono text-white/85">invitations/{slug}</span>.
            </div>
            <Link
              href="/invitation/register"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:border-indigo-400/60 w-fit"
            >
              Back to Create
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const existingAffiliateId =
    typeof config.affiliateId === "string" ? config.affiliateId.trim().toUpperCase() : "";

  let affiliateAttribution: { id: string; name?: string } | null = null;
  if (
    existingAffiliateId &&
    existingAffiliateId !== ADMIN_INVITATION_AFFILIATE_ID &&
    isAffiliateId(existingAffiliateId)
  ) {
    try {
      const affiliate = await getInvitationAffiliate(existingAffiliateId);
      if (affiliate) {
        affiliateAttribution = {
          id: existingAffiliateId,
          name: typeof affiliate.name === "string" ? affiliate.name.trim() : undefined,
        };
      }
    } catch {}
  }

  return (
    <div className="min-h-[100dvh] bg-[#020205] text-white">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <RegisterInvitationForm
          mode="edit"
          existingSlug={slug}
          initialConfig={config}
          templateOptions={templateOptions}
          action={updateInvitation}
          verifyPasswordAction={verifyInvitationRegisterPassword}
          initialUnlocked={initialUnlocked}
          affiliateAttribution={affiliateAttribution}
        />
      </div>
    </div>
  );
}
