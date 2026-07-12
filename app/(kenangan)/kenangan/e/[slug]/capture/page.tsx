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
      <CaptureClient slug={slug} lutIds={theme.lutIds} />
    </Suspense>
  );
}
