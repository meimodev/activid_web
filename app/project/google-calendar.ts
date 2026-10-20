import "server-only";

import { JWT } from "google-auth-library";
import { nextDate, projectCalendarEntries } from "./calendar";
import type { CalendarSync, InternalProject } from "./types";

export function calendarServiceAccount() {
  return process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
}

type GoogleEvent = { id: string; summary?: string; description?: string; start?: { date?: string }; end?: { date?: string }; extendedProperties?: { private?: Record<string, string> } };

// Only events tagged for this project are reconciled; other calendar entries are untouched.
export async function syncProjectCalendar(project: InternalProject, checkpoint?: (calendarId: string) => Promise<void>): Promise<CalendarSync> {
  let remainingCalendar = project.calendarSync?.calendarId ?? "";
  let syncedAt = project.calendarSync?.syncedAt;
  if (!project.calendarId && !remainingCalendar) return { calendarId: "" };
  try {
    const email = calendarServiceAccount();
    const key = (process.env.GOOGLE_CALENDAR_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    if (!email || !key) throw new Error("Calendar credentials are missing. Configure the app service account before connecting a calendar.");
    const auth = new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/calendar.events"], transporterOptions: { timeout: 10000, retry: false } });
    const { token } = await auth.getAccessToken();
    if (!token) throw new Error("Could not sign in to Google Calendar. Check the service account credentials.");
    const signal = AbortSignal.timeout(45000);
    async function request(calendar: string, suffix: string, method = "GET", body?: unknown) {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar)}/events${suffix}`, {
        method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}), signal, cache: "no-store",
      });
      if (!response.ok) {
        if (method === "DELETE" && [404, 410].includes(response.status)) return;
        const failure = await response.json().catch(() => null);
        if (response.status === 403 && failure?.error?.errors?.some((error: { reason?: string }) => error.reason === "requiredAccessLevel")) throw new Error("Google Calendar gives the app read-only access. In the calendar’s sharing settings, give the app service account ‘Make changes to events’ permission, then save again.");
        if ([403, 404].includes(response.status)) throw new Error("Google Calendar access failed. Enable the Calendar API, check the calendar ID, and share the calendar with the app service account using ‘Make changes to events’.");
        throw new Error(`Google Calendar could not finish syncing (${response.status}). Save again to retry.`);
      }
      return response.status === 204 ? undefined : response.json();
    }
    async function list(calendar: string): Promise<GoogleEvent[]> {
      const events: GoogleEvent[] = [];
      let page = "";
      do {
        const query = new URLSearchParams({ privateExtendedProperty: `actividProject=${project.id}`, maxResults: "2500", showDeleted: "false", ...(page ? { pageToken: page } : {}) });
        const result = await request(calendar, `?${query}`);
        events.push(...(result.items ?? []).filter((event: GoogleEvent) => event.extendedProperties?.private?.actividProject === project.id));
        page = result.nextPageToken ?? "";
      } while (page);
      return events;
    }
    if (remainingCalendar && remainingCalendar !== project.calendarId) {
      for (const event of await list(remainingCalendar)) await request(remainingCalendar, `/${encodeURIComponent(event.id)}?sendUpdates=none`, "DELETE");
      remainingCalendar = "";
      syncedAt = undefined;
    }
    if (project.calendarId) {
      // Persist a calendar switch before writing, so an interrupted move is retryable.
      if (remainingCalendar !== project.calendarId) await checkpoint?.(project.calendarId);
      remainingCalendar = project.calendarId;
      const existing = await list(remainingCalendar);
      const retained = new Set<string>();
      for (const entry of projectCalendarEntries(project)) {
        const match = existing.find((event) => event.extendedProperties?.private?.actividKey === entry.key);
        const body = {
          summary: entry.title, description: `${project.name}\n${entry.label}\n${entry.note}`,
          start: { date: entry.start }, end: { date: nextDate(entry.end) },
          extendedProperties: { private: { actividProject: project.id, actividKey: entry.key } },
        };
        if (!match || match.summary !== body.summary || match.description !== body.description || match.start?.date !== entry.start || match.end?.date !== body.end.date) {
          await request(remainingCalendar, match ? `/${encodeURIComponent(match.id)}?sendUpdates=none` : "?sendUpdates=none", match ? "PATCH" : "POST", body);
        }
        if (match) retained.add(match.id);
      }
      for (const event of existing) if (!retained.has(event.id)) await request(remainingCalendar, `/${encodeURIComponent(event.id)}?sendUpdates=none`, "DELETE");
    }
    return { calendarId: remainingCalendar, syncedAt: new Date().toISOString() };
  } catch (error) {
    // Do not pass Google responses or credentials into logs or client props.
    const message = error instanceof Error && /^(Calendar credentials|Could not sign in|Google Calendar)/.test(error.message) ? error.message : "Google Calendar sync was interrupted. Your project is saved; save again to retry.";
    return { calendarId: remainingCalendar, ...(syncedAt ? { syncedAt } : {}), error: message };
  }
}
