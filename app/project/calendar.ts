import type { Project } from "./types";

export type ProjectCalendarEntry = { key: string; title: string; start: string; end: string; note: string; kind: "phase" | "important" | "activity"; label: string };

export function nextDate(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

// Stable keys let Google events survive title, date, and description edits.
export function projectCalendarEntries(project: Project) {
  const entries: ProjectCalendarEntry[] = [
    ...(project.importantDates ?? []).map((entry): ProjectCalendarEntry => ({ key: `date:${entry.id}`, title: entry.title, start: entry.date, end: entry.date, note: entry.note, kind: "important", label: "Important date" })),
    ...(project.history ?? []).map((entry): ProjectCalendarEntry => ({ key: `activity:${entry.id}`, title: entry.title, start: entry.date, end: entry.date, note: [entry.summary, entry.context].filter(Boolean).join("\n"), kind: "activity", label: entry.type })),
    ...project.milestones.map((entry): ProjectCalendarEntry => ({ key: `phase:${entry.name}`, title: entry.name, start: entry.start ?? entry.date, end: entry.date, note: entry.description, kind: "phase", label: "Phase" })),
  ];
  if (!project.milestones.some((entry) => entry.date === project.due)) entries.push({ key: "handover", title: "Target handover", start: project.due, end: project.due, note: "Target project handover.", kind: "important", label: "Important date" });
  return entries.sort((a, b) => a.end.localeCompare(b.end));
}

export function calendarEntriesOnDate(entries: ProjectCalendarEntry[], date: string) {
  return entries.filter((entry) => entry.start <= date && entry.end >= date).sort((a, b) => Number(a.kind === "phase") - Number(b.kind === "phase") || a.start.localeCompare(b.start));
}

export function calendarMonth(month: string) {
  const first = new Date(`${month}-01T12:00:00Z`);
  const last = new Date(first);
  last.setUTCMonth(last.getUTCMonth() + 1, 0);
  return { label: first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }), offset: (first.getUTCDay() + 6) % 7, days: last.getUTCDate() };
}

export function shiftMonth(month: string, amount: number) {
  const value = new Date(`${month}-01T12:00:00Z`);
  value.setUTCMonth(value.getUTCMonth() + amount);
  return value.toISOString().slice(0, 7);
}

export function googleCalendarUrl(id: string) {
  return `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(btoa(id))}`;
}
