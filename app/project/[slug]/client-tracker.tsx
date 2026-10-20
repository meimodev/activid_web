"use client";

import Link from "next/link";
import { ArrowUpRight, Asterisk, Check, ChevronDown, Circle, CircleDot, Mail, MapPin, MessageSquare, PencilLine } from "lucide-react";
import { formatDate, progress } from "../format";
import { Status } from "../project-ui";
import type { Project, ProjectUpdate } from "../types";
import "./client-tracker.css";

export default function ClientTracker({ project, updates, contactEmail }: { project: Project; updates: ProjectUpdate[]; contactEmail: string }) {
  const software = project.software;
  const completion = progress(project);
  const current = project.milestones.find((milestone) => milestone.state === "current");
  const update = updates[0];
  const importantDates = [...(project.importantDates ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const contact = `mailto:${contactEmail}?subject=${encodeURIComponent(`${project.client} — ${project.name}`)}`;

  return <div className="process-tracker">
    <a className="projects-skip" href="#client-project">Skip to project</a>
    <header className="projects-header">
      <div className="projects-nav process-nav">
        <Link className="activid-wordmark" href="/" aria-label="ACTIVID home">activid<Asterisk className="brand-asterisk" strokeWidth={3.5} aria-hidden="true" /></Link>
        <span className="workspace-divider" />
        <span className="workspace-name">{project.client}</span>
      </div>
    </header>

    <main id="client-project" className="process-main overflow-x-hidden w-full max-w-full">
      <div className="process-notice"><span>{project.sample ? "Sample project" : "Project tracker"}</span><span>Updated {formatDate(project.updated, true)}</span></div>
      <div className="process-title">
        <h1>{project.name}</h1>
        <Status status={project.status} />
      </div>

      <section className="process-progress" aria-labelledby="progress-title">
        <div className="process-progress-heading"><div><span>Current phase</span><h2 id="progress-title">{current?.name ?? (project.status === "Completed" ? "Completed" : "Awaiting next phase")}</h2></div><strong>{completion}<span>%</span></strong></div>
        <p>{project.focus || software?.sprint.goal || project.summary}</p>
        <div className="project-progress" role="progressbar" aria-label="Overall development progress" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${completion}%` }} /></div>
        <div className="process-dates"><div><span>Next checkpoint</span><strong>{current ? formatDate(current.date) : "Complete"}</strong></div><div><span>Target handover</span><strong>{formatDate(project.due)}</strong></div></div>
      </section>

      {importantDates.length > 0 && <section className="process-important-dates" aria-labelledby="important-dates-title">
        <h2 id="important-dates-title">Important dates</h2>
        <ol>{importantDates.map((entry) => <li key={entry.id}>
          <div><h3>{entry.title}</h3>{entry.note && <p>{entry.note}</p>}</div>
          <time dateTime={entry.date}>{formatDate(entry.date, true)}</time>
        </li>)}</ol>
      </section>}

      <section className="process-timeline" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Project timeline</h2>
        <ol>
          {project.milestones.map((milestone) => <li className={`process-milestone milestone-${milestone.state}`} key={milestone.name}>
            <span className="process-milestone-icon" aria-hidden="true">{milestone.state === "done" ? <Check size={16} /> : milestone.state === "current" ? <CircleDot size={16} /> : <Circle size={15} />}</span>
            <details open={milestone.state === "current"}>
              <summary><span><strong>{milestone.name}</strong><small>{milestone.state === "done" ? "Completed" : milestone.state === "current" ? "Current phase" : "Upcoming"}</small></span><time dateTime={milestone.date}>{formatDate(milestone.date)}</time><ChevronDown size={14} /></summary>
              <p>{milestone.description}</p>
            </details>
          </li>)}
        </ol>
        <p className="process-timeline-note">{software ? "Launch and handover dates depend on your team’s testing and final sign-off." : "Your project lead will confirm delivery after the current phase is approved."}</p>
      </section>

      {project.history && project.history.length > 0 && <section className="process-history" aria-labelledby="history-title">
        <h2 id="history-title">Activity history</h2>
        <p className="process-history-intro">Meetings, visits, and project changes.</p>
        <ol>
          {project.history.map((entry) => <li className="process-history-entry" key={entry.id}>
            <div className="process-section-heading"><span className="process-history-type">{entry.type === "Meeting" ? <MessageSquare size={14} /> : entry.type === "Visit" ? <MapPin size={14} /> : <PencilLine size={14} />}{entry.type}</span><time dateTime={entry.date}>{formatDate(entry.date, true)}</time></div>
            <h3>{entry.title}</h3><p>{entry.summary}</p><span className="process-history-context">{entry.context}</span>
          </li>)}
        </ol>
      </section>}

      {update && <section className="process-update" aria-labelledby="latest-update-title">
        <div className="process-section-heading"><h2 id="latest-update-title">Latest update</h2><time dateTime={update.date}>{formatDate(update.date)}</time></div>
        <h3>{update.title}</h3><p>{update.text}</p><span className="process-update-author">{update.author} · ACTIVID</span>
      </section>}

      <footer className="process-contact"><span>Project lead · {project.owner}</span><a href={contact}><Mail size={16} />Contact {project.owner}<ArrowUpRight size={15} /></a></footer>
    </main>

  </div>;
}
