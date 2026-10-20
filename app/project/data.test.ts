import { describe, expect, it } from "vitest";
import { distributorProject, getSharedProject, projects } from "./data";
import { progress, visibleProjects } from "./format";

describe("client project overview", () => {
  it("keeps search, status, and delivery ordering consistent with the dataset", () => {
    expect(visibleProjects(projects, "  PHOTOGRAPHY ", "In progress", "due").map((p) => p.id)).toEqual(["menu-photography"]);
    expect(visibleProjects(projects, "", "In progress", "due").map((p) => p.id)).toEqual(["menu-photography", "website", "distributor-management-system"]);
    expect(visibleProjects(projects, "Nadia", "Needs review", "updated").map((p) => p.id)).toEqual(["brand-identity"]);
    expect(visibleProjects(projects, "no matching project", "All projects", "updated")).toEqual([]);
    expect(visibleProjects(projects, "", "All projects", "updated")).toHaveLength(projects.length);
  });

  it("reconciles task progress, completion status, and milestone dates", () => {
    for (const project of projects) {
      expect(project.totalTasks).toBeGreaterThan(0);
      expect(progress(project)).toBeGreaterThanOrEqual(0);
      expect(progress(project)).toBeLessThanOrEqual(100);
      expect(progress(project) === 100).toBe(project.status === "Completed");
      const dates = project.milestones.map((m) => m.date);
      expect(dates).toEqual([...dates].sort());
      expect(dates.at(-1)).toBe(project.due);
    }
  });
});


describe("shared project payload", () => {
  it("shares only the selected project and excludes staff notes", () => {
    const shared = getSharedProject("distributor-management-system");
    expect(shared?.client).toBe("Nusantara Distribusi");
    expect(shared?.history).toEqual(distributorProject.history);
    expect(shared?.importantDates).toEqual(distributorProject.importantDates);
    expect(shared).not.toHaveProperty("internalNotes");
    expect(JSON.stringify(shared)).not.toContain(distributorProject.internalNotes);
    expect(JSON.stringify(shared)).not.toContain("Bakso Denny");
    expect(getSharedProject("does-not-exist")).toBeNull();
  });

  it("derives the software total from its modules and reconciles test results", () => {
    const software = distributorProject.software!;
    expect(software.modules.reduce((sum, m) => sum + m.complete, 0)).toBe(distributorProject.completedTasks);
    expect(software.modules.reduce((sum, m) => sum + m.total, 0)).toBe(distributorProject.totalTasks);
    expect(progress(distributorProject)).toBe(68);
    expect(software.checks.passed + software.checks.pending + software.checks.blocked).toBe(64);
  });
});
