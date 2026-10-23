import type { Project, ProjectHistoryEntry } from "./types";

export type ProjectActivity = Omit<ProjectHistoryEntry, "type"> & { type: ProjectHistoryEntry["type"] | "Important date" };

// Project dates stay editable at their source; the client view rolls them into history.
export function projectActivity(project: Project, today: string) {
  return {
    importantDates: [...(project.importantDates ?? [])].filter((entry) => entry.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
    history: [
      ...(project.history ?? []).map((entry): ProjectActivity => ({ ...entry, id: `history:${entry.id}` })),
      ...(project.importantDates ?? []).filter((entry) => entry.date < today).map((entry): ProjectActivity => ({ id: `date:${entry.id}`, type: "Important date", date: entry.date, title: entry.title, summary: entry.note, context: "Scheduled important date" })),
    ].sort((a, b) => b.date.localeCompare(a.date)),
  };
}
