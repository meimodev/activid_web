import "server-only";

import { mkdir, open, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { cache } from "react";
import { getAdminDb } from "@/lib/firebase-admin";
import { projects, updates } from "./data";
import type { InternalProject, ProjectUpdate } from "./types";
import { isProjectSlug, type ProjectDraft } from "./manage/validation";
import { syncProjectCalendar } from "./google-calendar";

const localDirectory = process.env.PROJECTS_LOCAL_DATA_DIR || path.join(process.cwd(), ".local", "projects");
export function projectStorageMode() {
  if (process.env.PROJECTS_LOCAL_DATA_DIR && !process.env.VERCEL) return "local";
  if (["FIREBASE_ADMIN_PROJECT_ID", "FIREBASE_ADMIN_CLIENT_EMAIL", "FIREBASE_ADMIN_PRIVATE_KEY"].every((key) => Boolean(process.env[key]))) return "firestore";
  return process.env.VERCEL ? "unconfigured" : "local";
}
async function localProject(id: string): Promise<InternalProject | null> {
  try { return JSON.parse(await readFile(path.join(localDirectory, `${id}.json`), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
}
export const getProject = cache(async (id: string): Promise<InternalProject | null> => {
  if (!isProjectSlug(id)) return null;
  const mode = projectStorageMode();
  const saved = mode === "firestore" ? (await getAdminDb().collection("clientProjects").doc(id).get()).data() as InternalProject | undefined : mode === "local" ? await localProject(id) : null;
  return saved ?? projects.find((project) => project.id === id) ?? null;
});
export async function listProjects(): Promise<InternalProject[]> {
  const mode = projectStorageMode();
  let saved: InternalProject[] = [];
  if (mode === "firestore") saved = (await getAdminDb().collection("clientProjects").get()).docs.map((doc) => doc.data() as InternalProject);
  if (mode === "local") {
    let files: string[] = [];
    try { files = await readdir(localDirectory); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    saved = (await Promise.all(files.filter((file) => file.endsWith(".json") && isProjectSlug(file.slice(0, -5))).map((file) => localProject(file.slice(0, -5))))).filter((project): project is InternalProject => Boolean(project));
  }
  return [...new Map([...projects, ...saved].map((project) => [project.id, project])).values()].sort((a, b) => b.updated.localeCompare(a.updated));
}
export function projectUpdates(source: InternalProject[]): ProjectUpdate[] {
  return [...source.flatMap((p) => p.latestUpdate ? [p.latestUpdate] : []), ...updates.filter((u) => source.some((p) => p.id === u.projectId))].sort((a, b) => b.date.localeCompare(a.date));
}
function buildProject(draft: ProjectDraft, existing: InternalProject | null, expectedRevision: number | null): InternalProject {
  if ((existing?.calendarSync?.lockUntil ?? 0) > Date.now()) throw new Error("Another save is syncing this project calendar. Try again in a moment.");
  if (expectedRevision === null ? existing !== null : !existing || (existing.revision ?? 0) !== expectedRevision) throw new Error("This project changed or the URL is already in use. Reload before saving to avoid overwriting changes.");
  const { updateTitle, updateText, ...fields } = draft;
  const updated = new Date().toISOString();
  const initials = draft.owner.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return { ...existing, ...fields, preview: existing?.preview ?? "software", next: existing?.next ?? "", sample: existing?.sample ?? Boolean(existing), initials, updated, revision: (existing?.revision ?? 0) + 1,
    ...(updateTitle ? { latestUpdate: existing?.latestUpdate?.title === updateTitle && existing.latestUpdate.text === updateText ? existing.latestUpdate : { projectId: draft.id, title: updateTitle, text: updateText, author: draft.owner, initials, date: updated } } : { latestUpdate: undefined }) };
}
export async function saveProject(draft: ProjectDraft, expectedRevision: number | null) {
  const mode = projectStorageMode();
  if (mode === "unconfigured") throw new Error("Project storage is not configured. Configure Firebase Admin before saving on Vercel.");
  const seed = projects.find((project) => project.id === draft.id) ?? null;
  if (mode === "firestore") {
    const db = getAdminDb(), ref = db.collection("clientProjects").doc(draft.id);
    const saved = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      const project = buildProject(draft, doc.exists ? doc.data() as InternalProject : seed, expectedRevision);
      if (draft.calendarId) {
        const binding = db.collection("clientProjectCalendars").doc(createHash("sha256").update(draft.calendarId).digest("hex"));
        const owner = await transaction.get(binding);
        if (owner.exists && owner.data()?.projectId !== draft.id) throw new Error("This calendar belongs to another project. Create a separate calendar for this project.");
        transaction.set(binding, { projectId: draft.id });
      }
      if (project.calendarId || project.calendarSync?.calendarId) project.calendarSync = { ...project.calendarSync, calendarId: project.calendarSync?.calendarId || project.calendarId || "", lockUntil: Date.now() + 300000 };
      transaction.set(ref, JSON.parse(JSON.stringify(project)));
      return project;
    });
    if (saved.calendarSync?.lockUntil) {
      saved.calendarSync = await syncProjectCalendar(saved, async (calendarId) => {
        await ref.update({ calendarSync: { calendarId, lockUntil: saved.calendarSync!.lockUntil } });
      });
      await ref.update({ calendarSync: saved.calendarSync });
    }
    return saved;
  }
  await mkdir(localDirectory, { recursive: true, mode: 0o700 });
  const file = path.join(localDirectory, `${draft.id}.json`), lockFile = `${file}.lock`;
  let lock;
  try { lock = await open(lockFile, "wx", 0o600); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new Error("Another save is in progress. Try again."); throw error; }
  try {
    const project = buildProject(draft, await localProject(draft.id) ?? seed, expectedRevision);
    const temporary = `${file}.${crypto.randomUUID()}.tmp`;
    if (draft.calendarId) {
      const binding = path.join(localDirectory, `calendar-${createHash("sha256").update(draft.calendarId).digest("hex")}.binding`);
      try { await writeFile(binding, draft.id, { flag: "wx", mode: 0o600 }); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        if (await readFile(binding, "utf8") !== draft.id) throw new Error("This calendar belongs to another project. Create a separate calendar for this project.");
      }
    }
    if (project.calendarId && !project.calendarSync?.calendarId) project.calendarSync = { calendarId: project.calendarId };
    // Save edits first so a Google outage never loses the user's work.
    await writeFile(temporary, JSON.stringify(project), { mode: 0o600 });
    await rename(temporary, file);
    if (project.calendarId || project.calendarSync?.calendarId) {
      project.calendarSync = await syncProjectCalendar(project, async (calendarId) => {
        await writeFile(temporary, JSON.stringify({ ...project, calendarSync: { calendarId } }), { mode: 0o600 });
        await rename(temporary, file);
      });
      await writeFile(temporary, JSON.stringify(project), { mode: 0o600 });
      await rename(temporary, file);
    }
    return project;
  } finally { await lock.close(); await unlink(lockFile); }
}
