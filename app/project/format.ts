import type { Project } from "./types";

export function progress(project: Project) {
  return Math.round((project.completedTasks / project.totalTasks) * 100);
}

export function visibleProjects(projects: Project[], query: string, status: string, sort: string) {
  const search = query.trim().toLowerCase();
  return projects
    .filter((project) => (status === "All projects" || project.status === status)
      && `${project.name} ${project.client} ${project.category} ${project.owner}`.toLowerCase().includes(search))
    .sort((a, b) => sort === "due" ? a.due.localeCompare(b.due) : b.updated.localeCompare(a.updated));
}

export function formatDate(date: string, withYear = false) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "Asia/Makassar" }).format(new Date(date.length === 10 ? `${date}T12:00:00+08:00` : date));
}
