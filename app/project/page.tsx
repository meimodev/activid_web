import ProjectsWorkspace from "./projects-workspace";
import ProjectLogin from "./login";
import { isProjectAdmin } from "@/lib/project-admin-session";
import { getAdminPassword } from "@/lib/admin-password";
import { getSessionSecret } from "@/lib/session-secret";
import { workspace } from "./data";
import { listProjects, projectUpdates } from "./store";

export default async function ProjectsPage() {
  if (!(await isProjectAdmin())) return <ProjectLogin configured={Boolean(getAdminPassword() && getSessionSecret())} />;
  const projects = await listProjects();
  return <ProjectsWorkspace projects={projects} updates={projectUpdates(projects)} workspace={{ ...workspace, snapshot: projects[0]?.updated ?? workspace.snapshot, client: "ACTIVID team" }} />;
}
