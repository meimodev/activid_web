"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarEntriesOnDate, calendarMonth, googleCalendarUrl, projectCalendarEntries, shiftMonth } from "../calendar";
import { formatDate } from "../format";
import type { Project } from "../types";

export default function ProjectCalendar({ project, today }: { project: Project; today: string }) {
  const entries = projectCalendarEntries(project);
  const initial = calendarEntriesOnDate(entries, today).length ? today : entries.map((entry) => entry.start).filter((date) => date >= today).sort()[0] ?? entries.at(-1)?.end ?? today;
  const [month, setMonth] = useState(initial.slice(0, 7));
  const [selected, setSelected] = useState(initial);
  const { label, offset, days } = calendarMonth(month);
  const selectedEntries = calendarEntriesOnDate(entries, selected);
  const selectedPhases = selectedEntries.filter((entry) => entry.kind === "phase").length;
  function navigate(amount: number) {
    const next = shiftMonth(month, amount);
    setMonth(next);
    setSelected(`${next}-01`);
  }

  return <div className="project-calendar" role="group" aria-label="Project calendar">
    <div className="project-calendar-heading"><h3>Project calendar</h3><div><button type="button" onClick={() => navigate(-1)} aria-label="Previous month"><ChevronLeft size={18} /></button><span aria-live="polite">{label}</span><button type="button" onClick={() => navigate(1)} aria-label="Next month"><ChevronRight size={18} /></button></div></div>
    <div className="project-calendar-legend"><span><i className="calendar-phase-marker" />Phases (count)</span><span><i className="calendar-important-marker" />Important dates</span><span><i className="calendar-activity-marker" />Activity</span></div>
    <div className="project-calendar-grid" aria-label={label}>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span className="project-calendar-weekday" key={day} aria-hidden="true">{day.slice(0, 2)}</span>)}
      {Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}
      {Array.from({ length: days }, (_, i) => {
        const date = `${month}-${String(i + 1).padStart(2, "0")}`;
        const events = calendarEntriesOnDate(entries, date);
        const phases = events.filter((entry) => entry.kind === "phase").length;
        return <button type="button" key={date} className={phases ? "has-phases" : ""} aria-label={`${formatDate(date, true)}: ${events.length ? events.map((entry) => entry.title).join(", ") : "No events"}`} aria-pressed={date === selected} aria-current={date === today ? "date" : undefined} onClick={() => setSelected(date)}><span>{i + 1}</span><span className="project-calendar-markers" aria-hidden="true">{phases > 0 && <span className="calendar-phase-count">{phases}</span>}{events.some((entry) => entry.kind === "important") && <i className="calendar-important-marker" />}{events.some((entry) => entry.kind === "activity") && <i className="calendar-activity-marker" />}</span></button>;
      })}
    </div>
    <div className="project-calendar-agenda" aria-live="polite">
      <div className="project-calendar-selection"><time dateTime={selected}>{formatDate(selected, true)}</time>{selectedPhases > 1 && <span>{selectedPhases} overlapping phases</span>}</div>
      {selectedEntries.length ? selectedEntries.map((entry, index) => <details className={`calendar-entry calendar-entry-${entry.kind}`} key={`${selected}:${entry.key}`} open={entry.kind !== "phase" && index === 0}>
        <summary><span><small>{entry.label}</small><strong>{entry.title}</strong>{entry.start !== entry.end && <span className="calendar-entry-range">{formatDate(entry.start, true)} – {formatDate(entry.end, true)}</span>}</span><ChevronDown size={13} aria-hidden="true" /></summary>
        {entry.note && <p>{entry.note}</p>}
      </details>) : <p>No project events on this date.</p>}
    </div>
    {project.calendarId && <div className="project-calendar-subscribe"><a className="project-calendar-link" href={googleCalendarUrl(project.calendarId)} target="_blank" rel="noreferrer">Add to Google Calendar<ArrowUpRight size={14} /></a><p>View project dates alongside your own calendar. Schedule managed by ACTIVID.</p></div>}
  </div>;
}
