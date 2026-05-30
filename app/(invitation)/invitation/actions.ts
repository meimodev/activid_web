"use server";

import { getAdminDb } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";

const getCachedExampleInvitations = unstable_cache(
  async (templateId: string) => {
    const db = getAdminDb();
    const snap = await db
      .collection("invitations")
      .where("templateId", "==", templateId)
      .limit(10) // fetch slightly more to allow filtering out demos
      .get();

    return snap.docs
      .filter((doc) => !doc.id.endsWith("-demo"))
      .slice(0, 6) // return at most 6 public examples
      .map((doc) => {
        const data = doc.data();
        const hosts = data.sections?.hosts?.hosts;
        const hostsTitle = Array.isArray(hosts)
          ? hosts
              .map((h: any) => typeof h?.firstName === "string" ? h.firstName.trim() : "")
              .filter(Boolean)
              .join(" & ")
          : "";
        return {
          slug: doc.id,
          title: hostsTitle || doc.id,
        };
      });
  },
  ["example-invitations"],
  {
    revalidate: 60 * 60 * 24, // 24 hours (daily caching)
    tags: ["example-invitations"],
  }
);

export async function getExampleInvitations(templateId: string) {
  if (!templateId) return [];
  return getCachedExampleInvitations(templateId);
}

const getCachedLatestPreviews = unstable_cache(
  async (): Promise<Record<string, string[]>> => {
    try {
      const db = getAdminDb();
      // Fetch latest 150 invitations to extract multiple representative slugs for all templates
      const snap = await db
        .collection("invitations")
        .limit(150)
        .get();

      const previewMap: Record<string, string[]> = {};
      snap.docs.forEach((doc) => {
        const data = doc.data();
        const templateId = data.templateId as string | undefined;
        if (templateId && !doc.id.endsWith("-demo")) {
          if (!previewMap[templateId]) {
            previewMap[templateId] = [];
          }
          // Collect up to 10 generated examples per template ID to keep payload compact
          if (previewMap[templateId].length < 10) {
            previewMap[templateId].push(doc.id);
          }
        }
      });
      return previewMap;
    } catch (e) {
      console.error("Failed to query latest previews in server action:", e);
      return {};
    }
  },
  ["latest-generated-previews-list"],
  {
    revalidate: 60 * 60 * 24, // 24 hours (daily caching)
    tags: ["latest-generated-previews-list"],
  }
);

export async function getLatestGeneratedPreviews(): Promise<Record<string, string[]>> {
  return getCachedLatestPreviews();
}
