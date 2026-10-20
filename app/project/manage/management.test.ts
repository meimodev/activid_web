import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateProjectDraft, type ProjectDraft } from "./validation";
import { distributorProject, getSharedProject } from "../data";

vi.mock("@/lib/firebase-admin", () => ({ getAdminDb: vi.fn(() => { throw new Error("Tests must not access live Firestore."); }) }));
vi.mock("@/lib/project-admin-session", () => ({ isProjectAdmin: vi.fn(async () => false) }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../google-calendar", () => ({ syncProjectCalendar: vi.fn(async (project) => ({ calendarId: project.calendarId || project.calendarSync?.calendarId || "", error: "Google Calendar is unavailable. Save again to retry." })) }));

let directory: string;
let store: typeof import("../store");
beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "activid-management-test-"));
  vi.stubEnv("PROJECTS_LOCAL_DATA_DIR", directory);
  vi.stubEnv("VERCEL", "");
  store = await import("../store");
});
afterEach(() => vi.clearAllMocks());
afterAll(async () => { await rm(directory, { recursive: true, force: true }); vi.unstubAllEnvs(); });

function draft(): ProjectDraft {
  return { ...distributorProject, id: "test-distribution-project", focus: "Prepare user testing.", importantDates: distributorProject.importantDates ?? [], history: distributorProject.history ?? [], updateTitle: "Testing is ready", updateText: "The warehouse team can review the workflow." };
}
describe("project management", () => {
  it("validates dates, progress, activity, and the single current phase at the write boundary", () => {
    expect(validateProjectDraft(draft()).history.map((h) => h.type)).toEqual(["Meeting", "Visit", "Change"]);
    expect(() => validateProjectDraft({ ...draft(), id: "../../escape" })).toThrow("project URL");
    expect(() => validateProjectDraft({ ...draft(), id: "manage" })).toThrow("reserved");
    expect(() => validateProjectDraft({ ...draft(), due: "2026-02-30" })).toThrow("valid handover date");
    expect(() => validateProjectDraft({ ...draft(), completedTasks: 99 })).toThrow("Task counts");
    expect(() => validateProjectDraft({ ...draft(), milestones: distributorProject.milestones.map((m) => ({ ...m, state: "current" })) })).toThrow("Only one");
    expect(() => validateProjectDraft({ ...draft(), history: [{ ...draft().history[0], type: "Other" }] })).toThrow("activity type");
    expect(() => validateProjectDraft({ ...draft(), updateText: "" })).toThrow("both");
    expect(() => validateProjectDraft({ ...draft(), milestones: [{ ...draft().milestones[0], start: "2026-10-01" }] })).toThrow("on or before");
    expect(() => validateProjectDraft({ ...draft(), calendarId: "primary" })).toThrow("dedicated project calendar");
    expect(() => validateProjectDraft({ ...draft(), calendarId: "someone@gmail.com" })).toThrow("dedicated project calendar");
  });
  it("validates and sorts important dates while accepting projects without dates", () => {
    const dates = draft().importantDates;
    expect(validateProjectDraft({ ...draft(), importantDates: [...dates].reverse() }).importantDates).toEqual(dates);
    expect(validateProjectDraft({ ...draft(), importantDates: undefined }).importantDates).toEqual([]);
    expect(() => validateProjectDraft({ ...draft(), importantDates: [{ ...dates[0], date: "2026-02-30" }] })).toThrow("valid important date");
    expect(() => validateProjectDraft({ ...draft(), importantDates: [{ ...dates[0], title: " " }] })).toThrow("date title");
    expect(() => validateProjectDraft({ ...draft(), importantDates: [dates[0], dates[0]] })).toThrow("unique");
    expect(() => validateProjectDraft({ ...draft(), importantDates: Array(31).fill(dates[0]) })).toThrow("at most 30");
  });
  it("persists creates and edits, prevents duplicates and stale overwrites, and isolates staff notes", async () => {
    const input = validateProjectDraft(draft());
    await store.saveProject(input, null);
    const saved = await store.getProject(input.id);
    expect(saved).toMatchObject({ name: input.name, revision: 1, sample: false, internalNotes: input.internalNotes });
    expect(getSharedProject(input.id, [saved!])?.importantDates).toEqual(input.importantDates);
    expect((await store.listProjects()).some((p) => p.id === input.id)).toBe(true);
    expect(store.projectUpdates([saved!])[0].title).toBe(input.updateTitle);
    expect(getSharedProject(input.id, [saved!])).not.toHaveProperty("internalNotes");
    await expect(store.saveProject(input, null)).rejects.toThrow("already in use");
    await store.saveProject({ ...input, focus: "New focus" }, 1);
    await expect(store.saveProject({ ...input, focus: "Stale focus" }, 1)).rejects.toThrow("Reload");
    expect((await store.getProject(input.id))?.focus).toBe("New focus");
    await store.saveProject({ ...input, importantDates: [] }, 2);
    expect((await store.getProject(input.id))?.importantDates).toEqual([]);
  });
  it("rejects unauthenticated server-action writes before touching storage", async () => {
    const { saveManagedProject } = await import("./actions");
    const form = new FormData();
    form.set("project", JSON.stringify(draft()));
    expect(await saveManagedProject(null, null, {}, form)).toEqual({ error: "Your staff session expired. Sign in again before saving." });
  });
  it("preserves edits after a sync failure and reserves each calendar for one project", async () => {
    const input = validateProjectDraft({ ...draft(), id: "calendar-failure", calendarId: "dedicated@group.calendar.google.com" });
    await store.saveProject(input, null);
    const saved = await store.getProject(input.id);
    expect(saved?.importantDates).toEqual(input.importantDates);
    expect(saved?.calendarSync?.error).toContain("unavailable");
    expect(getSharedProject(input.id, [saved!])).not.toHaveProperty("calendarSync");
    expect(getSharedProject(input.id, [saved!])?.calendarId).toBeUndefined();
    await expect(store.saveProject({ ...input, id: "different-project" }, null)).rejects.toThrow("another project");
    expect(await store.getProject("different-project")).toBeNull();
    await store.saveProject({ ...input, focus: "Saved while Google is unavailable" }, 1);
    expect((await store.getProject(input.id))?.focus).toBe("Saved while Google is unavailable");
  });
});
