import type { Metadata } from "next";

import BolBolStudioClient from "./_components/BolBolStudioClient";
import { getBolBolStudioPageData, verifyBolBolAdmin } from "./server";

export const metadata: Metadata = {
  title: "Bol Bol Studio | ACTIVID",
  description:
    "Self photo studio booking flow isolated inside the main ACTIVID site shell.",
};

type SearchParams = Record<string, string | string[] | undefined>;

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function getSingleSearchParam(searchParams: SearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function BolBolStudioPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const authPhone = getSingleSearchParam(resolvedSearchParams, "phone").trim();
  const authPin = getSingleSearchParam(resolvedSearchParams, "pin").trim();

  const [pageData, isAdmin] = await Promise.all([
    getBolBolStudioPageData(),
    authPhone && authPin ? verifyBolBolAdmin(authPhone, authPin) : Promise.resolve(false),
  ]);

  return (
    <BolBolStudioClient
      initialBookings={pageData.bookings}
      studioInfo={pageData.studioInfo}
      initialIsAdmin={isAdmin}
      adminAuth={isAdmin ? { phone: authPhone, pin: authPin } : null}
      warning={pageData.warning}
    />
  );
}
