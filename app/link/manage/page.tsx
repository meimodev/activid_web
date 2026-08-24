import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLinkAdminCookieName, isLinkAdminSessionValid } from "@/lib/link-admin-session";
import { listRedirectLinks } from "@/lib/redirect-link";
import { LinkConsole, LoginForm } from "./manage-client";

export const metadata: Metadata = {
  title: "Link Console",
  robots: { index: false, follow: false },
};

export default async function LinkManagePage() {
  const store = await cookies();
  const authed = await isLinkAdminSessionValid(store.get(getLinkAdminCookieName())?.value);

  if (!authed) return <LoginForm />;

  return <LinkConsole links={await listRedirectLinks()} />;
}
