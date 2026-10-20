"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isProjectAdmin } from "@/lib/project-admin-session";
import { saveProject } from "../store";
import { validateProjectDraft } from "./validation";

export async function saveManagedProject(id: string | null, expectedRevision: number | null, _previous: { error?: string }, form: FormData): Promise<{ error?: string }> {
  if (!(await isProjectAdmin())) return { error: "Your staff session expired. Sign in again before saving." };
  const raw = form.get("project");
  if (typeof raw !== "string" || raw.length > 300000) return { error: "Project details are missing or too large." };
  let draft;
  try { draft = validateProjectDraft(JSON.parse(raw)); }
  catch (error) { return { error: error instanceof SyntaxError ? "Invalid project details." : (error as Error).message }; }
  if ((id !== null && draft.id !== id) || (id === null && expectedRevision !== null) || (id !== null && (!Number.isSafeInteger(expectedRevision) || expectedRevision === null || expectedRevision < 0))) return { error: "Invalid project identity. Reload this page before saving." };
  try { await saveProject(draft, expectedRevision); }
  catch (error) {
    const message = (error as Error).message;
    if (/^This project changed|^Another save|^Project storage is not configured|^This calendar belongs/.test(message)) return { error: message };
    console.error("Project save failed", error);
    return { error: "Could not save the project. Your edits are still here. Try again." };
  }
  revalidatePath("/project");
  revalidatePath("/project/manage");
  revalidatePath(`/project/manage/${draft.id}`);
  revalidatePath(`/project/${draft.id}`);
  redirect(`/project/manage/${draft.id}?saved=1`);
}
