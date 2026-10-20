import { isProjectAdmin } from "@/lib/project-admin-session";
import { listProjects, projectStorageMode } from "../store";
import ProjectManager from "./project-manager";

export default async function ManageProjectsPage() {
  if (!(await isProjectAdmin())) return null;
  const projects = await listProjects();
  return <ProjectManager projects={projects} storage={projectStorageMode()} />;
}
