import { notFound } from "next/navigation";
import { isProjectAdmin } from "@/lib/project-admin-session";
import { getProject, projectStorageMode, projectUpdates } from "../../store";
import ProjectEditor from "../project-editor";

export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> }) {
  if (!(await isProjectAdmin())) return null;
  const { slug } = await params;
  const project = slug === "new" ? null : await getProject(slug);
  if (slug !== "new" && !project) notFound();
  return <ProjectEditor key={`${slug}-${project?.revision ?? 0}`} project={project} update={project ? projectUpdates([project])[0] : undefined} storage={projectStorageMode()} saved={(await searchParams).saved === "1"} />;
}
