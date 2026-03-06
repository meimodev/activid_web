import AffiliatePortalClient from "./AffiliatePortalClient";
import GalaxyBackground from "./GalaxyBackground";

export default async function InvitationAffiliatePage() {
  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-white overflow-hidden selection:bg-indigo-500/30">
      <GalaxyBackground />

      <div className="relative z-10 mx-auto max-w-md px-4 py-10 sm:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 via-white to-fuchsia-100">
            Affiliate Portal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-indigo-200/70">
            Daftar untuk mendapatkan Affiliate ID Anda, bagikan tautan, dan pantau undangan yang berhasil dibuat.
          </p>
        </div>

        <AffiliatePortalClient />
      </div>
    </div>
  );
}
