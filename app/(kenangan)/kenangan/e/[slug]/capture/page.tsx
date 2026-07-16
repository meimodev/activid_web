import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getKenanganEventBySlug } from "@/lib/kenangan-event";
import { getKenanganTheme } from "@/data/kenangan-themes";
import CaptureClient from "./CaptureClient";

export const metadata: Metadata = { title: "Ambil Foto" };

export default async function KenanganCapturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getKenanganEventBySlug(slug);
  if (!event) notFound();

  const theme = getKenanganTheme(event.themeId);

  return (
    <Suspense fallback={null}>
      <CaptureClient
        slug={slug}
        eventId={event.id}
        // Closed at load time → CaptureClient skips the camera entirely and
        // shows the closed screen; the realtime listener covers mid-session.
        initiallyClosed={event.status !== "live"}
        lutIds={theme.lutIds}
      />
    </Suspense>
  );
}
