"use client";

import { useRef } from "react";
import { ArrowUpRight, CalendarDays, MapPin, MessageSquare, PencilLine, X } from "lucide-react";
import type { ProjectActivity } from "../activity";
import { formatDate } from "../format";

function ActivityRows({ entries }: { entries: ProjectActivity[] }) {
  return <ol>{entries.map((entry) => <li className="process-history-entry" key={entry.id}>
    <div className="process-section-heading"><span className="process-history-type">{entry.type === "Meeting" ? <MessageSquare size={14} /> : entry.type === "Visit" ? <MapPin size={14} /> : entry.type === "Important date" ? <CalendarDays size={14} /> : <PencilLine size={14} />}{entry.type}</span><time dateTime={entry.date}>{formatDate(entry.date, true)}</time></div>
    <h3>{entry.title}</h3>{entry.summary && <p>{entry.summary}</p>}{entry.context && <span className="process-history-context">{entry.context}</span>}
  </li>)}</ol>;
}

export default function ProjectHistory({ entries }: { entries: ProjectActivity[] }) {
  const drawer = useRef<HTMLDialogElement>(null);
  if (!entries.length) return null;
  return <section className="process-history" aria-labelledby="history-title">
    <div className="process-section-heading"><h2 id="history-title">Activity history</h2>{entries.length > 5 && <button type="button" className="history-view-all" aria-haspopup="dialog" onClick={() => drawer.current?.showModal()}>View all activity <ArrowUpRight size={15} aria-hidden="true" /></button>}</div>
    <p className="process-history-intro">{entries.length > 5 ? `Latest 5 of ${entries.length} activities.` : "Meetings, visits, changes, and past important dates."}</p>
    <ActivityRows entries={entries.slice(0, 5)} />
    {entries.length > 5 && <dialog className="project-history-drawer" ref={drawer} aria-labelledby="history-drawer-title" onClick={(event) => { if (event.target === event.currentTarget) drawer.current?.close(); }}>
      <div className="history-drawer-sheet">
        <header className="history-drawer-heading"><div><h2 id="history-drawer-title">Complete activity history</h2><p>{entries.length} activities · Newest first</p></div><button type="button" aria-label="Close activity history" autoFocus onClick={() => drawer.current?.close()}><X size={21} aria-hidden="true" /></button></header>
        <div className="history-drawer-body"><ActivityRows entries={entries} /></div>
      </div>
    </dialog>}
  </section>;
}
