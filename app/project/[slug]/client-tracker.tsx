"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Asterisk, Check, ChevronDown, Circle, CircleDot, PencilLine } from "lucide-react";
import { formatDate, progress, projectToday } from "../format";
import { projectActivity } from "../activity";
import { Status } from "../project-ui";
import type { Project, ProjectUpdate } from "../types";
import "./client-tracker.css";
import ProjectCalendar from "./project-calendar";
import ProjectHistory from "./project-history";

export default function ClientTracker({ project, updates, today, canEdit }: { project: Project; updates: ProjectUpdate[]; today: string; canEdit: boolean }) {
  const [currentDay, setCurrentDay] = useState(today);
  useEffect(() => {
    const refreshDay = () => setCurrentDay(projectToday());
    const timer = window.setInterval(refreshDay, 60000);
    window.addEventListener("focus", refreshDay);
    document.addEventListener("visibilitychange", refreshDay);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refreshDay); document.removeEventListener("visibilitychange", refreshDay); };
  }, []);
  const software = project.software;
  const completion = progress(project);
  const current = project.milestones.find((milestone) => milestone.state === "current");
  const update = updates[0];
  const { importantDates, history } = projectActivity(project, currentDay);

  return <div className="process-tracker">
    <a className="projects-skip" href="#client-project">Skip to project</a>
    <header className="projects-header">
      <div className="projects-nav process-nav">
        <Link className="activid-wordmark" href="/" aria-label="ACTIVID home">activid<Asterisk className="brand-asterisk" strokeWidth={3.5} aria-hidden="true" /></Link>
        <span className="workspace-divider" />
        <span className="workspace-name">{project.client}</span>
      </div>
    </header>

    <main id="client-project" className="process-main overflow-x-clip w-full max-w-full">
      <div className="process-title">
        <h1>{project.name}</h1>
        <div className="process-title-actions"><Status status={project.status} />{canEdit && <Link className="process-edit-link" href={`/project/manage/${project.id}`}><PencilLine size={14} aria-hidden="true" />Edit project</Link>}</div>
      </div>

      <section className="process-progress" aria-labelledby="progress-title">
        <div className="process-progress-summary">
        <div className="process-progress-heading"><div><span>Current phase</span><h2 id="progress-title">{current?.name ?? (project.status === "Completed" ? "Completed" : "Awaiting next phase")}</h2></div><strong>{completion}<span>%</span></strong></div>
        <p>{project.focus || software?.sprint.goal || project.summary}</p>
        <div className="project-progress" role="progressbar" aria-label="Overall development progress" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${completion}%` }} /></div>
        <div className="process-dates"><div><span>Next checkpoint</span><strong>{current ? formatDate(current.date) : "Complete"}</strong></div><div><span>Target handover</span><strong>{formatDate(project.due)}</strong></div></div>
        </div>
        <ProjectCalendar project={project} today={currentDay} />
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
              <summary><span><strong>{milestone.name}</strong><small>{milestone.state === "done" ? "Completed" : milestone.state === "current" ? "Current phase" : "Upcoming"}</small></span><span className="process-milestone-range">{milestone.start && milestone.start !== milestone.date && <><time dateTime={milestone.start}>{formatDate(milestone.start)}</time><span aria-hidden="true"> – </span></>}<time dateTime={milestone.date}>{formatDate(milestone.date)}</time></span><ChevronDown size={14} /></summary>
              <p>{milestone.description}</p>
            </details>
          </li>)}
        </ol>
        <p className="process-timeline-note">{software ? "Launch and handover dates depend on your team’s testing and final sign-off." : "Your project lead will confirm delivery after the current phase is approved."}</p>
      </section>

      <ProjectHistory entries={history} />

      {update && <section className="process-update" aria-labelledby="latest-update-title">
        <div className="process-section-heading"><h2 id="latest-update-title">Latest update</h2><time dateTime={update.date}>{formatDate(update.date)}</time></div>
        <h3>{update.title}</h3><p>{update.text}</p><span className="process-update-author">{update.author} · ACTIVID</span>
      </section>}

      <footer className="process-contact"><span>Project lead · {project.owner}</span></footer>
    </main>

  </div>;
}
