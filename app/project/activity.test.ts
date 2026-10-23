import { describe, expect, it } from "vitest";
import { projectActivity } from "./activity";
import { projectCalendarEntries } from "./calendar";
import { distributorProject } from "./data";
import { projectToday } from "./format";

describe("project activity rollover", () => {
  it("moves dates only after their scheduled day ends in Makassar, preserving calendar identity and source data", () => {
    const project = { ...distributorProject, history: [{ ...distributorProject.history![0], id: "shared-id", date: "2026-10-20" }], importantDates: [
      { id: "shared-id", title: "Client review", date: "2026-10-23", note: "Review the pilot." },
      { id: "future", title: "Training", date: "2026-10-25", note: "" },
    ] };
    const source = structuredClone(project);
    const before = projectToday(new Date("2026-10-23T15:59:59Z"));
    const after = projectToday(new Date("2026-10-23T16:00:00Z"));
    expect(before).toBe("2026-10-23");
    expect(after).toBe("2026-10-24");
    expect(projectActivity(project, before).importantDates).toHaveLength(2);
    const rolled = projectActivity(project, after);
    expect(rolled.importantDates.map((entry) => entry.id)).toEqual(["future"]);
    expect(rolled.history.map((entry) => entry.id)).toEqual(["date:shared-id", "history:shared-id"]);
    expect(rolled.history[0]).toMatchObject({ title: "Client review", type: "Important date", summary: "Review the pilot.", date: "2026-10-23" });
    const event = (day: string) => projectCalendarEntries(project, day).find((entry) => entry.key === "date:shared-id")!;
    expect(event(before).kind).toBe("important");
    expect(event(after)).toEqual({ ...event(before), kind: "activity" });
    expect(projectCalendarEntries(project).filter((entry) => entry.key === "date:shared-id")).toHaveLength(1);
    expect(project).toEqual(source);
    expect(projectActivity(project, after)).toEqual(rolled);
    expect(projectActivity({ ...project, importantDates: [{ ...project.importantDates[0], date: "2026-11-01" }] }, after).history).toHaveLength(1);
  });
  it("keeps the complete history newest first, including entries older than the five-item preview", () => {
    const project = { ...distributorProject, importantDates: [], history: Array.from({ length: 8 }, (_, index) => ({ ...distributorProject.history![0], id: String(index), date: `2026-10-${String(index + 1).padStart(2, "0")}` })) };
    expect(projectActivity(project, "2026-10-23").history.map((entry) => entry.id)).toEqual(["history:7", "history:6", "history:5", "history:4", "history:3", "history:2", "history:1", "history:0"]);
    expect(projectCalendarEntries(project).filter((entry) => entry.kind === "activity")).toHaveLength(8);
    expect(projectActivity({ ...project, history: undefined, importantDates: undefined }, "2026-10-23")).toEqual({ history: [], importantDates: [] });
  });
});
