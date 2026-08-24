import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import {
  FALLBACK_DURATION_MINUTES,
  buildCalendarEvent,
  eventIdFor,
  resolveDurationMinutes,
  validateSlot,
} from "./calendar-event";

/** 2026-09-01 13:00 WITA, comfortably inside 11:00–20:00. */
const SLOT = DateTime.fromISO("2026-09-01T13:00:00", { zone: "Asia/Makassar" }).toMillis();
const NOW = DateTime.fromISO("2026-08-24T09:00:00", { zone: "Asia/Makassar" }).toMillis();
const HOURS = { openMinutes: 11 * 60, closeMinutes: 20 * 60 };

describe("resolveDurationMinutes", () => {
  it("keeps a real duration and falls back for 0/missing/garbage", () => {
    expect(resolveDurationMinutes(45)).toBe(45);
    expect(resolveDurationMinutes(0)).toBe(FALLBACK_DURATION_MINUTES);
    expect(resolveDurationMinutes(undefined)).toBe(FALLBACK_DURATION_MINUTES);
    expect(resolveDurationMinutes("x")).toBe(FALLBACK_DURATION_MINUTES);
  });
});

describe("eventIdFor", () => {
  it("is stable across phone formatting so a re-confirm upserts", () => {
    expect(eventIdFor(SLOT, "0895-0316-2551")).toBe(eventIdFor(SLOT, "+62 895 0316 2551"));
  });

  it("differs by slot, and is inside Google's event-id alphabet", () => {
    const id = eventIdFor(SLOT, "089503162551");
    expect(id).not.toBe(eventIdFor(SLOT + 60_000, "089503162551"));
    expect(id).toMatch(/^[a-v0-9]{5,1024}$/);
  });
});

describe("validateSlot", () => {
  const base = { startMs: SLOT, durationMinutes: 60, ...HOURS, nowMs: NOW };

  it("accepts a slot inside opening hours", () => {
    expect(validateSlot(base)).toBeNull();
  });

  it("rejects past, far-future, and out-of-hours slots", () => {
    expect(validateSlot({ ...base, startMs: NOW - 60 * 60 * 1000 })).toBe("past");
    expect(validateSlot({ ...base, startMs: NOW + 200 * 24 * 60 * 60 * 1000 })).toBe("too-far");
    const beforeOpen = DateTime.fromISO("2026-09-01T09:00:00", { zone: "Asia/Makassar" }).toMillis();
    expect(validateSlot({ ...base, startMs: beforeOpen })).toBe("closed");
  });

  it("rejects a session that would run past closing", () => {
    const late = DateTime.fromISO("2026-09-01T19:30:00", { zone: "Asia/Makassar" }).toMillis();
    expect(validateSlot({ ...base, startMs: late, durationMinutes: 60 })).toBe("closed");
  });

  it("judges hours in studio time, not the caller's zone", () => {
    // 13:00 WITA is 05:00 UTC — a UTC-based check would call this "closed".
    expect(new Date(SLOT).getUTCHours()).toBe(5);
    expect(validateSlot(base)).toBeNull();
  });
});

describe("buildCalendarEvent", () => {
  const input = {
    startMs: SLOT,
    durationMinutes: 45,
    name: "Rani",
    phone: "089503162551",
    packageName: "Paket Duo",
    packageCapacity: 2,
    backgroundName: "Peach",
  };

  it("marks an unconfirmed request and stamps studio time", () => {
    const event = buildCalendarEvent({ ...input, confirmed: false });
    expect(event.summary).toBe("[BELUM DIKONFIRMASI] Rani — Paket Duo");
    expect(event.status).toBe("tentative");
    expect(event.start.dateTime).toBe("2026-09-01T13:00:00+08:00");
    expect(event.end.dateTime).toBe("2026-09-01T13:45:00+08:00");
    expect(event.start.timeZone).toBe("Asia/Makassar");
    expect(event).not.toHaveProperty("attendees");
  });

  it("promotes the same slot to a confirmed event under the same id", () => {
    const tentative = buildCalendarEvent({ ...input, confirmed: false });
    const confirmed = buildCalendarEvent({ ...input, confirmed: true });
    expect(confirmed.id).toBe(tentative.id);
    expect(confirmed.summary).toBe("Rani — Paket Duo");
    expect(confirmed.status).toBe("confirmed");
  });
});
