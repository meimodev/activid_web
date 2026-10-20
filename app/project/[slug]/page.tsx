import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSharedProject, workspace } from "../data";
import { getProject, projectUpdates } from "../store";
import ClientTracker from "./client-tracker";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return { title: project ? `${project.name} | ACTIVID` : "Project not found | ACTIVID" };
}

export default async function SharedProjectPage({ params }: Props) {
  const internal = await getProject((await params).slug);
  if (!internal) notFound();
  const project = getSharedProject(internal.id, [internal])!;
  return <ClientTracker project={project} updates={projectUpdates([internal])} contactEmail={workspace.email} />;
}
