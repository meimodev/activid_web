import type { InternalProject, Milestone, ProjectDate, ProjectHistoryEntry, ProjectStatus } from "../types";

export type ProjectDraft = Pick<InternalProject, "id" | "name" | "client" | "category" | "status" | "summary" | "completedTasks" | "totalTasks" | "due" | "owner" | "internalNotes" | "milestones"> & {
  focus: string; history: ProjectHistoryEntry[]; importantDates: ProjectDate[]; calendarId?: string; updateTitle: string; updateText: string;
};

export const projectStatuses: ProjectStatus[] = ["In progress", "Needs review", "Completed"];
export function isProjectSlug(value: string) {
  return value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !["manage", "new"].includes(value);
}

function text(value: unknown, label: string, max = 200, required = true): string {
  if (typeof value !== "string" || value.trim().length > max || (required && !value.trim())) throw new Error(`Enter ${label}${max > 200 ? ` (up to ${max} characters)` : ""}.`);
  return value.trim();
}
function date(value: unknown, label: string) {
  const result = text(value, label, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result) throw new Error(`Enter a valid ${label}.`);
  return result;
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid project details.");
  return value as Record<string, unknown>;
}
export function validateProjectDraft(value: unknown): ProjectDraft {
  const raw = record(value);
  const id = text(raw.id, "a project URL", 100);
  if (!isProjectSlug(id)) throw new Error("Use lowercase letters, numbers, and hyphens for the project URL. ‘manage’ and ‘new’ are reserved.");
  if (!projectStatuses.includes(raw.status as ProjectStatus)) throw new Error("Select a project status.");
  const status = raw.status as ProjectStatus;
  const completedTasks = Number(raw.completedTasks), totalTasks = Number(raw.totalTasks);
  if (!Number.isSafeInteger(totalTasks) || totalTasks < 1 || totalTasks > 100000 || !Number.isSafeInteger(completedTasks) || completedTasks < 0 || completedTasks > totalTasks) throw new Error("Task counts must be whole numbers, with completed tasks between zero and the total.");
  if (status === "Completed" && completedTasks !== totalTasks) throw new Error("Complete all tasks before marking the project completed.");
  const due = date(raw.due, "handover date");
  if (!Array.isArray(raw.milestones) || raw.milestones.length < 1 || raw.milestones.length > 30) throw new Error("Add between 1 and 30 milestones.");
  const milestones: Milestone[] = raw.milestones.map((item) => {
    const row = record(item);
    if (!["done", "current", "upcoming"].includes(String(row.state))) throw new Error("Select a milestone state.");
    const end = date(row.date, "milestone end date");
    const start = date(row.start ?? end, "milestone start date");
    if (start > end) throw new Error("A milestone must start on or before its end date.");
    return { name: text(row.name, "a milestone name"), start, date: end, description: text(row.description, "a milestone description", 2000), state: row.state as Milestone["state"] };
  });
  if (milestones.filter((m) => m.state === "current").length > 1) throw new Error("Only one milestone can be the current phase.");
  if (new Set(milestones.map((m) => m.name)).size !== milestones.length) throw new Error("Give each milestone a unique name.");
  if (milestones.some((m, i) => m.date > due || (i > 0 && m.date < milestones[i - 1].date))) throw new Error("Keep milestone dates in order, on or before handover.");
  if (status === "Completed" && milestones.some((m) => m.state !== "done")) throw new Error("Mark every milestone completed before completing the project.");
  const rawDates = raw.importantDates ?? [];
  if (!Array.isArray(rawDates) || rawDates.length > 30) throw new Error("Use at most 30 important dates.");
  const importantDates: ProjectDate[] = rawDates.map((item) => {
    const row = record(item);
    return { id: text(row.id, "a date ID", 100), title: text(row.title, "a date title"), date: date(row.date, "important date"), note: text(row.note, "a date note", 1000, false) };
  }).sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(importantDates.map((item) => item.id)).size !== importantDates.length) throw new Error("Important date IDs must be unique.");
  if (!Array.isArray(raw.history) || raw.history.length > 100) throw new Error("Use at most 100 activity entries.");
  const history: ProjectHistoryEntry[] = raw.history.map((item) => {
    const row = record(item);
    if (!["Meeting", "Visit", "Change"].includes(String(row.type))) throw new Error("Select an activity type.");
    return { id: text(row.id, "an activity ID", 100), type: row.type as ProjectHistoryEntry["type"], date: date(row.date, "activity date"), title: text(row.title, "an activity title"), summary: text(row.summary, "an activity summary", 2000), context: text(row.context, "participants or location", 300) };
  }).sort((a, b) => b.date.localeCompare(a.date));
  if (new Set(history.map((h) => h.id)).size !== history.length) throw new Error("Activity IDs must be unique.");
  const updateTitle = text(raw.updateTitle, "an update title", 200, false), updateText = text(raw.updateText, "update text", 3000, false);
  if (Boolean(updateTitle) !== Boolean(updateText)) throw new Error("Add both a title and text for the client update, or leave both empty.");
  const calendarId = text(raw.calendarId ?? "", "a Google Calendar ID", 254, false);
  if (calendarId && !/^[a-z0-9_-]+@group\.calendar\.google\.com$/i.test(calendarId)) throw new Error("Use the ID of a dedicated project calendar, ending in @group.calendar.google.com. Personal calendars cannot be connected.");
  return { id, status, completedTasks, totalTasks, due, milestones, importantDates, calendarId, history, updateTitle, updateText,
    name: text(raw.name, "a project name"), client: text(raw.client, "a client name"), category: text(raw.category, "a project category"), owner: text(raw.owner, "a project lead"),
    summary: text(raw.summary, "a project summary", 2000), focus: text(raw.focus, "the current focus", 2000), internalNotes: text(raw.internalNotes, "internal notes", 5000, false) };
}
