import AffiliatePortalClient from "./AffiliatePortalClient";

export default async function InvitationAffiliatePage() {
  return (
    <div className="min-h-[100dvh] bg-[#020205] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold">Invitation Affiliate</h1>
        <p className="mt-2 text-sm text-white/70">
          Register to get your affiliate id, then share your link and track how many invitations you generated.
        </p>

        <div className="mt-6">
          <AffiliatePortalClient />
        </div>
      </div>
    </div>
  );
}
