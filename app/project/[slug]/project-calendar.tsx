"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarMonth, googleCalendarUrl, projectCalendarEntries, shiftMonth } from "../calendar";
import { formatDate } from "../format";
import type { Project } from "../types";

export default function ProjectCalendar({ project, today }: { project: Project; today: string }) {
  const entries = projectCalendarEntries(project);
  const initial = entries.find((entry) => entry.end >= today)?.end ?? today;
  const [month, setMonth] = useState(initial.slice(0, 7));
  const [selected, setSelected] = useState(initial);
  const { label, offset, days } = calendarMonth(month);
  const selectedEntries = entries.filter((entry) => entry.end === selected);
  function navigate(amount: number) {
    const next = shiftMonth(month, amount);
    setMonth(next);
    setSelected(entries.find((entry) => entry.end.startsWith(next))?.end ?? "");
  }

  return <div className="project-calendar" role="group" aria-label="Project calendar">
    <div className="project-calendar-heading"><h3>Project calendar</h3><div><button type="button" onClick={() => navigate(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><span aria-live="polite">{label}</span><button type="button" onClick={() => navigate(1)} aria-label="Next month"><ChevronRight size={18} /></button></div></div>
    <div className="project-calendar-grid" aria-label={label}>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span className="project-calendar-weekday" key={day} aria-hidden="true">{day.slice(0, 1)}</span>)}
      {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
      {Array.from({ length: days }, (_, i) => {
        const date = `${month}-${String(i + 1).padStart(2, "0")}`;
        const events = entries.filter((entry) => entry.end === date);
        return events.length ? <button type="button" key={date} aria-label={`${formatDate(date, true)}: ${events.map((entry) => entry.title).join(", ")}`} aria-pressed={date === selected} aria-current={date === today ? "date" : undefined} onClick={() => setSelected(date)}>{i + 1}<span className="project-calendar-dot" /></button> : <span className="project-calendar-day" key={date} aria-current={date === today ? "date" : undefined}>{i + 1}</span>;
      })}
    </div>
    <div className="project-calendar-agenda" aria-live="polite">
      {selectedEntries.length ? <><time dateTime={selected}>{formatDate(selected, true)}</time>{selectedEntries.map((entry) => <div key={entry.key}><strong>{entry.title}</strong>{entry.start !== entry.end && <span>{formatDate(entry.start)} – {formatDate(entry.end)}</span>}{entry.note && <p>{entry.note}</p>}</div>)}</> : <p>No important dates or checkpoints this month.</p>}
    </div>
    {project.calendarId && <div className="project-calendar-subscribe"><a className="project-calendar-link" href={googleCalendarUrl(project.calendarId)} target="_blank" rel="noreferrer">Add to Google Calendar<ArrowUpRight size={14} /></a><p>View project dates alongside your own calendar. Schedule managed by ACTIVID.</p></div>}
  </div>;
}
