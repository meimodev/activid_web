import { INVITATION_DEFAULTS } from "@/data/invitations";
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

  const templateOptions = [
    { id: "flow", label: "Flow" },
    { id: "saturn", label: "Saturn" },
    { id: "mercury", label: "Mercury" },
    { id: "pluto", label: "Pluto" },
    { id: "amalthea", label: "Amalthea" },
    { id: "venus", label: "Venus" },
    { id: "jupiter", label: "Jupiter" },
    { id: "neptune", label: "Neptune" },
  ];

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
