import { DateTime } from "luxon";

export const INVITATION_ZONE = "Asia/Jakarta";
export const INVITATION_LOCALE = "id";

function isInt(value: unknown): value is number {
  return Number.isInteger(value);
}

function normalizeString(input: string): string {
  return (input || "").trim().replace(/,/g, " ").replace(/\s+/g, " ").trim();
}

function hasIsoOffsetOrZ(input: string): boolean {
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(input);
}

function parseIndonesianDateString(input: string): DateTime | null {
  const cleaned = normalizeString(input);
  if (!cleaned) return null;

  const formats = ["d LLLL yyyy", "cccc d LLLL yyyy"];
  for (const fmt of formats) {
    const dt = DateTime.fromFormat(cleaned, fmt, {
      locale: INVITATION_LOCALE,
      zone: INVITATION_ZONE,
    });
    if (dt.isValid) return dt;
  }

  return null;
}

function parseLegacyObject(value: unknown): DateTime | null {
  if (!value || typeof value !== "object") return null;

  const v = value as {
    date?: { year?: unknown; month?: unknown; day?: unknown };
    time?: { hour?: unknown; minute?: unknown };
    year?: unknown;
    month?: unknown;
    day?: unknown;
    hour?: unknown;
    minute?: unknown;
  };

  const nestedDate = v.date;
  const year = isInt(nestedDate?.year) ? nestedDate.year : isInt(v.year) ? v.year : null;
  const month = isInt(nestedDate?.month) ? nestedDate.month : isInt(v.month) ? v.month : null;
  const day = isInt(nestedDate?.day) ? nestedDate.day : isInt(v.day) ? v.day : null;
  if (!year || !month || !day) return null;

  const nestedTime = v.time;
  const hour = isInt(nestedTime?.hour) ? nestedTime.hour : isInt(v.hour) ? v.hour : 0;
  const minute = isInt(nestedTime?.minute)
    ? nestedTime.minute
    : isInt(v.minute)
      ? v.minute
      : 0;

  const dt = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour,
      minute,
      second: 0,
      millisecond: 0,
    },
    { zone: INVITATION_ZONE },
  );

  return dt.isValid ? dt : null;
}

function parseFromTimestampLike(value: unknown): DateTime | null {
  if (!value || typeof value !== "object") return null;

  const maybe = value as { toDate?: unknown; toMillis?: unknown };
  if (typeof maybe.toDate === "function") {
    const d = (maybe.toDate as () => Date)();
    const dt = DateTime.fromJSDate(d);
    return dt.isValid ? dt : null;
  }

  if (typeof maybe.toMillis === "function") {
    const ms = (maybe.toMillis as () => number)();
    const dt = DateTime.fromMillis(ms);
    return dt.isValid ? dt : null;
  }

  return null;
}

export function parseInvitationDateTime(value: unknown): DateTime | null {
  if (!value) return null;

  if (DateTime.isDateTime(value)) return value as DateTime;

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return null;

    const fromIso = hasIsoOffsetOrZ(raw)
      ? DateTime.fromISO(raw, { setZone: true }).setZone(INVITATION_ZONE)
      : DateTime.fromISO(raw, { zone: INVITATION_ZONE });

    if (fromIso.isValid) return fromIso;

    const ind = parseIndonesianDateString(raw);
    if (ind) return ind;

    return null;
  }

  if (value instanceof Date) {
    const dt = DateTime.fromJSDate(value);
    return dt.isValid ? dt : null;
  }

  if (typeof value === "number") {
    const dt = DateTime.fromMillis(value);
    return dt.isValid ? dt : null;
  }

  const fromTs = parseFromTimestampLike(value);
  if (fromTs) return fromTs;

  return parseLegacyObject(value);
}

export function toInvitationIso(value: unknown): string | null {
  const dt = parseInvitationDateTime(value);
  if (!dt) return null;

  const normalized = dt.setZone(INVITATION_ZONE).set({ second: 0, millisecond: 0 });
  return normalized.toISO({ includeOffset: true, suppressMilliseconds: true });
}

export type InvitationPrimaryDateInfo = {
  display: string;
  displayShort: string;
  countdownTarget: string;
  rsvpDeadline: string;
};

export function deriveInvitationPrimaryDateInfo(value: unknown): InvitationPrimaryDateInfo | null {
  const dt = parseInvitationDateTime(value);
  if (!dt) return null;

  const day = dt.setZone(INVITATION_ZONE).startOf("day").set({ second: 0, millisecond: 0 });
  const countdownTarget = day.toISO({ includeOffset: true, suppressMilliseconds: true });
  if (!countdownTarget) return null;

  const display = day.setLocale(INVITATION_LOCALE).toFormat("d LLLL yyyy");
  const displayShort = day.setLocale(INVITATION_LOCALE).toFormat("dd . MM . yyyy");

  return {
    display,
    displayShort,
    countdownTarget,
    rsvpDeadline: display,
  };
}

export function formatInvitationDateLong(value: unknown): string {
  const dt = parseInvitationDateTime(value);
  if (!dt) return typeof value === "string" ? value : "";

  return dt
    .setZone(INVITATION_ZONE)
    .setLocale(INVITATION_LOCALE)
    .toFormat("cccc d LLLL yyyy");
}

export function formatInvitationMonthYear(value: unknown): string {
  const dt = parseInvitationDateTime(value);
  if (!dt) return typeof value === "string" ? value : "";

  return dt
    .setZone(INVITATION_ZONE)
    .setLocale(INVITATION_LOCALE)
    .toFormat("LLLL yyyy");
}

export function formatInvitationTime(value: unknown): string {
  if (value && typeof value === "object") {
    const maybeTime = value as { hour?: unknown; minute?: unknown };
    if (isInt(maybeTime.hour) && isInt(maybeTime.minute)) {
      const dt = DateTime.fromObject(
        {
          year: 2000,
          month: 1,
          day: 1,
          hour: maybeTime.hour,
          minute: maybeTime.minute,
          second: 0,
          millisecond: 0,
        },
        { zone: INVITATION_ZONE },
      );
      return dt.isValid ? dt.toFormat("HH:mm") : "00:00";
    }
  }

  const dt = parseInvitationDateTime(value);
  if (!dt) return "00:00";

  return dt.setZone(INVITATION_ZONE).toFormat("HH:mm");
}

export function toJsDate(value: unknown): Date {
  const dt = parseInvitationDateTime(value);
  if (!dt) return DateTime.fromMillis(0).toJSDate();
  return dt.toJSDate();
}

export function formatRelativeToNow(value: unknown, locale = INVITATION_LOCALE): string {
  const dt = parseInvitationDateTime(value);
  if (!dt) return "";

  return (
    dt
      .setLocale(locale)
      .toRelative({ base: DateTime.now() }) ?? ""
  );
}

export function getCountdownParts(target: unknown): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const dt = parseInvitationDateTime(target);
  if (!dt) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const diff = dt.diff(DateTime.now(), ["days", "hours", "minutes", "seconds"]);
  if (!diff.isValid) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = Math.floor(diff.as("seconds"));
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return { days, hours, minutes, seconds };
}
