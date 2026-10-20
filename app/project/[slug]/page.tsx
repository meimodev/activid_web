import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isProjectAdmin } from "@/lib/project-admin-session";
import { getSharedProject } from "../data";
import { getProject, projectUpdates } from "../store";
import ClientTracker from "./client-tracker";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return { title: project ? `${project.name} | ACTIVID` : "Project not found | ACTIVID" };
}

export default async function SharedProjectPage({ params }: Props) {
  const { slug } = await params;
  const [internal, canEdit] = await Promise.all([getProject(slug), isProjectAdmin()]);
  if (!internal) notFound();
  const project = getSharedProject(internal.id, [internal])!;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return <ClientTracker project={project} updates={projectUpdates([internal])} today={today} canEdit={canEdit} />;
}
