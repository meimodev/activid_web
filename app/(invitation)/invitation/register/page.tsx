import { INVITATION_DEFAULTS } from "@/data/invitations";
import { INVITATION_TEMPLATE_LISTINGS } from "@/data/invitation-templates";
import {
  getInvitationRegisterSessionCookieName,
  isInvitationRegisterSessionValid,
} from "@/lib/invitation-register-session";
import { cookies } from "next/headers";
import { RegisterInvitationForm } from "./RegisterInvitationForm";
import { registerInvitation, verifyInvitationRegisterPassword } from "./actions";

export default async function InvitationRegisterPage() {
  const baseConfig =
    INVITATION_DEFAULTS["christian-regina"] ?? INVITATION_DEFAULTS["ricci-andrini"];

  if (!baseConfig) {
    throw new Error("Missing base invitation config in INVITATION_DEFAULTS.");
  }

  const templateOptions = INVITATION_TEMPLATE_LISTINGS.map((t) => ({
    id: t.templateId,
    label: t.title,
  }));

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(getInvitationRegisterSessionCookieName())?.value;
  const initialUnlocked = isInvitationRegisterSessionValid(sessionCookie);

  return (
    <div className="min-h-screen bg-[#020205] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <RegisterInvitationForm
          initialConfig={baseConfig}
          templateOptions={templateOptions}
          action={registerInvitation}
          verifyPasswordAction={verifyInvitationRegisterPassword}
          initialUnlocked={initialUnlocked}
        />
      </div>
    </div>
  );
}
