import { describe, expect, it } from "vitest";
import { calendarEntriesOnDate, calendarMonth, googleCalendarUrl, nextDate, projectCalendarEntries, shiftMonth } from "./calendar";
import { distributorProject } from "./data";

describe("project calendar", () => {
  it("uses the supplied Google subscription link format for clients", () => {
    expect(googleCalendarUrl("a7ae519a8d1fba2ac76de778ce0d04d2cd72dd8bdbea435d8c853c1db0d17c00@group.calendar.google.com")).toBe("https://calendar.google.com/calendar/u/0?cid=YTdhZTUxOWE4ZDFmYmEyYWM3NmRlNzc4Y2UwZDA0ZDJjZDcyZGQ4YmRiZWE0MzVkOGM4NTNjMWRiMGQxN2MwMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t");
  });
  it("includes overlapping phases throughout their inclusive spans alongside dates and history", () => {
    const project = { ...distributorProject, milestones: [
      { ...distributorProject.milestones[0], name: "Foundation", start: "2026-10-17", date: "2026-12-12" },
      { ...distributorProject.milestones[1], name: "Field app", start: "2026-10-17", date: "2027-01-09" },
    ] };
    const entries = projectCalendarEntries(project);
    expect(calendarEntriesOnDate(entries, "2026-10-17").filter((e) => e.kind === "phase")).toHaveLength(2);
    expect(calendarEntriesOnDate(entries, "2026-10-19").map((e) => e.label)).toEqual(["Meeting", "Phase", "Phase"]);
    expect(calendarEntriesOnDate(entries, "2026-10-22").map((e) => e.kind)).toEqual(["important", "phase", "phase"]);
    expect(calendarEntriesOnDate(entries, "2026-12-12").filter((e) => e.kind === "phase")).toHaveLength(2);
    expect(calendarEntriesOnDate(entries, "2026-12-13").filter((e) => e.kind === "phase")).toHaveLength(1);
    expect(calendarEntriesOnDate(entries, "2027-01-09").filter((e) => e.kind === "phase")).toHaveLength(1);
    expect(calendarEntriesOnDate(entries, "2027-01-10")).toEqual([]);
  });
  it("handles Monday-first months, leap days, year rollover, and phase spans", () => {
    expect(calendarMonth("2026-10")).toMatchObject({ offset: 3, days: 31 });
    expect(calendarMonth("2024-02").days).toBe(29);
    expect(nextDate("2024-02-29")).toBe("2024-03-01");
    expect(nextDate("2026-12-31")).toBe("2027-01-01");
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
    const entries = projectCalendarEntries(distributorProject);
    expect(entries).toHaveLength(12);
    expect(entries.find((entry) => entry.key === "phase:Development")).toMatchObject({ start: "2026-09-28", end: "2026-10-30" });
    expect(entries.find((entry) => entry.key === "date:approval-rules-review")).toMatchObject({ start: "2026-10-22", end: "2026-10-22" });
    expect(entries.find((entry) => entry.key === "activity:sprint-review")).toMatchObject({ kind: "activity", label: "Meeting", start: "2026-10-19", end: "2026-10-19", note: expect.stringContaining("Online · Client leads and ACTIVID") });
  });
});
