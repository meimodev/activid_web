"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ArrowLeft, ArrowUpRight, Check, Plus, Trash2 } from "lucide-react";
import type { InternalProject, ProjectDate, ProjectHistoryEntry, ProjectUpdate } from "../types";
import { saveManagedProject } from "./actions";
import { googleCalendarUrl } from "../calendar";
import { projectStatuses, type ProjectDraft } from "./validation";
import { StorageNotice } from "./project-manager";

function today() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
function initialDraft(project: InternalProject | null, update?: ProjectUpdate): ProjectDraft {
  return { id: project?.id ?? "", name: project?.name ?? "", client: project?.client ?? "", category: project?.category ?? "Software development", status: project?.status ?? "In progress", summary: project?.summary ?? "", focus: project?.focus || project?.software?.sprint.goal || project?.summary || "", completedTasks: project?.completedTasks ?? 0, totalTasks: project?.totalTasks ?? 1, due: project?.due ?? today(), owner: project?.owner ?? "", internalNotes: project?.internalNotes ?? "", milestones: project?.milestones.map((entry) => ({ ...entry, start: entry.start ?? entry.date })) ?? [], calendarId: project?.calendarId ?? "", importantDates: project?.importantDates ?? [], history: project?.history ?? [], updateTitle: update?.title ?? "", updateText: update?.text ?? "" };
}
function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label>{label}<input {...props} /></label>;
}
function TextareaField({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const id = useId();
  return <div className="manager-textarea"><label htmlFor={id}>{label}</label><textarea id={id} {...props} /></div>;
}

export default function ProjectEditor({ project, update, storage, saved, calendarEmail }: { calendarEmail: string; project: InternalProject | null; update?: ProjectUpdate; storage: string; saved: boolean }) {
  const [draft, setDraft] = useState(() => initialDraft(project, update));
  const [tab, setTab] = useState("Overview");
  const [state, action, pending] = useActionState(saveManagedProject.bind(null, project?.id ?? null, project ? project.revision ?? 0 : null), {});
  const dirty = JSON.stringify(draft) !== JSON.stringify(initialDraft(project, update));
  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);
  function change<K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) { setDraft((previous) => ({ ...previous, [key]: value })); }
  function addHistory() { change("history", [{ id: crypto.randomUUID(), type: "Meeting", date: today(), title: "", summary: "", context: "" }, ...draft.history]); }
  function editHistory(index: number, patch: Partial<ProjectHistoryEntry>) { change("history", draft.history.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  function editDate(index: number, patch: Partial<ProjectDate>) { change("importantDates", draft.importantDates.map((row, i) => i === index ? { ...row, ...patch } : row)); }
  const completed = Math.round(draft.completedTasks / (draft.totalTasks || 1) * 100);

  return <>
    <Link className="manager-back" href="/project/manage"><ArrowLeft size={16} />All projects</Link>
    <div className="manager-title"><div><h1>{project ? "Edit project" : "New project"}</h1><p>{project ? `${project.client} · ${project.name}` : "Create a tracker to share with your client."}</p></div>{project && <Link className="manager-secondary" href={`/project/${project.id}`}>Client view<ArrowUpRight size={15} /></Link>}</div>
    <StorageNotice storage={storage} />
    {saved && !dirty && <p role="status" className="manager-success"><Check size={16} />Project saved. The client tracker is up to date.</p>}
    {project?.calendarSync?.error && <p role="alert" className="manager-calendar-warning">Project saved, but Google Calendar is not up to date. {project.calendarSync.error}</p>}
    <form action={action} className="manager-editor">
      <input type="hidden" name="project" value={JSON.stringify(draft)} />
      <fieldset disabled={pending} className="manager-editor-fields">
        <nav className="manager-tabs" aria-label="Project sections">{["Overview", "Dates", "Timeline", "Activity"].map((name) => <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)}>{name}{name === "Dates" && <span>{draft.importantDates.length}</span>}{name === "Timeline" && <span>{draft.milestones.length}</span>}{name === "Activity" && <span>{draft.history.length}</span>}</button>)}</nav>
        {tab === "Overview" && <div className="manager-editor-grid">
          <section className="manager-panel" aria-labelledby="details-heading"><div className="manager-panel-heading"><h2 id="details-heading">Project details</h2><p>These details are shared with the client.</p></div>
            <div className="manager-field-pair"><Field label="Project name" required maxLength={200} value={draft.name} onChange={(e) => change("name", e.target.value)} /><Field label="Client" required maxLength={200} value={draft.client} onChange={(e) => change("client", e.target.value)} /></div>
            <label>Project URL<input required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={Boolean(project)} value={draft.id} onChange={(e) => change("id", e.target.value)} placeholder="distributor-management-system" aria-describedby="project-url-help" /></label><small id="project-url-help" className="manager-field-help">/project/{draft.id || "your-project-url"}{project ? " · URL stays fixed to preserve client links." : " · Lowercase letters, numbers, and hyphens."}</small>
            <div className="manager-field-pair"><Field label="Category" required maxLength={200} value={draft.category} onChange={(e) => change("category", e.target.value)} /><Field label="Project lead" required maxLength={200} value={draft.owner} onChange={(e) => change("owner", e.target.value)} /></div>
            <TextareaField label="Project summary" required rows={3} maxLength={2000} value={draft.summary} onChange={(e) => change("summary", e.target.value)} />
            <TextareaField label="Current focus" required rows={2} maxLength={2000} value={draft.focus} onChange={(e) => change("focus", e.target.value)} aria-describedby="project-focus-help" /><small id="project-focus-help" className="manager-field-help">Shown below the current phase on the client tracker.</small>
          </section>
          <div className="manager-editor-side"><section className="manager-panel" aria-labelledby="progress-heading"><div className="manager-panel-heading"><h2 id="progress-heading">Progress & delivery</h2></div>
            <label>Status<select value={draft.status} onChange={(e) => change("status", e.target.value as ProjectDraft["status"])}>{projectStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <div className="manager-field-pair"><Field label="Completed tasks" type="number" min={0} max={draft.totalTasks} step={1} required value={draft.completedTasks} onChange={(e) => change("completedTasks", e.target.valueAsNumber || 0)} /><Field label="Total tasks" type="number" min={1} max={100000} step={1} required value={draft.totalTasks} onChange={(e) => change("totalTasks", e.target.valueAsNumber || 0)} /></div>
            <p className="manager-completion">{completed}% complete<span>{draft.completedTasks} of {draft.totalTasks} tasks</span></p>
            <Field label="Target handover" type="date" required value={draft.due} onChange={(e) => change("due", e.target.value)} />
          </section><section className="manager-panel" aria-labelledby="notes-heading"><div className="manager-panel-heading"><h2 id="notes-heading">Internal notes</h2><p>Visible only to the ACTIVID team.</p></div><TextareaField label="Team notes" rows={4} maxLength={5000} value={draft.internalNotes} onChange={(e) => change("internalNotes", e.target.value)} /></section></div>
          <section className="manager-panel manager-update-panel" aria-labelledby="update-heading"><div className="manager-panel-heading"><h2 id="update-heading">Latest client update</h2><p>A short update on what has changed. Leave both fields empty to skip adding an update.</p></div><Field label="Update title" maxLength={200} value={draft.updateTitle} onChange={(e) => change("updateTitle", e.target.value)} /><TextareaField label="Update text" rows={3} maxLength={3000} value={draft.updateText} onChange={(e) => change("updateText", e.target.value)} /></section>
        </div>}
        {tab === "Dates" && <section className="manager-panel" aria-labelledby="dates-heading"><div className="manager-panel-heading manager-heading-action"><div><h2 id="dates-heading">Important dates</h2><p>Add reviews, meetings, deadlines, or training dates. Saved dates appear on the client tracker in date order.</p></div><button type="button" className="manager-secondary" onClick={() => change("importantDates", [...draft.importantDates, { id: crypto.randomUUID(), title: "", date: today(), note: "" }])} disabled={draft.importantDates.length >= 30}><Plus size={16} />Add date</button></div>
          {draft.importantDates.length === 0 && <p className="manager-empty">No important dates yet. Add a date you want the client to keep in mind.</p>}
          {draft.importantDates.map((entry, index) => <fieldset className="manager-entry" key={entry.id}><legend>Date {index + 1}</legend><div className="manager-field-pair"><Field label="Date title" required maxLength={200} value={entry.title} onChange={(e) => editDate(index, { title: e.target.value })} /><Field label="Important date" required type="date" value={entry.date} onChange={(e) => editDate(index, { date: e.target.value })} /></div><TextareaField label="Date note (optional)" rows={2} maxLength={1000} value={entry.note} onChange={(e) => editDate(index, { note: e.target.value })} /><button type="button" className="manager-remove" onClick={() => change("importantDates", draft.importantDates.filter((row) => row.id !== entry.id))}><Trash2 size={14} />Remove date {index + 1}</button></fieldset>)}
          <div className="manager-calendar-connection">
            <h3>Shared Google Calendar</h3>
            <p>Use a calendar dedicated to this project. Saving sends important dates, phase date ranges, and activity history to Google Calendar, including edits and removals. Make schedule changes here.</p>
            {project?.calendarSync?.syncedAt && !project.calendarSync.error && <p className="manager-calendar-status">Last synced {new Date(project.calendarSync.syncedAt).toLocaleString("en-GB", { timeZone: "Asia/Makassar" })} (WITA).</p>}
            {project?.calendarSync?.lockUntil && <p role="status">A calendar sync was started. If it was interrupted, try saving again in a few minutes.</p>}
            <Field label="Google Calendar ID" maxLength={254} value={draft.calendarId ?? ""} placeholder="…@group.calendar.google.com" onChange={(e) => change("calendarId", e.target.value)} aria-describedby="calendar-id-help" />
            <small id="calendar-id-help" className="manager-field-help">Find this in Google Calendar → Settings → your project calendar → Integrate calendar. Clearing the ID removes this project’s synced events from the previous calendar.</small>
            {project?.calendarId && <a className="manager-secondary" href={googleCalendarUrl(project.calendarId)} target="_blank" rel="noreferrer">Open project calendar<ArrowUpRight size={15} /></a>}
            <details className="manager-calendar-setup"><summary>Connect a project calendar</summary><ol>
              <li><a href="https://support.google.com/calendar/answer/37095" target="_blank" rel="noreferrer">Create a new calendar</a> named after this project in your Google account.</li>
              <li>Share it with your client using “See event details” (sometimes “See all event details”). They can add the calendar to their Google Calendar and view updates, without editing project dates. Keep the calendar private.</li>
              <li>{calendarEmail ? <>Share it with <strong>{calendarEmail}</strong> using “Make changes to events”.</> : <>The app’s calendar service account is not configured yet. Ask your developer to configure it before connecting.</>}</li>
              <li>Enable the Google Calendar API in the service account’s Google Cloud project.</li>
              <li>Paste the calendar ID above and save. Save again to retry if syncing fails.</li>
            </ol><p>Google Calendar changes do not update this page. Use this page to manage the project schedule.</p></details>
          </div>
        </section>}
        {tab === "Timeline" && <section className="manager-panel" aria-labelledby="timeline-heading"><div className="manager-panel-heading manager-heading-action"><div><h2 id="timeline-heading">Project timeline</h2><p>Keep milestones in date order. Only one phase can be current.</p></div><button type="button" className="manager-secondary" onClick={() => change("milestones", [...draft.milestones, { name: "", start: draft.due, date: draft.due, state: "upcoming", description: "" }])} disabled={draft.milestones.length >= 30}><Plus size={16} />Add milestone</button></div>
          {draft.milestones.length === 0 && <p className="manager-empty">Add the first milestone to describe the project process.</p>}
          {draft.milestones.map((milestone, index) => <fieldset key={index} className="manager-entry"><legend>Milestone {index + 1}</legend><div className="manager-entry-fields manager-milestone-fields"><Field label="Milestone name" required maxLength={200} value={milestone.name} onChange={(e) => change("milestones", draft.milestones.map((row, i) => i === index ? { ...row, name: e.target.value } : row))} /><Field label="Milestone start" type="date" required value={milestone.start ?? milestone.date} onChange={(e) => change("milestones", draft.milestones.map((row, i) => i === index ? { ...row, start: e.target.value } : row))} /><Field label="Milestone end" type="date" required value={milestone.date} onChange={(e) => change("milestones", draft.milestones.map((row, i) => i === index ? { ...row, date: e.target.value } : row))} /><label>Phase state<select value={milestone.state} onChange={(e) => change("milestones", draft.milestones.map((row, i) => i === index ? { ...row, state: e.target.value as typeof row.state } : row))}><option value="done">Completed</option><option value="current">Current phase</option><option value="upcoming">Upcoming</option></select></label></div><TextareaField label="Milestone description" rows={2} required maxLength={2000} value={milestone.description} onChange={(e) => change("milestones", draft.milestones.map((row, i) => i === index ? { ...row, description: e.target.value } : row))} /><button type="button" className="manager-remove" onClick={() => change("milestones", draft.milestones.filter((_, i) => i !== index))}><Trash2 size={14} />Remove milestone {index + 1}</button></fieldset>)}
        </section>}
        {tab === "Activity" && <section className="manager-panel" aria-labelledby="activity-heading"><div className="manager-panel-heading manager-heading-action"><div><h2 id="activity-heading">Activity history</h2><p>Meetings, visits, and changes appear on the client tracker, newest first.</p></div><button type="button" className="manager-secondary" onClick={addHistory} disabled={draft.history.length >= 100}><Plus size={16} />Add activity</button></div>
          {draft.history.length === 0 && <p className="manager-empty">No activity yet. Add a meeting, visit, or project change.</p>}
          {draft.history.map((entry, index) => <fieldset className="manager-entry" key={entry.id}><legend>Activity {index + 1}</legend><div className="manager-entry-fields"><label>Activity type<select value={entry.type} onChange={(e) => editHistory(index, { type: e.target.value as ProjectHistoryEntry["type"] })}>{["Meeting", "Visit", "Change"].map((type) => <option key={type}>{type}</option>)}</select></label><Field label="Activity date" required type="date" value={entry.date} onChange={(e) => editHistory(index, { date: e.target.value })} /><Field label="Activity title" required maxLength={200} value={entry.title} onChange={(e) => editHistory(index, { title: e.target.value })} /></div><TextareaField label="Summary & outcome" required rows={2} maxLength={2000} value={entry.summary} onChange={(e) => editHistory(index, { summary: e.target.value })} /><Field label="Participants or location" required maxLength={300} value={entry.context} onChange={(e) => editHistory(index, { context: e.target.value })} /><button type="button" className="manager-remove" onClick={() => change("history", draft.history.filter((row) => row.id !== entry.id))}><Trash2 size={14} />Remove activity {index + 1}</button></fieldset>)}
        </section>}
      </fieldset>
      <div className="manager-save-bar"><div><p>{dirty ? "Unsaved changes" : project ? "All changes saved" : "Not saved yet"}</p><span>Saving updates the shared client page.</span>{state.error && <p className="manager-form-error" role="alert">{state.error}</p>}</div><button className="manager-primary" type="submit" disabled={pending || storage === "unconfigured"}>{pending ? "Saving…" : project ? "Save changes" : "Create project"}</button></div>
    </form>
  </>;
}
