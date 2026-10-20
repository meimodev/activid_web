export type ProjectStatus = "In progress" | "Needs review" | "Completed";
export type Milestone = { name: string; date: string; description: string; state: "done" | "current" | "upcoming" };
export type Project = {
  id: string;
  client: string;
  name: string;
  category: string;
  status: ProjectStatus;
  summary: string;
  preview: "identity" | "website" | "photography" | "social" | "software";
  completedTasks: number;
  totalTasks: number;
  due: string;
  updated: string;
  owner: string;
  initials: string;
  next: string;
  focus?: string;
  sample?: boolean;
  milestones: Milestone[];
  importantDates?: ProjectDate[];
  history?: ProjectHistoryEntry[];
  software?: SoftwareTracking;
};

export type ProjectDate = { id: string; title: string; date: string; note: string };

export type ProjectHistoryEntry = {
  id: string;
  type: "Meeting" | "Visit" | "Change";
  date: string;
  title: string;
  summary: string;
  context: string;
};


export type SoftwareTracking = {
  reference: string;
  started: string;
  sprint: { name: string; start: string; end: string; goal: string; work: string[] };
  modules: { name: string; description: string; complete: number; total: number }[];
  checks: { passed: number; pending: number; blocked: number; note: string };
  decision: { title: string; due: string; description: string; options: string[] };
};

export type ProjectUpdate = { projectId: string; date: string; author: string; initials: string; title: string; text: string };
export type InternalProject = Project & { internalNotes: string; revision?: number; latestUpdate?: ProjectUpdate };
