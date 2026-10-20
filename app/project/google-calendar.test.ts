import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { distributorProject } from "./data";
import { syncProjectCalendar } from "./google-calendar";
import type { InternalProject } from "./types";

vi.mock("google-auth-library", () => ({ JWT: class { getAccessToken = async () => ({ token: "test-token" }); } }));
type Event = { id: string; summary?: string; start?: { date: string }; end?: { date: string }; extendedProperties?: { private?: Record<string, string> } };
let calendars: Record<string, Event[]>;
let requests: { calendar: string; method: string }[];
const calendar = "dms@group.calendar.google.com";
const other = "second@group.calendar.google.com";
beforeEach(() => {
  vi.stubEnv("GOOGLE_CALENDAR_CLIENT_EMAIL", "calendar@example.iam.gserviceaccount.com");
  vi.stubEnv("GOOGLE_CALENDAR_PRIVATE_KEY", "test-key");
  calendars = { [calendar]: [{ id: "untouched", summary: "Other event" }, { id: "another-project", extendedProperties: { private: { actividProject: "another-project", actividKey: "date:1" } } }], [other]: [] };
  requests = [];
  vi.stubGlobal("fetch", vi.fn(async (input: string, init: RequestInit) => {
    const url = new URL(input);
    const [, calendarId, eventId] = url.pathname.match(/calendars\/([^/]+)\/events(?:\/([^/]+))?/) ?? [];
    const id = decodeURIComponent(calendarId), method = init.method ?? "GET";
    requests.push({ calendar: id, method });
    const events = calendars[id];
    if (method === "GET") return Response.json({ items: events });
    if (method === "DELETE") { calendars[id] = events.filter((event) => event.id !== eventId); return new Response(null, { status: 204 }); }
    const body = JSON.parse(init.body as string);
    if (method === "PATCH") Object.assign(events.find((event) => event.id === eventId)!, body);
    else events.push({ ...body, id: crypto.randomUUID() });
    return Response.json(body);
  }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("Google project calendar reconciliation", () => {
  it("creates date ranges, updates without duplicates, removes only project events, and cleans a previous calendar", async () => {
    let project: InternalProject = { ...distributorProject, calendarId: calendar };
    project.calendarSync = await syncProjectCalendar(project);
    expect(project.calendarSync.error).toBeUndefined();
    expect(calendars[calendar]).toHaveLength(11);
    const development = calendars[calendar].find((event) => event.summary === "Development")!;
    expect(development.start?.date).toBe("2026-09-28");
    expect(development.end?.date).toBe("2026-10-31");
    project = { ...project, importantDates: [{ ...project.importantDates![0], title: "Revised review", date: "2026-10-23" }] };
    project.calendarSync = await syncProjectCalendar(project);
    expect(calendars[calendar]).toHaveLength(9);
    expect(calendars[calendar].find((event) => event.summary === "Development")?.id).toBe(development.id);
    expect(calendars[calendar].find((event) => event.summary === "Revised review")?.end?.date).toBe("2026-10-24");
    expect(JSON.stringify(calendars)).not.toContain(project.internalNotes);
    project = { ...project, calendarId: other };
    const checkpoint = vi.fn(async () => {});
    project.calendarSync = await syncProjectCalendar(project, checkpoint);
    expect(checkpoint).toHaveBeenCalledWith(other);
    expect(calendars[calendar].map((event) => event.id)).toEqual(["untouched", "another-project"]);
    expect(calendars[other]).toHaveLength(7);
    project.calendarId = "";
    project.calendarSync = await syncProjectCalendar(project);
    expect(calendars[other]).toHaveLength(0);
    expect(project.calendarSync.calendarId).toBe("");
    expect(requests.every((request) => [calendar, other].includes(request.calendar))).toBe(true);
  });

  it("reports permission failures safely and retries the partially connected calendar", async () => {
    const fetcher = globalThis.fetch;
    vi.stubGlobal("fetch", vi.fn(async () => new Response("private Google error", { status: 403 })));
    const project = { ...distributorProject, calendarId: calendar };
    const failed = await syncProjectCalendar(project);
    expect(failed).toMatchObject({ calendarId: calendar, error: expect.stringContaining("access failed") });
    expect(JSON.stringify(failed)).not.toContain("private Google error");
    vi.stubGlobal("fetch", fetcher);
    const retry = await syncProjectCalendar({ ...project, calendarSync: failed });
    expect(retry.error).toBeUndefined();
    expect(retry.syncedAt).toBeTruthy();
  });

  it("explains when the calendar is readable but not writable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: { errors: [{ reason: "requiredAccessLevel" }], message: "You need to have writer access to this calendar." } }, { status: 403 })));
    const result = await syncProjectCalendar({ ...distributorProject, calendarId: calendar });
    expect(result.error).toContain("read-only access");
    expect(result.error).toContain("Make changes to events");
  });
});
